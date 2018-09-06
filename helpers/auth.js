module.exports={

    ensureAuth:function(req,res,next){


        if(req.isAuthenticated()){

            return next();
        }
        req.flash('error_msg','Not Authenticated')
        res.redirect('/users/login')
    }
}