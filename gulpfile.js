require("dotenv").config();
const entryFile = process.env.SOURCE_DIRECTORY.replace("./src", ".."); ""
const mode = process.env.APP_MODE;
const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const Parsed = require("./src/lib/parsed");
const Transform = require("./src/lib/transform");
const sanitizeSetting = require("./src/lib/sanitizeSetting");
const Utility = require("./src/lib/utils");
const settings = require(entryFile + "/config");
const watch = require("gulp-watch");
const Task = require("./src/lib/task");


/**
 * This task is transpile code. It insert parser to the code.
 * Using parser can be added dynamic value in widget
 */

// gulp.task("parsed-code", (done) => {
//   const error = sanitizeSetting(settings);
//   if (error.status) return;
//   let widgetCode = fs.readFileSync(entryFile + "/build/index.html", "utf8");
//   const parsed = new Parsed(settings, widgetCode);
//   fs.writeFileSync(entryFile + "/build/index.html", parsed.codeTranspile());
//   done();
// });
gulp.task("parsed-code", Task.parseCode);

/**
 * This task is create setting.json file.
 */
// gulp.task("create-json", (done) => {
//   const flatSetting = Utility.generateSetting(settings, "development");
//   fs.writeFileSync(entryFile + "/build/setting.json", Transform.toJSON(flatSetting));
//   done();
// });
gulp.task("create-json", Task.createJSON);

// gulp.task("create-editor-json", (done) => {
//   fs.writeFileSync(entryFile + "/build/settingEditor.json", Transform.editorJSON(settings));
//   done();
// });
gulp.task("create-editor-json", Task.createEditorJSON);

// gulp.task("create-flatSetting", (done) => {
//   const error = sanitizeSetting(settings);
//   if (error.status) return;
//   const flatSetting = Utility.generateSetting(settings, mode);
//   fs.writeFileSync(entryFile + "/js/widgetSetting.js", `module.exports=${JSON.stringify(flatSetting)}`);
//   done();
// });
gulp.task("create-flatSetting", Task.createFlatSetting);

// const watchConfig = (done) => {
//   delete require.cache[require.resolve(entryFile + "/config")];
//   const settings = require(entryFile + "/config");
//   const error = sanitizeSetting(settings);
//   if (error.status) return;
//   const flatSetting = Utility.generateSetting(settings, "development");

//   const settingContent = `module.exports=${JSON.stringify(flatSetting)}`;
//   fs.writeFileSync(entryFile + "/js/widgetSetting.js", settingContent);
//   done();
// };

gulp.task("process-config", Task.listenConfig);

gulp.task("watch-config", () => {
  watch(entryFile + "/config.js", gulp.series("process-config"));
});

// const renderHtml = async (done) => {
//   let render = await ejs.renderFile(boilerplate, { section: fs.readFileSync(widget, "utf-8") });
//   render = render.replace(
//     `import widgetSettings from "./js/widgetSetting";`,
//     `const widgetSettings = require("${entryFile}/js/widgetSetting")`
//   );
//   fs.writeFileSync("index.html", render);
//   done();
// };

gulp.task("process-render", Task.listenHTMLRender);
gulp.task("watch-render", () => {
  watch(entryFile + "/index.html", gulp.series("process-render"));
});

gulp.task("render", gulp.series("process-render"));
gulp.task("dev", gulp.series("process-config", "watch-render", "watch-config"));
gulp.task("build", gulp.series("create-flatSetting"));
gulp.task("default", gulp.series("parsed-code", gulp.parallel("create-json", "create-editor-json")));
