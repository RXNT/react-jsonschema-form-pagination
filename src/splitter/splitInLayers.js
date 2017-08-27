import {
  GENERIC_TAB,
  listLayers,
  normalizeUiSchema,
  normalizeSchema,
  isEmptySchema,
} from "../utils";
import extractUiSchemaForLayer from "./extractUiSchemaForLayer";
import extractSchemaForLayer from "./extractSchemaForLayer";
import extractTabsForLayer from "./extractTabsForLayer";
import Layer from "./Layer";

function doSplitInLayers(origSchema, origUiSchema, tabData) {
  let layerTabs = listLayers(origSchema, origUiSchema);

  let layers = layerTabs
    .filter(layer => layer !== GENERIC_TAB)
    .reduce((tabs, layer) => {
      let schema = extractSchemaForLayer(layer, origSchema, origUiSchema);
      let uiSchema = extractUiSchemaForLayer(layer, schema, origUiSchema);
      if (!isEmptySchema(schema)) {
        tabs[layer] = doSplitInLayers(schema, uiSchema, tabData);
      }
      return tabs;
    }, {});

  let schema = extractSchemaForLayer(GENERIC_TAB, origSchema, origUiSchema);
  let uiSchema = extractUiSchemaForLayer(GENERIC_TAB, schema, origUiSchema);
  let tabs = extractTabsForLayer(layers, origUiSchema, tabData);

  let conf = { schema, uiSchema, tabs };

  return new Layer(conf, layers);
}

export default function splitInLayers(schema, uiSchema, tabData = []) {
  return doSplitInLayers(
    normalizeSchema(schema),
    normalizeUiSchema(uiSchema),
    tabData
  );
}
