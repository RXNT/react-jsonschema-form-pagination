import {
  GENERIC_NAV,
  toArray,
  getNavAliases,
  findFieldNavs,
  UI_ORDER,
} from "../utils";

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

function fillSchemaConf(tree, schema, uiSchema, prefix = "") {
  Object.keys(schema.properties).forEach(field => {
    const fieldSchema = schema.properties[field];
    const fieldUiSchema = uiSchema[field];
    if (fieldSchema.type === "object" && fieldUiSchema) {
      fillSchemaConf(tree, fieldSchema, fieldUiSchema, field + ".");
    } else {
      let navs = findFieldNavs(field, uiSchema);
      let subTree = findRelTree(tree, navs);
      pushField(subTree, prefix ? prefix + field : field);
    }
  }, {});
}

function fillAliasesConf(tree, uiSchema) {
  let aliases = getNavAliases(uiSchema);
  Object.keys(aliases).forEach(field => {
    let fieldAlias = toArray(aliases[field]);
    fieldAlias.forEach(alias => {
      let navs = findFieldNavs(alias, uiSchema);
      let subTree = findRelTree(tree, navs);
      pushField(subTree, field, alias);
    });
  });
}

export function orderFields(tree, fieldsOrder) {
  Object.keys(tree).forEach(nav => {
    if (nav === GENERIC_NAV) {
      let { fields } = tree[nav];
      fields.sort((a, b) => fieldsOrder.indexOf(a) - fieldsOrder.indexOf(b));
    } else {
      orderFields(tree[nav], fieldsOrder);
    }
  });
}

export function extractTree(schema, uiSchema) {
  let tree = {};

  fillSchemaConf(tree, schema, uiSchema);
  fillAliasesConf(tree, uiSchema);

  // Calculate field order, either with UI_ORDER or with natural order
  let fieldsOrder = uiSchema[UI_ORDER]
    ? uiSchema[UI_ORDER]
    : Object.keys(schema.properties);
  orderFields(tree, fieldsOrder);

  return tree;
}
