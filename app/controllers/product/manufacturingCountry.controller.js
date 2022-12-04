const db = require("../../models");
const { manufacturingCountry:ManufacturingCountry} = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: manufacturingCountrys } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , manufacturingCountrys};
  };


exports.findAllManufacturingCountrys = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    ManufacturingCountry.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving ManufacturingCountrys."
        });
      });

};

exports.findOneManufacturingCountry = (req, res) => {
  const id = req.query.id

  ManufacturingCountry.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving ManufacturingCountry with id=" + id
      });
    });
};


exports.add = (req, res) => {
    ManufacturingCountry.create(req.body).then(manufacturingCountry => {
         
        if(!manufacturingCountry){
            res.status(400).send({ message: "Error while saving manufacturingCountrys" });
        }

        if(manufacturingCountry){
            res.status(200).send(manufacturingCountry);
        }
        }).catch(err => {
          return res.status(500).send({ message: err.message });
        });
    
};

exports.updateOneManufacturingCountry = (req, res) => {
    const id = req.query.id;

ManufacturingCountry.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ManufacturingCountry was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update ManufacturingCountry with id=${id}. Maybe ManufacturingCountry was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating ManufacturingCountry with id=" + id
      });
    });
};


exports.deleteOneManufacturingCountry = (req, res) => {
    const id = req.query.id;

ManufacturingCountry.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ManufacturingCountry was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete ManufacturingCountry with id=${id}. Maybe ManufacturingCountry was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Could not delete ManufacturingCountry with id=" + id
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


ManufacturingCountry.findAndCountAll({ 
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

