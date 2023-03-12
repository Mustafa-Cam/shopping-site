const Sequelize = require('sequelize')
const sequelize = require('../utility/database')

const  Cartitem = sequelize.define('cartitem',{
      id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
      },
      quantity:Sequelize.INTEGER
})

module.exports=Cartitem;