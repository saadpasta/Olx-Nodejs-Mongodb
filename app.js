const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const { ensureAuth } = require('./helpers/auth')



const app = express();

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://saadpasta:saad1234@ds145752.mlab.com:45752/olx', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// Load Idea Model
require('./models/Idea');
const Adds = mongoose.model('adds');

// Favorite Model
require('./models/favorite');
const Favorite = mongoose.model('Favorite');



// Index Route
app.get('/', (req, res) => {
  Adds.find()
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('index', {
        ideas: ideas
      });
    });
});

// Show Add View Route


app.get('/addView/:id', (req, res) => {
  Adds.findOne({
    _id: req.params.id
  })
    .then(adds => {

      res.render('addView', {
        adds: adds
      })


    });
});




// Favorite Route
app.get('/favorite', (req, res) => {
  res.render('favorite');
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});




// Catogries Route
app.get('/catagories/:catagorey', (req, res) => {

  Adds.find({
    Category: req.params.catagorey
  }).then(adds => {

    res.render('catagories', {
      adds: adds
    });



  })

});








// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT ||5000;
app.listen(port, () => {

  console.log(`Server Ho Gaye Start ${port}`)

})

