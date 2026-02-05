import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

// FIXME: relations may need to be redefined because of the migration
export const relations = defineRelations(schema, (r) => ({}));
