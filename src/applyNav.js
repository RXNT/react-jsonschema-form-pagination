import React, { Component } from "react";
import PropTypes from "prop-types";
import deepequal from "deep-equal";
import formWithNav from "./FormWithNav";
import { isDevelopment } from "./utils";
import Navs from "./Navs";
import splitter from "./splitter";

export default function applyPagination(FormComponent, NavComponent = Navs) {
  const FormWithNavs = formWithNav(FormComponent, NavComponent);

  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { formData, tabData, schema, uiSchema } = this.props;

      this.formData = formData ? formData : {};

      this.navTree = splitter(schema, uiSchema, tabData);
      let activeNav = [];
      this.navTree.updateActiveNav(activeNav, 0);
      this.state = { formData, activeNav };
    }

    sameData = formData => {
      return (
        deepequal(this.props.formData, formData) ||
        deepequal(this.formData, formData)
      );
    };

    sameLayers = nextProps => {
      const toComparable = ({ tabData, schema, uiSchema }) => {
        return { navData: tabData, schema, uiSchema };
      };
      return deepequal(toComparable(nextProps), toComparable(this.props));
    };

    componentWillReceiveProps(nextProps) {
      if (!this.sameLayers(nextProps)) {
        let { schema, uiSchema, tabData } = nextProps;
        this.navTree = splitter(schema, uiSchema, tabData);
      }
      if (!this.sameData(nextProps.formData)) {
        this.formData = nextProps.formData;
        this.setState({ formData: nextProps.formData });
      }
    }

    handleTabChange = index => tabID => {
      let activeNav = this.state.activeNav.slice(0, index + 1);
      activeNav[index] = tabID;
      this.navTree.updateActiveNav(activeNav);
      if (this.props.onTabChange) {
        this.props.onTabChange(activeNav, this.state.activeNav);
      }
      this.setState({ activeNav });
    };

    handleOnChange = state => {
      this.formData = state.formData;
      this.setState({ formData: state.formData });
      if (this.props.onChange) {
        this.props.onChange(state);
      }
    };

    shouldComponentUpdate(nextProps, nextState) {
      let sameActive = deepequal(nextState.activeNav, this.state.activeNav);
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
      let subForms = this.navTree.toSubForms(this.state.activeNav);
      let formData = this.formData;
      return (
        <div>
          {subForms.map((conf, i) => {
            let allConf = Object.assign({}, this.props, conf, { formData });
            return (
              <FormWithNavs
                key={i}
                {...allConf}
                onChange={this.handleOnChange}
                onTabChange={this.handleTabChange(i)}
              />
            );
          })}
          {this.props.children}
        </div>
      );
    }
  }

  if (isDevelopment()) {
    FormWithPagination.propTypes = {
      schema: PropTypes.shape({
        type: function(props, propName, componentName) {
          if (props[propName] !== "object") {
            return new Error(
              `Only "object" schemas supported by pagination for ${componentName}.`
            );
          }
        },
      }),
      tabData: PropTypes.array,
    };
  }

  return FormWithPagination;
}
