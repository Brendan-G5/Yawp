const { db } = require('../util/admin')

exports.getAllScreams = (req, res) => {
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
      return res.json(yawps);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code })
    });
}

exports.postScream = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newYawp = {
    body: req.body.body,
    userHandle: req.user.handle,
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
}