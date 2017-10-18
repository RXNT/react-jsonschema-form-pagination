import React, { Component } from "react";
import PropTypes from "prop-types";
import { UI_ORDER } from "../utils";
import Navs from "./Navs";
import HiddenField from "./HiddenField";
import NavField from "./NavField";

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

const formWithTabs = (FormComponent, NavComponent = Navs) => {
  class FormWithTabs extends Component {
    toNavConf = (navs, navPath) => {
      if (navs && navs.links.length > 0) {
        return {
          navs,
          onNavChange: nav => {
            let activeNavs =
              navPath.length === 0
                ? [nav]
                : navPath.slice(0, navPath.length - 1).concat([nav]);
            this.props.onNavChange(activeNavs);
          },
        };
      } else {
        return undefined;
      }
    };

    toUiSchema() {
      let { subForms, schema } = this.props;
      let hiddenUiSchema = toHiddenUiSchema(schema);
      let uiSchema = subForms.reduce(
        (agg, { schema, uiSchema = {}, navs, navPath }) => {
          let { navConfs = [] } = agg;
          navConfs = navConfs
            .concat([this.toNavConf(navs, navPath)])
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
      uiSchema[UI_ORDER] = this.props.uiSchema[UI_ORDER];

      return uiSchema;
    }

    render() {
      let { fields = {} } = this.props;
      let uiSchema = this.toUiSchema();
      let formConf = Object.assign({}, this.props, {
        uiSchema,
        fields: Object.assign({}, fields, {
          hidden: HiddenField,
          nav: NavField(NavComponent),
        }),
      });
      return <FormComponent {...formConf}>{this.props.children}</FormComponent>;
    }
  }

  FormWithTabs.propTypes = {
    navs: PropTypes.shape({
      links: PropTypes.array,
    }),
  };

  return FormWithTabs;
};

export default formWithTabs;
