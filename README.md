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

proj.addFile('referenceAandB.ts', fs.readFileSync('referenceAandB.ts', {encoding: 'utf8'}));

var dependants = proj.getDependantsOf('c.js'); //return ['a.ts', 'b.ts']
```

## API
- addFile(filePath, fileContent)
- removeFile(filePath, fileContent)
- updateFile(filePath, fileContent)
- hasFile(filePath)
- getDependantsOf(filePath)
