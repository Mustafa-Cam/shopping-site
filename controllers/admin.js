
var Product = require("../models/product")
var Category = require("../models/category")
var mongoose = require("mongoose")
const fs = require("fs")

// const products = [
//     {name:"masa",price:"500",image:"product4.png"},
//     {name:"sandalye",price:"200",image:"product5.png"},
//     {name:"koltuk",price:"400",image:"product6.png"},
// ]


exports.getProducts=(req,res,next)=>{
    // console.log("middleware 1 çalisti");
    // res.send("mustafa")
    // next();
    // const products = Product.getAll();
    Product
    .find({userId:req.user._id})
    // .find() yukardaki şart çalışmazsa ne olur diye baktık
    .populate("userId","name-_id")
    .select("name price userId image brand")
    // .find({name:koltuk}) //! burda name i koltuk olanları getir dedik yani aslında veritabanı sorgulaması yaptık nosql bu demek zaten bide bunun mongoose u var işte böyle 
    // .limit(2)
    // .select({brand:0}) //!burda brand alanını getirmiyoruz diğerlerini getiriyoruz
    // .sort({price:1}) //! burda fiyata göre sıralama var -1 de yazılabailir
    .then(products =>{
        // console.log(products)
        // Category.findAll()
        // .then(categories =>{
            res.render("admin/products", 
        {
        title: "products",
        products:products,
        // categories:categories,
        path: "/products",
        action:req.query.action, // burda admin/products pug una action adında parametre gönderiyoruz req.query de url deki action bilgisini alıyor url ise  save butonuna basınca geliyor
        isAuthenticated: req.session.isAuthenticated

        }); 
        })
        .catch(err=>{next(err)})     
        
        // .catch((err)=>{
            // console.log(err)
        // })
    // res.render("admin/products", { 
    //     title: "Admin products",
    //     products:products,
    //     path: "/products",
    //     action:req.query.action // burda admin/products pug una action adında parametre gönderiyoruz req.query de url deki action bilgisini alıyor url ise  save butonuna basınca geliyor
    // }); 
    }

exports.postDeleteProduct=(req,res,next)=>{
    const id=req.body.id 
    
    Product.findOne({_id:id,userId:req.user._id})
    .then((product) => {
        if(!product){
            return next(new Error("silinmek istenen ürün bulunamadı"))
        }
        fs.unlink("public/img/" + product.image,err => {
            if(err){
                console.log(err)
            }
        })
        return Product.deleteOne({_id:id,userId:req.user._id})
        .then((result)=>{
        if(deletedCount === 0){
            return next(new Error("silinmek istenen ürün bulunamadı"))

        }
       
    console.log("silindi aslanim") 
        res.redirect("/products?action=delete")
    })
    .catch(err=>{
        next(err)
    })
    })

    // Product.deleteOne({_id:id,userId:req.user._id})
    
}

exports.getaddProducts = (req,res,next)=>{
    // console.log("middleware 2 çalisti");
//     Category.getAll().then((categories)=>{
        
//     })
//     .catch(err=>{console.log(err)});
// }
// Category.findAll()

res.render("admin/addProduct", //bu renderlar .pug dosyalarını temsil ediyor 
{
    // categories:categories,  
    title:"new product",
    path:"/product",
    isAuthenticated: req.session.isAuthenticated
})

// res.render("admin/addProduct", //bu renderlar .pug dosyalarını temsil ediyor 
//         {
//             // categories:categories[0],  
//             title:"new product",
//             path:"/product"
//     })
}

exports.getaddcategories=(req, res,next)=> {
    res.render("admin/addCategories",{
        title :"category",
        path:"/admin/addCategories",

    })
}

exports.postaddcategories=(req, res, next)=> {
    const name = req.body.name
    const description = req.body.description

    const category = new Category
    ({
        name:name,
        description:description
    })
        category.save().then(() => {
            res.redirect("/categories?action=create")
        }).catch(err => {next(err)});
}

exports.posteditcategories=(req, res, next)=> {
    const name = req.body.name
    const description = req.body.description
    const id = req.body.id;

        Category.updateOne({_id:id},{$set:{name:name,description:description}}).then(() => {
            res.redirect("/categories?action=edit")
        }).catch(err => {next(err)});
}

exports.deletecategories=(req, res, next)=> {
const id= req.body.id;
Category.deleteOne({_id:id}).then(() => {
    res.redirect("/categories?action=delete")
}).catch(err => {console.log(err)});
}

exports.getcategories=(req, res, next)=> {
    Category.find()
    .then(categories => {
        res.render("admin/categories",{
            title :"category",
            path:"/categories",
            categories:categories,
            action:req.query.action,

        })    
    })
    .catch((err)=>{next(err)})
}

