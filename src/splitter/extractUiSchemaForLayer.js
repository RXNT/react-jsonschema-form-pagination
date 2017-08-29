import deepcopy from "deepcopy";
import {
  UI_TAB_ID,
  UI_TAB_ALIAS,
  UI_ORDER,
  GENERIC_TAB,
  findLayer,
  toError,
} from "../utils";

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
      toError(`${field} has too many aliases ${aliases} for the ${layer}`);
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

function keepOrdering(layer, schema, uiSchema) {
  if (layer === GENERIC_TAB) {
    let layerFields = Object.keys(schema.properties);
    uiSchema[UI_ORDER] = uiSchema[UI_ORDER].filter(field =>
      layerFields.includes(field)
    );
    if (uiSchema[UI_ORDER].length === 0) {
      delete uiSchema[UI_ORDER];
    }
  }
}

export default function extractUiSchemaForLayer(layer, schema, origUiSchema) {
  let uiSchema = deepcopy(origUiSchema);
  replaceAliases(layer, uiSchema);
  removeNextLayer(uiSchema);
  keepOrdering(layer, schema, uiSchema);
  return uiSchema;
}
