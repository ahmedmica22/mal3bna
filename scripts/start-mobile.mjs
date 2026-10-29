import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const mobileDirectory = path.resolve(scriptDirectory, '../apps/mobile');
const expoCli = path.join(mobileDirectory, 'node_modules/expo/bin/cli');
const args = process.argv.slice(2);
const hasConnectionMode = args.some((arg) =>
  ['--tunnel', '--lan', '--localhost', '--offline'].includes(arg),
);

let shuttingDown = false;
let currentChild = null;

function startExpo() {
  if (shuttingDown) return;

  const child = spawn(
    process.execPath,
    [expoCli, 'start', ...args, ...(hasConnectionMode ? [] : ['--tunnel'])],
    {
      cwd: mobileDirectory,
      env: { ...process.env },
      stdio: 'inherit',
      windowsHide: true,
    },
  );

  currentChild = child;

  child.on('error', (error) => {
    console.error('[Mobile Starter] Could not start Expo:', error.message);
    if (!shuttingDown) {
      console.log('[Mobile Starter] Retrying in 3 seconds...');
      setTimeout(startExpo, 3000);
    }
  });

  child.on('exit', (code, signal) => {
    currentChild = null;
    if (shuttingDown) {
      process.exit(code ?? 0);
      return;
    }

    console.warn(
      `[Mobile Starter] Expo process ended (code: ${code}, signal: ${signal}). Reconnecting tunnel in 3 seconds...`,
    );
    setTimeout(startExpo, 3000);
  });
}

process.on('SIGINT', () => {
  shuttingDown = true;
  if (currentChild) currentChild.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  shuttingDown = true;
  if (currentChild) currentChild.kill('SIGTERM');
  process.exit(0);
});

startExpo();
