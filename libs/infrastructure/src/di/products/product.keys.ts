export class ProductsKeys {
  public static readonly PRODUCT_MAPPER: unique symbol = Symbol('PRODUCT_MAPPER');
  public static readonly PRODUCT_REPOSITORY: unique symbol = Symbol('PRODUCT_REPOSITORY');
  public static readonly PRODUCT_READ_REPOSITORY: unique symbol = Symbol('PRODUCT_READ_REPOSITORY');
  public static readonly PRODUCT_MODEL: unique symbol = Symbol('PRODUCT_MODEL');
}
