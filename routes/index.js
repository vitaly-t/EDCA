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
                    t.one("select * from contractingprocess where id = $1", ocid),
                    t.one("select * from budget where ContractingProcess_id = $1", ocid),
                    t.one("select * from Tender where ContractingProcess_id = $1", ocid),
                    t.one("select * from Award where ContractingProcess_id = $1", ocid),
                    t.one("select * from Contract where ContractingProcess_id = $1", ocid)
                ]);
            })
            // using .spread(function(user, event)) is best here, if supported;
            .then(function (data) {
                console.log(data[0].id); //CP
                console.log(data[1].id); //budget
                console.log(data[2].id); //Tender
                console.log(data[3].id); //Award
                console.log(data[4].id); //Contract

                res.render('main', {
                    user: req.user,
                    title: 'Contrataciones abiertas',
                    cp: data[0],
                    budget: data[1],
                    tender: data[2],
                    award: data[3],
                    contract: data[4]
                });
            })
            .catch(function (error) {
                console.log("Error", error);

                res.render('main', {
                    user: req.user,
                    title: 'Contrataciones abiertas',
                    error: 'Proceso de contratación ' + ocid + ' no encontrado'
                });
            });

});


/************* API ****************/
var pgp      = require("pg-promise")();
var edca_db  = pgp("postgres://tester:test@localhost/edca");



router.get('/schema', function (req,res) {
    edca_db.one("select * from contractingprocess where id=1").then(function (data) {
        edca_db.one("select * from tender where contractingprocess_id=$1", data.id).then(function (tenderdata) {
            res.json( { cp: data, tender: tenderdata});
        });
    }).catch(function (error) {
        res.json(error);
    });
});

// NUEVO PROCESO DE CONTRATACIÓN
router.get('/new-process', function (req, res) {
    //var pid = req.params.pubid;

    edca_db.tx(function (t) {
        
        //falta crear el publisher
        var pid = 1;

            return t.one("insert into ContractingProcess (fecha_creacion, hora_creacion, publisher_id) values (current_date, current_time, $1) returning id", pid)
                .then(function (process) {

                    return t.one("insert into Planning (ContractingProcess_id) values ($1) returning id", process.id)
                        .then(function (planning) {
                            return {
                                process: process,
                                planning: planning
                            };
                        });
                })
                .then(function (info) {

                    var last = t.one("insert into Contract (ContractingProcess_id) values ($1) returning id", [info.process.id])
                        .then(function (contract) {

                            return t.one("insert into Implementation (ContractingProcess_id, Contract_id ) values ($1, $2) returning id as implementation_id", [info.process.id, contract.id])

                        });

                    var process= {process_id : info.process.id}
                    var planning = {planning_id : info.planning.id}

                    return t.batch([
                        process, planning,
                            t.one("insert into Budget (ContractingProcess_id, Planning_id) values ($1, $2 ) returning id as budget_id", [info.process.id, info.planning.id]),
                            t.one("insert into Tender (ContractingProcess_id) values ($1) returning id as tender_id", [info.process.id]),
                            t.one("insert into Award (ContractingProcess_id) values ($1) returning id as award_id", [info.process.id]),
                            last
                        ])

                });
        })
        .then(function (data) {
            console.log(data);
            //res.json(data);
            res.redirect('/main/'+data[0].process_id);

        })
        .catch(function (error) {
            res.json({"id": 0});
            console.log("ERROR: ", error);
        });
});

/* Update Planning -> Budget */
router.post('/update-budget', function (req, res) {
    for (var campo in req.body) {

        edca_db.one("update budget set "+campo+" = $1 where ContractingProcess_id = $2 returning 1", [req.body[campo], req.body.contractingprocess_id]).then(
            function (ub) {
            console.log("Update budget ...");

        }).catch(function (error) {
            console.log("ERROR: ",error);
        });
    }

    res.send('La etapa de planeación ha sido actualizada');
});


