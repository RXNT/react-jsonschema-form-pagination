import { GENERIC_NAV, findFieldNavs } from "../utils";
import { orderNavByName, toNavConfOrDefault } from "./extractSubNavs";
import { extractTree, findRelTree } from "./extractTree";
import extractSubUiSchema from "./extractSubUiSchema";
import extractSubNavs from "./extractSubNavs";

function asNavField(field, navConfs, uiSchema) {
  uiSchema[field] = {
    navConfs,
    "ui:field": "nav",
    origUiSchema: uiSchema[field],
  };
}

function asHiddenField(field, uiSchema) {
  uiSchema[field] = {
    "ui:widget": "hidden",
    "ui:field": "hidden",
  };
}

function toHiddenUiSchema({ properties }, uiSchema) {
  let cleanUiSchema = Object.keys(properties).reduce((agg, field) => {
    asHiddenField(field, agg);
    return agg;
  }, Object.assign({}, uiSchema));
  return cleanUiSchema;
}

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

  buildUiSchema = (
    activeNav,
    tree,
    uiSchema,
    onNavChange,
    pos = 0,
    navConfs = []
  ) => {
    if (tree[GENERIC_NAV]) {
      let { fields, aliases } = tree[GENERIC_NAV];

      extractSubUiSchema(fields, aliases, this.uiSchema, uiSchema);

      if (navConfs.length > 0) {
        asNavField(fields[0], navConfs, uiSchema);
      }
      navConfs = [];
    }

    if (activeNav.length === pos) {
      return uiSchema;
    }

    let nextTree = tree[activeNav[pos]];
    let nextNavConf = extractSubNavs(
      tree,
      this.uiSchema,
      activeNav.slice(0, pos + 1),
      onNavChange
    );

    return this.buildUiSchema(
      activeNav,
      nextTree,
      uiSchema,
      onNavChange,
      pos + 1,
      navConfs.concat(nextNavConf)
    );
  };

  toSubForms = (activeNav, onNavChange) => {
    let hiddenUiSchema = toHiddenUiSchema(this.schema, this.uiSchema);
    return this.buildUiSchema(
      activeNav,
      this.tree,
      hiddenUiSchema,
      onNavChange
    );
  };
}
