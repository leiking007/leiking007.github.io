#!/usr/bin/env node

import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
let root = __dirname;
while (!existsSync(resolve(root, 'config'))) {
  root = resolve(root, '..');
}

// 存储所有子进程，用于在发生错误时终止
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

    // 调整stdio配置，确保输出正确显示
    const child = exec(cmd, {
      cwd: dir,
      // 分别处理stdin、stdout和stderr
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // 存储子进程引用
    childProcesses.push(child);

    // 处理标准输出，添加前缀以便区分不同命令的输出
    child.stdout.on('data', (data) => {
      process.stdout.write(`[${desc}] ${data}`);
    });

    // 处理错误输出
    child.stderr.on('data', (data) => {
      process.stderr.write(`[${desc}] ${data}`);
    });

    child.on('close', (code) => {
      // 从进程列表中移除已完成的进程
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

try {
  // 创建所有命令的Promise
  const commands = [
    // 1. 执行 build:css（Tailwind CSS 编译）
    runCommand(
      resolve(root, 'themes/hugo-tl'),
      'npx  @tailwindcss/cli -i ./assets/css/main.css -o ./assets/css/style.css -w',
      'Tailwind CSS 编译'
    ),

    // 2. 执行 build:hugo（Hugo 构建静态站点）
    runCommand(
      root,
      'hugo server --disableFastRender --gc --noHTTPCache --noBuildLock --logLevel debug --port 1313 --bind 0.0.0.0',
      'Hugo 构建静态站点'
    ),

    // 3. 执行 build:pagefind（PageFind 生成搜索索引）
    runCommand(
      root,
      'npx pagefind --site ./public --output-subdir search',
      'PageFind 生成搜索索引'
    )
  ];

  // 并行执行所有命令
  await Promise.all(commands);

  // 所有命令执行完成
  console.log('\n✅ 所有 build 命令执行完成！');
} catch (err) {
  console.error(`\n=== 执行失败：${err.message} ===`);
  // 终止所有剩余的子进程
  killAllChildProcesses();
  process.exit(1); // 退出整个脚本
}
