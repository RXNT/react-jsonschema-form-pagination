import React, { Component } from "react";
import PropTypes from "prop-types";
import Tabs from "./components/tabs";
import { isDevelopment } from "./utils";
import deepcopy from "deepcopy";

export default function applyPagination(FormComponent) {
  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { schema, uiSchema, tabData } = this.props;
      this.state = { schema, uiSchema, tabData };
      this.state.activeTabID = tabData[0].tabID;

      this.calculateTab = this.calculateTab.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      let { schema, uiSchema, tabData, activeTabID } = nextProps;
      this.setState({ schema, uiSchema, tabData, activeTabID });
    }

    calculateTab(tab) {
      console.log("setting activeTabID to: " + tab.tabID);

      this.setState(prevState => ({
        activeTabID: tab.tabID,
      }));
    }

    calculateTabSchema(activeTabID, schema, uiSchema) {
      let tabSchema = schema;
      let tabFields = [];

      for (let field in schema.properties) {
        if (uiSchema[field] && uiSchema[field]["ui:tabID"] === activeTabID) {
          tabFields.push(schema.properties[field]);
        }
      }

      tabSchema.properties = tabFields;
      return tabSchema;
    }

    stripTabData(uiSchema) {
      let updatedUISchema = {};

      for (let field in uiSchema) {
        let modFieldContents = uiSchema[field];
        delete modFieldContents["ui:tabID"];

        updatedUISchema[field] = modFieldContents;
      }

      return updatedUISchema;
    }

    render() {
      let configs = Object.assign({}, this.props);

      delete configs.schema;
      delete configs.uiSchema;

      let tabSchema = this.calculateTabSchema(
        deepcopy(this.state.activeTabID),
        deepcopy(this.state.schema),
        deepcopy(this.state.uiSchema)
      );
      let filteredUISchema = this.stripTabData(deepcopy(this.state.uiSchema));

      console.log("tabSchema: " + JSON.stringify(tabSchema));
      console.log(
        "original schema (in state) is: " + JSON.stringify(this.state.schema)
      );
      console.log("updatedUISchema: " + JSON.stringify(filteredUISchema));

      return (
        <div>
          <Tabs
            tabData={this.state.tabData}
            activeTab={this.state.activeTabID}
            changeTab={this.calculateTab}
          />
          <FormComponent
            {...configs}
            schema={tabSchema}
            uiSchema={filteredUISchema}
          />
        </div>
      );
    }
  }

  if (isDevelopment()) {
    FormWithPagination.propTypes = {
      tabData: PropTypes.array.isRequired,
    };
  }

  return FormWithPagination;
}
