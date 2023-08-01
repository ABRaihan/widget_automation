const Utility = {};

Utility.toFlatObject = (settings) => {
  try {
    return Object.keys(settings).reduce((acc, key) => {
      acc = { ...acc, ...settings[key] };
      return acc;
    }, {});
  } catch (err) {
    console.log(err);
  }
};

Utility.generateSetting = (settings, mode) => {
  try {
    const setting = Utility.toFlatObject(settings);

    return Object.keys(setting).reduce((acc, key) => {
      const tempSetting = {
        parseType: setting[key].parseType,
        value: setting[key].value,
        fallback: setting[key].fallback,
      };
      acc[key] = mode === "development" ? tempSetting : "soppiya" + key;
      return acc;
    }, {});
  } catch (err) {
    console.log(err);
  }
};

module.exports = Utility;
