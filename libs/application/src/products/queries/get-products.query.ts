import { Product } from '@app/core';
import { PaginatedQuery } from '@app/core/shared/query';

export class GetProductsQuery extends PaginatedQuery<Product> {}
