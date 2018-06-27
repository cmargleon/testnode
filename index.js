'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const uuidv1 = require('uuid/v1');
const admin = require('firebase-admin');

//create express web-app
const app = express();
const router = express.Router();

//call libraries to get
var validate = require('./validate.js');
var network = require('./network.js');

//bootstrap app
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "verified-988d9",
    clientEmail: "firebase-adminsdk-du5im@logindb-87a54.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVOqzmMB4Uzo/Y\n8LtqH6GbF74wTPEnchrR64l2yYSCqRYhLkKBS7YKUvVqzim9u8P8+7Xsjj4h/nQc\noGzkIBHI3L5Z+h5x/wdXicBs3EySOhklPpUAM1DNlPqnhs7lc0+9NwxQvGJY88M5\nz6fKg874kMlXcWZF77e+FdPgHspkPmSiMzqny/VULLH9LDo3ZiCIMBrc6ZVb24rN\n6mezFd3D2lNKKZr4knW5Bvu9fDRd593VlBLqi3Ae2ku85hDilMt4+v3Ds3Uwj/SX\nuvxsva//qMwErBlOPleX4ffPQ7kukDA4pkkjNChbvOYM+hZgFKnn/4/xW2oTMSpL\nk0T1r6bVAgMBAAECggEAPUKEvwNO+SJZQHX1GimpR8IcAYtxcyg8nVfCoA6IU/OZ\nKII+WCA01iV8XamKY3jI92snmqVJI4ITwM+0SRwPj/ofdAFAcvbWmKc6Uew+0XoA\nlGs06qBTlCS7mJrJ4TDuVUm175IX3T93NKo8phmVQmNyfP1W6TvUObfSrd6avg6K\nm6rK/dY0czZ9H5RQe3cEG+HolMVviW++r9SnM769PF1T8iNY04mUSpV6A0GKhbx/\n8PbVGpnpC1KGi+x5N/fGk99Z2ebx/RKiElPDipcNV55c9l1QojDXhM2pW01xafVR\nVNAJshaB8s7JTPrb8C+cngijMNXhTpBQC4aEZAOqNwKBgQDuSqtiEbewAz19dEP0\nDkH4jlFrsSuYzEzx+kJqC29KFp/jiY7AthvDohvA3HkdKd/4diSzM2f4dOhKmABB\ni6K6uqLIme6hBzAs96exfQuBNA6VV+yzIfMHJaQzj3QqjobYbpHNd8brkEJkY1Zr\n+gH8NsxJdyWeibKDiAnKAXht0wKBgQDlEzXE51ed3uU1EGqyYKYKqeAJoBYdQwoV\nrnxdxq2x4TMeEMrjoQ4fB055xdUFr/K+jjdxspHounpE++5y0R2+RcJMIz0R8YZ1\nqO3J74Egu/vvyWzuHB8hPo1UowbIZcsKTTnYjUKjseoCWVtt03uLIM2OuOb3y054\nl7VJ/+ontwKBgHI2r/aNb3GZ2/spovhzbQNpk3T+slrGcYr53KNfX7QvK+uvnxCX\nOK+IH61M/3APBh7c4bJSzV61CjHWsSi5eQHvOt7TiSD9hQXInkPgH4eKIANM5VLm\nzsl6LT3ZYGCVd+R8+r10z49Q0cG0K1QNvK3axgfgZ9OZRErvBWIhWkupAoGBALzD\nW6dpyvU4Wz+iy4k5wxk+anMEC7UJLSI4qhrMQQ03OVwpEkcIzA4dgzktICCToEAO\nCPoT39Aa+e4me5L5Zr0H1tfOoeBLWjVSgr/IMGu8/BnXrX94hN5sISIBRPGVj/5p\nLKWZobQqQ160K3cQsdkvqrNVAl5mlb8hpC3aSCV5AoGBALkzs4WdOeYCNT5r9OIM\ng58jTDnnkK6fOFF3Hete3MPdTQAU1WC8UeTutUCW2zsp4UIMSH8vQ3RPTqqmRt20\nwzY7Hx3SHNp18fVpwdK+tjLKHGjlP7Y5Ipj0s21ysD/+1m5kD/qAyHebLGlwebci\nbfkjAuSYJDMaABmRwCup2u+X\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: "https://logindb-87a54.firebaseio.com"
});

app.get('/test', function(req, res) {
    res.send(uuidv1());
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

    network.onlyRegisterGraduate(cardId, graduateRut, firstName, lastName, email, phoneNumber)
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
                res.sendStatus(404);
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
          "errorw": graduate.error
        });
      } else {
        //else add graduate data to return object
        returnData.graduateRut = graduate.graduateRut;
        returnData.firstName = graduate.firstName;
        returnData.lastName = graduate.lastName;
        returnData.phoneNumber = graduate.phoneNumber;
        returnData.email = graduate.email;
        //returnData.points = member.points; REVISAR ESTO!!!!!!
        res.json({
          success: returnData
      });
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
        res.json({
          success: returnData
      });
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
  
  var degreeId = uuidv1();
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

  network.createOnlyRegistry(cardId, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa)
  .then((degree) => {
    //return error if error in response
    if (degree.error != null) {
        console.log("ERROR!!!")
      res.json({
        error: degree.error
      });
    } else {
      
      //returnData.points = member.points; REVISAR ESTO!!!!!!
      //console.log(`returndata: ${returnData}`);
      res.json({
        success: degree
    });
    }

  })
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

app.post('/api/createuserandregistry', function(req, res){
  var degreeId = uuidv1();
  var graduateRut = req.body.graduaterut;
  var owner = req.body.graduaterut;
  var degreeType = req.body.degreetype;
  var degreeStatus = req.body.degreestatus;
  var major = req.body.major;
  var minor = req.body.minor;
  var startYear = req.body.startyear;
  var gradYear = req.body.gradyear;
  var gpa = req.body.gpa;
  var cardId = req.body.cardid;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;
  var cardIdUni = req.body.cardiduni;
  console.log("Antes de llamar a la función createUserAndRegistry en network")

  network.createUserAndRegistry(cardId, graduateRut, firstName, lastName, email, phoneNumber, degreeId, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, cardIdUni)
  .then((result) => {
    console.log(`result: ${result}`)
    //return error if error in response
    if (result.error != null) {
        console.log("ERROR AL FINALS!!!")
      res.json({
        error: result.error
      });
    } else {
      console.log("todo ok")
      //returnData.points = member.points; REVISAR ESTO!!!!!!
      //console.log(`returndata: ${returnData}`);
      res.json({
        success: result
    });
    }

  })
})

//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

//run app on port
app.listen(port, function() {
  console.log('app running on port: %d', port);
});