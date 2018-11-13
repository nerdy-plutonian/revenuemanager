//require express module
const express = require('express');
const app = express();

//set handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//set static folder
app.use(express.static(__dirname + '/public'));

//set port
let port = process.env.port || 3000;
app.set('port',port);

//homepage route
app.get('/',function(req,res){
    res.send('hello');
});

//listen on port
app.listen(port,function(){
    console.log(`App running on port: ${port}`)
});