module.exports = {

    loginForm(req, res){

        try {

            return res.render("session/login")
            
        } catch (error) {
            console.log(error)
        }

    },

    login(req,res){

        try {

            req.session.userId = req.user.id

            return res.redirect("/users")
            
        } catch (error) {
            console.log(error)
        }

    },

    logout(req, res){

        try {

            req.session.destroy()
            return res.redirect("/")
            
        } catch (error) {
            console.log(error)
        }
    },

}