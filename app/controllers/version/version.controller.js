const db = require("../../models");
const { tableVersion: TableVersion } = db





exports.getTableVersion = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    await TableVersion.findByPk(id)
    .then(data => {
      return data?res.status(200).send(data):res.status(404).json({ message: 'Version not found' });
    })
    .catch(err => {
      return res.status(500).send({
        message: "Error retrieving version with id=" + id
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving table version', error });
  }
};

exports.getAllTableVersion = async (req, res) => {
  try {

    await TableVersion.findAll().then(data => {
      return data?res.status(200).send(data):res.status(404).json({ message: 'Version not found' });
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Error retrieving table versions"
      });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error retrieving table version', error });
  }
};


  