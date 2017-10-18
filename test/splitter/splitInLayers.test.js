import { withNav } from "../utils";
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
  firstName: withNav("first"),
  age: withNav(["first", "age"]),
  phone: withNav(["first", "phone"]),
  lastName: withNav("last"),
  nickName: withNav("nick"),
  other: withNav("nick"),
};

test("select active in layer", () => {
  let layers = splitter(schema, uiSchema, [{ nav: "nick" }]);

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
      properties: {
        firstName: { type: "string" },
      },
    },
    uiSchema: {
      firstName: {
        nav: ["first"],
      },
    },
    navPath: ["first"],
    navs: {
      activeNav: "first",
      links: [
        { nav: "first", isActive: true },
        { nav: "last", isActive: false },
        { nav: "nick", isActive: false },
      ],
    },
  });
  expect(subForms[1]).toEqual({
    schema: {
      type: "object",
      properties: {
        age: { type: "string" },
      },
    },
    uiSchema: {
      age: {
        nav: ["first", "age"],
      },
    },
    navPath: ["first", "age"],
    navs: {
      activeNav: "age",
      links: [
        { nav: "age", isActive: true },
        { nav: "phone", isActive: false },
      ],
    },
  });
});
