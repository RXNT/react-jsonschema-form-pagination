import React from "react";
import Form from "react-jsonschema-form";
import applyPagination from "../../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";

configure({ adapter: new Adapter() });

const schema = {
  type: "object",
  title: "Encounter",
  required: [],
  properties: {
    encounter: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    age: { type: "integer" },
    nickName: { type: "string" },
    bio: { type: "string" },
    password: { type: "string" },
    telephone: { type: "string" },
  },
};

const uiSchema = {
  "ui:order": [
    "encounter",
    "firstName",
    "lastName",
    "age",
    "nickName",
    "bio",
    "password",
    "telephone",
  ],
  firstNameAlias: {
    nav: ["0", "lastName"],
  },
  lastName: {
    nav: ["0", "lastName"],
  },
  age: {
    nav: ["0", "firstName", "age"],
  },
  nickName: {
    nav: ["0", "firstName", "nickName"],
  },
  bio: {
    nav: "1",
  },
  password: {
    nav: ["2"],
  },
  telephone: {
    nav: "2",
  },
  navConf: {
    aliases: {
      firstName: "firstNameAlias",
    },
  },
};

test("Re render on activeNav property change", () => {
  let props = { schema, uiSchema, activeNav: ["1"] };
  let ResForm = applyPagination(Form);
  const renderSpy = sinon.spy(ResForm.prototype, "render");
  const wrapper = shallow(<ResForm {...props} />);

  expect(renderSpy.calledOnce).toEqual(true);

  wrapper.setProps({ schema, uiSchema, activeNav: ["1"] });
  expect(renderSpy.calledOnce).toEqual(true);

  wrapper.setProps({ schema, uiSchema, activeNav: ["2"] });
  expect(renderSpy.calledTwice).toEqual(true);
});
