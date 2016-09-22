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

passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
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
};

var isNotAuthenticated = function (req, res, next) {
    if (req.isUnauthenticated())
        return next();
    // if the user is authenticated then redirect him to the main page
    res.redirect('/main');
};

/* * * * * * * * * * * RUTAS * * * * * * * * * * * * * */

/* GET home page. */
router.get('/', isNotAuthenticated, function (req, res, next) {
    res.render('index', {title: 'Contrataciones Abiertas', message: req.flash('message')});
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
    res.render('main', { user: req.user, title: 'Contrataciones Abiertas' });
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var pgp      = require("pg-promise")();

var edca_db;

// Linked postgresql docker container
if ( typeof process.env.POSTGRES_PORT_5432_TCP_ADDR != "undefined" ) {
  process.env.EDCA_DB = 'postgres://';
  process.env.EDCA_DB += process.env.POSTGRES_USER || 'postgres';
  process.env.EDCA_DB += ':';
  process.env.EDCA_DB += process.env.POSTGRES_ENV_POSTGRES_PASSWORD || '';
  process.env.EDCA_DB += '@';
  process.env.EDCA_DB += process.env.POSTGRES_PORT_5432_TCP_ADDR;
  process.env.EDCA_DB += '/';
  process.env.EDCA_DB += process.env.POSTGRES_DB || 'postgres';
}

if ( typeof process.env.EDCA_DB != "undefined" ){
    console.log("EDCA_DB: ", process.env.EDCA_DB);
    edca_db = pgp( process.env.EDCA_DB );
} else {
    console.log("Warning: EDCA_DB env variable is not set\n " +
        " defaulting to -> postgres://tester:test@localhost/edca");
    edca_db = pgp("postgres://tester:test@localhost/edca");
}

/* GET main page with data */
router.get('/main/:contractingprocess_id', isAuthenticated, function (req,res) {

    edca_db.task(function (t) {
        // this = t = transaction protocol context;
        // this.ctx = transaction config + state context;
        return t.batch([
            t.one("select * from ContractingProcess where id = $1",  [req.params.contractingprocess_id]),
            t.one("select * from Planning where contractingprocess_id= $1", [req.params.contractingprocess_id]),
            t.one("select * from budget where contractingprocess_id = $1", [req.params.contractingprocess_id]),
            t.one("select * from Tender where contractingprocess_id = $1", [req.params.contractingprocess_id]),
            t.one("select * from Award where contractingprocess_id = $1", [req.params.contractingprocess_id]),
            t.one("select * from Contract where contractingprocess_id = $1", [req.params.contractingprocess_id])
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

            res.render('main', {
                user: req.user,
                title: 'Contrataciones abiertas',
                cp: data[0],
                planning: data[1],
                budget: data[2],
                tender: data[3],
                award: data[4],
                contract: data[5]
            });
        })
        .catch(function (error) {
            console.log("Error", error);

            res.render('main', {
                user: req.user,
                title: 'Contrataciones abiertas',
                error: 'Proceso de contratación no encontrado'
            });
        });
});

// NUEVO PROCESO DE CONTRATACIÓN
router.post('/new-process', isAuthenticated, function (req, res) {
    edca_db.tx(function (t) {

        return t.one("insert into ContractingProcess (fecha_creacion, hora_creacion, ocid, stage ) values (current_date, current_time, concat('NUEVA_CONTRATACION_', current_date,'_', current_time), 0) returning id")
            .then(function (process) {

                return t.batch([process = { id : process.id},
                    t.one("insert into Planning (ContractingProcess_id) values ($1) returning id", process.id),
                    t.one ("insert into Tender (ContractingProcess_id,status) values ($1, $2) returning id as tender_id", [process.id, 'none']),
                    t.one ("insert into Contract (ContractingProcess_id, status) values ($1, $2) returning id", [process.id, 'none'])
                ]);

            }).then(function (info) {

                var process= {process_id : info[0].id};
                var planning = {planning_id : info[1].id};

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

    }).then(function (data) {
        console.log(data);
        res.json( { url: '/main/'+data[0].process_id } );

    }).catch(function (error) {
        res.json({"id": 0});
        console.log("ERROR: ", error);
    });
});

/* Update Planning -> Budget */
router.post('/update-planning', isAuthenticated, function (req, res) {

    edca_db.tx(function (t) {
        var planning = this.one("update planning set rationale = $1 where ContractingProcess_id = $2 returning id", [req.body.rationale, req.body.contractingprocess_id]);
        var budget = this.one("update budget set budget_source = $2, budget_budgetid =$3, budget_description= $4, budget_amount=$5, budget_currency=$6, budget_project=$7, budget_projectid=$8, budget_uri=$9" +
            " where ContractingProcess_id=$1 returning id",
            [
                req.body.contractingprocess_id,
                req.body.budget_source,
                req.body.budget_budgetid,
                req.body.budget_description,
                ( isNaN(req.body.budget_amount) ?null:req.body.budget_amount),
                req.body.budget_currency,
                req.body.budget_project,
                req.body.budget_projectid,
                req.body.budget_uri
            ]);

        return this.batch([planning, budget]);

    }).then(function (data) {
        res.send('La etapa de planeación ha sido actualizada');
        console.log('Update planning: ',data);
    }).catch(function (error) {
        console.log("ERROR: ",error);
        res.send('Error');
    });

});

/* Update Tender*/
/*
function dateCol(name) {
    return {
        name: name,
        init: function (value) {
            return value != '' ? value : null;
        }
    };
}

function numericCol(name){
    return {
        name : name,
        init: function (value) {
            return !isNaN( value) ? +value : null;
        }
    }
}

// Reusable ColumnSet:
var csUpdateTender = new pgp.helpers.ColumnSet(['tenderid','title', 'description', 'status', numericCol('minvalue_amount'), 'minvalue_currency', numericCol('value_amount'),'value_currency',
    'procurementmethod', 'procurementmethod_rationale', 'awardcriteria', 'awardcriteria_details', 'submissionmethod', 'submissionmethod_details',
    dateCol('tenderperiod_startdate'), dateCol('tenderperiod_enddate'), dateCol('enquiryperiod_startdate', dateCol('enquiryperiod_enddate',
        'hasenquiries', 'eligibilitycriteria', dateCol('awardperiod_startdate'), dateCol('awardperiod_enddate'), numericCol('numberoftenderers'),
        dateCol('amendment_date'), 'amendment_rationale'
    ))], {table: 'tender'});

router.post('/update-tender', isAuthenticated, function (req, res) {
    var query = pgp.helpers.update(req.body, csUpdateTender) + " where ContractingProcess_id = "
        + req.body.contractingprocess_id + " returning id";

    console.log(req.body);

    edca_db.one(query).then(function (data) {
        console.log("Update tender: ", data);
        res.send("La etapa de licitación ha sido actualizada");
    }).catch(function (error) {
        res.send("ERROR");
        console.log("ERROR: ", error);
    });
});
*/

router.post('/update-tender',isAuthenticated, function (req, res) {
    edca_db.one("update tender set tenderid =$2, title= $3, description=$4, status=$5, minvalue_amount=$6, minvalue_currency=$7, value_amount=$8, value_currency=$9, procurementmethod=$10," +
        "procurementmethod_rationale=$11, awardcriteria=$12, awardcriteria_details=$13, submissionmethod=$14, submissionmethod_details=$15," +
        "tenderperiod_startdate=$16, tenderperiod_enddate=$17, enquiryperiod_startdate=$18, enquiryperiod_enddate=$19 ,hasenquiries=$20, eligibilitycriteria=$21, awardperiod_startdate=$22," +
        "awardperiod_enddate=$23, numberoftenderers=$24, amendment_date=$25, amendment_rationale=$26" +
        " where ContractingProcess_id = $1 returning id", [
        req.body.contractingprocess_id,
        req.body.tenderid,
        req.body.title,
        req.body.description,
        req.body.status,
        (isNaN(req.body.minvalue_amount)?null:req.body.minvalue_amount),
        req.body.minvalue_currency,
        (isNaN(req.body.value_amount)?null:req.body.value_amount),
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
router.post('/update-award',isAuthenticated, function (req, res) {
    edca_db.one("update award set awardid=$2, title= $3, description=$4,status=$5,award_date=$6,value_amount=$7,value_currency=$8,contractperiod_startdate=$9," +
        "contractperiod_enddate=$10,amendment_date=$11,amendment_rationale=$12 " +
        " where ContractingProcess_id = $1 returning id",
        [
            req.body.contractingprocess_id,
            req.body.awardid,
            req.body.title,
            req.body.description,
            req.body.status,
            (req.body.award_date!='')?req.body.award_date:null,
            (isNaN(req.body.value_amount)?null:req.body.value_amount),
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
router.post('/update-contract', isAuthenticated, function (req, res) {
    edca_db.one("update contract set contractid=$2, awardid=$3, title=$4, description=$5, status=$6, period_startdate=$7, period_enddate=$8, value_amount=$9, value_currency=$10," +
        " datesigned=$11, amendment_date=$12, amendment_rationale=$13 " +
        " where ContractingProcess_id = $1 returning id", [
        req.body.contractingprocess_id,
        req.body.contractid,
        req.body.awardid,
        req.body.title,
        req.body.description,
        req.body.status,
        (req.body.period_startdate!='')?req.body.period_startdate:null,
        (req.body.period_enddate!='')?req.body.period_enddate:null,
        (isNaN(req.body.value_amount)?null:req.body.value_amount),
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
router.post('/new-document', isAuthenticated, function(req,res){
    edca_db.one('insert into $1~ (contractingprocess_id, document_type, documentid, title, description, url, date_published, date_modified, format, language) values ($2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id',
        [
            req.body.table,
            req.body.ocid,
            req.body.document_type,
            req.body.documentid,
            req.body.title,
            req.body.description,
            req.body.url,
            (req.body.date_published!='')?req.body.date_published:null,
            (req.body.date_modified!='')?req.body.date_modified:null,
            req.body.format,
            req.body.language
        ]).then(function (data) {
        res.send("Se ha creado un nuevo documento");
        console.log("new "+ req.body.table + ": ", data);

    }).catch(function (error) {
        res.send('ERROR');
        console.log("ERROR: ", error)
    });
});

router.post('/newdoc-fields', function (req,res) {
    res.render('modals/newdoc-fields',{localid: req.body.localid, table: req.body.table});
});

/* New organization */
router.post('/new-organization', isAuthenticated, function (req, res) {
    //falta pasar id de award y tender segun sea el caso
    edca_db.one("insert into $17~" +
        " (contractingprocess_id, identifier_scheme, identifier_id, identifier_legalname, identifier_uri, name, address_streetaddress," +
        " address_locality, address_region, address_postalcode, address_countryname, contactpoint_name, contactpoint_email, contactpoint_telephone," +
        " contactpoint_faxnumber, contactpoint_url) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning id",
        [
            req.body.localid,
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
            req.body.table
        ]).then(function (data) {
        res.send('La organización ha sido registrada'); // envía la respuesta y presentala en un modal
        console.log("Create organization: ", data);
    }).catch(function (error) {
        res.send("Error");
        console.log("ERROR: ",error);
    });
});

router.post('/neworg-fields', function (req,res) {
    res.render('modals/neworg-fields', { localid: req.body.localid , table : req.body.table });
});

router.post('/new-item',isAuthenticated,function (req,res) {
    edca_db.one('insert into $1~ (contractingprocess_id, itemid, description, classification_scheme, classification_id, classification_description, classification_uri,' +
        ' quantity, unit_name, unit_value_amount, unit_value_currency) values ($2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning id',
        [
            req.body.table,
            req.body.localid,
            req.body.itemid,
            req.body.description,
            req.body.classification_scheme,
            req.body.classification_id,
            req.body.classification_description,
            req.body.classification_uri,
            (isNaN(req.body.quantity)?null:req.body.quantity),
            req.body.unit_name,
            (isNaN(req.body.unit_value_amount)?null:req.body.unit_value_amount),
            req.body.unit_value_currency
        ]).then(function (data) {
        console.log("New item: ", data);
        res.send('Datos registrados');
    }).catch(function (error) {
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});

router.post('/newitem-fields', function (req,res) {
    res.render('modals/newitem-fields', { localid: req.body.localid , table : req.body.table });
});

router.post('/new-milestone', isAuthenticated,function (req,res) {
    edca_db.one('insert into $1~ (contractingprocess_id, milestoneid, title, description, duedate, date_modified, status) values ($2,$3,$4,$5,$6,$7,$8) returning id',
        [
            req.body.table,
            req.body.localid,
            req.body.milestoneid,
            req.body.title,
            req.body.description,
            (req.body.duedate!='')?req.body.duedate:null,
            (req.body.date_modified!='')?req.body.date_modified:null,
            req.body.status
        ]).then(function (data) {
        console.log("New milestone: ", data);
        res.send('Datos registrados');
    }).catch(function (error) {
        console.log('ERROR: ', error);
        res.send('ERROR');
    });

});

router.post('/newmilestone-fields', function (req,res) {
    res.render('modals/newmilestone-fields', { localid: req.body.localid , table : req.body.table });
});

router.post('/new-transaction', isAuthenticated,function (req,res) {
    edca_db.one('insert into implementationtransactions (contractingprocess_id, transactionid, source, implementation_date, value_amount, value_currency, ' +
        'providerorganization_scheme,providerorganization_id,providerorganization_legalname,providerorganization_uri,' +
        'receiverorganization_scheme,receiverorganization_id,receiverorganization_legalname,receiverorganization_uri, uri) ' +
        'values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) returning id',[
        req.body.localid,
        req.body.transactionid,
        req.body.source,
        (req.body.implementation_date != '')?req.body.implementation_date:null,
        (isNaN(req.body.value_amount)?null:req.body.value_amount),
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

router.post('/newtransaction-fields', function (req,res) {
    res.render('modals/newtransaction-fields', { localid: req.body.localid });
});

// new amendment change
router.post('/new-amendment-change',isAuthenticated, function (req, res) {
    edca_db.one('insert into $1~ (contractingprocess_id, property, former_value) values ($2,$3,$4) returning id',[
        req.body.table,
        req.body.localid,
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

router.post('/newamendmentchange-fields', function (req,res) {
    res.render('modals/newamendmentchange-fields', { localid: req.body.localid, table : req.body.table });
});

// Update buyer, procuring entity
router.post('/update-organization', isAuthenticated, function (req, res) {

    edca_db.one("update $1~ set identifier_scheme= $3, identifier_id =$4, identifier_legalname=$5, identifier_uri=$6, name = $7, address_streetaddress=$8," +
        " address_locality=$9, address_region =$10, address_postalcode=$11, address_countryname=$12, contactpoint_name=$13, contactpoint_email=$14, contactpoint_telephone=$15," +
        " contactpoint_faxnumber=$16, contactpoint_url=$17 where ContractingProcess_id = $2 returning id",
        [
            req.body.table,
            req.body.localid,
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
        console.log("Update "+req.body.table+": ", data);
    }).catch(function (error) {
        res.send("Error");
        console.log("ERROR: ",error);
    });
});

router.post('/org-fields',function(req,res){
    console.log("localid ->",req.body.localid);
    console.log("table ->",req.body.table);

    edca_db.one('select * from $1~ where contractingprocess_id = $2', [
        req.body.table,
        req.body.localid
    ]).then(function (data) {
        res.render('modals/org-fields',{ data : data, table: req.body.table });
    }).catch(function (error) {
        console.log('ERROR: ', error);
        res.send('ERROR');
    });

});

// Update publisher
router.post('/update-publisher',isAuthenticated, function (req, res) {

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

router.post('/publisher', function (req, res) {
    edca_db.one("select * from publisher where contractingprocess_id=$1",[req.body.localid]).then(function (data) {
        res.render('modals/publisher',{data: data});
    }).catch(function (error) {
        console.log("ERROR: ", error);
    });
});

//update OCID
router.post('/update-ocid',isAuthenticated,function (req, res) {
    edca_db.one("update contractingprocess set ocid = trim($1) where id=$2 returning id",[ req.body.ocid, req.body.localid ]).then(function (data) {
        res.send("Identificador de proceso actualizado");
        console.log("Update ocid:", data);
    }).catch(function (error) {
        console.log("ERROR: ", error);
        res.send('ERROR');
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

router.post('/search-process-by-ocid',function(req, res){
    edca_db.manyOrNone("select * from ContractingProcess where ocid ilike '%$1#%' ",[ req.body.ocid ]).then(function (data) {
        res.render('modals/process-list',{ data : data});
    }).catch(function (error) {
        console.log(error);
        res.send('ERROR');
    });
});


//get list of transactions
router.post('/transaction-list',function (req, res) {
    edca_db.manyOrNone('select * from implementationtransactions where contractingprocess_id=$1',[
        req.body.ocid
    ]).then(function(data){
        console.log(data);
        res.render('modals/transaction-list', {table : req.body.table, data: data});
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
        res.render('modals/organization-list', {table: req.body.table, data: data});
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
        res.render('modals/item-list', {table: req.body.table, data: data});
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
        res.render('modals/document-list', {data: data, table: req.body.table});
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
        res.render('modals/milestone-list', {table: req.body.table, data: data});
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
        res.render('modals/amendmentchange-list', {table: req.body.table, data: data});
    }).catch(function(error){
        console.log('ERROR: ', error);
        res.send('ERROR');
    });
});


router.post('/delete', isAuthenticated,function (req,res) {
    console.log(req.body.id);
    console.log(req.body.table);
    edca_db.result('delete from $1~ where id = $2', [
        req.body.table,
        req.body.id
    ]).then(function (result) {
        res.json( {msg: "Registros eliminados: " +result.rowCount, status : 0});
    }).catch(function (error) {
        res.json({msg: 'ERROR', status: 1});
        console.log('ERROR',error);
    });
});


//Protocol buffers
//var ProtoBuf = require("protobufjs");

var ocds = require('../io/ocds');

router.get('/publish/:type/:localid/:outputname', function (req,res) {
    var localid = req.params.localid;
    var type = req.params.type;


    ocds.getOCDSJSON( Number(req.params.localid) , req.params.type, edca_db ).then(function (data) {

        delete data.localid;

       // var builder = ProtoBuf.loadProtoFile("../models/proto/ocds.proto"),
         //   OCDS = builder.build("OCDS"),
           // ReleasePackage = OCDS.ReleasePackages.ReleasePackage;


        /*
        delete data.releases[0].planning;
        delete data.releases[0].tender;
        delete data.releases[0].buyer;
        delete data.releases[0].awards;
        delete data.releases[0].contracts;
*/

        //var rp = new ReleasePackage(data);
        //var buffer = rp.encode();
        //console.log(buffer);
        //socket
        //send buffer

        res.send(data);
    }).catch(function (error) {
        console.log(error);
        return (error);
    });

});


var sha3_512 = require('js-sha3').sha3_512;

var PROTO_PATH = '../models/proto/record1.proto';
var grpc = require('grpc');
var proto = grpc.load(PROTO_PATH).record1;

router.post ('/publish/rpc', function (req, res){

    var client1  = new proto.SendRPC('localhost:50051',
        grpc.credentials.createInsecure());

    ocds.getOCDSJSON( Number(req.body.contractingprocess_id) , "release-package", edca_db ).then(function (data) {

        delete data.localid;
        var buff = new Buffer( JSON.stringify(data) ).toString('base64');

        client1.addRecord({
            headers : {
                type : "Release Package",
                version : "1.0", //OCDS scheme version
                uuid : data.ocid,
                timestamp : (new Date()).getTime(),
                payload_hash : "",
                source_hash : "",
                metadata_hash : ""
            },
            source : {
                id : "",
                address : "",
                certificate :"",
                metadata : ""
            },
            hash : "",
            payload : buff, // base64 encoded JSON string
            metadata : "",
            signature : ""
        }, function (err, response) {
            console.log(response);
            res.json ( {
                status : "Ok",
                message:"El proceso ha sido guardado" } );
        });



    }).catch(function (error) {
        console.log(error);

        res.json({
            status : "ERROR",
            message: "Ha ocurrido un error"
        })
    });

});


var path  = require('path');
var multer = require('multer');
var upload = multer({ dest: path.join(__dirname, './uploads')});

//Converter Class
var Converter = require("csvtojson").Converter;

router.post('/upload-stage', isAuthenticated, upload.single('datafile'), function (req, res) {

    console.log("Uploaded file: ", req.file);
    var converter = new Converter({});
    require('fs').createReadStream(req.file.path).pipe(converter);

    converter.on("error",function(errMsg,errData){
        //do error handling here
        console.log('Error: ', errMsg);
        console.log('Data: ', errData);
    });

    //end_parsed will be emitted once parsing finished
    converter.on("end_parsed", function (jsonArray) {
        //console.log(jsonArray); //here is your result jsonarray

        if (req.body.stage == 'planning'){

            /*
            INVITACION_LICITACION
            DESCRIPCION_CONTRATO
            FUENTE_PRESUPUESTARIA -> budget source
            IDENTIFICADOR_PRESUPUESTO -> budget id
            DESCRIPCION_PRESUPUESTO -> budget description
            MONTO_ASIGNADO -> budget amount
            MONEDA -> budget currency
            PROYECTO_PRESUPUESTARIO, -> budget_project
            IDENTIFICADOR_PROYECTO_PRESUPUESTARIO, -> budget_projectid
            URI_PRESUPUESTO, -> budget uri
            FUNDAMENTO, -> planning -> rationale
            EVALUACION_NECESIDADES,
            PLAN_PROYECTO,PLAN_CONTRATACION,
            ESTUDIO_FACTIBILIDAD,
            ESTUDIO_MERCADO,
            URL_ESTUDIO_FACTIBILIDAD,
            URL_PLAN_CONTRATACION,
            URL_EVALUACION_NECESIDADES,
            URL_ESTUDIO_MERCADO
            */

            edca_db.tx (function (t) {

                return t.one('update planning set rationale = $2 where contractingprocess_id = $1 returning id as planning_id',
                    [
                        req.body.localid,
                        jsonArray[0].FUNDAMENTO
                    ]).then(function (data) {
                    var budget = t.one('update budget set budget_source = $2, budget_budgetid = $3, budget_description = $4, budget_amount = $5, budget_currency = $6, budget_project = $7, budget_projectid = $8,' +
                        'budget_uri = $9 where contractingprocess_id = $1 returning id as budget_id',
                        [
                            req.body.localid,
                            jsonArray[0].FUENTE_PRESUPUESTARIA,
                            jsonArray[0].IDENTIFICADOR_PRESUPUESTO,
                            jsonArray[0].DESCRIPCION_PRESUPUESTO,
                            Number(jsonArray[0].MONTO_ASIGNADO),
                            jsonArray[0].MONEDA,
                            jsonArray[0].PROYECTO_PRESUPUESTARIO,
                            jsonArray[0].IDENTIFICADOR_PROYECTO_PRESUPUESTARIO,
                            jsonArray[0].URI_PRESUPUESTO

                        ]);

                    return t.batch([data , budget]);
                });


            }).then(function (data) {
                console.log('PLanning stage loaded: ', data);
                res.redirect('/main/'+ req.body.localid);
            }).catch(function (error) {
                console.log('ERROR: ',error);
                res.redirect('/main/'+ req.body.localid);
            });

        } else if (req.body.stage == 'tender'){
            /*
            INVITACION_LICITACION,
            IDENTIFICADOR_LICITACION, -> tenderid

            TITULO_LICITACION, -> title
            DESCRIPCION_LICITACION, -> description
            ESTATUS_LICITACION, -> status
            VALOR_MINIMO, -> minvalue_amount
            MONEDA_VALOR_MINIMO, -> minvalue_currency
            VALOR, -> value_amount
            MONEDA_VALOR, -> value_currency
            METODO_ADQUISICION, -> procurementmethod

            CARACTER_ADQUISICION,
            FORMA_PROCESO_ADQUISICION,

            JUSTIFICACION_METODO, -> procurementmethod_rationale
            CRITERIO_ADJUDICACION, -> awardcriteria
            DETALLES_CRITERIO_ADJUDICACION, -> awardcriteria_details
            METODO_RECEPCION, -> submissionmethod
            DETALLES_METODO_RECEPCION, -> submissionmethod_details

            PERIODO_RECEPCION_PROPUESTAS, -> tender period startdate
            FECHA_INICIO_ACLARACIONES, -> enquiry period startdate
            FECHA_CIERRE_ACLARACIONES, -> enquiry period enddate
            TUVO_ACLARACIONES, -> has enquiries

            TUVO_TESTIGO_SOCIAL,
            IDENTIFICADOR_TESTIGO_SOCIAL,
            NOMBRE_TESTIGO_SOCIAL,

            CRITERIOS_ELIGIBILIDAD, -> eligibility criteria
            PERIODO_ADJUDICACION, -> awardperiod_startdate
            NUMERO_PARTICIPANTES, -> numberoftenderers

            NUMERO_PARTICIPANTES_INHABILITADOS,
            ENTIDAD_CONTRATACION,
            AVISO_LICITACION,
            AVISO_AUDIENCIA_PUBLICA,
            DOCUMENTOS_LICITACION,
            CRITERIOS_ELEGIBILIDAD_PUBLICADO,
            ESPECIFICACIONES_TECNICAS,
            CRITERIOS_EVALUACION,
            ACLARACIONES,
            PRESELECCION_PARTICIPANTES,
            PARTICIPANTES,
            DECLARACION_INTERESES,
            INHABILITACIONES,
            URL_DETALLES_CRITERIO_ADJUDICACION,
            URL_AVISO_LICITACION,
            URL_AVISO_AUDIENCIA_PUBLICA,
            URL_DOCUMENTOS_LICITACION,
            URL_CRITERIOS_ELEGIBILIDAD,
            URL_ESPECIFICACIONES_TECNICAS,
            URL_CRITERIOS_EVALUACION,
            URL_ACLARACIONES,
            URL_PARTICIPANTES,
            URL_INHABILITACIONES
            */
            edca_db.one('update tender set tenderid =$2, title = $3, description  = $4, status = $5,  minvalue_amount = $6, minvalue_currency= $7, value_amount = $8, value_currency = $9, ' +
                'procurementmethod = $10, procurementmethod_rationale= $11, awardcriteria = $12, awardcriteria_details = $13, submissionmethod = $14, submissionmethod_details = $15, ' +
                'tenderperiod_startdate = $16 , enquiryperiod_startdate = $17, enquiryperiod_enddate = $18, hasenquiries = $19, ' +
                'eligibilitycriteria = $20, awardperiod_startdate = $21, numberoftenderers = $22' +
                ' where contractingprocess_id = $1 returning id as tender_id',
                [
                    req.body.localid,
                    jsonArray[0].IDENTIFICADOR_LICITACION,
                    jsonArray[0].TITULO_LICITACION,
                    jsonArray[0].DESCRIPCION_LICITACION,
                    'active', //jsonArray[0].ESTATUS_LICITACION
                    Number(jsonArray[0].VALOR_MINIMO),
                    jsonArray[0].MONEDA_VALOR_MINIMO,
                    Number(jsonArray[0].VALOR),
                    jsonArray[0].MONEDA_VALOR,

                    jsonArray[0].METODO_ADQUISICION,
                    jsonArray[0].JUSTIFICACION_METODO,
                    jsonArray[0].CRITERIO_ADJUDICACION,
                    jsonArray[0].DETALLES_CRITERIO_ADJUDICACION,
                    jsonArray[0].METODO_RECEPCION,
                    jsonArray[0].DETALLES_METODO_RECEPCION,

                    jsonArray[0].PERIODO_RECEPCION_PROPUESTAS,
                    jsonArray[0].FECHA_INICIO_ACLARACIONES,
                    jsonArray[0].FECHA_CIERRE_ACLARACIONES,
                    Number(jsonArray[0].TUVO_ACLARACIONES),

                    jsonArray[0].CRITERIOS_ELEGIBILIDAD,
                    jsonArray[0].PERIODO_ADJUDICACION,
                    Number (jsonArray[0].NUMERO_PARTICIPANTES)
                ]).then(function (data) {
                console.log('Tender stage loaded: ', data);
                res.redirect('/main/'+ req.body.localid);
            }).catch(function (error) {
                console.log("ERROR: ", error);
                res.redirect('/main/'+ req.body.localid);
            });

        } else if (req.body.stage == 'award') {

            /*
            IDENTIFICADOR_LICITACION,
            IDENTIFICADOR_ADJUDICACION, -> award id
            TITULO_ADJUDICACION, -> title
            DESCRIPCION_ADJUDICACION, -> description
            ESTATUS_ADJUDICACION, -> status
            FECHA_ADJUDICACION, -> award_date
            VALOR_ADJUDICACION, -> value_amount
            MONEDA_ADJUDICACION, -> value_currency
            NUMERO_INCONFORMIDADES_RECIBIDAS,
            NUMERO_INCONFORMIDADES_PROCESDENTES,
            NUMERO_INCONFORMIDADES_RECHAZADAS
            */

            edca_db.one('update award set awardid = $2, title = $3, description = $4, status = $5, award_date = $6, value_amount = $7, value_currency = $8 where contractingprocess_id = $1 returning id as award_id',
                [
                    req.body.localid,
                    jsonArray[0].IDENTIFICADOR_ADJUDICACION,
                    jsonArray[0].TITULO_ADJUDICACION,
                    jsonArray[0].DESCRIPCION_ADJUDICACION,
                    'active',//jsonArray[0].ESTATUS,
                    jsonArray[0].FECHA_ADJUDICACION,
                    Number(jsonArray[0].VALOR_ADJUDICACION),
                    jsonArray[0].MONEDA_ADJUDICACION

                ]).then(function (data) {
                console.log('Award stage loaded: ', data);
                res.redirect('/main/'+ req.body.localid);
            }).catch(function (error) {
                console.log("ERROR: ", error);
                res.redirect('/main/'+ req.body.localid);
            });

        } else if (req.body.stage == 'contract'){

            /*IDENTIFICADOR_ADJUDICACION, -> awardid
            IDENTIFICADOR_CONTRATO, -> contractid
            IDENTIFICADOR_ADJUDICACION_CONTRATO,
            TITULO_CONTRATO, -> title
            DESCRIPCION_CONTRATO, -> description
            ESTATUS_CONTRATO, -> status
            PERIODO_CONTRATO_INICIO,-> period_startdate
            PERIODO_CONTRATO_FINAL, -> period_enddate
            VALOR_CONTRATO, -> value_amount
            FECHA_FIRMA_CONTRATO, -> datesigned
            CONTRATO_FIRMADO,
            CLAUSULAS,
            CRONOGRAMA_CONTRATO,
            ANEXOS_CONTRATO,
            GARANTIAS_ANTICIPO,
            GARANTIAS_CUMPLIMIENTO,
            SUBCONTRATOS,
            URL_CONTRATO_FIRMADO,
            URL_CLAUSULAS,
            URL_ANEXOS_CONTRATO,
            URL_GARANTIAS_ANTICIPO,
            URL_GARANTIAS_CUMPLIMIENTO*/
            edca_db.one('update contract set awardid =$2, contractid = $3 ,title = $4, description=$5, status = $6, period_startdate=$7, period_enddate=$8, value_amount=$9,' +
                ' datesigned=$10 where contractingprocess_id = $1 returning id as contract_id',
                [
                    req.body.localid,
                    jsonArray[0].IDENTIFICADOR_ADJUDICACION,
                    jsonArray[0].IDENTIFICADOR_CONTRATO,
                    jsonArray[0].TITULO_CONTRATO,
                    jsonArray[0].DESCRIPCION_CONTRATO,
                    'active',//jsonArray[0].ESTATUS,
                    jsonArray[0].PERIODO_CONTRATO_INICIO,
                    jsonArray[0].PERIODO_CONTRATO_FINAL,
                    Number(jsonArray[0].VALOR_CONTRATO),
                    jsonArray[0].FECHA_FIRMA_CONTRATO
                ]).then(function (data) {
                console.log('Award stage loaded: ', data);
                res.redirect('/main/'+ req.body.localid);
            }).catch(function (error) {
                console.log("ERROR: ", error);
                res.redirect('/main/'+ req.body.localid);
            });
        }

        require('fs').unlink(req.file.path);
    });
});

router.post('/uploadfile-fields', function (req,res) {
    res.render('modals/uploadfile-fields', { localid: req.body.localid, stage: req.body.stage });
});

module.exports = router;
