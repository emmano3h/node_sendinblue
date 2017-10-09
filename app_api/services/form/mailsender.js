let _ = require('lodash');
let Promise = require('bluebird');
let DATA_KEY='result';
let CONSTANTS = require('constants/constants');
let request = require('request');
var dataError =require('utils/dataError');
var sendinblue = require('sendinblue-api');
module.exports= class {

    constructor(option) {
        console.log("===== enter mailsender.js class ==== ",option);
        this.payload = option;
    }

    execute() {
        return Promise.resolve("go")
            .bind( this )
            .then(sendmail)
            .then(return_result)
            .catch(geterrors);
    }
}

//////////////////
////// Private
var sendmail = function () {
    return new Promise((function (resolve, reject) {
        var parameters = CONSTANTS.SENDINBLUE_PARAMS;
        console.log(" subject====>",this.payload.subject);
        console.log(" sendto_email====>",this.payload.sendto);
        console.log(" sender_email====>",this.payload.sender);
        console.log(" message====>",this.payload.message);
        var sendinObj = new sendinblue(parameters);
            var customer_email_json={};
            customer_email_json[this.payload.sendto.email]=this.payload.sendto.name;
            console.log(" customer_email_json====>",customer_email_json);
            var mail_data = {
                "to" : customer_email_json,
                "from" : [this.payload.sender.email, this.payload.sender.name],
                "subject" : this.payload.subject,
                "html" : this.payload.message,
                // "attachment" : []
            };
            console.log(" mail_data====>",mail_data);
            sendinObj.send_email(
                mail_data,
                function(err, response){
                //console.log("email res",response);
                //console.log("email err",err);
                if(err)
                {
                    reject(err);
                }
                if(response)
                {
                    resolve(response);
                }
            });

    }).bind(this));
};
var return_result = function(data_received) {
    console.log('mail sender result returned data:',data_received);
    return {[DATA_KEY]:data_received};
};


function geterrors(e ) {
    console.log("error in mailsender.js",e);
    return e;
}
