module.exports = {

    /*
    * Validata graduate registration fields ensuring the fields meet the criteria
    * @param {String} cardId
    * @param {String} graduateRut
    * @param {String} firstName
    * @param {String} lastName
    * @param {String} phoneNumber
    * @param {String} email
    */
    validateGraduateRegistration: async function(graduateRut, cardId, firstName, lastName, phoneNumber, email) {
  
      var response = {};
  
      //verify input otherwise return error with an informative message
      if (graduateRut.length < 7 && graduateRut.lenght > 8) {
        response.error = "Account number must be at least six digits long";
        console.log(response.error);
        return response;
      } else if (!isInt(graduateRut)) {
        response.error = "Account number must be all numbers";
        console.log(response.error);
        return response;
      } else if (cardId.length < 1) {
        response.error = "Enter access key";
        console.log(response.error);
        return response;
      } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
        response.error = "Card id can be letters and numbers only";
        console.log(response.error);
        return response;
      } else if (firstName.length < 1) {
        response.error = "Enter first name";
        console.log(response.error);
        return response;
      } else if (!/^[a-zA-Z]+$/.test(firstName)) {
        response.error = "First name must be letters only";
        console.log(response.error);
        return response;
      } else if (lastName.length < 1) {
        response.error = "Enter last name";
        console.log(response.error);
        return response;
      } else if (!/^[a-zA-Z]+$/.test(lastName)) {
        response.error = "First name must be letters only";
        console.log(response.error);
        return response;
      } else if (email.length < 1) {
        response.error = "Enter email";
        console.log(response.error);
        return response;
      } else if (!validateEmail(email)) {
        response.error = "Enter valid email";
        console.log(response.error);
        return response;
      } else if (phoneNumber.length < 1) {
        response.error = "Enter phone number";
        console.log(response.error);
        return response;
      } else if (!validatePhoneNumber(phoneNumber)) {
        response.error = "Enter valid phone number";
        console.log(response.error);
        return response;
      } else {
        console.log("Valid Entries");
        return response;
      }
  
    },
  
    /*
    * Validata partner registration fields ensuring the fields meet the criteria
    * @param {String} cardId
    * @param {String} universityRut
    * @param {String} shortName
    * @param {String} fullName
    * @param {String} email
    */
    validateUniversityRegistration: async function(universityRut, cardId, shortName, fullName, email) {
  
      var response = {};
  
      //verify input otherwise return error with an informative message
      if (cardId.length < 1) {
        response.error = "Enter access key";
        console.log(response.error);
        return response;
      } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
        response.error = "Access key can be letters and numbers only";
        console.log(response.error);
        return response;
      } else if (universityRut.length < 1) {
        response.error = "Enter partner id";
        console.log(response.error);
        return response;
      } else if (!/^[0-9a-zA-Z]+$/.test(universityRut)) {
        response.error = "Partner id can be letters and numbers only";
        console.log(response.error);
        return response;
      } else if (shortName.length < 1) {
        response.error = "Enter company name";
        console.log(response.error);
        return response;
      } else if (!/^[a-zA-Z]+$/.test(shortName)) {
        response.error = "Company name must be letters only";
        console.log(response.error);
        return response;
      } else {
        console.log("Valid Entries");
        return response;
      }
  
    },

        /*
    * Validata partner registration fields ensuring the fields meet the criteria
    * @param {String} cardId
    * @param {String} businessRut
    * @param {String} shortName
    * @param {String} fullName
    * @param {String} email
    */
   validateBusinessRegistration: async function(businessRut, cardId, shortName, fullName, email) {
  
    var response = {};

    //verify input otherwise return error with an informative message
    if (cardId.length < 1) {
      response.error = "Enter access key";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Access key can be letters and numbers only";
      console.log(response.error);
      return response;
    } else if (businessRut.length < 1) {
      response.error = "Enter partner id";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(businessRut)) {
      response.error = "Partner id can be letters and numbers only";
      console.log(response.error);
      return response;
    } else if (shortName.length < 1) {
      response.error = "Enter company name";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(shortName)) {
      response.error = "Company name must be letters only";
      console.log(response.error);
      return response;
    } else {
      console.log("Valid Entries");
      return response;
    }

  },
  
    validatePoints: async function(points) {
  
      //verify input otherwise return error with an informative message
      if (isNaN(points)) {
        response.error = "Points must be number";
        console.log(response.error);
        return response;
      } else {
        return Math.round(points);
      }
  
    }
  
  }
  
  
  //stackoverflow
  function isInt(value) {
    return !isNaN(value) && (function(x) {
      return (x | 0) === x;
    })(parseFloat(value))
  }
  
  //stackoverflow
  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
  //stackoverflow
  function validatePhoneNumber(phoneNumber) {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phoneNumber));
  }
  