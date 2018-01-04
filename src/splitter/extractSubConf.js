import { GENERIC_NAV } from "../utils";
import { findRelTree } from "./extractTree";
import extractSubUiSchema from "./extractSubUiSchema";
import extractSubSchema from "./extractSubSchema";
import extractSubNavs, { toNavConf } from "./extractSubNavs";

const extractNavs = (navPath, tree, uiSchema) => {
  if (navPath.length === 0) {
    let relConf = toNavConf(GENERIC_NAV, uiSchema);
    return Object.assign({}, { links: [] }, relConf);
  }

  let activeNav = navPath[navPath.length - 1];
  let parentTree = findRelTree(tree, navPath.slice(0, navPath.length - 1));
  let navWithLinks = extractSubNavs(parentTree, uiSchema, activeNav);
  if (navPath.length === 1) {
    let relConf = toNavConf(GENERIC_NAV, uiSchema);
    return Object.assign(navWithLinks, relConf);
  }

  let parentNav = navPath[navPath.length - 2];
  let parentConf = toNavConf(parentNav, uiSchema);
  return Object.assign({}, navWithLinks, parentConf);
};

const extractSubConf = (navPath, tree, schema, uiSchema) => {
  let relTree = findRelTree(tree, navPath);
  let navs = extractNavs(navPath, tree, uiSchema);
  if (relTree[GENERIC_NAV] === undefined) {
    return { navs, navPath };
  }

  let { fields, aliases } = relTree[GENERIC_NAV];
  let subSchema = extractSubSchema(fields, schema);
  let subUiSchema = extractSubUiSchema(fields, uiSchema, aliases);

  if (navPath.length === 0) {
    subSchema.title = schema.title;
    subSchema.description = schema.description;
  }

  return { schema: subSchema, uiSchema: subUiSchema, navs, navPath };
};

export default extractSubConf;

function toHiddenUiSchema({ properties }) {
  return Object.keys(properties).reduce((agg, field) => {
    agg[field] = {
      "ui:widget": "hidden",
      "ui:field": "hidden",
    };
    return agg;
  }, {});
}

function buildTabUiSchema(
  activeNav,
  tree,
  uiSchema,
  origSchema,
  origUiSchema,
  onNavChange
) {
  if (activeNav.length === 0) {
    return uiSchema;
  }

  let relTree = tree[activeNav[0]];
  let { fields, aliases } = tree[activeNav[0]];

  Object.assign(uiSchema, extractSubUiSchema(fields, origUiSchema, aliases));

  return buildTabUiSchema(
    activeNav.slice(1),
    relTree,
    uiSchema,
    origUiSchema,
    onNavChange
  );
}

export function toTabUiSchema(
  activeNav,
  tree,
  origSchema,
  origUiSchema,
  onNavChange
) {
  let hiddenUiSchema = toHiddenUiSchema(origSchema);
  return buildTabUiSchema(
    activeNav,
    tree,
    hiddenUiSchema,
    origSchema,
    origUiSchema,
    onNavChange
  );
}
