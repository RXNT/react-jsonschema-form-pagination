import { withNav } from "./utils";
import applyPagination from "../src";
import React from "react";
import Form from "react-jsonschema-form";
import Adapter from "enzyme-adapter-react-16";
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
  const onNavChange = sinon.spy();
  let ResForm = applyPagination(Form);
  const component = mount(
    <ResForm schema={schema} uiSchema={uiSchema} onNavChange={onNavChange} />
  );

  component
    .find("a")
    .first()
    .simulate("click");
  expect(onNavChange.callCount).toEqual(0);
});

test("onNavChange triggered on new selection", () => {
  const onNavChange = sinon.spy();
  let ResForm = applyPagination(Form);
  const component = mount(
    <ResForm schema={schema} uiSchema={uiSchema} onNavChange={onNavChange} />
  );

  component
    .find("a")
    .last()
    .simulate("click");
  expect(onNavChange.callCount).toEqual(1);
  expect(onNavChange.getCall(0).args[0]).toEqual(["nick"]);
  expect(onNavChange.getCall(0).args[1]).toEqual(["first"]);
});
