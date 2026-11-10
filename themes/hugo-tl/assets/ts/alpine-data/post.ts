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
 * 代码块（全站单例）：通过事件委托处理复制与折叠，
 * 避免长文章中每个代码块都创建一个 Alpine 组件。
 */
const postCodeBlocks = () => ({
    init() {
        this.$el.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement | null
            if (!target) return
            const copyBtn = target.closest<HTMLElement>('[data-copy-code]')
            if (copyBtn) {
                event.preventDefault()
                this.copyCode(copyBtn)
                return
            }
            const toggleBtn = target.closest<HTMLElement>('[data-toggle-code]')
            if (toggleBtn) {
                event.preventDefault()
                this.toggleCode(toggleBtn)
            }
        })
    },
    /** 复制代码：移除行号节点后取纯文本 */
    async copyCode(btn: HTMLElement) {
        const block = btn.closest<HTMLElement>('[data-codeblock]')
        const codeEle = block?.querySelector('code')
        if (!block || !codeEle) return

        const clone = codeEle.cloneNode(true) as HTMLElement
        clone.querySelectorAll('.ln, .lnt').forEach((el) => el.remove())
        const text = (clone.textContent ?? '').replace(/\n+$/, '')

        try {
            await navigator.clipboard.writeText(text)
            if (!btn.dataset.original) {
                btn.dataset.original = btn.innerHTML
            }
            btn.textContent = block.dataset.copiedText || 'copied'
            setTimeout(() => {
                if (btn.dataset.original) btn.innerHTML = btn.dataset.original
            }, 1000)
        } catch {
            // 剪贴板不可用（非安全上下文等），静默失败
        }
    },
    /** 折叠/展开代码内容，并切换箭头方向 */
    toggleCode(btn: HTMLElement) {
        const block = btn.closest<HTMLElement>('[data-codeblock]')
        const content = block?.querySelector<HTMLElement>('[data-code-content]')
        if (!content) return

        const down = btn.querySelector<HTMLElement>('[data-icon="down"]')
        const left = btn.querySelector<HTMLElement>('[data-icon="left"]')
        const collapsed = content.hasAttribute('hidden')

        if (collapsed) {
            content.removeAttribute('hidden')
            btn.setAttribute('aria-expanded', 'true')
            down?.classList.remove('hidden')
            left?.classList.add('hidden')
        } else {
            content.setAttribute('hidden', '')
            btn.setAttribute('aria-expanded', 'false')
            down?.classList.add('hidden')
            left?.classList.remove('hidden')
        }
    },
})


export {tocHighlight, postCodeBlocks}
