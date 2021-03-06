
const {validationResult} = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const db = require('../database/models')


const usersControler={
    register:(req,res)=>{
        res.render("users/register.ejs")
    },

    login:(req,res)=>{
        res.render("users/login.ejs")
		
		

    },
	
	loginProcess:(req,res)=>{
		 db.User.findOne({
			where:{
				email : req.body.email
			}
		}).then((userToLogin)=>{
			if (userToLogin){
				let isOkThePassword = bcrypt.compareSync(req.body.password, userToLogin.password)
				if (isOkThePassword){
					delete userToLogin.password;
					req.session.userLogged = userToLogin
					
					if(req.body.checkBox){
						res.cookie('userEmail', req.body.email, {maxAge:(1000 * 60) * 2})
					}
					return res.redirect('/profile')
				} 
			}
				 return res.render('users/login.ejs',{
					errors: {
						email:{
							msg:'Las credenciales son invalidas'
						}
					}				
				})
			
		})
		
		
	},
	
	
	processRegister:(req,res)=>{
        const resultValidation =validationResult(req)
		if(resultValidation.errors.length >0 ){
			return res.render('users/register',{
				errors: resultValidation.mapped(),
				oldData : req.body
			})
		}
        db.User.findOne({
			where:{
				email : req.body.email
			}
		}).then((UserInDb)=>{
			if(UserInDb){
				return res.render('users/register',{
					errors: {
						email:{
							msg:'Este email ya esta registrado'
						}
						
					},
					oldData :req.body
				})
			}
	

		})
       
	
		db.User.create({
			userName:req.body.userName,
			email:req.body.email,
			password: bcrypt.hashSync( req.body.password ,10),
			image: req.file.filename,
			birthDate: req.body.birthDate,
			isAdmin: false

		}).then((user)=>{
			return res.render('users/login.ejs')
			
		})

		 

    },
	
	profile:(req,res)=>{
		return res.render('users/profile.ejs',{
			user: req.session.userLogged	
			})
		},
	edituser:(req,res)=>{
		return res.render('users/edituser.ejs',{
			user: req.session.userLogged	
			})
	},
	update:(req,res)=>{
		const resultValidation =validationResult(req)
		if(resultValidation.errors.length >0 ){
			return res.render('users/edituser.ejs',{
				errors: resultValidation.mapped(),
				oldData : req.body
			})
		}
        db.User.update({
			userName:req.body.userName,
			email:req.body.email,
			image: req.file.filename,
          }, {
            where: { id: req.session.userLogged.id },
          })
          .then(function (result) {
			db.User.findOne({
				where:{
					email : req.body.email
				}
			}).then((userToLogin)=>{
				req.session.userLogged = userToLogin
				res.redirect("/profile")
			})
          })
	},
	logout:(req,res)=>{
		req.session.destroy()
		return res.redirect('/')
	}
}
module.exports= usersControler