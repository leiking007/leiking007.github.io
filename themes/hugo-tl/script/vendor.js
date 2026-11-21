#!/usr/bin/env node

/**
 * Vendor 库复制：把 npm 依赖中的按需前端资源复制到主题 static，
 * 产物不入 git（.gitignore 已忽略），每次 build/dev 时自动同步。
 *
 * - katex  : 仅当内容中存在 math: true 页面时复制 dist/katex.min.css + dist/fonts
 * - mermaid: 仅当内容中存在 mermaid 图表时复制 dist/mermaid.min.js
 *
 * 内容中未使用对应能力时会清掉旧产物，避免把无用的大文件带进发布目录。
 */
import {cpSync, existsSync, readFileSync, readdirSync, rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themeDir = resolve(__dirname, '..');
const projectRoot = resolve(themeDir, '..', '..');
const contentDir = resolve(projectRoot, 'content');

/**
 * 扫描 content 下的 Markdown，判断是否满足匹配条件
 * @param {RegExp} pattern
 * @returns {boolean}
 */
function contentMatches(pattern) {
    if (!existsSync(contentDir)) return false;
    return readdirSync(contentDir, {recursive: true})
        .filter((file) => typeof file === 'string' && file.endsWith('.md'))
        .some((file) => pattern.test(readFileSync(resolve(contentDir, file), 'utf8')));
}

const needKatex = contentMatches(/^\s*math:\s*true\s*$/m);
const needMermaid = contentMatches(/```mermaid|class=["']mermaid["']/);

const targets = [
    {src: 'katex/dist/katex.min.css', dest: 'static/lib/katex/katex.min.css', enabled: needKatex},
    {src: 'katex/dist/fonts', dest: 'static/lib/katex/fonts', enabled: needKatex},
    {src: 'mermaid/dist/mermaid.min.js', dest: 'static/lib/mermaid/mermaid.min.js', enabled: needMermaid},
];

/**
 * 同步复制 vendor 资源；依赖未安装或内容未使用对应能力时跳过
 */
export function vendorLibs() {
    for (const {src, dest, enabled} of targets) {
        const to = resolve(themeDir, dest);
        if (!enabled) {
            rmSync(to, {recursive: true, force: true});
            console.log(`[vendor] 跳过（内容未使用）：${dest}`);
            continue;
        }
        const from = resolve(themeDir, 'node_modules', src);
        if (!existsSync(from)) {
            console.warn(`[vendor] 跳过（依赖未安装）：node_modules/${src}`);
            continue;
        }
        cpSync(from, to, {recursive: true});
        console.log(`[vendor] 已复制：node_modules/${src} → ${dest}`);
    }
}
