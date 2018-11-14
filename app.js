//require express module
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
//require body parser
let bodyParser = require('body-parser')

//require fetch module
const fetch = require('node-fetch');

//require express validator
const expressValidator = require('express-validator')

//set handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parse application/json
app.use(express.urlencoded())
app.use(bodyParser.json())

//set static files
app.use(express.static(__dirname + '/public'));

//set port
app.set('port', process.env.PORT || 3000);

//get login page route
app.get('/',function(req,res){
    res.render('login');
});

//get login page route
app.get('/home',function(req,res){
    res.render('home');
});

//post login route
app.post('/login',function(req,res){

    //check for empty strings
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();

    //get errors
    let errors = req.validationErrors();
    if(errors){
        res.render('/login',{
            errors:errors
        });
    }else{
    const username = req.body.username;
    const password = req.body.password;
    fetch('http://iml.npa-enterprise.com/AndroidPortalService/api/!/GetUserByUsername')
    .then((res) => res.json())
    .then((data) => {
        data.forEach(user => {
            if((username == user.szUserName) && (password == user.szPassword)){
                res.redirect('/home');
            }else{
                res.redirect('/login',{
                    errors:[
                        {
                            msg:"wrong credentials"
                        }
                    ]
                });
            }
        });
    });
    console.log(`username: ${username} password: ${password}`);
}
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
    });

    // 500 error handler (middleware)
    app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
    });

//listen on port
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
    });