exports.postaddProducts = (req,res,next)=>{
    //  const product = new Product(
    //      )   
       const name= req.body.name
       const price= req.body.price
//     const image = req.body.image  artık bunu kullanmıyoruz multer kullanıyoruz
        const image = req.file
        const brand =req.body.brand 
    if (!image) {
        return res.render('admin/addProduct', {
            title: 'New Product',
            path: '/admin/addProduct',
            errorMessage: 'Lütfen bir resim seçiniz',
            inputs: {
                name: name,
                price: price,
                brand:brand
            }
        });
    }
        // const categoryid = req.body.categoryid
        // const user = req.user;

        // user.getProducts // bu ikisi aynı işlemi yapıyor
        // Product.findAll({where:{userId:1}}) //bu ikisi aynı işlemi yapıyor

    //    Product.create({ // user.createProduct({ buraya bunuda yazabilirdik burda yapılan işlem db e ekleme
    //     name:name,
    //     price:price,
    //     image:image,
    //     brand:brand,
    //     categoryId:categoryid,
    //     userId:user.id
        const product = new Product( 
            //name, price, brand, image,null,req.user._id ---mongodb kısmı
            {
            name: name,
            price:price,
            image:image.filename,
            brand:brand,
            userId:req.user,
            isactive:false,
            tags:["akıllı telefon"]
            }
            ) 
        product.save().then(() =>{
        // console.log(product) 
        res.redirect("/products") 
       }).catch(err=>{
           if(err.name=="ValidationError"){
               let message=""; 
                for(field in err.errors){
                    message+=err.errors[field].message+"<br>" 
                }
                res.render("admin/addProduct", { 
                    title:"add products",
                    path:"/admin/addProduct",
                    errorMessage:message,
                    inputs:{
                        name:name,
                        price:price,
                        brand:brand
                    }
                }) 
            }
            else{
                // res.redirect("/500") burdaki yöntem klsik yöntemimiz url değişerek 
                next(err); //req ve res arasındaki süreçte err olursa middleware imiz çalışsın 
                //middleware kısmı
            }   
               
    });

    //    const categoryid =req.body.categoryid
        // product.saveProduct().then(()=>{

    //     res.redirect("/") 
    // })
    // .catch(err=>{
    //     console.log(err);
    // })
    // console.log("middleware 1 çalisti");
    // res.send("mustafa")
    // next();
    // console.log(req.body) 
    //  products.push({name:req.body.name,price:req.body.price,image:req.body.image});
}

exports.geteditProducts= (req,res,next)=>{
    // console.log("middleware 2 çalisti");
   //!sequelize kısmı
    // Product.findByPk(req.params.productid)
    // .then((products)=>{
    //     if(!products){
    //         return res.redirect("/")
    //     }
    //     Category.findAll()
    //     .then(categories=>{

    //         res.render("admin/editProduct", {
    //         title:"edit product",
    //         path:"/admin/products",
    //         product:products,
    //         categories:categories,
    // })
    //     })
    //     .catch((err)=>{console.log(err)})          
    // }) 
    // .catch((err)=>{
    //     console.log(err);
    // })      

    //!mongodb kısmı 
    
    Product.findOne({_id:req.params.productid,userId:req.user._id})
    // .populate("categoryId")
    .then(product=>{ 
        if(!product){
          return res.redirect("/");  
        }
        // Category.findAll().then(categories=>{

            // categories = categories.map(category=>{
            //     if(product[0].categories){
            //     product[0].categories.find(item=>{
            //         if(item==category._id){
            //             category.selected=true;
            //         }
            //     })}   //bize gelen categorieslerin array olması lazım çünkü find() metodu  araay için çalışıyor
            //     return category
            
            // }) 
            return product 
        })
        .then(product=>{
// console.log(product)
            Category.find() 
            .then(categories=>{ 
                // console.log(categories)
                categories = categories.map(category=>{ 
                    if(product.categoryId){
                        // console.log(product.categoryId)
                        product.categoryId.find(item=>{
                            if(item.toString()===category._id.toString()){
                                category.selected = true; 
                            }
                        })
                    }
                    return category 
                })
                // console.log(categories)
                res.render("admin/editProduct", { 
                    title:"edit products",
                    path:"/admin/products",
                    product:product, 
                    categories:categories,

                }) 
            })
        }) 
        .catch((err)=>{
            next(err);
        })     
}

exports.geteditcategories = (req, res,next)=>{ 
    Category.findById(req.params.categoryid)
    .then(category=>{ 
        console.log(category)
        res.render("admin/editCategory", {
            title:"edit category",
            path:"/admin/categories",
            category:category,   

        })      
    })
    .catch(err=>{next(err)});
}
// exports.posteditcategories=(req,res,next){

// }

exports.posteditProducts = (req,res,next)=>{
    // console.log("middleware 1 çalisti");
    // res.send("mustafa")
    // next();
    // console.log(req.body) 
    //  products.push({name:req.body.name,price:req.body.price,image:req.body.image});

    // const product = new Product(req.body.name,req.body.price,req.body.image)
    // product.saveProduct();

    // const product = new Product();

    const id=req.body.id;
    const name=req.body.name;
    const price=req.body.price;
    const image=req.file;
    const brand=req.body.brand;
    const ids=req.body.categoryids; 


    Product.findOne({_id:id,userId:req.user._id})
    .then((product) => {
        if(!product){
            return res.redirect("/")
        }
        product.name= name,
        product.price= price,
        product.brand= brand,
        product.categories= ids
        
        if(image)
        {  
            console.log(image)
        fs.unlink('public/img/' + product.image,err => {
            if(err){
                console.log(err)
            }
        })
        product.image = image.filename;
    }
     return product.save()
    }).then(() => {
        res.redirect("/products?action=edit") 
    }).catch((err) => next(err));

     

    //!mongoose  güncelleme bu şekilde oluyor yani klasik şekilde yukardaki gibide oluyor
    // Product.findById(id) 
    // .then((product) => {
    //     product.name = name;
    //     product.price = price;
    //     product.image = image;  
    //     product.brand = brand;
    //     return product.save()
    //     .then(()=> {
    //         res.redirect("/products?action=edit") 
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    // })

    //!mongodb
    // const product = new Product(name,price,brand,image,categories,id,req.user._id) 
    // product.save() 
    // //  .then((product) => {
    // //     product.name = name;
    // //     product.price = price;
    // //     product.image = image;
    // //     product.brand = brand;
    // //     product.categoryId=categoryid;
    // //     return product.save();
    // //     })
    //     .then(()=> {
    //     res.redirect("/products?action=edit") 
    //         // console.log(result);
    // })
    // .catch(err => {
    //     console.log(err)
    // })
}
