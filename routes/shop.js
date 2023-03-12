const express = require("express")
var router = express.Router();

var path = require("path")
// var admin = require("./admin") artık kullanmıyoruz
var isAuthenticated=require("../middleware/authenticated")
var shopController = require("../controllers/shop")
var csrf = require("../middleware/csrf")
router.get("/",csrf,shopController.getIndex);

router.get("/products",csrf,shopController.getProducts);

router.get("/products/:productid",csrf,shopController.getProduct); //burda amaç /products/:productid get isteği geldiğinde getProduct fonksiyonunu çalıştır demek istenmiş :productid de demek istenen dinamik bir değeer değişir yani bu değer demek istenmiş ":" => bu dinamik değer demek

router.get("/categories/:categoryid",csrf,shopController.getProductsbycategory); //burda amaç /products/:productid get isteği geldiğinde getProduct fonksiyonunu çalıştır demek istenmiş :productid de demek istenen dinamik bir değeer değişir yani bu değer demek istenmiş ":" => bu dinamik değer demek

router.get("/details",isAuthenticated,csrf,shopController.getProductDetails);

router.get("/cart",isAuthenticated,csrf,shopController.getCart);

router.post("/cart",isAuthenticated,csrf,shopController.postCart); 

router.post("/delete-cartitem",csrf,isAuthenticated,shopController.postDelete); 

router.get("/orders",isAuthenticated,csrf,shopController.getOrders);

router.post("/create-order",isAuthenticated,csrf,shopController.postOrder);

module.exports= router;