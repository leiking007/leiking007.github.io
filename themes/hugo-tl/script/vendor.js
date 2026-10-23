#!/usr/bin/env node

/**
 * Vendor 库复制：把 npm 依赖中的按需前端资源复制到主题 static，
 * 产物不入 git（.gitignore 已忽略），每次 build/dev 时自动同步。
 *
 * - katex  : dist/katex.min.css + dist/fonts  → static/lib/katex/（KaTeX 样式与字体，页面配置 math: true 时引入）
 * - mermaid: dist/mermaid.min.js              → static/lib/mermaid/（Mermaid UMD 包，页面存在图表时按需加载）
 */
import {cpSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themeDir = resolve(__dirname, '..');

const targets = [
    {src: 'katex/dist/katex.min.css', dest: 'static/lib/katex/katex.min.css'},
    {src: 'katex/dist/fonts', dest: 'static/lib/katex/fonts'},
    {src: 'mermaid/dist/mermaid.min.js', dest: 'static/lib/mermaid/mermaid.min.js'},
];

/**
 * 同步复制 vendor 资源；依赖未安装时跳过并告警（不中断构建，仅对应功能不可用）
 */
export function vendorLibs() {
    for (const {src, dest} of targets) {
        const from = resolve(themeDir, 'node_modules', src);
        const to = resolve(themeDir, dest);
        if (!existsSync(from)) {
            console.warn(`[vendor] 跳过（依赖未安装）：node_modules/${src}`);
            continue;
        }
        cpSync(from, to, {recursive: true});
        console.log(`[vendor] 已复制：node_modules/${src} → ${dest}`);
    }
}
