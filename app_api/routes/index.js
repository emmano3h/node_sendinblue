var express = require('express');
var router = express.Router();
var ctrlApp = require('controllers/app/sendmailController');


router.post('/send_welcome_mail', ctrlApp.sendwelcomemail);

module.exports = router;
