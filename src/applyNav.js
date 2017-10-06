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

      let { formData = {}, tabData, schema, uiSchema } = this.props;

      let activeNav = [];
      this.navTree = splitter(schema, uiSchema, tabData);
      this.navTree.updateActiveNav(activeNav, 0);

      this.formData = formData;
      this.state = { activeNav };
    }

    diffProps({ tabData, schema, uiSchema }) {
      return !deepequal(
        { tabData, schema, uiSchema },
        {
          tabData: this.props.tabData,
          schema: this.props.schema,
          uiSchema: this.props.uiSchema,
        }
      );
    }

    componentWillReceiveProps(nextProps) {
      let diffNav = this.diffProps(nextProps);
      if (diffNav) {
        let { tabData, schema, uiSchema } = nextProps;
        this.navTree = splitter(schema, uiSchema, tabData);
      }
    }

    handleNavChange = activeNav => {
      let oldNav = this.state.activeNav;
      this.navTree.updateActiveNav(activeNav);
      this.setState({ activeNav });
      if (this.props.onTabChange) {
        this.props.onTabChange(activeNav, oldNav);
      }
    };

    handleOnChange = state => {
      this.formData = state.formData;

      if (this.props.onChange) {
        this.props.onChange(state);
      }
    };

    shouldComponentUpdate(nextProps, nextState) {
      let diffActiveNav = !deepequal(nextState.activeNav, this.state.activeNav);
      if (diffActiveNav) {
        return true;
      }
      let diffProps = this.diffProps(nextProps);
      if (diffProps) {
        return true;
      }
      return !deepequal(this.formData, nextProps.formData);
    }

    render() {
      let confs = this.navTree.toSubForms(this.state.activeNav);
      let formConfs = Object.assign({}, this.props, {
        formData: this.formData,
        confs,
        onChange: this.handleOnChange,
        onNavChange: this.handleNavChange,
      });
      return (
        <div>
          <FormWithNavs {...formConfs}>{this.props.children}</FormWithNavs>
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
