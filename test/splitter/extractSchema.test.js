import extractSchema from "../../src/splitter/extractSchema";

test("extract layer from simple schema", () => {
  let schema = {
    required: ["firstName"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  expect(extractSchema(["lastName"], schema)).toEqual({
    type: "object",
    required: [],
    properties: {
      lastName: { type: "string" },
    },
  });
  expect(extractSchema(["firstName"], schema)).toEqual({
    type: "object",
    required: ["firstName"],
    properties: {
      firstName: { type: "string" },
    },
  });
});

test("extract with proper required", () => {
  let schema = {
    required: ["firstName", "lastName"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  expect(extractSchema(["firstName"], schema)).toEqual({
    type: "object",
    required: ["firstName"],
    properties: {
      firstName: { type: "string" },
    },
  });
});
