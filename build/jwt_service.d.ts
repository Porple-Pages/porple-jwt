/// <reference types="node" />
import { IAccessToken } from "./types/accessToken.entity";
import { AuthUser } from "./types/auth-user";
import { Permission } from "./types/permissions.entity";
/**
 * Manages all jwt related issues
 * @param  {string} secret
 */
export default class JwtService {
    secret: string;
    iss: string;
    aud: string;
    algorithm: string;
    iv: Buffer;
    key?: Buffer;
    initialized: boolean;
    /**
     * @param  {string} secret
     */
    constructor(secret: string, iss: string, aud: string);
    setkey(): Promise<void>;
    /**
     * decode jwt error
     * @param  {object} error
     * @return {object} the structured error
     */
    static decodeError(error: any): {
        message: string;
        code: number;
    };
    /**
     * generate a new JWT
     * @param  {object} data
     * @param  {string} expiresIn
     * @return {string}
     */
    signToken(data: AuthUser, permissions: Permission[], expiresIn?: string): Promise<string>;
    /**
     * encrypt data
     * @param  {string} data
     * @return {object} the decoded data
     */
    encryptData(data: IAccessToken): Promise<string>;
    /**
     * decode encrypted data
     * @param  {string} token
     * @return {object} the decoded token
     */
    verifyToken(token: string): Promise<IAccessToken | undefined>;
    /**
     * verify that a jwt is valid
     * @param  {string} data
     * @return {object} the decoded data
     */
    decryptData: (data: string) => Promise<IAccessToken>;
    /**
     * @param  {Express.Request} req - a request object
     * @return {string} - the extracted token
     */
    getTokenFromHeaders: (req: any) => any;
}
