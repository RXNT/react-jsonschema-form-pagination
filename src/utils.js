import deepcopy from "deepcopy";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export const GENERIC_TAB = "default";
export const UI_TAB_ID = "ui:tabID";

function toSchema(properties, schema) {
  let tabSchema = deepcopy(schema);
  if (!tabSchema.required) {
    tabSchema.required = [];
  }
  tabSchema.required = tabSchema.required.filter(field =>
    properties.includes(field)
  );
  tabSchema.properties = properties.reduce((agg, field) => {
    agg[field] = schema.properties[field];
    return agg;
  }, {});
  return tabSchema;
}

function calculateGenericTab(tabData, schema, uiSchema) {
  let genericProperties = Object.keys(schema.properties).filter(field => {
    return (
      !uiSchema[field] ||
      !uiSchema[field][UI_TAB_ID] ||
      !tabData.some(tab => tab.tabID === uiSchema[field][UI_TAB_ID])
    );
  });
  return toSchema(genericProperties, schema);
}

function calculateTabSchema(tabID, schema, uiSchema) {
  let properties = Object.keys(schema.properties).filter(
    field => uiSchema[field] && uiSchema[field][UI_TAB_ID] === tabID
  );
  return toSchema(properties, schema);
}

export function divideInTabs(tabData, schema, uiSchema) {
  let idToSchema = tabData.reduce((agg, { tabID }) => {
    agg[tabID] = calculateTabSchema(tabID, schema, uiSchema);
    return agg;
  }, {});
  idToSchema[GENERIC_TAB] = calculateGenericTab(tabData, schema, uiSchema);
  return idToSchema;
}

function findLayer(field, uiSchema) {
  return uiSchema && uiSchema[field] && uiSchema[field][UI_TAB_ID]
    ? Array.isArray(uiSchema[field][UI_TAB_ID])
      ? uiSchema[field][UI_TAB_ID][0]
      : uiSchema[field][UI_TAB_ID]
    : GENERIC_TAB;
}

function removeLayer(uiSchema) {
  let cleanedUiSchema = deepcopy[uiSchema];
  Object.keys(cleanedUiSchema).forEach(field => {
    if (cleanedUiSchema[field][UI_TAB_ID]) {
      if (
        Array.isArray(cleanedUiSchema[field][UI_TAB_ID]) &&
        cleanedUiSchema[field][UI_TAB_ID].length() > 1
      ) {
        cleanedUiSchema[field][UI_TAB_ID].shift();
      } else {
        delete cleanedUiSchema[field][UI_TAB_ID];
      }
    }
  });
  return cleanedUiSchema;
}

function addLayerIfMissing(agg, layer, schema, uiSchema) {
  if (!agg[layer]) {
    let emptySchema = Object.assign({}, deepcopy(schema), {
      required: [],
      properties: {},
    });
    agg[layer] = {
      schema: emptySchema,
      uiSchema: deepcopy[uiSchema],
      tabData: [],
    };
  }
}

function addProperty(conf, field, schema) {
  if (schema.required && schema.required.includes(field)) {
    conf.schema.required.push(field);
  }
  conf.schema.properties[field] = schema.properties[field];
}

function addTabIfMissing(conf, layer, tabData) {
  let preConfTab = tabData.find(({ tabID }) => tabID === layer);
  let tab = preConfTab ? preConfTab : { tabID: layer };
  if (!conf.tabData.includes(tab)) {
    conf.tabData.push(tab);
  }
}

export function divideInLayers(schema, uiSchema, tabData) {
  let schemaLayer = {};
  let lowerUiSchema = removeLayer(uiSchema);
  Object.keys(schema.properties).forEach(field => {
    let layer = findLayer(field, uiSchema);
    addLayerIfMissing(schemaLayer, layer, schema, lowerUiSchema);
    addProperty(schemaLayer[layer], field, schema);
    addTabIfMissing(schemaLayer[layer], layer, tabData);
  });
  return schemaLayer;
}
