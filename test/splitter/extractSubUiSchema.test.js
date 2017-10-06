import extractSubUiSchema from "../../src/splitter/extractSubUiSchema";
import { UI_ORDER } from "../../src/utils";
import { withNav } from "../utils";

test("extract default uiSchema", () => {
  let uiSchema = {
    firstName: {},
    lastName: {},
    navConf: {
      aliases: {},
    },
  };
  expect(extractSubUiSchema(["firstName", "lastName"], uiSchema, [])).toEqual({
    firstName: {},
    lastName: {},
  });
});

test("extract with aliases", () => {
  let uiSchema = {
    firstName: {
      classNames: "col-md-5",
    },
    firstNameAlias: {
      classNames: "col-md-10",
    },
  };
  expect(extractSubUiSchema(["firstName"], uiSchema, {})).toEqual({
    firstName: { classNames: "col-md-5" },
  });

  expect(
    extractSubUiSchema(["firstName"], uiSchema, { firstName: "firstNameAlias" })
  ).toEqual({ firstName: { classNames: "col-md-10" } });
});

test("keep ordering", () => {
  let uiSchema = {
    firstName: withNav("1"),
    lastName: withNav("2"),
    nickName: withNav("1"),
    [UI_ORDER]: ["firstName", "nickName", "lastName"],
  };

  let expectedUiSchema = {
    firstName: withNav("1"),
    nickName: withNav("1"),
    [UI_ORDER]: ["firstName", "nickName"],
  };

  expect(extractSubUiSchema(["firstName", "nickName"], uiSchema, [])).toEqual(
    expectedUiSchema
  );
});
