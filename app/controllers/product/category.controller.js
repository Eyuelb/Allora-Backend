const db = require("../../models");
const { category:Category} = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: categorys } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , categorys};
  };


exports.findAllCategorys = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    Category.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Categorys."
        });
      });

};

exports.findOneCategory = (req, res) => {
  const id = req.query.id

  Category.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving Category with id=" + id
      });
    });
};


exports.add = (req, res) => {
    Category.create(req.body).then(category => {
         
        if(!category){
            res.status(400).send({ message: "Error while saving categorys" });
        }

        if(category){
            res.status(200).send(category);
        }
        }).catch(err => {
          return res.status(500).send({ message: err.message });
        });
    
};

exports.updateOneCategory = (req, res) => {
    const id = req.query.id;

Category.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Category was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating Category with id=" + id
      });
    });
};


exports.deleteOneCategory = (req, res) => {
    const id = req.query.id;

Category.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Category was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Could not delete Category with id=" + id
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


Category.findAndCountAll({ 
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

