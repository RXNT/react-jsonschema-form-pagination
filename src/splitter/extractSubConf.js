import { GENERIC_TAB } from "../utils";
import { findRelTree } from "./extractTree";
import extractSubUiSchema from "./extractSubUiSchema";
import extractSubSchema from "./extractSubSchema";
import extractSubNavs from "./extractSubNavs";

const EMPTY_CONF = {
  schema: { type: "object", properties: {} },
  uiSchema: {},
};

const extractSubConf = (
  navPath,
  tree,
  schema,
  uiSchema,
  navData,
  activeNav
) => {
  let relTree = findRelTree(tree, navPath);
  let subTree = relTree[GENERIC_TAB];

  let navs = extractSubNavs(relTree, uiSchema, navData, activeNav);
  if (subTree === undefined) {
    return Object.assign({}, { navs }, EMPTY_CONF);
  }

  let subSchema = extractSubSchema(subTree.fields, schema);
  let subUiSchema = extractSubUiSchema(
    subTree.fields,
    uiSchema,
    subTree.aliases
  );

  if (navPath.length === 0) {
    subSchema.title = schema.title;
    subSchema.description = schema.description;
  }

  return { schema: subSchema, uiSchema: subUiSchema, navs };
};

export default extractSubConf;
