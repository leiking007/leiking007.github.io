import Alpine from "alpinejs/dist/module.esm.js"
import AlpineFocus from '@alpinejs/focus/dist/module.esm.js'
import collapse from '@alpinejs/collapse/dist/module.esm.js'
import {postCodeBlock, tocHighlight} from "./alpine-data/post"
import {backToTop,imageLightbox, flowerPasswordGenerator} from "./alpine-data/common"

declare global {
    interface Window {
        Alpine: Alpine
    }
}

// 聚焦元素插件
Alpine.plugin(AlpineFocus)
// 折叠插件
Alpine.plugin(collapse)

// 返回顶部按钮
Alpine.data('backToTop', backToTop);

// 文章页代码高亮
Alpine.data('tocHighlight', tocHighlight);

// 文章页代码块
Alpine.data("postCodeBlock", postCodeBlock);

// 图片灯箱
Alpine.data('imageLightbox', imageLightbox);

// 花密生成器
Alpine.data('flowerPasswordGenerator', flowerPasswordGenerator);

window.Alpine = Alpine

window.addEventListener('load', () => {
    Alpine.start()
})





