import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  db: defineTable({
    courses: v.array(
      v.object({
        bgColor: v.string(),
        icon: v.string(),
        id: v.string(),
        progress: v.string(),
        title: v.string(),
      })
    ),
  }),
});