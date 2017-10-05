import NavTree from "./NavTree";

export default function(schema, uiSchema, tabData = []) {
  return new NavTree(schema, uiSchema, tabData);
}
