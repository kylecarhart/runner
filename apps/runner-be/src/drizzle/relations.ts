// export const raceRelations = relations(race, ({ one, many }) => ({
//   event: one(event, {
//     fields: [race.eventId],
//     references: [event.id],
//   }),
//   userRaces: many(userRace),
// }));

// export const eventRelations = relations(event, ({ many }) => ({
//   races: many(race),
// }));

// export const userRaceRelations = relations(userRace, ({ one }) => ({
//   race: one(race, {
//     fields: [userRace.raceId],
//     references: [race.id],
//   }),
//   user: one(user, {
//     fields: [userRace.userId],
//     references: [user.id],
//   }),
// }));

// export const userRelations = relations(user, ({ many }) => ({
//   userRaces: many(userRace),
// }));
