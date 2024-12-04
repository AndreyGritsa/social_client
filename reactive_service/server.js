import postgres from "postgres";
import { runService } from "@skipruntime/server";
import { SocialSkipService } from "./dist/social.service.js";

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PORT = "5432",
} = process.env;

const sql = postgres(
  `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
);
async function selectAll(table) {
  return (await sql`SELECT * FROM ${sql(table)}`).map((r) => {
    if (r.created_at) {
      r.created_at = r.created_at.toISOString();
    }
    return [r.id, [r]];
  });
}

// Initial values.
const users = await selectAll("auth_user");
const profiles = await selectAll("users_profile");
const friendRequests = await selectAll("users_friendrequest");
const servers = await selectAll("servers_server");
const posts = await selectAll("posts_post");
const comments = await selectAll("posts_comment");

runService(
  SocialSkipService(users, profiles, friendRequests, servers, posts, comments)
);
