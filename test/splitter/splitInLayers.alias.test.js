import splitInLayers from "../../src/splitter/splitInLayers";
import { UI_TAB_ALIAS, UI_TAB_ORDER } from "../../src/utils";
import { withTab } from "../utils";

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
  phone: withTab(["first", "phone"]),
  ageAlias: withTab(["first", "other"]),
  phoneAlias: withTab(["first", "other"]),
  nickNameAlias: withTab(["first", "other"]),
  age: withTab("last"),
  nickName: withTab("last"),
  lastName: withTab("last"),
  other: withTab("nick"),
  [UI_TAB_ALIAS]: {
    nickName: "nickNameAlias",
    age: "ageAlias",
    phone: "phoneAlias",
  },
  [UI_TAB_ORDER]: [],
};

test("return subforms", () => {
  let layers = splitInLayers(schema, uiSchema);

  let activeTabs = [];
  layers.updateActiveTabs(activeTabs);
  // expect(activeTabs).toEqual([ "first", "other" ]);

  let subForms = layers.toSubForms(activeTabs);
  expect(subForms[0]).toEqual({
    activeTab: "first",
    schema: {
      type: "object",
      properties: {},
    },
    uiSchema: {},
    tabs: [{ tabID: "first" }, { tabID: "last" }, { tabID: "nick" }],
  });
});
