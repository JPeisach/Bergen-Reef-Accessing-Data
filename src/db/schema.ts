import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  int,
  datetime,
  varchar,
  decimal,
  boolean,
  text,
  blob,
  primaryKey,
  index,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const coralData = mysqlTable(
  "coral_data",
  {
    id: int({ unsigned: true }).autoincrement().primaryKey(),
    datetime: datetime().notNull(),
    name: varchar({ length: 45 }).notNull(),
    unit: varchar({ length: 45 }).notNull(),
    value: decimal({ precision: 6, scale: 2 }).notNull(),
    deleted: boolean().default(true).notNull(),
    updatedAt: datetime("updated_at").notNull(),
  },
  (table) => [index("data_id").on(table.id)],
);

export const coralDataObservationsTable = mysqlTable(
  "coral_data_observations_table",
  {
    observationId: int("observation_id").notNull(),
    dataId: int("data_id", { unsigned: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.observationId, table.dataId] })],
);

export const observations = mysqlTable(
  "observations",
  {
    observationId: int("observation_id").autoincrement().primaryKey(),
    authorId: varchar({ length: 64 }).notNull(),
    observationTitle: varchar({ length: 100 }),
    datetime: datetime().notNull(),
    observationText: text("observation_text"),
    imageData: blob("image_data"),
  },
  (table) => [index("account_id_key").on(table.authorId)],
);
