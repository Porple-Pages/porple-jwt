import { AccountType } from './account-type.entity';
import { Permission } from './permissions.entity';

 

export interface IAccessToken {
  readonly email: string;
  exp?: number;
  iat?: number;
  readonly id: string;
  iss?: number;
  readonly permissions: Permission[];
  readonly type: AccountType;
}
