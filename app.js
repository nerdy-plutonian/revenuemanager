//require express module
const express = require('express');
const app = express();

//set handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//set static files
app.use(express.static(__dirname + '/public'));

//set port
app.set('port', process.env.PORT || 3000);

//homepage route
app.get('/',function(req,res){
    res.send('hello');
});

//listen on port
app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
    });