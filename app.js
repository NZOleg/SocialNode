const express= require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

//Load models
require('./models/User');
require('./models/Story');

//Passport config
require('./config/passport')(passport);

//Load keys
const keys = require('./config/keys');

//Handlebars helper
const {truncate, stripTags, formatDate, select, editIcon} = require('./helpers/hbs');

//Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose connect
mongoose.connect(keys.mongoURI).then(()=>{
    console.log('MongoDB connected')
}).catch(err=>console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main', helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select: select,
    editIcon: editIcon
    }}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('serve-static')(__dirname + '/public'));
app.use(cookieParser());

app.use(methodOverride('_method'));



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
app.use('/stories', stories);




const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});