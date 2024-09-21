import { PARAM_LOCATION } from "src/enums";
import {
  genericParamRule,
  genericStringRule,
  genericIntegerRule,
  genericPaginationRule,
} from "src/rules/generic";

export const createForumReplyValidationRules = (additionalRules: any = null) => {
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
    genericIntegerRule(
      "forumId",
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
    ),
    genericIntegerRule(
      "parentReplyId",
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
      false,
    ),
    ...newRules,
  ];
};

export const getRepliesByForumValidationRules = (additionalRules: any = null) => {
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
    genericParamRule(
      "forumId",
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

export const updateForumReplyValidationRules = (additionalRules: any = null) => {
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
    genericIntegerRule(
      ["forumId", "replyId"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
    ),
    genericStringRule(
      "fileToRemove",
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

export const deleteForumReplyValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["forumId", "replyId"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
    ),
    ...newRules,
  ];
};
