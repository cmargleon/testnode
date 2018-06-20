'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//create express web-app
const app = express();
const router = express.Router();

var network = require('./network.js');

//bootstrap app
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());

app.get('/test', function(req,res) {
    res.send("Funciona")
})

//post call to register graduate on the network
app.post('/api/registerGraduate', function(req, res) {
    console.log("Creando cuenta graduado");
    res.sendStatus(200)
    var graduateRut = req.body.graduaterut;
    var cardId = req.body.cardid;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var email = req.body.email;
    var phoneNumber = req.body.phonenumber;

    console.log(req.body);
        
});



//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

//run app on port
app.listen(port, function() {
  console.log('app running on port: %d', port);
});