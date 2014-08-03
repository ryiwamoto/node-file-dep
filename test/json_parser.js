var JSONParser = (function(){
  function JSONParser(){
  }

  JSONParser.prototype.parse = function(filePath, fileContent){
    return JSON.parse(fileContent);
  };

  return JSONParser;
})();

module.exports = JSONParser;