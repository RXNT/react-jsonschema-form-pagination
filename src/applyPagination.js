import React, { Component } from "react";
import PropTypes from "prop-types";
import deepequal from "deep-equal";
import formWithTabs from "./FormWithTabs";
import { isDevelopment } from "./utils";
import splitInLayers from "./splitter/splitInLayers";
import Tabs from "./Tabs";

export default function applyPagination(FormComponent, TabComponent = Tabs) {
  const FormWithTabs = formWithTabs(FormComponent, TabComponent);

  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { formData, tabData, schema, uiSchema } = this.props;

      this.layers = splitInLayers(schema, uiSchema, tabData);
      let activeTabs = this.layers.updateActiveTabs([], 0);
      this.state = { formData, activeTabs };
    }

    sameData = formData => {
      return (
        deepequal(this.props.formData, formData) ||
        deepequal(this.formData, formData)
      );
    };

    sameLayers = nextProps => {
      const toComparable = ({ tabData, schema, uiSchema }) => {
        return { tabData, schema, uiSchema };
      };
      return deepequal(toComparable(nextProps), toComparable(this.props));
    };

    componentWillReceiveProps(nextProps) {
      if (!this.sameLayers(nextProps)) {
        let { schema, uiSchema, tabData } = nextProps;
        this.layers = splitInLayers(schema, uiSchema, tabData);
      }
      if (!this.sameData(nextProps.formData)) {
        this.formData = nextProps.formData;
        this.setState({ formData: nextProps.formData });
      }
    }

    handleTabChange = index => tabID => {
      let activeTabs = this.state.activeTabs.slice(0, index + 1);
      activeTabs[index] = tabID;
      this.layers.updateActiveTabs(activeTabs);
      if (this.props.onTabChange) {
        this.props.onTabChange(activeTabs, this.state.activeTabs);
      }
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
      let subForms = this.layers.toSubForms(this.state.activeTabs);
      return (
        <div>
          {subForms.map((conf, i) => {
            let allConf = Object.assign({}, this.props, conf, {
              formData: this.formData,
            });
            return (
              <FormWithTabs
                key={i}
                {...allConf}
                onChange={this.handleOnChange}
                onTabChange={this.handleTabChange(i)}
              />
            );
          })}
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
