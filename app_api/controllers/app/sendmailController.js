var Promise = require ('bluebird');
var _ = require('lodash');
var dataError =require('utils/dataError');
var typeError =require('utils/typeError');
var CONSTANTS = require('constants/constants');
var utils = require('utils/utils');
let serviceResponder =require('utils/serviceResponder');
let send_welcome_mail =require('services/form/send_welcome_mail');

module.exports.sendwelcomemail = function (req, res, next) {
    console.log("eee");
    serviceResponder( res, next, send_welcome_mail, {
        fullname:req.body.fullname,
        preferredlanguage: req.body.preferredlanguage,
        email: req.body.email,
    } );


};

