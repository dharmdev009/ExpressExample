var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('expressExampleApp', ['persons']);


var app = express();

/*var logger = function(request, response, next) {
    console.log('Logging >>>');
    next();
}

app.use(logger);
*/

// View Engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//Global Variables
app.use(function (request, response, next) {
    response.locals.errors = null;
    next();
})

//Validation Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

var persons = [
    {
        name: 'dharm dev',
        person_id: 'E17/0850'
    },
    {
        name: 'B',
        person_id: 'E18/0850'
    },
    {
        name: 'C',
        person_id: 'E19/0850'
    }];


app.get('/', function (request, response) {
    // db.persons.find(function (error, docs) {
    //     console.log(docs);
    //     response.render('index', {
    //         title: 'Customers Title',
    //         persons: docs
    //     });
    // });
    response.render('index', {
        title: 'Customers Title',
        persons: persons
    });
});

app.post('/persons/add', function (request, response) {

    request.checkBody('person_id', 'Person id is required').notEmpty();
    request.checkBody('person_name', 'Person name is required').notEmpty();

    var errors = request.validationErrors();

    if (errors) {
        console.log(errors);
        response.render('index', {
            title: 'Customers Title',
            persons: persons,
            errors: errors
        });
    } else {
        let newUser = {
            'person_id': request.body.person_id,
            'first_name': request.body.person_name
        }
        console.log("newUser", newUser);
        // db.users.insert(newUser, function(err, response) {
        //     if(err) {
        //         console.log('error in insert data in db');
        //     }
        //     response.redirect('/');
        // });
    }
});

app.delete('/persons/delete/:person_id', function(request, response){
    console.log("person delete call", request.params.person_id);
    db.persons.remove({"_id": ObjectId(request.params.person_id)}, function (error, result) {
        if(error) {
            console.log("error while delete", error);
        } 
        response.redirect("/");
    });
});

app.listen("3000", function () {
    console.log('Server is started at port 3000');
})
