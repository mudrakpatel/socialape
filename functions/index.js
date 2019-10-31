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

//Middlewares
//firebaseAuth
const firebaseAuthMiddleware = (request, response, next) => {
  let idToken;
  if(request.headers.authorization && 
     request.headers.authorization.startsWith('Bearer ')){
       //Extract the token from request headers
       //and separate it from 'Bearer ' string
       //and get the actual token.
      idToken = request.headers.authorization.split('Bearer ')[1];
  } else {
    return response.status(403).json({error: 'Unauthorized access'});
  }
  //Now verify that the token
  //was issued by our application
  //and not by any other uninvited
  //application or source.
  admin.auth().verifyIdToken(idToken)
    .then((decodedIdToken) => {
      //decodedIdToken holds user 
      //data that is inside our
      //idToken. Add this user data
      //to the request object so
      //when this request proceeds
      //forward to any other protected
      //routes, it has the data for
      //other verification purposes.
      request.user = decodedIdToken;
      //Return the user handle from
      //the firestore database
      return db.collection('users')
          //where(fieldPath:String, operationString:String, comparisionValue:any)
          .where('userId', '==', request.user.uid)
          .limit(1)
          .get();
    })
    .then((data) => {
      //Add handle property to the user object in request
      request.user.handle = data.docs[0].data().handle;
      //Call next() to proceed towards the route when 
      //this middleware execution is finished successfully.
      return next();
    })
    .catch((err) => {
      return response.status(403).json({error: err.message});
    });
};

// Get all Screams
app.get('/screams', (request, response) => {
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
      return response.status(200).json(screams);
    })
    .catch(err => {
      return response.status(500).json({error: err.message});
    });
});

// Add a Scream
app.post('/scream', firebaseAuthMiddleware, (request, response) => {
  const newScream = {
    body: request.body.body,
    userHandle: request.user.handle,
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
//INFO: DO NOT use firebase-tools v-7.0.2
//      otherwise the signup route code will
//      not return a token. Instead, use
//      firebase-tools v-6.5.0
app.post('/signup', (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle,
  };

  //Validate data
  //Email address vaalidation
  let errors = {};
  if(isEmpty(newUser.email)){
    errors.email = 'Email address must not be empty';
  } else if(!isEmail(newUser.email)){
    errors.email = 'Invalid email address';
  }
  //Password validation
  if(isEmpty(newUser.password)){
    errors.password = 'Password must not be empty';
  }
  if(newUser.password !== newUser.confirmPassword){
    errors.confirmPassword = 'Passwords must match';
  }
  //User handle validation
  if(isEmpty(newUser.handle)){
    errors.handle = 'User handle must not be empty';
  }

  //Check if errors object is empty.
  //If errors object has any errors
  //then return appropriate response.
  if(Object.keys(errors).length > 0){
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
});

//Login route
app.post('/login', (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };
  let errors = {};
  //User input validation
  if(isEmpty(user.email)){
    errors.email = 'Email address must not be empty';
  } else if(!isEmail(user.email)){
    errors.email = 'Invalid email address';
  }
  if(isEmpty(user.password)){
    errors.password = 'Password must not be empty';
  }
  //Check if errors object has
  //any errors or not. If any
  //errors present, then return
  //appropriate response.
  if(Object.keys(errors).length > 0){
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
});

//Helper methods

//isEmpty helper function
const isEmpty = (anyString) => {
  if (anyString.trim() === '') {
    return true;
  } else {
    return false;
  }
};

const isEmail = (email) => {
  const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(regularExpression)){
    return true;
  } else {
    return false;
  }
};