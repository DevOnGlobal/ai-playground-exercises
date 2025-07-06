const fs = require('fs');
const path = require('path');

function uploadMeterData(file: any, targetPath: string) {
    const finalPath = path.join('/tmp/', targetPath);
    fs.writeFileSync(finalPath, file.buffer);
}

function readMeterFile(filename: string) {
    const filePath = path.join(__dirname, '../../data', filename);
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
        return null;
    }
}

module.exports = { uploadMeterData, readMeterFile };
