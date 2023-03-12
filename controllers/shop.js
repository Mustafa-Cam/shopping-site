
var Product = require("../models/product")
const Category = require("../models/category")
const Order = require("../models/order")
// const { where } = require("underscore")
// const products = [
//     {name:"masa",price:"500",image:"product4.png"},
//     {name:"sandalye",price:"200",image:"product5.png"},
//     {name:"koltuk",price:"400",image:"product6.png"},
// ]

exports.getProducts=(req,res,next)=>{
    // console.log("middleware 1 çalisti");
    // res.send("mustafa")
    // next();
    
    // const products = Product.getAll(); product.js de artık database kullandığımız için products değişkenini kullanmıyoruz
    
    // const categories = Category.getAll();
    // Product.getAll()
    // .then(products =>{
    //     res.render("shop/products", 
    //     {
    //     title: "products",
    //     products:products[0],
    //     categories:categories,
    //     path: "/products"
    // }); 
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })

    Product.find()        //findAll() mongodb kısmı mongoose kısmı gelince bunu find() olarak değiştirdik 
        // {attributes: ["id","name","price","image"]}
        //! .find({price:{$lt:2400}}) fiyatı 2400 den daha küçük elemanları getir
        //! .or([{peice:{$eq:2000},name:"koltuk"}]) fiyatı 2000 e eşit ya da adı koltuk olan demek
    .then(products =>{
        return products
    }).then(products =>{

        Category.findAll().then(categories =>{
            res.render("shop/products", { 
                title: "products",
                products:products,
                categories:categories,
                path: "/",
                // isAuthenticated: req.session.isAuthenticated
            });   
        })
        })
        .catch(err =>{next(err)})  
    
    // .catch((err)=>{
    //     console.log(err)
    // })
    
    // res.render("shop/products", {
    //     title: "products",
    //     products:products,
    //     categories:categories, //burdaki getAll metodu category.js deki categories dizisini getiriyor
    //     path: "/products"
    // }); 
}

exports.getProduct=(req,res,next)=>{  
    
    Product.findById(req.params.productid)  //!burda findOne içindeki şarta uyan tek bir eleman getiriyor ama find hepsini getiriyor olay bu
    //.findById(req.params.productid) mongodb kısmı
        // {
        //     attributes: ["id","name","price","image","brand"],
        //     where: { id: req.params.productid }
        // }
     
    .then((products)=>{ 
        console.log(products)
        res.render("shop/product-detail",{ //burdaki shop klasörü altındaki product-detail .pug dosyası
            title:products.name, 
            // category:categories, 
            product:products, // bak 1. 0 console da da yapmıştık çok fazla bilgi geliyordu 1. bilgiler bizim database den gelen bilgilerdi 2. 0 da 1. ürünümüzü temsil ediyor
            path:"/products",
        // isAuthenticated: req.session.isAuthenticated
        })
    }).catch(err=>{next(err)})
    }

    // res.redirect("/")
exports.getProductsbycategory=(req,res,next)=>{
    // console.log("middleware 1 çalisti");
    // res.send("mustafa")
    // next();
    var model=[];
    // var categoriess;
    var categoryid=req.params.categoryid  
    Category.find()
    .then(categories=>{ // burdaki categories Category tablosundaki elemanlara denk geliyor
        model.categories= categories 
        // const category = categories.find(c=>c.id==categoryid)
        // return category.getProducts(); //burda getProducts metodu bizim getirdiğimiz categoriye bağlı product ları getirecek ayriyetten return burda bir tane daha then üretmemizi sağladı oraya gönderdi yani aşşağımdaki products :D 
      return Product.find({categoryId:categoryid})         
    }) 
    .then(products=>{ 
       res.render("shop/products", {
        title: "products",
        products:products, 
        scategoryid:categoryid,
        categories:model.categories, // burdaki getAll metodu category.js deki categories dizisini getiriyor
        path: "/products",
        // isAuthenticated: req.session.isAuthenticated

    })  
    }).catch(err=>{next(err)});
     
}


exports.getProductDetails = (req,res,next)=>{
    // console.log("middleware 1 çalisti");
    // res.send("mustafa")
    // next();
    // const products = Product.getAll(); bunlar getProducta olacak burda değil

    res.render("shop/details", {
        title: "details",
        // products:products, bunlar getProducta olacak burda değil
        path: "/details",
        // isAuthenticated: req.session.isAuthenticated

    }); 
}

exports.getCart=(req,res,next)=>{
    // console.log("middleware 1 çalisti");
    // res.send("mustafa")
    // next();

    req.user // bub req.user ın amacı user modelindeki metodlara ulaşmak 
    .populate("cart.items.productId")
    .execPopulate()
    // .then(cart =>{ 
        // return cart.getProducts()
        //!bunları yorum satırına almadan önce sequelize kullanıyorduk mongodb kısmına geçince bunlara gerek kalmadı

        .then(user =>{  
        res.render("shop/cart", {
        title: "cart",
        path: "/cart", 
        products:user.cart.items,
        // isAuthenticated: req.session.isAuthenticated
    });  
        })
    .catch(err =>{
        next(err)
    })   
}


