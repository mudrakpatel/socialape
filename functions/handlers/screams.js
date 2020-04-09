//Import the initialized firestore database
const {db} = require('../util/admin');

//Handler to get all Screams from the database
exports.getAllScreams = (request, response) => {
  db
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
          commentCount: document.data().commentCount,
          likeCount: document.data().likeCount,
          userImage: document.data().userImage,
        });
      });
      return response.status(200).json(screams);
    })
    .catch(err => {
      return response.status(500).json({error: err.message});
    });
};

//handler to add a Scream to the database
exports.addScream = (request, response) => {
  if(request.body.body.trim() === ''){
    return response.status(400).json({body: 'Body must not be empty!'});
  }

  const newScream = {
    body: request.body.body,
    userHandle: request.user.handle,
    createdAt: new Date().toISOString(),
    userImage: request.user.imageURL,
    likeCount: 0,
    commentCount: 0,
  };

  // Add the Scream object to firestore database
  db
    .collection('screams')
    .add(newScream)
    .then(document => {
      const responseScream = newScream;
      responseScream.screamId = document.id;
      return response.status(201).json(responseScream);
    })
    .catch(err => {
      return response.status(500).json({
        error: err.message
      });
    });
};

// Handler to get a scream by screamId route parameter
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

//Add a comment to a Scream
exports.commentOnScream = (request, response) => {
  //Validate data for empty strings
  if(request.body.body.trim() === ''){
    return response.status(400).json({comment: 'Comment must not be empty'});
  }
  const commentsCollectionReference = db.collection('comments');
  const newCommentId = commentsCollectionReference.doc().id;
  const newComment = {
    commentId: newCommentId,
    screamId: request.params.screamId,
    createdAt: new Date().toISOString(),
    userHandle: request.user.handle,
    body: request.body.body,
    userImage: request.user.imageURL,
  };
  db.doc(`/screams/${request.params.screamId}`).get()
    .then((document) => {
      //Check if the scream still exists.
      if(!document.exists){
        return response.status(404).json({
          error: 'Scream not found'
        });
      }
      return document.ref.update({
        commentCount: document.data().commentCount + 1
      });
    }).then(() => {
      //Add the new comment to the database
      commentsCollectionReference.doc(newCommentId).set(newComment, {
        merge: true,
      });
      return response.json(newComment);
    }).catch((err) => {
      return response.status(500).json({error: err});
    });
};

//Handler to delete a comment posted on a Scream
exports.deleteComment = (request, response) => {
  //Get a reference to the comment document
  const commentDocument = db.doc(`/comments/${request.params.commentId}`);
  commentDocument.get().then((parameterDocument) => {
    //Check if the query returned the document or not.
    //If no document returned then it does not exist.
    if (!parameterDocument.exists) {
      return response.status(404).json({
        error: 'Comment not found'
      });
    }
    //If the Comment is found, then verify that the
    //user who posted the comment is the same user
    //who is currently logged in. Because one user
    //should not be able to delete a comment posted
    //by another user.
    if (parameterDocument.data().userHandle !== request.user.handle) {
      return response.status(403).json({
        error: 'Unauthorized'
      });
    } else {
      //Decrement comment count by 1
      //of the associated Scream.
      db.doc(`/screams/${parameterDocument.data().screamId}`)
        .get().then((screamDocument) => {
          if(screamDocument.data().commentCount === 0){
            return response.status(500).json({
              error: 'Comment cannot be deleted due to internal server error',
            });
          } else {
            screamDocument.ref.update({
              commentCount: screamDocument.data().commentCount - 1
            });
          }
        });
      //Delete the comment document
      //from the firestore database.
      return commentDocument.delete();
    }
  }).then(() => {
    return response.json({message: "Comment deleted successfully"});
  }).catch((err) => {
    return response.status(500).json({error: err.message});
  });
};

//Handler to like a Scream
exports.likeScream = (request, response) => {
  //Check whether the logged in user
  //has liked this particular scream or not
  const likeDocument = db.collection('likes')
    .where('userHandle', '==', request.user.handle)
    .where('screamId', '==', request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${request.params.screamId}`);
  let screamData;

  //Check whether this scream document exists
  screamDocument.get().then((document) => {
    if(document.exists){
      screamData = document.data();
      screamData.screamId = document.id;
      return likeDocument.get();
    } else {
      return response.status(404).json({error: 'Scream not found!'});
    }
  }).then((data) => {
    //Check if the data array is empty.
    //If it is empty, then we can create
    //a like document to indicate that the
    //currently logged in user has liked
    //this particular scream.
    if(data.empty){
      return db.collection('likes').add({
        screamId: request.params.screamId,
        userHandle: request.user.handle,
      }).then(() => {
        screamData.likeCount++;
        //Now update the likeCount property
        //in the scream document associated
        //with this scream.
        return screamDocument.update({likeCount: screamData.likeCount});
      }).then(() => {
        return response.json(screamData);
      });
    } else {
      //If the execution of this else
      //block takes place then it means
      //that the currently logged in
      //user has already liked this
      //particular scream so the server
      //can return appropriate response.
      return response.status(400).json({error: 'Scream already liked'});
    }
  }).catch((err) => {
    return response.status(500).json({error: err});
  });
};

//Handler to unlike a Scream
exports.unlikeScream = (request, response) => {
  //Check whether the logged in user
  //has liked this particular scream or not
  const likeDocument = db.collection('likes')
    .where('userHandle', '==', request.user.handle)
    .where('screamId', '==', request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${request.params.screamId}`);
  let screamData;

  //Check whether this scream document exists
  screamDocument.get().then((document) => {
    if (document.exists) {
      screamData = document.data();
      screamData.screamId = document.id;
      return likeDocument.get();
    } else {
      return response.status(404).json({
        error: 'Scream not found!'
      });
    }
  }).then((data) => {
    //Check if the data array is empty.
    if (data.empty) {
      //If the above condition is true
      //then it means that the currently
      //logged in user has not liked this
      //particular Scream so the user cannot
      //unlike this Scream because to do
      //that, the user who wants to unlike
      //this Scream has to like this Scream to
      //begin with.
      return response.status(400).json({
        error: 'Scream not liked'
      });
    } else {
      return db.doc(`/likes/${data.docs[0].id}`).delete()
        .then(() => {
          screamData.likeCount--;
          return screamDocument.update({likeCount: screamData.likeCount});
        }).then(() => {
          return response.json(screamData);
        });
    }
  }).catch((err) => {
    return response.status(500).json({
      error: err.code
    });
  });
};

//Handler to delete a Scream
exports.deleteScream = (request, response) => {
  //Get a reference to the Scream document
  const document = db.doc(`/screams/${request.params.screamId}`);
  document.get().then((parameterDocument) => {
    //Check if the query returned the document or not.
    //If no document returned then it does not exist.
    if(!parameterDocument.exists){
      return response.status(404).json({error: 'Scream not found'});
    }
    //If the Scream is found, then verify that the
    //user who created the Scream is the same user
    //who is currently logged in because one user
    //should not be able to delete scream posted
    //by another user.
    if(parameterDocument.data().userHandle !== request.user.handle){
      return response.status(403).json({error: 'Unauthorized'});
    } else {
      return document.delete();
    }
  }).then(() => {
    return response.json({message: 'Scream deleted successfully'});
  }).catch((err) => {
    return response.status(500).json({error: err});
  });
};