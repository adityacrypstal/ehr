var fs = require('fs');//File System
var createFile =  (user)=>{
     //JSON file creation
     var obj = {
        table: []
      };
      obj.table.push({ id: 1, text: "Info", time: "Timestamp" });
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

module.exports = {createFile};