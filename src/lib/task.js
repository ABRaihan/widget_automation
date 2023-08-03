require("dotenv").config();
const entryFile = process.env.SOURCE_DIRECTORY;
("../widgets/home");
const mode = process.env.APP_MODE;
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const Parsed = require("./parsed");
const Transform = require("./transform");
const sanitizeSetting = require("./sanitizeSetting");
const Utility = require("./utils");
const settings = require(entryFile + "/config");

class Task {
  #entryFile;
  #settings;
  constructor(path, settings) {
    this.#entryFile = path;
    this.#settings = settings;
  }

  parseCode(done) {
    const error = sanitizeSetting(settings);
    if (error.status) return;
    let widgetCode = fs.readFileSync(entryFile + "/build/index.html", "utf8");
    const parsed = new Parsed(settings, widgetCode);
    fs.writeFileSync(entryFile + "/build/index.html", parsed.codeTranspile());
    done();
  }

  createJSON(done) {
    const flatSetting = Utility.generateSetting(settings, "development");
    fs.writeFileSync(entryFile + "/build/setting.json", Transform.toJSON(flatSetting));
    done();
  }

  createEditorJSON(done) {
    fs.writeFileSync(entryFile + "/build/settingEditor.json", Transform.editorJSON(settings));
    done();
  }

  createFlatSetting(done) {
    const error = sanitizeSetting(settings);
    if (error.status) return;
    const flatSetting = Utility.generateSetting(settings, mode);
    fs.writeFileSync(entryFile + "/js/widgetSetting.js", `module.exports=${JSON.stringify(flatSetting)}`);
    done();
  }

  listenConfig(done) {
    delete require.cache[require.resolve(entryFile + "/config")];
    const settings = require(entryFile + "/config");
    const error = sanitizeSetting(settings);
    if (error.status) return;
    const flatSetting = Utility.generateSetting(settings, "development");

    const settingContent = `module.exports=${JSON.stringify(flatSetting)}`;
    fs.writeFileSync(entryFile + "/js/widgetSetting.js", settingContent);
    done();
  }

  async listenHTMLRender(done) {
    const widget = path.join(__dirname + entryFile.replace(".", "") + "/index.html");
    const boilerplate = path.join(__dirname + "/boilerplate.html");
    let render = await ejs.renderFile(boilerplate, { section: fs.readFileSync(widget, "utf-8") });
    render = render.replace(
      `import widgetSettings from "./js/widgetSetting";`,
      `const widgetSettings = require("${entryFile}/js/widgetSetting")`
    );
    fs.writeFileSync("index.html", render);
    done();
  }
}

module.exports = Task;
