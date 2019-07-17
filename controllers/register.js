
const handleRegister=(req,res,db,bcrypt)=>{
    const {email,name,password}=req.body;
    if(!email || !name || !password){
       return res.status(400).json('incorrect form submission')
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password,saltRounds);
    db.transaction(trx=>{
            trx.insert({
                hash:hash,
                email:email
            })
            .into('login')
            .returning('email')
            .then(loginEmail=>{
                return trx('users')
                .returning('*')
                .insert({
                email:loginEmail[0],
                name:name,
                joined:new Date()
            }).then(users=>{
                res.json(users[0]);
            })
        })
            .then(trx.commit)
            .catch(trx.rollback)

    })

    // database.users.push({
            
    //         id:'125',       
    //         name:name,
    //         email:email,
    //         entries:0,
    //         joined:new Date()
        
    // })
    
    .catch(err=>res.status(400).json('unable to register'))
    
}
module.exports={
    handleRegister:handleRegister
};