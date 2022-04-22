import { Reflect } from "./domainTypes.ts";

const reflectJson = (
  data: Record<string, unknown>,
): Record<string, Reflect["ReflectionPattern"]> => {
  Object.entries(data).map(([key, value]) => {
    // recrusive calls with objects & arrays
    if (refinements.isArray(value)) {
      return value.forEach((sub) => reflectJson(sub));
    } else if (refinements.isObject(value)) {
      return reflectJson(value);
    } // generate reflection pattern for each not iterable value
    else {
      data[key] = reflectValue(value);
    }
  });
  return data as Record<string, Reflect["ReflectionPattern"]>;
};

const reflectValue = (value: unknown): Reflect["ReflectionPattern"] => {
  if (refinements.isNumber(value)) {
    return "number";
  } else if (refinements.isBoolean(value)) {
    return "boolean";
  } else if (refinements.isNumberString(value)) {
    return "numberString";
  } else if (refinements.isDateString(value)) {
    return "dateString";
  } else if (refinements.isString(value)) {
    return "string";
  } else if (refinements.isNull(value)) {
    return "null";
  } else {
    return "unknown";
  }
};

const isNumber = (val: unknown): val is "number" => typeof val === "number";
const isString = (val: unknown): val is "string" => typeof val === "string";
const isBoolean = (val: unknown): val is "boolean" => typeof val === "boolean";
const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object";
const isArray = (val: unknown): val is Record<string, unknown>[] =>
  Array.isArray(val);
const isDateString = (val: unknown): val is "dateString" =>
  isString(val) && !isNaN(Date.parse(val));
const isNumberString = (val: unknown): val is "numberString" =>
  isString(val) && parseFloat(val) == val as unknown;
const isNull = (val: unknown): val is "null" => val === null;

const refinements = {
  isNumber,
  isString,
  isBoolean,
  isObject,
  isArray,
  isDateString,
  isNumberString,
  isNull,
};

export const reflection = {
  refinements,
  reflectJson,
  reflectValue,
};
