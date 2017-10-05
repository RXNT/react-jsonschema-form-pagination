import { GENERIC_TAB } from "../utils";
import { findRelTree } from "./extractTree";
import extractUiSchemaForTree from "./extractUiSchema";
import extractSchemaForTree from "./extractSchema";
import extractTabsForTree from "./extractNavs";

const EMPTY_CONF = {
  schema: { type: "object", properties: {} },
  uiSchema: {},
};

const getNavConf = (tabPath, tree, schema, uiSchema, tabData) => {
  let relTree = findRelTree(tree, tabPath);
  let tabConf = relTree[GENERIC_TAB];

  let tabs = extractTabsForTree(relTree, uiSchema, tabData);
  if (tabConf === undefined) {
    return Object.assign({}, { tabs }, EMPTY_CONF);
  }

  let tabSchema = extractSchemaForTree(tabConf.fields, schema);
  let tabUiSchema = extractUiSchemaForTree(
    tabConf.fields,
    uiSchema,
    tabConf.aliases
  );

  if (tabPath.length === 0) {
    tabSchema.title = schema.title;
    tabSchema.description = schema.description;
  }

  return { schema: tabSchema, uiSchema: tabUiSchema, tabs };
};

export default class NavTree {
  constructor(tree, schema, uiSchema, tabData) {
    this.tree = tree;
    this.schema = schema;
    this.uiSchema = uiSchema;
    this.tabData = tabData;
  }

  pushToTabFromTree = (relTree, activeTabs) => {
    let nextTab = Object.keys(relTree).find(tab => tab !== GENERIC_TAB);
    if (nextTab) {
      activeTabs.push(nextTab);
      this.pushToTabFromTree(relTree[nextTab], activeTabs);
    }
  };

  updateActiveTabs = activeTabs => {
    let relTree = findRelTree(this.tree, activeTabs);
    this.pushToTabFromTree(relTree, activeTabs);
  };

  getNav = (tabs, i) => {
    let relTabs = tabs.slice(0, i);
    let activeTab = tabs.length > i ? tabs[i] : GENERIC_TAB;
    let conf = getNavConf(
      relTabs,
      this.tree,
      this.schema,
      this.uiSchema,
      this.tabData
    );
    conf.activeTab = activeTab;
    return conf;
  };

  toSubForms = activeTabs => {
    let agg = [];
    for (let i = 0; i <= activeTabs.length; i++) {
      agg.push(this.getNav(activeTabs, i));
    }
    return agg;
  };
}
