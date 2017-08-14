import { listLayers, UI_TAB_ID } from "../src/utils";

test("list schema layers", () => {
  let schema = {
    properties: {
      firstName: { type: "string" },
    },
  };
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["firstNameTab"],
    },
  };
  expect(listLayers(schema, uiSchema)).toEqual(["firstNameTab"]);
});

test("list UI schema layers", () => {
  let schema = {
    properties: {},
  };
  let uiSchema = {
    lastNameAlias: {
      [UI_TAB_ID]: ["lastNameTab"],
    },
  };
  expect(listLayers(schema, uiSchema)).toEqual(["lastNameTab"]);
});

test("list all schema layers", () => {
  let schema = {
    properties: {
      firstName: { type: "string" },
    },
  };
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["firstNameTab"],
    },
    lastNameAlias: {
      [UI_TAB_ID]: ["lastNameTab"],
    },
  };
  let layers = listLayers(schema, uiSchema);
  expect(layers).toEqual(["firstNameTab", "lastNameTab"]);
});
