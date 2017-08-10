import deepcopy from "deepcopy";

export const GENERIC_TAB = "default";
export const UI_TAB_ID = "ui:tabID";
export const UI_TAB_ALIAS = "ui:tabAlias";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

class Layer {
  constructor(tabs, uiSchema, conf) {
    this.tabs = tabs;
    this.uiSchema = uiSchema;
    this.conf = conf;
    this.defaultTab = { tabs, schema: conf[GENERIC_TAB], uiSchema };
    this.activeTab = this.chooseActive(tabs);
  }

  chooseActive(tabs) {
    let nonDefaultTabs = tabs.filter(({ tabID }) => tabID != GENERIC_TAB);
    return nonDefaultTabs.length > 0 ? nonDefaultTabs[0].tabID : GENERIC_TAB;
  }

  doUpdateActiveTabs = (activeTabs, i) => {
    if (i === activeTabs.length) {
      if (this.activeTab !== GENERIC_TAB) {
        activeTabs.push(this.activeTab);
        this.conf[this.activeTab].doUpdateActiveTabs(activeTabs, i + 1);
      }
    } else {
      this.activeTab = activeTabs[i];
      this.conf[activeTabs[i]].doUpdateActiveTabs(activeTabs, i + 1);
    }
    return activeTabs;
  };

  updateActiveTabs = activeTabs => this.doUpdateActiveTabs(activeTabs, 0);

  toSubForms = activeTabs => {
    let agg = [];
    let tab = activeTabs[0];
    agg.push(Object.assign({}, this.defaultTab, { activeTab: tab }));
    if (activeTabs.length === 0) {
      return agg;
    }
    if (tab !== GENERIC_TAB) {
      let nextConf = this.conf[tab];
      let nextTabs = activeTabs.slice(1);
      let nestedTabs = nextConf.toSubForms(nextTabs);
      nestedTabs.forEach(conf => agg.push(conf));
    }
    return agg;
  };
}

function isAliasFieldPartOfLayer(field, uiSchema, layer) {
  return (
    uiSchema[UI_TAB_ALIAS][field] &&
    uiSchema[UI_TAB_ALIAS][field].some(
      alias => findLayer(alias, uiSchema) === layer
    )
  );
}

function isFieldPartOfLayer(field, uiSchema, layer) {
  return (
    findLayer(field, uiSchema) === layer ||
    isAliasFieldPartOfLayer(field, uiSchema, layer)
  );
}

function findLayer(field, uiSchema) {
  return uiSchema && uiSchema[field] && uiSchema[field][UI_TAB_ID]
    ? uiSchema[field][UI_TAB_ID][0]
    : GENERIC_TAB;
}

function listLayers(schema, uiSchema) {
  let layers = Object.keys(schema.properties).map(field =>
    findLayer(field, uiSchema)
  );
  return Array.from(new Set(layers));
}

function removeLayerFromUi(uiSchema) {
  let cleanedUiSchema = deepcopy(uiSchema);
  Object.keys(cleanedUiSchema).forEach(field => {
    let uiTab = cleanedUiSchema[field][UI_TAB_ID];
    if (uiTab && uiTab.length > 1) {
      uiTab.shift();
    } else {
      delete cleanedUiSchema[field][UI_TAB_ID];
    }
  });
  return cleanedUiSchema;
}

function replaceFieldUiWithAliases(layer, uiSchema) {
  let layerUISchema = deepcopy(uiSchema);
  Object.keys(uiSchema[UI_TAB_ALIAS]).forEach(field => {
    let aliases = uiSchema[UI_TAB_ALIAS][field];
    let aliasesInLayer = aliases.filter(
      aliasField => findLayer(aliasField, uiSchema) === layer
    );
    aliasesInLayer.forEach(alias => {
      layerUISchema[field] = layerUISchema[alias];
      delete layerUISchema[alias];
    });
    layerUISchema[UI_TAB_ALIAS][field] = aliases.filter(
      alias => !aliasesInLayer.includes(alias)
    );
  });
  return layerUISchema;
}

function copyField(schema, field, origSchema) {
  if (origSchema.required.includes(field)) {
    schema.required.push(field);
  }
  schema.properties[field] = origSchema.properties[field];
}

function extractSchemaForLayer(layer, origSchema, uiSchema) {
  let schema = Object.assign({}, deepcopy(origSchema), {
    required: [],
    properties: {},
  });
  Object.keys(origSchema.properties)
    .filter(field => isFieldPartOfLayer(field, uiSchema, layer))
    .forEach(field => copyField(schema, field, origSchema));
  return schema;
}

function extractUiSchemaForLayer(layer, origUiSchema) {
  let uiSchema = deepcopy(origUiSchema);
  return removeLayerFromUi(replaceFieldUiWithAliases(layer, uiSchema));
}

function doSplitInLayers(origSchema, origUiSchema, tabData) {
  let layers = listLayers(origSchema, origUiSchema);

  let conf = layers.reduce((conf, layer) => {
    let schema = extractSchemaForLayer(layer, origSchema, origUiSchema);
    let uiSchema = extractUiSchemaForLayer(layer, origUiSchema);
    if (layer !== GENERIC_TAB) {
      conf[layer] = doSplitInLayers(schema, uiSchema, tabData);
    } else {
      conf[layer] = schema;
    }
    return conf;
  }, {});

  let tabs = layers.map(layer => {
    let tab = tabData.find(({ tabID }) => tabID === layer);
    return tab ? tab : { tabID: layer, name: layer };
  });

  return new Layer(
    tabs,
    extractUiSchemaForLayer(GENERIC_TAB, origUiSchema),
    conf
  );
}

function normalizeUiSchema(uiSchema) {
  let normUiSchema = deepcopy(uiSchema);
  Object.keys(normUiSchema).forEach(field => {
    if (
      normUiSchema[field] &&
      normUiSchema[field][UI_TAB_ID] &&
      !Array.isArray(normUiSchema[field][UI_TAB_ID])
    ) {
      normUiSchema[field][UI_TAB_ID] = [normUiSchema[field][UI_TAB_ID]];
    }
  });
  if (!normUiSchema[UI_TAB_ALIAS]) {
    normUiSchema[UI_TAB_ALIAS] = {};
  }
  Object.keys(normUiSchema[UI_TAB_ALIAS]).forEach(field => {
    let fieldAliases = normUiSchema[UI_TAB_ALIAS][field];
    if (!Array.isArray(fieldAliases)) {
      normUiSchema[UI_TAB_ALIAS][field] = [fieldAliases];
    }
  });
  return normUiSchema;
}

function normalizeSchema(schema) {
  let normSchema = deepcopy(schema);
  if (!normSchema.required) {
    normSchema.required = [];
  }
  return normSchema;
}

export function splitInLayers(schema, uiSchema = {}, tabData) {
  return doSplitInLayers(
    normalizeSchema(schema),
    normalizeUiSchema(uiSchema),
    tabData
  );
}
