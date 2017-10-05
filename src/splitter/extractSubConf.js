import { GENERIC_TAB } from "../utils";
import { findRelTree } from "./extractTree";
import extractSubUiSchema from "./extractSubUiSchema";
import extractSubSchema from "./extractSubSchema";
import extractSubNavs from "./extractSubNavs";

const EMPTY_CONF = {
  schema: { type: "object", properties: {} },
  uiSchema: {},
};

const extractNavs = (navPath, tree, uiSchema, navData) => {
  if (navPath.length == 0) {
    let relConf = navData.find(({ tabID }) => tabID === GENERIC_TAB);
    return Object.assign({}, { relConf }, { links: [] });
  }

  let activeNav = navPath[navPath.length - 1];
  let parentTree = findRelTree(tree, navPath.slice(0, navPath.length - 1));
  return extractSubNavs(parentTree, uiSchema, navData, activeNav);
};

const extractSubConf = (navPath, tree, schema, uiSchema, navData) => {
  let relTree = findRelTree(tree, navPath);
  let navs = extractNavs(navPath, tree, uiSchema, navData);
  if (relTree[GENERIC_TAB] === undefined) {
    return Object.assign({}, { navs }, EMPTY_CONF);
  }

  let { fields, aliases } = relTree[GENERIC_TAB];
  let subSchema = extractSubSchema(fields, schema);
  let subUiSchema = extractSubUiSchema(fields, uiSchema, aliases);

  if (navPath.length === 0) {
    subSchema.title = schema.title;
    subSchema.description = schema.description;
  }

  return { schema: subSchema, uiSchema: subUiSchema, navs };
};

export default extractSubConf;
