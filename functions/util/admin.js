const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require("../../keys/admin.json")),
  databaseURL: "https://yawp-a3379.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db }