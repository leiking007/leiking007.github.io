#!/usr/bin/env node

import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, watch } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
let root = __dirname;
while (!existsSync(resolve(root, 'config'))) {
  root = resolve(root, '..');
}

// 存储所有子进程，用于在退出时终止
const childProcesses = [];

/**
 * 异步执行终端命令的工具函数（支持并行执行并正确输出）
 * @param {string} dir 命令执行目录
 * @param {string} cmd - 要执行的命令
 * @param {string} desc - 命令描述（用于日志输出）
 * @returns {Promise<void>}
 */
function runCommand(dir, cmd, desc) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== 开始执行：${desc} ===`);
    console.log(`命令：${cmd}`);

    const child = exec(cmd, {
      cwd: dir,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    childProcesses.push(child);

    child.stdout.on('data', (data) => {
      process.stdout.write(`[${desc}] ${data}`);
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(`[${desc}] ${data}`);
    });

    child.on('close', (code) => {
      const index = childProcesses.indexOf(child);
      if (index > -1) {
        childProcesses.splice(index, 1);
      }

      if (code === 0) {
        console.log(`=== 执行成功：${desc} ===\n`);
        resolve();
      } else {
        reject(new Error(`命令执行失败，退出码：${code}（${desc}）`));
      }
    });

    child.on('error', (err) => {
      reject(new Error(`命令执行错误：${err.message}（${desc}）`));
    });
  });
}

// 终止所有正在运行的子进程
function killAllChildProcesses() {
  childProcesses.forEach((child) => {
    if (!child.killed) {
      console.log(`终止进程 ${child.pid}...`);
      child.kill();
    }
  });
}

// Pagefind 索引重建（防抖，避免 Hugo 频繁写 public 时重复构建）
let pagefindTimer = null;
let pagefindRunning = false;
function schedulePagefind(delay = 5000) {
  if (pagefindTimer) clearTimeout(pagefindTimer);
  pagefindTimer = setTimeout(async () => {
    if (pagefindRunning) {
      schedulePagefind(delay);
      return;
    }
    if (!existsSync(resolve(root, 'public'))) {
      schedulePagefind(delay);
      return;
    }
    pagefindRunning = true;
    try {
      await runCommand(root, 'npx pagefind --site ./public --output-subdir search', 'Pagefind 索引重建');
    } catch (err) {
      console.error(err.message);
    } finally {
      pagefindRunning = false;
    }
  }, delay);
}

// 监听 public 目录变化，自动重建搜索索引
function watchPublic() {
  const publicDir = resolve(root, 'public');
  if (!existsSync(publicDir)) {
    setTimeout(watchPublic, 3000);
    return;
  }
  watch(publicDir, { recursive: true }, () => schedulePagefind());
  schedulePagefind(1000);
}

try {
  const commands = [
    // 1. Tailwind CSS 监听编译
    runCommand(
      resolve(root, 'themes/hugo-tl'),
      'npx @tailwindcss/cli -i ./assets/css/main.css -o ./assets/css/style.css -w',
      'Tailwind CSS 编译'
    ),

    // 2. Hugo 开发服务器
    runCommand(
      root,
      'hugo server --gc --noHTTPCache --noBuildLock --port 1313 --bind 0.0.0.0',
      'Hugo 构建静态站点'
    )
  ];

  // 3. 搜索索引：跟随 public 变化自动重建（此前只在启动时构建一次，索引会陈旧）
  watchPublic();

  await Promise.all(commands);
  console.log('\n✅ 所有 dev 命令执行完成！');
} catch (err) {
  console.error(`\n=== 执行失败：${err.message} ===`);
  killAllChildProcesses();
  process.exit(1);
}

// Ctrl+C 退出时清理所有子进程
process.on('SIGINT', () => {
  console.log('\n正在退出，清理子进程...');
  killAllChildProcesses();
  process.exit(0);
});
