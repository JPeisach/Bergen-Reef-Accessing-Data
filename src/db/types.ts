import { observations } from "./schema";

type NewObservation = typeof observations.$inferInsert;

export default NewObservation;
