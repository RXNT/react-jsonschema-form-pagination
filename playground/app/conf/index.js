const schema = {
  type: "object",
  title: "Encounter",
  required: ["firstName", "password", "nickName"],
  properties: {
    encounter: {
      type: "string",
      title: "Encounter",
    },
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "integer",
      title: "Age",
    },
    nickName: {
      type: "string",
      title: "nickname",
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3,
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
    },
  },
};

const uiSchema = {
  encounter: {
    nav: "Encounter",
  },
  firstName: {
    nav: "First name",
  },
  lastName: {
    nav: "Last name",
  },
  age: {
    nav: "Age",
  },
  nickName: {
    type: "string",
    nav: "nickname",
  },
  bio: {
    type: "string",
    nav: "Bio",
  },
  password: {
    type: "string",
    nav: "Password",
    minLength: 3,
  },
  telephone: {
    nav: "Telephone",
  },
};

const formData = {
  encounter: "Some",
  lastName: "",
  firstName: "",
  age: 20,
};

export default {
  schema,
  uiSchema,
  formData,
};
