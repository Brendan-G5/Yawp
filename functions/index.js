const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin')

const { getAllYawps, postYawp, getYawp, commentOnYawp, likeYawp, unlikeYawp, deleteYawp } = require('./handlers/yawps')
const { signUp, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')

//Yawp Routes
app.get('/yawps', getAllYawps);
app.post('/yawp', FBAuth, postYawp);
app.get('/yawp/:yawpId', getYawp);
app.post('/yawp/:yawpId/comment', FBAuth, commentOnYawp);
app.get('/yawp/:yawpId/like', FBAuth, likeYawp)
app.get('/yawp/:yawpId/unlike', FBAuth, unlikeYawp)
app.delete('/yawp/:yawpId', FBAuth, deleteYawp)


//User Routes
app.post('/signup', signUp);
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate(snapshot => {
    db.doc(`/yawps/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipiant: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            yawpId: doc.id
          })
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err)
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
.onDelete(snapshot => {
  db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .then(() => {
      return;
    })
    .catch(err => {
      console.error(err);
      return
    })

})

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
  .onCreate(snapshot => {
    db.doc(`/yawps/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipiant: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            yawpId: doc.id
          })
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err)
        return;
      });
  });
