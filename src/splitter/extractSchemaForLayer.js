import deepcopy from "deepcopy";
import { UI_TAB_ALIAS, findLayer } from "../utils";

function isAliasFieldPartOfLayer(field, uiSchema, layer) {
  return (
    uiSchema[UI_TAB_ALIAS][field] &&
    uiSchema[UI_TAB_ALIAS][field].some(
      alias => findLayer(alias, uiSchema) === layer
    )
  );
}

function isFieldPartOfLayer(field, uiSchema, layer) {
  return (
    findLayer(field, uiSchema) === layer ||
    isAliasFieldPartOfLayer(field, uiSchema, layer)
  );
}

function copyField(schema, field, origSchema) {
  if (origSchema.required.includes(field)) {
    schema.required.push(field);
  }
  schema.properties[field] = origSchema.properties[field];
}

export default function extractSchemaForLayer(layer, origSchema, origUiSchema) {
  let schema = Object.assign({}, deepcopy(origSchema), {
    required: [],
    properties: {},
  });

  let layerFields = Object.keys(origSchema.properties).filter(field =>
    isFieldPartOfLayer(field, origUiSchema, layer)
  );

  layerFields.forEach(field => copyField(schema, field, origSchema));
  return schema;
}
