//require express module
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

//set handlebars

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//set static files
app.use(express.static(__dirname + '/public'));

//set port
app.set('port', process.env.PORT || 3000);

//homepage route
app.get('/',function(req,res){
    res.render('login');
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