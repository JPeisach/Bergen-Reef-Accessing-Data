import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, int, varchar, timestamp, float, foreignKey, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const accounts = mysqlTable("accounts", {
	accountId: int("account_id").autoincrement().notNull(),
	email: varchar({ length: 100 }).notNull(),
	permissionLevel: int("permission_level").notNull(),
},
(table) => {
	return {
		accountsAccountId: primaryKey({ columns: [table.accountId], name: "accounts_account_id"}),
		accountIdUnique: unique("account_id_UNIQUE").on(table.accountId),
		emailUnique: unique("email_UNIQUE").on(table.email),
	}
});

export const coralData = mysqlTable("coral_data", {
	recordId: int("record_id").autoincrement().notNull(),
	tankNumber: int("tank_number").notNull(),
	timestamp: timestamp({ mode: 'string' }).notNull(),
	temperature: float(),
	ph: float(),
	orp: int(),
	lls: float(),
	sumpReturnA: float("sump_return_a"),
	sumpReturnW: int("sump_return_w"),
	skimmerA: float("skimmer_a"),
	skimmerW: int("skimmer_w"),
	uvA: float("uv_a"),
	uvW: int("uv_w"),
	heaterA: float("heater_a"),
	heaterW: int("heater_w"),
	ledLampA: float("led_lamp_a"),
	ledLampW: int("led_lamp_w"),
	emptyA: float("empty_a"),
	emptyW: int("empty_w"),
	atkPowerA: float("atk_power_a"),
	atkPowerW: int("atk_power_w"),
	wavePumpA: float("wave_pump_a"),
	wavePumpW: int("wave_pump_w"),
	salt: float(),
	alkalinity: float(),
	calcium: float(),
	magnesium: float(),
	volt2: int("volt_2"),
},
(table) => {
	return {
		coralDataRecordId: primaryKey({ columns: [table.recordId], name: "coral_data_record_id"}),
	}
});

export const coralDataObservationsTable = mysqlTable("coral_data_observations_table", {
	observationId: int("observation_id").notNull().references(() => observations.observationId),
	recordId: int("record_id").notNull().references(() => coralData.recordId),
},
(table) => {
	return {
		coralDataObservationsTableObservationIdRecordId: primaryKey({ columns: [table.observationId, table.recordId], name: "coral_data_observations_table_observation_id_record_id"}),
	}
});

export const observations = mysqlTable("observations", {
	observationId: int("observation_id").autoincrement().notNull(),
	authorId: int("author_id").notNull().references(() => accounts.accountId),
	timestamp: timestamp({ mode: 'string' }).notNull(),
	observationText: text("observation_text"),
	// Warning: Can't parse blob from database
	// blobType: blob("image_data"),
},
(table) => {
	return {
		observationsObservationId: primaryKey({ columns: [table.observationId], name: "observations_observation_id"}),
	}
});
