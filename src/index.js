import React, { Component } from "react";
import PropTypes from "prop-types";
import Tabs from "./components/tabs";
import deepequal from "deep-equal";
import { isDevelopment, divideInTabs } from "./utils";

export default function applyPagination(FormComponent) {
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
      let sameData =
        deepequal(this.props.formData, nextProps.formData) ||
        deepequal(this.formData, nextProps.formData);
      return !sameProps || !sameState || !sameData;
    }

    render() {
      let { tabData } = this.props;
      let { activeTabID, formData, schema } = this.state;

      let configs = Object.assign({}, this.props, {
        schema,
        formData,
        onChange: this.handleOnChange,
      });

      return (
        <div>
          <Tabs
            tabData={tabData}
            activeTab={activeTabID}
            onTabChange={this.handleTabChange}
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
