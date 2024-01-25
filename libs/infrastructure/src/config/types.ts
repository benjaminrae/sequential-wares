export type MongoConfig = {
  uri: string;
  debug: boolean;
};

export type Configuration = {
  port: number;
  database: MongoConfig;
};
