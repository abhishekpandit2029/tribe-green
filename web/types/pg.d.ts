declare module "pg" {
  export class Pool {
    constructor(config?: {
      connectionString?: string;
      ssl?: boolean | { rejectUnauthorized?: boolean };
    });
    query<Row = Record<string, unknown>>(
      queryText: string,
      values?: unknown[],
    ): Promise<{ rows: Row[] }>;
  }
}
