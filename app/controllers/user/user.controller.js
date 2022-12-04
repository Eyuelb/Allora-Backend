const db = require("../../models");
const config = require("../../config/auth.config");
const { verification } = require("../../middleware");
const { user: User} = db;

const Op = db.Sequelize.Op;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};


const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

  
    return { totalItems, totalPages, currentPage , users};
  };


exports.findAllUsers = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
  
    User.findAndCountAll({ limit, offset })
      .then(data => {
        const response = getPagingData(data, page, limit);
        return res.status(200).send(response);
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });

};

exports.findOneUser = (req, res) => {
  const id = req.query.id

  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

exports.updateOneUser = (req, res) => {
    const id = req.query.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};


exports.deleteOneUser = (req, res) => {
    const id = req.query.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "user was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: "Could not delete user with id=" + id
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


    User.findAndCountAll({ 
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

