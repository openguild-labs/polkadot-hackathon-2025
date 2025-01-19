import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, string> {
  transform(value: any): string {
    const validObjectId = isMongoId(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid MongoId');
    }

    return value;
  }
}
