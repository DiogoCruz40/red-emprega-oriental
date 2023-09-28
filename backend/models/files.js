
const mongoose = require('mongoose');
 
const FilesSchema = mongoose.Schema({
    type: String,
    data: Buffer,
    fileName: String,
});
 
module.exports = mongoose.model('File', FilesSchema);