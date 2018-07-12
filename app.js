var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var nunjucks = require('nunjucks');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var client = redis.createClient();
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var config = require('config');
var indexRouter = require(__dirname + '/routes/index');
var fs = require('fs');
var jwt = require('jsonwebtoken');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret:"toanpro",cookie: { maxAge: 600000 }, saveUninitialized:false, resave:true, store: new RedisStore({client:client, host:'localhost', port:6379
        ,ttl:7000000})}));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use('/', indexRouter);
nunjucks.configure('views',{
    autoescape:true,
    express:app
});

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.listen(process.env.PORT || 3000, function () {
   console.log("server running on port", process.env.PORT);
});

