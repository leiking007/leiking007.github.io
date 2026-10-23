declare const PagefindUI: any;

const backToTop = () => ({
    visible: false,
    init() {
        window.addEventListener('scroll', () => {
            this.visible = window.scrollY > 200;
        }, {passive: true});
    },
    scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
})

const imageLightbox = () => ({
    isOpen: false,
    imgEle: null,
    images: [],
    // 缩放状态：scale 固定以图片中心为锚点，配合平移量实现"指针处缩放不漂移"
    zoomLevel: 1,
    minZoom: 1,
    maxZoom: 4,
    translateX: 0,
    translateY: 0,
    // 拖拽状态
    isDragging: false,
    startX: 0,
    startY: 0,
    startTX: 0,
    startTY: 0,
    // 双指捏合状态
    pinchActive: false,
    pinchStartDist: 0,
    pinchStartScale: 1,
    // 单指滑动切图状态（未放大时）
    swipeStartX: null as number | null,
    swipeStartY: null as number | null,
    // 图片未缩放时的尺寸（平移边界计算用）
    baseImageWidth: 0,
    baseImageHeight: 0,
    init() {
        // 仅收集带 data-lightbox 标记的图片（render-image hook 与 hero 图输出该标记），避免误绑页面其他图片
        this.images = Array.from(document.getElementsByTagName("img")).filter(
            (img) => img.hasAttribute("data-lightbox") && !img.closest('[x-data~="imageLightbox"]')
        );
        for (let img of this.images) {
            img.addEventListener("click", () => {
                this.openWith(img)
            })
        }
    },
    openWith(img) {
        this.imgEle = img
        this.resetView()
        this.updateBaseDimensions()
        this.isOpen = true
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    },
    get currentIndex() {
        return this.imgEle ? this.images.indexOf(this.imgEle) : -1
    },
    get hasMultiple() {
        return this.images.length > 1
    },
    switchTo(img) {
        this.resetView()
        this.updateBaseDimensions()
        this.imgEle = img
    },
    prevImage() {
        if (!this.isOpen || !this.hasMultiple) return
        this.switchTo(this.images[(this.currentIndex - 1 + this.images.length) % this.images.length])
    },
    nextImage() {
        if (!this.isOpen || !this.hasMultiple) return
        this.switchTo(this.images[(this.currentIndex + 1) % this.images.length])
    },
    get currentImageSrc() {
        return this.imgEle ? this.imgEle.getAttribute("src") : ''
    },
    get currentImageAlt() {
        return this.imgEle ? this.imgEle.getAttribute("alt") : '图片加载失败'
    },
    closeLightbox() {
        this.isOpen = false
        this.resetView()
        // 延迟500ms清理图片
        setTimeout(()=>{
          this.imgEle = null
        },500)
        document.body.style.overflow = ''; // 恢复背景滚动
    },
    isZoomed() {
        return this.zoomLevel > 1.001;
    },
    resetView() {
        this.zoomLevel = 1;
        this.translateX = 0;
        this.translateY = 0;
    },

    /**
     * 缩放到指定倍数。
     * 传入视口坐标 (clientX, clientY) 时，缩放前后保持该点下的图像内容不动（指针处缩放）；
     * 不传时以图片中心为锚点（按钮/键盘/重置）。
     */
    zoomTo(nextScale, clientX, clientY) {
        const clamped = Math.min(this.maxZoom, Math.max(this.minZoom, nextScale));
        const ratio = clamped / this.zoomLevel;
        if (Math.abs(ratio - 1) < 1e-6) return;

        if (clientX != null) {
            const img = this.$refs.lightboxImage;
            if (!img) return;
            const rect = img.getBoundingClientRect();
            // 指针相对当前图片中心的屏幕距离
            const dx = clientX - (rect.left + rect.width / 2);
            const dy = clientY - (rect.top + rect.height / 2);
            // 平移补偿：缩放后指针下的像素保持不动
            this.translateX = dx * (1 - ratio) + this.translateX * ratio;
            this.translateY = dy * (1 - ratio) + this.translateY * ratio;
        } else {
            // 无锚点：围绕中心等比缩放位移
            this.translateX *= ratio;
            this.translateY *= ratio;
        }
        this.zoomLevel = clamped;
        this.clampPan();
        if (this.zoomLevel <= this.minZoom + 1e-6) this.resetView();
    },
    zoomIn() {
        this.zoomTo(this.zoomLevel * 1.25);
    },
    zoomOut() {
        this.zoomTo(this.zoomLevel / 1.25);
    },
    handleWheel(event) {
        // 比率式步进：滚轮一格约 ±20%，触控板按 deltaY 平滑缩放
        const factor = Math.exp(-event.deltaY * 0.002);
        this.zoomTo(this.zoomLevel * factor, event.clientX, event.clientY);
    },
    handleDblClick(event) {
        if (this.isZoomed()) {
            this.resetView();
        } else {
            this.zoomTo(2.5, event.clientX, event.clientY);
        }
    },
    onKeydown(event) {
        if (!this.isOpen) return;
        if (event.key === '+' || event.key === '=') {
            event.preventDefault();
            this.zoomIn();
        } else if (event.key === '-') {
            event.preventDefault();
            this.zoomOut();
        } else if (event.key === '0') {
            event.preventDefault();
            this.resetView();
        }
    },

    // ---------- 拖拽与捏合 ----------
    startPan(event) {
        if (event.type === 'touchstart') {
            if (event.touches.length === 2) {
                // 进入双指捏合，取消单指拖拽
                this.pinchActive = true;
                this.isDragging = false;
                this.pinchStartDist = this.getTouchDist(event.touches);
                this.pinchStartScale = this.zoomLevel;
            } else if (event.touches.length === 1 && this.isZoomed()) {
                this.beginDrag(event.touches[0]);
            } else if (event.touches.length === 1) {
                // 未放大：记录滑动起点，touchend 时判定左右滑动切图
                this.swipeStartX = event.touches[0].clientX;
                this.swipeStartY = event.touches[0].clientY;
            }
            return;
        }
        if (!this.isZoomed()) return; // 未放大时不拖拽
        event.preventDefault(); // 阻止浏览器默认的图片拖拽/文字选择
        this.beginDrag(event);
    },
    beginDrag(point) {
        this.isDragging = true;
        this.startX = point.clientX;
        this.startY = point.clientY;
        this.startTX = this.translateX;
        this.startTY = this.translateY;
    },
    performDrag(event) {
        if (event.type === 'touchmove') {
            if (this.pinchActive && event.touches.length >= 2) {
                event.preventDefault();
                if (this.pinchStartDist > 0) {
                    const mid = this.getTouchMid(event.touches);
                    this.zoomTo(this.pinchStartScale * this.getTouchDist(event.touches) / this.pinchStartDist, mid.x, mid.y);
                }
                return;
            }
            if (!this.isDragging || event.touches.length !== 1) return;
            event.preventDefault();
            this.moveDrag(event.touches[0]);
            return;
        }
        if (!this.isDragging) return;
        this.moveDrag(event);
    },
    moveDrag(point) {
        this.translateX = this.startTX + (point.clientX - this.startX);
        this.translateY = this.startTY + (point.clientY - this.startY);
        this.clampPan();
    },
    stopDrag() {
        this.isDragging = false;
    },
    onTouchEnd(event) {
        if (event.touches.length < 2) this.pinchActive = false;
        if (event.touches.length === 0) {
            this.isDragging = false;
            // 未放大时单指左右快滑切换图片（水平位移超过 50px 且远大于垂直位移）
            if (this.swipeStartX != null && this.isOpen && this.hasMultiple) {
                const dx = event.changedTouches[0].clientX - this.swipeStartX;
                const dy = event.changedTouches[0].clientY - this.swipeStartY;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                    dx < 0 ? this.nextImage() : this.prevImage();
                }
            }
            this.swipeStartX = null;
            this.swipeStartY = null;
        }
    },
    getTouchDist(touches) {
        return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    },
    getTouchMid(touches) {
        return {
            x: (touches[0].clientX + touches[1].clientX) / 2,
            y: (touches[0].clientY + touches[1].clientY) / 2
        };
    },

    // 平移边界：限制缩放后图片边缘不脱离容器（origin 固定为中心，位移极限为溢出量的一半）
    clampPan() {
        const container = this.$refs.imageContainer;
        if (!container || !this.baseImageWidth || !this.baseImageHeight) return;

        const limitX = Math.max(0, (this.baseImageWidth * this.zoomLevel - container.clientWidth) / 2);
        const limitY = Math.max(0, (this.baseImageHeight * this.zoomLevel - container.clientHeight) / 2);

        this.translateX = Math.max(-limitX, Math.min(limitX, this.translateX));
        this.translateY = Math.max(-limitY, Math.min(limitY, this.translateY));
    },
    cursorStyle() {
        if (this.isDragging) return 'grabbing';
        if (this.isZoomed()) return 'grab';
        return 'zoom-in';
    },

    // 图片加载完成或切换时记录未缩放尺寸
    updateBaseDimensions() {
        this.$nextTick(() => {
            const img = this.$refs.lightboxImage;
            if (img) {
                this.baseImageWidth = img.clientWidth;
                this.baseImageHeight = img.clientHeight;
            }
        });
    },
})


