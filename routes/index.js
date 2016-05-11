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
                    t.one("select * from ContractingProcess where id = $1", ocid),
                    t.one("select * from Planning where contractingprocess_id= $1", ocid),
                    t.one("select * from budget where contractingprocess_id = $1", ocid),
                    t.one("select * from Tender where contractingprocess_id = $1", ocid),
                    t.one("select * from Award where contractingprocess_id = $1", ocid),
                    t.one("select * from Contract where contractingprocess_id = $1", ocid),
                    t.one("select * from buyer where contractingprocess_id =$1",ocid),
                    t.one("select * from procuringentity where contractingprocess_id=$1",ocid)
                ]);
            })
            // using .spread(function(user, event)) is best here, if supported;
            .then(function (data) {
                console.log(data[0].id); //CP
                console.log(data[1].id); //planning
                console.log(data[2].id); //budget
                console.log(data[3].id); //Tender
                console.log(data[4].id); //Award
                console.log(data[5].id); //Contract
                console.log(data[6].id);
                console.log(data[7].id);

                res.render('main', {
                    user: req.user,
                    title: 'Contrataciones abiertas',
                    cp: data[0],
                    planning: data[1],
                    budget: data[2],
                    tender: data[3],
                    award: data[4],
                    contract: data[5],
                    buyer: data[6],
                    procuringentity: data[7]
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

// NUEVO PROCESO DE CONTRATACIÓN
router.get('/new-process', function (req, res) {

    edca_db.tx(function (t) {
        
        //falta insertar: publisher y procuring entity
        var pid = 1;

            return t.one("insert into ContractingProcess (fecha_creacion, hora_creacion, publisher_id) values (current_date, current_time, $1) returning id", pid)
                .then(function (process) {

                    var planning = t.one("insert into Planning (ContractingProcess_id) values ($1) returning id", process.id);
                    var tender = t.one ("insert into Tender (ContractingProcess_id) values ($1) returning id as tender_id", process.id);
                    var contract = t.one ("insert into Contract (ContractingProcess_id) values ($1) returning id", process.id);

                    return t.batch([process = { id : process.id}, planning, tender, contract] );


                }).then(function (info) {

                    var process= {process_id : info[0].id}
                    var planning = {planning_id : info[1].id}
                    
                    return t.batch([
                        process, planning,
                            t.one("insert into Budget (ContractingProcess_id, Planning_id) values ($1, $2 ) returning id as budget_id", [info[0].id, info[1].id]),
                            t.one("insert into Buyer (ContractingProcess_id) values ($1) returning id as buyer_id",[info[0].id]),
                            t.one("insert into ProcuringEntity (contractingprocess_id, tender_id) values ($1, $2) returning id as procuringentity_id",[info[0].id, info[2].id]),
                            t.one("insert into Award (ContractingProcess_id) values ($1) returning id as award_id", [info[0].id]),
                            t.one("insert into Implementation (ContractingProcess_id, Contract_id ) values ($1, $2) returning id as implementation_id", [info[0].id, info[3].id]),
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
router.post('/update-planning', function (req, res) {

        edca_db.tx(function (t) {
            var planning = this.one("update planning set rationale = $1 where ContractingProcess_id = $2 returning id", [req.body.rationale, req.body.contractingprocess_id]);
            var budget = this.one("update budget set budget_source = $2, budget_description= $3, budget_amount=$4, budget_currency=$5, budget_project=$6, budget_projectid=$7, budget_uri=$8 where ContractingProcess_id=$1 returning id",
                [
                    req.body.contractingprocess_id,
                    req.body.budget_source,
                    req.body.budget_description,
                    req.body.budget_amount,
                    req.body.budget_currency,
                    req.body.budget_project,
                    req.body.budget_projectid,
                    req.body.budget_uri
            ]);
            
            return this.batch([planning, budget]);

            }).then(function (data) {
            res.send('La etapa de planeación ha sido actualizada');
            console.log(data);
        }).catch(function (error) {
            console.log("ERROR: ",error);
            res.send('Error');
        });

});


/* Update Tender*/
router.post('/update-tender', function (req, res) {
    for (var campo in req.body) {
        
        console.log(campo+": "+req.body[campo]);
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

        edca_db.one("update contract set "+campo+" = $1 where ContractingProcess_id = $2 returning id", [req.body[campo], req.body.contractingprocess_id]).then(
            function (ub) {
                console.log("Update contract ...");
            }).catch(function (error) {
            console.log("ERROR: ",error);
        });
    }

    res.send('La etapa de contrato ha sido actualizada');
});

/* Update buyer*/
router.post('/update-buyer', function (req, res) {

        edca_db.one("update buyer set identifier_scheme= $2, identifier_id =$3, identifier_legalname=$4, identifier_uri=$5, address_streetaddress=$6," +
            " address_locality=$7, address_region =$8, address_postalcode=$9, address_countryname=$10, contactpoint_name=$11, contactpoint_email=$12, contactpoint_telephone=$13," +
            " contactpoint_faxnumber=$14, contactpoint_url=$15 where ContractingProcess_id = $1 returning id",
            [
                req.body.ocid,
                req.body.identifier_scheme,
                req.body.identifier_id,
                req.body.identifier_legalname,
                req.body.identifier_uri,
                req.body.address_streetaddress,
                req.body.address_locality,
                req.body.address_region,
                req.body.address_postalcode,
                req.body.address_countryname,
                req.body.contactpoint_name,
                req.body.contactpoint_email,
                req.body.contactpoint_telephone,
                req.body.contactpoint_faxnumber,
                req.body.contactpoint_url
            ]
        ).then(function (data) {
                res.send('Los datos han sido actualizados'); // envía la respuesta y presentala en un modal
                console.log("Update buyer ...");
            }).catch(function (error) {
            res.send("Error");
            console.log("ERROR: ",error);
        });

});

/* Update procuringentity*/
router.post('/update-procuringentity', function (req, res) {

    edca_db.one("update procuringentity set identifier_scheme= $2, identifier_id =$3, identifier_legalname=$4, identifier_uri=$5, address_streetaddress=$6," +
        " address_locality=$7, address_region =$8, address_postalcode=$9, address_countryname=$10, contactpoint_name=$11, contactpoint_email=$12, contactpoint_telephone=$13," +
        " contactpoint_faxnumber=$14, contactpoint_url=$15 where ContractingProcess_id = $1 returning id",
        [
            req.body.ocid,
            req.body.identifier_scheme,
            req.body.identifier_id,
            req.body.identifier_legalname,
            req.body.identifier_uri,
            req.body.address_streetaddress,
            req.body.address_locality,
            req.body.address_region,
            req.body.address_postalcode,
            req.body.address_countryname,
            req.body.contactpoint_name,
            req.body.contactpoint_email,
            req.body.contactpoint_telephone,
            req.body.contactpoint_faxnumber,
            req.body.contactpoint_url
        ]
    ).then(function (data) {
        res.send('Los datos han sido actualizados'); // envía la respuesta y presentala en un modal
        console.log("Update procuring entity ...");
    }).catch(function (error) {
        res.send("Error");
        console.log("ERROR: ",error);
    });

});

router.get('/organization-type', function (req, res) {
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
         var procuringentity = this.one('select * from ProcuringEntity where contractingprocess_id=$1',[ocid]);

        return this.batch([cp, planning, budget, tender, buyer, award, contract, implementation, procuringentity ]);
    }).then(function (data) {

         //queries secundarias
         console.log(data);
         return data;

     }).then(function (qp) {

         var release = {
             ocid : qp[0].id,
             id: "id de release",
             date: qp[0].fecha_creacion,
             tag: "...",
             initiationType: "...",
             planning: {
                 budget: {
                     source: qp[2].budget_source,
                     id : qp[2].id,
                     description : qp[2].budget_description,
                     amount: {
                         amount: qp[2].budget_amount,
                         currency: qp[2].budget_currency
                     },
                     project: qp[2].budget_project,
                     projectID: qp[2].budget_projectid,
                     uri: qp[2].budget_uri
                 },
                 rationale: qp[1].rationale,
                 documents: {/* ... */}
             },
             tender: {
                 id: qp[3].id,
                 title: qp[3].title,
                 description: qp[3].description,
                 status: qp[3].status,
                 items: {/* ... */},
                 minValue: {
                     amount: qp[3].minvalue_amount,
                     currency : qp[3].minvalue_currency
                 },
                 value: {
                     amount: qp[3].value_amount,
                     currency : qp[3].value_currency
                 },
                 procurementMethod: qp[3].procurementmenthod,
                 procurementMethodRationale: qp[3].procurementMethod_rationale,
                 awardCriteria : qp[3].awardcriteria,
                 awardCriteriaDetails : qp[3].awardcriteria_details,
                 submissionMethod: qp[3].submissionMethod,
                 submissionMethodDetails: qp[3].submissionMethod_details,
                 tenderPeriod : {
                     startDate: qp[3].tenderperiod_startdate,
                     endDate: qp[3].tenderperiod_enddate
                 },
                 enquiryPeriod: {
                     startDate: qp[3].enquiryperiod_startdate,
                     endDate: qp[3].enquiryperiod_enddate
                 },
                 hasEnquiries:  (qp[3].hasenquiries==1)?true:false,
                 eligibilityCriteria: qp[3].eligibilitycriteria,
                 awardPeriod: {
                     startDate: qp[3].tenderperiod_startdate,
                     endDate: qp[3].tenderperiod_enddate
                 },
                 numberOfTenderers: qp[3].numberoftenderers,
                 tenderers: {/* ... */},
                 procuringEntity: {
                     identifier: {
                         scheme: qp[8].identifier_scheme,
                         id:qp[8].identifier_id,
                         legalName: qp[8].identifier_legalname,
                         uri: qp[8].identifier_uri
                     },
                     additionalIdentifiers:{/* ... */},
                     name: qp[8].name,
                     address: {
                         streetAddress: qp[8].address_streetaddress,
                         locality: qp[8].address_locality,
                         region: qp[8].address_region,
                         postalCode: qp[8].address_postalcode,
                         countryName: qp[8].address_countryname
                     },
                     contactPoint: {
                         name:qp[8].contactpoint_name,
                         email: qp[8].contactpoint_email,
                         telephone:qp[8].contactpoint_telephone,
                         faxNumber: qp[8].contactpoint_faxnumber,
                         url: qp[8].contactpoint_url
                     }
                 },
                 documents: {/* ... */},
                 milestones: {/* ... */},
                 amendment: {
                     date: qp[3].amendment_date,
                     changes: {/* ... */},
                     rationale: qp[3].amendment_rationale
                 }
             },
             buyer: {
                 identifier: {/* Añadir campos a buyer */},
                 additionalIdentifiers : {/* ... */},
                 name: qp[4].name,
                 address: {
                     streetAddress: qp[4].address_streetaddress,
                     locality: qp[4].address_locality ,
                     region: qp[4].address_region,
                     postalCode: qp[4].address_postalcode,
                     countryName: qp[4].address_contryname
                 },
                 contactPoint: {
                     name: qp[4].contactpoint_name,
                     email: qp[4].contactpoint_email,
                     telephone: qp[4].contactpoint_telephone,
                     faxNumber: qp[4].contactpoint_faxnumber,
                     url: qp[4].contactpoint_url
                 }
             },
             awards: qp[5],  //pueden ser varios
             contracts: { //pueden ser varios
                 id: qp[6].id,
                 awardID: qp[6].award_id,
                 title: qp[6].title,
                 description: qp[6].description,
                 status : qp[6].status,
                 period: {
                     startDate: qp[6].period_startdate,
                     endDate: qp[6].period_enddate
                 },
                 value: qp[6].value,
                 items: {/* ... */},
                 dateSigned: qp[6].datesigned,
                 documents: {/* ... */},
                 amendment: {/* ... */}, //integrar tabla contractamendment a contracts
                 implementation: qp[7]
             },
             lang: 'es'
         };

         res.json(release);

         }).catch(function (error) {
         console.log(error);
     })



});

  module.exports = router;
