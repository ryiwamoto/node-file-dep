# node-file-dep
node-file-dep tracks dependencies between files in project. 

## Usage

referenceAandB.ts
```ts
///<reference path ="./a.ts"/>
///<reference path ="./b.ts"/>
```

```js
var Project = require('file-dep');

var typescriptReferenceParser = function(filePath, fileContents){
  var referencePattern = /^\/\/\/\s*<reference\s+path\s*=\s*('|")(.+?)\1.*?\/>/mg;
  var result = [],
    matched;
  while((matched = referencePattern.exec(fileContents)) !== null){
    var fullPath = matched[2];
    result.push(fullPath);
  }
  return result;
};

var proj = new Project(parser);

var filePath = './referenceAandB.ts';
var fileContent = fs.readFileSync('referenceAandB.ts', {encoding: 'utf8'});
proj.addFile(filePath, fileContent);

var dependants = proj.getDependantsOf('c.js'); //return ['a.ts', 'b.ts']
```

## API
- addFile(filePath, fileContent)
- removeFile(filePath, fileContent)
- updateFile(filePath, fileContent)
- hasFile(filePath)
- getDependantsOf(filePath)
