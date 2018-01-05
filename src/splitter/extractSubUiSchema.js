function restoreFields(fields, uiSchema, origUiSchema) {
  fields.forEach(field => (uiSchema[field] = origUiSchema[field]));
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
  uiSchema = {}
) {
  restoreFields(fields, uiSchema, origUiSchema);
  replaceAliases(aliases, uiSchema, origUiSchema);

  return uiSchema;
}
