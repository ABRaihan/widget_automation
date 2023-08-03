const Utility = require("./utils");

/**
 * This class is manage all task of code transpiler.
 * It's replace value and set parser for assign dynamic value.
 * @author soppiya
 * @version 1.0.0
 */
class Parsed {
  #settings;
  #codes;
  /**
   * This is the constructor of parsed class
   * @param {object} widgetSettings - Widget settings
   * @param {string} widgetCode - Widget code
   */
  constructor(widgetSettings, widgetCode = "") {
    this.#settings = widgetSettings;
    this.#codes = widgetCode;
  }

  /**
   * @private
   * This method helps to make parser.
   * It's make different parser depend of value type.
   * @param {string} key - setting property name
   * @returns {string} parser string like <# $ #>
   */
  #generateParserString(key) {
    try {
      /* @__check arguments type__@ */
      if (typeof key !== "string") throw new Error("makeParserString key argument must be string");

      let parser = "";
      /* @__parsed for number & boolean type__@ */
      ["number", "boolean"].includes(this.#settings[key].parseType) && (parser = "<# " + key + " #>");

      /* @__parsed for string type__@ */
      this.#settings[key].parseType === "string" && (parser = `"<# ${key} #>"`);

      /* @__make parser with fallback value */
      parser += this.#generateDefaultValues(key);

      return parser;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @private
   * This method helps to build fallback value.
   * When parser value will not provide then fallback will work.
   * @param {string} key - setting property name
   * @returns {string} fallback value expression like "|| #fff"
   */
  #generateDefaultValues(key) {
    try {
      if (typeof key !== "string") throw new Error("generateDefaultValues key must be string");
      let defaultValue = "";
      this.#settings[key].fallback.forEach((value) => {
        /* @__for primitive value__@ */
        if (value && !this.#settings[value]) {
          defaultValue += ` || '${value}'`;
        }

        /* @__widget reference value__@ */
        if (value && this.#settings[value]) {
          ["number", "boolean"].includes(this.#settings[value].parseType) && (defaultValue += ` || <# ${value} #>`);
          this.#settings[value].parseType === "string" && (defaultValue += ` || "<# ${value} #>"`);
        }
      });

      return defaultValue;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @public
   * This method transpile the source code.
   * @returns {string} transpiled code with parser
   */
  codeTranspile() {
    try {
      /* @__generate flat setting__@ */
      this.#settings = Utility.generateSetting(this.#settings, "development");

      const settingKeys = Object.keys(this.#settings),
        keysLength = settingKeys.length - 1;

      /* @__set parser for every setting property__@ */
      settingKeys.forEach((key, index) => {
        const replaceString = `"soppiya${key}"`;
        const parserString = this.#generateParserString(key, keysLength === index);
        this.#codes = this.#codes.replace(replaceString, parserString);
      });

      /* @__replace type module cause after build there is no esm__@ */
      this.#codes = this.#codes.replace(`type="module"`, "");
      return this.#codes;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Parsed;
