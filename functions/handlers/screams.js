const {db} = require('../util/admin');

exports.getAllScreams = (request, response) => {
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
};

exports.addScream = (request, response) => {
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
};

// Get a scream by screamId route parameter
exports.getScream = (request, response) => {
  let screamData = {};
  db.doc(`/screams/${request.params.screamId}`)
    .get().then((document) => {
      if(!document.exists){
        return response.status(404).json({error: 'Scream not found'});
      }
      screamData = document.data();
      screamData.screamId = document.id;
      return db.collection('comments').orderBy('createdAt', 'desc')
      .where('screamId', '==', request.params.screamId).get();
    }).then((data) => {
      screamData.comments = [];
      data.forEach((loopDocument) => {
        screamData.comments.push(loopDocument.data());
      });
      return response.json(screamData);
    }).catch((err) => {
      return response.status(500).json({error: err});
    });
};