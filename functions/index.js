const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/yawps', (req, res) => {
  admin.firestore().collection('yawps').orderBy('createdAt', 'desc').get()
    .then(data => {
      let yawps = [];
      data.forEach(doc => {
        yawps.push({
          yawpId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
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
  admin.firestore()
    .collection('yawps')
    .add(newYawp)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' })
      console.error(err);
    })
});


exports.api = functions.https.onRequest(app)