//! mysql kısmı
// const Connection = require("../utility/database");

// module.exports = class Product{
//     constructor(name,price,image,brand,categoryid){
//         this.id = Math.floor(Math.random()*99999)+1;
//         this.name  = name
//         this.price  = price
//         this.image  = image
//         this.brand = brand; 
//         this.categoryid=categoryid;
//     }
    
//         saveProduct() 
//         {
//             return Connection.execute("insert into productss (name,price,image,brand,categoryid) values (?,?,?,?,?)",[this.name,this.price,this.image,this.brand,this.categoryid])     
//             // products.push(this);//burdaki this p1 in parametreleri
            
//         }

//         static getAll(){
//             // return products; products dizimiz yok artık db var artık
//             return Connection.execute("SELECT * FROM productss")
//         }
                                
//         static getById(id){
//             // const product = products.find(i=>i.id == id);
//             // return product; 
//             return Connection.execute("SELECT * FROM productss WHERE productss.id=?",[id]) 

//         }

//         static Update(product){
//             return Connection.execute("UPDATE productss SET productss.name=?,productss.price=?,productss.image=?,productss.brand=?,productss.categoryid=? where productss.id=?",[product.name,product.price,product.image,product.brand,product.categoryid,product.id])
//             // const index = products.findIndex(i=>i.id==product.id)
//             // products[index].name=product.name
//             // products[index].price=product.price
//             // products[index].image=product.image
//             // products[index].brand=product.brand
//             // products[index].categoryid=product.categoryid
//         }
//         static deletebyid(id){
//             // var index = products.findIndex(i=>i.id==id);
//             // products.splice(index,1);
//             return Connection.execute("delete from productss where productss.id=?",[id])
//         }
//         static getProductsbycategoryid(categoryid){
//             // return products.filter(i=>i.categoryid==categoryid)
//         }
// }
// // var products = Product.getAll()
// // var p1  = new Product("çekyat",3000,"product1.png","istikbal");
// // p1.saveProduct();



//! sequelize kısmı =>

/*const Sequelize = require('sequelize');
const sequelize = require('../utility/database');

const Product = sequelize.define('product',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{type:Sequelize.STRING,
    },
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false,
    },
    image:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    brand:{
        type:Sequelize.STRING,
        allowNull:false,
}
})
module.exports = Product;  */
//!sequelize kısmı finish;

//!Mongodb kısmı=>
// const getDb = require('../utility/database').getdb;
// const mongodb = require('mongodb')
// class Product{
//     constructor(name,price,brand,image,categories,id,userid){ 

//         this.name = name;
//         this.price = price;
//         this.brand = brand;
//         this.image = image; 
//         this.categories = (categories && !Array.isArray(categories)) ? Array.of(categories) : categories;
//         this._id = id ? new mongodb.ObjectId(id) : null 
//         this.userid = userid; 
//         }


//     save(){
//         let db = getDb();
//         if(this._id){
//             db=db.collection('products')
//         .updateOne({_id:this._id},{$set:this}) //burda set in yanındaki this bizim tüm elemanlarımızı söylüyor yani his.name,this.price ... şeklindede yazabilirdik ama direk this yazmak da aynı şey daha kısa $set ise neyi güncelliyeceksin demek 
//         } 
//         else{
//             db=db.collection('products')
//             .insertOne(this)
//         }

//         return db.then(result=>{
//             console.log(result)
//         }).catch(err=>{console.log(err)});   
//     }

//     static deletebyid(productid){
//         const db = getDb();
//         return db.collection('products')
//         .deleteOne({_id: new mongodb.ObjectId(productid)}) 
//         .then(()=>{
//             console.log('deleted')
//         }).catch(err=>{console.log(err)});
//     }

//     static findAll(){
//        return getDb().collection('products')
//         .find({}) 
//         .toArray()
//         .then(products => {
//             return products;
//         })
//         .catch(err=>{console.log(err)});
//     }

//     static findById(productid){
//              return getDb().collection('products')
//              .findOne({_id:new mongodb.ObjectId(productid)})   
//             //  .toArray()
//              .then(products => {
//                 return products;
//              }).catch(err=>{console.log(err)});
//     }

//     static findbycategoryid(categoryid){
//         return getDb().collection('products')
//              .find({categories:categoryid})    
//              .toArray()
//              .then(products => {
//                 return products;
//              }).catch(err=>{console.log(err)});
//     }
// }
// module.exports = Product;
//!mongodb kısmı finish;

//!mongoose kısmı
const mongoose = require('mongoose');

const productShema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:250,
        trim:true,
        // lowercase:true,
        uppercase:true,
    },
    price:{
        required:function(){
            return this.isactive;
        },
        min:0,
        max:100000,
        type:Number ,
        get:value=>Math.round(value),
        set:value=>Math.round(value)
    },
    brand:String,
    image:String,
    date:{
        type:Date,
        default:Date.now
    },
    tags:{
        type:Array,
        validate:{
        validator:function(value){
            return value&&value.length>0;
        },
        message:"ürün için en az bir etiket giriniz"
    }
    },
    isactive:Boolean,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    categoryId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    }]
})

 module.exports =  mongoose.model('Product',productShema); //! burda products adında model oluşturulacak vertabanında productShema seması oluşacak  ve ayriyetten Product yazdığımız yer dışarıya Product classı olarak açılıyor bu Product tan nesne üretiyoruz

