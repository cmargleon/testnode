const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "logindb-87a54",
    clientEmail: "firebase-adminsdk-du5im@logindb-87a54.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4TMPBOeO6StB1\nuGg8Fcdapok+SE0EjwLIKLNdQinJLF1ipmq1AwateJiHhJFS+hX3VLWlPsHc0vDX\nEDo/inHO3AI47ZjUKxlaog+ysas1Z4+QueOs7vYBml4Upkf9PUI74ugYkf1gAJvR\nILc2F+QGCrVTUDI2H55Bur8dWqFJcYTrH5eOtr1Nt5+JXch++DLV+/P/7apU/FLg\nWlVcllsL32oPUapaeaZspWEHm9KcfduNXuIyYC+OcBVw0IFEViQMKLj1GFe0GeeK\nh9E55PL48hdi/86TgjEdbWLNCkbWfVjqN03ncTxHgR7nPCzDDCFtmfOAaasPtbhx\nABDCDFdhAgMBAAECggEABgcgue+qRpwO0GLdKeXudMUQpRRZTIZe6WwHXcv9sOI+\nFa1qvQvhyoewuXH5DNU4JbREEqkITzApB2e0+AIPsdvZSMJgpsPYGvJFACu2dVMz\nS2EBFNVl/2xsmlFL9njr8yh7Pd58gojSj9b5lw/V+eqcvqJXWhTTqMOyX4Po1Y2O\nJHUpeg3GVFcaO4U6U5tQEh8mgIhZo9LYs+vkB24www0aqd2b/lxEt33CweCtrhZt\nYVUggm/mizFDgU8VH2/CGQdNYQ8icB3twZnn1n+TY4ACgE7XPaUq2wD4l0Teji8N\njWkEOJof3j26hAjAqqkP3AZVqxs+/4jqgZXSWySRaQKBgQD0M7IycVW5F4Gok85Z\nvI+qG4kSI9a0NslScOcXcBUrQOJz4YvcTbzZTsXfGQT+Ca/pVpxlGTOmH7jhnlSb\nKV3ueSI+fqLEPHCUhmj+X3gUe+RgqpI4NZKhDkliCJT+AA9HuFbpX0hcIXWHiDv4\n283wuIqKXLanTZVcvhbqGD11dQKBgQDBNDI5jnMvEt4ODe3NISj5xwW1K7U/Ecew\nn6Eb95XijVFu7U6hNQOdUDdCcB6dyFs8lpoj0O3Wg5ROFpva0R2lkPJ8F3NOpS40\ny+irRfupgwmIlQkj5OdSaZIMFa0FHS4GJuFzr3iKHV//iwnpkWeSF78hTxAZOOkd\n1WMY0EYgvQKBgAfcujoBiB8DcLs6twQQnBd/93PMD5eRw/2RgP8yLpxL5H6Snmwj\nXJcqgBhkt9JuAWnjzfk7THxmvQ8Wh+bO+CU7ZSzZ6ueigoVlpm+6JyWRr5KlKzwA\nDY595ULwv8tFuTg36SRuWugMc7o/Wp7yhLjhWCSIQ6EzUEHCJP64dRIZAoGBALph\nFgp8JxXER76bJUp7sMG0gwcRERm0l0UF2S/XmhohZetytiXBtKjvlz9aVc60V3+N\ncUkX5jjIWisymEtw6/6qY6HeJXg61OZNxzhinLIcHPhLfbPIwHa6LQ/HYU/LpHh+\nzYMCRXBHgjJM+NT/VkCS8+i4ErmiMxB6p8xqLxypAoGBAI+oN0WrQxNWHhY4sszC\naZNutBT/YPY4CTwYOiM/ci6kGlpBBkPbjzg6zLEqT0XQoP7IyQ9tgGnpfsQKewzP\nRXFmQ2tdymxgzkzyb2Vp99y7FD3GhveW+3ZUIu5k9mhOeB0DxBUsuD/xrbalvSWA\n9Qy1pwCcGjBrmoXE0T7AB56K\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: "https://logindb-87a54.firebaseio.com"
});

//declate namespace
const namespace = 'org.degree.ucsd';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'degree';
let factory;

