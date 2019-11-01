const functions = require('firebase-functions');
//Require express and call the 
//express function in the sameline
const app = require('express')();

const {firebaseAuthMiddleware} = require('./middlewares/auth');
const {getAllScreams, addScream} = require('./handlers/screams');
const {signup, login, uploadImage} = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', firebaseAuthMiddleware, addScream);
//Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuthMiddleware, uploadImage);

// Let Firebase know that app is 
// the container for all our routes
exports.api = functions.https.onRequest(app);