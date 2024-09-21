import { PARAM_LOCATION } from "src/enums";
import { genericIntegerRule, genericPaginationRule, genericStringRule } from "src/rules/generic";

export const createIncidentValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      "description",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
    ),
    ...newRules,
  ];
};

export const updateIncidentValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["id", "status"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
    ),
    genericStringRule(
      "description",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
      false,
    ),
    ...newRules,
  ];
};

export const findIncidentsPaginatedValidationRules = (additionalRules: any = null) => {
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
    genericPaginationRule(
      "author",
      {
        location: PARAM_LOCATION.QUERY_PARAM,
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      false,
    ),
    ...newRules,
  ];
};
