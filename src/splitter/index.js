import NavTree from "./NavTree";

export default function(schema, uiSchema) {
  return new NavTree(schema, uiSchema);
}
