const fs = require('fs');
const path = require('path');

const { authJwt , access } = require("../../middleware");
const { translation_controller} = require("../../controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    ); 
    next();  
  });
  let translationFile = []
  if(fs.existsSync(path.join(__dirname, '../../config/translation/translation.json'))){
    translationFile = fs.readFileSync(path.join(__dirname, '../../config/translation/translation.json'));
 
    if(!!!fs.existsSync(path.join(__dirname, '../../config/translation/translationBackup.json'))){
        fs.writeFileSync(path.join(__dirname, '../../config/translation/translationBackup.json'), JSON.stringify(translationFile));
    } 
}
else if(fs.existsSync(path.join(__dirname, '../../config/translation/translationBackup.json'))){
  translationFile = fs.readFileSync(path.join(__dirname, '../../config/translation/translationBackup.json'));

    if(!!!fs.existsSync(path.join(__dirname, '../../config/translation/translation.json'))){
        fs.writeFileSync(path.join(__dirname, '../../config/translation/translation.json'), JSON.stringify(translationFile));
    }
}
else{ 
  
  fs.writeFileSync(path.join(__dirname, '../../config/translation/translation.json'), JSON.stringify(translationFile));
  fs.writeFileSync(path.join(__dirname, '../../config/translation/translationBackup.json'), JSON.stringify(translationFile));
}
  app.get('/api/translation', (req, res) => {
      

        const translations = JSON.parse(translationFile);
        res.json(translations);

  });
  app.put('/api/translation/update', (req, res) => {
      
    const translationsData = req.body;
    fs.writeFileSync(path.join(__dirname, '../../config/translation/translation.json'), JSON.stringify(translationsData.translations));
    fs.writeFileSync(path.join(__dirname, '../../config/translation/translationBackup.json'), JSON.stringify(translationsData.translations));
    const translations = JSON.parse(translationsData);
    res.json(translations);
  });


  app.post('/api/translation/addLanguage', (req, res) => {
    const { language } = req.body;
    const filePath = path.join(__dirname, `../../config/translations/${language}.json`);
    const mainFilepath = path.join(__dirname, '../../config/translations/en.json')
    const state = JSON.parse(fs.readFileSync(mainFilepath, 'utf8'));

    // Check if the file already exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (!err) {
        // File already exists
        return res.status(400).send('Translation file already exists');
      }
            // Create a new translations object for the new language

      const translations = [
        {
          language,
          translation: Object.fromEntries(
            Object.entries(state.translation).map(
              ([key, value]) => [key, '']
            )
          ),
        },
      ];
      // Create the new file and save the translations object to it
      fs.writeFile(filePath, JSON.stringify(translations), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to create translation file');
        }
        // Add the new language to the translations array and save it to localStorage
        return res.send('Language added successfully');
      });
    });
  });
  
  
  
  
  
  
  
  app.get("/api/translation/get/all",[authJwt.verifyToken], translation_controller.findAllTranslations);

  app.get("/api/translation/get",[authJwt.verifyToken], translation_controller.findOneTranslation);

  app.post("/api/translation/add",[authJwt.verifyToken, access.isAdmin], translation_controller.add);

  //app.put("/api/translation/update",[authJwt.verifyToken, access.isAdmin], translation_controller.updateOneTranslation);

  app.delete("/api/translation/delete",[authJwt.verifyToken, access.isAdmin], translation_controller.deleteOneTranslation);

  app.get("/api/translation/search",[authJwt.verifyToken], translation_controller.search);

};
