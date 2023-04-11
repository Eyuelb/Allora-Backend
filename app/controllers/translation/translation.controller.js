const fs = require('fs');
const path = require('path');


const TRANSLATION_DIR = path.join(__dirname, '../../config/translations/');



exports.allTranslations = (req, res) => {
    const language = req.query.language

  //  console.log(language)
    const filePath = `${TRANSLATION_DIR}${language}.json`;
    const infoFilepath = `${TRANSLATION_DIR}info.json`;

    let translation = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let languages = JSON.parse(fs.readFileSync(infoFilepath, 'utf8'));

    return res.status(200).send({translation,languages});
};

exports.findOneTranslation = (req, res) => {

};




exports.addTranslation = (req, res) =>{
    const { language, key, defaultValue,value } = req.body;
    if (!language || language === '' || !key || key === '' || !defaultValue || defaultValue === '' || !value || value === ''){    
      return res.status(500).send('Invalid Request');
     }
    const infoFilepath = `${TRANSLATION_DIR}info.json`;

    const info = JSON.parse(fs.readFileSync(infoFilepath, 'utf8'));
    info.languages.forEach((lang) => {
     // console.log(lang)

      const filePath = `${TRANSLATION_DIR}${lang}.json`;
      let t = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      fs.writeFile(filePath, JSON.stringify({
        ...t,
        translation: {
          ...t.translation,
          [key]: lang === language ? value : defaultValue,
        },
      }), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to create translation file');
        }
      })


    });

    return res.status(200).send("Update succsfuly");

}


exports.updateTranslation = (req, res) => {
    const { language, key, value } = req.body;
    if (!language || language === '' || !key || key === '' || !value || value === ''){    
      return res.status(500).send('Invalid Request');
     }
    const filePath = `${TRANSLATION_DIR}${language}.json`;

    fs.access(filePath, fs.constants.F_OK, (err) =>{
      if (!err) {
        // File already exists
        const state = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const translations = 
        {
          language,
            translation: Object.entries(state.translation).reduce((acc, [k, val] = entry) => {
          //  console.log(acc)
            (key === k)?acc[key] = value:acc[k] = val          
            return acc;
          }, {}),
        };
                  // Send the translations object for the new language

        fs.writeFile(filePath, JSON.stringify(translations), (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Failed to update info file');
          }

          return res.status(200).send('Languade update succsfuly');
        });

      }
      if (err){
        return res.status(400).send('Translation file cant be found');
      }


    })
};

exports.deleteTranslation = (req, res) => {
    const key = req.query.key

    if (!key || key === ''){    
      return res.status(500).send({message:'Invalid Request',key});
     }
    const infoFilepath = `${TRANSLATION_DIR}info.json`;

    const info = JSON.parse(fs.readFileSync(infoFilepath, 'utf8'));
    info.languages.forEach((lang) => {
      console.log(lang)

      const filePath = `${TRANSLATION_DIR}${lang}.json`;
      let state = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const translations = 
      {
          language:state.language,
          translation: Object.entries(state.translation).reduce((acc, [k, val] = entry) => {
        //  console.log(acc)
          
       if(key === k){

       }
       else{
        acc[k] = val;
       }
          return acc;
        

        }, {}),
      };

      fs.writeFile(filePath, JSON.stringify(translations), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to create translation file');
        }
      })


    });

    return res.status(200).send("Update succsfuly");
};


exports.search = (req, res) => {

};

