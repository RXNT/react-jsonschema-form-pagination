import React from "react";

const COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  undefined: "StringField",
  string: "StringField",
};

export function getFieldComponent(schema, uiSchema, fields) {
  const field = uiSchema["ui:field"];
  if (typeof field === "function") {
    return field;
  }
  if (typeof field === "string" && field in fields) {
    return fields[field];
  }
  let componentName = COMPONENT_TYPES[schema.type];
  if (
    Array.isArray(schema.type) &&
    schema.type.includes("string") &&
    schema.type.includes("object")
  ) {
    componentName = "StringField";
  }
  return componentName in fields
    ? fields[componentName]
    : () => <h1>Unknown field type {schema.type}</h1>;
}

const REQUIRED_FIELD_SYMBOL = "* ";

function DefaultLabel(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <label className="control-label" htmlFor={id}>
      {required && (
        <span style={{ color: "#ff4d4f" }}>{REQUIRED_FIELD_SYMBOL}</span>
      )}
      {label}
    </label>
  );
}

export function Label({
  schema: { type, title },
  uiSchema,
  name,
  required,
  idSchema,
}) {
  const label = uiSchema["ui:title"] || title || name;
  let { ["ui:options"]: { label: displayLabel = true } = {} } = uiSchema;
  if (type === "object") {
    displayLabel = false;
  }
  if (type === "boolean" && !uiSchema["ui:widget"]) {
    displayLabel = false;
  }
  if (uiSchema["ui:widget"] && uiSchema["ui:widget"] === "hidden") {
    displayLabel = false;
  }
  if (displayLabel) {
    return (
      <DefaultLabel label={label} required={required} id={idSchema["$id"]} />
    );
  } else {
    return null;
  }
}
