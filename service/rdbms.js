/**
 * Simple abstraction layer over postgres RDBMS.
 * The layer relies on low-level postgres library, so it's easy to port
 * it to any other RDBMS with similar capabilities.
 */
const pg = require('pg');

const env = process.env.NODE_ENV || 'test';
const config = require('../config/config.json')[env];

const transactions = {};
let pool;

// from postgress documentation
const ERRCODE_UNIQUE_VIOLATION = '23505';

async function release(clientId) {
  const client = transactions[clientId];
  delete transactions[clientId];
  if(client) {
    // if there are any transactions roll back
    try {
      await client.query('ROLLBACK');
    } catch(e) {
      // ignore errors
    }
    try {
      await client.release();
    } catch(e) {
      // ignore
    }
  }
  return Promise.resolve();
}

Object.assign(module.exports, {
  ERRCODE_UNIQUE_VIOLATION,
  /** only for tests, do not use directly! */
  __getPool() {
    return pool;
  },

  init() {
    pool = new pg.Pool(config.postgres);
  },
  async cleanup() {
    await Promise.all(Object.getOwnPropertySymbols(transactions).map(release));
    const p = pool;
    pool = null;
    return p ? p.end() : Promise.resolve();
  },
  /**
    * Starts new transaction, returns Symbol as transaction id.
    */
  async beginTransaction() {
    const tr = Symbol(Date()); // not Date object, just string for debugging
    const client = await pool.connect();
    client.query('BEGIN');
    transactions[tr] = client;
    return tr;
  },
  async commit(transaction) {
    if(!transactions[transaction]) throw new Error('No such transaction!');
    const client = transactions[transaction];
    await client.query('COMMIT');
    delete transactions[transaction];
    return client.release();
  },
  async rollback(transaction) {
    if(!transactions[transaction]) throw new Error('No such transaction!');
    const client = transactions[transaction];
    await client.query('ROLLBACK');
    delete transactions[transaction];
    return client.release();
  },
  /**
    * @param transaction (optional) transaction ID
    */
  query(transaction, ...args) {
    if(typeof transaction === 'symbol') {
      if(!transactions[transaction]) throw new Error('No such transaction!');
      const q = args.shift();
      if(args.length) {
        return transactions[transaction].query(q, args);
      }
      return transactions[transaction].query(q);
    }
    // if not instance of Symbol then no transaction given, it's first
    // argument for postgres, i.e. SQL query string.
    if(args.length) {
      return pool.query(transaction, args);
    }
    return pool.query(transaction);
  },
});
