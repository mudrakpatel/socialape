const firebase = require('firebase');

const {admin, db} = require('../util/admin');
const {firebaseConfig} = require('../util/config');
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails
} = require('../util/validators');

// Initialize Firebase application
firebase.initializeApp(firebaseConfig);

//New user signup handler
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
  //Associate default profile picture to the user.
  //They can change this picture later.
  const noImg = 'no-img.png';

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
      imageURL: `https://firebasestorage.googleapis.com/v0/b/${
        firebaseConfig.storageBucket
      }/o/${noImg}?alt=media`,
      userId: userId,
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

//Login handler
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

//Upload profile image handler
exports.uploadImage = (request, response) => {
  //Imports
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  //Instantiate an instance of busboy
  const busboy = new BusBoy({headers: request.headers});
  let imageFileName;
  let imageToBeUploaded = {};
  //file event
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    //Validate mimetype type to
    //ensure that users only
    //upload .jpg or .png files.
    if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
      return response.status(400).json({error: 'JPEG/JPG or PNG file types ONLY accepted'});
    }
    //Get the extension of the image file
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    //Give image file a random name
    imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
    //Get the filepath
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {filepath, mimetype};
    //Create the image file
    file.pipe(fs.createWriteStream(filepath));
  });
  //finish event
  busboy.on('finish', () => {
    //Upload the image
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype,
        },
      },
    })
    .then(() => {
      //Construct the image URL to add it to the user
      const imageURL = 
      `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
      //Add the imageURL to the appropriate
      //user document in the users collection
      return db
        .doc(`/users/${request.user.handle}`)
        .update({imageURL: imageURL});
    })
    .then((data) => {
      return response.status(200).json({message: 'Image uploaded successfully'});
    })
    .catch((err) => {
      return response.status(500).json({error: err});
    });
  });
  //End the WriteableStream
  busboy.end(request.rawBody);
};

//addUserDetails handler
exports.addUserDetails = (request, response) => {
  let userDetails = reduceUserDetails(request.body);
  //Look for the logged in user
  //and update the details
  db.doc(`/users/${request.user.handle}`)
    .update(userDetails).then(() => {
      return response.status(200).json({
        message: 'User details updated successfully',
      });
    }).catch((err) => {
      return response.status(500).json({error: err});
    });
};

//getAuthenticatedUser route handler
//Gets the loggedin user details
exports.getAuthenticatedUser = (request, response) => {
  let userData = {};
  //Get the loggedin user
  db.doc(`/users/${request.user.handle}`).get()
    .then((document) => {
      if(document.exists){
        userData.credentials = document.data();
        return db.collection('likes')
          .where('userHandle', '==', request.user.handle).get();
      }
    }).then((data) => {
      userData.likes = [];
      data.forEach(document => {
        userData.likes.push(document.data());
      });
      //Notifications needs to accessed so
      //they can be shown on the front-end.
      //Notifications limit: 10
      return db.collection('notifications')
        .where('recipient', '==', request.user.handle)
        .orderBy('createdAt', 'desc').limit(10).get();
    }).then((data) => {
      userData.notifications = [];
      data.forEach(document => {
        userData.notifications.push({
          recipient: document.data().recipient,
          sender: document.data().sender,
          createdAt: document.data().createdAt,
          screamId: document.data().screamId,
          type: document.data().type,
          read: document.data().read,
          notificationId: document.id,
        });
      });
      return response.json(userData);
    }).catch((err) => {
      return response.status(500).json({error: err});
    });
};