import { GENERIC_NAV } from "../utils";
import extractSubConf from "./extractSubConf";
import {
  findFieldNavs,
  orderNavByName,
  toNavConfOrDefault,
} from "./extractSubNavs";
import extractUiSchema from "./extractUiSchema";
import { extractTree, findRelTree } from "./extractTree";

export default class NavTree {
  constructor(schema, uiSchema) {
    this.tree = extractTree(schema, uiSchema);
    this.schema = schema;
    this.uiSchema = uiSchema;

    this.updateActiveNav = this.updateActiveNav.bind(this);
    this.findActiveNav = this.findActiveNav.bind(this);
    this.toSubForms = this.toSubForms.bind(this);
  }

  updateActiveNav(activeNavs, relTree) {
    relTree = relTree ? relTree : findRelTree(this.tree, activeNavs);
    let orderedNavs = orderNavByName(Object.keys(relTree), this.uiSchema);
    let nextNav = orderedNavs.find(nav => nav !== GENERIC_NAV);
    if (nextNav) {
      activeNavs.push(nextNav);
      this.updateActiveNav(activeNavs, relTree[nextNav]);
    }
  }

  findActiveNav(field) {
    return findFieldNavs(field, this.uiSchema).map(nav =>
      toNavConfOrDefault(nav, this.uiSchema)
    );
  }

  toSubForms(activeNav, onNavChange) {
    let agg = [];
    for (let i = 0; i <= activeNav.length; i++) {
      let subConf = extractSubConf(
        activeNav.slice(0, i),
        this.tree,
        this.schema,
        this.uiSchema
      );
      if (subConf.schema || subConf.navs.links.length > 0) {
        agg.push(subConf);
      }
    }

    return extractUiSchema(agg, this.schema, this.uiSchema, onNavChange);
  }
}
