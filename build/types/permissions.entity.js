"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionAsArray = exports.Permission = void 0;
var Permission;
(function (Permission) {
    Permission["CAN_CREATE_ADMIN"] = "can_create_admin";
    Permission["CAN_UPDATE_ADMIN"] = "can_update_admin";
    Permission["CAN_DELETE_ADMIN"] = "can_delete_admin";
    Permission["CAN_VIEW_ADMIN"] = "can_view_admin";
    Permission["CAN_CREATE_USER"] = "can_create_user";
    Permission["CAN_UPDATE_USER"] = "can_update_user";
    Permission["CAN_DELETE_USER"] = "can_delete_user";
    Permission["CAN_VIEW_USER"] = "can_view_user";
    Permission["CAN_CREATE_ROLE"] = "can_create_role";
    Permission["CAN_UPDATE_ROLE"] = "can_update_role";
    Permission["CAN_DELETE_ROLE"] = "can_delete_role";
    Permission["CAN_VIEW_ROLE"] = "can_view_role";
    Permission["CAN_CREATE_INDUSTRY"] = "can_create_industry";
    Permission["CAN_UPDATE_INDUSTRY"] = "can_update_industry";
    Permission["CAN_DELETE_INDUSTRY"] = "can_delete_industry";
    Permission["CAN_VIEW_INDUSTRY"] = "can_view_industry";
    Permission["CAN_CREATE_SKILL"] = "can_create_skill";
    Permission["CAN_UPDATE_SKILL"] = "can_update_skill";
    Permission["CAN_DELETE_SKILL"] = "can_delete_skill";
    Permission["CAN_VIEW_SKILL"] = "can_view_skill";
    Permission["CAN_CREATE_CONFIG"] = "can_update_config";
    Permission["CAN_VIEW_CONFIG"] = "can_view_config";
    Permission["CAN_VIEW_ANALYTICS"] = "can_view_analytics";
    Permission["CAN_CREATE_"] = "can_create_";
    Permission["CAN_UPDATE_"] = "can_update_";
    Permission["CAN_DELETE_"] = "can_delete_";
    Permission["CAN_VIEW_"] = "can_view_";
    //   CAN_CREATE_ = "can_create_",
    //   CAN_UPDATE_ = "can_update_",
    //   CAN_DELETE_ = "can_delete_",
    //   CAN_VIEW_ = "can_view_",
})(Permission = exports.Permission || (exports.Permission = {}));
exports.PermissionAsArray = Object.values(Permission);
