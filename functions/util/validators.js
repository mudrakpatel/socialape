//isEmpty helper function
const isEmpty = (anyString) => {
  if(anyString.trim() === ''){
    return true;
  } else {
    return false;
  }
};

//isEmail helper function
const isEmail = (email) => {
  const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(regularExpression)){
    return true;
  } else {
    return false;
  }
};

exports.validateSignupData = (data) => {
  //Validate data
  //Email address validation
  let errors = {};
  if (isEmpty(data.email)) {
    errors.email = 'Email address must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Invalid email address';
  }
  //Password validation
  if (isEmpty(data.password)) {
    errors.password = 'Password must not be empty';
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  //User handle validation
  if (isEmpty(data.handle)) {
    errors.handle = 'User handle must not be empty';
  }

  return {
    errors,
    //Check if errors object is empty.
    //If errors object has any errors
    //then return appropriate response.
    valid: (Object.keys(errors).length === 0) ? true : false,
  };
};

exports.validateLoginData = (data) => {
  //Validate data
  //Email address validation
  let errors = {};
  if (isEmpty(data.email)) {
    errors.email = 'Email address must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Invalid email address';
  }
  //Password validation
  if (isEmpty(data.password)) {
    errors.password = 'Password must not be empty';
  }
  return {
    errors,
    valid: (Object.keys(errors).length === 0) ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};
  if(!isEmpty(data.bio.trim())){
    userDetails.bio = data.bio;
  }
  if(!isEmpty(data.website.trim())){
    //Check if the user website has 
    //'http://' prefix.
    //If prefix is not there
    //then add 'http://' prefix to the
    //user website
    if(data.website.trim().substring(0, 4) !== 'http'){
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website.trim();
    }
  }
  //Location
  if(!isEmpty(data.location.trim())) {
    userDetails.location = data.location.trim();
  }
  return userDetails;
};