import React, { Component } from "react";
import PropTypes from "prop-types";
import formWithHiddenField from "./render";
import Navs from "./render/Navs";
import splitter from "./splitter";
import { toArray, deepEquals } from "./utils";
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

      this.shouldUpdate = false;
      this.formData = formData;
      this.state = { activeNav };
    }

    navTreeChanged({ schema, uiSchema }) {
      return (
        !deepEquals(schema, this.props.schema) ||
        !deepEquals(uiSchema, this.props.uiSchema)
      );
    }

    componentWillReceiveProps(nextProps) {
      if (this.props === nextProps) {
        return;
      }

      if (this.navTreeChanged(nextProps)) {
        this.navTree = splitter(nextProps.schema, nextProps.uiSchema);
        this.shouldUpdate = true;
      }

      if (
        nextProps.activeNav &&
        !deepEquals(nextProps.activeNav, this.state.activeNav)
      ) {
        this.setState(() => {
          this.shouldUpdate = true;
          return { activeNav: toArray(nextProps.activeNav) };
        });
      }

      if (
        nextProps.formData &&
        !deepEquals(this.formData, nextProps.formData)
      ) {
        this.formData = nextProps.formData;
        this.shouldUpdate = true;
      }
    }

    handleNavChange = activeNav => {
      this.navTree.updateActiveNav(activeNav);

      let oldNav = this.state.activeNav;
      if (deepEquals(oldNav, activeNav)) {
        return;
      } else {
        this.setState(() => {
          this.shouldUpdate = true;
          return { activeNav };
        });
      }

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

    shouldComponentUpdate() {
      if (this.shouldUpdate) {
        this.shouldUpdate = false;
        return true;
      }
      return false;
    }

    render() {
      let uiSchema = this.navTree.toSubForms(
        this.state.activeNav,
        this.handleNavChange
      );

      let formProps = Object.assign({}, this.props, {
        uiSchema,
        transformErrors: errorHandler(this.navTree, this.props.transformErrors),
        formData: this.formData,
        onChange: this.handleOnChange,
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
