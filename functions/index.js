const functions = require('firebase-functions');
const admin = require('firebase-admin');

//Initialize application
admin.initializeApp();

//getScreams function
exports.getScreams = functions.https.onRequest((request, response) => {
    admin
    .firestore()
    .collection('screams')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(document => {
            screams.push(document.data());
        });
        return response.status(200).json(screams);
    })
    .catch(err => {
        return response.status(500).json({error: err.message});
    });
});

//addScream function
exports.addScream = functions.https.onRequest((request, response) => {
    const newScream = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };

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