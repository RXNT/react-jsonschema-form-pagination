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
  let resUiSchema = layers.toSubForms(["first", "age"], () => {});
  let expectedNav = {
    age: {
      navConfs: [
        {
          navs: {
            activeNav: "age",
            links: [
              { isActive: true, nav: "age" },
              { isActive: false, nav: "phone" },
            ],
          },
        },
      ],
      origUiSchema: {
        nav: ["first", "age"],
      },
      "ui:field": "nav",
    },
    firstName: {
      navConfs: [
        {
          navs: {
            activeNav: "first",
            links: [
              { isActive: true, nav: "first" },
              { isActive: false, nav: "last" },
              { isActive: false, nav: "nick" },
            ],
          },
        },
      ],
      origUiSchema: { nav: ["first"] },
      "ui:field": "nav",
    },
    lastName: { "ui:field": "hidden", "ui:widget": "hidden" },
    nickName: { "ui:field": "hidden", "ui:widget": "hidden" },
    other: { "ui:field": "hidden", "ui:widget": "hidden" },
    phone: { "ui:field": "hidden", "ui:widget": "hidden" },
  };

  expect(JSON.parse(JSON.stringify(resUiSchema))).toEqual(expectedNav);
});