async function getGraduateCardId(graduateRut) {
  console.log("engetcardid")
  try {
    var db = admin.database();
    var ref = db.ref(`/users/rut/${graduateRut}/cardid`);
    await ref.on("value", function(snapshot) {
      console.log(snapshot.val());
      let graduateCardId = snapshot.val();
      console.log(graduateCardId);
      return graduateCardId;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      throw errorObject;
    });
  } catch(error) {
    throw error;
  }
}

async function getUniversityCardId(uid) {
  console.log("en get university card id")
  try {
    var db = admin.database();
    var ref = db.ref(`/universities/uid/${uid}/cardid`);
    console.log(ref)
    console.log("antes de tratar")
    await ref.on("value", function(snapshot) {
      console.log(snapshot.val());
      let universityCardId = snapshot.val();
      console.log(universityCardId);
      console.log("aqui2")
      return universityCardId;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      throw errorObject;
    });
    console.log("aaaa")
    return universityCardId;
  } catch(error) {
    throw error;
  }
}

async function getUniversityCardId2(uid) {
  console.log("en get university card id1")
  try {
    var db = admin.database();
    var ref = db.ref(`/universities/uid/${uid}/cardid`);
    //console.log(ref)
    console.log("antes de tratar")

    const cardId = await ref.once("value");
    console.log(cardId.val());
    
    return cardId.val();
  } catch(error) {
    throw error;
  }
}

async function getUniversityRut(uid) {
  try {
    var db = admin.database();
    var ref = db.ref(`/universities/uid/${uid}/rut`);
    //console.log(ref)
    console.log("antes de tratar")

    const universityRut = await ref.once("value");
    
    return universityRut.val();
  } catch(error) {
    throw error;
  }
}

async function getUidFirebase(email) {
  try {
    const userInfo = await admin.auth().getUserByEmail(email);
    let uid = userInfo.uid;
    return uid;
  } catch (error) {
    throw error;
  }
}

async function createUniversityFirebase(cardId, universityRut,shortName, fullName, email) {
  console.log("en firebase")
  try {
    let userDetails = await admin.auth().createUser({
      email: email,
      password: "master",
      displayName: `${shortName}`
    });
    let uid = userDetails.uid;
    var db = admin.database();
    //res.send(uuidv1());
    var refUid = db.ref('universities/uid/' + uid);
    var refRut = db.ref('universities/rut/' + universityRut);
    
    const afterRefUid = await refUid.set({
      "cardid": cardId,
      "email": email,
      "shortName": shortName,
      "fullName" : fullName,
      "rut": universityRut
    });
    const afterRefRut = await refRut.set({
      "cardid": cardId,
      "email": email,
      "shortName": shortName,
      "fullName" : fullName,
      "uid": uid
    })
    console.log(afterRefUid);
    console.log(afterRefRut);
    console.log(`userDetails: ${userDetails.uid}`);
    console.log("lo hizo");
    
    return true
  } catch(err) {
    console.log("tirando error")
    throw err;
  }
}

async function createUserFirebase(email, firstName, lastName, cardId, graduateRut) {
  console.log("en firebase")
  try {
    let userDetails = await admin.auth().createUser({
      email: email,
      password: "master",
      displayName: `${firstName}` + `${lastName}`
    });
    let uid = userDetails.uid;
    var db = admin.database();

    //let ruut = graduateRut;
    //res.send(uuidv1());
    var refUid = db.ref('users/uid/' + uid);
    var refRut = db.ref('users/rut/' + graduateRut);

    console.log(cardId, email, firstName, lastName, graduateRut, uid);

    let kkkk = {
      "cardid": cardId,
      "email": email,
      "firstName": firstName,
      "lastName" : lastName,
      "rut": graduateRut
    };
    console.log(kkkk);
    console.log("antes de primer ref")
    const afterRefUid = await refUid.set({
      "cardid": cardId,
      "email": email,
      "firstName": firstName,
      "lastName" : lastName,
      "rut": graduateRut
    });
    console.log("antes de seg ref")
    const afterRefRut = await refRut.set({
      "cardid": cardId,
      "email": email,
      "firstName": firstName,
      "lastName" : lastName,
      "uid": uid
    });
    console.log("dp de seg ref")
    console.log(afterRefUid);
    console.log(afterRefRut);
    console.log(`userDetails: ${userDetails.uid}`);
    console.log("lo hizo");
    
    return true
  } catch(err) {
    console.log("tirando error")
    throw err;
  }
}

