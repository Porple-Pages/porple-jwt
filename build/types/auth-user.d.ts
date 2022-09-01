import { AccountType } from "./account-type.entity";
export interface AuthUser {
    email: string;
    accountType: AccountType;
    image: string;
    phone: string;
    id: string;
    firstName: string;
    lastName: string;
    company: any;
}
