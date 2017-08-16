import deepcopy from "deepcopy";
import { UI_TAB_ALIAS, findLayer } from "../utils";

const isAliasFieldPartOfLayer = (field, uiSchema, layer) => {
  return (
    uiSchema[UI_TAB_ALIAS][field] &&
    uiSchema[UI_TAB_ALIAS][field].some(
      alias => findLayer(alias, uiSchema) === layer
    )
  );
};

const isFieldPartOfLayer = (uiSchema, layer) => field => {
  let fieldLayer = findLayer(field, uiSchema);
  return (
    fieldLayer === layer || isAliasFieldPartOfLayer(field, uiSchema, layer)
  );
};

const copyField = (schema, origSchema) => {
  return field => {
    if (origSchema.required.includes(field)) {
      schema.required.push(field);
    }
    schema.properties[field] = origSchema.properties[field];
  };
};

const extractSchemaForLayer = (layer, origSchema, origUiSchema) => {
  let schema = Object.assign({}, deepcopy(origSchema), {
    required: [],
    properties: {},
  });

  let layerFields = Object.keys(origSchema.properties).filter(
    isFieldPartOfLayer(origUiSchema, layer)
  );

  layerFields.forEach(copyField(schema, origSchema));
  return schema;
};

export default extractSchemaForLayer;
