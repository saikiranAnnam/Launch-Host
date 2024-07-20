const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function init() {
  console.log("Executing script.js");

  const outDirPath = path.join(__dirname, "output");

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout.on("data", function (data) {
    console.log(data.toString());
  });

  p.stdout.on("error", function (data) {
    console.log("Error", data.toString());
  });

  p.on("close", function () {
    console.log("Build Complete");

    // getting the dist folder path
    const disFolderPath = path.join(__dirname, "output", "dist");

    // getting all the files under the dist folder(i.e index.html, style.css)
    const distFolderContents = fs.readdirSync(disFolderPath, {
      recursive: True,
    });

    // getting the files under folder (i.e assets/script.js)
    for (const filePath of distFolderContents) {
      if (fs.lstatSync(filePath).isDirectory()) continue;

      // upload file in the S3 - storage
      

    }
  });
}
