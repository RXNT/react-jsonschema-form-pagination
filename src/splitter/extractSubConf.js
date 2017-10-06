import { GENERIC_NAV } from "../utils";
import { findRelTree } from "./extractTree";
import extractSubUiSchema from "./extractSubUiSchema";
import extractSubSchema from "./extractSubSchema";
import extractSubNavs, { toNavConf } from "./extractSubNavs";

const extractNavs = (navPath, tree, uiSchema) => {
  if (navPath.length == 0) {
    let relConf = toNavConf(GENERIC_NAV, uiSchema);
    return Object.assign({}, { links: [] }, relConf);
  }

  let activeNav = navPath[navPath.length - 1];
  let parentTree = findRelTree(tree, navPath.slice(0, navPath.length - 1));
  let navWithLinks = extractSubNavs(parentTree, uiSchema, activeNav);
  if (navPath.length == 1) {
    return navWithLinks;
  }

  let parentNav = navPath[navPath.length - 2];
  let parentConf = toNavConf(parentNav, uiSchema);
  return Object.assign({}, navWithLinks, parentConf);
};

const extractSubConf = (navPath, tree, schema, uiSchema) => {
  let relTree = findRelTree(tree, navPath);
  let navs = extractNavs(navPath, tree, uiSchema);
  if (relTree[GENERIC_NAV] === undefined) {
    return Object.assign({}, { navs });
  }

  let { fields, aliases } = relTree[GENERIC_NAV];
  let subSchema = extractSubSchema(fields, schema);
  let subUiSchema = extractSubUiSchema(fields, uiSchema, aliases);

  if (navPath.length === 0) {
    subSchema.title = schema.title;
    subSchema.description = schema.description;
  }

  return { schema: subSchema, uiSchema: subUiSchema, navs };
};

export default extractSubConf;
