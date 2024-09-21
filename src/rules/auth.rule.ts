import { ROLES_SEED } from "src/data";
import { PARAM_LOCATION } from "src/enums";
import { genericStringRule, genericRolesRule, genericCookieRule } from "src/rules/generic";

export const registerUserValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      "displayName",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
    ),
    genericStringRule("email", {
      requiredType: "string",
      warnings:
        "This field doesn't exist, is not a string, is empty or is not a valid email address.",
    }),
    genericStringRule("password", {
      requiredType: "string",
      warnings: "This field doesn't exist, is not a string, is empty or is not a valid password.",
    }),
    genericRolesRule(
      "role",
      {
        requiredType: "string",
        warnings: "This field is not a string, is empty or is not a valid role.",
      },
      ROLES_SEED,
      false,
    ),
    ...newRules,
  ];
};

export const signInValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      "email",
      {
        requiredType: "string",
        warnings:
          "This field doesn't exist, is not a string, is empty or is not a valid email address.",
      },
      "^[^s@]+@[^s@]+.[^s@]+$",
    ),
    genericStringRule(
      "password",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string, is empty or is not a valid password.",
      },
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
    ),
    ...newRules,
  ];
};

export const refreshTokenValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericCookieRule(
      "refresh",
      {
        location: PARAM_LOCATION.COOKIE,
        warnings: "This field doesn't exist, is empty or is not a valid cookie.",
      },
      true,
    ),
    ...newRules,
  ];
};
