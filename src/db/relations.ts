import { relations } from "drizzle-orm/relations";
import {
  coralData,
  coralDataObservationsTable,
  observations,
  accounts,
} from "./schema";

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

export const observationsRelations = relations(
  observations,
  ({ one, many }) => ({
    coralDataObservationsTables: many(coralDataObservationsTable),
    account: one(accounts, {
      fields: [observations.authorId],
      references: [accounts.accountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ many }) => ({
  observations: many(observations),
}));
