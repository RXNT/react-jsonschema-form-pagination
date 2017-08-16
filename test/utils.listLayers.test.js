import { listLayers, UI_TAB_ALIAS, UI_TAB_ID } from "../src/utils";
import { withTab } from "./utils";

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
  expect(listLayers(schema, uiSchema)).toEqual(["firstNameTab", "default"]);
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
  expect(listLayers(schema, uiSchema)).toEqual(["lastNameTab", "default"]);
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
  expect(layers).toEqual(["firstNameTab", "lastNameTab", "default"]);
});

test("list layers ", () => {
  let schema = {
    properties: {
      firstName: { type: "string" },
      age: { type: "string" },
      phone: { type: "string" },
      lastName: { type: "string" },
      nickName: { type: "string" },
      other: { type: "string" },
    },
  };

  let uiSchema = {
    firstName: withTab("first"),
    age: withTab("last"),
    phone: withTab(["first", "phone"]),
    lastName: withTab("last"),
    nickName: withTab("last"),
    other: withTab("nick"),
    ageAlias: withTab(["first", "other"]),
    phoneAlias: withTab(["first", "other"]),
    nickNameAlias: withTab(["first", "other"]),
    [UI_TAB_ALIAS]: {
      nickName: ["nickNameAlias"],
      age: ["ageAlias"],
      phone: ["phoneAlias"],
    },
  };

  expect(listLayers(schema, uiSchema)).toEqual([
    "first",
    "last",
    "nick",
    "default",
  ]);
});
