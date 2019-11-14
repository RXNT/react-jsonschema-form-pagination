import React from "react";
import Form from "react-jsonschema-form";
import applyPagination from "../../src";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import { extractTree } from "../../src/splitter/extractTree";
import extractSubUiSchema from "../../src/splitter/extractSubUiSchema";
import { toHiddenUiSchema } from "../../src/splitter/util";

configure({ adapter: new Adapter() });

const schema = {
  type: "object",
  title: "Encounter",
  required: [],
  properties: {
    nested: {
      type: "object",
      properties: {
        general: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
          },
        },
        age: { type: "integer" },
        nickName: { type: "string" },
        bio: { type: "string" },
        password: { type: "string" },
        telephone: { type: "string" },
      },
    },
  },
};

const uiSchema = {
  nested: {
    general: {
      firstName: {
        nav: ["General", "name"],
      },
      lastName: {
        nav: ["General", "name"],
      },
    },
    age: {
      nav: ["General", "additional"],
    },
    nickName: {
      nav: ["General", "name"],
    },
    bio: {
      nav: ["General", "additional"],
    },
    password: {
      nav: ["General", "additional"],
    },
    telephone: {
      nav: ["General", "additional"],
    },
  },
  // navConf: {
  //     aliases: {
  //         firstName: "firstNameAlias",
  //     },
  //     navs: [
  //         { nav: "0", name: "First" },
  //         { nav: "1", name: "Second" },
  //         { nav: "2", name: "Third" },
  //     ],
  // },
};

test("Re render on activeNav property change", () => {
  let props = { schema, uiSchema, activeNav: ["1"] };
  let ResForm = applyPagination(Form);
  const wrapper = shallow(<ResForm {...props} />);
  wrapper.setProps({ formData: { firstName: "A" } });
  const tree = extractTree(schema, uiSchema);

  // let expectedNavs = [
  //     { nav: "0", name: "First" },
  //     { nav: "1", name: "Second" },
  //     { nav: "2", name: "Third" },
  // ];

  //expect(uiSchema.navConf.navs).toEqual(expectedNavs);
  const hiddenUiSchema = toHiddenUiSchema(schema, uiSchema);
  extractSubUiSchema(
    tree["General"]["additional"].default.fields,
    {},
    uiSchema,
    hiddenUiSchema,
    schema
  );
});
