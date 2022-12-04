const db = require("../../models");
const { card:Card} = db;

const Op = db.Sequelize.Op;


const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: cards } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , cards};
  };


exports.findAllCards = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Card.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Cards."
        });
      });

};

exports.findOneCard = (req, res) => {
  const id = req.query.id

  Card.findByPk(id)
    .then(data => {
      if(data){
       return res.status(200).send(data);
      }
      if(!data){
        return res.status(500).send({message:"Error retrieving Card with id=" + id});
      }
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Card."
      });
    });

};


exports.add = (req, res, next) => {

  
  Card.create(req.body).then(card => {
         
    if(!card){
        res.status(400).send({ message: "Error while saving card" });
    }

    if(card){ 
        res.status(200).send({ message: card });
    }
    }).catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Card."
      });
    });
};

exports.updateOneCard = (req, res) => {
    const id = req.query.id;

Card.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Card was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Card with id=${id}. Maybe Card was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Card."
      });
    });
};


exports.deleteOneCard = (req, res) => {
    const id = req.query.id;

Card.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Card was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Card with id=${id}. Maybe Card was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Could not delete Card with id=" + id
      });
    });
};



exports.search = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
    var obj = {}
    
if(req.body.userId){
  Card.findAndCountAll({ 
    where:  {
      userId:req.body.userId}, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return res.status(200).send(response);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Card."
      });
    });
};


if(!req.body.userId){
  for(const key in condition) {

    obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
  }

  Card.findAndCountAll({ 
    where: obj , limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return res.status(200).send(response);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Card."
      });
    });
};


if(req.body.id){
  Card.findAndCountAll({ 
    where:  {
      id:req.body.id}, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return res.status(200).send(response);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Card."
      });
    });
};

if(!req.body.id){
  for(const key in condition) {

    obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
  }

  Card.findAndCountAll({ 
    where: obj , limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      return res.status(200).send(response);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Card."
      });
    });
};




}