const themeSwitcher = () => ({
    open: false,
    current: 'theme-light',
    themes: [
        {id: 'theme-light', label: 'Light', color: 'oklch(45% 0.24 277.023)'},
        {id: 'theme-dark', label: 'Dark', color: 'oklch(58% 0.233 277.117)'},
        {id: 'theme-cupcake', label: 'Cupcake', color: 'oklch(85% 0.138 181.071)'},
        {id: 'theme-retro', label: 'Retro', color: 'oklch(80% 0.114 19.571)'},
    ],
    init() {
        const saved = localStorage.getItem('tl-theme')
        const id = this.themes.some(t => t.id === saved) ? saved : 'theme-light'
        this.apply(id)
    },
    apply(id) {
        const html = document.documentElement
        for (let t of this.themes) {
            html.classList.remove(t.id)
        }
        html.classList.add(id)
        this.current = id
        localStorage.setItem('tl-theme', id)
    },
})

/**
 * 文章页顶部阅读进度条
 */
const readingProgress = () => ({
    progress: 0,
    init() {
        const onScroll = () => {
            const doc = document.documentElement;
            const total = doc.scrollHeight - doc.clientHeight;
            this.progress = total > 0 ? Math.min(100, Math.round((doc.scrollTop / total) * 100)) : 0;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    },
})

/**
 * 搜索弹窗：首次打开时才加载 pagefind UI 资源，避免每个页面都拉取搜索脚本
 * 支持 Ctrl/Cmd+K 全局快捷键唤起，加载完成后自动聚焦输入框
 * @param base pagefind 资源目录（由模板注入 relURL，兼容子路径部署）
 */
const searchLauncher = (base: string = '/search/') => ({
    open: false,
    loaded: false,
    init() {
        this.$watch('open', (val: boolean) => {
            if (val) this.loadPagefind()
        })
        // Ctrl/Cmd + K 唤起搜索
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault()
                this.openSearch()
            }
        })
    },
    openSearch() {
        this.open = true
    },
    loadPagefind() {
        if (this.loaded) return
        this.loaded = true
        const css = document.createElement('link')
        css.rel = 'stylesheet'
        css.href = `${base}pagefind-ui.css`
        document.head.appendChild(css)
        const js = document.createElement('script')
        js.src = `${base}pagefind-ui.js`
        js.onload = () => {
            new PagefindUI({
                element: "#search",
                showSubResults: false,
                pageSize: 7,
                showImages: false,
                excerptLength: 15
            })
            // 弹窗打开后聚焦搜索输入框
            document.querySelector<HTMLInputElement>('#search input')?.focus()
        }
        document.body.appendChild(js)
    },
})

export {backToTop, imageLightbox, readingProgress, themeSwitcher, searchLauncher}