//ESTA FUNCIÓN SIRVE PARA CHEQUEAR TODOS LOS USUARIOS Y NO SOLO LOS GRADUADOS
async function userExistFirebase(email) {
  try {
    let checkUser = await admin.auth().getUserByEmail(email);
  console.log(`user: ${JSON.stringify(checkUser)}`);
  return true;
  } catch(error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`errorrr: ${error.code}`);
      return false
    } else {
      console.log("ERROOOOR")
      throw error
    }
    
  }
}

async function checkIfUniversityExists(universityRut) {
  console.log("empieza a ejecutarse función checkIfUniversityExists")

  businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@degree');
console.log("se conecta con la tarjeta admin")
    //get the factory for the business network
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    //add graduate participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.University');
    console.log("se crea participantRegistry")
    const check = await participantRegistry.exists(universityRut);
    console.log("se crea variable boolean para ver si usuario existe:");
    console.log(check);
    return check;
}

async function checkIfUserExists(graduateRut) {
  //adminConnection = new AdminConnection();
  //businessNetworkName = 'degree';
  console.log("empieza a ejecutarse función checkIfUserExists")

  businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@degree');
console.log("se conecta con la tarjeta admin")
    //get the factory for the business network
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    //add graduate participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Graduate');
    console.log("se crea participantRegistry")
    const check = await participantRegistry.exists(graduateRut);
    console.log("se crea variable boolean para ver si usuario existe:");
    console.log(check);
    return check;
}


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = 'degree';

  //declare metadata
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
  let connectionProfile =  {
    "name": "fabric-network",
    "x-type": "hlfv1",
    "version": "1.0.0",
    "peers": {
        "peer0.org1.example.com": {
            "url": "grpc://localhost:7051",
            "eventUrl": "grpc://localhost:7053"
        }
    },
    "certificateAuthorities": {
        "ca.org1.example.com": {
            "url": "http://localhost:7054",
            "caName": "ca.org1.example.com"
        }
    },
    "orderers": {
        "orderer.example.com": {
            "url": "grpc://localhost:7050"
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.org1.example.com"
            ]
        }
    },
    "channels": {
        "composerchannel": {
            "orderers": [
                "orderer.example.com"
            ],
            "peers": {
                "peer0.org1.example.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                }
            }
        }
    },
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300",
                    "eventHub": "300",
                    "eventReg": "300"
                },
                "orderer": "300"
            }
        }
    }
};
  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}

