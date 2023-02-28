import { BadRequestException } from '@nestjs/common';
import { QueryParams } from '../interfaces/query-params.interface';
import { FindOptions, Op } from 'sequelize';

export class QueryParamsBuilder {
  static extract(
    params: QueryParams,
    searchBy: string[] = ['id'],
    validOrderFields: string[] = ['id'],
  ): FindOptions<any> {
    const queryObject = new Object();
    if (params?.search) {
      const fieldObjs = searchBy.reduce((search: any, field: string) => {
        const fieldObj = new Object();
        const opLike = new Object();
        opLike[Op.iLike] = `%${params.search}%`;
        fieldObj[field] = opLike;
        search.push(fieldObj);
        return search;
      }, []);

      const opOr = new Object();
      opOr[Op.or] = fieldObjs;
      queryObject['where'] = opOr;
    }

    if (params?.page) {
      queryObject['offset'] = (params.page - 1) * 10;
    }

    if (params?.limit) {
      queryObject['limit'] = params.limit;
    }

    if (params?.order) {
      if (!validOrderFields.includes(params.order))
        throw new BadRequestException('invalid order field');
      const orderBy = params?.orderBy ?? 'ASC';
      queryObject['order'] = [
        [params.order, orderBy === 'ASC' ? 'ASC' : 'DESC'],
      ];
    }

    return queryObject;
  }
}
