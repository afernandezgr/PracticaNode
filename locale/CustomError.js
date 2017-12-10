'use strict';

const fs = require('fs');
const data = fs.readFileSync("./locale/translations.js");
const jsonData=JSON.parse(data);

exports.translateMessage= (message,lang) =>
 {   
        let translation;
        try{         
            if(lang!='en' && lang!='es' && lang==='')
            {
                lang='en' //si no se especifica lenguaje se tomará por defecto en inglés.
            }
            translation=jsonData.translations[message][lang];
        }
        catch(err){
            console.log("No translation exists");
        }
        
        return translation;       
 }


