import { UI_TAB_ID } from "../../src/utils";
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
  let layers = splitter(schema, uiSchema, [{ tabID: "nick" }]);

  let activeNavs = [];
  layers.updateActiveNav(activeNavs);
  expect(activeNavs).toEqual(["first", "age"]);
});

test("return subforms", () => {
  let layers = splitter(schema, uiSchema);
  let subForms = layers.toSubForms(["first", "age"]);
  expect(subForms[0]).toEqual({
    schema: {
      type: "object",
      properties: {},
    },
    uiSchema: {},
    navs: {
      links: [],
    },
  });
  expect(subForms[1]).toEqual({
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
    navs: {
      links: [
        { tabID: "first", isActive: true },
        { tabID: "last", isActive: false },
        { tabID: "nick", isActive: false },
      ],
    },
  });
  expect(subForms[2]).toEqual({
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
    navs: {
      links: [
        { tabID: "age", isActive: true },
        { tabID: "phone", isActive: false },
      ],
    },
  });
});
