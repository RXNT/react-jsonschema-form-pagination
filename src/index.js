import React, { Component } from "react";
import PropTypes from "prop-types";
import Tabs from "./components/tabs";
import { isDevelopment } from "./utils";
import deepcopy from "deepcopy";

export default function applyPagination(FormComponent) {
  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { formData, tabData } = this.props;
      this.state = { formData, activeTabID: tabData[0].tabID };
    }

    componentWillReceiveProps(nextProps) {
      let { schema, uiSchema, tabData, activeTabID } = nextProps;
      this.setState({ schema, uiSchema, tabData, activeTabID });
    }

    handleTabChange = tab => {
      this.setState({ activeTabID: tab.tabID });
    };

    handleOnChange = state => {
      this.setState({ formData: state.formData });
      if (this.props.onChange) {
        this.props.onChange(state);
      }
    };

    calculateTabSchema(tabID, schema, uiSchema) {
      let tabSchema = deepcopy(schema);
      if (!tabSchema.required) {
        tabSchema.required = [];
      }
      Object.keys(tabSchema.properties)
        .filter(field => uiSchema[field]["ui:tabID"] !== tabID)
        .forEach(field => {
          if (tabSchema.required.includes(field)) {
            tabSchema.required = tabSchema.required.filter(
              reqField => reqField !== field
            );
          }
          delete tabSchema.properties[field];
        });
      return tabSchema;
    }

    render() {
      let { schema, uiSchema, tabData } = this.props;
      let { activeTabID, formData } = this.state;
      let tabSchema = this.calculateTabSchema(activeTabID, schema, uiSchema);

      let configs = Object.assign(
        {},
        this.props,
        { schema: tabSchema, formData },
        { onChange: this.handleOnChange }
      );

      return (
        <div>
          <Tabs
            tabData={tabData}
            activeTab={activeTabID}
            changeTab={this.handleTabChange}
          />
          <FormComponent {...configs} />
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
