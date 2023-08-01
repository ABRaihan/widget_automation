function sanitizeSetting(settings) {
  try {
    if (settings === undefined) throw new Error("Please provide widget settings");
    if (typeof settings !== "object" || Array.isArray(settings)) throw new Error("Widget settings must be object");

    let widgetSettings = {};

    Object.keys(settings).forEach((rootKey) => {
      if (typeof settings[rootKey] !== "object" || Array.isArray(settings[rootKey]))
        throw new Error(rootKey + " section setting must be in object type");

      Object.keys(settings[rootKey]).forEach((key) => (widgetSettings[key] = settings[rootKey][key]));
    });

    Object.keys(widgetSettings).forEach((key) => {
      const error = existSettingKey(widgetSettings[key], key);
      if (error.status) throw new Error(error.msg);
    });
    return { status: false };
  } catch (err) {
    console.log(err);
    return { status: true, msg: err };
  }
}

function existSettingKey(setting, name) {
  try {
    const definedKeys = ["name", "type", "parseType", "value", "fallback"];
    definedKeys.forEach((key) => {
      if (setting[key] === undefined) throw new Error(key + " property not include in " + name + " setting");

      if (key === "fallback") {
        if (!Array.isArray(setting[key]) || setting[key].length === 0)
          throw new Error(`${name} setting fallback type must be an array and empty value will be like [""]`);
      }

      if (key !== "value" && !setting[key])
        throw new Error(key + " property value is not define of " + name + " setting");
    });

    return { status: false, msg: "" };
  } catch (err) {
    return { status: true, msg: err };
  }
}

module.exports = sanitizeSetting;
