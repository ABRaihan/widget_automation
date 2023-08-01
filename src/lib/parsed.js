const sanitizeSetting = require("./sanitizeSetting");
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
   * This function find replaceable code from widget code.
   * Then return it for replace from code.
   * @param {string} key - setting key name
   * @returns {string}
   */
  #findReplaceString(key) {
    try {
      if (typeof key !== "string") throw new Error("findReplaceString key must be string");

      const keyLength = key.length;
      /* @__find string using setting key pair__@ */
      const firstIndex = this.#codes.indexOf(key + ":") + keyLength + 1;
      const lastIndex = this.#codes.lastIndexOf(key + '}') + keyLength + 1;

      return this.#codes.slice(firstIndex, lastIndex + 1);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @private
   * @param {*} key
   * @param {*} isLastIndex
   * @returns
   */
  #generateParserString(key, isLastIndex) {
    try {
      /* @__check arguments type__@ */

      if (typeof key !== "string" && typeof isLastIndex !== "boolean")
        throw new Error("makeParserString key & lastIndex argument must be string & boolean");

      let parser = "";
      /* @__parsed for number & boolean type__@ */
      ["number", "boolean"].includes(this.#settings[key].parseType) && (parser = "<# " + key + " #>");

      /* @__parsed for string type__@ */
      this.#settings[key].parseType === "string" && (parser = `"<# ${key} #>"`);

      parser += this.#generateDefaultValues(key);
      // parser += isLastIndex ? "}" : ",";

      return parser;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @private
   * @param {*} key
   * @returns
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

  codeTranspile() {
    try {
      this.#settings = Utility.generateSetting(this.#settings, "development");
      const settingKeys = Object.keys(this.#settings),
        keysLength = settingKeys.length - 1;

      settingKeys.forEach((key, index) => {
        // const replaceString = this.#findReplaceString(key);
        const replaceString = `"soppiya${key}"`;
        const parserString = this.#generateParserString(key, keysLength === index);
        this.#codes = this.#codes.replace(replaceString, parserString);
      });
      // this.#codes = this.#codes.replace(`type="module"`, "");
      return this.#codes;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Parsed;
