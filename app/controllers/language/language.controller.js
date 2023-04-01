const db = require("../../models");
const { language: Language } = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: Language } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);


    return { totalItems, totalPages, currentPage, Language };
};


exports.findAllLanguages = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    Language.findAndCountAll({ limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Languages."
            });
        });

};

exports.findOneLanguage = (req, res) => {
    const id = req.query.id

    Language.findByPk(id)
        .then(data => {
            return res.status(200).res.send(data);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error retrieving Language with id=" + id
            });
        });
};


exports.add = (req, res) => {
    Language.create(req.body).then(discount => {

        if (!discount) {
            return res.status(400).send({ message: "Error while saving Language" });
        }

        if (discount) {
            return res.status(200).send(discount);
        }
    }).catch(err => {
        return res.status(500).send({ message: err.message });
    });

};

exports.updateOneLanguage = (req, res) => {
    const id = req.query.id;

    Language.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Language was updated successfully."
                });
            } else {
                return res.status(400).res.send({
                    message: `Cannot update Language with id=${id}. Maybe Language was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error updating Language with id=" + id
            });
        });
};


exports.deleteOneLanguage = (req, res) => {
    const id = req.query.id;

    Language.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).res.send({
                    message: "Language was deleted successfully!"
                });
            } else {
                return res.status(400).res.send({
                    message: `Cannot delete Language with id=${id}. Maybe Language was not found!`
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Could not delete Language with id=" + id
            });
        });
};


exports.search = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    var condition = req.body
    var obj = {}
    for (const key in condition) {

        obj[`${key}`] = { [Op.like]: `%${condition[key]}%` };
        //console.log(`${key}: ${condition[key]}`);
    }


    Language.findAndCountAll({
        where: obj, limit, offset
    })
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

