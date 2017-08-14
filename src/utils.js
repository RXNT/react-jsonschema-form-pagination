import deepcopy from "deepcopy";

export const GENERIC_TAB = "default";
export const UI_TAB_ID = "ui:tabID";
export const UI_TAB_ALIAS = "ui:tabAlias";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

class Layer {
  constructor(tabs, conf) {
    this.tabs = tabs;
    this.conf = conf;
    this.defaultTab = Object.assign({}, { tabs }, conf[GENERIC_TAB]);
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

function findLayer(field, uiSchema) {
  return uiSchema && uiSchema[field] && uiSchema[field][UI_TAB_ID]
    ? uiSchema[field][UI_TAB_ID][0]
    : GENERIC_TAB;
}

export function listLayers(schema, uiSchema = {}) {
  let schemaLayers = Object.keys(schema.properties).map(field =>
    findLayer(field, uiSchema)
  );

  let uiSchemaLayers = Object.keys(uiSchema).map(uiField =>
    findLayer(uiField, uiSchema)
  );

  let allLayers = schemaLayers.concat(uiSchemaLayers);
  return Array.from(new Set(allLayers));
}

export function extractUiSchemaForLayer(layer, origUiSchema) {
  function removeNextLayer(uiSchema) {
    Object.keys(uiSchema).forEach(field => {
      let uiTab = uiSchema[field][UI_TAB_ID];
      if (uiTab && uiTab.length > 1) {
        uiTab.shift();
      } else {
        delete uiSchema[field][UI_TAB_ID];
      }
    });
  }

  function replaceAliases(layer, uiSchema) {
    function replaceUiFieldWithAlias(field, alias, uiSchema) {
      uiSchema[field] = uiSchema[alias];
      delete uiSchema[alias];
    }

    Object.keys(uiSchema[UI_TAB_ALIAS]).forEach(field => {
      let aliases = uiSchema[UI_TAB_ALIAS][field];

      let aliasesInLayer = aliases.filter(
        alias => findLayer(alias, uiSchema) === layer
      );
      aliasesInLayer.forEach(alias => {
        replaceUiFieldWithAlias(field, alias, uiSchema);
      });
    });
    uiSchema[UI_TAB_ALIAS] = {};
  }

  let uiSchema = deepcopy(origUiSchema);
  replaceAliases(layer, uiSchema);
  removeNextLayer(uiSchema);
  return uiSchema;
}

export function extractSchemaForLayer(layer, origSchema, origUiSchema) {
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

  function copyField(schema, field, origSchema) {
    if (origSchema.required.includes(field)) {
      schema.required.push(field);
    }
    schema.properties[field] = origSchema.properties[field];
  }

  let schema = Object.assign({}, deepcopy(origSchema), {
    required: [],
    properties: {},
  });

  let layerFields = Object.keys(origSchema.properties).filter(field =>
    isFieldPartOfLayer(field, origUiSchema, layer)
  );

  layerFields.forEach(field => copyField(schema, field, origSchema));
  return schema;
}

function doSplitInLayers(origSchema, origUiSchema, tabData) {
  let layers = listLayers(origSchema, origUiSchema);

  let conf = layers.reduce((conf, layer) => {
    let schema = extractSchemaForLayer(layer, origSchema, origUiSchema);
    let uiSchema = extractUiSchemaForLayer(layer, origUiSchema);
    if (layer === GENERIC_TAB) {
      conf[layer] = { schema, uiSchema };
    } else {
      conf[layer] = doSplitInLayers(schema, uiSchema, tabData);
    }
    return conf;
  }, {});

  let tabs = layers.map(layer => {
    let tab = tabData.find(({ tabID }) => tabID === layer);
    return tab ? tab : { tabID: layer, name: layer };
  });

  return new Layer(tabs, conf);
}

export function normalizeUiSchema(uiSchema) {
  function normalizeTabs(uiSchema) {
    Object.keys(uiSchema).forEach(field => {
      if (
        uiSchema[field] &&
        uiSchema[field][UI_TAB_ID] &&
        !Array.isArray(uiSchema[field][UI_TAB_ID])
      ) {
        uiSchema[field][UI_TAB_ID] = [uiSchema[field][UI_TAB_ID]];
      }
    });
  }

  function normalizeAliases(uiSchema) {
    if (!uiSchema[UI_TAB_ALIAS]) {
      uiSchema[UI_TAB_ALIAS] = {};
    }
    Object.keys(uiSchema[UI_TAB_ALIAS]).forEach(field => {
      let fieldAliases = uiSchema[UI_TAB_ALIAS][field];
      if (!Array.isArray(fieldAliases)) {
        uiSchema[UI_TAB_ALIAS][field] = [fieldAliases];
      }
    });
  }

  let normUiSchema = deepcopy(uiSchema);
  normalizeTabs(normUiSchema);
  normalizeAliases(normUiSchema);
  return normUiSchema;
}

export function normalizeSchema(schema) {
  function normalizeRequired(schema) {
    if (!schema.required) {
      schema.required = [];
    }
  }

  let normSchema = deepcopy(schema);
  normalizeRequired(normSchema);
  return normSchema;
}

export function splitInLayers(schema, uiSchema = {}, tabData) {
  return doSplitInLayers(
    normalizeSchema(schema),
    normalizeUiSchema(uiSchema),
    tabData
  );
}
