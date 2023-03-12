//!sequelize kısmı 
// const Sequelize = require('sequelize')

// const sequelize = require('../utility/database')

// const User = sequelize.define('user',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:true,
//         primaryKey:true
//     },
//     name:Sequelize.STRING,
//     email:Sequelize.STRING
// })
//!mongodb kısmı
// const getDb = require('../utility/database').getdb;
// const mongodb = require('mongodb')

//     class User{
//         constructor(name, email,cart,id){
//             this.name = name;
//             this.email = email;
//             this.cart = cart ? cart : {} ; 
//             this.cart.items = cart ? cart.items:[] ; 
//             this._id=id; 
//         }
        
//         save() {
//             const db = getDb();
//             return db.collection('users').insertOne(this)
//         }

//         getCart(){
//             const ids = this.cart.items.map(i=>{
//                 return i.productId;
//             });
//             const db = getDb();
//             return db.collection("products")
//             .find({_id:{$in:ids} })
//             .toArray()
//             .then(products=>{ 
//                 return products.map(p=>{
//                     return{
//                         ...p,
//                         quantity:this.cart.items.find(i=>{
//                            return i.productId.toString() == p._id.toString()
//                         }).quantity
//                     }
//                 })
//             })
//         }



//       addToCart(product){
//         const index = this.cart.items.findIndex(cp=>{ 
//         return cp.productId.toString() == product._id.toString()
//     }) 
    
//     console.log(product)
    
//         const updateCartItems = [...this.cart.items];// burda kullanıcının cartındaki bilgiler demek items içindeki bilgiler anlamına geliyor 
//         let itemQuantity = 1;
//         if(index >= 0){ 
//           itemQuantity = this.cart.items[index].quantity+1;
//           updateCartItems[index].quantity=itemQuantity;  
//         }
//         else{
//             updateCartItems.push({ 
//                 productId:new mongodb.ObjectId(product._id),
//                 quantity:itemQuantity
//             })
//         }
//         const db =getDb(); 
//         return db.collection("users").updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             {$set:{ 
//                 cart:{ 
//                     items:updateCartItems
//                 }
//             }}
//             )
//          }

//          deleteCartItem(productid){
//             const cartItems = this.cart.items.filter(items=>{ //cartItems bir dizi döndürüyor
//                 return items.productId.toString() !== productid.toString();
//             })

//             const db = getDb();
//             // console.log(this._id) burda ki id bizim user ımızın ıd si 
//             // console.log(productid) burdaki id ise bizim productımızın ıd si
//             return db.collection("users")
//             .updateOne(
//                 {_id:new mongodb.ObjectId(this._id)},
//                 {$set:{cart:{items:cartItems}}} //burda cartın items larını cart ıtems ile değiştir denmek istenmiş
//             )
//         }

//         addOrder() {
//         //get cart -create order object -save order -update card
//             const db = getDb();
//             return this.getCart()
//             .then(products=>{
//                 const order = {
//                     items:products.map(item=>{
//                         return{
//                             _id:item._id,
//                             name:item.name,
//                             price:item.price,
//                             image:item.image,
//                             userid:item.userid,
//                             quantity:item.quantity
//                         }
//                     }),
//                     user:{
//                         _id:new mongodb.ObjectId(this._id),
//                         name:this.name,
//                         email:this.email
//                     },
//                     date:new Date().toLocaleString()
//                 }
//                 return db.collection("orders").insertOne(order);
//             }).then(()=>{
//                 this.cart={items:[]};
//                 return db.collection("users").updateOne(
//                     {_id:new mongodb.ObjectId(this._id)},
//                     {$set:{cart:{items:[]}}}  
//                     )
//             })
//         }

//         getOrder() {
//             const db =getDb();
//           return  db.collection("orders").
//             find({"user._id":new mongodb.ObjectId(this._id)})
//             .toArray()

//         }
         

//         static findById(userid){
//             const db = getDb();
//             return db.collection('users').findOne({_id:new mongodb.ObjectId(userid)})
//             .then(user=>{
//                 return user;
//             }).catch(err => {console.error(err)})
//         }

//         static findByusername(username){
//             const db = getDb();
//             return db.collection('users').findOne({name:username})
//             .then(user=>{
//                 return user;
//             }).catch(err => {console.error(err)})
//         }


//     }

// module.exports = User;

//!mongoose kısmı

const mongoose = require('mongoose');
const Product = require('./product'); 
const {isEmail} = require('validator')
const userShema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate:[isEmail,"invalid email"] 
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    isadmin:{
        default:false,
        type:Boolean
    }, 
    // isadmin:false, burda false string olarak varsayılıyor o yüzden bu olmaz
    cart:
    {
        items:
        [
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ]
    }
})

userShema.methods.clearCart=function(){
    // this.cart={items:[]};
    this.cart.items=[];
    return this.save(); 
}

userShema.methods.addToCart = function(product){
         
        const index = this.cart.items.findIndex(cp=>{ 
        return cp.productId.toString() == product._id.toString()
    }) 
    
    console.log(product)
    
        const updateCartItems = [...this.cart.items];// burda kullanıcının cartındaki bilgiler demek items içindeki bilgiler anlamına geliyor 
        let itemQuantity = 1;
        if(index >= 0){ 
          itemQuantity = this.cart.items[index].quantity+1;
          updateCartItems[index].quantity=itemQuantity;  
        }
        else{
            updateCartItems.push({ 
                productId:product._id,
                quantity:itemQuantity
            })
        }
        this.cart = { 
            items:updateCartItems
        }
        return this.save();
        }

        userShema.methods.getCart=function(){
            const ids = this.cart.items.map(i=>{
                return i.productId;
            });

           return Product
            .find({_id:{$in:ids} })
            .then(products=>{ 
                return products.map(p=>{ 
                    return{
                        _id:p.id,
                        name:p.name,
                        price:p.price,
                        image:p.image,
                        brand:p.brand,
                        quantity:this.cart.items.find(i=>{
                            return i.productId.toString() == p._id.toString()
                        }).quantity
                    }
                })
            })
        }
userShema.methods.deleteCartItem = function(productid) {
    const cartItems = this.cart.items.filter(items=>{ //cartItems bir dizi döndürüyor
        return items.productId.toString() !== productid.toString();
    })
    console.log();
    this.cart.items = cartItems;
    return this.save(); 
}


module.exports = mongoose.model('User',userShema)