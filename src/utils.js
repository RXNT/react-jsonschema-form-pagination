import deepcopy from "deepcopy";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export const GENERIC_TAB = "generic";

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
      !uiSchema[field]["ui:tabID"] ||
      !tabData.some(tab => tab.tabID === uiSchema[field]["ui:tabID"])
    );
  });
  return toSchema(genericProperties, schema);
}

function calculateTabSchema(tabID, schema, uiSchema) {
  let properties = Object.keys(schema.properties).filter(
    field => uiSchema[field] && uiSchema[field]["ui:tabID"] === tabID
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
