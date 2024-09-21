import { genericBooleanRule, genericIntegerRule, genericStringRule } from "src/rules/generic";

export const createNotificationValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      "message",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
    ),
    genericIntegerRule(
      "user",
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
    ),
    ...newRules,
  ];
};

export const updateNotificationValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      "id",
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
    ),
    genericBooleanRule(
      ["deleted", "viewed"],
      {
        requiredType: "boolean",
        warnings: "This field doesn't exist, is not a boolean or is empty.",
      },
      false,
    ),
    ...newRules,
  ];
};
