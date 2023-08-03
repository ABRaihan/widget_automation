const path = require("path")
const expr = [
  { __and: [{ isViewAllBtn: true }, { isViewBtn: false }, { __or: [{ isValue: true }, { isName: "yes" }] }, {__ne: {isShow: false}}] },
];

function playground(arr, operator) {
  let str = "";
  arr.forEach((element) => {
    const key = Object.keys(element)[0];
    if (key === "__and")
      str += str === "" ? `${playground(element.__and, "&&")}` : ` && (${playground(element.__and, "&&")})`;
    if (key === "__or")
      str += str === "" ? `(${playground(element.__or, "||")})` : ` && (${playground(element.__or, "||")})`;
    if(key === "__ne")
      str += 

    if (!Array.isArray(element[key])){
      str += str === "" ? `${key} === ${element[key]}` : ` ${operator} ${key} === ${element[key]}`;
    }
      
  });
  return str;
}

// console.log(playground(expr, "&&"));
