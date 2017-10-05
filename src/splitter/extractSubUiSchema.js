import { UI_ORDER } from "../utils";

function keepOrdering(fields, uiSchema, subUiSchema) {
  if (uiSchema[UI_ORDER] && fields) {
    subUiSchema[UI_ORDER] = uiSchema[UI_ORDER].filter(field =>
      fields.includes(field)
    );
    if (uiSchema[UI_ORDER].length === 0) {
      delete uiSchema[UI_ORDER];
    }
  }
}

function extractSubUiSchema(fields, uiSchema) {
  let subUiSchema = {};

  fields.forEach(field => {
    subUiSchema[field] = uiSchema[field];
  });

  keepOrdering(fields, uiSchema, subUiSchema);

  return subUiSchema;
}

function replaceAliases(uiSchema, subUiSchema, aliases) {
  Object.keys(aliases).forEach(field => {
    let alias = aliases[field];
    subUiSchema[field] = uiSchema[alias];
  });
}

export default function getSubUiSchema(fields, uiSchema, aliases) {
  let subUiSchema = extractSubUiSchema(fields, uiSchema);
  replaceAliases(uiSchema, subUiSchema, aliases);
  return subUiSchema;
}
