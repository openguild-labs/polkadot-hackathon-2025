import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator';
import { isValidSuiAddress } from '@mysten/sui.js/utils';

export const IS_SUI_ADDRESS = 'isSuiAddress';

export function isSuiAddress(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    return isValidSuiAddress(value);
  } catch (error) {
    return false;
  }
}

export function IsSuiAddress(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_SUI_ADDRESS,
      validator: {
        validate: (value, args): boolean => isSuiAddress(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a sui address',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
