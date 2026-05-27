import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`projects\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_description\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`description\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_description\`;`)
}
