const { db } = require('../util/admin');
const { request } = require('express');

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
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };
  db.collection('yawps')
    .add(newYawp)
    .then(doc => {
      const resYawp = newYawp;
      resYawp.yawpId = doc.id;
      res.json(resYawp)
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' })
      console.error(err);
    })
}

exports.getYawp = (req, res) => {
  let yawpData = {}
  db.doc(`/yawps/${req.params.yawpId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Yawp not found' })
      }
      yawpData = doc.data();
      yawpData.yawpId = doc.id;
      return db.collection('comments').orderBy('createdAt', 'desc').where('yawpId', '==', req.params.yawpId).get()
    })
    .then(data => {
      yawpData.comments = [];
      data.forEach(doc => {
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
  if (req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty' })
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    yawpId: req.params.yawpId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };
  db.doc(`/yawps/${req.params.yawpId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Yawp not found' })
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1})
    })
    .then(() => {
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

exports.likeYawp = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('yawpId', '==', req.params.yawpId).limit(1);

  const yawpDocument = db.doc(`/yawps/${req.params.yawpId}`);

  let yawpData;

  yawpDocument.get()
    .then(doc => {
      if(doc.exists) {
        yawpData = doc.data();
        yawpData.yawpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Yawp not found'})
      }
    })
    .then(data => {
      if(data.empty) {
        return db.collection('likes').add({
          yawpId: req.params.yawpId,
          userHandle: req.user.handle
        })
        .then(() => {
          yawpData.likeCount++
          return yawpDocument.update({likeCount: yawpData.likeCount});
        })
        .then(() => {
          return res.json(yawpData);
        })
      } else {
        return res.status(400).json({ error: 'Yawp already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
}

exports.unlikeYawp = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('yawpId', '==', req.params.yawpId).limit(1);

  const yawpDocument = db.doc(`/yawps/${req.params.yawpId}`);

  let yawpData;

  yawpDocument.get()
    .then(doc => {
      if(doc.exists) {
        yawpData = doc.data();
        yawpData.yawpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Yawp not found'})
      }
    })
    .then(data => {
      if(data.empty) {
        return res.status(400).json({ error: 'Yawp not liked' });

      } else {
        return db.doc(`/likes/${data.docs[0].id}`).delete()
          .then(() => {
            yawpData.likeCount--;
            return yawpDocument.update({likeCount: yawpData.likeCount})
          })
          .then(() => {
            return res.json(yawpData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
}

exports.deleteYawp = (req, res) => {
  const document = db.doc(`/yawps/${req.params.yawpId}`);
  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: 'Yawp not found'});
      }
      if(doc.data().userhandle !== req.userHandle){
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then (() => {
      res.json({ message: 'Yawp deleted successfully'});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code});
    })
}