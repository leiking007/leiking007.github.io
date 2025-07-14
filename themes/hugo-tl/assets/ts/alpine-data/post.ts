/**
 * 目录高亮
 */
const tocHighlight = () => ({
    activeId: '',

    init() {
        // 监听滚动事件
        window.addEventListener('scroll', this.highlightActiveSection);
    },

    highlightActiveSection() {
        // 获取所有目录项
        const tocItems: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.TableOfContents a');
        let currentActiveId = '';

        tocItems.forEach(item => {
            const section = document.getElementById(item.hash.substring(1));
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    currentActiveId = item.hash.substring(1);
                }
            }
        });

        // 更新高亮状态
        if (currentActiveId !== this.activeId) {
            this.activeId = currentActiveId;
            tocItems.forEach(item => {
                item.classList.toggle('active', item.hash.substring(1) === this.activeId);
            });
        }
    },

    destroy() {
        // 移除滚动事件监听
        window.removeEventListener('scroll', this.highlightActiveSection);
    }
})

/**
 * 代码块
 */
const codeBlock = () => ({
    showCode: true,  // 是否显示代码块
    /** 复制代码 */
    copyCode() {
        const codeBlock = this.$refs.codeBlock
        const copyBtn = this.$el
        let codeEle = codeBlock.firstElementChild?.firstElementChild?.firstElementChild
        if (codeEle instanceof HTMLElement) {
            let text = ''
            for (let child of codeEle.children) {
                text += child.lastElementChild.textContent
            }
            try {
                Promise.all([navigator.clipboard.writeText(text)])
                    .then(() => {
                        if (copyBtn instanceof HTMLElement) {
                            copyBtn.innerHTML = "copied"
                            setTimeout(() => {
                                copyBtn.innerHTML = "<i class=\"iconfont icon-fuzhi\"></i>"
                            }, 1000)
                        }
                    })
            } catch (e) {
            }
        }
    },

})




export {tocHighlight,codeBlock}