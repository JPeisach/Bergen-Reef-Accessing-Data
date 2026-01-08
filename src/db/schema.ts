import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  unique,
  int,
  varchar,
  index,
  datetime,
  decimal,
  float,
  foreignKey,
  date,
  text,
  tinyint,
} from "drizzle-orm/mysql-core";

export const accounts = mysqlTable(
  "accounts",
  {
    accountId: int("account_id").autoincrement().notNull(),
    email: varchar({ length: 100 }).notNull(),
    permissionLevel: int("permission_level").notNull(),
  },
  (table) => {
    return {
      accountsAccountId: primaryKey({
        columns: [table.accountId],
        name: "accounts_account_id",
      }),
      accountIdUnique: unique("account_id_UNIQUE").on(table.accountId),
      emailUnique: unique("email_UNIQUE").on(table.email),
    };
  },
);

export const coralData = mysqlTable(
  "coral_data",
  {
    id: int({ unsigned: true }).autoincrement().notNull(),
    datetime: datetime({ mode: "string" }).notNull(),
    name: varchar({ length: 45 }).notNull(),
    unit: varchar({ length: 45 }).notNull(),
    value: decimal({ precision: 6, scale: 2 }).notNull(),
    deleted: tinyint().default(1).notNull(),
    updatedAt: datetime("updated_at", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      dataId: index("data_id").on(table.id),
      coralDataId: primaryKey({ columns: [table.id], name: "coral_data_id" }),
    };
  },
);

export const coralDataObservationsTable = mysqlTable(
  "coral_data_observations_table",
  {
    observationId: int("observation_id")
      .notNull()
      .references(() => observations.observationId),
    dataId: int("data_id", { unsigned: true })
      .notNull()
      .references(() => coralData.id),
  },
  (table) => {
    return {
      idIdx: index("id_idx").on(table.dataId),
      coralDataObservationsTableObservationIdDataId: primaryKey({
        columns: [table.observationId, table.dataId],
        name: "coral_data_observations_table_observation_id_data_id",
      }),
    };
  },
);

export const observations = mysqlTable(
  "observations",
  {
    observationId: int("observation_id").autoincrement().notNull(),
    authorId: int("author_id")
      .notNull()
      .references(() => accounts.accountId),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    timestamp: date({ mode: "string" }).notNull(),
    observationText: text("observation_text"),
    // Warning: Can't parse blob from database
    // blobType: blob("image_data"),
  },
  (table) => {
    return {
      observationsObservationId: primaryKey({
        columns: [table.observationId],
        name: "observations_observation_id",
      }),
    };
  },
);
