import { check, cookie, header, query, param } from "express-validator";
import { FieldIdValidationMessage, FieldValidationMessage } from "src/types";

export const genericStringRule = (
  field: string | string[],
  message: FieldValidationMessage,
  matches: string | null | RegExp = null,
  required: boolean = true,
) => {
  const stringRule = check(field, message);

  required ? stringRule.exists() : stringRule.optional();

  stringRule.notEmpty().isString();
  if (matches) stringRule.matches(matches);
  return stringRule;
};

export const genericIntegerRule = (
  field: string | string[],
  message: FieldValidationMessage,
  options = {},
  required: boolean = true,
) => {
  const integerRule = check(field, message);
  required ? integerRule.exists() : integerRule.optional();
  return integerRule.toInt().isInt(options);
};

export const genericFloatRule = (
  field: string | string[],
  message: FieldValidationMessage,
  options = {},
  required: boolean = true,
) => {
  const floatRule = check(field, message);
  required ? floatRule.exists() : floatRule.optional();
  return floatRule.toFloat().isFloat(options);
};

export const genericBooleanRule = (
  field: string | string[],
  message: FieldValidationMessage,
  required = true,
) => {
  const booleanRule = check(field, message);
  required ? booleanRule.exists() : booleanRule.optional();
  return booleanRule.isBoolean();
};

export const genericMongoIdRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required: boolean = true,
) => {
  const mongoIdRule = check(field, message);
  required ? mongoIdRule.exists() : mongoIdRule.optional();
  return mongoIdRule.isMongoId();
};

export const genericHeaderRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required = true,
) => {
  const headerRule = header(field, message);
  required ? headerRule.exists() : headerRule.optional();
  headerRule.notEmpty().isString();
  return headerRule;
};

export const genericQueryParamIdRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required: boolean = true,
) => {
  const integerRule = check(field, message);
  required ? integerRule.exists() : integerRule.optional();
  return integerRule.toInt().isInt();
};

export const genericQueryParamRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required: boolean = true,
  matches: string | RegExp | null = null,
) => {
  const stringRule = check(field, message);
  required ? stringRule.exists() : stringRule.optional();

  stringRule.notEmpty().isString();
  if (field === "email") stringRule.isEmail();

  if (matches) stringRule.matches(matches);
  return stringRule;
};

export const genericRolesRule = (
  field: string | string[],
  message: FieldValidationMessage,
  roles: string[],
  required: boolean = true,
) => {
  const rolesRule = check(field, message);
  required ? rolesRule.exists() : rolesRule.optional();

  rolesRule.isIn(roles);

  return rolesRule;
};

export const genericGuidRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required: boolean = true,
) => {
  const guidRule = check(field, message);
  required ? guidRule.exists() : guidRule.optional();

  guidRule.notEmpty().isString();

  guidRule.matches(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/);
  return guidRule;
};

export const genericPaginationRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required: boolean = true,
) => {
  const numberRule = query(field, message);
  required ? numberRule.exists() : numberRule.optional();

  numberRule.notEmpty().isString().matches(/^\d+$/);

  return numberRule;
};

export const genericStringArrayRule = (
  field: string,
  message: FieldValidationMessage,
  matches: string | null | RegExp = null,
  required: boolean = true,
) => {
  const arrayRule = check(field, message).isArray();

  required ? arrayRule.exists({ checkNull: true, checkFalsy: true }) : arrayRule.optional();

  arrayRule.custom((value: any) => {
    if (!Array.isArray(value)) return false;

    for (const element of value) {
      if (typeof element !== "string") return false;

      if (matches && !element.match(matches)) return false;
    }

    return true;
  });

  return arrayRule;
};

export const genericCookieRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required: boolean = true,
  matches: string | RegExp | null = null,
) => {
  const cookieRule = cookie(field, message);
  required ? cookieRule.exists() : cookieRule.optional();

  cookieRule.notEmpty();

  if (matches) cookieRule.matches(matches);
  return cookieRule;
};

export const genericParamRule = (
  field: string | string[],
  message: FieldIdValidationMessage,
  required: boolean = true,
  matches: string | RegExp | null = null,
) => {
  let paramRule = param(field, message);
  required ? paramRule.exists({ checkNull: true, checkFalsy: true }) : paramRule.optional();

  paramRule = paramRule.notEmpty();

  if (matches) paramRule = paramRule.matches(matches);

  return paramRule;
};
