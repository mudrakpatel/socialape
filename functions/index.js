const functions = require('firebase-functions');
//Require express and call the 
//express function in the sameline
const app = require('express')();

const {db} = require('./util/admin');
const {firebaseAuthMiddleware} = require('./middlewares/auth');
const {
    getAllScreams,
    addScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream,
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
app.delete('/scream/:screamId', firebaseAuthMiddleware, deleteScream);
//Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuthMiddleware, uploadImage);
app.post('/user', firebaseAuthMiddleware, addUserDetails);
app.get('/user', firebaseAuthMiddleware, getAuthenticatedUser);

//Notifications trigger functions
//Create a notification document when a Scream is liked
exports.createNotificationOnLike = functions.firestore.document('likes/${id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
          .then((document) => {
              //If the Scream document exists, create a notification
              if(document.exists){
                //Give the Notification document the
                //same id as the like document.
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: document.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'like',
                    read: false,
                    screamId: document.id,
                });
              }
          }).then(() => {
              return;
          }).catch((err) => {
              console.log(err);
              //No need to send a response because this a
              //database trigger and not an API endpoint.
              return;
          });
    });

//Delete the notification for the Scream liked when
//it is unliked by the same user who liked the Scream.
exports.deleteNotificationOnUnLike = functions.firestore.document('likes/${id}')
    .onDelete((snapshot) => {
        db.doc(`/notifications/${snapshot.id}`).delete().then(() => {
            return;
        }).catch((err) => {
            console.log(err);
            return;
        });
    });

//Create a Notification when someone comments on a Scream
exports.createNotificationOnComment = functions.firestore.document('comments/${id}')
    .onCreate((snapshot) => {
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then((document) => {
                //If the Scream document exists, create a notification
                if (document.exists) {
                    //Give the Notification document the
                    //same id as the comment document.
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: document.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: document.id,
                    });
                }
            }).then(() => {
                return;
            }).catch((err) => {
                console.log(err);
                return;
            });
    });

// Let Firebase know that app is 
// the container for all our routes
exports.api = functions.https.onRequest(app);