const firebase = require('firebase');

const {db} = require('../util/admin');
const {firebaseConfig} = require('../util/config');
const {validateSignupData, validateLoginData} = require('../util/validators');

// Initialize Firebase application
firebase.initializeApp(firebaseConfig);

//INFO: DO NOT use firebase-tools v-7.0.2
//      otherwise the signup route code will
//      not return a token. Instead, use
//      firebase-tools v-6.5.0
exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle,
  };

  //Data validation
  const {valid, errors} = validateSignupData(newUser);
  if(!valid){
    return response.status(400).json(errors);
  }

  let token, userId;
  db
  .doc(`/users/${newUser.handle}`)
  .get()
  .then((document) => {
    if(document.exists){
      return response.status(400).json({
        handle: `This Handle is already taken`
      });
    } else {
      return firebase.auth()
        .createUserWithEmailAndPassword(
        newUser.email, newUser.password);
    }
  })
  .then((data) => {
    userId = data.user.uid;
    return data.user.getIdToken();
  })
  .then((idToken) => {
    token = idToken;
    const userCredentials = {
      handle: newUser.handle,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      userId: userId
    };
    //Add userCredentials to users 
    //collection in firestore database
    return db
      .doc(`/users/${newUser.handle}`)
      .set(userCredentials);
  })
  .then(() => {
    return response.status(201).json({token});
  })
  .catch((err) => {
    if (err.message === "The email address is already in use by another account."){
      return response.status(400).json({email: 'Email is already in use'});
    } else {
      return response.status(500).json({error: err.message});
    }
  });
};

exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };

  //Data validation
  const {valid, errors} = validateLoginData(user);
  if(!valid){
    return response.status(400).json(errors);
  }

  //If no errors in user input
  //then login the user to firebase
  firebase
  .auth()
  .signInWithEmailAndPassword(
    user.email,
    user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.json({token});
    })
    .catch((err) => {
      if(err.code === 'auth/wrong-password'){
        return response.status(403).json({
          general: 'Wrong credentials, please try again'
        });
      } else {
        return response.status(500).json({error: err});
      }
    });
};