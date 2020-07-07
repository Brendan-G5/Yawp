const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const config = {
  apiKey: "AIzaSyCuwOwBWA4K21lUgTvW2usRswJXMcEYf4M",
  authDomain: "yawp-a3379.firebaseapp.com",
  databaseURL: "https://yawp-a3379.firebaseio.com",
  projectId: "yawp-a3379",
  storageBucket: "yawp-a3379.appspot.com",
  messagingSenderId: "552738769198",
  appId: "1:552738769198:web:1045a7ba1ee08e0af412bf",
  measurementId: "G-DMHHEMBMWM"
};


const firebase = require('firebase');
const { DatabaseBuilder } = require('firebase-functions/lib/providers/firestore');
const { user } = require('firebase-functions/lib/providers/auth');
firebase.initializeApp(config);

const db = admin.firestore();


app.get('/yawps', (req, res) => {
  db.collection('yawps').orderBy('createdAt', 'desc').get()
    .then(data => {
      let yawps = [];
      data.forEach(doc => {
        yawps.push({
          yawpId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      })
      return res.json(yawps)
        .catch(err => console.error(err))
    });
});

app.post('/yawp', (req, res) => {
  const newYawp = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  db.collection('yawps')
    .add(newYawp)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' })
      console.error(err);
    })
});

//Sign-up Route

app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  //TODO: validate this data
  let token, userId;
  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'this handle is already taken' })
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      }
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'email is already in use'});
      } else {
        return res.status(500).json({ error: err.code })
      }
    })
});

exports.api = functions.https.onRequest(app)