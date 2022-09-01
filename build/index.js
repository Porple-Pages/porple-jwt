"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto_1 = require("crypto");
const util_1 = require("util");
const exception_1 = require("./types/exception");
const ErrorCode = {
    EXPIRED_OR_INVALID_TOKEN: 1003,
    UNKNOWN: 1000,
    EXPIRED_TOKEN: 1002,
    UNAUTHORIZED_TOKEN: 4000,
};
const ErrorMessage = {
    EXPIRED_TOKEN: "Expired token",
    UNAUTHORIZED: "Unauthorized",
    UNAUTHORIZED_TOKEN: "Unauthorized token",
    EXPIRED_OR_INVALID_TOKEN: "Expired or invalid token",
};
/**
 * Manages all jwt related issues
 * @param  {string} secret
 */
class JwtService {
    /**
     * @param  {string} secret
     */
    constructor(secret, iss, aud) {
        this.algorithm = "aes-256-ctr";
        this.iv = (0, crypto_1.randomBytes)(16);
        this.initialized = false;
        /**
         * verify that a jwt is valid
         * @param  {string} data
         * @return {object} the decoded data
         */
        this.decryptData = async (data) => {
            if (!this.initialized)
                await this.setkey();
            // console.debug("decrypting data");
            // console.debug(data);
            const [iv, content] = data.split(".");
            // const decrypted = this.cryptr.decrypt(data);
            // console.debug('IV', Buffer.from(iv, 'hex'));
            const decipher = (0, crypto_1.createDecipheriv)(this.algorithm, this.key || "", Buffer.from(iv, "hex"));
            const d = Buffer.concat([
                decipher.update(Buffer.from(content, "hex")),
                decipher.final(),
            ]);
            // console.debug(d.toString('utf8'));
            // const decrypted =
            // console.debug(decrypted);
            return JSON.parse(d.toString());
        };
        /**
         * @param  {Express.Request} req - a request object
         * @return {string} - the extracted token
         */
        this.getTokenFromHeaders = (req) => {
            const { headers: { authorization }, query,
            // params,
             } = req;
            if (authorization && authorization.split(" ")[0] === "Bearer") {
                // console.debug(authorization);
                return authorization.split(" ")[1];
            }
            if (query && query.token) {
                return query.token;
            }
            // if (params && params.token) {
            //   return params.token;
            // }
            return null;
        };
        assert.ok(secret, "Secret must be defined");
        this.secret = secret;
        // this.cryptr = new Cryptr(secret);
        this.iss = iss;
        this.aud = aud;
        this.setkey();
        // this.logger = new Logger("common:Jwt");
    }
    async setkey() {
        this.key = (await (0, util_1.promisify)(crypto_1.scrypt)(this.secret, "salt", 32));
        this.initialized = true;
    }
    /**
     * decode jwt error
     * @param  {object} error
     * @return {object} the structured error
     */
    static decodeError(error) {
        switch (error.name) {
            case "TokenExpiredError":
                return exception_1.Exception.fromErrorMessage(ErrorMessage.EXPIRED_TOKEN, ErrorCode.EXPIRED_TOKEN);
            case "JsonWebTokenError":
                return exception_1.Exception.fromErrorMessage(ErrorMessage.UNAUTHORIZED_TOKEN, ErrorCode.UNAUTHORIZED_TOKEN);
            default:
                return exception_1.Exception.fromErrorMessage("could not decode your token", ErrorCode.UNKNOWN);
        }
    }
    /**
     * generate a new JWT
     * @param  {object} data
     * @param  {string} expiresIn
     * @return {string}
     */
    async signToken(data, permissions, expiresIn = "12h") {
        const d = {
            permissions,
            email: data.email,
            id: data.id,
            type: data.accountType, // == UserType.ADMIN ? TokenType.ADMIN : TokenType.USER,
        };
        // encrypt the payload
        const encrypted = await this.encryptData(d);
        const { iss } = this;
        const { aud } = this;
        return (0, jsonwebtoken_1.sign)({ data: encrypted, iss, aud }, this.secret, {
            expiresIn,
            algorithm: "HS256",
        });
    }
    /**
     * encrypt data
     * @param  {string} data
     * @return {object} the decoded data
     */
    async encryptData(data) {
        // this.logger
        if (!this.initialized)
            await this.setkey();
        // Logger.debug(data)
        const cipher = (0, crypto_1.createCipheriv)(this.algorithm, this.key || "", this.iv);
        const encryptedText = Buffer.concat([
            cipher.update(JSON.stringify(data), "utf8"),
            cipher.final(),
        ]);
        // console.debug('IV', this.iv);
        // Logger.debug(encryptedText.toString('hex'))
        return `${this.iv.toString("hex")}.${encryptedText.toString("hex")}`;
    }
    /**
     * decode encrypted data
     * @param  {string} token
     * @return {object} the decoded token
     */
    async verifyToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, this.secret, {
                issuer: this.iss,
                audience: this.aud,
            });
            if (decoded.iss !== this.iss) {
                JwtService.decodeError(exception_1.Exception.fromErrorMessage(ErrorMessage.UNAUTHORIZED_TOKEN, ErrorCode.UNAUTHORIZED_TOKEN));
                return;
                // throw new UnauthorizedException();
            }
            // Logger.debug(decoded)
            const data = await this.decryptData(decoded.data);
            // console.error(data);
            data.iss = decoded.iss;
            data.iat = decoded.iat;
            data.exp = decoded.exp;
            // this.logger.info(decoded.iss);
            return data;
        }
        catch (err) {
            // console.error(err);
            JwtService.decodeError(err);
            return;
            // throw new UnauthorizedException(JwtService.decodeError(err));
        }
    }
}
exports.default = JwtService;
