const express= require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const app = express();

//Load models
require('./models/User');

//Passport config
require('./config/passport')(passport);

//Load keys
const keys = require('./config/keys');

//Load routes

const index = require('./routes/index');
const auth = require('./routes/auth');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose connect
mongoose.connect(keys.mongoURI).then(()=>{
    console.log('MongoDB connected')
}).catch(err=>console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(require('serve-static')(__dirname + '/public'));
app.use(cookieParser());

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));



app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.user = req.user || null;

    next();

});





//Use routes
app.use('/', index);
app.use('/auth', auth);




const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});