const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const artRoutes = require('./routes/artRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// create application
const app = express();

// configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://laya:laya123@cluster0.epfzwvt.mongodb.net/project3?retryWrites=true&w=majority&appName=Cluster0';
// 'mongodb://localhost:27017/project3'
app.set('view engine', 'ejs');

//connect to database
mongoose.connect(url, 
                {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    //start app
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

// mount middleware
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: url}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes 
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/artworks', artRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});


