import { GENERIC_NAV } from "../utils";
import { getNavAliases, findFieldNavs } from "./extractSubNavs";

export function findRelTree(tree, navs) {
  return navs.reduce((pos, nav) => {
    if (pos[nav] === undefined) {
      pos[nav] = {};
    }
    return pos[nav];
  }, tree);
}

function pushField(tree, field, uiAlias) {
  if (tree[GENERIC_NAV] === undefined) {
    tree[GENERIC_NAV] = {
      fields: [],
      aliases: {},
    };
  }
  tree[GENERIC_NAV].fields.push(field);
  if (uiAlias) {
    tree[GENERIC_NAV].aliases[field] = uiAlias;
  }
}

function fillSchemaConf(schema, uiSchema, tree) {
  Object.keys(schema.properties).forEach(field => {
    let navs = findFieldNavs(field, uiSchema);
    let subTree = findRelTree(tree, navs);
    pushField(subTree, field);
  }, {});
}

function fillAliasesConf(uiSchema, tree) {
  let aliases = getNavAliases(uiSchema);
  if (!aliases) {
    return;
  }
  Object.keys(aliases).forEach(field => {
    let fieldAlias = aliases[field];
    let normFieldAlias = Array.isArray(fieldAlias) ? fieldAlias : [fieldAlias];
    normFieldAlias.forEach(alias => {
      let navs = findFieldNavs(alias, uiSchema);
      let subTree = findRelTree(tree, navs);
      pushField(subTree, field, alias);
    });
  });
}

export function extractTree(schema, uiSchema) {
  let tree = {};
  fillSchemaConf(schema, uiSchema, tree);
  fillAliasesConf(uiSchema, tree);
  return tree;
}
