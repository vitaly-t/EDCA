var bcrypt = require ('bcrypt-nodejs');

var hash = "";

//console.log(process.argv);

if ( typeof process.argv[2] != 'undefined'){
    hash = bcrypt.hashSync("bacon", bcrypt.genSaltSync(10), null)
    console.log (hash);
}else{

console.log("proporciona un argumento");
}
