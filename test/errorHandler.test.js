import errorHandler from "../src/errorHandler";
import NavTree from "../src/splitter";

let schema = {
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    nickName: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
      },
    },
  },
};

let uiSchema = {
  firstName: { nav: "FN" },
  lastName: { nav: "LN" },
  address: { nav: "AD" },
};

let navTree = new NavTree(schema, uiSchema);

test("active nav added on error", () => {
  let nickErrors = errorHandler(navTree)([
    { property: "instance", argument: "nickName" },
  ]);
  expect(nickErrors).toEqual([{ property: "instance", argument: "nickName" }]);

  let fnErrors = errorHandler(navTree)([
    { property: "instance", argument: "firstName" },
  ]);
  expect(fnErrors).toEqual([
    { property: "instance", argument: "firstName", activeNav: [{ nav: "FN" }] },
  ]);

  let lnErrors = errorHandler(navTree)([
    { property: "instance", argument: "lastName" },
  ]);
  expect(lnErrors).toEqual([
    { property: "instance", argument: "lastName", activeNav: [{ nav: "LN" }] },
  ]);
});

test("transform performed", () => {
  let nickErrors = errorHandler(navTree, () => "OH NO")([
    { property: "instance", argument: "nickName" },
  ]);
  expect(nickErrors).toEqual("OH NO");
});

test("work with nested", () => {
  let addressErrors = errorHandler(navTree)([
    { property: "instance.address", argument: "street" },
  ]);
  expect(addressErrors).toEqual([
    {
      property: "instance.address",
      argument: "street",
      activeNav: [{ nav: "AD" }],
    },
  ]);
});
