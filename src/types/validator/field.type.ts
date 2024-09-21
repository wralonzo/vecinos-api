import { PARAM_LOCATION } from "src/enums";

type FieldValidationError = {
  field: string;
  message: Record<string, string>;
};

type FieldValidationMessage = {
  requiredType: string;
  warnings: string;
};

type FieldIdValidationMessage = {
  warnings: string;
  location: PARAM_LOCATION;
};

export { FieldValidationMessage, FieldValidationError, FieldIdValidationMessage };
