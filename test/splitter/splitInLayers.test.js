import splitInLayers from "../../src/splitter/splitInLayers";
import { UI_TAB_ID } from "../../src/utils";

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
  firstName: {
    [UI_TAB_ID]: "first",
  },
  age: {
    [UI_TAB_ID]: ["first", "age"],
  },
  phone: {
    [UI_TAB_ID]: ["first", "phone"],
  },
  lastName: {
    [UI_TAB_ID]: "last",
  },
  nickName: {
    [UI_TAB_ID]: "nick",
  },
  other: {
    [UI_TAB_ID]: "nick",
  },
};

test("select active in layer", () => {
  let layers = splitInLayers(schema, uiSchema, [{ tabID: "nick" }]);

  let activeTabs = [];
  layers.updateActiveTabs(activeTabs);
  expect(activeTabs).toEqual(["first", "age"]);
});

test("return subforms", () => {
  let layers = splitInLayers(schema, uiSchema);
  let subForms = layers.toSubForms(["first", "age"]);
  expect(subForms[0]).toEqual({
    activeTab: "first",
    schema: {
      type: "object",
      properties: {},
    },
    uiSchema: {},
    tabs: [{ tabID: "first" }, { tabID: "last" }, { tabID: "nick" }],
  });
  expect(subForms[1]).toEqual({
    activeTab: "age",
    schema: {
      type: "object",
      properties: {
        firstName: { type: "string" },
      },
    },
    uiSchema: {
      firstName: {
        [UI_TAB_ID]: "first",
      },
    },
    tabs: [{ tabID: "age" }, { tabID: "phone" }],
  });
  expect(subForms[2]).toEqual({
    activeTab: "default",
    schema: {
      type: "object",
      properties: {
        age: { type: "string" },
      },
    },
    uiSchema: {
      age: {
        [UI_TAB_ID]: ["first", "age"],
      },
    },
    tabs: [],
  });
});
