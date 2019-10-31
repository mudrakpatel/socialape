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