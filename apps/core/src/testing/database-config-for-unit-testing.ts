export function databaseConfigForUnitTesting() {
  return {
    provide: 'DATABASE_OPTIONS',
    useValue: {
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
    },
  };
}
