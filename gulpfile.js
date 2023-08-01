require("dotenv").config();
const basePath = process.env.SOURCE_DIRECTORY;
const mode = process.env.APP_MODE;
const gulp = require("gulp");
const fs = require("fs");
const Parsed = require("./src/lib/parsed");
const Transform = require("./src/lib/transform");
const sanitizeSetting = require("./src/lib/sanitizeSetting");
const Utility = require("./src/lib/utils");
const settings = require(basePath + "/config");
const watch = require("gulp-watch");

/**
 * This task is transpile code. It insert parser to the code.
 * Using parser can be added dynamic value in widget
 */

gulp.task("parsed-code", (done) => {
  const error = sanitizeSetting(settings);
  if (error.status) return;
  let widgetCode = fs.readFileSync(basePath + "/build/index.html", "utf8");
  const parsed = new Parsed(settings, widgetCode);
  fs.writeFileSync(basePath + "/build/index.html", parsed.codeTranspile());
  done();
});

/**
 * This task is create setting.json file.
 */
gulp.task("create-json", (done) => {
  const flatSetting = Utility.generateSetting(settings, "development");
  fs.writeFileSync(basePath + "/build/setting.json", Transform.toJSON(flatSetting));
  done();
});

gulp.task("create-editor-json", (done) => {
  fs.writeFileSync(basePath + "/build/settingEditor.json", Transform.editorJSON(settings));
  done();
});

gulp.task("create-flatSetting", (done) => {
  const error = sanitizeSetting(settings);
  if (error.status) return;
  const flatSetting = Utility.generateSetting(settings, mode);
  fs.writeFileSync(basePath + "/js/widgetSetting.js", `module.exports=${JSON.stringify(flatSetting)}`);
  done();
});

const watchConfig = (done) => {
  delete require.cache[require.resolve(basePath + "/config")];
  const settings = require(basePath + "/config");
  const error = sanitizeSetting(settings);
  if (error.status) return;
  const flatSetting = Utility.generateSetting(settings, "development");

  const settingContent = `module.exports=${JSON.stringify(flatSetting)}`;
  fs.writeFileSync(basePath + "/js/widgetSetting.js", settingContent);
  done();
};

gulp.task("process-config", watchConfig);
gulp.task("watch-config", () => {
  watch(basePath + "/config.js", gulp.series("process-config"));
});

gulp.task("dev", gulp.series("process-config", "watch-config"));
gulp.task("build", gulp.series("create-flatSetting"));
gulp.task("default", gulp.series("parsed-code", gulp.parallel("create-json", "create-editor-json")));
