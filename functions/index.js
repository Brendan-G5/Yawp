const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin')

const { getAllYawps, postYawp, getYawp, commentOnYawp, likeYawp, unlikeYawp, deleteYawp } = require('./handlers/yawps')
const { signUp, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationRead } = require('./handlers/users')

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
app.get('/user/:handle', getUserDetails)
app.post('/notifications', FBAuth, markNotificationRead)

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/yawps/${snapshot.data().yawpId}`).get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().user) {
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
      .catch(err => {
        console.error(err)
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
.onDelete((snapshot) => {
  return db.doc(`/notifications/${snapshot.id}`)
  .delete()
  .catch(err => {
      console.error(err);
      return;
    })

})

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
  .onCreate(snapshot => {
    return db.doc(`/yawps/${snapshot.data().yawpId}`).get()
      .then(doc => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().user) {
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
      .catch(err => {
        console.error(err)
        return;
      });
  });

exports.onUserImageChange = functions.firestore.document('users/{userId}')
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db.collection('yawps').where('userHandle', '==', change.before.data().handle).get()
        .then(data => {
          data.forEach(doc => {
            const yawp = db.doc(`/yawps/${doc.id}`);
            batch.update(yawp, {
              userImage: change.after.data().imageUrl
            })
          })
          return batch.commit();
        })
    } else return true;
  })

exports.onYawpDelete = functions.firestore.document('yawps/{yawpId}')
  .onDelete((snapshot, context) => {
    const yawpId = context.params.yawpId;
    const batch = db.batch();
    return db.collection('comments').where('yawpId', '==', yawpId).get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('yawpId', '==', yawpId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db.collection('notifications').where('yawpId', '==', yawpId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit();
      })
      .catch(err => {
        console.error(err)
      })

  })
