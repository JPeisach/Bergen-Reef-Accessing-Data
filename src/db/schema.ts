import {
  mysqlTable,
  primaryKey,
  int,
  varchar,
  index,
  datetime,
  decimal,
  text,
  tinyint,
  varbinary,
} from "drizzle-orm/mysql-core";

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
    authorId: varchar({ length: 64 }).notNull(),
    datetime: datetime({ mode: "date" }).notNull(),
    observationTitle: varchar({ length: 100 })
      .notNull()
      .default("Unnamed observation (This should never happen..)"),
    observationText: text("observation_text")
      .notNull()
      .default("Empty observation (This should never happen..)"),

    // same as BLOB https://orm.drizzle.team/docs/column-types/mysql#varbinary
    // blobType: varbinary("image_data"),
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
