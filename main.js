const fs = require('fs');
const https = require('https');
const readline = require('readline');
const printer = require('fancy-printer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function textToSpeech(text, outputFile) {
  const encodedText = encodeURIComponent(text);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=tr-TR&client=tw-ob&q=${encodedText}`;

  const fileStream = fs.createWriteStream(outputFile);
  const request = https.get(url, (response) => {
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      printer.log('Metin başarıyla sese dönüştürüldü.');
    });
  });

  request.on('error', (error) => {
    printer.error('Metni sese dönüştürme sırasında bir hata oluştu:', error);
  });

  fileStream.on('error', (error) => {
    printer.error('Ses dosyası oluşturulurken bir hata oluştu:', error);
  });
}

(async () => {
  printer.log('Text To Speech by ayd1ndemirci');
  const text = await new Promise((resolve) => {
    rl.question('Metni giriniz: ', (answer) => {
      resolve(answer);
    });
  });

  textToSpeech(text, 'converted.mp3');
  rl.close();
})();