//export module
module.exports = {

    /*
    * Create Graduate participant and import card for identity
    * @param {String} cardId Import card id for Graduate
    * @param {String} graduateRut Graduate account number as identifier on network
    * @param {String} firstName Graduate first name
    * @param {String} lastName Graduate last name
    * @param {String} phoneNumber Graduate phone number
    * @param {String} email Graduate email
    */
   registerGraduate: async function (cardId, graduateRut,firstName, lastName, email, phoneNumber) {
      try {
        console.log("se empieza a ejecutar registerGraduate")
        //connect as admin
        businessNetworkConnection = new BusinessNetworkConnection();
        await businessNetworkConnection.connect('admin@degree');
        console.log("se conectó con admindegreee en register")
        //get the factory for the business network
        factory = businessNetworkConnection.getBusinessNetwork().getFactory();
  
        //create graduate participant
        const graduate = factory.newResource(namespace, 'Graduate', graduateRut);
        graduate.firstName = firstName;
        graduate.lastName = lastName;
        graduate.email = email;
        graduate.phoneNumber = phoneNumber;
        console.log("antes de añadir participante");
  
        //add graduate participant
        const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Graduate');
        await participantRegistry.add(graduate);
        console.log("despues de añadir participante");
        //issue identity
        const identity = await businessNetworkConnection.issueIdentity(namespace + '.Graduate#' + graduateRut, cardId);
        console.log("issue ident")
        //import card for identity
        await importCardForIdentity(cardId, identity);
        console.log("import card")
        //disconnect
        await businessNetworkConnection.disconnect('admin@degree');
        console.log("Justo antes de terminar de crear graduate")
        return true;
      }
      catch(error) {
        //NEED TO CATCH THIS ERROR IN mainFunction()
        //var error2 = {};
        //error2.error = error.message;
        console.log(`error en create:${error}`);
        throw error; // Rethrow
      }
  
    },

    /*
    * Create Graduate participant and import card for identity
    * @param {String} cardId Import card id for Graduate
    * @param {String} graduateRut Graduate account number as identifier on network
    * @param {String} firstName Graduate first name
    * @param {String} lastName Graduate last name
    * @param {String} phoneNumber Graduate phone number
    * @param {String} email Graduate email
    */
   onlyRegisterGraduate: async function (cardId, graduateRut,firstName, lastName, email, phoneNumber) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@degree');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create graduate participant
      const graduate = factory.newResource(namespace, 'Graduate', graduateRut);
      graduate.firstName = firstName;
      graduate.lastName = lastName;
      graduate.email = email;
      graduate.phoneNumber = phoneNumber;
      

      //add graduate participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Graduate');
      await participantRegistry.add(graduate);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Graduate#' + graduateRut, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@degree');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  registerUniversityInBlockchainAndFirebase: async function (cardId, universityRut,shortName, fullName, email) {
    try {

      let checkFirebase = await userExistFirebase(email);
      console.log(checkFirebase)
      let checkBlockchain = await checkIfUniversityExists(universityRut);

      console.log("Termina de ejecturarse función checkIfUserExists() y comienza el if statement de check y userFirebase")

    //if (check != true && userFirebase != true) {
    if (checkBlockchain != true && checkFirebase != true) {
    //if user does not exist
    //add graduate participant;
    console.log("No está registrado ni en la blockchain ni en firebase");
    await createUniversityFirebase(cardId, universityRut,shortName, fullName, email);
    //console.log("Si check es != de true y empieza a ejecutarse función this.registerGraduate")
    await this.registerUniversity(cardId, universityRut,shortName, fullName, email);
    console.log("Comienza a ejecutarse función this.createRegistry")

    return true;
    } else if (checkBlockchain != false && checkFirebase != true) {
      console.log("if checkBlockchain != false && checkFirebase != true")
      await createUniversityFirebase(cardId, universityRut,shortName, fullName, email);
      console.log("dp de crear universidad en firebase");

      return true;
    } else if (checkBlockchain != true && checkFirebase != false) {
      console.log("if if checkBlockchain != true && checkFirebase != false")
      await this.registerUniversity(cardId, universityRut,shortName, fullName, email);
      console.log("dp de crear universidad blockchain");
      return true;
    }
    else {
      console.log("todo ok");
      
    return true;
    }
    } catch(err) {
      //print and return error
      console.log(`error en createandregister: ${error}`);
      console.log(err);
      console.log("EORR")
      var error = {};
      error.error = err.message;
      return error;
    }
  },

    /*
    * Create University participant and import card for identity
    * @param {String} cardId Import card id for university
    * @param {String} universityRut University account number as identifier on network
    * @param {String} shortName University short name
    * @param {String} fullName University short name
    * @param {String} email University email
    */
   onlyRegisterUniversity: async function (cardId, universityRut,shortName, fullName, email) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@degree');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create university participant
      const university = factory.newResource(namespace, 'University', universityRut);
      university.shortName = shortName;
      university.fullName = fullName;
      university.email = email;
      

      //add university participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.University');
      await participantRegistry.add(university);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.University#' + universityRut, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@degree');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

      /*
    * Create University participant and import card for identity
    * @param {String} cardId Import card id for university
    * @param {String} universityRut University account number as identifier on network
    * @param {String} shortName University short name
    * @param {String} fullName University short name
    * @param {String} email University email
    */
   registerUniversity: async function (cardId, universityRut,shortName, fullName, email) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@degree');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create university participant
      const university = factory.newResource(namespace, 'University', universityRut);
      university.shortName = shortName;
      university.fullName = fullName;
      university.email = email;
      

      //add university participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.University');
      await participantRegistry.add(university);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.University#' + universityRut, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@degree');

      return true;
    }
    catch(err) {
      throw error
    }

  },

  /*
    * Create Business participant and import card for identity
    * @param {String} cardId Import card id for business
    * @param {String} businessRut Business account number as identifier on network
    * @param {String} shortName Business short name
    * @param {String} fullName Business short name
    * @param {String} email Business email
    */
   registerBusiness: async function (cardId, businessRut,shortName, fullName, email) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@degree');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create business participant
      const business = factory.newResource(namespace, 'Business', businessRut);
      business.shortName = shortName;
      business.fullName = fullName;
      business.email = email;
      

      //add business participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Business');
      await participantRegistry.add(business);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Business#' + businessRut, cardId);

      //import card for identity
      await importCardForIdentity(cardId, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@degree');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Get Graduate data
  * @param {String} cardId Card id to connect to network
  * @param {String} graduateRut Account number of graduate
  */
 graduateData: async function (cardId, graduateRut) {

  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);

    //get graduate from the network
    const graduateRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Graduate');
    const graduate = await graduateRegistry.get(graduateRut);

    //disconnect
    await businessNetworkConnection.disconnect(cardId);
    

    //return graduate object
    return graduate;
  }
  catch(err) {
    //print and return error
    console.log(err);
    console.log("EORR")
    var error = {};
    error.error = err.message;
    return error;
  }

},

