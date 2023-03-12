const User = require("../models/user");
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const Login = require("../models/login");
const crypto = require("crypto")
// const sgMail = require('@sendgrid/mail')
// const nodemailer = require("nodemailer")
// sgMail.setApiKey("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")
// var transporter = nodemailer.createTransport({
//    service: 'sendgrid',
//    auth: {
//      user: 'mustafa.rc1905@gmail.com',
//      pass: 'e3fX4Aycb$E!RQLa'
//    }
//  });
 
//  var mailOptions = {
//    from: 'mustafa.rc1905@gmail.com',
//    to: 'vxjcmaxcaknnpgpxap@bbitq.com',
//    subject: 'Sending Email using Node.js',
//    text: 'That was easy!'
//  };
 
//  transporter.sendMail(mailOptions, function(error, info){
//    if (error) {
//      console.log(error);
//    } else {
//      console.log('Email sent: ' + info.response);
//    } 
//  });



 exports.getLogin = (req, res, next) => {
   var errorMessage = req.session.errorMessage
   delete req.session.errorMessage;
    res.render("account/login",{
        path:"/login",
        title:"Login",
        errorMessage:errorMessage
      //   isAuthenticated: req.session.isAuthenticated,
    })
 }

 exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

   const loginModel = new Login ({
      email:email,
      password:password
   })

   loginModel
   .validate()
   .then(() => {
      User.findOne({ email: email})
      .then((user) => { 
         if(!user){ 
            req.session.errorMessage = "bu mail adresi ile kayit bulunamamiştir" 
            req.session.save((err)=>{
               console.log(err)
               return res.redirect("/login")
            });
         }
   
         bcrypt.compare(password, user.password)
         .then(issuccsess=>{
            if(issuccsess){
               req.session.user=user; 
               req.session.isAuthenticated=true;  
               return req.session.save(function(err){
                  var url =req.session.redirectTo || "/"
                  delete req.session.redirectTo
                  return res.redirect(url)
               })
            }

               req.session.errorMessage = "hatalı parola ya da email" 
            req.session.save((err)=>{
               // console.log(err)
               return res.redirect("/login")
            });
         })
         .catch((err) => {
            console.log(err)
         })
      })
      .catch(err=>{
         console.log(err)
      })
   }).catch((err)=>{
      if(err.name=="ValidationError"){
         let message=""; 
          for(field in err.errors){
              message+=err.errors[field].message+"<br>" 
          }
          res.render("account/login",{
            path:"/login",
            title:"Login",
            errorMessage:message
          //   isAuthenticated: req.session.isAuthenticated,
        }) 
      }else{
         next(err);
      }
   }); 
    // res.redirect("/");
 }

 exports.getRegister = (req, res, next) => {
   var errorMessage = req.session.errorMessage
   delete req.session.errorMessage;
    res.render("account/register",{
        path:"/register",
        title:"Register",
        errorMessage:errorMessage
      //   isAuthenticated: req.session.isAuthenticated
        
    })
 }

 exports.postRegister = (req, res, next) => {
   const name = req.body.name
   const email = req.body.email
   const password = req.body.password 

   User.findOne({email:email})
      .then((user) => {
         if(user){
            req.session.errorMessage = "bu mail adresi ile kayıt olunmuştur" 
            req.session.save((err)=>{
               console.log(err)
               return res.redirect("/register")
         }) 
         }
         return bcrypt.hash(password,10);
           })
           .then(hashedPassword => {
            console.log(hashedPassword);
            const newuser = new User(
               {
               name:name,
               email:email,
               password:hashedPassword,
               cart:{items:[]} 
               }
               )
               return newuser.save();
         })
      .then(()=>{
         res.redirect("/login")

         async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            // let testAccount = await nodemailer.createTestAccount();
          
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: "orkaefendi@gmail.com", // generated ethereal user
                pass: "lvgfnavxoqjhcuaj", // generated ethereal password
              },
            });
          
            // send mail with defined transport object
            let info = await transporter.sendMail({
              from: email, // sender address
              to: "alparslan1071arsln@gmail.com", // list of receivers
              subject: "Hello ✔", // Subject line
              text: "selam dostum", // plain text body
              html: "<b> napiyon beya</b>", // html body
            });
          
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          }
          
          main().catch(console.error);
      }).catch((err) => {
         if(err.name=="ValidationError"){
            let message=""; 
             for(field in err.errors){
                 message+=err.errors[field].message+"<br>" 
             }
             res.render("account/register",{
               path:"/register",
               title:"Register",
               errorMessage:message
             //   isAuthenticated: req.session.isAuthenticated
               
           })
         }else{
            next(err);
         }
      })
}

 exports.getReset = (req, res, next) => {
   var errorMessage = req.session.errorMessage
   delete req.session.errorMessage; 

    res.render("account/reset",{
        path:"/reset-password", 
        title:"Reset", 
        errorMessage: errorMessage
    })
 }

 exports.postReset = (req, res, next) => {
   const email = req.body.email;
   crypto.randomBytes(32,(err, buffer) => { // tokenımıza random bi şeyler atıyoruz 
      if(err) {
         console.error(err)
         return res.redirect("/reset-password")
      }
      const token = buffer.toString("hex")
      // console.log(token)
      User.findOne({ email: email})
      .then((user) => { 
         if(!user){ 
            req.session.errorMessage = "bu mail adresi bulunamadi" 
            req.session.save((err)=>{
               console.log(err)
               return res.redirect("/reset-password")
            })
         }
         user.resetToken = token;
         user.resetTokenExpiration =Date.now() +3600000
         return user.save();
         }).then((result) => {
            res.redirect("/")
            async function main() {
               let transporter = nodemailer.createTransport({
                 host: "smtp.gmail.com",
                 port: 465,
                 secure: true, // true for 465, false for other ports
                 auth: {
                   user: "orkaefendi@gmail.com", // generated ethereal user
                   pass: "lvgfnavxoqjhcuaj", // generated ethereal password
                 },
               });
             
               let info = await transporter.sendMail({
                 from: "orkaefendi@gmail.com", // sender address
                 to: email, // list of receivers
                 subject: "Hello ✔", // Subject line
                 text: "selam dostum", // plain text body
                 html: `
                 "<p>parolanızı güncellemek için tıklayınız </p>"
                 <p>
                 <a href="http://localhost:3000/reset-password/${token}">reset-password</a>
                 </p>
      
                 `, // html body
               });
             
               console.log("Message sent: %s", info.messageId);
             
               console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
             }
             
             main().catch(err=>{next(err)});
         }) 
   })
 }


 exports.getNewPassword = (req, res, next) => { // burda veri tabanından bilgileri alıp nwe-password.pug sayfasına bilgileri aktardık
   var errorMessage = req.session.errorMessage
   delete req.session.errorMessage; 
   const token = req.params.token;
   User.findOne({
      resetToken:token,
      resetTokenExpiration:{
         $gt:Date.now()
      }
   }).then((user) => {
      res.render("account/new-password",{
      path:"/reset-password", 
      title:"Reset", 
      errorMessage: errorMessage,
      userId:user._id.toString(),
      passwordToken:token
  }) 
   }).catch((err)=>{
      next(err)
   }) 
}
exports.postNewPassword = (req,res,next)=>{
   const newPassword =req.body.password
   const userId = req.body.userId
   const  token= req.body.passwordToken 
   let _user
   User.findOne({
      resetToken:token,
      resetTokenExpiration:{
         $gt:Date.now()
      },
      _id:userId
   }).then((user)=>{
      _user=user;
      return bcrypt.hash(newPassword,10)
   }).then(hashedPassword=>{
      _user.password=hashedPassword;
      _user.resetToken=undefined;
      _user.resetTokenExpiration=undefined;
      return _user.save();
   }).then(()=>{
      res.redirect("/login")
   }).catch(err=>{next(err)})

}

 exports.getLogout = (req, res, next) => {
   req.session.destroy((err)=>{
      console.log(err)
      res.redirect("/"); 
   });
}
