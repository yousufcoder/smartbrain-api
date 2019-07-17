const Clarifai = require('clarifai');


const app = new Clarifai.App({
    apiKey: 'a5dfce18e3934d69ac47c0ac798e2600'
});

const handleApiCall=(req,res)=>{
        app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data=>{
            res.json(data);
        })
        .catch(error=>res.status(400).json('unable to work with api'))
}
const handleImage=(req,res,db)=>{
    //using user id to update the entries
    const {id}=req.body;
    // database.users.forEach(user=>{
    //     if(user.id===id){
    //         found= true;
    //        user.entries++
    //        return  res.json(user.entries)
    //     }
    // })
  db('users').where('id', '=',id)
  .increment('entries',1)
  .returning('entries')
  .then(entries=>{
      res.json(entries[0])
  })
    .catch(err=>res.status(400).json('unable to get the entries'))
}
module.exports={
    handleImage:handleImage,
    handleApiCall
};