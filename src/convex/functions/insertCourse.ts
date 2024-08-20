import { mutation } from 'convex/_generated/server';

export const insertCourse = mutation(async ({ db }, course) => {
  await db.insert('courses', course);
});
