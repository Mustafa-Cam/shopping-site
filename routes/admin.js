const express = require("express")
var router = express.Router();
const path = require("path");
var adminController = require("../controllers/admin") //hata çıkarsa addproductı productcontroller olarak değiştir user.js de öyle yaptık
var isadmin = require("../middleware/isadmin")
const csrf = require("../middleware/csrf")

router.get("/addproduct",csrf,isadmin,adminController.getaddProducts)
router.post("/addproduct",csrf,isadmin,adminController.postaddProducts)

router.get("/admin/products/:productid",csrf,isadmin,adminController.geteditProducts)
router.post("/edit-product",csrf,isadmin,adminController.posteditProducts)

router.get("/products",isadmin,csrf,adminController.getProducts) 
router.post("/delete-product",csrf,isadmin,adminController.postDeleteProduct);

router.get("/addcategories",csrf,isadmin,adminController.getaddcategories)
router.post("/addcategories",csrf,isadmin,adminController.postaddcategories)

router.get("/categories",csrf,isadmin,adminController.getcategories)
router.post("/delete-category",csrf,isadmin,adminController.deletecategories)

router.get("/admin/categories/:categoryid",csrf,isadmin,adminController.geteditcategories)
router.post("/edit-category",csrf,isadmin,adminController.posteditcategories)

module.exports = router; 
// module.exports.products= products;
