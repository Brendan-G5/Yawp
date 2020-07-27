const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require("../admin.json")),
  databaseURL: "https://yawp-a3379.firebaseio.com",
  storageBucket: "yawp-a3379.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db }