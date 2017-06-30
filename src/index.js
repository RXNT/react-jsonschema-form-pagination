import React, { Component } from "react";
import PropTypes from "prop-types";
import Tabs from "./components/tabs";
import { isDevelopment } from "./utils";

export default function applyPagination(FormComponent) {
  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { schema, uiSchema, formData, tabData } = this.props;
      this.state = { schema, uiSchema, formData, tabData };
      this.state.activeTab = tabData[0].name;

      this.calculateTab = this.calculateTab.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      let { schema, formData, uiSchema, tabData, activeTab } = nextProps;
      this.setState({ schema, formData, uiSchema, tabData, activeTab });
    }

    calculateTab(tab) {
      this.setState(prevState => ({
        activeTab: tab.name,
      }));
    }

    render() {
      let configs = Object.assign({}, this.props);

      delete configs.schema;
      delete configs.formData;
      delete configs.onChange;
      delete configs.uiSchema;

      return (
        <div>
          <Tabs
            tabData={this.state.tabData}
            activeTab={this.state.activeTab}
            changeTab={this.calculateTab}
          />
          <FormComponent
            {...configs}
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
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
