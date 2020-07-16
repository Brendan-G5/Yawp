const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

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

// TODO: delete yawp



//User Routes
app.post('/signup', signUp);
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app)