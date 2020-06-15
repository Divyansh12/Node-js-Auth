const router = require("express").Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { Sequelize, Model, DataTypes } = require('sequelize');
const {User,User_Login} = require('../sequelize');


router.get('/user/logins/show',authenticateToken,async(req,res)=>{
 
    const user = await User.findOne({where:{ id: req.user.id }});
    if (user){
        const user_logins=await User_Login.findAll({where:{ user_id: user.id ,token_deleted:false}});
        var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        req.connection.socket.remoteAddress
        var current=false
        const logins=[]
        user_logins.forEach(async(login) => {
            current=false
            if(req.user.token_id==login.token_id 
                // || login.ip_address==ip && login.device==req.headers["user-agent"] 
                ){
                current=true
            }
            var login=login.get({plain:true});
            login.current=current
            logins.push(login);          
        });        
        return res.status(200).send({"user_logins":logins})
    }
    return res.status(400).send("Bad Request")

});

router.get(`/user/logins/delete/:login_id`,authenticateToken,async(req,res)=>{
    console.log(req.params.login_id)    
    const user = await User.findOne({where:{ id: req.user.id }});
    if (user){
        const user_login=await User_Login.findOne({where:{ id: req.params.login_id}});
        var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        req.connection.socket.remoteAddress
        var current=false
        if(req.user.token_id==user_login.token_id 
            // user_login.ip_address==ip && user_login.device==req.headers["user-agent"]
            ){
            current=true
        }
        user_login.token_deleted=true;
        await user_login.save()
        // if(current==false){

        // }        
        return res.status(200).send({"deleted":true,"user_login":user_login})
    }
    return res.status(400).send("Bad Request")

});

router.get(`/user/logins/delete/all/not-current`,authenticateToken,async(req,res)=>{
    
    
    const user = await User.findOne({where:{ id: req.user.id }});
    if (user){
        const user_logins=await User_Login.findAll({where:{ user_id: user.id}});
        var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        req.connection.socket.remoteAddress
        var current=false
        const logins=[]
        user_logins.forEach(async(login) => {
            current=false
            if(req.user.token_id==login.token_id 
                // login.ip_address==ip && login.device==req.headers["user-agent"]
                ){
                current=true
            }
            if(current!=true){
                login.token_deleted=true;
                login.logged_out=true;
                login.save()
            }
            var login=login.get({plain:true});
            login.current=current
            logins.push(login);          
        });        
        // if(current==false){

        // }        
        return res.status(200).send({"deleted":true,"user_login":logins})
    }
    return res.status(400).send("Bad Request")

});

router.get('/user/logins/deletes/all',authenticateToken,async(req,res)=>{
    
    
    const user = await User.findOne({where:{ id: req.user.id }});
    if (user){
        const user_logins=await User_Login.findAll({where:{ user_id: user.id}});
        var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        req.connection.socket.remoteAddress
        var current=false
        const logins=[]
        user_logins.forEach(async(login) => {
            current=false
            if(req.user.token_id==login.token_id 
                // login.ip_address==ip && login.device==req.headers["user-agent"]
                ){
                current=true
            }
            login.token_deleted=true;
            login.logged_out=true;
            login.save()
            var login=login.get({plain:true});
            login.current=current
            logins.push(login);          
        });        
        // if(current==false){

        // }        
        return res.status(200).send({"deleted":true,"user_login":logins})
    }
    return res.status(400).send("Bad Request")

})



module.exports = router;
