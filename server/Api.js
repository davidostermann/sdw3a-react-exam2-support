const express = require('express');
const {Router} = express;

const mongoose = require('mongoose');
const User = require('./model/User');
const Project = require('./model/Project');

const bodyParser = require('body-parser');
const router = Router();

// Connect to our database
mongoose.connect('mongodb://localhost:27017/kickass');

router.use(bodyParser.json({'extended': true}));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.send('coucou api');
});

router.get('/users', (req, res) => {

  User.find()
  .exec((err, users) => {
    if (err) { res.send(err); }
    res.json(users);
  });

});

router.post('/user', (req, res) => {
  const user = new User()
  user.name = req.body.name
  user.type = req.body.type
  user.age = req.body.age

    // save the user and check for errors
  user.save((err, user) => {
    if (err) {
      return res.send(err)
    }
    res.json(user)
  })
});

router.get('/user/:id', (req, res) => {

  User.findOne({_id: req.params.id})
  .exec((err, user) => {
    if (err) { res.send(err); }
    res.json(user);
  });

});

router.get('/user/:id/projects', (req, res) => {

  Project.find({_creator: req.params.id})
  .exec((err, projects) => {
    if (err) { res.send(err); }
    res.json(projects);
  });

});

router.put('/user/:id', (req, res) => {

  console.log('req.params.id : ', req.params.id)

  User.findByIdAndUpdate(req.params.id, { $set: req.body}, {new: true}, (err, user) => {
    console.log('user : ', user)
    if (err) {
      return res.send(err).status(500);
    }
    res.json(user)
  });
});

router.delete('/user/:id', (req, res) => {

  User.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.send(err).status(500);
    }
    res.json({ message: 'User deleted!' })
  });
});

router.get('/projects', (req, res) => {
  Project.find()
  .populate({
    path: '_creator',
    model: 'User'})
  .exec((err, projects) => {
    if (err) { res.send(err) }
    res.json(projects);
  })
});

router.post('/project', (req, res) => {
  var project = new Project();
  project.title = req.body.title;
  project._creator = req.body.creator;
  project.save((err) => {
    if (err) {
      return res.send(err);
    }

    res.json({
      message: `Project ${project._creator} created !`
    });
  });
});

router.put('/project/:id', (req, res) => {

  console.log('req.params.id : ', req.params.id);

  Project.findByIdAndUpdate(req.params.id, { $set: req.body}, {new: true}, (err, project) => {

    console.log('project : ', project);

    if (err) {
      return res.send(err).status(500);
    }
    res.json(project)
  });
});

router.delete('/project/:id', (req, res) => {

  Project.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.send(err).status(500);
    }
    res.json({ message: 'User deleted!' })
  });
});

module.exports = router;
