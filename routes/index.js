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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var pgp      = require("pg-promise")();
var edca_db  = pgp("postgres://tester:test@localhost/edca");

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
                    t.one("select * from procuringentity where contractingprocess_id=$1",ocid),
                    t.one("select * from publisher where contractingprocess_id=$1",ocid)
                ]);
            })
            // using .spread(function(user, event)) is best here, if supported;
            .then(function (data) {
                console.log("Contracting process -> ",data[0].id); //CP
                console.log("Planning ->",data[1].id); //planning
                console.log("Budget ->",data[2].id); //budget
                console.log("Tender ->",data[3].id); //Tender
                console.log("Award -> ",data[4].id); //Award
                console.log("Contract -> ",data[5].id); //Contract
                console.log("Buyer -> ",data[6].id);
                console.log("Procuring entity -> ",data[7].id);
                console.log("Publisher -> ",data[8].id);

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
                    procuringentity: data[7],
                    publisher: data[8]
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

// NUEVO PROCESO DE CONTRATACIÓN
router.get('/new-process', function (req, res) {
    edca_db.tx(function (t) {

            return t.one("insert into ContractingProcess (fecha_creacion, hora_creacion) values (current_date, current_time) returning id")
                .then(function (process) {

                    var planning = t.one("insert into Planning (ContractingProcess_id) values ($1) returning id", process.id);
                    var tender = t.one ("insert into Tender (ContractingProcess_id,status) values ($1, $2) returning id as tender_id", [process.id, 'none']);
                    var contract = t.one ("insert into Contract (ContractingProcess_id, status) values ($1, $2) returning id", [process.id, 'none']);

                    return t.batch([process = { id : process.id}, planning, tender, contract] );


                }).then(function (info) {

                    var process= {process_id : info[0].id}
                    var planning = {planning_id : info[1].id}
                    
                    return t.batch([
                        process, planning,
                            t.one("insert into Budget (ContractingProcess_id, Planning_id) values ($1, $2 ) returning id as budget_id", [info[0].id, info[1].id]),
                            t.one("insert into Buyer (ContractingProcess_id) values ($1) returning id as buyer_id",[info[0].id]),
                            t.one("insert into ProcuringEntity (contractingprocess_id, tender_id) values ($1, $2) returning id as procuringentity_id",[info[0].id, info[2].id]),
                            t.one("insert into Award (ContractingProcess_id,status) values ($1, $2) returning id as award_id", [info[0].id, 'none']),
                            t.one("insert into Implementation (ContractingProcess_id, Contract_id ) values ($1, $2) returning id as implementation_id", [info[0].id, info[3].id]),
                            t.one("insert into Publisher (ContractingProcess_id) values ($1) returning id as publisher_id", info[0].id)
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
        edca_db.one("update tender set title= $2, description=$3, status=$4, minvalue_amount=$5, minvalue_currency=$6, value_amount=$7, value_currency=$8, procurementmethod=$9," +
            "procurementmethod_rationale=$10, awardcriteria=$11, awardcriteria_details=$12, submissionmethod=$13, submissionmethod_details=$14," +
            "tenderperiod_startdate=$15, tenderperiod_enddate=$16, enquiryperiod_startdate=$17, enquiryperiod_enddate=$18 ,hasenquiries=$19, eligibilitycriteria=$20, awardperiod_startdate=$21," +
            "awardperiod_enddate=$22, numberoftenderers=$23, amendment_date=$24, amendment_rationale=$25" +
            " where ContractingProcess_id = $1 returning id", [
            req.body.contractingprocess_id,
            req.body.title,
            req.body.description,
            req.body.status,
            req.body.minvalue_amount,
            req.body.minvalue_currency,
            req.body.value_amount,
            req.body.value_currency,
            req.body.procurementmethod,
            req.body.procurementmethod_rationale,
            req.body.awardcriteria,
            req.body.awardcriteria_details,
            req.body.submissionmethod,
            req.body.submissionmethod_details,
            (req.body.tenderperiod_startdate!='')?req.body.tenderperiod_startdate:null,
            (req.body.tenderperiod_enddate!='')?req.body.tenderperiod_enddate:null,
            (req.body.enquiryperiod_startdate!='')?req.body.enquiryperiod_startdate:null,
            (req.body.enquiryperiod_enddate!='')?req.body.enquiryperiod_enddate:null,
            req.body.hasenquiries,
            req.body.eligibilitycriteria,
            (req.body.awardperiod_startdate!='')?req.body.awardperiod_startdate:null,
            (req.body.awardperiod_enddate!='')?req.body.awardperiod_enddate:null,
            req.body.numberoftenderers,
            (req.body.amendment_date!='')?req.body.amendment_date:null,
            req.body.amendment_rationale
        ]).then(
            function (data) {
                console.log("Update tender: ", data);
                res.send("La etapa de licitación ha sido actualizada");
            }).catch(function (error) {
            res.send("ERROR");
            console.log("ERROR: ",error);
        });
});

/* Update Award */
router.post('/update-award', function (req, res) {
        edca_db.one("update award set title= $2, description=$3,status=$4,award_date=$5,value_amount=$6,value_currency=$7,contractperiod_startdate=$8," +
            "contractperiod_enddate=$9,amendment_date=$10,amendment_rationale=$11 " +
            " where ContractingProcess_id = $1 returning id",
            [
                req.body.contractingprocess_id,
                req.body.title,
                req.body.description,
                req.body.status,
                (req.body.award_date!='')?req.body.award_date:null,
                req.body.value_amount,
                req.body.value_currency,
                (req.body.contractperiod_startdate!='')?req.body.contractperiod_startdate:null,
                (req.body.contractperiod_enddate!='')?req.body.contractperiod_enddate:null,
                (req.body.amendment_date!='')?req.body.amendment_date:null,
                req.body.amendment_rationale
            ]
        ).then(
            function (data) {
                console.log("Update award: ", data);
                res.send("La etapa de adjudicación ha sido actualizada");
            }).catch(function (error) {
            console.log("ERROR: ",error);
            res.send("ERROR");
        });
});

/* Update Contract */
router.post('/update-contract', function (req, res) {
    edca_db.one("update contract set awardid=$2, title=$3, description=$4, status=$5, period_startdate=$6, period_enddate=$7, value_amount=$8, value_currency=$9," +
        " datesigned=$10, amendment_date=$11, amendment_rationale=$12 " +
        " where ContractingProcess_id = $1 returning id", [
        req.body.contractingprocess_id,
        req.body.awardid,
        req.body.title,
        req.body.description,
        req.body.status,
        (req.body.period_startdate!='')?req.body.period_startdate:null,
        (req.body.period_enddate!='')?req.body.period_enddate:null,
        (req.body.value_amount!='')?req.body.value_amount:null,
        req.body.value_currency,
        (req.body.datesigned!='')?req.body.datesigned:null,
        (req.body.amendment_date!='')?req.body.amendment_date:null,
        req.body.amendment_rationale
    ]).then(
        function (data) {
            res.send('La etapa de contratación ha sido actualizada');
            console.log("Update contract id: ", data);
        }).catch(function (error) {
        res.send('ERROR');
        console.log("ERROR: ",error);
    });
});

// New document
router.post('/new-document', function(req,res){
    edca_db.one('insert into $1~ (contractingprocess_id, document_type, title, description, url, date_published, date_modified, format, language) values ($2,$3,$4,$5,$6,$7,$8,$9,$10) returning id',
        [
            req.body.doc_table,
            req.body.ocid,
            req.body.document_type,
            req.body.title,
            req.body.description,
            req.body.url,
            (req.body.date_published!='')?req.body.date_published:null,
            (req.body.date_modified!='')?req.body.date_modified:null,
            req.body.format,
            req.body.language
        ]).then(function (data) {
        res.send("Se ha creado un nuevo documento");
        console.log("new "+ table + ": ", data);

    }).catch(function (error) {
        res.send('ERROR');
        console.log("ERROR: ", error)
    });
});

/* New organization */
router.post('/new-organization', function (req, res) {

    var table= (req.body.org_type=="S")?"Supplier":"Tenderer";

    //falta pasar id de award y tender segun sea el caso
    edca_db.one("insert into $17~" +
        " (contractingprocess_id, identifier_scheme, identifier_id, identifier_legalname, identifier_uri, name, address_streetaddress," +
        " address_locality, address_region, address_postalcode, address_countryname, contactpoint_name, contactpoint_email, contactpoint_telephone," +
        " contactpoint_faxnumber, contactpoint_url) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning id",
        [
            req.body.ocid,
            req.body.identifier_scheme,
            req.body.identifier_id,
            req.body.identifier_legalname,
            req.body.identifier_uri,
            req.body.name,
            req.body.address_streetaddress,
            req.body.address_locality,
            req.body.address_region,
            req.body.address_postalcode,
            req.body.address_countryname,
            req.body.contactpoint_name,
            req.body.contactpoint_email,
            req.body.contactpoint_telephone,
            req.body.contactpoint_faxnumber,
            req.body.contactpoint_url,
            table
        ]
    ).then(function (data) {
        res.send('La organización ha sido registrada'); // envía la respuesta y presentala en un modal
        console.log("Create organization ", table);
    }).catch(function (error) {
        res.send("Error");
        console.log("ERROR: ",error);
    });
});

router.post('/new-item',function (req,res) {
    edca_db.one('insert into $1~ (contractingprocess_id, description, classification_scheme, classification_id, classification_description, classification_uri,' +
        ' unit_name, unit_value_amount, unit_value_currency) values ($2,$3,$4,$5,$6,$7,$8,$9,$10) returning id',
        [
            req.body.item_table,
            req.body.ocid,
            req.body.description,
            req.body.classification_scheme,
            req.body.classification_id,
            req.body.classification_description,
            req.body.classification_uri,
            req.body.unit_name,
            req.body.unit_value_amount,
            req.body.unit_value_currency
        ]
    ).then(function (data) {
        console.log("New milestone: ", data);
        res.send('Datos registrados');
    }).catch(function (error) {
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});

router.post('/new-milestone',function (req,res) {
    edca_db.one('insert into $1~ (contractingprocess_id, title, description, duedate, date_modified, status) values ($2,$3,$4,$5,$6,$7) returning id',
        [
            req.body.milestone_table,
            req.body.ocid,
            req.body.title,
            req.body.description,
            (req.body.duedate!='')?req.body.duedate:null,
            (req.body.date_modified!='')?req.body.date_modified:null,
            req.body.status
        ]
    ).then(function (data) {
        console.log("New milestone: ", data);
        res.send('Datos registrados');
    }).catch(function (error) {
        console.log('ERROR: ', error);
        res.send('ERROR');
    });

});

router.post('/new-transaction', function (req,res) {
    edca_db.one('insert into implementationtransactions (contractingprocess_id, source, implementation_date, value_amount, value_currency, ' +
        'providerorganization_scheme,providerorganization_id,providerorganization_legalname,providerorganization_uri,' +
        'receiverorganization_scheme,receiverorganization_id,receiverorganization_legalname,receiverorganization_uri, uri) ' +
        'values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning id',[
        req.body.ocid,
        req.body.source,
        (req.body.implementation_date != '')?req.body.implementation_date:null,
        req.body.value_amount,
        req.body.value_currency,

        req.body.providerorganization_scheme,
        req.body.providerorganization_id,
        req.body.providerorganization_legalname,
        req.body.providerorganization_uri,

        req.body.receiverorganization_scheme,
        req.body.receiverorganization_id,
        req.body.receiverorganization_legalname,
        req.body.receiverorganization_uri,

        req.body.uri
    ]).then(function (data) {
        console.log('New transaction: ', data);
        res.send('Se ha creado una nueva transacción');
    }).catch(function (error) {
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});

// new amendment change
router.post('/new-amendment-change', function (req, res) {
    edca_db.one('insert into $1~ (contractingprocess_id, property, former_value) values ($2,$3,$4) returning id',[
        req.body.amendmentchanges_table,
        req.body.ocid,
        req.body.property,
        req.body.former_value
    ]).then(function (data) {
        res.send('El cambio ha sido registrado');
        console.log('New amendment change: ',data);
    }).catch(function (error) {
        res.send('ERROR');
        console.log('ERROR',error );
    });
});

// Update buyer
router.post('/update-buyer', function (req, res) {

        edca_db.one("update buyer set identifier_scheme= $2, identifier_id =$3, identifier_legalname=$4, identifier_uri=$5, name = $6, address_streetaddress=$7," +
            " address_locality=$8, address_region =$9, address_postalcode=$10, address_countryname=$11, contactpoint_name=$12, contactpoint_email=$13, contactpoint_telephone=$14," +
            " contactpoint_faxnumber=$15, contactpoint_url=$16 where ContractingProcess_id = $1 returning id",
            [
                req.body.ocid,
                req.body.identifier_scheme,
                req.body.identifier_id,
                req.body.identifier_legalname,
                req.body.identifier_uri,
                req.body.name,
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

// Update procuringentity
router.post('/update-procuringentity', function (req, res) {

    edca_db.one("update procuringentity set identifier_scheme= $2, identifier_id =$3, identifier_legalname=$4, identifier_uri=$5, name=$6,  address_streetaddress=$7," +
        " address_locality=$8, address_region =$9, address_postalcode=$10, address_countryname=$11, contactpoint_name=$12, contactpoint_email=$13, contactpoint_telephone=$14," +
        " contactpoint_faxnumber=$15, contactpoint_url=$16 where ContractingProcess_id = $1 returning id",
        [
            req.body.ocid,
            req.body.identifier_scheme,
            req.body.identifier_id,
            req.body.identifier_legalname,
            req.body.identifier_uri,
            req.body.name,
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

// Update publisher
router.post('/update-publisher', function (req, res) {

    edca_db.one("update publisher set name=$2, scheme=$3, uid=$4, uri=$5 where id = $1 returning id",
        [
            req.body.id,
            req.body.name,
            req.body.scheme,
            req.body.uid,
            req.body.uri
        ]
    ).then(function (data) {
        res.send('Los datos han sido actualizados'); // envía la respuesta y presentala en un modal
        console.log("Update publisher", data);
    }).catch(function (error) {
        res.send("Error");
        console.log("ERROR: ",error);
    });
});

//buscar por periodo
router.post('/search-process-by-date', function (req, res) {
    edca_db.manyOrNone("select * from ContractingProcess where fecha_creacion >= $1 and fecha_creacion <= $2",[
        req.body.fecha_inicial,
        req.body.fecha_final
    ]
    ).then(function (data) {
        //console.log(data);
        res.render('modals/process-list',{ data: data});
    }).catch(function (error) {
        console.log("ERROR: ",error);
        res.send('ERROR');
    });
});


//get list of transactions
router.post('/transaction-list',function (req, res) {
    edca_db.manyOrNone('select * from implementationtransactions where contractingprocess_id=$1',[
        req.body.ocid
    ]).then(function(data){
        console.log(data);
        res.render('modals/transaction-list', {data: data});
    }).catch(function(error){
        console.log('ERROR: ', error);
        res.send('ERROR');
    });

});

//get list of organizations
router.post('/organization-list',function (req, res) {
    edca_db.manyOrNone('select * from $1~ where contractingprocess_id=$2',[
        req.body.table,
        req.body.ocid
    ]).then(function(data){
        console.log(data);
        res.render('modals/organization-list', {data: data});
    }).catch(function(error){
        console.log('ERROR: ', error);
        res.send('ERROR');
    });

});

//get list of items
router.post('/item-list',function (req, res) {
    edca_db.manyOrNone('select * from $1~ where contractingprocess_id=$2',[
        req.body.table,
        req.body.ocid
    ]).then(function(data){
        console.log(data);
        res.render('modals/item-list', {data: data});
    }).catch(function(error){
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});

//get list of documents
router.post('/document-list',function (req, res) {
    edca_db.manyOrNone('select * from $1~ where contractingprocess_id=$2',[
        req.body.table,
        req.body.ocid
    ]).then(function(data){
        console.log(data);
        res.render('modals/document-list', {data: data});
    }).catch(function(error){
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});

//get list of milestones
router.post('/milestone-list',function (req, res) {
    edca_db.manyOrNone('select * from $1~ where contractingprocess_id=$2',[
        req.body.table,
        req.body.ocid
    ]).then(function(data){
        console.log(data);
        res.render('modals/milestone-list', {data: data});
    }).catch(function(error){
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});

//get list of amendment changes
router.post('/amendmentchange-list',function (req, res) {
    edca_db.manyOrNone('select * from $1~ where contractingprocess_id=$2',[
        req.body.table,
        req.body.ocid
    ]).then(function(data){
        console.log(data);
        res.render('modals/amendmentchange-list', {data: data});
    }).catch(function(error){
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});

router.get('/publish/:type/:ocid/:outputname', function (req,res) {
    var ocid = req.params.ocid;
    var type = req.params.type;

    //queries principales
    edca_db.tx(function (t) {

        return t.one("Select * from contractingprocess where id = $1", [ocid]).then(function (cp) { //0

            var planning = t.one("select * from planning where contractingprocess_id = $1", [ocid]);     //1
            var budget = t.one("select * from budget where contractingprocess_id = $1", [ocid]);         //2
            var tender = t.one("select * from tender where contractingprocess_id = $1", [ocid]);        //3
            var buyer = t.oneOrNone("select * from buyer where contractingprocess_id = $1", [ocid]);    //4
            var award = t.one("select * from award where contractingprocess_id = $1", [ocid]);           //5
            var contract = t.one("select * from contract where contractingprocess_id = $1", [ocid]);     //6
            var implementation = t.oneOrNone('select * from implementation where contractingprocess_id = $1', [ocid]); //7
            var procuringentity = t.one('select * from ProcuringEntity where contractingprocess_id=$1', [ocid]); //8

            return t.batch([cp, planning, budget, tender, buyer, award, contract, implementation, procuringentity]);

        }).then(function (data) {

            var qp = {
                cp: data[0],
                planning: data [1],
                budget: data [2],
                tender: data[3],
                buyer: data [4],
                award: data[5],
                contract: data[6],
                implementation: data[7],
                procuringentity: data[8]
            };

            //queries secundarias
            return t.batch(
                [
                    qp, //0
                    t.manyOrNone("select * from tenderer where contractingprocess_id=$1", [data[0].id]), //1
                    t.manyOrNone("select * from supplier where contractingprocess_id=$1", [data[0].id]), //2: dependen de awards
                    t.one("select * from publisher where contractingprocess_id=$1",[data[0].id]), //3
                    /* Documents */
                    t.manyOrNone('select * from planningdocuments where contractingprocess_id=$1',[data[0].id]),//4
                    t.manyOrNone('select * from tenderdocuments where contractingprocess_id=$1',[data[0].id]), //5
                    t.manyOrNone('select * from awarddocuments where contractingprocess_id=$1',[data[0].id]), //6
                    t.manyOrNone('select * from contractdocuments where contractingprocess_id=$1', [data[0].id]),//7
                    t.manyOrNone('select * from implementationdocuments where contractingprocess_id=$1 ',[data[0].id]), //8
                    /* Items */
                    t.manyOrNone('select * from tenderitem where contractingprocess_id=$1',[data[0].id]),// 9
                    t.manyOrNone('select * from awarditem where contractingprocess_id=$1',[data[0].id]), //10
                    t.manyOrNone('select * from contractitem where contractingprocess_id=$1',[data[0].id]),//11
                    /* Milestones */
                    t.manyOrNone('select * from tendermilestone where contractingprocess_id=$1',[data[0].id]), //12
                    t.manyOrNone('select * from implementationmilestone where contractingprocess_id=$1',[data[0].id]), //13
                    /* Transactions */
                    t.manyOrNone('select * from implementationtransactions where contractingprocess_id=$1', [data[0].id]), //14
                    /* Amendment changes */
                    t.manyOrNone('select * from tenderamendmentchanges where contractingprocess_id=$1',[data[0].id]), //15
                    t.manyOrNone('select * from awardamendmentchanges where contractingprocess_id=$1',[data[0].id]), //16
                    t.manyOrNone('select * from contractamendmentchanges where contractingprocess_id=$1',[data[0].id]) //17
                ]);

        }).then(function (data) {

            function getOrganizations(orgarray){
                var organizations = [];
                for ( var i=0; i < orgarray.length; i++){

                    organizations.push ({
                        identifier: {
                            scheme: orgarray[i].identifier_scheme,
                            id: orgarray[i].identifier_id,
                            legalName: orgarray[i].identifier_legalname,
                            uri: orgarray[i].identifier_uri
                        },
                        //additionalIdentifiers:[ ],
                        name: orgarray[i].name,
                        address: {
                            locality: orgarray[i].identifier_locality,
                            region: orgarray[i].identifier_region,
                            postalCode: orgarray[i].identifier_postalcode,
                            countryName: orgarray[i].identifier_countryname
                        },
                        contactPoint:{
                            name: orgarray[i].contactpoint_name,
                            email: orgarray[i].contactpoint_email,
                            telephone: orgarray[i].contactpoint_telephone,
                            faxNumber: orgarray[i].contactpoint_faxnumber,
                            url: orgarray[i].contactpount_faxnumber
                        }
                    });

                }
                return organizations;
            }


            function getDocuments(docarray){
                var documents =[];
                for (var i=0; i < docarray.length; i++ ){
                    documents.push({
                        id: docarray[i].id,
                        documentType: docarray[i].document_type,
                        title: docarray[i].title ,
                        description: docarray[i].description,
                        url: docarray[i].url,
                        datePublished: docarray[i].date_published,
                        dateModified: docarray[i].date_modified,
                        format: docarray[i].format,
                        language: docarray[i].language
                    });
                }
                return documents;
            }

            function getItems(arr){
                var items =[];
                for (var i=0; i < arr.length;i++){
                    items.push({
                        id: arr[i].id,
                        description: arr[i].description,
                        //additionalClasifications: [ ],
                        classification:{
                            scheme: arr[i].classification_scheme,
                            id: arr[i].classification_id,
                            description: arr[i]. classification_description,
                            uri: arr[i].classification_uri
                        },
                        quantity: arr[i].quantity,
                        unit :{
                            name: arr[i].unit_name,
                            value: {
                                amount: Number(arr[i].unit_value_amount),
                                currency: arr[i].unit_value_currency
                            }
                        }
                    });
                }
                return items;
            }

            function getMilestones(arr) {
                var milestones =[];
                for (var i=0; i < arr.length;i++){
                    milestones.push({
                        title: arr[i].title,
                        description: arr[i].description,
                        dueDate: arr[i].duedate,
                        dateModified: arr[i].date_modified,
                        status: arr[i].status
                    });
                }
                return milestones;
            }

            function getTransactions( arr ){
                var transactions = [];

                for (var i =0; i< arr.length;i++){
                    transactions.push({
                        source: arr[i].source,
                        date: arr[i].date,
                        value : {
                            amount: Number(arr[i].value_amount),
                            currency: arr[i].currency
                        },
                        providerOrganization:{
                            scheme: arr[i].providerorganization_scheme,
                            id: arr[i].providerorganization_id,
                            legalName: arr[i].providerorganization_legalname,
                            uri: arr[i].providerorganization_uri
                        },
                        receiverOrganization:{
                            scheme: arr[i].receiverorganization_scheme,
                            id: arr[i].receiverorganization_id,
                            legalName: arr[i].receiverorganization_legalname,
                            uri: arr[i].receiverorganization_uri
                        },
                        uri: arr[i].uri
                    });
                }

                return transactions;
            }

            function getAmendmentChanges( arr ){
                var changes = [];
                for (var i=0; i < arr.length;i++){
                    changes.push({
                        property: arr[i].property,
                        former_value: arr[i].former_value
                    });
                }

                return changes;
            }

            //aquí se genera el release
            var release = {
                ocid: String(data[0].cp.id),
                id: "id de release",
                date: data[0].cp.fecha_creacion,
                tag: ["contract"],
                initiationType: "tender",
                planning: {
                    budget: {
                        source: data[0].budget.budget_source,
                        id: data[0].budget.id,
                        description: data[0].budget.budget_description,
                        amount: {
                            amount: Number (data[0].budget.budget_amount),
                            currency: data[0].budget.budget_currency
                        },
                        project: data[0].budget.budget_project,
                        projectID: data[0].budget.budget_projectid,
                        uri: data[0].budget.budget_uri
                    },
                    rationale: data[0].planning.rationale,
                    documents: getDocuments(data[4])
                },
                tender: {
                    id: data[0].tender.id,
                    title: data[0].tender.title,
                    description: data[0].tender.description,
                    status: data[0].tender.status,
                    items: getItems(data[9]),
                    minValue: {
                        amount: Number (data[0].tender.minvalue_amount),
                        currency: data[0].tender.minvalue_currency
                    },
                    value: {
                        amount: Number (data[0].tender.value_amount),
                        currency: data[0].tender.value_currency
                    },
                    procurementMethod: data[0].tender.procurementmenthod,
                    procurementMethodRationale: data[0].tender.procurementMethod_rationale,
                    awardCriteria: data[0].tender.awardcriteria,
                    awardCriteriaDetails: data[0].tender.awardcriteria_details,
                    submissionMethod: data[0].tender.submissionMethod,
                    submissionMethodDetails: data[0].tender.submissionMethod_details,
                    tenderPeriod: {
                        startDate: data[0].tender.tenderperiod_startdate,
                        endDate: data[0].tender.tenderperiod_enddate
                    },
                    enquiryPeriod: {
                        startDate: data[0].tender.enquiryperiod_startdate,
                        endDate: data[0].tender.enquiryperiod_enddate
                    },
                    hasEnquiries: (data[0].tender.hasenquiries == 0) ? true : false,
                    eligibilityCriteria: data[0].tender.eligibilitycriteria,
                    awardPeriod: {
                        startDate: data[0].tender.tenderperiod_startdate,
                        endDate: data[0].tender.tenderperiod_enddate
                    },
                    numberOfTenderers: data[0].tender.numberoftenderers,
                    tenderers: getOrganizations(data[1]),
                    procuringEntity: {
                        identifier: {
                            scheme: data[0].procuringentity.identifier_scheme,
                            id: data[0].procuringentity.identifier_id,
                            legalName: data[0].procuringentity.identifier_legalname,
                            uri: data[0].procuringentity.identifier_uri
                        },
                        //additionalIdentifiers: [ ],
                        name: data[0].procuringentity.name,
                        address: {
                            streetAddress: data[0].procuringentity.address_streetaddress,
                            locality: data[0].procuringentity.address_locality,
                            region: data[0].procuringentity.address_region,
                            postalCode: data[0].procuringentity.address_postalcode,
                            countryName: data[0].procuringentity.address_countryname
                        },
                        contactPoint: {
                            name: data[0].procuringentity.contactpoint_name,
                            email: data[0].procuringentity.contactpoint_email,
                            telephone: data[0].procuringentity.contactpoint_telephone,
                            faxNumber: data[0].procuringentity.contactpoint_faxnumber,
                            url: data[0].procuringentity.contactpoint_url
                        }
                    },
                    documents: getDocuments(data[5]),
                    milestones: getMilestones(data[12]),
                    amendment: {
                        date: data[0].tender.amendment_date,
                        changes: getAmendmentChanges(data[15]),
                        rationale: data[0].tender.amendment_rationale
                    }
                },
                buyer: {
                    identifier: {
                        scheme: data[0].buyer.identifier_scheme,
                        id: data[0].buyer.identifier_id,
                        legalName: data[0].buyer.identifier_legalname,
                        uri: data[0].buyer.identifier_uri
                    },
                    //additionalIdentifiers: [ ],
                    name: data[0].buyer.name,
                    address: {
                        streetAddress: data[0].buyer.address_streetaddress,
                        locality: data[0].buyer.address_locality,
                        region: data[0].buyer.address_region,
                        postalCode: data[0].buyer.address_postalcode,
                        countryName: data[0].buyer.address_contryname
                    },
                    contactPoint: {
                        name: data[0].buyer.contactpoint_name,
                        email: data[0].buyer.contactpoint_email,
                        telephone: data[0].buyer.contactpoint_telephone,
                        faxNumber: data[0].buyer.contactpoint_faxnumber,
                        url: data[0].buyer.contactpoint_url
                    }
                },


                awards: [ // pueden ser varios
                    {
                        id: data[0].award.id,
                        title: data[0].award.title,
                        description: data[0].award.description,
                        status: data[0].award.status,
                        date: data[0].award.award_date,
                        value: {
                            amount: Number (data[0].award.value_amount),
                            currency: data[0].award.value_currency
                        },
                        suppliers: getOrganizations(data[2]), //pueden pertenecer a diferentes awards
                        items: getItems(data[10]),
                        contractPeriod: {
                            startDate: data[0].award.contractperiod_startdate,
                            endDate: data[0].award.contractperiod_enddate,
                        },
                        documents: getDocuments(data[6]),
                        amendment: {
                            date: data[0].award.amendment_date,
                            changes: getAmendmentChanges(data[16]),
                            rationale: data[0].award.amendment_rationale
                        }
                    }

                ],
                contracts: [
                    { //pueden ser varios
                        id: data[0].contract.id,
                        awardID: String(data[0].contract.awardid),
                        title: data[0].contract.title,
                        description: data[0].contract.description,
                        status: data[0].contract.status,
                        period: {
                            startDate: data[0].contract.period_startdate,
                            endDate: data[0].contract.period_enddate
                        },
                        value: data[0].contract.value,
                        items: getItems(data[11]),
                        dateSigned: data[0].contract.datesigned,
                        documents: getDocuments(data[7]),
                        amendment: {
                            date: data[0].contract.amendment_date,
                            changes: getAmendmentChanges(data[17]),
                            rationale: data[0].contract.amendment_rationale
                        },
                        implementation: { 
                            transactions: getTransactions(data[14]),
                            milestones: getMilestones(data[13]),
                            documents: getDocuments(data[8])
                        }
                    }
                ],
                language: 'es'
            };

            if (type =="release-record"){

                var release_record = {
                    uri: "",
                    publishedDate: (new Date).toISOString(),//getMString(new Date()),
                    releases : [ release ],
                    publisher: {
                        name: data[3].name,
                        scheme: data[3].scheme,
                        uid: data[3].uid,
                        uri: data[3].uri
                    },
                    license: "",
                    publicationPolicy: ""
                };

                return release_record;
            }

            return release;

         })

    }).then(function (data) {
        console.log("Done ;)");
        res.json(data);
    }).catch(function (error) {
        console.log("ERROR: ",error);
        res.send(error);
    });
});

module.exports = router;
