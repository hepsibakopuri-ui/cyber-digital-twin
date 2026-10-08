const oracledb = require('oracledb');
const path = require('path');
const fs = require('fs');

let pool = null;
let isConnected = false;
let clientInitialized = false;
let connectionError = null;

// Initialize Thick Client mode for Oracle 11g XE compatibility
function initClient() {
  if (clientInitialized) return;

  const candidateDirs = [
    process.env.ORACLE_CLIENT_DIR,
    'C:\\oraclexe\\app\\oracle\\product\\11.2.0\\server\\bin',
    'C:\\oracle\\instantclient_19_23',
    'C:\\oracle\\instantclient_21_13'
  ].filter(Boolean);

  for (const dir of candidateDirs) {
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'oci.dll'))) {
      try {
        oracledb.initOracleClient({ libDir: dir });
        clientInitialized = true;
        console.log(`[Oracle] Initialized Oracle Thick Client from: ${dir}`);
        break;
      } catch (err) {
        if (err.message.includes('already been initialized')) {
          clientInitialized = true;
          break;
        }
        console.warn(`[Oracle] Note on client dir ${dir}: ${err.message}`);
      }
    }
  }

  if (!clientInitialized) {
    try {
      oracledb.initOracleClient();
      clientInitialized = true;
      console.log('[Oracle] Initialized default Oracle Thick Client.');
    } catch (err) {
      console.warn('[Oracle] Thick client init deferred or using standard mode.');
    }
  }
}

async function initOracle() {
  initClient();

  const user = process.env.ORACLE_USER || 'CYBER_TWIN';
  const password = process.env.ORACLE_PASSWORD || 'CyberTwin#2026';
  const connectString = process.env.ORACLE_CONNECT_STRING || '127.0.0.1:1521/XE';

  try {
    pool = await oracledb.createPool({
      user,
      password,
      connectString,
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60
    });
    isConnected = true;
    connectionError = null;
    console.log(`[Oracle] Connected to Oracle Database XE at ${connectString} as ${user}.`);
    return true;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`[Oracle] Connection warning: ${err.message}`);
    console.log('[Oracle] Dual-mode active: Running resilient in-memory relational engine.');
    return false;
  }
}

async function executeQuery(sql, binds = {}, options = {}) {
  if (!isConnected || !pool) {
    return null;
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: options.autoCommit !== undefined ? options.autoCommit : true,
      ...options
    });
    return result;
  } catch (err) {
    console.error(`[Oracle Query Error] ${err.message} | SQL: ${sql}`);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error('[Oracle] Error closing connection:', e);
      }
    }
  }
}

async function testConnection(config) {
  initClient();
  try {
    const conn = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectString: config.connectString
    });
    const result = await conn.execute('SELECT sys_context(\'USERENV\',\'DB_NAME\') as DBNAME, USER as CURRENT_USER FROM DUAL', [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    await conn.close();
    return { success: true, details: result.rows[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function getOracleStatus() {
  return {
    connected: isConnected,
    mode: isConnected ? 'LIVE_ORACLE_XE' : 'IN_MEMORY_SIMULATION',
    user: process.env.ORACLE_USER || 'CYBER_TWIN',
    connectString: process.env.ORACLE_CONNECT_STRING || '127.0.0.1:1521/XE',
    error: connectionError,
    sqlPlusCompatible: true,
    tablesCount: 14
  };
}

module.exports = {
  initOracle,
  executeQuery,
  testConnection,
  getOracleStatus,
  oracledb
};
