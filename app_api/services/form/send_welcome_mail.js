let _ = require('lodash');
let Promise = require('bluebird');
let DATA_KEY='result';
let CONSTANTS = require('constants/constants');
let request = require('request');
var dataError =require('utils/dataError');
let mailsender= require('services/form/mailsender');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var templateDir_welcome = path.join(__dirname, '../../mail_templates', 'welcome');
let generalResponse =require('utils/generalResponse');
module.exports= class {

    constructor(option) {
        console.log("===== enter send_welcome_mail.js class ==== ",option);
        this.payload = option;
    }

    execute() {
        return Promise.resolve("go")
            .bind( this )
            .then(generate_message_html)
            .then(sendmail)
            .then(return_result)
            .catch(geterrors);
    }
}

//////////////////
////// Private
var generate_message_html = function () {
    return new Promise((function (resolve, reject) {
        var welcome_template = new EmailTemplate(templateDir_welcome);
        // data to pass to our template
        var data_wrapper = {fullname: this.payload.fullname, account_email:this.payload.email};
        var user_language=this.payload.preferredlanguage || CONSTANTS.DEFAULT_LANGUAGE;
        //console.log("formatter_data",data_wrapper);
        //console.log("userlanguage",userlanguage);
        welcome_template.render(data_wrapper,user_language, (function (err, result) {
           // console.log('result.html',result.html);
            //console.log('result.subject',result.subject);
            //console.log('this.payload',this.payload);
            if(err)
            {
                console.log("error in send_welcome_mail.js when want format email",err);
                reject(err);
            }
            else{
                this.payload.mail_subject=result.subject;
                this.payload.mail_html=result.html;
                resolve(result.html)
            }
        }).bind(this));

    }).bind(this));
};
var sendmail = function () {
    return new Promise((function (resolve, reject) {
        let mail_sender_payload={subject:this.payload.mail_subject, sendto:{"email":this.payload.email,"name":this.payload.fullname}, sender:CONSTANTS.MAIL_SENDER, message:this.payload.mail_html};
        let objmailsender=new mailsender(mail_sender_payload);
        let call_mailsender_service = objmailsender.execute();
        call_mailsender_service
            .then(function (mailsender_data) {
                console.log('mailsender_data:',mailsender_data);
                if (mailsender_data.result && !_.isEmpty(mailsender_data.result) && mailsender_data.result.code =='success') {
                    console.log('mail sent :');
                    resolve(mailsender_data.result)
                }
                else {
                    console.log('mail not sent :');
                    var errdetails=dataError.PROCESS_FAILED;
                    errdetails.type = {"details":mailsender_data.result}
                    reject(errdetails);
                }
            })
            .catch(function(err){
                console.log('mail not sent. Error came in mailsender catch :',err);
                reject(err);
            });

    }).bind(this));
};
var return_result = function(data_received) {
    console.log('send_welcome_mail.js result returned data:',data_received);
    //return {[DATA_KEY]:data_received};
    return new generalResponse({code:200,text:'SUCCESS'},null,DATA_KEY,data_received);

};

function geterrors(e ) {
    console.log("error in send_welcome_mail.js",e);

    let errdetails=dataError.PROCESS_FAILED;
    errdetails.param="";
    return new generalResponse({code:500,text:'ERROR'},errdetails,DATA_KEY);
}
