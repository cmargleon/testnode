const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

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
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
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
 universityData: async function (cardId, universityRut) {
  console.log(`rut: ${universityRut}`)
  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);

    //get university from the network
    const universityRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.University');
    const university = await universityRegistry.get(universityRut);

    //disconnect
    await businessNetworkConnection.disconnect(cardId);
    

    //return university object
    return university;
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
 createRegistry: async function (cardId, degreeId, graduateRut, owner, degreeType, degreeStatus, major, minor, startYear, gradYear, gpa) {
  console.log(degreeType)
  try {

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    businessNetworkDefinition = await businessNetworkConnection.connect(cardId);
    

    //businessNetworkDefinition = new BusinessNetworkDefinition();
    
    degreesRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Degree');
    console.log(degreeType);
    factory = businessNetworkDefinition.getFactory();
    console.log(degreeType);

    //get the factory for the business network.
    
    var rutString = graduateRut.toString();

    //const degreeRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.Degree');
    const owner = factory.newResource(namespace, 'Graduate', rutString);

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
    console.log(degree2)
    return degreesRegistry.addAll([degree2])
    console.log("aqui")


    degree;
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

    //AGREGAR MAS FUNCIONES AQUI!
}