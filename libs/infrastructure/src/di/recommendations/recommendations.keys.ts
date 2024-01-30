export class RecommendationsKeys {
  public static readonly RECOMMENDATIONS_MAPPER: unique symbol = Symbol(
    'RECOMMENDATIONS_MAPPER',
  );

  public static readonly RECOMMENDATIONS_REPOSITORY: unique symbol = Symbol(
    'RECOMMENDATIONS_REPOSITORY',
  );

  public static readonly RECOMMENDATIONS_READ_REPOSITORY: unique symbol =
    Symbol('RECOMMENDATIONS_READ_REPOSITORY');

  public static readonly RECOMMENDATIONS_MODEL: unique symbol = Symbol(
    'RECOMMENDATIONS_MODEL',
  );
}
