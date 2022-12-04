const db = require("../../models");
const { brand:Brand} = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: brands } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , brands};
  };


exports.findAllBrands = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Brand.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Brands."
        });
      });

};

exports.findOneBrand = (req, res) => {
  const id = req.query.id

  Brand.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving Brand with id=" + id
      });
    });
};


exports.add = (req, res) => {
    Brand.create(req.body).then(brand => {
         
        if(!brand){
            res.status(400).send({ message: "Error while saving brands" });
        }

        if(brand){
            res.status(200).send(brand);
        }
        }).catch(err => {
          return res.status(500).send({ message: err.message });
        });
    
};

exports.updateOneBrand = (req, res) => {
    const id = req.query.id;

Brand.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Brand was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Brand with id=${id}. Maybe Brand was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Brand with id=" + id
      });
    });
};


exports.deleteOneBrand = (req, res) => {
    const id = req.query.id;

Brand.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Brand was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Brand with id=${id}. Maybe Brand was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Could not delete Brand with id=" + id
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


Brand.findAndCountAll({ 
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

