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
    getUserDetails,
} = require('./handlers/users');
const { markNotificationsRead } = require('./handlers/notifications');

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
app.get('/user/:handle', getUserDetails);
//Notifications routes
app.post('/notifications', firebaseAuthMiddleware, markNotificationsRead);

//Database triggers

//Notifications trigger functions
//Create a notification document when a Scream is liked
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
          .then((document) => {
              //If the Scream document exists, create a notification
              if (document.exists && 
                  document.data().userHandle !== snapshot.data().userHandle) {
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
          }).catch((err) => {
              console.log(err);
              //No need to send a response because this a
              //database trigger and not an API endpoint.
          });
    });

//Delete the notification for the Scream liked when
//it is unliked by the same user who liked the Scream.
exports.deleteNotificationOnUnLike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`).delete().catch((err) => {
            console.log(err);
            return;
        });
    });

//Create a Notification when someone comments on a Scream
exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then((document) => {
                //If the Scream document exists, create a notification
                if (document.exists &&
                    document.data().userHandle !== snapshot.data().userHandle) {
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
            }).catch((err) => {
                console.log(err);
                return;
            });
    });

//Database trigger to change userImage in all
//Scream documents associated with this user
exports.onUserImageChange = functions.firestore.document('/users/{userId}')
    .onUpdate((change) => {
        //change object holds two properties i.e.
        //1) before it(snapshot) was edited and
        //2) after it was edited.
        //We want to change the userImage in
        //multiple documents of screams collection
        //so we can do a batch write.
        if(change.before.data().imageURL !== change.after.data().imageURL){
            console.log('image has changed');            
            const batch = db.batch();
            return db.collection('screams')
                //In each document of users collection
                //the 'userHandle' field of each document
                //of screams collection, is called 'handle'.
                .where('userHandle', '==', change.before.data().handle).get()
                .then((data) => {
                    data.forEach(document => {
                        const scream = db.doc(`/screams/${document.id}`);
                        batch.update(scream, {userImage: change.after.data().imageURL});
                    });
                    return batch.commit();
                });
        }
    });

//Database trigger to delete likes, comments and notifications
//associated with a Scream when that Scream is deleted.
exports.onScreamDelete = functions.firestore.document('/screams/{screamId}').onDelete((snapshot, context) => {
    //context object has the URL parameters
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db.collection('comments').where('screamId', '==', screamId).get().then((data) => {
        data.forEach(document => {
            //Delete all comments posted on that Scream.
            batch.delete(db.doc(`/comments/${document.id}`));
        });
        //Return all likes posted on that Scream.
        //Deleting these likes will be handled in
        //the next 'then' block.
        return db.collection('likes').where('screamId', '==', screamId);
    }).then((data) => {
        data.forEach(document => {
            //Delete all likes posted on that Scream.
            batch.delete(db.doc(`/likes/${document.id}`));
        });
        //Return all notifications regarding that Scream.
        //Deleting those notifications will be handled in
        //the next 'then' block.
        return db.collection('notifications').where('screamId', '==', screamId);
    }).then((data) => {
        data.forEach(document => {
            batch.delete(db.doc(`/notifications/${document.id}`));
        });
        //Commit and return the batch commit after all the batch deletes.
        return batch.commit();
    }).catch((err) => {
        console.error(err);
    });
});

// Let Firebase know that app is 
// the container for all our routes
exports.api = functions.https.onRequest(app);