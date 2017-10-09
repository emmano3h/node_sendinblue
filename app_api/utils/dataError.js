module.exports = {
    INVALID_REQUEST:{status:400,type:'invalid_request_error',message:'fields required error',param:{}},
    PROCESS_FAILED:{status:402,type:'process_failed',message:'process completed but failed',param:{}},
    RECORD_NOT_FOUND:{status:404,type:'record_not_found_error',message:'process completed but record not found',param:{}},
    INTERNAL_ERROR:{status:500,type:'internal_error',message:'process completed but with internal error',param:{}},
}