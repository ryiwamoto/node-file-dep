var path = require('path');
var Project = require('../index.js').Project;

var jsonParser = function(filePath, fileContent){
  return JSON.parse(fileContent);
};

describe("DependencyTracker", function () {
  describe('#addFile', function(){
    it("call resolver correctly", function(){
      var parser = jasmine.createSpy().andCallFake(jsonParser)

      var basePath = '.';
      var proj = new Project(parser, {basePath: basePath});

      var filePath = 'a.js';
      var fileFullPath = path.resolve('.', 'a.js');
      var fileContent = '["b.js", "c.js"]';
      proj.addFile(filePath, fileContent);

      expect(parser).toHaveBeenCalledWith(fileFullPath, fileContent);
    });

    it("add dependency correctly", function(){
      var proj = new Project(jsonParser);
      var filePath = 'a.js';
      var fileFullPath = path.resolve('.', 'a.js');
      var fileContent = '["b.js", "c.js"]';
      proj.addFile(filePath, fileContent);

      var dependantsOfB = proj.getDependantsOf('b.js');
      expect(dependantsOfB).toEqual([fileFullPath]);

      var dependantsOfC = proj.getDependantsOf('c.js');
      expect(dependantsOfC).toEqual([fileFullPath]);
    });

    it("thorw error if the file has been already added", function(){
      var proj = new Project(jsonParser);
      var filePath = 'a.js';
      var fileContent = '["b.js", "c.js"]';
      proj.addFile(filePath, fileContent);

      expect(function(){
        proj.addFile(filePath, fileContent);
      }).toThrow();
    });
  });

  describe('#hasFile', function(){
    it('detect file existence correctly', function(){
      var proj = new Project(jsonParser);
      var filePath = 'a.js';
      var fileFullPath = path.resolve('.', 'a.js');
      proj.addFile(filePath, '[]');

      expect(proj.hasFile(fileFullPath)).toBe(true);
    });
  });

  describe('#removeFile', function() {
    it("remove dependency correctly", function(){
      var proj = new Project(jsonParser);
      var filePath = 'a.js';
      var fileContent = '["b.js", "c.js"]';
      proj.addFile(filePath, fileContent);
      proj.removeFile(filePath);

      var dependantsOfB = proj.getDependantsOf('b.js');
      expect(dependantsOfB).toEqual([]);

      var dependantsOfC = proj.getDependantsOf('c.js');
      expect(dependantsOfC).toEqual([]);
    });

    it("throw error if the file has already been removed", function(){
      var proj = new Project(jsonParser);
      var filePath = 'a.js';
      var fileContent = '["b.js", "c.js"]';
      proj.addFile(filePath, fileContent);
      proj.removeFile(filePath);

      expect(function(){
        proj.removeFile(filePath);
      }).toThrow();
    });
  });

  describe('#updateFile', function() {
    it("update dependency correctly", function(){
      var proj = new Project(jsonParser);

      var fileAPath = 'a.js';
      var fileAFullPath = path.resolve('.', 'a.js');
      var fileAContent = '[]';

      proj.addFile(fileAPath, fileAContent);

      var fileBPath = 'b.js';
      var fileBFullPath = path.resolve('.', 'b.js');
      var fileBContent = '["a.js"]';

      proj.addFile(fileBPath, fileBContent);

      proj.updateFile(fileAPath, '["b.js"]');

      var dependants = proj.getDependantsOf(fileAPath);
      expect(dependants).toEqual([fileBFullPath]);

      var dependants = proj.getDependantsOf(fileBPath);
      expect(dependants).toEqual([fileAFullPath]);
    });
  });
});