exports.postDelete=(req,res,next)=>{

    const productid = req.body.productid;

    req.user 
    //! sequelize kısmı 
    // .getCart() //dostum burda getCart Cart Cart.js imiz ama yani userla bağlantılı cart bilgisini getiriyor
    // .then(cart =>{
    //     return cart.getProducts({where:{id:productid}})
    // }) 
    // .then(products =>{
    //     const product = products[0];
    //     return product.cartitem.destroy();
    // })

    .deleteCartItem(productid)
    .then(() =>{
        // console.log(productid);
        res.redirect("/cart")
    }) .catch(err =>{next(err)})

 
}

 
exports.postCart=(req,res,next)=>{
    //! bunları yorum satırına mogodb kısmında aldık çünkü artık cart modelimiz yok 
    //     var quantity = 1;
    //     var userCart;
    //     req.user 
    //     .getCart().then(cart =>{ 
        //         userCart=cart;
        //     return cart.getProducts({where:{id:productId}})
        //     })
        //     .then(products =>{ //bakın then içindeki eleman yani( products) yukardan gelen returnun değeri okey! tmm; 
        //         var product;
        
        //         if(products.length > 0){
            //             product = products[0];
            //         }
            //         if(product){ 
                //             quantity += product.cartitem.quantity;
                //             return product;
                //         }
                //         return Product.findByPk(productId);
                //     }).then(product =>{
//         userCart.addProduct(product,{
//             through:{ 
//                 quantity:quantity
//             }
//         }) 
//     }).then(()=>{ 
//         res.redirect("/cart")
//     })
//     .catch(err =>{
//         console.log(err)
//     })   

const productId =req.body.productId
Product.findById(productId)
.then(products =>{ 
    // console.log(products)
    return req.user.addToCart(products)
})
.then(()=>{
    res.redirect("/cart")
}).catch(err =>{next(err)})
}

exports.getOrders=(req,res,next)=>{
    
    // .getOrder() //{include:["products"]} bunu getOrders un içine koymuştık products ile ilişkilendirmek için 
    Order.find({"user.userId":req.user._id}) 
    .then((orders)=>{
        // console.log(orders) 
        res.render("shop/orders", {
        title: "orders",
        path: "/orders",
        orders:orders  ,
        // isAuthenticated: req.session.isAuthenticated

    }); 
    }).catch(err =>{next(err)})  
}

exports.postOrder=(req,res,next)=>{
    //!sequelize kısmı
    // let usercart;
    // req.user.getCart().then(cart=>{
    //     usercart=cart;
    //     return cart.getProducts()
    // })
    //     .then(products=>{ 
    //       return req.user.createOrder()
    //       .then(order=>{ 
    //           order.addProducts(products.map(product=>{
    //             product.orderitem = {       
    //                 quantity: product.cartitem.quantity, //! çokkkk önemliii şimdi burdaki cartitem varya bu bizim cartitem.js içinde define içine yazdığımız değer 
    //                 price:product.price
    //             } 
    //             return product;
    //           }))  
    //         })
    //         .catch(err=>{console.log(err)});
    //     }).then(()=>{
    //         usercart.setProducts(null)
    //     }).then(()=>{
    //         res.redirect("/orders")
    //     })
    //         .catch(err=>{console.log(err)});    

    req.user
    .populate("cart.items.productId") // bu populate in amacı bak kardeşim bu populate ın içindeki eleman ın alt elemanlarını da göster demek diğer türlü sadece id gösteriliyor
    .execPopulate()
    .then((user)=>{
        const order = new Order({ 
            user:{
                userId:req.user._id,
                name:req.user.name,
                email:req.user.email
            },
            items:user.cart.items.map(p=>{ 
                return{  
                    product:{
                        _id:p.productId._id,
                        name:p.productId.name,
                        price:p.productId.price,
                        image:p.productId.image,
                        // userId:p.productId.userId,
                    },   
                    quantity:p.quantity                
                }
            })
        })
        return order.save();

    }).then(()=>{ 
       return req.user.clearCart();   
    }).then(()=>{
        res.redirect("./orders")
    })
    .catch(err=>{
        next(err)
    })
    
}


exports.getIndex=(req,res,next)=>{
    // res.send("mustafa")
    // next();
    // const products = Product.getAll();
    Product.find()
        // {
        // attributes: ["id","name","price","image"] //select * from vardı şimdi * yerine sutunları seçebiliyoruz bu işe yarıyor yani sutun seçmede kullanıyoruz
        // }
    .then(products =>{

        Category.find()
        .then(categories =>{
        res.render("shop/index", {
        title: "Shopping",
        products:products,
        categories:categories, 
        path: "/",
        // isAuthenticated: req.session.isAuthenticated
    });  
        })
        .catch(err =>{next(err)})
        
    })
     .catch((err)=>{
        next(err)
    })  
}

// exports.getaddProducts= (req,res,next)=>{
//     // console.log("middleware 2 çalisti");
//     res.render("addProduct", 
//     {
//         title:"add a new product",
//         path:"/product"

// })
// }

// exports.postaddProducts = (req,res,next)=>{
//     // console.log("middleware 1 çalisti");
//     // res.send("mustafa")
//     // next();
//     // console.log(req.body) 
//     //  products.push({name:req.body.name,price:req.body.price,image:req.body.image});

//     const product = new Product(req.body.name,req.body.price,req.body.image)

//     product.saveProduct();
//     res.redirect("/") 
// }
