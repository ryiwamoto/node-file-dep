var path = require('path');
var _ = require('lodash');
var DependencyGraph = require('simple-dependency-graph');


var Project = (function(){
  function Project(resolver, option){
    option = option || {};
    this.option = _.defaults(option, {
      basePath: '.'
    });
    this.resolver = resolver;
    this.files = [];
    this.graph = new DependencyGraph();
  }

  Project.prototype.addFile = function(filePath, fileContent){
    var _this = this;
    var fullPath = this._toFullPath(filePath);

    if(this.hasFile(fullPath)){
      throw new Error(fullPath + ' already exists in this tsProject.');
    }

    this.files.push(fullPath);
    var dependencies = this.resolver(fullPath, fileContent);
    dependencies.forEach(function(dep){
      _this.graph.addDependency(fullPath, _this._toFullPath(dep));
    });
  };

  Project.prototype.hasFile = function(filePath){
    return this.files.indexOf(this._toFullPath(filePath)) !== -1;
  };

  Project.prototype.removeFile = function(filePath){
    var fullPath = this._toFullPath(filePath);

    if(!this.hasFile(fullPath)){
      throw new Error(fullPath + ' does not exists in this tsProject.');
    }

    this.graph.removeNode(this._toFullPath(fullPath));
    var fileIndex = this.files.indexOf(fullPath);
    this.files.splice(fileIndex, fileIndex + 1);
  };

  Project.prototype.updateFile = function(filePath, fileContent){
    var _this = this;
    var fullPath = this._toFullPath(filePath);

    if(!this.hasFile(fullPath)){
      throw new Error(fullPath + ' does not exists in this tsProject.');
    }

    var oldDependencies = this.graph.getDependenciesOf(fullPath);
    oldDependencies.forEach(function(dependencyPath){
      _this.graph.removeDependency(fullPath, dependencyPath);
    });

    var newDependencies = this.resolver(fullPath, fileContent);
    newDependencies.forEach(function(dep){
      _this.graph.addDependency(fullPath, _this._toFullPath(dep));
    });
  };

  Project.prototype.getDependentsOf = function(filePath){
    return this.graph.getDependentsOf(this._toFullPath(filePath));
  };

  Project.prototype._toFullPath = function(filePath){
    return path.resolve(this.option.basePath, filePath);
  };

  return Project;
})();

module.exports = Project;
