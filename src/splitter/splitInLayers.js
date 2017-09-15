import TabTree from "./TabTree";
import { extractTree } from "./extractTree";

export default function splitInLayers(schema, uiSchema, tabData = []) {
  let tree = extractTree(schema, uiSchema);
  return new TabTree(tree, schema, uiSchema, tabData);
}
