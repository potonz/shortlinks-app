#!/usr/bin/env bun

import { $, argv, Glob } from "bun";
import { createInterface } from "readline";
import { parseArgs } from "util";

const { values: flags } = parseArgs({
    args: argv,
    options: {
        name: {
            type: "string",
        },
        remote: {
            type: "boolean",
            default: false,
        },
    },
    strict: true,
    allowPositionals: true,
});

if (!flags.name) {
    console.error("Missing name flag");
    process.exit(1);
}

const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = function (query: string) {
    return new Promise<string>((resolve) => {
        readline.question(query, resolve);
    });
};

// Find the last migration file version
const migrations = new Glob("./prisma/migrations/*");
const lastMigration = [...migrations.scanSync()].sort().pop()?.split("/").pop();

if (!lastMigration) {
    console.error("No migrations found");
    process.exit(1);
}

const lastVersion = lastMigration.match(/^(\d+)/)?.at(1) ?? "0001";
const newVersion = String(Number(lastVersion) + 1).padStart(4, "0");

console.log(`Creating migration "${newVersion}" from ${lastVersion}`);

await $`prisma migrate diff --from-config-datasource --to-schema ./prisma/schema --script --output ./prisma/migrations/${newVersion}_${flags.name}.sql`;

const confirmMigrate = await question("Run migration? (y/N) ");
if (confirmMigrate.toLowerCase() !== "y") {
    console.log("Migration cancelled");
    process.exit(0);
}

await $`wrangler d1 execute shortlinks_db --file ./prisma/migrations/${newVersion}_${flags.name}.sql ${flags.remote ? "--remote" : "--local"}`;
