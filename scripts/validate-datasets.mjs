import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const csvPath = path.join(root, 'datasets', 'maaproject_finetuning_dataset.csv');
const jsonlPath = path.join(root, 'datasets', 'maaproject_train.jsonl');
const completePath = path.join(root, 'datasets', 'maaproject_train_complete.jsonl');

const csvLines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).filter(Boolean);
const csvRows = csvLines.slice(1);
const jsonlRows = fs.readFileSync(jsonlPath, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const completeRows = fs.readFileSync(completePath, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const csvIds = new Set(csvRows.map(x => x.split(',')[0]));
const jsonIds = new Set(jsonlRows.map(x => x.id));
const completeIds = new Set(completeRows.map(x => x.id));
if (csvRows.length !== 110) throw new Error(`Expected 110 CSV rows, found ${csvRows.length}.`);
if (jsonlRows.length !== 88) throw new Error(`Expected supplied JSONL to contain 88 rows, found ${jsonlRows.length}.`);
if (completeRows.length !== 110) throw new Error(`Expected complete JSONL to contain 110 rows, found ${completeRows.length}.`);
for (const id of csvIds) if (!completeIds.has(id)) throw new Error(`Missing ID in complete JSONL: ${id}`);
for (const id of jsonIds) if (!csvIds.has(id)) throw new Error(`Unexpected supplied JSONL ID: ${id}`);
console.log(`Dataset validation passed: CSV=${csvRows.length}, supplied JSONL=${jsonlRows.length}, complete JSONL=${completeRows.length}.`);