/* Update Tender*/
router.post('/update-tender', function (req, res) {
    for (var campo in req.body) {

        edca_db.one("update tender set "+campo+" = $1 where ContractingProcess_id = $2 returning 1", [req.body[campo], req.body.contractingprocess_id]).then(
            function (ub) {
                console.log("Update tender ...");
            }).catch(function (error) {
            console.log("ERROR: ",error);
        });
    }

    res.send('La etapa de licitación ha sido actualizada'); // envía la respuesta y presentala en un modal
});


/* Update Award */
router.post('/update-award', function (req, res) {
    for (var campo in req.body) {

        edca_db.one("update award set "+campo+" = $1 where ContractingProcess_id = $2 returning 1", [req.body[campo], req.body.contractingprocess_id]).then(
            function (ub) {
                console.log("Update award ...");
            }).catch(function (error) {
            console.log("ERROR: ",error);
        });
    }

    res.send('La etapa de adjudicación ha sido actualizada');
});


/* Update Contract */
router.post('/update-contract', function (req, res) {
    for (var campo in req.body) {

        edca_db.one("update contract set "+campo+" = $1 where ContractingProcess_id = $2 returning 1", [req.body[campo], req.body.contractingprocess_id]).then(
            function (ub) {
                console.log("Update contract ...");
            }).catch(function (error) {
            console.log("ERROR: ",error);
        });
    }

    res.send('La etapa de contrato ha sido actualizada');
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


router.post('/search-process-by-date', function (req, res) {
    fi = req.body.fecha_inicial;
    ff = req.body.fecha_final;
    //console.log(ff, fi);

    edca_db.many("select * from ContractingProcess where fecha_creacion >= $1 and fecha_creacion <= $2",[fi,ff]).then(function (data) {
        res.json(data);
        console.log(data);
    }).catch(function (error) {
        console.log("ERROR: ",error);
        res.json(error);
    });

});



router.get('/release/:ocid', function (req,res) {
var ocid = req.params.ocid;

    //queries principales
     edca_db.tx(function (t) {
        var cp = this.one("Select * from contractingprocess where id = $1", [ocid]);                    //0
        var planning = this.one("select * from planning where contractingprocess_id = $1", [ocid]);     //1
        var budget = this.one("select * from budget where contractingprocess_id = $1", [ocid]);         //2
         var tender = this.one("select * from tender where contractingprocess_id = $1", [ocid]);        //3
         var buyer =this.oneOrNone("select * from buyer where contractingprocess_id = $1", [ocid]);    //4
         var award = this.one("select * from award where contractingprocess_id = $1", [ocid]);           //5
         var contract = this.one("select * from contract where contractingprocess_id = $1", [ocid]);     //6
         var implementation = this.oneOrNone('select * from implementation where contractingprocess_id = $1', [ocid]);

        return this.batch([cp, planning, budget, tender, buyer, award, contract, implementation ]);
    }).then(function (data) {

         //queries secundarias
         console.log(data);
         return data;

     }).then(function (qp) {

         var release = {
             ocid : qp[0].id,
             id: "id de release",
             date: qp[0].fecha_creacion,
             tag: "etiquetas...",
             planning: {
                 //ocid: qp[1],
                 budget: qp[2],
                 rationale: qp[1].rationale,
                 documents: "...",
             },
             tender: qp[3],
             buyer: qp[4],
             awards: qp[5],
             contracts: {
                 id: qp[6].id,
                 awardID: qp[6].award_id,
                 title: qp[6].title,
                 description: qp[6].description,
                 status : qp[6].status,
                 period: { startDate: qp[6].period_startdate, endDate: qp[6].period_enddate},
                 value: qp[6].value,
                 items: "...",
                 dateSigned: qp[6].datesigned,
                 documents: "...",
                 amendment: "...",
                 implementation: qp[7]
             }, //aquí va implementation
             lang: 'es',
         };

         res.json(release);

         }).catch(function (error) {
         console.log(error);
     })



});


  module.exports = router;
