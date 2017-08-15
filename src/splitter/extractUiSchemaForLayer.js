import deepcopy from "deepcopy";
import { UI_TAB_ID, UI_TAB_ALIAS, findLayer } from "../utils";

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

function findFieldAliasesInLayer(layer, uiSchema) {
  return Object.keys(uiSchema[UI_TAB_ALIAS]).reduce((agg, field) => {
    let aliases = uiSchema[UI_TAB_ALIAS][field].filter(
      alias => findLayer(alias, uiSchema) === layer
    );

    if (aliases.length == 1) {
      agg.push({ field, alias: aliases[0] });
    } else if (aliases.length !== 0) {
      throw new ReferenceError(
        "More than one alias for the same layer not supported!!!"
      );
    }

    return agg;
  }, []);
}

function replaceAliases(layer, uiSchema) {
  let layerAliases = findFieldAliasesInLayer(layer, uiSchema);
  layerAliases.forEach(({ field, alias }) => {
    uiSchema[field] = uiSchema[alias];
  });
}

export default function extractUiSchemaForLayer(layer, origUiSchema) {
  let uiSchema = deepcopy(origUiSchema);
  replaceAliases(layer, uiSchema);
  removeNextLayer(uiSchema);
  return uiSchema;
}
