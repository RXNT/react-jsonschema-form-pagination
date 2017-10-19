import React, { Component } from "react";
import PropTypes from "prop-types";
import deepequal from "deep-equal";
import formWithHiddenField from "./render";
import Navs from "./render/Navs";
import splitter from "./splitter";
import { toArray } from "./utils";
import errorHandler from "./errorHandler";

export default function applyPagination(FormComponent, NavComponent = Navs) {
  const FormWithNavs = formWithHiddenField(FormComponent, NavComponent);

  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      let { formData = {}, schema, uiSchema, activeNav } = this.props;

      activeNav = activeNav ? toArray(activeNav) : [];
      this.navTree = splitter(schema, uiSchema);
      this.navTree.updateActiveNav(activeNav, 0);

      this.formData = formData;
      this.state = { activeNav };
    }

    diffProps({ schema, uiSchema }) {
      return !deepequal(
        { schema, uiSchema },
        {
          schema: this.props.schema,
          uiSchema: this.props.uiSchema,
        }
      );
    }

    componentWillReceiveProps(nextProps) {
      let diffNav = this.diffProps(nextProps);
      if (diffNav) {
        let { schema, uiSchema } = nextProps;
        this.navTree = splitter(schema, uiSchema);
      }
    }

    handleNavChange = activeNav => {
      let oldNav = this.state.activeNav;
      if (
        oldNav.length === activeNav.length &&
        oldNav.every((el, i) => el === activeNav[i])
      ) {
        return;
      }
      this.navTree.updateActiveNav(activeNav);
      this.setState({ activeNav });
      if (this.props.onNavChange) {
        this.props.onNavChange(activeNav, oldNav);
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
      let subForms = this.navTree.toSubForms(this.state.activeNav);

      let formProps = Object.assign({}, this.props, {
        subForms,
        transformErrors: errorHandler(this.navTree, this.props.transformErrors),
        formData: this.formData,
        onChange: this.handleOnChange,
        onNavChange: this.handleNavChange,
      });
      return <FormWithNavs {...formProps}>{this.props.children}</FormWithNavs>;
    }
  }

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
    onNavChange: PropTypes.func,
    uiSchema: PropTypes.shape({
      navConf: PropTypes.shape({
        aliases: PropTypes.object,
        navs: PropTypes.array,
        order: PropTypes.array,
      }),
    }),
  };

  return FormWithPagination;
}
