import deepcopy from "deepcopy";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

function calculateTabSchema(tabID, schema, uiSchema) {
  let tabSchema = deepcopy(schema);
  if (!tabSchema.required) {
    tabSchema.required = [];
  }
  Object.keys(tabSchema.properties)
    .filter(field => uiSchema[field]["ui:tabID"] !== tabID)
    .forEach(field => {
      if (tabSchema.required.includes(field)) {
        tabSchema.required = tabSchema.required.filter(
          reqField => reqField !== field
        );
      }
      delete tabSchema.properties[field];
    });
  return tabSchema;
}

export function divideInTabs(tabData, schema, uiSchema) {
  let idToSchema = tabData.reduce((agg, { tabID }) => {
    agg[tabID] = calculateTabSchema(tabID, schema, uiSchema);
    return agg;
  }, {});
  return idToSchema;
}
