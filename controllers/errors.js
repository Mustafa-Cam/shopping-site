exports.get404page = (req,res)=>{
    res.status(404)
    .render("error/404" ,{title:"page not found"})
}

exports.get500page = (req,res)=>{
    res.status(500)
    .render("error/500" ,{title:"page not found error 500"})
}