import * as CryptoJS from 'crypto-js';

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
    // Zoom state
    zoomLevel: 1,
    minZoom: 0.5,
    maxZoom: 5, // 增加最大缩放，方便测试拖动
    zoomStep: 0.1,
    transformOrigin: '50% 50%',
    // Drag state
    isDragging: false,
    startX: 0,
    startY: 0,
    initialImageX: 0,
    initialImageY: 0,
    currentImageX: 0,
    currentImageY: 0,
    // Base dimensions for correct panning boundaries
    baseImageWidth: 0,
    baseImageHeight: 0,
    init() {
        // 收集文章内图片（排除灯箱自身元素），支持多图切换
        this.images = Array.from(document.getElementsByTagName("img")).filter(
            (img) => !img.closest('[x-data~="imageLightbox"]')
        );
        for (let img of this.images) {
            img.addEventListener("click", () => {
                this.openWith(img)
            })
        }
    },
    openWith(img) {
        this.imgEle = img
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
        this.resetZoom()
        this.currentImageX = 0
        this.currentImageY = 0
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
        this.resetZoom()
        this.currentImageX = 0
        this.currentImageY = 0
        // 延迟500ms清理图片
        setTimeout(()=>{
          this.imgEle = null
        },500)
        document.body.style.overflow = ''; // 恢复背景滚动
    },
    isZoomed() {
        return this.zoomLevel !== 1;
    },

    resetZoom() {
        this.zoomLevel = 1;
        this.transformOrigin = '50% 50%';
    },
    handleWheel(event) {
        if (!this.$refs.lightboxImage) return;

        const imgElement = this.$refs.lightboxImage;
        const rect = imgElement.getBoundingClientRect();

        // 计算鼠标在图片内的相对位置 (百分比)
        // clientX/Y 是视口坐标, rect.left/top 是元素左上角相对视口的坐标
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        this.transformOrigin = `${x}% ${y}%`;

        if (event.deltaY < 0) { // 向上滚动，放大
            this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + this.zoomStep);
        } else { // 向下滚动，缩小
            this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - this.zoomStep);
        }
        // 如果缩放回原始大小附近，则直接设为1，避免浮点数精度问题
        if (Math.abs(this.zoomLevel - 1) < this.zoomStep / 2) {
            this.zoomLevel = 1;
            this.transformOrigin = '50% 50%'; // 恢复中心原点
        }
    },
    initDrag(event) {
        if (!this.isZoomed() || !this.$refs.lightboxImage) return; // Only drag if zoomed
        event.preventDefault(); // Prevent browser's default image drag or text selection

        this.isDragging = true;
        const evt = event.type === 'touchstart' ? event.touches[0] : event;
        this.startX = evt.clientX;
        this.startY = evt.clientY;
        this.initialImageX = this.currentImageX;
        this.initialImageY = this.currentImageY;
    },

    performDrag(event) {
        if (!this.isDragging || !this.isZoomed()) return;

        const evt = event.type === 'touchmove' ? event.touches[0] : event;
        let dx = evt.clientX - this.startX;
        let dy = evt.clientY - this.startY;

        this.currentImageX = this.initialImageX + dx;
        this.currentImageY = this.initialImageY + dy;

        this.clampPan();
    },

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
        }
    },

    clampPan() {
        if (!this.$refs.imageContainer || !this.baseImageWidth || !this.baseImageHeight) return;

        const container = this.$refs.imageContainer;
        const scaledWidth = this.baseImageWidth * this.zoomLevel;
        const scaledHeight = this.baseImageHeight * this.zoomLevel;

        // How much the scaled image overflows its container
        const overflowX = Math.max(0, scaledWidth - container.clientWidth);
        const overflowY = Math.max(0, scaledHeight - container.clientHeight);

        // The pan limits are half the overflow, as transform-origin for pan is effectively center
        const limitX = overflowX / 2;
        const limitY = overflowY / 2;

        if (scaledWidth <= container.clientWidth) {
            this.currentImageX = 0; // No horizontal pan if image fits or is smaller
        } else {
            this.currentImageX = Math.max(-limitX, Math.min(limitX, this.currentImageX));
        }

        if (scaledHeight <= container.clientHeight) {
            this.currentImageY = 0; // No vertical pan if image fits or is smaller
        } else {
            this.currentImageY = Math.max(-limitY, Math.min(limitY, this.currentImageY));
        }
    },
    cursorStyle() {
        if (this.isDragging) return 'grabbing';
        if (this.isZoomed()) return 'grab';
        return 'auto';
    },

    // Called when image element @load event fires or when zoom needs reset
    updateBaseDimensions() {
        this.$nextTick(() => { // Ensure image is rendered
            if (this.$refs.lightboxImage) {
                // Get the dimensions of the image as it's contained within its parent, at scale 1
                // To do this accurately, temporarily ensure scale is 1 and translate is 0
                const tempZoom = this.zoomLevel;
                const tempX = this.currentImageX;
                const tempY = this.currentImageY;

                this.zoomLevel = 1;
                this.currentImageX = 0;
                this.currentImageY = 0;

                this.$nextTick(() => {
                    if(this.$refs.lightboxImage) {
                        this.baseImageWidth = this.$refs.lightboxImage.clientWidth;
                        this.baseImageHeight = this.$refs.lightboxImage.clientHeight;
                    }
                    // Restore original zoom ONLY if it was intentional,
                    // otherwise it's a reset scenario. For simplicity, new image always resets.
                    if (this.isZoomed() && tempZoom !== 1) { // if it was already zoomed
                        this.zoomLevel = tempZoom;
                        this.currentImageX = tempX; // Pan might need re-clamping
                        this.currentImageY = tempY;
                        this.clampPan(); // re-clamp pan after potential base dimension change
                    } else {
                        // If it wasn't zoomed or new image, keep it reset
                        this.zoomLevel = 1;
                        this.currentImageX = 0;
                        this.currentImageY = 0;
                    }
                });
            }
        });
    },
})


