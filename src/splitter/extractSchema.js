export default function getSubSchema(fields, schema) {
  let subSchema = {
    type: "object",
    properties: {},
  };
  fields.forEach(field => {
    subSchema.properties[field] = schema.properties[field];
  });
  if (schema.required) {
    subSchema.required = schema.required.filter(field =>
      fields.includes(field)
    );
  }
  return subSchema;
}
