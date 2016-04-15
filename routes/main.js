var express = require('express');
var router = express.Router();



var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:tester@localhost/camx");


/*
db.many("SELECT * from solicitudes limit 5;")
    .then(function (data) {
        console.log("DATA:", data);
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
*/



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main', { title: 'Contrataciones abiertas' });
});


router.get('/userdata', function(req, res, next) {

    db.many("select * from solicitudes limit 5;").then(
    function(data){res.send(data);});
});
module.exports = router;



