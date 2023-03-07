const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const path = require('path');
const fs = require('fs');

let mainKey; 
  

 
if(fs.existsSync(path.join(__dirname, '../config/key/mainKey.txt'))){
    mainKey = fs.readFileSync(path.join(__dirname, '../config/key/mainKey.txt'));
 
    if(!!!fs.existsSync(path.join(__dirname, '../config/key/backupKey.txt'))){
        fs.writeFileSync(path.join(__dirname, '../config/key/backupKey.txt'), mainKey);
    } 
}
else if(fs.existsSync(path.join(__dirname, '../config/key/backupKey.txt'))){
    mainKey = fs.readFileSync(path.join(__dirname, '../config/key/backupKey.txt'));

    if(!!!fs.existsSync(path.join(__dirname, '../config/key/mainKey.txt'))){
        fs.writeFileSync(path.join(__dirname, '../config/key/mainKey.txt'), mainKey);
    }
}
else{ 
      // Generate new main key
  mainKey = crypto.randomBytes(32);
  fs.writeFileSync(path.join(__dirname, '../config/key/mainKey.txt'), mainKey);
  fs.writeFileSync(path.join(__dirname, '../config/key/backupKey.txt'), mainKey);
}



const encryptData = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, mainKey, iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return { iv: iv.toString('hex'), data: encrypted };
};

const decryptData = (data, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, mainKey, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
};

module.exports = {
    encryptData,
    decryptData,
};





