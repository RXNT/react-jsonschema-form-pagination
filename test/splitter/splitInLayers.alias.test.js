import splitInLayers from "../../src/splitter/splitInLayers";
import { UI_TAB_ALIAS } from "../../src/utils";
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
    },
    tabs: [
      { tabID: "first" },
      { tabID: "last" },
      { tabID: "nick" },
      { tabID: "default" },
    ],
  });
  // expect(subForms[1]).toEqual({
  //   activeTab: "other",
  //   schema: {
  //     required: [],
  //     properties: {
  //       firstName: { type: "string" },
  //     },
  //   },
  //   uiSchema: {
  //     firstName: {},
  //     age: {},
  //     phone: {},
  //     lastName: {},
  //     nickName: {},
  //     other: {},
  //     [UI_TAB_ALIAS]: {},
  //   },
  //   tabs: [{ tabID: "default" }, { tabID: "other" }],
  // });
  // expect(subForms[2]).toEqual({
  //   activeTab: "default",
  //   schema: {
  //     required: [],
  //     properties: {
  //       age: { type: "string" },
  //     },
  //   },
  //   uiSchema: {
  //     firstName: {},
  //     age: {},
  //     phone: {},
  //     lastName: {},
  //     nickName: {},
  //     other: {},
  //     [UI_TAB_ALIAS]: {},
  //   },
  //   tabs: [{ tabID: "default" }],
  // });
});
