import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { Prisma } from '@prisma/client';

export class PaginationQueryPipeTransform implements PipeTransform {
  transform(
    query: PaginationQueryDto,
    metadata: ArgumentMetadata,
  ): PaginationQueryDto {
    if (!query) query = new PaginationQueryDto();

    if (query.limit && query.page) {
      query.skip = (query.page - 1) * query.limit;
    }

    if (query.sort || query.defaultSort) {
      const items = (query.sort || query.defaultSort).split(',');

      const orderBy = items.reduce((by, item) => {
        let order: Prisma.SortOrder = Prisma.SortOrder.asc;
        if (item.startsWith('-')) {
          order = Prisma.SortOrder.desc;
          item = item.substring(1);
        }
        if (query.allowSortFields.includes(item)) {
          by.push({
            [item]: order,
          });
        }
        return by;
      }, []);

      query.orderBy = orderBy;
    }

    return query;
  }
}
