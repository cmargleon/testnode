'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const uuidv1 = require('uuid/v1');
const cors = require('cors')({origin: true});
//const admin = require('firebase-admin');

//create express web-app
const app = express();
const router = express.Router();

//call libraries to get
var validate = require('./validate.js');
var network = require('./network.js');

//bootstrap app
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());

app.use(cors);

app.get('/test', function(req, res) {
    res.send(uuidv1());
});

app.get('/firebase', function(req,res) {
  let uid = uuidv1()

  network.createUserFirebase()
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
app.post('/api/registeronlyUniversity', function(req, res) {
  console.log(`uni: ${req.body.universityRut}`)
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
                network.onlyRegisterUniversity(cardId, universityRut, shortName, fullName, email)
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
  console.log(`uni: ${req.body.universityRut}`)
    console.log("Creando cuenta universidad");
    var universityRut = req.body.universityrut;
    var cardId = uuidv1();
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
                console.log("antes de iniciar registro en index")
                      //else register university on the network
                network.registerUniversityInBlockchainAndFirebase(cardId, universityRut, shortName, fullName, email)
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
  var uid = req.body.uid;

  //cardId = req.body.cardid;
  var returnData = {};
  cardId = req.body.cardid

  network.createRegistry(cardId, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, uid)
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
});

app.post('/api/queryRegistriesUniversity', function(req, res) {
  let uid = req.body.uid;
  console.log(`uid: ${uid}`)
  network.queryAllRegistriesUniversities(uid)
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
      res.send(result);
    }

  })
})

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
  var cardId = uuidv1();
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;
  var registryCreator = req.body.universityrut;
  var uid = req.body.uid
  console.log("Antes de llamar a la función createUserAndRegistry en network");
  console.log(uid)

  network.createUserAndRegistry(cardId, graduateRut, firstName, lastName, email, phoneNumber, degreeId, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, registryCreator, uid)
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

app.post('/uidtest', function(req,res) {
  let email = req.body.email
  network.uidTest(email)
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

app.post('/api/querydegreesbyid', function (req,res) {
  let degreeId = req.body.degreeId;
  let uid = req.body.uid
  console.log(degreeId, uid)
  network.queryDegreeById(degreeId, uid)
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
      res.send(result);
    }

  })
});

app.post('/api/updateDegreeData', function(req, res) {
  let degreeId = req.body.degreeId;
  let updateData = req.body.updateData;
  let uid = req.body.uid;
  network.updateDegreeData(degreeId, updateData, uid)
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
      res.send(result);
    }
  })
})

app.post('/universitycard', function(req,res) {
  let uid = req.body.uid;
  network.universityCardIdTest(uid);
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