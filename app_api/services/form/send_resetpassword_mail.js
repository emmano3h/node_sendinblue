let _ = require('lodash');
let Promise = require('bluebird');
let DATA_KEY='result';
let CONSTANTS = require('constants/constants');
let request = require('request');
var dataError =require('utils/dataError');
var typeError =require('utils/typeError');
let mailsender= require('services/form/mailsender');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var templateDir_reset_password = path.join(__dirname, '../../../mail', 'reset_password');

module.exports= class {

    constructor(option) {
        console.log("===== enter send_resetpassword_mail.js class ==== ",option);
        this.payload = option;
    }

    execute() {
        return Promise.resolve("go")
            .bind( this )
            .then(format_and_sendmail)
            .then(return_result)
            .catch(geterrors);
    }
}

//////////////////
////// Private
var format_and_sendmail = function () {
    return new Promise((function (resolve, reject) {
        var reset_password_rightcom_template = new EmailTemplate(templateDir_reset_password);
        var formatter_data = {fullname: this.payload.fullname, recover_url:this.payload.recover_url};
        var userlanguage=this.payload.preferredlanguage || CONSTANTS.DEFAULT_LANGUAGE;
        console.log("formatter_data",formatter_data);
        console.log("userlanguage",userlanguage);
        reset_password_rightcom_template.render(formatter_data,userlanguage, (function (err, result) {
            console.log('err',err);
            console.log('result.html',result.html);
            console.log('result.subject',result.subject);
            console.log('this.payload',this.payload);
            if(err)
            {
                console.log("error in send_resetpassword_mail.js when want format email",err);
                reject(err);
            }
            else{
                let mail_data={subject:result.subject, sendto:{"email":this.payload.email,"name":this.payload.fullname}, sender:CONSTANTS.MAIL_SENDER, message:result.html};
                let objmailsender=new mailsender(mail_data);
                let call_mailsender_service = objmailsender.execute();
                call_mailsender_service
                    .then(function (mailsender_data) {
                        console.log('mailsender_data:',mailsender_data);
                        if (mailsender_data.result && !_.isEmpty(mailsender_data.result)) {
                            console.log('mail sent :');
                            resolve(mailsender_data.result)
                        }
                        else {
                            console.log('mail not sent :');
                            var errdetails=dataError.PROCESS_FAILED;
                            reject(errdetails);
                        }
                    })
                    .catch(function(err){
                        console.log('mail not sent. Error came in mailsender catch :',err);
                        reject(err);
                    });
            }
        }).bind(this));

    }).bind(this));
};
var return_result = function(data_received) {
    console.log('send_resetpassword_mail.js result returned data:',data_received);
    return {[DATA_KEY]:data_received};
};


function geterrors(e ) {
    console.log("error in send_resetpassword_mail.js",e);
    return e;
}
