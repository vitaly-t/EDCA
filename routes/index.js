var express = require('express');
var router = express.Router();

//passport db
var dbConfig = require('../db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
router.use(expressSession({secret: 'mySecretKey', resave : false , saveUninitialized: false}));
router.use(passport.initialize());
router.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
router.use(flash());




// Initialize Passport
/**********************/
var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');



 passport.use('login', new LocalStrategy(
      {     passReqToCallback : true      },
      function(req, username, password, done) {
        // check in mongo if a user with username exists or not

        User.findOne({ 'username' :  username },
            function(err, user) {

              // In case of any error, return using the done method
              if (err)
                return done(err);
              // Username does not exist, log the error and redirect back
              if (!user){
                console.log('User Not Found with username '+username);
                return done(null, false, req.flash('message', 'Usuario no registrado'));
              }
              // User exists but wrong password, log the error
              if (!isValidPassword(user, password)){
                console.log('Contraseña no válida');
                return done(null, false, req.flash('message', 'Contraseña no válida')); // redirect back to login page
              }
              // User and password both match, return user from done method
              // which will be treated like success
              return done(null, user);
            }
        );

      }
  ));


  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }


  passport.use('signup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {

        findOrCreateUser = function(){
          // find a user in Mongo with provided username
          User.findOne({ 'username' :  username }, function(err, user) {
            // In case of any error, return using the done method
            if (err){
              console.log('Error in SignUp: '+err);
              return done(err);
            }
            // already exists
            if (user) {
              console.log('User already exists with username: '+username);
              return done(null, false, req.flash('message','User Already Exists'));
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials
              newUser.username = username;
              newUser.password = createHash(password);
              newUser.email = req.param('email');
              newUser.firstName = req.param('firstName');
              newUser.lastName = req.param('lastName');

              // save the user
              newUser.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
                }
                console.log('User Registration succesful');
                return done(null, newUser);
              });
            }
          });
        };
        // Delay the execution of findOrCreateUser and execute the method
        // in the next tick of the event loop
        process.nextTick(findOrCreateUser);
      })
  );

  // Generates hash using bCrypt
  var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }



  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log('serializing user: ');
    console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });



var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

var isNotAuthenticated = function (req, res, next) {
    if (req.isUnauthenticated())
        return next();
    // if the user is authenticated then redirect him to the main page
    res.redirect('/main');
}

/* * * * * * * * * * * RUTAS * * * * * * * * * * * * * */
  /* GET home page. */
  router.get('/', isNotAuthenticated,function (req, res, next) {
    res.render('index', {title: 'Contrataciones abiertas', message: req.flash('message')});
  });


/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/main',
  failureRedirect: '/',
  failureFlash : true
}));


/* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});


/* GET main page. */
router.get('/main', isAuthenticated, function(req, res, next) {
  res.render('main', { user:req.user,title: 'Contrataciones abiertas' });
});


/************* API ****************/
var pgp = require("pg-promise")();
var edca_db  = pgp("postgres://tester:test@localhost/edca");

router.get('/nuevo_proceso', function(req,res){
edca_db.one("insert into ContractingProcess (fecha_creacion, hora_creacion) values (current_date, current_time) returning id").then(function (data) {
    res.send(data);
    console.log("Se ha creado un nuevo proceso de contratación, id: ", data.id);
    }).catch(function (error) {
    res.send({"id":0});
    console.log("ERROR: ", error);
});
});


router.get('/organization_type', function (req, res) {
edca_db.many("select id, name from OrganizationType").then(function (data) {
    res.send(data);
}).catch(function (error) {
    res.send({id: 0, name: "Error"});
console.log("ERROR: ", error);
});
});


  module.exports = router;