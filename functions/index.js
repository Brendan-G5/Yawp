const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllScreams, postScream } = require('./handlers/yawps')
const { signUp, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')

//Scream Routes
app.get('/yawps', getAllScreams);
app.post('/yawp', FBAuth, postScream);

//User Routes
app.post('/signup', signUp);
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app)