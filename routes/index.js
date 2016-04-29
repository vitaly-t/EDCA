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
/* ******************* */
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
};

// No usamos este código
/* passport.use('signup', new LocalStrategy({
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
};
*/


// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function(user, done) {
  console.log('serializing user: ');
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    //console.log('deserializing user:',user);
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
router.get('/', isNotAuthenticated, function (req, res, next) {
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
  res.render('main', { user: req.user, title: 'Contrataciones abiertas' });
});


/* GET main page with data */
router.get('/main/:ocid', isAuthenticated, function (req,res) {
    var ocid = req.params.ocid;

    edca_db.task(function (t) {
            // this = t = transaction protocol context;
            // this.ctx = transaction config + state context;
            return t.batch([
                t.one( "select * from contractingprocess where id = $1", ocid ),
                t.one( "select * from budget where ContractingProcess_id = $1", ocid ),
                t.one( "select * from Tender where ContractingProcess_id = $1", ocid),
                t.one( "select * from Award where ContractingProcess_id = $1", ocid),
                t.one( "select * from Contract where ContractingProcess_id = $1", ocid )
            ]);
        })
        // using .spread(function(user, event)) is best here, if supported;
        .then(function (data) {
            console.log(data[0].id); //CP
            console.log(data[1].id); //budget
            console.log(data[2].id); //Tender
            console.log(data[3].id); //Award
            console.log(data[4].id); //Contract

            res.render('main', { user: req.user, title: 'Contrataciones abiertas', cp: data[0], budget: data[1], tender: data[2],
                award: data[3], contract: data[4]
            });
        })
        .catch(function (error) {
            console.log("Error",error);

            res.render('main', {user: req.user, title: 'Contrataciones abiertas', error:'Proceso de contratación '+ocid+' no encontrado'});
        });

});


/************* API ****************/
var pgp      = require("pg-promise")();
var edca_db  = pgp("postgres://tester:test@localhost/edca");


// NUEVO PROCESO DE CONTRATACIÓN
router.get('/nuevo_proceso/:pubid', function (req, res) {
    var pid = req.params.pubid;
    console.log("Publisher id: ", pid);
    edca_db.tx(function (t) {
            return t.one("insert into ContractingProcess (fecha_creacion, hora_creacion, publisher_id) values (current_date, current_time, $1) returning id", pid)
                .then(function (process) {
                    return t.one("insert into Planning (ContractingProcess_id) values ($1) returning id", process.id)
                        .then(function (planning) {
                            return {
                                planning: planning,
                                process: process
                            };
                        })
                })
                .then(function (info) {
                    var last = t.one("insert into Contract (ContractingProcess_id) values ($1) returning id", [info.process.id])
                        .then(function (contract) {
                            return t.one("insert into Implementation (ContractingProcess_id, Contract_id ) values ($1, $2) returning id", [info.process.id, contract.id])
                        });
                    return t.batch([
                        t.one("insert into Budget (ContractingProcess_id, Planning_id) values ($1, $2 ) returning id", [info.process.id, info.planning.id]),
                        t.one("insert into Tender (ContractingProcess_id) values ($1) returning id", [info.process.id]),
                        t.one("insert into Award (ContractingProcess_id) values ($1) returning id", [info.process.id]),
                        last
                    ]);
                });
        })
        .then(function (data) {
            // data[0] = Budget object;
            // data[1] = Tender object;
            // data[2] = Award object;
            // data[3] = Implementation object;
            res.send(process);
        })
        .catch(function (error) {
            res.json({"id": 0});
            console.log("ERROR: ", error);
        });
});

/* Update Planning -> Budget */
router.post('/update_budget/:ocid', function (req, res) {
    /*
    var source = req.body.source;
    var desc = req.body.description;
    var amount = req.body.amount;
    var curr = req.body.curr;
    var project = req.body.project;
    var projectid = req.body.projectid;
    var uri = req.body.uri;
*/
    var ocid = req.params.ocid;

    for (var campo in req.body) {

        edca_db.one("update budget set "+campo+" = $1 where ContractingProcess_id = $2 returning 1", [req.body[campo],ocid]).then(
            function (ub) {
            console.log("Update budget ...");
        }).catch(function (error) {
            console.log("ERROR: ",error);
        });
    }

    // ¿?
    res.json({id: '0'});
});



// Buyer
router.get('/new_buyer/:ContractingProcess_id', function (req,res) {
var cpid = req.params.ContractingProcess_id;

     edca_db.one("insert into buyer (ContractingProcess_id) values ($1) returning id", cpid).then(function (buyer) {
     console.log("Se ha creado un nuevo comprador", buyer.id);
         res.send(buyer);
     }).catch(function (error) {
         res.json({"id" : 0});
     console.log("ERROR: ",error);
     });

});

router.get('/organization_type', function (req, res) {
edca_db.many("select id, name from OrganizationType").then(function (data) {
    res.send(data);
}).catch(function (error) {
    res.json({id: 0, name: "Error"});
console.log("ERROR: ", error);
});
});


  module.exports = router;
