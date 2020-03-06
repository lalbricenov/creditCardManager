const express = require("express");
const path = require("path"); // This is useful for joining file paths
const morgan = require('morgan'); // This is a middleware(used for debbuging)
const mongoose = require('mongoose'); // This is useful for database manipulation


// CREATION OF APP AND CONECTION TO DATABASE ------------------------------------------------------
// the app that will create the http server
const app = express();

// connecting to db, it will create it if it does not exist
mongoose.connect(process.env.MONGODBATLASURL , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Db connected'))
    .catch(err=> console.log(err));
// ------------------------------------------------------------------------------------------------

// CONFIGURATION OF  STATIC FOLDER ----------------------------------------------------------
app.use('/static', express.static(__dirname + '/static'));

// LOCALs: helper functions to use in ejs templates
app.locals = require('./static/helpers/formatMoney');

// MIDDLEWARE ---------------------------------------------------------------------------------
//middleware: It can modify or show the request to any route
// morgan dev is a set of middlewares that log the request in the terminal during development.
app.use(morgan('dev'));

// This is another middleware to view
app.use(express.urlencoded({extended:false}));
// app.use(express.json()); // This is used when data has: content-type json 
//---------------------------------------------------------------------------------------------

// CONFIGURATION OF VIEWS FOLDER-----------------------------------------------------------------
// The views are the html files that will be displayed
// app.set('views', path.join(__dirname, "views"));// I will not use path until it is necessary
// console.log(path.join(__dirname, "views"));
app.set('views', __dirname + "/views");
// The engine will be used to construct these html files before sending them
app.set('view engine', 'ejs');
//-----------------------------------------------------------------------------------------------


// ROUTES -----------------------------------------------------------------------------------------
// importing routes from the file that is inside the routes folder
const indexRoutes = require('./routes/routes.js'); 
// this makes the app use the routes defined in the variable indexRoutes. It add the prefix / to the routes (in this case the prefix is empty)
// app.use('/testPrefix',indexRoutes);
app.use(indexRoutes);
// --------------------------------------------------------------------------------------------


//----------------------------LOCALS: helper functions -------------------------------------

// app.locals = require('./static/js/creditCard');




// SETTING PORT AND STARTING APP --------------------------------------------------------------
// This is the port that will be used for the server. process.env.PORT will be used if available, otherwise 3000 will be selected. 
app.set('port', process.env.PORT || 3000);

// This start the app, in the sense that from this point on the requests will be listened to.
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
});
// ---------------------------------------------------------------------------------------------



// ----------------------------------------------------------------------------------
// USE AXIOS FOR TESTING