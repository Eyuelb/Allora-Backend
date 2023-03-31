const db = require("../../models");
const { tableVersion: TableVersion,productsTableVersion:ProductsTableVersion } = db





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

exports.getAllTableVersion = async () => {
  try {

   return await TableVersion.findAll()

  } catch (error) {
    return { message: 'Error retrieving table version', error }
  }
};


exports.getProductTableVersion = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    await ProductsTableVersion.findByPk(id)
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

exports.getProductAllTableVersion = async () => {
  try {

   return await ProductsTableVersion.findAll()

  } catch (error) {
    return { message: 'Error retrieving table version', error }
  }
}; 