import { GENERIC_TAB, UI_TAB_ALIAS, UI_TAB_ID } from "../utils";

function findNavs(field, uiSchema) {
  let navs =
    uiSchema[field] && uiSchema[field][UI_TAB_ID]
      ? uiSchema[field][UI_TAB_ID]
      : [];
  return Array.isArray(navs) ? navs : [navs];
}

export function findRelTree(tree, navs) {
  return navs.reduce((pos, tab) => {
    if (pos[tab] === undefined) {
      pos[tab] = {};
    }
    return pos[tab];
  }, tree);
}

function pushField(tree, field, uiAlias) {
  if (tree[GENERIC_TAB] === undefined) {
    tree[GENERIC_TAB] = {
      fields: [],
      aliases: {},
    };
  }
  tree[GENERIC_TAB].fields.push(field);
  if (uiAlias) {
    tree[GENERIC_TAB].aliases[field] = uiAlias;
  }
}

function fillSchemaConf(schema, uiSchema, tree) {
  Object.keys(schema.properties).forEach(field => {
    let navs = findNavs(field, uiSchema);
    let subTree = findRelTree(tree, navs);
    pushField(subTree, field);
  }, {});
}

function fillAliasesConf(uiSchema, tree) {
  let aliases = uiSchema[UI_TAB_ALIAS];
  if (!aliases) {
    return;
  }
  Object.keys(aliases).forEach(field => {
    let fieldAlias = aliases[field];
    let normFieldAlias = Array.isArray(fieldAlias) ? fieldAlias : [fieldAlias];
    normFieldAlias.forEach(alias => {
      let navs = findNavs(alias, uiSchema);
      let subTree = findRelTree(tree, navs);
      pushField(subTree, field, alias);
    });
  });
}

export function extractTree(schema, uiSchema) {
  let tabTree = {};
  fillSchemaConf(schema, uiSchema, tabTree);
  fillAliasesConf(uiSchema, tabTree);
  return tabTree;
}
