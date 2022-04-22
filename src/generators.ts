import { Reflect } from "./domainTypes.ts";
import { reflection } from "./reflection.ts";

const generateJson = (
  json: Record<string, unknown>,
) => {
  Object.entries(json).map(([key, value]) => {
    // recrusive calls with objects & arrays
    if (reflection.refinements.isArray(value)) {
      return value.map((sub) => generateJson(sub));
    } else if (reflection.refinements.isObject(value)) {
      return generateJson(value);
    } // generate random values for each not iterable value
    else {
      json[key] = randomizeByReflection(value, reflection.reflectValue(value));
    }
  });
  return json;
};

const randomizeByReflection = (
  value: unknown,
  pattern: Reflect["ReflectionPattern"],
) => {
  var specialsReg = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const vovelsReg = /[aeiou]/;
  const consonantsReg = /[bcdfghjklmnpqrstvwxyz]/;
  const upperCaseReg = /[A-Z]/;

  const consonants = "bcdfghjklmnpqrstvwxyz";
  const vovels = "aeiou";

  if (
    pattern === "string" || pattern === "numberString" || pattern === "number"
  ) {
    const stringify = String(value);
    const chars = stringify.split("");

    const r = chars.map((char) => {
      if (specialsReg.test(char)) {
        return char;
      } else if (reflection.refinements.isNumberString(char)) {
        return Math.floor(Math.random() * 10);
      } else {
        const isUpperCase = upperCaseReg.test(char);
        const lowerCase = char.toLowerCase();

        let pick = "";

        if (consonantsReg.test(lowerCase)) {
          pick = consonants[Math.floor(Math.random() * consonants.length)];
        } else if (vovelsReg.test(lowerCase)) {
          pick = vovels[Math.floor(Math.random() * vovels.length)];
        }

        return isUpperCase ? pick.toUpperCase() : pick;
      }
    });

    const join = r.join("");

    if (pattern === "number") {
      return Number(join);
    }

    return join;
  } else if (pattern === "boolean") {
    return !Math.round(Math.random());
  } else if (pattern === "dateString") {
    return new Date().toISOString();
  } else {
    return value;
  }
};

export const generators = {
  generateJson,
  randomizeByReflection,
};
