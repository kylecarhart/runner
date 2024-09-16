// export const race = pgTable(
//   "race",
//   {
//     id: uuid("id")
//       .default(sql`uuid_generate_v4()`)
//       .primaryKey()
//       .notNull(),
//     createdDate: timestamp("createdDate", {
//       withTimezone: true,
//       mode: "string",
//     })
//       .defaultNow()
//       .notNull(),
//     updatedDate: timestamp("updatedDate", {
//       withTimezone: true,
//       mode: "string",
//     })
//       .defaultNow()
//       .notNull(),
//     name: varchar("name").notNull(),
//     type: varchar("type").notNull(),
//     date: timestamp("date", { mode: "string" }).notNull(),
//     eventId: uuid("eventId"),
//   },
//   (table) => {
//     return {
//       fk778Abb6F582Ac1Bcbafa1101Fc4: foreignKey({
//         columns: [table.eventId],
//         foreignColumns: [event.id],
//         name: "FK_778abb6f582ac1bcbafa1101fc4",
//       }),
//     };
//   },
// );

// export const userRace = pgTable(
//   "user_race",
//   {
//     id: uuid("id")
//       .default(sql`uuid_generate_v4()`)
//       .primaryKey()
//       .notNull(),
//     createdDate: timestamp("createdDate", {
//       withTimezone: true,
//       mode: "string",
//     })
//       .defaultNow()
//       .notNull(),
//     updatedDate: timestamp("updatedDate", {
//       withTimezone: true,
//       mode: "string",
//     })
//       .defaultNow()
//       .notNull(),
//     userId: uuid("userId").notNull(),
//     raceId: uuid("raceId").notNull(),
//   },
//   (table) => {
//     return {
//       fk92663F5Bb399F002A65B1Ce47Bf: foreignKey({
//         columns: [table.raceId],
//         foreignColumns: [race.id],
//         name: "FK_92663f5bb399f002a65b1ce47bf",
//       }),
//       fkCd3C86A1803Bf148C121813D4F2: foreignKey({
//         columns: [table.userId],
//         foreignColumns: [user.id],
//         name: "FK_cd3c86a1803bf148c121813d4f2",
//       }),
//     };
//   },
// );

// export const user = pgTable(
//   "user",
//   {
//     id: uuid("id")
//       .default(sql`uuid_generate_v4()`)
//       .primaryKey()
//       .notNull(),
//     createdDate: timestamp("createdDate", {
//       withTimezone: true,
//       mode: "string",
//     })
//       .defaultNow()
//       .notNull(),
//     updatedDate: timestamp("updatedDate", {
//       withTimezone: true,
//       mode: "string",
//     })
//       .defaultNow()
//       .notNull(),
//     firstName: varchar("firstName").notNull(),
//     lastName: varchar("lastName").notNull(),
//     username: varchar("username").notNull(),
//     email: varchar("email").notNull(),
//     password: varchar("password").notNull(),
//   },
//   (table) => {
//     return {
//       uq78A916Df40E02A9Deb1C4B75Edb: unique(
//         "UQ_78a916df40e02a9deb1c4b75edb",
//       ).on(table.username),
//       uqE12875Dfb3B1D92D7D7C5377E22: unique(
//         "UQ_e12875dfb3b1d92d7d7c5377e22",
//       ).on(table.email),
//     };
//   },
// );
