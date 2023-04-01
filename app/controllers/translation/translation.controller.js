const db = require("../../models");
const { translation: Translation } = db;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 30;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: Translation } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);


    return { totalItems, totalPages, currentPage, Translation };
};


exports.findAllTranslations = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    Translation.findAndCountAll({ limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            return res.status(200).send(response);
        })
        .catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Translations."
            });
        });

};

exports.findOneTranslation = (req, res) => {
    const id = req.query.id

    Translation.findByPk(id)
        .then(data => {
            return res.status(200).res.send(data);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error retrieving Translation with id=" + id
            });
        });
};


exports.add = (req, res) => {
    Translation.create(req.body).then(discount => {

        if (!discount) {
            return res.status(400).send({ message: "Error while saving Translation" });
        }

        if (discount) {
            return res.status(200).send(discount);
        }
    }).catch(err => {
        return res.status(500).send({ message: err.message });
    });

};

exports.updateOneTranslation = (req, res) => {
    const id = req.query.id;

    Translation.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Translation was updated successfully."
                });
            } else {
                return res.status(400).res.send({
                    message: `Cannot update Translation with id=${id}. Maybe Translation was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error updating Translation with id=" + id
            });
        });
};


exports.deleteOneTranslation = (req, res) => {
    const id = req.query.id;

    Translation.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).res.send({
                    message: "Translation was deleted successfully!"
                });
            } else {
                return res.status(400).res.send({
                    message: `Cannot delete Translation with id=${id}. Maybe Translation was not found!`
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Could not delete Translation with id=" + id
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


    Translation.findAndCountAll({
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

