import React, { Component } from "react";
import PropTypes from "prop-types";
import deepequal from "deep-equal";
import formWithTabs from "./FormWithTabs";
import { divideInTabs, GENERIC_TAB, isDevelopment } from "./utils";

export default function applyPagination(FormComponent) {
  const FormWithTabs = formWithTabs(FormComponent);

  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { formData, tabData, schema, uiSchema } = this.props;

      let activeTabID = tabData[0].tabID;
      this.idToSchema = divideInTabs(tabData, schema, uiSchema);
      this.state = {
        formData,
        activeTabID,
        schema: this.idToSchema[activeTabID],
      };
    }

    sameData = formData => {
      return (
        deepequal(this.props.formData, formData) ||
        deepequal(this.formData, formData)
      );
    };

    componentWillReceiveProps({ tabData, schema, uiSchema, formData }) {
      if (
        !deepequal(
          { tabData, schema, uiSchema },
          {
            tabData: this.props.tabData,
            schema: this.props.schema,
            uiSchema: this.props.uiSchema,
          }
        )
      ) {
        this.idToSchema = divideInTabs(tabData, schema, uiSchema);
        this.setState({ schema: this.idToSchema[this.state.activeTabID] });
      }
      if (!this.sameData(formData)) {
        this.formData = formData;
        this.setState({ formData });
      }
    }

    handleTabChange = ({ tabID }) => {
      this.setState({ activeTabID: tabID, schema: this.idToSchema[tabID] });
    };

    handleOnChange = state => {
      this.formData = state.formData;
      this.setState({ formData: state.formData });
      if (this.props.onChange) {
        this.props.onChange(state);
      }
    };

    shouldComponentUpdate(nextProps, nextState) {
      let sameProps = deepequal(
        Object.assign({}, this.props, { formData: {} }),
        Object.assign({}, nextProps, { formData: {} })
      );
      let sameState = deepequal(
        Object.assign({}, this.state, { formData: this.formData }),
        nextState
      );
      let sameData = this.sameData(nextProps.formData);
      return !sameProps || !sameState || !sameData;
    }

    render() {
      let { tabData } = this.props;
      let { formData, schema, activeTabID } = this.state;

      let configs = Object.assign({}, this.props, {
        schema,
        formData,
        activeTabID,
        onChange: this.handleOnChange,
      });

      let genericConfigs = Object.assign({}, this.props, {
        schema: this.idToSchema[GENERIC_TAB],
        formData,
        onChange: this.handleOnChange,
      });

      delete genericConfigs.tabData;

      return (
        <div>
          <FormWithTabs {...genericConfigs} />
          <FormWithTabs
            tabData={tabData}
            {...configs}
            onTabChange={this.handleTabChange}
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
