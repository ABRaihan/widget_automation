require("dotenv").config();
const entryFile = process.env.SOURCE_DIRECTORY;
const { execSync } = require('child_process');
const path = require("path")

const mode = process.env.APP_MODE;
const dev = `concurrently  "gulp build"  "parcel ${path.join(entryFile + "/index.html")} --open" "yarn watch"`;
const build = `gulp build && parcel build ${entryFile}/index.html --no-source-maps --dist-dir ${entryFile}/build && gulp`;

try {
  execSync(mode === "development" ? dev : build, { stdio: 'inherit' });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}