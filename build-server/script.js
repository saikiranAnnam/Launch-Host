const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

//iniatilze S3 client
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  },
});

const PROJECT_ID = process.env.PROJECT_ID;

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
      const command = new PutObjectCommand({
        Bucket: "launch-host",
        Key: `__outputs/${PROJECT_ID}/${filePath}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath), //evaluating the user content types dynamically with mime-types
      });
      
      await s3Client.send(command)
    }
    console.log('Done...')
  });
}
