import { withNav } from "../utils";
import splitter from "../../src/splitter";

let schema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
};

let uiSchema = {
  firstName: Object.assign(withNav("first"), { classNames: "col-md-12" }),
  lastName: Object.assign(withNav(["last"]), { classNames: "col-md-6" }),
  firstNameAlias: Object.assign(withNav(["last"]), { classNames: "col-md-6" }),
  navConf: {
    aliases: {
      firstName: "firstNameAlias",
    },
  },
};

test("return subforms", () => {
  let layers = splitter(schema, uiSchema);

  let activeNavs = [];
  layers.updateActiveNav(activeNavs);
  // expect(activeTabs).toEqual([ "first", "other" ]);

  let resUiSchema = layers.toSubForms(["last"]);
  expect(JSON.parse(JSON.stringify(resUiSchema))).toEqual({
    firstName: {
      navConfs: [
        {
          navs: {
            activeNav: "last",
            links: [
              { isActive: false, nav: "first" },
              { isActive: true, nav: "last" },
            ],
          },
        },
      ],
      origUiSchema: {
        nav: ["last"],
        classNames: "col-md-6",
      },
      "ui:field": "nav",
    },
    lastName: {
      nav: ["last"],
      classNames: "col-md-6",
    },
    firstNameAlias: Object.assign(withNav(["last"]), {
      classNames: "col-md-6",
    }),
    navConf: {
      aliases: {
        firstName: "firstNameAlias",
      },
    },
  });
});
