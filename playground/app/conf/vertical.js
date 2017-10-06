const schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
};

const uiSchema = {
  firstName: { nav: "first" },
  lastName: { nav: "last" },
  navConf: {
    navs: [
      {
        nav: "default",
        orientation: "vertical",
      },
    ],
  },
};

export default {
  schema,
  uiSchema,
};
