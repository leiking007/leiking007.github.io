#!/usr/bin/env node

import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {existsSync} from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// 通过 config 定位根目录
let root = __dirname;
while (!existsSync(resolve(root, 'config'))) {
  root = resolve(root, '..');
}

/**
 * 执行终端命令的工具函数
 * @param dir 命令执行和目录
 * @param {string} cmd - 要执行的命令
 * @param {string} desc - 命令描述（用于日志输出）
 */
function runCommand(dir, cmd, desc) {
  console.log(`\n=== 开始执行：${desc} ===`);
  console.log(`命令：${cmd}`);
  try {
    // 执行命令，同步阻塞（确保串行执行），并输出命令的日志
    execSync(cmd, {
      cwd: dir, // 命令执行的工作目录（切换到项目根目录，避免路径混乱）
      stdio: 'inherit'  // 让命令的输出（如 Tailwind、Hugo 的日志）直接显示在终端
    });
    console.log(`=== 执行成功：${desc} ===\n`);
  } catch (err) {
    console.error(`\n=== 执行失败：${desc} ===`);
    console.error(`错误信息：${err.message}`);
    process.exit(1); // 执行失败时退出脚本，返回非 0 状态码（npm 会识别为构建失败）
  }
}


// 1. 执行 build:css（Tailwind CSS 编译）
const buildCssCmd = 'npx @tailwindcss/cli -i ./assets/css/main.css -o ./assets/css/style.css -m';
runCommand(resolve(root, 'themes/hugo-tl'), buildCssCmd, 'Tailwind CSS 编译');

// 2. 执行 build:hugo（Hugo 构建静态站点）
const buildHugoCmd = 'hugo --minify';
runCommand(root, buildHugoCmd, 'Hugo 构建静态站点');

// 3. 执行 build:pagefind（PageFind 生成搜索索引）
const buildPagefindCmd = 'npx pagefind --site ./public --output-subdir search'; // 基于项目根目录的 public 目录
runCommand(root, buildPagefindCmd, 'PageFind 生成搜索索引');

// 所有命令执行完成
console.log('\n✅ 所有 build 命令执行完成！');
