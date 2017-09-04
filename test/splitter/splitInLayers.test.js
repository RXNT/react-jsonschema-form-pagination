import splitInLayers from "../../src/splitter/splitInLayers";
import { UI_TAB_ALIAS, UI_TAB_ID, UI_TAB_ORDER } from "../../src/utils";

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

  expect(layers.updateActiveTabs([])).toEqual(["first", "age"]);
});

test("saves selected active", () => {
  let layers = splitInLayers(schema, uiSchema);

  expect(layers.updateActiveTabs(["first"])).toEqual(["first", "age"]);
  // first > phone tab selection
  expect(layers.updateActiveTabs(["first", "phone"])).toEqual([
    "first",
    "phone",
  ]);
  // Change of selection to "last" tab
  expect(layers.updateActiveTabs(["last"])).toEqual(["last"]);
  // Going back to original tab, expecting the "phone" sub tab automatically selected
  expect(layers.updateActiveTabs(["first"])).toEqual(["first", "phone"]);
});

test("return subforms", () => {
  let layers = splitInLayers(schema, uiSchema);
  let subForms = layers.toSubForms(["first", "age"]);
  expect(subForms[0]).toEqual({
    activeTab: "first",
    schema: {
      required: [],
      properties: {},
    },
    uiSchema: {
      firstName: {},
      age: {
        [UI_TAB_ID]: ["age"],
      },
      phone: {
        [UI_TAB_ID]: ["phone"],
      },
      lastName: {},
      nickName: {},
      other: {},
      [UI_TAB_ALIAS]: {},
      [UI_TAB_ORDER]: [],
    },
    tabs: [{ tabID: "first" }, { tabID: "last" }, { tabID: "nick" }],
  });
  expect(subForms[1]).toEqual({
    activeTab: "age",
    schema: {
      required: [],
      properties: {
        firstName: { type: "string" },
      },
    },
    uiSchema: {
      firstName: {},
      age: {},
      phone: {},
      lastName: {},
      nickName: {},
      other: {},
      [UI_TAB_ALIAS]: {},
      [UI_TAB_ORDER]: [],
    },
    tabs: [{ tabID: "age" }, { tabID: "phone" }],
  });
  expect(subForms[2]).toEqual({
    activeTab: "default",
    schema: {
      required: [],
      properties: {
        age: { type: "string" },
      },
    },
    uiSchema: {
      firstName: {},
      age: {},
      phone: {},
      lastName: {},
      nickName: {},
      other: {},
      [UI_TAB_ALIAS]: {},
      [UI_TAB_ORDER]: [],
    },
    tabs: [],
  });
});
