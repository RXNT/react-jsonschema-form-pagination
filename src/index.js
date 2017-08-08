import React, { Component } from "react";
import PropTypes from "prop-types";
import deepequal from "deep-equal";
import formWithTabs from "./FormWithTabs";
import { divideInTabs, isDevelopment } from "./utils";
import { splitInLayers } from "./tabSplitter";

export default function applyPagination(FormComponent) {
  const FormWithTabs = formWithTabs(FormComponent);

  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { formData, tabData, schema, uiSchema } = this.props;

      let activeTabID = tabData[0].tabID;
      this.idToSchema = divideInTabs(tabData, schema, uiSchema);

      this.layers = splitInLayers(schema, uiSchema, tabData);
      this.state = {
        formData,
        activeTabs: ["default"],
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

    handleTabChange = index => ({ tabID }) => {
      let activeTabs = this.state.activeTabs.slice(0, index + 1);
      activeTabs[index] = tabID;
      this.setState({ activeTabs });
    };

    handleOnChange = state => {
      this.formData = state.formData;
      this.setState({ formData: state.formData });
      if (this.props.onChange) {
        this.props.onChange(state);
      }
    };

    shouldComponentUpdate(nextProps, nextState) {
      let sameActive = deepequal(nextState.activeTabs, this.state.activeTabs);
      if (!sameActive) {
        return true;
      }
      let sameProps = deepequal(
        Object.assign({}, this.props, { formData: {} }),
        Object.assign({}, nextProps, { formData: {} })
      );
      if (!sameProps) {
        return true;
      }
      let sameState = deepequal(
        Object.assign({}, this.state, { formData: this.formData }),
        nextState
      );
      if (!sameState) {
        return true;
      }
      let sameData = this.sameData(nextProps.formData);
      return !sameProps || !sameState || !sameData;
    }

    render() {
      let subForms = this.layers.toArray(this.state.activeTabs);
      return (
        <div>
          {subForms.map((conf, i) =>
            <FormWithTabs
              key={i}
              {...conf}
              onTabChange={this.handleTabChange(i)}
            />
          )}
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
