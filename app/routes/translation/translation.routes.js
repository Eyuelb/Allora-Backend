const fs = require('fs');
const path = require('path');

const { authJwt, access } = require("../../middleware");
const { translation_controller } = require("../../controllers");
const TRANSLATION_DIR = path.join(__dirname, '../../config/translations/');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/translation', (req, res) => {

    const language = req.query.language

   // console.log(language)
    const filePath = `${TRANSLATION_DIR}${language}.json`;
    const infoFilepath = `${TRANSLATION_DIR}info.json`;

    let translation = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let languages = JSON.parse(fs.readFileSync(infoFilepath, 'utf8'));

    return res.status(200).send({translation,languages});

  });




  app.put('/api/translation/update', (req, res) => {
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
  });



  app.post('/api/translation/addLanguage', (req, res) => {
    const { language } = req.body;
    
    if (!language || language === ''){    
      return res.status(500).send('Invalid Request');
     }
    const filePath = `${TRANSLATION_DIR}${language}.json`;
    const mainFilepath = `${TRANSLATION_DIR}en.json`;
    const infoFilepath = `${TRANSLATION_DIR}info.json`;
    const state = JSON.parse(fs.readFileSync(mainFilepath, 'utf8'));

    // Check if the file already exists
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
  });


  app.post('/api/translation/addTranslation', (req, res) => {

    const { language, key, defaultValue,value } = req.body;
    if (!language || language === '' || !key || key === '' || !defaultValue || defaultValue === '' || !value || value === ''){    
      return res.status(500).send('Invalid Request');
     }
    const infoFilepath = `${TRANSLATION_DIR}info.json`;

    const info = JSON.parse(fs.readFileSync(infoFilepath, 'utf8'));
    info.languages.forEach((lang) => {
      console.log(lang)

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

  })
  app.delete('/api/translation/deleteTranslation', (req, res) => {

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

  })





  app.get("/api/translation/get/all", [authJwt.verifyToken], translation_controller.findAllTranslations);

  app.get("/api/translation/get", [authJwt.verifyToken], translation_controller.findOneTranslation);

  app.post("/api/translation/add", [authJwt.verifyToken, access.isAdmin], translation_controller.add);

  //app.put("/api/translation/update",[authJwt.verifyToken, access.isAdmin], translation_controller.updateOneTranslation);

  app.delete("/api/translation/delete", [authJwt.verifyToken, access.isAdmin], translation_controller.deleteOneTranslation);

  app.get("/api/translation/search", [authJwt.verifyToken], translation_controller.search);

};
