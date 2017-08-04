import React from "react";
import applyPagination from "../../src/index";
import applyRules from "react-jsonschema-form-conditionals";
import Form from "react-jsonschema-form";
import conf from "./conf";

let FormWithPagination = applyRules(applyPagination(Form));

export function App() {
  return (
    <FormWithPagination
      {...conf}
      onChange={({ formData }) =>
        console.log(`FormData ${JSON.stringify(formData)}`)}
    />
  );
}
