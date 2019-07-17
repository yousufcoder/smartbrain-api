const handleProfileGet=(req,res,db)=>{
    //first grabing the parameter id do const id comes from req.params;
    const {id}=req.params;
    db.select('*').from('users').where({id})
    .then(user=>{
        //check agaist the empty array
        if(user.length){
            res.json(user[0]);
        }else{
            res.status(400).json('data not found')
        }
        
       })
       .catch(err=>res.status(400).json('error'))
   
}
module.exports={
    handleProfileGet:handleProfileGet
};