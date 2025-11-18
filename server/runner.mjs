import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

// Runner that executes code using docker containers. This is a scaffold and
// should be reviewed and hardened before use in production. Important security
// considerations are documented in server/README.md.

function makeTempDir() {
  const base = fs.mkdtemp(path.join(os.tmpdir(), 'vpt-run-'));
  return base;
}

function extensionsFor(lang) {
  switch (lang) {
    case 'javascript': return 'js';
    case 'python': return 'py';
    case 'go': return 'go';
    case 'java': return 'java';
    case 'rust': return 'rs';
    case 'kotlin': return 'kt';
    default: return 'txt';
  }
}

function dockerImageFor(lang) {
  switch (lang) {
    case 'javascript': return 'node:20-slim';
    case 'python': return 'python:3.11-slim';
    case 'go': return 'golang:1.22';
    case 'java': return 'openjdk:20-slim';
    case 'rust': return 'rust:1.73-slim';
    case 'kotlin': return 'kotlin:1.8.21';
    default: return null;
  }
}

function runDocker(args, options = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn('docker', args, options);
    let stdout = '';
    let stderr = '';
    p.stdout && p.stdout.on('data', d => stdout += String(d));
    p.stderr && p.stderr.on('data', d => stderr += String(d));
    p.on('error', err => reject(err));
    p.on('close', code => resolve({ code, stdout, stderr }));
  });
}

export async function runCode({ language, code, timeoutMs = 5000 }) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vpt-run-'));
  const ext = extensionsFor(language);
  const fileName = language === 'java' ? 'Main.java' : `script.${ext}`;
  const filePath = path.join(tmpDir, fileName);
  await fs.writeFile(filePath, code, 'utf8');

  const image = dockerImageFor(language);
  if (!image) throw new Error('No docker image for language');

  // Build the command executed inside the container for each language.
  let containerCmd = [];
  switch (language) {
    case 'javascript':
      containerCmd = ['node', `/workspace/${fileName}`];
      break;
    case 'python':
      containerCmd = ['python', `/workspace/${fileName}`];
      break;
    case 'go':
      // go run requires the file in module mode; 'go run file.go' works
      containerCmd = ['sh', '-c', `cd /workspace && go run ${fileName}`];
      break;
    case 'java':
      // compile then run
      containerCmd = ['sh', '-c', `javac /workspace/${fileName} -d /workspace && java -cp /workspace Main`];
      break;
    case 'rust':
      containerCmd = ['sh', '-c', `rustc /workspace/${fileName} -o /workspace/main && /workspace/main`];
      break;
    case 'kotlin':
      // using kotlinc to compile script to jar or run with kotlinc -script
      containerCmd = ['sh', '-c', `kotlinc /workspace/${fileName} -include-runtime -d /workspace/program.jar && java -jar /workspace/program.jar`];
      break;
    default:
      containerCmd = ['sh', '-c', `cat /workspace/${fileName}`];
  }

  // Docker run args: remove network, limit resources, mount workspace
  const dockerArgs = [
    'run', '--rm',
    '--network', 'none',
    '--memory', '256m',
    '--cpus', '0.5',
    '--pids-limit', '64',
    '-v', `${tmpDir}:/workspace:rw`,
    image,
    ...containerCmd
  ];

  // Spawn docker process with a timeout enforced by a timer; note that
  // child_process doesn't interrupt a blocking docker run automatically — we
  // use a timer to kill the child when exceeding timeoutMs.
  const child = spawn('docker', dockerArgs);
  let stdout = '';
  let stderr = '';
  let timedOut = false;

  child.stdout && child.stdout.on('data', d => stdout += String(d));
  child.stderr && child.stderr.on('data', d => stderr += String(d));

  const killTimer = setTimeout(() => {
    timedOut = true;
    try { child.kill('SIGKILL'); } catch (e) { /* ignore */ }
  }, timeoutMs);

  const exitCode = await new Promise((resolve) => {
    child.on('close', (code) => {
      clearTimeout(killTimer);
      resolve(code);
    });
    child.on('error', (err) => {
      clearTimeout(killTimer);
      stderr += String(err);
      resolve(1);
    });
  });

  // Cleanup temp dir
  try {
    // remove files then directory
    await fs.rm(tmpDir, { recursive: true, force: true });
  } catch (e) {
    // ignore cleanup errors
  }

  return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode, timedOut };
}
