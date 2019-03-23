var fs = require('fs');//File System
var moment = require('moment');
var today = new Date();
const date = moment(today).format('DD/MM/YYYY');
const createFile =  (user)=>{
     //JSON file creation
     var obj = {
        record: []
      };
      obj.record.push({ id: 1, date: date, description: "Back Pain with swelling ", prescription:"Nonsteroidal ", BP:"120/80", BS:"125",Comment:"Under observation for 2 days" },{ id: 2, date: date, description: "Pain in throat", prescription:"acetaminophen ", BP:"110/80", BS:"115",Comment:"rest for 3 days" });
      var json = JSON.stringify(obj);
      var fileName = __dirname + '/../public/record/' + user._id + '.json';
      return new Promise((resolve, reject) =>{
        fs.writeFile(fileName, json, (err) => {
          if(err){
            reject("Some error had occured");
          }else{
            resolve("File created sucessfully");
          }
        });
      });
}
const reEdit = (patient, data)=>{
  var fileName = __dirname + '/../public/record/' + patient + '.json';
  return new Promise((resolve, reject)=>{
    fs.writeFile(fileName, data, (err) => {
      if(err){
        reject("Some error had occured");
      }else{
        resolve("File created sucessfully");
      }
    });
  })
} 

module.exports = { createFile, reEdit };