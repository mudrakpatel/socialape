const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

//Initialize Firebase application
admin.initializeApp();

//Initialize express app
const app = express();

//Let Firebase know that app is 
//the container for all our routes
exports.api = functions.https.onRequest(app);

//Get all Screams
app.get('/screams', (request, response, next) => {
    admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(document => {
            screams.push({
                screamId: document.id,
                body: document.data().body,
                userHandle: document.data().userHandle,
                createdAt: document.data().createdAt,
            });
        });
        return response.status(200).json(screams);
    })
    .catch(err => {
        return response.status(500).json({error: err.message});
    });
});

//Add a Scream
app.post('/scream', (request, response) => {
    const newScream = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    
    //Add the Scream object to firestore database
    admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then(document => {
        return response.status(201).json({
            message: `Document: ${document.id} created successfully`,
        });
    })
    .catch(err => {
        return response.status(500).json({
            error: err.message,
        });
    });
});