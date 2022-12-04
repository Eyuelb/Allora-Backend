const db = require("../../models");
const { address:Address} = db;

const Op = db.Sequelize.Op;
const { validateID, 
  validateAddressInputs,
  validatePaymentInputs,
   } = require('../../validators/validatorUtils');


const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: addresss } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , addresss};
  };


exports.findAllAddresss = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Address.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Addresss."
        });
      });

};

exports.findOneAddress = (req, res) => {
  const id = req.query.id

  Address.findByPk(id)
    .then(data => {
      if(data){
       return res.status(200).send(data);
      }
      if(!data){
        return res.status(500).send({message:"Error retrieving Address with id=" + id});
      }
      
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Address."
      });
    });

};


exports.add = (req, res, next) => {

  
  Address.create(req.body).then(address => {
         
    if(!address){
        res.status(400).send({ message: "Error while saving address" });
    }

    if(address){ 
        res.status(200).send({ message: address });
    }
    }).catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Address."
      });
    });
};

exports.updateOneAddress = (req, res) => {
    const id = req.query.id;

Address.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Address was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Address with id=${id}. Maybe Address was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Address."
      });
    });
};


exports.deleteOneAddress = (req, res) => {
    const id = req.query.id;

Address.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Address was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Address with id=${id}. Maybe Address was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Could not delete Address with id=" + id
      });
    });
};



exports.search = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
    var obj = {}
    
if(req.body.userId){
  Address.findAndCountAll({ 
    where:  {
      userId:req.body.userId}, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return res.status(200).send(response);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Address."
      });
    });
};

if(!req.body.userId){
  for(const key in condition) {

    obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
  }

  Address.findAndCountAll({ 
    where: obj , limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return res.status(200).send(response);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Address."
      });
    });
};


}





