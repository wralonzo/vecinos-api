import { PARAM_LOCATION } from "src/enums";
import { genericPaginationRule, genericStringRule } from "src/rules/generic";

export const createForumValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      ["title", "description"],
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
    ),
    ...newRules,
  ];
};

export const updateForumValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      ["id", "title", "description"],
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
    ),
    genericStringRule(
      "imagesToRemove",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is not valid.",
      },
      null,
      false,
    ),
    ...newRules,
  ];
};

export const deleteForumValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      "id",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
    ),
    ...newRules,
  ];
};

export const findForumsValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericPaginationRule(
      ["page", "pageSize"],
      {
        location: PARAM_LOCATION.QUERY_PARAM,
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      true,
    ),
    ...newRules,
  ];
};
