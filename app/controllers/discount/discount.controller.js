const db = require("../../models");
const { discount:Discount} = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: discounts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , discounts};
  };


exports.findAllDiscounts = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Discount.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Discounts."
        });
      });

};

exports.findOneDiscount = (req, res) => {
  const id = req.query.id

  Discount.findByPk(id)
    .then(data => {
      return res.status(200).res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving Discount with id=" + id
      });
    });
};


exports.add = (req, res) => {
    Discount.create(req.body).then(discount => {
         
        if(!discount){
          return res.status(400).send({ message: "Error while saving discounts" });
        }

        if(discount){
          return res.status(200).send(discount);
        }
        }).catch(err => {
          return res.status(500).send({ message: err.message });
        });
    
};

exports.updateOneDiscount = (req, res) => {
    const id = req.query.id;

Discount.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        return res.status(200).send({
          message: "Discount was updated successfully."
        });
      } else {
        return res.status(400).res.send({
          message: `Cannot update Discount with id=${id}. Maybe Discount was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Discount with id=" + id
      });
    });
};


exports.deleteOneDiscount = (req, res) => {
    const id = req.query.id;

Discount.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        return res.status(200).res.send({
          message: "Discount was deleted successfully!"
        });
      } else {
        return res.status(400).res.send({
          message: `Cannot delete Discount with id=${id}. Maybe Discount was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Could not delete Discount with id=" + id
      });
    });
};


exports.search = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
var obj = {}
for(const key in condition) {

  obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
    //console.log(`${key}: ${condition[key]}`);
}


Discount.findAndCountAll({ 
      where: obj , limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
  };

