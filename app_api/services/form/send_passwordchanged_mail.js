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
var templateDir_password_changed = path.join(__dirname, '../../mail', 'password_changed');

module.exports= class {

    constructor(option) {
        console.log("===== enter send_passwordchanged.js class ==== ",option);
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
        var password_changed_template = new EmailTemplate(templateDir_password_changed);
        var formatter_data = {fullname: this.payload.fullname,company_name:this.payload.company_name,forgotpassword_url:this.payload.forgotpassword_url};
        var userlanguage=this.payload.preferredlanguage || CONSTANTS.DEFAULT_LANGUAGE;
        console.log("formatter_data",formatter_data);
        console.log("userlanguage",userlanguage);
        password_changed_template.render(formatter_data,userlanguage, (function (err, result) {
            console.log('err',err);
            console.log('result.html',result.html);
            console.log('result.subject',result.subject);
            if(err)
            {
                console.log("error in send_passwordchanged_mail.js when want format email",err);
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
    console.log('send_passwordchanged.js result returned data:',data_received);
    return {[DATA_KEY]:data_received};
};


function geterrors(e ) {
    console.log("error in send_passwordchanged_mail.js",e);
    return e;
}
