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
        console.log('tocHighlight destroy');
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
 */
const postCodeBlock = () => ({
    showCode: true,  // 是否显示代码块
    /** 复制代码 */
    copyCode() {
        const codeBlock = this.$refs.codeBlock
        const copyBtn = this.$el
        if (!this.copyInnerHTML) {
            this.copyInnerHTML = copyBtn.innerHTML;
        }
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
                                copyBtn.innerHTML = this.copyInnerHTML
                            }, 1000)
                        }
                    })
            } catch (e) {
            }
        }
    },

})


export {tocHighlight, postCodeBlock}