//require express module
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
//require body parser
let bodyParser = require('body-parser')
//require express validator
const expressValidator = require('express-validator');
//require express session
const session = require('express-session');
//require express messages
//require connect flash
const flash = require('connect-flash');

//require fetch module
const fetch = require('node-fetch');

//require express validator
const checkBody = require('express-validator/check')

//set handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main',
layoutsDir : "public/views/layouts"
}));
app.set('views', 'public/views')
app.set('view engine', 'handlebars');

//body parse application/json
app.use(express.urlencoded())
app.use(bodyParser.json())

//set static files
app.use(express.static(__dirname + '/public'));

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  //express messages middleware
  app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//set port
app.set('port', process.env.PORT || 3000);

//error
let error = false;

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
    let found = false;
    //check for error express-validator
    req.checkBody('username',"username field can not be empty").notEmpty();
    req.checkBody('password',"password field can not be empty").notEmpty();
    let errs = req.validationErrors();
    if(errs){
        req.flash("errorEmpty", "empty credentials");
        res.render('login',{errors:req.flash('errorEmpty')});
    }else{
    const username = req.body.username;
    const password = req.body.password;
    fetch('http://iml.npa-enterprise.com/AndroidPortalService/api/!/GetUserByUsername')
    .then((res) => res.json())
    .then((data) => {
        data.forEach(user => {
            if((username == user.szUserName) && (password == user.szPassword)){
                console.log(`username: ${username} password: ${password}`);
                found = true;
                error = false;
            }
        });
        if(found){
            res.redirect('/home');
        }else{
            //error = true;
            //res.redirect('/');
            req.flash("error", "wrong credentials");
            //res.send(req.flash('errors'));
            res.render('login',{errors:req.flash('error')});
        }
    });
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