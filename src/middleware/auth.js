const jwt = require('jsonwebtoken')
const Person = require("../database/person")

const auth = async(req, res, next)=>{
   try {
        const token = req.header('Authorization').replace("Bearer","").trim()
        const decoded = jwt.verify(token ,'signIn')
        const person = await Person.findOne({_id: decoded._id, 'tokens.token':token})
        if(!person){
         return  res.status(404).send({error:"Please Login First and then Try"})
        }
        req.token = token
        req.user = person
        
        next()
   } catch (error) {
       res.status(401).send({error:"Please authenticate Properly"})
   }

}


module.exports = auth