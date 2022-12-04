try{

  if(req.body.username){

  }
  if(req.body.phonenumber){
    
  }
  if(req.body.email){
    
  }
}
catch(error){
  return res.status (401).send ({
    status: 'failure',
    message: error.message
})
}