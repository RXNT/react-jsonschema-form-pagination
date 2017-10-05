import { GENERIC_TAB } from "../utils";
import extractSubConf from "./extractSubConf";
import { extractTree, findRelTree } from "./extractTree";

export default class NavTree {
  constructor(schema, uiSchema, navData = []) {
    this.tree = extractTree(schema, uiSchema);
    this.schema = schema;
    this.uiSchema = uiSchema;
    this.navData = navData;
  }

  pushToTabFromTree = (relTree, activeNavs) => {
    let nextNav = Object.keys(relTree).find(nav => nav !== GENERIC_TAB);
    if (nextNav) {
      activeNavs.push(nextNav);
      this.pushToTabFromTree(relTree[nextNav], activeNavs);
    }
  };

  updateActiveNav = activeNavs => {
    let relTree = findRelTree(this.tree, activeNavs);
    this.pushToTabFromTree(relTree, activeNavs);
  };

  getNav = (navs, i) => {
    let relTabs = navs.slice(0, i);
    let activeNav = navs.length > i ? navs[i] : GENERIC_TAB;
    return extractSubConf(
      relTabs,
      this.tree,
      this.schema,
      this.uiSchema,
      this.navData,
      activeNav
    );
  };

  toSubForms = activeNav => {
    let agg = [];
    for (let i = 0; i <= activeNav.length; i++) {
      agg.push(this.getNav(activeNav, i));
    }
    return agg;
  };
}
