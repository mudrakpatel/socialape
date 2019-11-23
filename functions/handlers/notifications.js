const {db} = require('../util/admin');

exports.markNotificationsRead = (request, response) => {
    //Do a batch write i.e.
    //update multiple documents in firebase.
    let batch = db.batch();
    request.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true});
    });
    batch.commit().then(() => {
        return response.json({message: 'Notifications marked read'});
    }).catch((err) => {
        return response.status(500).json({error: err});
    });
};