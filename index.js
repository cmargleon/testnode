'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
//const request = require('request');
const path = require('path');

//create express web-app
const app = express();
const router = express.Router();

//call libraries to get
var validate = require('./validate.js');
var network = require('./network.js');

//bootstrap app
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());

app.get('/test', function(req, res) {
    res.sendStatus(200);
})

//post call to register graduate on the network
app.post('/api/registerGraduate', function(req, res) {
    console.log("Creando cuenta graduado");
    var graduateRut = req.body.graduaterut;
    var cardId = req.body.cardid;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var email = req.body.email;
    var phoneNumber = req.body.phonenumber;

    console.log(req.body);

    validate.validateGraduateRegistration(graduateRut, cardId, firstName, lastName, phoneNumber, email)
        .then((response) => {
            if (response.error != null) {
                res.json({
                  error: response.error
                });
                return;
              } else {
                    //else register graduate on the network
                network.registerGraduate(cardId, graduateRut, firstName, lastName, email, phoneNumber)
                .then((response) => {
                    //return error if error in response
                    if (response.error != null) {
                    res.json({
                        error: response.error
                    });
                    } else {
                    //else return success
                    res.json({
                        success: response
                    });
                    }
                });
              }
        })
        
});

//post call to register university on the network
app.post('/api/registerUniversity', function(req, res) {
    console.log("Creando cuenta universidad");
    var universityRut = req.body.universityrut;
    var cardId = req.body.cardid;
    var shortName = req.body.shortname;
    var fullName = req.body.fullname;
    var email = req.body.email;

    console.log(req.body);

    validate.validateUniversityRegistration(universityRut, cardId, shortName, fullName, email)
        .then((response) => {
            if (response.error != null) {
                res.json({
                  error: response.error
                });
                return;
              } else {
                      //else register university on the network
                network.registerUniversity(cardId, universityRut, shortName, fullName, email)
                .then((response) => {
                    //return error if error in response
                    if (response.error != null) {
                    res.json({
                        error: response.error
                    });
                    } else {
                    //else return success
                    res.json({
                        success: response
                    });
                    }
                });
              }
        })
});

//post call to register business on the network
app.post('/api/registerBusiness', function(req, res) {
    console.log("Creando cuenta negocio");
    var businessRut = req.body.businessrut;
    var cardId = req.body.cardid;
    var shortName = req.body.shortname;
    var fullName = req.body.fullname;
    var email = req.body.email;


    validate.validateBusinessRegistration(businessRut, cardId, shortName, fullName, email)
        .then((response) => {
            if (response.error != null) {
                res.json({
                  error: response.error
                });
                return;
              } else {
                      //else register business on the network
                      network.registerBusiness(cardId, businessRut, shortName, fullName, email)
                      .then((response) => {
                          //return error if error in response
                          if (response.error != null) {
                          res.json({
                              error: response.error
                          });
                          } else {
                          //else return success
                          res.json({
                              success: response
                          });
                          }
                      });
              }
        })
});

//post call to log in graduate NO ESTOY SEGURO! REVISAR!
app.post('/api/logingraduate', function(req,res) {
    console.log(req.body.graduaterut);
    //declare variables to retrieve from request
    var graduateRut = req.body.graduaterut;
    var cardId = req.body.cardid;
    //print variables
  console.log('memberData using param - ' + ' accountNumber: ' + graduateRut + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get graduate data from network
  network.graduateData(cardId, graduateRut)
    .then((graduate) => {
      //return error if error in response
      if (graduate.error != null) {
          console.log("ERROR!!!")
        res.json({
          error: graduate.error
        });
      } else {
        //else add graduate data to return object
        returnData.graduateRut = graduate.graduateRut;
        returnData.firstName = graduate.firstName;
        returnData.lastName = graduate.lastName;
        returnData.phoneNumber = graduate.phoneNumber;
        returnData.email = graduate.email;
        //returnData.points = member.points; REVISAR ESTO!!!!!!
        console.log(returnData)
      }

    })
});

//post call to log in university NO ESTOY SEGURO! REVISAR!
app.post('/api/loginuniversity', function(req,res) {
    console.log("iniciando sesión universidad");
    //declare variables to retrieve from request
    var universityRut = req.body.universityrut;
    var cardId = req.body.cardid;

    //print variables
  console.log('memberData using param - ' + ' accountNumber: ' + universityRut + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get university data from network
  network.universityData(cardId, universityRut)
    .then((university) => {
      //return error if error in response
      if (university.error != null) {
          console.log("ERROR!!!")
        res.json({
          error: university.error
        });
      } else {
        //else add university data to return object
        returnData.universityRut = university.universityRut;
        returnData.shortName = university.shortName;
        returnData.fullName = university.fullName;
        returnData.email = university.email;
        //returnData.points = member.points; REVISAR ESTO!!!!!!
        console.log(returnData)
      }

    })
});

//post call to log in business NO ESTOY SEGURO! REVISAR!
app.post('/api/loginbusiness', function(req,res) {
    console.log("iniciando sesión business");
    //declare variables to retrieve from request
    var businessRut = req.body.businessrut;
    var cardId = req.body.cardid;

    console.log('memberData using param - ' + ' accountNumber: ' + businessRut + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get business data from network
  network.businessData(cardId, businessRut)
    .then((business) => {
      //return error if error in response
      if (business.error != null) {
          console.log("ERROR!!!")
        res.json({
          error: business.error
        });
      } else {
        //else add business data to return object
        returnData.businessRut = business.businessRut;
        returnData.shortName = business.shortName;
        returnData.fullName = business.fullName;
        returnData.email = business.email;
        //returnData.points = member.points; REVISAR ESTO!!!!!!
        console.log(`returndata: ${returnData}`);
        res.json({
          success: returnData
      });
      }

    })
});

app.post('/api/createregistry', function(req, res) {
  //console.log(req.body.degreeid);
  
  var degreeId = req.body.degreeid;
  var graduateRut = req.body.graduaterut;
  var owner = req.body.owner;
  var degreeType = req.body.degreetype;
  var degreeStatus = req.body.degreestatus;
  var major = req.body.major;
  var minor = req.body.minor;
  var startYear = req.body.startyear;
  var gradYear = req.body.gradyear;
  var gpa = req.body.gpa;
  var cardId = req.body.cardid;

  //cardId = req.body.cardid;
  var returnData = {};
  cardId = req.body.cardid

  network.createRegistry(cardId, req.body.degreeid, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa)
})

app.post('/api/authorizedegree', function(req, res){
  //console.log(req.body.businessrut)
  var cardId = req.body.cardid;
  var businessRut = req.body.businessrut;
  var degreeId = req.body.degreeid;
  console.log(businessRut)

  var returnData = {};

  network.authorizeDegree(cardId, businessRut, degreeId)
  .then(data => console.log(`data: ${data}`))
});

app.post('/api/authorizefullregistry', function(req, res){
  //console.log(req.body.businessrut)
  var cardId = req.body.cardid;
  var businessRut = req.body.businessrut;
  var graduate = req.body.graduate;
  var university = req.body.university;
  console.log(businessRut)

  var returnData = {};

  network.authorizeFullRegistry(cardId, businessRut, graduate, university)
});

app.post('/api/queryfullregistry', function(req, res){
  console.log(req.body)
  var cardId = req.body.cardid;
  var graduateRut = req.body.graduaterut;

  var returnData = {};

  network.queryRegistries(cardId, graduateRut)
  .then(data => console.log(`data: ${data}`))
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