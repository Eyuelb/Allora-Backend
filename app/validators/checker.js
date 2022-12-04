const httpError = require('http-errors');
const {validateId,validateUserId,validateUsername,validateEmail} = require("./validator");
const userExists = async (db,id) => {
  
  //  validateId(id);
  return await db.findByPk(id)
  .then(data => {
          if(data){
            return data;
          }
        })

        
        
}
const idExists = async (db,id) => {
  
  //  validateId(id);
  return await db.findAndCountAll({ 
    where: {id:id}})
    .then(data => {
      if(data){
        return data;
      }
    })
}
const  userIdExists = async (db,userId) => {

  //  validateUserId(userId);
  return await db.findAndCountAll({ 
        where: {userId:userId}})
        .then(data => {
          if(data){
            return data;
          }
        })
}

const ifExists = async (db,obj) => {
  
  //  validateId(id);
const result = await db.findAndCountAll({ where: obj})
return (result.count)? result : result.message=httpError(400, "Some error occurred while retrieving this"+result);

}

const findById = async (db,id) => {
  
  //  validateId(id);
const result = await db.findByPk(id)

return result !== null? result: httpError(400, "Some error occurred while retrieving id="+id);

}


const  ifIdExistsFind = async (db,obj) => {

  //  validateUserId(userId);
  return await db.findAndCountAll({ 
        where: obj})
        .then(data => {
          if(data){
            return data;
          }
        })
}

const add = async (db,obj) => {
  
  //  validateId(id);
const result = await db.create(obj)
return (result)? result: httpError(400, "Some error occurred while retrieving this"+result);
}


const deletebyid = async (db,obj) => {
  
  db.destroy({
  where: obj
})
  .then(num => {
    if (num == 1) {
      return httpError(200, "cart error if fixed refresh");
    } else {
      
    }
  })
};

// exporting all the functions
module.exports = {
    ifExists,
    idExists,
    userIdExists,
    userExists,
    findById,
    ifIdExistsFind,
    add,
    deletebyid
}