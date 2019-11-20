const functions = require('firebase-functions');
//Require express and call the 
//express function in the sameline
const app = require('express')();

const {firebaseAuthMiddleware} = require('./middlewares/auth');
const {
    getAllScreams,
    addScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
} = require('./handlers/screams');
const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
} = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', firebaseAuthMiddleware, addScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', firebaseAuthMiddleware, commentOnScream);
app.get('/scream/:screamId/like', firebaseAuthMiddleware, likeScream);
app.get('/scream/:screamId/unlike', firebaseAuthMiddleware, unlikeScream);
//Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuthMiddleware, uploadImage);
app.post('/user', firebaseAuthMiddleware, addUserDetails);
app.get('/user', firebaseAuthMiddleware, getAuthenticatedUser);

// Let Firebase know that app is 
// the container for all our routes
exports.api = functions.https.onRequest(app);