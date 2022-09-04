import * as assert from "assert";
import { sign, verify } from "jsonwebtoken";
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { IAccessToken } from "./types/accessToken.entity";
import { Exception } from "./types/exception";
import { AuthUser } from "./types/auth-user";
import { Permission } from "./types/permissions.entity";

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
export default class JwtService {
  // logger: Logger = new Logger();
  secret: string;
  //   cryptr: any;
  iss: string;
  aud: string;
  algorithm = "aes-256-ctr";

  iv: Buffer = randomBytes(16);
  key?: Buffer;
  initialized = false;

  /**
   * @param  {string} secret
   */
  constructor(secret: string, iss: string, aud: string) {
    assert.ok(secret, "Secret must be defined");
    this.secret = secret;

    // this.cryptr = new Cryptr(secret);
    this.iss = iss;
    this.aud = aud;
    this.setkey();
    // this.logger = new Logger("common:Jwt");
  }

  async setkey() {
    this.key = (await promisify(scrypt)(this.secret, "salt", 32)) as Buffer;
    this.initialized = true;
  }

  /**
   * decode jwt error
   * @param  {object} error
   * @return {object} the structured error
   */
  static decodeError(error: any) {
    switch (error.name) {
      case "TokenExpiredError":
        return Exception.fromErrorMessage(
          ErrorMessage.EXPIRED_TOKEN,
          ErrorCode.EXPIRED_TOKEN
        );

      case "JsonWebTokenError":
        return Exception.fromErrorMessage(
          ErrorMessage.UNAUTHORIZED_TOKEN,
          ErrorCode.UNAUTHORIZED_TOKEN
        );
      default:
        return Exception.fromErrorMessage(
          "could not decode your token",
          ErrorCode.UNKNOWN
        );
    }
  }

  /**
   * generate a new JWT
   * @param  {object} data
   * @param  {string} expiresIn
   * @return {string}
   */
  async signToken(
    data: AuthUser,
    permissions: Permission[],
    expiresIn = "12h"
  ) {
    const d: IAccessToken = {
      permissions,
      email: data.email,
      id: data.id,
      type: data.accountType, // == UserType.ADMIN ? TokenType.ADMIN : TokenType.USER,
    };
    // encrypt the payload
    const encrypted = await this.encryptData(d);
    const { iss } = this;
    const { aud } = this;

    return sign({ data: encrypted, iss, aud }, this.secret, {
      expiresIn,
      algorithm: "HS256",
    });
  }

  /**
   * encrypt data
   * @param  {string} data
   * @return {object} the decoded data
   */
  async encryptData(data: IAccessToken) {
    // this.logger
    if (!this.initialized) await this.setkey();

    // Logger.debug(data)

    const cipher = createCipheriv(this.algorithm, this.key || "", this.iv);

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
  async verifyToken(token: string): Promise<IAccessToken | undefined> {
    try {
      const decoded: any = verify(token, this.secret, {
        issuer: this.iss,
        audience: this.aud,
      });
      if (decoded.iss !== this.iss) {
        JwtService.decodeError(
          Exception.fromErrorMessage(
            ErrorMessage.UNAUTHORIZED_TOKEN,
            ErrorCode.UNAUTHORIZED_TOKEN
          )
        );
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
    } catch (err) {
      // console.error(err);
      JwtService.decodeError(err);
      return;
      // throw new UnauthorizedException(JwtService.decodeError(err));
    }
  }

  /**
   * verify that a jwt is valid
   * @param  {string} data
   * @return {object} the decoded data
   */
  decryptData = async (data: string): Promise<IAccessToken> => {
    if (!this.initialized) await this.setkey();
    // console.debug("decrypting data");
    // console.debug(data);
    const [iv, content] = data.split(".");
    // const decrypted = this.cryptr.decrypt(data);
    // console.debug('IV', Buffer.from(iv, 'hex'));
    const decipher = createDecipheriv(
      this.algorithm,
      this.key || "",
      Buffer.from(iv, "hex")
    );

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
  getTokenFromHeaders = (req: any) => {
    const {
      headers: { authorization },
      query,
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
}
