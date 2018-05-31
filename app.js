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
var crypto = require('crypto');
var nodeMailer = require('nodemailer');
    var transporter = nodeMailer.createTransport({
       service:"Gmail",
        auth:{
            user:'toanpro7x@gmail.com',
            pass:'lncbhenspsdlgous'
        }
    });

    var Conten1 = {
        from: '"Toanpro"<toandq999@gmail.com>', // sender address
        to: 'toandq999@gmail.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world</b>' // html body
    };
    transporter.sendMail(Conten1, (error, info) => {
        if (error) {
            return console.log(error);
        }else{
            console.log('tin nhan da gui');
        }
    });

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

app.listen(config.get('server.port'), function () {
   console.log("server running on port", config.get('server.port'));
});

