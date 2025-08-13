const user = require("../models/user.js");

module.exports.user=(req,res)=>{
   res.render("users/user.ejs")
}

module.exports.signup =async(req,res)=>{
 try {
    let {username,email,password}=req.body;
 const newUser = new user({username,email});
  let registeredUser = await user.register(newUser,password);
  req.login(registeredUser,(err)=>{
   if(err){
      return next(err)
   }
   req.flash("success","welcome to the wanderlust")
   res.redirect("/listing");
  });
 } catch (e) {
    req.flash("error",e.message)
    res.redirect("/signup");
}}

module.exports.login=(req,res)=>{
   res.render("users/login.ejs")
}

module.exports.loginPost = (req,res)=>{
    req.flash("success","welcome back to the wanderlust")
    let redirect = res.locals.rediretUrl || "/listing"
    res.redirect(redirect)
}

module.exports.logout=(req,res,next)=>{
 req.logout((err)=>{
   if (err){
      return next(err);
   }
   req.flash("sucess","you are logged out")
   res.redirect("/login")
 })
}