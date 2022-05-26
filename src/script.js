const inquirer = require("inquirer");
const {
  promises: { readdir, writeFile, readFile },
} = require("fs");
const path = require("path");

var configsPath = __dirname + "/configs";
var configFiles = {};

(async () => {
  const files = await readdir(configsPath);

  for (const i of files) {
    const techName = i.split(".")[1];
    configFiles[techName] = path.join(configsPath + "/" + i);
  }
  console.log(configFiles);

  const { tech } = await inquirer
    .prompt([
      {
        type: "list",
        name: "tech",
        message: "Which technology are you using?",
        choices: Object.keys(configFiles),
      },
    ])
    .catch((err) => {
      console.log(err);
    });

  const cwd = process.cwd();
  const configFile = await readFile(configFiles[tech]).catch((err) =>
    console.log(err)
  );

  await writeFile(cwd + "/tsconfig.json", configFile, "utf-8").catch((err) => {
    console.log(err);
    process.exit();
  });

  console.log("TS config file created!");
})();
