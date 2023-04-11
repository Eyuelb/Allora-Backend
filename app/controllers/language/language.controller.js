const fs = require('fs');
const path = require('path');
const TRANSLATION_DIR = path.join(__dirname, '../../config/translations/');


exports.findAllLanguages = (req, res) => {


};

exports.findOneLanguage = (req, res) => {

};


exports.addLanguage = (req, res) => {
    const { language } = req.body;
    if (!language || language === ''){    
        return res.status(500).send('Invalid Request');
       }
       const filePath = `${TRANSLATION_DIR}${language}.json`;
       const mainFilepath = `${TRANSLATION_DIR}en.json`;
       const infoFilepath = `${TRANSLATION_DIR}info.json`;
       const state = JSON.parse(fs.readFileSync(mainFilepath, 'utf8'));

       fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          // File already exists
          return res.status(400).send('Translation file already exists');
        }
  
        // Create a new translations object for the new language
        const translations = 
          {
            language,
              translation: Object.entries(state.translation).reduce((acc, [key, val] = entry) => {
            //  console.log(acc)
              acc[key] = val;
              return acc;
            }, {}),
          };
        
  
        // Create the new file and save the translations object to it
        fs.writeFile(filePath, JSON.stringify(translations), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Failed to create translation file');
          }
  
          // Update the info.json file with the new language name
          const info = JSON.parse(fs.readFileSync(infoFilepath, 'utf8'));
          info.languages.push(language);
  
  
          fs.writeFile(infoFilepath, JSON.stringify(info), (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Failed to update info file');
            }
  
            // Send the translations object for the new language
            return res.status(200).send('Languade added succsfuly');
          });
        });
      });
};

exports.updateOneLanguage = (req, res) => {
  
};


exports.deleteOneLanguage = (req, res) => {
    
};


exports.search = (req, res) => {

};