const flowerPasswordGenerator = () => ({
    memoryPassword: '',  // 记忆密码
    distinguishCode: '',
    init() {
        const update = () => {
            this.$refs.passwdRef.innerText = this.generatePassword()
        }
        this.$watch('memoryPassword', update)
        this.$watch('distinguishCode', update)
    },
    generatePassword() {
        // 在此处编写生成密码的逻辑
        const memoryPassword = this.memoryPassword.trim();
        const distinguishCode = this.distinguishCode.trim();
        if (memoryPassword && distinguishCode) {
            // 生成密码的逻辑
            const hashPassword = CryptoJS.SHA256(memoryPassword);
            const hashCode = CryptoJS.SHA256(distinguishCode);
            // 将哈希值转换为字符串
            const hashPasswordStr = hashPassword.toString(CryptoJS.enc.Hex);
            const hashCodeStr = hashCode.toString(CryptoJS.enc.Hex);
            const passwdArr: String[] = []
            for (let i = 0; i < 6; i++) {
                passwdArr.push(hashPasswordStr[i * 3])
                passwdArr.push(hashCodeStr[i * 7])
            }
            if (!isNaN(Number(passwdArr[0])) && passwdArr[0].trim() !== '') {
                passwdArr[0] = "K"
            } else {
                passwdArr[0] = passwdArr[0].toUpperCase()
            }
            return passwdArr.join('')
        }
        return '';
    },
    clearInputs() {
        this.memoryPassword = '';
        this.distinguishCode = '';
    }
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
 * 搜索弹窗：首次打开时才加载 pagefind UI 资源，避免每个页面都拉取搜索脚本
 * @param base pagefind 资源目录（由模板注入 relURL，兼容子路径部署）
 */
const searchLauncher = (base: string = '/search/') => ({
    open: false,
    loaded: false,
    init() {
        this.$watch('open', (val: boolean) => {
            if (val) this.loadPagefind()
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
        }
        document.body.appendChild(js)
    },
})

export {backToTop, imageLightbox, flowerPasswordGenerator, themeSwitcher, searchLauncher}
