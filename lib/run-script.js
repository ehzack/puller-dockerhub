'use strict';

const path = require('path');
const { Worker } = require('worker_threads');
const winston = require('winston');

// Winston logger setup with timestamp and pretty print for console
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../worker-output.log'),
      maxsize: process.env.LOG_MAX_SIZE?process.env.LOG_MAX_SIZE*1024*1024: 3 * 1024 * 1024, // 5 MB
      maxFiles: process.env.LOG_MAX_FILES || 3 // Only keep one file, overwrite when exceeded
    }),
    new winston.transports.Console({ format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
      })
    )})
  ]
});

module.exports = async ({ args = [], cwd = process.cwd() }) => {
  // Create a child logger for this worker run
  const runId = Date.now() + '-' + Math.floor(Math.random() * 10000);
  const runLogger = logger.child({ runId, image:args[0] });

  runLogger.info('Starting worker with args');

  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'run-script-worker.js'));

    worker.postMessage({ args, cwd });

    // Listen for real-time shell output from worker
    worker.on('message', (msg) => {
      if (msg.stream === 'stdout') {
        runLogger.info('[Worker STDOUT]', { output: msg.data });
        return;
      }
      if (msg.stream === 'stderr') {
        runLogger.warn('[Worker STDERR]', { output: msg.data });
        return;
      }

      // Final message (success or error)
      const logEntry = {
        repos: args[0],
        path: args[1],
        "container-name": args[2],
        result: msg.error ? 'error' : 'success',
        error: msg.error || undefined,
        stdout: msg.stdout,
        stderr: msg.stderr
      };
      runLogger.info('Worker finished', logEntry);

      if (msg.error) {
        runLogger.error('[Worker] Error: ' + msg.error, { stderr: msg.stderr });
        reject(new Error(msg.error));
      } else {
        runLogger.info('[Worker] Script executed successfully');
        resolve();
      }
      worker.terminate();
    });

    worker.on('error', (err) => {
      runLogger.error('[Worker] Worker thread error', { error: err });
      reject(err);
      worker.terminate();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        runLogger.error(`[Worker] Worker stopped with exit code ${code}`);
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};
