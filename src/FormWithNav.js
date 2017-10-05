import React, { Component } from "react";
import PropTypes from "prop-types";
import { isDevelopment, isEmptySchema } from "./utils";
import Navs from "./Navs";

const formWithTabs = (FormComponent, NavComponent = Navs) => {
  class FormWithTabs extends Component {
    handleNavChange = nav => {
      let { navs: { links } } = this.props.confs[0];
      let isRelNav = links.some(({ tabID }) => tabID === nav);
      if (isRelNav) {
        this.props.onNavChange([nav]);
      } else {
        let active = links.find(({ tabID, isActive }) => isActive);
        if (active !== undefined) {
          this.props.onNavChange([active.tabID].concat(nav));
        } else {
          this.props.onNavChange(nav);
        }
      }
    };

    renderNavs = () => {
      let { navs } = this.props.confs[0];
      return <NavComponent navs={navs} onNavChange={this.handleNavChange} />;
    };

    renderForm = () => {
      let conf = this.props.confs[0];
      if (!isEmptySchema(conf.schema)) {
        let formConf = Object.assign({}, conf, {
          formData: this.props.formData,
        });
        return (
          <FormComponent
            {...formConf}
            onChange={this.props.onChange}
            onSubmit={this.props.onSubmit}>
            <div />
          </FormComponent>
        );
      } else {
        return <div />;
      }
    };

    renderNext = () => {
      let { confs } = this.props;
      if (confs.length > 1) {
        let subConfs = confs.slice(1, confs.length);
        let nextRecProps = Object.assign({}, this.props, {
          confs: subConfs,
          onNavChange: this.handleNavChange,
        });
        return <FormWithTabs {...nextRecProps} />;
      } else {
        return <div />;
      }
    };

    render() {
      let { navs: { orientation = "horizontal" } } = this.props.confs[0];

      switch (orientation) {
        case "vertical": {
          return (
            <div>
              <div className="col-md-3">{this.renderNavs()}</div>
              <div className="col-md-9">
                {this.renderForm()}
                {this.renderNext()}
              </div>
            </div>
          );
        }
        default: {
          return (
            <div>
              <fieldset>
                <div className="form-group col-md-12">{this.renderNavs()}</div>
              </fieldset>
              {this.renderForm()}
              {this.renderNext()}
            </div>
          );
        }
      }
    }
  }

  if (isDevelopment()) {
    FormWithTabs.propTypes = {
      navs: PropTypes.shape({
        links: PropTypes.array,
      }),
    };
  }

  return FormWithTabs;
};

export default formWithTabs;
