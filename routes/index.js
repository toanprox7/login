var express = require('express');
var Router = express.Router();
var user = require('../models/users');
var jwt = require('jsonwebtoken');
var nodeMailer = require('nodemailer');
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'secret');
var token2 = jwt.sign({ foo2: 'bar2' }, 'secret2',{expiresIn:'1h'});


var link,link2;
var transporter = nodeMailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:'toanpro7x@gmail.com',
        pass:'lncbhenspsdlgous'
    }
});
Router.get('/reset/:TK-:id',function (req,res) {

    res.render('chargepass');

});
Router.post('/reset/:TK-:id',function (req,res,next) {
    var TK = req.params.TK;
    var ID = req.params.id;
var Pass = req.body.pass,
    Pass2 = req.body.pass2;

if (Pass == Pass2){
    user.update({"password":Pass},{where:{id:ID}}).then(function (DL) {
        res.redirect('/');
        return
    })
}else {
    res.send('vui long xem lai pass');
}

});

Router.get('/forgot',function (req,res) {
    res.render('sendMail');
});

Router.post('/forgot',function (req,res,next) {
  if (req.body.email){

      user.findOne({where:{email:req.body.email}}).then(function (dulieu) {
              var iddulieu = dulieu.id;
              console.log('success');
              jwt.verify(token2,'secret2',function (err,decode) {
                  if (err){console.log(err);
                      return link2="http://localhost:3000/error";
                  }else{
                      return link2="http://localhost:3000/reset/"+token2+"-"+iddulieu;
                  }
              });

              var Conten1 = {
                  from:'"Hackers"<toanpro7x@gmail.com>',
                  to:req.body.email,
                  subject:'Hello',
                  text:'hello word',
                  html:'<a href='+link2+'>Rigister</a>'
              } ;


              transporter.sendMail(Conten1, function (error, info) {
                  if (error){
                      return console.log(error);
                  } else{
                      console.log('message was send');
                  }
              });
              res.send('ban vui long check lai mail');
      })

  }else{
      res.send('nhap gmail vao de ku');
  }
});

Router.get('/send',function (req,res) {

    res.writeHead(200,{"Content-Type":"text/html"});
    res.write('<p style="color:red">Vui long check email <a href="https://mail.google.com/mail/">truy cap gmail</a></p>   ');
    res.end();

});

Router.get('/error',function (req,res) {
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write('<p style="color:red">mã đã giới hạn vui lòng đăng ký mới <a href="/">Trang chu</a></p>   ');
    res.end();

});

Router.get('/verify/:TOKEN',function (req,res) {
        user.update({"status":"active"},{where:{"token":req.params.TOKEN}}).then(function (dat) {
            res.writeHead(200,{"Content-Type":"text/html"});
            res.write('<p style="green:red">Ban da dang ky thanh cong <a href="http://localhost:3000">trang chu</a></p>   ');
            res.end();
        })
});
Router.get('/',function (req,res) {
    if (req.session.user){
        res.redirect('/admin');
        return
    }
    res.render('login');

});
Router.post('/', function (req,res) {
   var userName = req.body.user,
       passWord = req.body.pass;

   user.findAndCountAll({where:{
       "username":userName,
        "password":passWord,
           "status":"active"
       }}).then(function (data) {
           console.log(data);
       if (data.count > 0) {
           req.session.user = userName;
           req.session.pass = passWord;
           if (req.session.user) {
               res.redirect('/admin');
               console.log('success');
               return
           } else {
               res.redirect('/');
               console.log('that bai');
               return
           }
       } else {
           res.render('login',{
               Loi:"tai khoan hoac mat khau khong chinh xac"
           });
       }



   });

});

Router.get('/admin', function (req,res) {
    if (!req.session.user){
        res.redirect('/');
   return
    }
   res.render('index',{
       uSer: req.session.user
   });
});

Router.get('/register',function (req,res) {
    if (req.session.user || req.session.pass){
        res.redirect('/admin');
        return
    }
else{
        res.render('register');
    }


});

Router.post('/register',function (req,res,next) {
    var username = req.body.user,
        password = req.body.pass,
        fullname = req.body.full,
        email = req.body.email;



    if (username && password && fullname && email){
        user.create({
            username:username,
            password:password,
            fullname:fullname,
            email:email,
            token:token,
            status:'unactive'
        }).then(function (err,dulieu) {
             if (err){
                 console.log(err);
             } else{
                 console.log('success');

             }
             next();
        }).then(
            function () {
                jwt.verify(token,'secret',function (err,decode) {
                    if (err){console.log(err);
                        return link="http://localhost:3000/error";
                    }else{
                        return link="http://localhost:3000/verify/"+token;
                    }
                });

               var Conten2 = {
                    from:'"Hackers"<toandq99@gmail.com>',
                    to:req.body.email,
                    subject:'Hello',
                    text:'hello word',
                    html:'<a href='+link+'>Rigister</a>'
                } ;


                transporter.sendMail(Conten2, function (error, info) {
                    if (error){
                        return console.log(error);
                    } else{
                        console.log('message was send');
                    }
                });
                res.redirect('/send');
            }
        )
    }else {
        res.send('ban chua dien day du thong tin, vui long thu lai');
    }

});

Router.get('/logout',function (req,res) {
    if (req.session.user){
        req.session.destroy(function (err) {
            if (err){console.log(err)}else{
                console.log('success');
                res.redirect('/');
                return
            }
        })
    }
});
module.exports = Router;
