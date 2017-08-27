import splitInLayers from "../../src/splitter/splitInLayers";
import { UI_ORDER, UI_TAB_ALIAS, UI_TAB_ORDER } from "../../src/utils";
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

  let activeTabs = layers.updateActiveTabs([]);
  // expect(activeTabs).toEqual([ "first", "other" ]);

  let subForms = layers.toSubForms(activeTabs);
  expect(subForms[0]).toEqual({
    activeTab: "first",
    schema: {
      required: [],
      properties: {},
    },
    uiSchema: {
      firstName: {},
      age: {},
      ageAlias: withTab("other"),
      phone: withTab("phone"),
      phoneAlias: withTab("other"),
      nickName: {},
      nickNameAlias: withTab("other"),
      lastName: {},
      other: {},
      [UI_TAB_ALIAS]: {
        nickName: ["nickNameAlias"],
        age: ["ageAlias"],
        phone: ["phoneAlias"],
      },
      [UI_TAB_ORDER]: [],
      [UI_ORDER]: [],
    },
    tabs: [{ tabID: "first" }, { tabID: "last" }, { tabID: "nick" }],
  });
});
