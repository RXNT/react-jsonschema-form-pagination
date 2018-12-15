import { toHiddenUiSchema } from "./util";

const restoreField = (field, uiSchema, origUiSchema, schema) => {
  const separatorIndex = field.indexOf(".");
  if (separatorIndex === -1) {
    uiSchema[field] = origUiSchema[field];
  } else {
    const parentField = field.substr(0, separatorIndex);
    const childField = field.substr(separatorIndex + 1);
    const parentFieldSchema = schema.properties[parentField];

    if (uiSchema[parentField]["ui:widget"] === "hidden") {
      delete uiSchema[parentField]["ui:widget"];
      delete uiSchema[parentField]["ui:field"];
      uiSchema[parentField] = toHiddenUiSchema(
        parentFieldSchema,
        origUiSchema[parentField]
      );
    }

    restoreField(
      childField,
      uiSchema[parentField],
      origUiSchema[parentField],
      parentFieldSchema
    );
  }
};

function restoreFields(fields, uiSchema, origUiSchema, schema) {
  fields.forEach(field => restoreField(field, uiSchema, origUiSchema, schema));
  return uiSchema;
}

function replaceAliases(aliases, uiSchema, origUiSchema) {
  Object.keys(aliases).forEach(field => {
    let alias = aliases[field];
    uiSchema[field] = origUiSchema[alias];
  });
}

export default function extractSubUiSchema(
  fields,
  aliases,
  origUiSchema,
  uiSchema = {},
  schema
) {
  restoreFields(fields, uiSchema, origUiSchema, schema);
  replaceAliases(aliases, uiSchema, origUiSchema);

  return uiSchema;
}