/*
  * Get University data
  * @param {String} cardId Card id to connect to network
  * @param {String} universityRut Account number of university
  */
 universityData: async function (cardIdUni, registryCreator) {
  console.log(`rut: ${registryCreator}`);
  console.log(`cardiduni: ${cardIdUni}`)
  let universityRut = registryCreator;
  try {
    console.log("inside university data")
    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardIdUni);
    console.log("se conectó")
    //get university from the network
    const universityRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.University');
    const university = await universityRegistry.get(universityRut);

    //disconnect
    await businessNetworkConnection.disconnect(cardIdUni);
    

    //return university object
    return university;
  }
  catch(err) {
    //print and return error
    /*
    console.log(err);
    console.log("EORR")
    var error = {};
    error.error = err.message;
    return error;
    */
   throw err
  }

},

/*
  * Get Business data
  * @param {String} cardId Card id to connect to network
  * @param {String} businessRut Account number of business
  */
 businessData: async function (cardId, businessRut) {
  console.log(`rut: ${businessRut}`)
  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);

    //get business from the network
    const businessRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Business');
    const business = await businessRegistry.get(businessRut);

    //disconnect
    await businessNetworkConnection.disconnect(cardId);
    

    //return business object
    return business;
  }
  catch(err) {
    //print and return error
    console.log(err);
    console.log("EORR")
    var error = {};
    error.error = err.message;
    return error;
  }

},

/*
  * Create registry
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  * @param {String} partnerId Partner Id of partner
  * @param {Integer} points Points value
  */
 createRegistry: async function (cardId, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, universityRut) {
  console.log("Comienza a ejecutarse createRegistry")
  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    businessNetworkDefinition = await businessNetworkConnection.connect(cardId);
    console.log("se conecta con la red ")

    //businessNetworkDefinition = new BusinessNetworkDefinition();
    
    degreesRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Degree');
    console.log("create degreesRegistry");
    factory = businessNetworkDefinition.getFactory();

    //get the factory for the business network.
    
    var rutString = graduateRut.toString();

    //const degreeRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Degree');
    //const owner = factory.newResource(namespace, 'Graduate', rutString);

    let degree2 = factory.newResource(namespace, 'Degree', degreeId);
    

    

    degree2.owner = "org.degree.ucsd.Graduate#" + rutString;
    degree2.graduateRut = rutString;
    degree2.degreeType = degreeType;
    degree2.degreeStatus = degreeStatus;
    degree2.major = major;
    degree2.minor = minor;
    degree2.startYear = startYear;
    degree2.gradYear = gradYear;
    degree2.gpa = gpa;
    degree2.university = universityRut;
    console.log("Antes de añadir registros")
    const degree = await degreesRegistry.addAll([degree2])
    console.log("registro creado")


    return true;
  }
  catch(error) {
    //NEED TO CATCH THIS ERROR IN mainFunction()
    //var error2 = {};
    //error2.error = error.message;
    console.log(`error en create:${error}`)
    throw error; // Rethrow
  }

},

/*
  * Create only registry
  * @param {String} cardId Card id to connect to network
  * @param {String} accountNumber Account number of member
  * @param {String} partnerId Partner Id of partner
  * @param {Integer} points Points value
  */
 createOnlyRegistry: async function (cardId, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa) {
  console.log("Comienza a ejecutarse createRegistry")
  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    businessNetworkDefinition = await businessNetworkConnection.connect(cardId);
    console.log("se conecta con la red ")

    //businessNetworkDefinition = new BusinessNetworkDefinition();
    
    degreesRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Degree');
    console.log("create degreesRegistry");
    factory = businessNetworkDefinition.getFactory();

    //get the factory for the business network.
    
    var rutString = graduateRut.toString();

    //const degreeRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Degree');
    //const owner = factory.newResource(namespace, 'Graduate', rutString);

    let degree2 = factory.newResource(namespace, 'Degree', degreeId);
    

    

    degree2.owner = "org.degree.ucsd.Graduate#" + rutString;
    degree2.graduateRut = rutString;
    degree2.degreeType = degreeType;
    degree2.degreeStatus = degreeStatus;
    degree2.major = major;
    degree2.minor = minor;
    degree2.startYear = startYear;
    degree2.gradYear = gradYear;
    degree2.gpa = gpa;
    console.log("Antes de añadir registros")
    const degree = await degreesRegistry.addAll([degree2])
    console.log("registro creado")


    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error
  }

},

