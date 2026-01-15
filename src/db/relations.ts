import { relations } from "drizzle-orm/relations";
import { coralData, coralDataObservationsTable, observations } from "./schema";

export const coralDataObservationsTableRelations = relations(
  coralDataObservationsTable,
  ({ one }) => ({
    coralDatum: one(coralData, {
      fields: [coralDataObservationsTable.dataId],
      references: [coralData.id],
    }),
    observation: one(observations, {
      fields: [coralDataObservationsTable.observationId],
      references: [observations.observationId],
    }),
  }),
);

export const coralDataRelations = relations(coralData, ({ many }) => ({
  coralDataObservationsTables: many(coralDataObservationsTable),
}));
