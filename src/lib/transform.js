const mode = process.env.APP_MODE;

const Transform = {};

Transform.toJSON = (setting) => {
  try {
    const settings = Object.keys(setting).reduce((acc, key) => {
      acc[key] = setting[key].value;
      return acc;
    }, {});
    return JSON.stringify(settings);
  } catch (err) {
    console.log(err);
  }
};

Transform.editorJSON = (setting, keys) => {
  try {
    const editorSettings = {};
    Object.keys(setting).forEach((rootKey) => {
      const activation = Object.keys(setting[rootKey]).reduce((acc, key) => {
        const tempSetting = { ...setting[rootKey][key] };
        acc = { ...acc, ...(tempSetting.activation && { [key]: tempSetting.activation }) };
        return acc;
      }, {});
      editorSettings.__activation = { ...editorSettings.__activation, ...activation };
      
      editorSettings[rootKey] = Object.keys(setting[rootKey]).reduce((acc, key) => {
        const tempSetting = { ...setting[rootKey][key] };
        delete tempSetting.parseType;
        delete tempSetting.value;
        delete tempSetting.fallback;
        delete tempSetting.activation;

        acc[key] = { ...tempSetting };
        return acc;
      }, {});
    });
    return JSON.stringify(editorSettings);
  } catch (err) {
    console.log(err);
  }
};

Transform.toValue = (setting) => {
  try {
    return Object.keys(setting).reduce((acc, key) => {
      acc[key] = mode === "development" ? setting[key].value : key;
      return acc;
    }, {});
  } catch (err) {
    console.log(err);
  }
};

module.exports = Transform;
