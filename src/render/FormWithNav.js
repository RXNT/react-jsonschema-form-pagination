import React, { Component } from "react";
import PropTypes from "prop-types";
import Navs from "./Navs";
import HiddenField from "./HiddenField";
import NavField from "./NavField";

const formWithNav = (FormComponent, NavComponent = Navs) => {
  class FormWithTabs extends Component {
    render() {
      let { fields = {}, uiSchema } = this.props;
      let formConf = Object.assign({}, this.props, {
        uiSchema,
        fields: Object.assign({}, fields, {
          hidden: HiddenField,
          nav: NavField(NavComponent),
        }),
      });
      return <FormComponent {...formConf}>{this.props.children}</FormComponent>;
    }
  }

  FormWithTabs.propTypes = {
    navs: PropTypes.shape({
      links: PropTypes.array,
    }),
  };

  return FormWithTabs;
};

export default formWithNav;
