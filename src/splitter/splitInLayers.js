import NavTree from "./NavTree";
import { extractTree } from "./extractTree";

export default function splitInLayers(schema, uiSchema, tabData = []) {
  let tree = extractTree(schema, uiSchema);
  return new NavTree(tree, schema, uiSchema, tabData);
}
