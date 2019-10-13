import os from 'os';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const dbPath = os.tmpdir() + '/toy-ci-db.json';
const adapter = new FileSync(dbPath);
const db = low(adapter);

console.log('Database path:', dbPath);

const defaults = {
    builds: {},
    buildsFifo: [],
    agents: []
};

db.defaults(defaults).write();

export default db;
