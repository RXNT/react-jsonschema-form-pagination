import {
  GENERIC_TAB,
  listLayers,
  normalizeUiSchema,
  normalizeSchema,
} from "../utils";
import extractUiSchemaForLayer from "./extractUiSchemaForLayer";
import extractSchemaForLayer from "./extractSchemaForLayer";
import Layer from "./Layer";

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

export default function splitInLayers(schema, uiSchema = {}, tabData) {
  return doSplitInLayers(
    normalizeSchema(schema),
    normalizeUiSchema(uiSchema),
    tabData
  );
}
