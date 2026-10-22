/**
 * 目录高亮
 */
const tocHighlight = () => ({
    init() {
        const toc = this.$el.querySelector("#TableOfContents")
        if (toc) {
            this.createTocObserver();
        }
    },
    destroy() {
    },
    createTocObserver() {
        const headings = document.querySelectorAll("article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]")
        const setCurrentActive = () => {
            const allActive = this.$el.querySelectorAll(`#TableOfContents .active`)
            if (allActive.length === 0) {
                return
            } else {
                this.$el.querySelector(`#TableOfContents .current`)?.classList.remove('current');
                this.$el.querySelectorAll(`#TableOfContents .active`)[0]?.classList.add('current')
            }
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                if (entry.intersectionRatio > 0) {
                    this.$el.querySelector(`#TableOfContents li a[href="#${id}"]`)?.parentElement?.classList.add('active');
                } else {
                    this.$el.querySelector(`#TableOfContents li a[href="#${id}"]`)?.parentElement?.classList.remove('active');
                }
                setCurrentActive()
            });
        })

        // Track all sections that have an `id` applied
        headings.forEach((section) => {
            observer.observe(section);
        })
    }
})

/**
 * 代码块
 * @param copiedText 复制成功提示文案（由模板注入 i18n 文案）
 */
const postCodeBlock = (copiedText: string = 'copied') => ({
    showCode: true,  // 是否显示代码块
    copyInnerHTML: '',
    copiedText,
    /** 复制代码 */
    async copyCode() {
        const codeBlock = this.$refs.codeBlock as HTMLElement | undefined
        const copyBtn = this.$refs.copyBtn as HTMLElement | undefined
        if (!codeBlock || !copyBtn) return

        // 提取代码文本：克隆后移除行号节点，兼容行号/非行号两种 chroma 输出
        const codeEle = codeBlock.querySelector('code')
        if (!codeEle) return
        const clone = codeEle.cloneNode(true) as HTMLElement
        clone.querySelectorAll('.ln, .lnt').forEach((el) => el.remove())
        const text = (clone.textContent ?? '').replace(/\n+$/, '')

        try {
            await navigator.clipboard.writeText(text)
            if (!this.copyInnerHTML) {
                this.copyInnerHTML = copyBtn.innerHTML
            }
            copyBtn.innerHTML = this.copiedText
            setTimeout(() => {
                copyBtn.innerHTML = this.copyInnerHTML
            }, 1000)
        } catch {
            // 剪贴板不可用（非安全上下文等），静默失败
        }
    },
})


export {tocHighlight, postCodeBlock}
