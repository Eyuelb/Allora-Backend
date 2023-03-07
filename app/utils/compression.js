const Jimp = require('jimp');
const fs = require('fs');

// async function compressImage(inputPath, outputPath, quality) {
//   try {
//     const image = await Jimp.read(inputPath);

//     await image
//       .quality(quality)
//       .writeAsync(outputPath);
//     const i = Buffer;
//     await image.getBuffer('webp', (err,value) => {i = value})
//       console.log(`Compressed image ${i}`);

//     const buffer = await fs.promises.readFile(outputPath);

//     console.log(`Compressed image saved to ${outputPath}`);

//     return buffer;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

// async function compressImage(inputPath, outputPath, quality) {
//   try {
//     const image = await Jimp.read(inputPath)
//       .then((value) => {
//         return value
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//     const buffer =
//       await image.quality(60)
//         .write(outputPath)
//         .getBufferAsync(Jimp.MIME_JPEG)
//         .then((val) => { return val })
//         .catch((err) => {
//           console.error(err);
//         });
//     return buffer;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

const gm = require('gm');

async function compressImage(inputPath, outputPath, quality, callback) {
  try {
    gm(inputPath)
      .compress('JPEG')
      .quality(quality)
      .write(outputPath,(err,buffer) => { 
        console.log("writing done")
      })
      const buffer = fs.readFileSync(outputPath);
    //   console.log(buffer)

      return buffer
  } catch (err) {
    console.error(err);
  }
}

const compression = {
  compressImage: compressImage,
};

module.exports = compression;

