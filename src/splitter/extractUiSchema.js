import { UI_ORDER } from "../utils";

function toHiddenUiSchema({ properties }) {
  return Object.keys(properties).reduce((agg, field) => {
    agg[field] = {
      "ui:widget": "hidden",
      "ui:field": "hidden",
    };
    return agg;
  }, {});
}

function findFirstField(schema, uiSchema) {
  if (uiSchema[UI_ORDER] && uiSchema[UI_ORDER].length > 0) {
    return uiSchema[UI_ORDER][0];
  }
  let naturalOrder =
    schema && schema.properties ? Object.keys(schema.properties) : [];
  if (naturalOrder.length > 0) {
    return naturalOrder[0];
  }
  return undefined;
}

function toNavConf(navs, navPath, onNavChange) {
  if (navs && navs.links.length > 0) {
    return {
      navs,
      onNavChange: nav => {
        let activeNavs =
          navPath.length === 0
            ? [nav]
            : navPath.slice(0, navPath.length - 1).concat([nav]);
        onNavChange(activeNavs);
      },
    };
  } else {
    return undefined;
  }
}

export default function extractUiSchema(
  subForms,
  schema,
  origUiSchema,
  onNavChange
) {
  let hiddenUiSchema = toHiddenUiSchema(schema);
  let uiSchema = subForms.reduce(
    (agg, { schema, uiSchema = {}, navs, navPath }) => {
      let { navConfs = [] } = agg;
      navConfs = navConfs
        .concat([toNavConf(navs, navPath, onNavChange)])
        .filter(nav => nav !== undefined);

      let firstField = findFirstField(schema, uiSchema);
      if (firstField && navConfs.length > 0) {
        let firstFieldUiSchema = {
          navConfs,
          ["ui:field"]: "nav",
          origUiSchema: uiSchema[firstField],
        };
        return Object.assign(agg, uiSchema, {
          [firstField]: firstFieldUiSchema,
          navConfs: [],
        });
      } else {
        return Object.assign(agg, uiSchema, { navConfs });
      }
    },
    hiddenUiSchema
  );
  uiSchema[UI_ORDER] = origUiSchema[UI_ORDER];

  return uiSchema;
}
