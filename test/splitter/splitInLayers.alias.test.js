import { UI_TAB_ALIAS, UI_TAB_ORDER } from "../../src/utils";
import { withTab } from "../utils";
import splitter from "../../src/splitter";

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
  let layers = splitter(schema, uiSchema);

  let activeNavs = [];
  layers.updateActiveNav(activeNavs);
  // expect(activeTabs).toEqual([ "first", "other" ]);

  let subForms = layers.toSubForms(activeNavs);
  expect(subForms[0]).toEqual({
    schema: {
      type: "object",
      properties: {},
    },
    uiSchema: {},
    navs: {
      links: [
        { tabID: "first", isActive: true },
        { tabID: "last", isActive: false },
        { tabID: "nick", isActive: false },
      ],
    },
  });
});
