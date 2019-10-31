const admin = require('firebase-admin');

admin.initializeApp(firebaseConfig);
//Initialize firestore database
const db = admin.firestore();

//exports
module.exports = {
    admin,
    db
};