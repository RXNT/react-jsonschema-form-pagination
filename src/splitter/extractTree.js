import { GENERIC_TAB, UI_TAB_ALIAS, UI_TAB_ID } from "../utils";

function findTabs(field, uiSchema) {
  let tabs =
    uiSchema[field] && uiSchema[field][UI_TAB_ID]
      ? uiSchema[field][UI_TAB_ID]
      : [];
  return Array.isArray(tabs) ? tabs : [tabs];
}

export function findRelTree(tree, tabs) {
  return tabs.reduce((pos, tab) => {
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
    let tabs = findTabs(field, uiSchema);
    let subTree = findRelTree(tree, tabs);
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
      let tabs = findTabs(alias, uiSchema);
      let subTree = findRelTree(tree, tabs);
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
