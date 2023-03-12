// // var categories =[
// //     {id:1,name:"koltuk",description:"koltuk kategorisi"},
// //     {id:2,name:"masa",description:"masa kategorisi"},
// //     {id:3,name:"sandalye",description:"sandalye kategorisi"}
// // ] artık database kullanıyoruz 

// const Connection = require("../utility/database");


// module.exports = class Category{
//     constructor(name){
//         this.id = (categories.length +1).toString();
//         this.name=name;
//         // this.description = description;
//     }

//     savecategory(){
//      return   Connection.query("insert into categories(name) values(?) ",[this.name]) 
//     }

//     static getAll(){
//         return Connection.query("select * from categories");
//     }
//     static getbyid(id){
//         // var category = categories.find(i=>i.id==id)
//         // return category;
//         return Connection.query("select * from categories where id=?", id);

//     }
//     static update(category){
//         // var index = categories.findIndex(i=>i.id==category.id)
//         // categories[index].name = category.name
//         // categories[index].description = category.description
//         return Connection.query("update categories set name=?", category.name)
//     }
//     static deletebyid(id){
//         // var index = categories.findIndex(i=>i.id==id)
//         // categories.splice(index,1);
//         return Connection.query("delete from categories where id=?",id)
//     }
// }const Sequelize = require('sequelize');



// const Sequelize = require('sequelize');
// const sequelize = require('../utility/database')

// const Category = sequelize.define('category',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     }, 
//     name:Sequelize.STRING,
// //     description:{
// //         type:Sequelize.STRING,
// //         allowNull:false,
// // }
// })


//! mongodb kısmı
// const getDb = require('../utility/database').getdb;
// // const { Console } = require('console');
// const mongodb = require('mongodb')


// class Category{
//     constructor(name, description,id){ 
//         this.name = name, 
//         this.description = description,
//         this._id = id ? new mongodb.ObjectId(id):null;
//     }

//     save(){
//        let db = getDb();

//         if(this._id){
//             db = db.collection("category").updateOne({_id:this._id},{$set:this})
//         }else{
//             db = db.collection('category').insertOne(this)
//         }
//         return db
//        .then(result=>console.log(result))
//        .catch(err=>console.log(err)) 
//     }

//     static findAll(){
//         const db = getDb()
//          return db.collection('category')
//         .find({})
//         .toArray()
//         .then(categories=>{
//            return categories; 
//         }).catch(err=>console.log(err))
//     }

//     static findById(categoryid){ 
//         const db = getDb();
//         return db.collection("category") // category collectionuna işlem yapacağız
//         .findOne({_id:new mongodb.ObjectId(categoryid)}) //bir eleman seçmek için 
//         .then(category =>{ 
//             return category; 
//         }).catch(err=>{
//             console.log(err)
//         })
//     }

// }

// module.exports = Category;  
//!mongodb kısmı; 

const mongoose = require('mongoose')

const categoryShema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

 module.exports =  mongoose.model('Category',categoryShema);