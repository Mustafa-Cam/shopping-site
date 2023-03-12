//!sequelize
// const Sequelize = require('sequelize')
// const sequelize = require('../utility/database')

// const  Order = sequelize.define('order',{
//       id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//       }
// })

// module.exports=Order;

//!mongoose

const mongoose = require('mongoose')
const { object } = require('underscore') //object şeklinde yazılırsa bu import geliyor
const orderSchema =  mongoose.Schema({
  user:{
  userId:{
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  name:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true
  }},
  items:[{
    product:{
      type:Object,
      required: true
    },
    quantity:{
      type:Number,
      required:true,
    }
  }],
  date:{type:Date,default:Date.now()}
})
module.exports = mongoose.model("Order",orderSchema)