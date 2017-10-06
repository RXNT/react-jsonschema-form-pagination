import { withNav } from "./utils";
import applyPagination from "../src";
import React from "react";
import Form from "react-jsonschema-form";
import Adapter from "enzyme-adapter-react-15";
import { mount, configure } from "enzyme";
import sinon from "sinon";

configure({ adapter: new Adapter() });

let schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    nickName: { type: "string" },
  },
};

let uiSchema = {
  firstName: withNav("first"),
  lastName: withNav("last"),
  nickName: withNav("nick"),
  navConf: {
    order: ["first", "last", "nick"],
  },
};

test("onTabChange ignored on clicking selected", () => {
  const onTabChange = sinon.spy();
  let ResForm = applyPagination(Form);
  const component = mount(
    <ResForm schema={schema} uiSchema={uiSchema} onTabChange={onTabChange} />
  );

  component
    .find("a")
    .first()
    .simulate("click");
  expect(onTabChange.callCount).toEqual(0);
});

test("onTabChange triggered on new selection", () => {
  const onTabChange = sinon.spy();
  let ResForm = applyPagination(Form);
  const component = mount(
    <ResForm schema={schema} uiSchema={uiSchema} onTabChange={onTabChange} />
  );

  component
    .find("a")
    .last()
    .simulate("click");
  expect(onTabChange.callCount).toEqual(1);
  expect(onTabChange.getCall(0).args[0]).toEqual(["nick"]);
  expect(onTabChange.getCall(0).args[1]).toEqual(["first"]);
});
