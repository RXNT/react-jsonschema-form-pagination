export function testInProd(f) {
  process.env.NODE_ENV = "production";
  let res = f();
  process.env.NODE_ENV = "development";
  return res;
}

export function withNav(val) {
  if (Array.isArray(val)) {
    return { nav: val };
  } else {
    return { nav: [val] };
  }
}