/*
  * Authorize Degree
  * @param {String} cardId Card id to connect to network
  * @param {String} businessRut Account number of member
  * @param {String} degreeId Account number of member
  */
 authorizeDegree: async function (cardId, businessRut, degreeId) {

  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);

    //get the factory for the business network.
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create transaction
    const transaction = factory.newTransaction(namespace, 'AuthorizeDegreeAccess');
    transaction.businessRut = businessRut;
    transaction.degreeIds = [degreeId];

    console.log(transaction)
    

    //submit transaction
    await businessNetworkConnection.submitTransaction(transaction);
    console.log("Transacción hecha")

    //disconnect
    await businessNetworkConnection.disconnect(cardId);

    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error
  }

},

/*
  * Authorize Full Registry
  * @param {String} cardId Card id to connect to network
  * @param {String} businessRut Account number of member
  */
 authorizeFullRegistry: async function (cardId, businessRut, graduate, university) {

  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);

    //get the factory for the business network.
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create transaction
    const transaction = factory.newTransaction(namespace, 'AuthorizeAccess');
    transaction.businessRut = businessRut;
    transaction.graduate = factory.newRelationship(namespace, 'Graduate', graduate);
    transaction.university = factory.newRelationship(namespace, 'University', university);
    transaction.business = factory.newRelationship(namespace, 'Business', businessRut);
    //transaction.graduate = graduate;

    console.log(transaction)
    

    //submit transaction
    await businessNetworkConnection.submitTransaction(transaction);
    console.log("Transacción hecha");

    //disconnect
    await businessNetworkConnection.disconnect(cardId);

    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error
  }

},

/*
  * Get all registries
  * @param {String} cardId Card id to connect to network
  */
 queryRegistries : async function (cardId, graduateRut) {

  try {
    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);

    //query all partners from the network
    const allRegistries = await businessNetworkConnection.query('getDegreeByGraduateRut', { graduateRut: graduateRut});

    //disconnect
    await businessNetworkConnection.disconnect(cardId);

    console.log(`egistries: ${allRegistries}`)

    //return allPartners object
    return allRegistries;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error
  }
},

queryAllRegistriesUniversities : async function (uid) {
  try {

    //get universityCardId;
    let cardIdUni = await getUniversityCardId2(uid);
    console.log(cardIdUni);


    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardIdUni);

    //query all partners from the network
    const allRegistries = await businessNetworkConnection.query('getAllDegrees');

    //disconnect
    await businessNetworkConnection.disconnect(cardIdUni);

    console.log(`egistries: ${allRegistries}`)

    //return allPartners object
    return allRegistries;
  } catch(err) {
    console.log(err);
    var error = {};
    error.error = err.message;
    return error
  }
},

//FUNCIÓN PARA CREAR USUARIO Y REGISTRO DE TITULO AL MISMO TIEMPO
//SOLO PARA SER UTILIZADO POR UNIVERSIDADES

