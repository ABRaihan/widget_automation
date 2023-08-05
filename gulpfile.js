require("dotenv").config();
const entryFile = process.env.SOURCE_DIRECTORY;
const mode = process.env.APP_MODE;
const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const Parsed = require("./src/lib/parsed");
const Transform = require("./src/lib/transform");
const sanitizeSetting = require("./src/lib/sanitizeSetting");
const Utility = require("./src/lib/utils");
let settings;
const watch = require("gulp-watch");

/**
 * This task is transpile code. It insert parser to the code.
 * Using parser can be added dynamic value in widget
 */

gulp.task("create-widget-folder", (done) => {
  fs.mkdirSync(entryFile, { recursive: true });
  fs.mkdirSync(entryFile + "/js", { recursive: true });
  const htmlContent = `<section>
  <style>
    /* write you style here */
  </style>
  <div>
    <!-- write your html code here -->
    <h1>Build Your Awesome Widget</h1>
  </div>
  <script type="module">
    import Transform from "lib/transform";
    import widgetSettings from "./js/widgetSetting";

    function main() {
      const settings = Transform.toValue(widgetSettings);
    }
    main();
  </script>
</section>`;
  fs.writeFileSync(entryFile + "/index.html", htmlContent);
  fs.writeFileSync(entryFile + "/config.js", `module.exports = {}`);
  fs.writeFileSync(entryFile + "/README.md", ``);
  settings = require(entryFile + "/config");
  done();
});

gulp.task("parsed-code", (done) => {
  const error = sanitizeSetting(settings);
  if (error.status) return;
  let widgetCode = fs.readFileSync(entryFile + "/build/index.html", "utf8");
  const parsed = new Parsed(settings, widgetCode);
  fs.writeFileSync(entryFile + "/build/index.html", parsed.codeTranspile());
  done();
});
// gulp.task("parsed-code", task.parseCode);

/**
 * This task is create setting.json file.
 */
gulp.task("create-json", (done) => {
  const flatSetting = Utility.generateSetting(settings, "development");
  fs.writeFileSync(entryFile + "/build/setting.json", Transform.toJSON(flatSetting));
  done();
});
// gulp.task("create-json", task.createJSON);

gulp.task("create-editor-json", (done) => {
  fs.writeFileSync(entryFile + "/build/settingEditor.json", Transform.editorJSON(settings));
  done();
});
// gulp.task("create-editor-json", task.createEditorJSON);

gulp.task("create-flatSetting", (done) => {
  console.log(settings);
  const error = sanitizeSetting(settings);
  if (error.status) return;
  const flatSetting = Utility.generateSetting(settings, mode);
  fs.writeFileSync(
    entryFile + "/js/widgetSetting.js",
    `module.exports=${JSON.stringify(flatSetting)}`
  );
  done();
});
// gulp.task("create-flatSetting", task.createFlatSetting);

const watchConfig = (done) => {
  delete require.cache[require.resolve(entryFile + "/config")];
  const settings = require(entryFile + "/config");
  const error = sanitizeSetting(settings);
  if (error.status) return;
  const flatSetting = Utility.generateSetting(settings, "development");

  const settingContent = `module.exports=${JSON.stringify(flatSetting)}`;
  fs.writeFileSync(entryFile + "/js/widgetSetting.js", settingContent);
  done();
};

// gulp.task("process-config", task.listenConfig);
gulp.task("process-config", watchConfig);

gulp.task("watch-config", () => {
  watch(entryFile + "/config.js", gulp.series("process-config"));
});

const renderHtml = async (done) => {
  const widgetPath = path.join(__dirname, entryFile.replace(".", "") + "/index.html");
  const boilerplatePath = path.join(__dirname, "/boilerplate.html");
  let render = await ejs.renderFile(boilerplatePath, {
    section: fs.readFileSync(widgetPath, "utf-8"),
  });
  render = render.replace(
    `import widgetSettings from "./js/widgetSetting";`,
    `const widgetSettings = require("${entryFile}/js/widgetSetting")`
  );
  fs.writeFileSync("index.html", render);
  done();
};

// gulp.task("process-render", task.listenHTMLRender);
gulp.task("process-render", renderHtml);
gulp.task("watch-render", () => {
  watch(entryFile + "/index.html", gulp.series("process-render"));
});

// gulp.task("dev", gulp.series("create-widget-folder"));

gulp.task(
  "dev",
  gulp.series(
    "create-widget-folder",
    "create-flatSetting",
    "process-render",
    "process-config",
    "watch-render",
    "watch-config"
  )
);

gulp.task(
  "build",
  gulp.series(
    "create-flatSetting",
    "parsed-code",
    gulp.parallel("create-json", "create-editor-json")
  )
);
