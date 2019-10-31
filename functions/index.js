const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
//Require express and call the 
//express function in the sameline
const app = require('express')();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDlr92_c-e59rhX_hbPLEOIE3W0NaSsImg',
  authDomain: 'socialapemudrak.firebaseapp.com',
  databaseURL: 'https://socialapemudrak.firebaseio.com',
  projectId: 'socialapemudrak',
  storageBucket: 'socialapemudrak.appspot.com',
  messagingSenderId: '262707378891',
  appId: '1:262707378891:web:b44608d4ad5e0ba2dab94e',
  measurementId: 'G-YP2ZGHSQHS'
};

// Initialize Firebase application
firebase.initializeApp(firebaseConfig);
admin.initializeApp(firebaseConfig);
//Initialize firestore database
const db = admin.firestore();

// Let Firebase know that app is 
// the container for all our routes
exports.api = functions.https.onRequest(app);

// Get all Screams
app.get('/screams', (request, response, next) => {
  db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = []
      data.forEach(document => {
        screams.push({
          screamId: document.id,
          body: document.data().body,
          userHandle: document.data().userHandle,
          createdAt: document.data().createdAt
        });
      });
      return response.status(200).json(screams)
    })
    .catch(err => {
      return response.status(500).json({error: err.message});
    });
});

// Add a Scream
app.post('/scream', (request, response) => {
  const newScream = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: new Date().toISOString()
  };

  // Add the Scream object to firestore database
  db
    .collection('screams')
    .add(newScream)
    .then(document => {
      return response.status(201).json({
        message: `Document: ${document.id} created successfully`
      });
    })
    .catch(err => {
      return response.status(500).json({
        error: err.message
      });
    });
});

//Sign Up route
app.post('/signup', (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle,
  };
  //TODO: Validate data
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
    return data.user.getIdToken(); //Token is not being returned
  })
  .then((token) => {
    return response.status(201).json({token});
  })
  .catch((err) => {
    return response.status(500).json({error: err.message});
  });
});