module.exports =(req,res,next) => {
    
    if(!req.session.isAuthenticated){
        return res.redirect("./login");
    }
    if(!req.user.isadmin){
        return res.redirect("/");
    }
    next()
}