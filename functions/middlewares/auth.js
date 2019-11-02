const {admin, db} = require('../util/admin');

exports.firebaseAuthMiddleware = (request, response, next) => {
  let idToken;
  if(request.headers.authorization && 
     request.headers.authorization.startsWith('Bearer ')){
       //Extract the token from request headers
       //and separate it from 'Bearer ' string
       //and get the actual token.
      idToken = request.headers.authorization.split('Bearer ')[1];
  } else {
    return response.status(403).json({error: 'Unauthorized access'});
  }
  //Now verify that the token
  //was issued by our application
  //and not by any other uninvited
  //application or source.
  admin.auth().verifyIdToken(idToken)
    .then((decodedIdToken) => {
      //decodedIdToken holds user 
      //data that is inside our
      //idToken. Add this user data
      //to the request object so
      //when this request proceeds
      //forward to any other protected
      //routes, it has the data for
      //other verification purposes.
      request.user = decodedIdToken;
      //Return the user handle from
      //the firestore database
      return db.collection('users')
          //where(fieldPath:String, operationString:String, comparisionValue:any)
          .where('userId', '==', request.user.uid)
          .limit(1)
          .get();
    })
    .then((data) => {
      //Add handle property to the user object in request
      request.user.handle = data.docs[0].data().handle;
      request.user.imageURL = data.docs[0].data().imageURL;
      //Call next() to proceed towards the route when 
      //this middleware execution is finished successfully.
      return next();
    })
    .catch((err) => {
      return response.status(403).json({error: err.message});
    });
};