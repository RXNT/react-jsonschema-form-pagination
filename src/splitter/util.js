export const asNavField = (field, navConfs, uiSchema) => {
  const separatorIndex = field.indexOf(".");
  if (separatorIndex === -1) {
    uiSchema[field] = {
      navConfs,
      "ui:field": "nav",
      origUiSchema: uiSchema[field],
    };
  } else {
    const parentField = field.substr(0, separatorIndex);
    const childField = field.substr(separatorIndex + 1);

    asNavField(childField, navConfs, uiSchema[parentField]);
  }
};

function asHiddenField(field, uiSchema) {
  uiSchema[field] = {
    "ui:widget": "hidden",
    "ui:field": "hidden",
  };
}

export const toHiddenUiSchema = ({ properties }, uiSchema) => {
  let cleanUiSchema = Object.keys(properties).reduce((agg, field) => {
    asHiddenField(field, agg);
    return agg;
  }, Object.assign({}, uiSchema));
  return cleanUiSchema;
};