createUserAndRegistry: async function (cardId, graduateRut, firstName, lastName, email, phoneNumber, degreeId, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, registryCreator, uid) {
  try {

    //PARA PROBAR FUNCIONES NUEVAS EL PRIMER PÁRRAFO! NO OLVIDAR COMENTARLAS AL TERMINAR
    
    //await getGraduateCardId(graduateRut);
    //ERROOOOOR PARA PROBAR AQUI!
    //let userFirebase = await createUserFirebase(email, firstName, lastName, cardId, graduateRut);
    //console.log(`userFire: ${userFirebase}`);
    
    //get universityCardId;
    let cardIdUni = await getUniversityCardId2(uid);
    console.log(cardIdUni);

    let uniRut = await getUniversityRut(uid);
    console.log(uniRut)

    //Check if user exist
    console.log("antes de firebase")
    let checkFirebase = await userExistFirebase(email);
    console.log(`dsadas: ${checkFirebase}`);
    console.log("dp de firebase");
    
    //await createUserFirebase(email, firstName, lastName, cardId);
    let checkBlockchain = await checkIfUserExists(graduateRut);
    
    //getUniversityName
    let universityInfo = await this.universityData(cardIdUni, uniRut);
    console.log(universityInfo);
    let universityRut = universityInfo.universityRut;
    //let universityRut = "170000000";
        

    console.log("Termina de ejecturarse función checkIfUserExists() y comienza el if statement de check y userFirebase")

    //if (check != true && userFirebase != true) {
    if (checkBlockchain != true && checkFirebase != true) {
    //if user does not exist
    //add graduate participant;
    console.log("No está registrado ni en la blockchain ni en firebase");
    await createUserFirebase(email, firstName, lastName, cardId, graduateRut);
    //console.log("Si check es != de true y empieza a ejecutarse función this.registerGraduate")
    await this.registerGraduate(cardId, graduateRut,firstName, lastName, email, phoneNumber);
    console.log("Comienza a ejecutarse función this.createRegistry")
    //create registry
    await this.createRegistry(cardIdUni, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, universityRut);
    console.log("Usuario y registro creado")
    return true;
    } else if (checkBlockchain != false && checkFirebase != true) {
      console.log("if checkBlockchain != false && checkFirebase != true")
      await createUserFirebase(email, firstName, lastName, cardId, graduateRut);
      console.log("dp de crear usuario firebase");
      await this.createRegistry(cardIdUni, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, universityRut);
      console.log("dp de crear registro");
      return true;
    } else if (checkBlockchain != true && checkFirebase != false) {
      console.log("if if checkBlockchain != true && checkFirebase != false")
      await this.registerGraduate(cardId, graduateRut,firstName, lastName, email, phoneNumber);
      console.log("dp de crear usuario blockchain");
      await this.createRegistry(cardIdUni, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, universityRut);
      console.log("dp de crear registro");
      return true;
    }
    else {
      console.log("dentro del else y comienza a ejecutarse this.createRegistry")
    await this.createRegistry(cardIdUni, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa, universityRut);
    console.log("Usuario ya existe. Sólo se crea registro")
    return true;
    }
    
  }
  catch(err) {
    //print and return error
    console.log(`error en createandregister: ${error}`);
    console.log(err);
    console.log("EORR")
    var error = {};
    error.error = err.message;
    return error;
  }
},

uidTest : async function (email) {
  try {
    const uid = await getUidFirebase(email);
    return uid
  } catch (err) {
    console.log(err);
    console.log("EORR")
    var error = {};
    error.error = err.message;
    return error;
  }
},

universityCardIdTest : async function (uid) {
  try {
    const cardId = await getUniversityCardId(uid);
    console.log(cardId);
    return cardId
  } catch(err) {
    console.log(err);
    console.log("EORR")
    var error = {};
    error.error = err.message;
    return error;
  }
},

queryDegreeById : async function (degreeId, uid) {
  try {
    let cardIdUni = await getUniversityCardId2(uid);
    console.log(cardIdUni);
    console.log("antes de degree")
    //query all partners from the network;

    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardIdUni);
    
    console.log(degreeId)
    const degree = await businessNetworkConnection.query('getDegreeById', { degreeId: degreeId});

    //disconnect
    await businessNetworkConnection.disconnect(cardIdUni);

    console.log(`degree: ${degree}`)

    //return allPartners object
    return degree;

  } catch(err) {
    console.log(err);
    console.log("EORR")
    var error = {};
    error.error = err.message;
    return error;
  }
},

updateDegreeData: async function (degreeId, updateData, uid) {
  let cardIdUni = await getUniversityCardId2(uid);
  console.log(cardIdUni);

  businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect(cardIdUni);

  degreesRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Degree');
  let degree = degreesRegistry.get(degreeId);
  degree.degreeStatus = updateData;

  degreesRegistry.update(degree);

  return degree
  //console.log("create degreesRegistry");
  //factory = businessNetworkDefinition.getFactory();

  //degreesRegistry.update()

  

    //let degree2 = factory.newResource(namespace, 'Degree', degreeId);
}


    //AGREGAR MAS FUNCIONES AQUI!
}