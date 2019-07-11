const express    =  require('express');
const bodyParser =  require('body-parser');
const bcrypt     =  require('bcrypt');
const cors       =  require('cors');
const knex       =  require('knex');


const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'root',
      database : 'smartbrain'
    }
  });
  

const app =express();
// app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors());


    

app.get('/',(req,res)=>{
    res.send(database.users);
});
app.post('/signin',(req,res)=>{
 db.select('email','hash').from('login')
    .where('email', '=', req.body.email)
    .then(data=>{
     const isValid=bcrypt.compareSync(req.body.password, data[0].hash);
     if(isValid){
        return db.select('*').from('users')
         .where('email','=',req.body.email)
         .then(user=>{
             res.json(user[0])
         })
         .catch(err=>res.status(400).json(error))
     }else{
         res.status(400).json('wrong credit')
     }
 })
 .catch(err=>res.status(400).json('wrong credentials'))
});
app.post ('/register',(req,res)=>{
    const {email,name,password}=req.body;
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
    
});

app.get('/profile/:id',(req,res)=>{
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
   
})

app.put('/image',(req,res)=>{
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
});


 
 
app.listen(3001,()=>{
    console.log('app is running at port 3001')
})