import { PARAM_LOCATION } from "src/enums";
import {
  genericIntegerRule,
  genericPaginationRule,
  genericParamRule,
  genericStringRule,
} from "src/rules/generic";

export const createEventValidationRules = (additionalRules: any = null) => {
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
    genericStringRule(
      "eventAt",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
    ),
    ...newRules,
  ];
};

export const findEventByIdValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericParamRule(
      "id",
      {
        location: PARAM_LOCATION.PARAM,
        warnings: "This field doesn't exist, is not a number or is empty.",
      },
      true,
      "^[1-9][0-9]*$",
    ),
    ...newRules,
  ];
};

export const updateEventValidationRules = (additionalRules: any = null) => {
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
    genericIntegerRule(
      "status",
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
      false,
    ),
    genericStringRule(
      ["title", "description"],
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
      false,
    ),
    genericStringRule(
      "eventAt",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
      false,
    ),
    ...newRules,
  ];
};

export const getEventsPaginatedValidationRules = (additionalRules: any = null) => {
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
