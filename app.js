const express = require("express");
var app = express();
var bodyparser = require("body-parser");
var path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session)
const csurf = require("csurf")
const multer = require("multer")

const errorController = require('./controllers/errors');
// app.get("/",(req,res)=>{
//     res.send("express hello")
// })


/* bu kısım sequelize model kısmı //!bu kısım sequelize model kısmı
const Product = require("./models/product");
const Category = require("./models/category");
const User = require("./models/user");
const Cart = require("./models/cart");
const Cartitem = require("./models/cartitem");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");
*/


// app.use((req,res,next) => {
//   User.findByPk(1)
//   .then((user) => {
//     req.user = user;
//     next();
//   })
//   .catch((err) => {console.log(err)})
// }) 

// miidleware yaptık bunu admin.js deki user kısmında kullanıcağız

var ConnectionString = "mongodb://localhost/node-app"
var accountRouter = require("./routes/account");
var admin = require("./routes/admin");
var userroutes = require("./routes/shop");
var User = require('./models/user')

var store = new mongoDbStore({ 
  uri:ConnectionString,
  collection:"mySession"
})
// var errorControler = require("./controllers/errors");

// var mongoConnect = require("./utility/database").mongoConnect;

// const sequelize = require("./utility/database");

// var sequelize = require("sequelize");
// const { dirname } = require("path");
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"./public/img/")
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    //image-tarih bilgisi.jpg olacak burası yani her dosya ayrı isimde olacak amaç bu
  }
})

app.use(bodyparser.urlencoded({ extended: false })); 
app.use(multer({storage:storage}).single("image"))
app.use(express.static(path.join(__dirname, "public"))); 
app.use(cookieParser());
app.use(session({
      secret:"kayboard cat",
      resave:false,
      saveUninitialized:false,
      cookie:{
        maxAge:3600000
      },
      store:store 
}))
//! mongodb middleware 
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user=>{ 
    req.user = user; //! bu req.userı dışarda kullanıyoruz işte İMPORTANT
    next();
  }).catch(err => {console.error(err)})
})
app.use(csurf());

app.set("view engine", "pug");
app.set("views", "./views"); // "My Site"
// const Connection = require("./utility/database"); artık squelize kullanıyoruz
// console.log(__dirname)



app.use(admin);
app.use(userroutes); 
app.use(accountRouter); 
app.use("/500",errorController.get500page)
app.use("/404",errorController.get404page)
app.use((error,req,res,next) => {
  res.status(500).render("error/500",{title:"error"})
})

// Connection.execute("SELECT * FROM productss")
//      .then((result) => {
//         console.log(result[0]);
//      }).catch((err) => {
//         console.log(err);
//      })
// try {
//    sequelize.authenticate();
//    console.log('Connection has been established successfully.');
//  } catch (error) {
//    console.error('Unable to connect to the database:', error);
//  }



app.use(errorController.get404page);

//! --bu kısım sequelize kısmı  

//!bu kısım sequelize de tabloların ilişkisi
// Product.belongsTo(Category, {
//   foreignKey: { allowNull: false },
// });
// Category.hasMany(Product);

// Product.belongsTo(User)
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// Order.belongsToMany(Product,{through:OrderItem})
// Product.belongsToMany(Order,{through:OrderItem}) 

// Cart.belongsToMany(Product,{through:Cartitem}) 
// Product.belongsToMany(Cart,{through:Cartitem})
//!bu kısım sequelize de tabloların ilişkisi


// var _user;
// sequelize
//   .sync()
//   // .sync({force:true})
//   .then(() => {
//     User.findByPk(1)
//       .then((user) => {
//         if (!user) {
//          return User.create({ name: "mustafaçam", email: "naber@gmail.com" });
//         }
//         return user; 

//       }).then((user) => {
//         _user =user;
//         return user.getCart();
//       }).then(cart=>{
//         if(!cart){
//           return _user.createCart();
//         }
//         return cart;
//       }) 
//       .then(() => {
//         Category.count().then((count) => {
//           if (count == 0) {
//             Category.bulkCreate([
//               { name: "koltuk" },
//               { name: "sandalye" },
//               { name: "masa" },
//             ]);
//           }
//         });
//       });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//! sequelize kısmı;

//!mongodb
// mongoConnect(()=>{
//   User.findByusername("mustafacam")
//   .then(user => {
//     if(!user){
//       user = new User("mustafacam","mustafacam@gmail.com");
//       return user.save();
//     }
//     return user;
//   }).then((user)=>{
//   app.listen(3000);
//     // console.log(user)
//   })
//   .catch((err) => {console.log(err)});
// })

//! mongoose kısmı
mongoose.connect("mongodb://localhost/node-app")
  // User.findOne({name:"mustafacam"})
  .then(()=>{
    app.listen(3000);
  })
  .catch((err) => {console.log(err)});
