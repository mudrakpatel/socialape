const admin = require('firebase-admin');
const {firebaseConfig} = require('./config');

admin.initializeApp(firebaseConfig);
//Initialize firestore database
const db = admin.firestore();

//exports
module.exports = {
    admin,
    db
};