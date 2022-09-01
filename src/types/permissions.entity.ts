export enum Permission {
  CAN_CREATE_ADMIN = 'can_create_admin',
  CAN_UPDATE_ADMIN = 'can_update_admin',
  CAN_DELETE_ADMIN = 'can_delete_admin',
  CAN_VIEW_ADMIN = 'can_view_admin',

  CAN_CREATE_USER = 'can_create_user',
  CAN_UPDATE_USER = 'can_update_user',
  CAN_DELETE_USER = 'can_delete_user',
  CAN_VIEW_USER = 'can_view_user',

  CAN_CREATE_ROLE = 'can_create_role',
  CAN_UPDATE_ROLE = 'can_update_role',
  CAN_DELETE_ROLE = 'can_delete_role',
  CAN_VIEW_ROLE = 'can_view_role',

  CAN_CREATE_INDUSTRY = 'can_create_industry',
  CAN_UPDATE_INDUSTRY = 'can_update_industry',
  CAN_DELETE_INDUSTRY = 'can_delete_industry',
  CAN_VIEW_INDUSTRY = 'can_view_industry',

  CAN_CREATE_SKILL = 'can_create_skill',
  CAN_UPDATE_SKILL = 'can_update_skill',
  CAN_DELETE_SKILL = 'can_delete_skill',
  CAN_VIEW_SKILL = 'can_view_skill',

  CAN_CREATE_CONFIG = 'can_update_config',
  CAN_VIEW_CONFIG = 'can_view_config',

  CAN_VIEW_ANALYTICS = 'can_view_analytics',
 

  CAN_CREATE_ = "can_create_",
  CAN_UPDATE_ = "can_update_",
  CAN_DELETE_ = "can_delete_",
  CAN_VIEW_ = "can_view_",

//   CAN_CREATE_ = "can_create_",
//   CAN_UPDATE_ = "can_update_",
//   CAN_DELETE_ = "can_delete_",
//   CAN_VIEW_ = "can_view_",
 
}
export const PermissionAsArray: Permission[] = Object.values(Permission);
