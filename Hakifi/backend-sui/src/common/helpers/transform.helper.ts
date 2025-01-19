import { ForbiddenException, PipeTransform } from '@nestjs/common';

export class Transformation {
  public static parseStringToNumber(value: string): number | undefined {
    const explodedValues = typeof value === 'string';

    if (!explodedValues || !value) return undefined;

    if (parseInt(value) < 0) return undefined;

    return parseInt(value);
  }

  public static parseStringToFloat(value: string): number | undefined {
    if (!value) return undefined;

    if (parseFloat(value) < 0) return undefined;

    return parseFloat(value);
  }

  public static parseStringToBoolean(value: string): boolean {
    const check = Boolean(value);

    if (!check) return;

    return value === 'true';
  }

  public static checkStringIsNumber(
    value: string,
  ): string | ForbiddenException {
    const explodedValues = +value;

    if (Number.isNaN(explodedValues)) {
      return new ForbiddenException('Id wrong, please check again!');
    }

    return value;
  }

  public static validateNumber(value: number, from = 0, to?: number) {
    if (to) {
      if (value < from || value > to) {
        return new ForbiddenException(
          `Value must be in the range from: ${from} to ${to}`,
        );
      }
    } else {
      if (value < from) {
        return new ForbiddenException(`Value must be greater than ${from}`);
      }
    }

    return value;
  }

  public static trimString(value: string | undefined): string {
    return value.trim();
  }

  public static lowerCaseString(value: string | undefined): string {
    return value.toLowerCase();
  }

  public static lowerCaseAndTrimString(value: string | undefined): string {
    return value.toLowerCase().trim();
  }

  public static upperCaseString(value: string | undefined): string {
    return value.toUpperCase().trim();
  }
}
