const folderTemplate = "templates";
const fs = require("fs");
const path = require("path");
const readTemplate = (templateFile) => {
    const templatePath = path.join(__dirname, folderTemplate, templateFile);
    return fs.readFileSync(templatePath).toString();
  };
module.exports= {
    readTemplate
};