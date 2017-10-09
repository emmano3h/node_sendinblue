module.exports = {
    RECORD_EXIST:{type:'record_exist_error',desc:'record exist'},
    COULD_NOT_LOGIN:{type:'could_not_login_error',desc:'Call login but cannot log'},
    PASSWORD_SET_FORBIDDEN:{type:'could_not_set_password_error',desc:'Could not set the password'},
    API_ERROR:{type:'api_error',desc:'Error when call API'},
    PUBLIC_KEY_ERROR:{type:'public_key_error',desc:'Error on public key'},
    API_SID_ERROR:{type:'api_sid_error',desc:'Error on api sid'},
    MATCHED_ERROR:{type:'matched_error',desc:'Two values do not match'},
}