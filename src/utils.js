import deepcopy from "deepcopy";

export const GENERIC_TAB = "default";
export const UI_TAB_ID = "ui:tabID";
export const UI_TAB_ALIAS = "ui:tabAlias";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export const toError = message => {
  if (isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
};

export function isEmptySchema(schema) {
  return (
    !schema || !schema.properties || Object.keys(schema.properties).length === 0
  );
}

export function findLayer(field, uiSchema) {
  return uiSchema && uiSchema[field] && uiSchema[field][UI_TAB_ID]
    ? uiSchema[field][UI_TAB_ID][0]
    : GENERIC_TAB;
}

export function listLayers(schema, uiSchema) {
  let schemaLayers = Object.keys(schema.properties).map(field =>
    findLayer(field, uiSchema)
  );

  let uiSchemaLayers = Object.keys(uiSchema).map(uiField =>
    findLayer(uiField, uiSchema)
  );

  let allLayers = schemaLayers.concat(uiSchemaLayers);
  return Array.from(new Set(allLayers));
}

function normalizeTabs(uiSchema) {
  Object.keys(uiSchema).forEach(field => {
    if (
      uiSchema[field] &&
      uiSchema[field][UI_TAB_ID] &&
      !Array.isArray(uiSchema[field][UI_TAB_ID])
    ) {
      uiSchema[field][UI_TAB_ID] = [uiSchema[field][UI_TAB_ID]];
    }
  });
}

function normalizeAliases(uiSchema) {
  if (!uiSchema[UI_TAB_ALIAS]) {
    uiSchema[UI_TAB_ALIAS] = {};
  }
  Object.keys(uiSchema[UI_TAB_ALIAS]).forEach(field => {
    let fieldAliases = uiSchema[UI_TAB_ALIAS][field];
    if (!Array.isArray(fieldAliases)) {
      uiSchema[UI_TAB_ALIAS][field] = [fieldAliases];
    }
  });
}

export function normalizeUiSchema(uiSchema = {}) {
  let normUiSchema = deepcopy(uiSchema);
  normalizeTabs(normUiSchema);
  normalizeAliases(normUiSchema);
  return normUiSchema;
}

function normalizeRequired(schema) {
  if (!schema.required) {
    schema.required = [];
  }
}

export function normalizeSchema(schema) {
  let normSchema = deepcopy(schema);
  normalizeRequired(normSchema);
  return normSchema;
}
