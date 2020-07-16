const { db } = require('../util/admin')

exports.getAllYawps = (req, res) => {
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

exports.postYawp = (req, res) => {
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

exports.getYawp = (req,res) => {
  let yawpData = {}
  db.doc(`/yawps/${req.params.yawpId}`).get()
    .then(doc => {
      if (!doc.exists){
        return res.status(404).json({ error: 'Yawp not found'})
      }
      yawpData = doc.data();
      yawpData.yawpId = doc.id;
      return db.collection('comments').orderBy('createdAt', 'desc').where('yawpId', '==', req.params.yawpId).get()
    })
    .then(data => {
      yawpData.comments = [];
      data.forEach( doc => {
        yawpData.comments.push(doc.data())
      })
      return res.json(yawpData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
}

exports.commentOnYawp = (req, res) => {
  if (req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty'})
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    yawpId: req.params.yawpId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };
  db.doc(`/yawps/${req.params.yawpId}`).get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Yawp not found' })
      }
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' })
    })
}