//!----mysql kısmı
// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     database:"node-app",
//     password:"Mustafa58çam"
// });

// module.exports = connection.promise();  biz şimdi sequelize kullanıcağız o yüzden normal connection bağlantısını kullanmayacağız



// !----squelize kısmı

// const Sequelize = require("sequelize")

// const sequelize = new Sequelize("node-app","root","Mustafa58çam",{
//     dialect:"mysql", 
//     host: "localhost"
// });
// module.exports = sequelize; 



// !---- mongodb kısmı

const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect =(callback)=>{
    MongoClient.connect("mongodb://localhost/node-app")
    .then(client =>{ 
        _db = client.db();
        callback();
    })
    .catch(err =>{
        console.log("error")
        throw err;
    })
}

const getdb = ()=>{
if(_db){
    return _db;
}
throw "no database"
}
exports.mongoConnect = mongoConnect;
exports.getdb = getdb;