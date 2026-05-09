import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`projects\` ADD \`year\` numeric;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_year\` numeric;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`_verified\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`_verificationtoken\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD \`_verified\` integer;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`_verificationtoken\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`year\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_year\`;`)
}
