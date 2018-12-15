import extractSubUiSchema from "../../src/splitter/extractSubUiSchema";

test("extract default uiSchema", () => {
  let origUiSchema = {
    firstName: {},
    lastName: {},
    navConf: {
      aliases: {},
    },
  };
  expect(
    extractSubUiSchema(["firstName", "lastName"], {}, origUiSchema)
  ).toEqual({
    firstName: {},
    lastName: {},
  });
});

test("extract with aliases", () => {
  let uiSchema = {
    firstName: {
      classNames: "col-md-5",
    },
    firstNameAlias: {
      classNames: "col-md-10",
    },
  };
  expect(extractSubUiSchema(["firstName"], {}, uiSchema)).toEqual({
    firstName: { classNames: "col-md-5" },
  });

  expect(
    extractSubUiSchema(["firstName"], { firstName: "firstNameAlias" }, uiSchema)
  ).toEqual({ firstName: { classNames: "col-md-10" } });
});

test("extract nested", () => {
  const schema = {
    type: "object",
    title: "Nested Pagination",
    properties: {
      general: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            title: "First name",
          },
          lastName: {
            type: "string",
            title: "Last name",
          },
        },
      },
    },
  };

  const origUiSchema = {
    general: {
      nav: "general",
      firstName: {
        nav: ["general", "First name"],
      },
      lastName: {
        nav: ["general", "Last name"],
      },
    },
  };

  const uiSchema = {
    general: {
      "ui:widget": "hidden",
      "ui:field": "hidden",
    },
  };

  expect(
    extractSubUiSchema(
      ["general.firstName"],
      {},
      origUiSchema,
      uiSchema,
      schema
    )
  ).toEqual({
    general: {
      nav: "general",
      firstName: {
        nav: ["general", "First name"],
      },
      lastName: {
        "ui:widget": "hidden",
        "ui:field": "hidden",
      },
    },
  });
});
