const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuth} = require('../helpers/auth')


// Load Idea Model
require('../models/Idea');
const Adds = mongoose.model('adds');

// Idea Index Page
router.get('/',ensureAuth,   (req, res) => {
  Adds.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});




// Add Idea Form
router.get('/add',ensureAuth, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
  Adds.findOne({
    _id: req.params.id
  })
  .then(add => {
    if(add.user != req.user.id){

      req.flash('error_msg' , 'Not Authorised')
      res.redirect('/ideas')

    }
    else{
    res.render('ideas/edit', {
      add:add
    });
  }
  });
});

// Process Form
router.post('/', ensureAuth,(req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please Fill All The Feilds'});
  }
  if(!req.body.Category){
    errors.push({text:'Please Fill All The Feilds'});
  }

  if(!req.body.AdDescription){
    errors.push({text:'Please Fill All The Feilds'});
  }

  if(!req.body.price){
    errors.push({text:'Please Fill All The Feilds'});
  }

  if(!req.body.name){
    errors.push({text:'Please Fill All The Feilds'});
  }
  if(!req.body.number){
    errors.push({text:'Please Fill All The Feilds'});
  }
  if(!req.body.city){
    errors.push({text:'Please Fill All The Feilds'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      Category:req.body.Category,
      AdDescription: req.body.AdDescription,
      price:req.body.price,
      name:req.body.name,
      number:req.body.number,
      city:req.body.city

    });
  } else {
    const newAdd = {
      title: req.body.title,
      Category:req.body.Category,
      AdDescription: req.body.AdDescription,
      image:req.body.image,
      price:req.body.price,
      name:req.body.name,
      number:req.body.number,
      city:req.body.city,
      user:req.user.id
    }
    new Adds(newAdd)
      .save()
      .then(add => {
        req.flash('success_msg', 'You are Add Has Been Posted');
        res.redirect('/ideas');
      })
  }
});

// Edit Form process
router.put('/:id', ensureAuth,(req, res) => {
  Adds.findOne({
    _id: req.params.id
  })
  .then(add => {
    // new values
    add.title= req.body.title,
    add.Category=req.body.Category,
    add.AdDescription= req.body.AdDescription,
    add.image=req.body.image,
    add.price=req.body.price,
    add.name=req.body.name,
    add.number=req.body.number,
    add.city=req.body.city,
    add.user=req.user.id
    add.save()
      .then(idea => {
        req.flash('success_msg', 'Your Add Has Been Updated');
        res.redirect('/ideas');
      })
  });
});
//show Adds 



// Delete Idea
router.delete('/:id', ensureAuth,(req, res) => {
  Adds.remove({_id: req.params.id})
    .then(() => {
      req.flash('error_msg', 'You Add Has Been Deleted');
      res.redirect('/ideas');
    });
});

module.exports = router;