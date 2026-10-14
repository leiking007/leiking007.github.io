import * as CryptoJS from 'crypto-js';

const backToTop = () => ({
    visible: false,
    init() {
        window.onscroll = () => {
            this.visible = window.scrollY > 200;
        };
    },
    scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
})

const imageLightbox = () => ({
    isOpen: false,
    isLoading: true,
    imgEle: null,
    // Zoom state
    zoomLevel: 1,
    minZoom: 0.5,
    maxZoom: 5,
    zoomStep: 0.1,
    transformOrigin: '50% 50%',
    // 是否处于缩放过渡动画中（滚轮/按钮缩放时短暂启用，拖动时关闭）
    zoomTransition: false,
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
    // 内部状态
    _dragFrame: null,
    _zoomTransitionTimer: null,
    _suppressClick: false,
    _preloader: null,

    init() {
        // 只对带 data-lightbox 的内容图片绑定点击事件
        document.querySelectorAll('img[data-lightbox]').forEach((img: HTMLImageElement) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(img);
            });
        });
    },

    get currentImageSrc() {
        return this.imgEle ? this.imgEle.getAttribute('src') : ''
    },
    get currentImageAlt() {
        return this.imgEle ? (this.imgEle.getAttribute('alt') || '') : '图片加载失败'
    },

    // 打开灯箱
    openLightbox(img: HTMLImageElement) {
        if (this.isOpen && this.imgEle === img) return;
        this.imgEle = img;
        this.isLoading = true;
        // 每次打开都复位缩放与平移，避免上一次状态残留
        this.resetView();

        // 预加载图片，加载完成后淡入并计算基准尺寸
        const src = this.currentImageSrc;
        if (src) {
            const preloader = new Image();
            preloader.onload = () => {
                this.isLoading = false;
                this.$nextTick(() => this.updateBaseDimensions());
            };
            preloader.onerror = () => {
                this.isLoading = false;
            };
            preloader.src = src;
            this._preloader = preloader;
        } else {
            this.isLoading = false;
        }

        this.isOpen = true;
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    },

    closeLightbox() {
        this.isOpen = false;
        document.body.style.overflow = ''; // 恢复背景滚动
        // 延迟清理图片：关闭动画期间保持图片可见，避免闪烁；若期间重新打开则跳过
        setTimeout(() => {
            if (!this.isOpen) {
                this.imgEle = null;
                this.resetView();
            }
        }, 300);
    },

    // 点击遮罩关闭（拖拽结束后松开不触发关闭）
    onOverlayClick() {
        if (this._suppressClick) {
            this._suppressClick = false;
            return;
        }
        this.closeLightbox();
    },

    isZoomed() {
        return this.zoomLevel !== 1;
    },

    // 复位缩放与平移
    resetView() {
        this.zoomLevel = 1;
        this.currentImageX = 0;
        this.currentImageY = 0;
        this.transformOrigin = '50% 50%';
        this.zoomTransition = false;
        this.isDragging = false;
        if (this._dragFrame) {
            cancelAnimationFrame(this._dragFrame);
            this._dragFrame = null;
        }
        if (this._zoomTransitionTimer) {
            clearTimeout(this._zoomTransitionTimer);
            this._zoomTransitionTimer = null;
        }
    },

    // 按钮缩放
    zoomBy(dir: number) {
        let target = this.zoomLevel + dir * this.zoomStep;
        target = Math.max(this.minZoom, Math.min(this.maxZoom, target));
        if (Math.abs(target - 1) < this.zoomStep / 2) target = 1;
        this.zoomLevel = target;
        this.transformOrigin = '50% 50%';
        this.zoomTransition = true;
        this._scheduleZoomTransitionEnd();
        this.clampPan();
    },

    handleWheel(event: WheelEvent) {
        if (!this.$refs.lightboxImage) return;

        const imgElement = this.$refs.lightboxImage;
        const rect = imgElement.getBoundingClientRect();

        // 计算鼠标在图片内的相对位置 (百分比)，限制在 0-100
        const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
        this.transformOrigin = `${x}% ${y}%`;

        // 指数式缩放，观感更平滑
        const factor = event.deltaY < 0 ? 1 + this.zoomStep : 1 - this.zoomStep;
        let target = this.zoomLevel * factor;
        target = Math.max(this.minZoom, Math.min(this.maxZoom, target));
        if (Math.abs(target - 1) < this.zoomStep / 2) target = 1;

        this.zoomLevel = target;
        this.zoomTransition = true;
        this._scheduleZoomTransitionEnd();

        if (target === 1) {
            // 回到 100% 时复位
            this.transformOrigin = '50% 50%';
            this.currentImageX = 0;
            this.currentImageY = 0;
        } else {
            this.clampPan();
        }
    },

    _scheduleZoomTransitionEnd() {
        if (this._zoomTransitionTimer) clearTimeout(this._zoomTransitionTimer);
        this._zoomTransitionTimer = setTimeout(() => {
            this.zoomTransition = false;
        }, 180);
    },

    // 图片内联过渡：加载淡入 / 缩放平滑 / 拖动时禁用（保证跟手）
    get imgTransition() {
        if (this.isLoading) return 'opacity 0.25s ease-in';
        if (this.zoomTransition) return 'transform 0.15s ease-out';
        return 'none';
    },

    onImageLoad() {
        this.isLoading = false;
        this.$nextTick(() => this.updateBaseDimensions());
    },

    updateBaseDimensions() {
        if (!this.$refs.lightboxImage) return;
        // clientWidth/Height 不受 transform 影响，始终为未缩放尺寸
        this.baseImageWidth = this.$refs.lightboxImage.clientWidth;
        this.baseImageHeight = this.$refs.lightboxImage.clientHeight;
        this.clampPan();
    },

    initDrag(event: MouseEvent | TouchEvent) {
        if (!this.isZoomed() || !this.$refs.lightboxImage) return; // Only drag if zoomed
        event.preventDefault(); // Prevent browser's default image drag or text selection

        // 拖动时关闭过渡动画，保证跟手
        this.zoomTransition = false;
        if (this._zoomTransitionTimer) {
            clearTimeout(this._zoomTransitionTimer);
            this._zoomTransitionTimer = null;
        }
        this._suppressClick = false;
        this.isDragging = true;
        const evt = event.type === 'touchstart' ? (event as TouchEvent).touches[0] : (event as MouseEvent);
        this.startX = evt.clientX;
        this.startY = evt.clientY;
        this.initialImageX = this.currentImageX;
        this.initialImageY = this.currentImageY;
    },

    performDrag(event: MouseEvent | TouchEvent) {
        if (!this.isDragging || !this.isZoomed()) return;
        if (event.cancelable) event.preventDefault();

        const evt = event.type === 'touchmove' ? (event as TouchEvent).touches[0] : (event as MouseEvent);
        const targetX = this.initialImageX + (evt.clientX - this.startX);
        const targetY = this.initialImageY + (evt.clientY - this.startY);

        // rAF 节流，避免高频事件导致卡顿
        if (this._dragFrame) return;
        this._dragFrame = requestAnimationFrame(() => {
            this._dragFrame = null;
            this.currentImageX = targetX;
            this.currentImageY = targetY;
            this.clampPan();
        });
    },

    stopDrag(event?: MouseEvent | TouchEvent) {
        if (!this.isDragging) return;
        this.isDragging = false;
        if (this._dragFrame) {
            cancelAnimationFrame(this._dragFrame);
            this._dragFrame = null;
        }
        // 判断是否为一次真实拖拽（移动距离超过阈值），拖拽结束后松开不触发点击关闭
        let moved = false;
        if (event) {
            const evt = event.type === 'touchend'
                ? (event as TouchEvent).changedTouches[0]
                : (event as MouseEvent);
            if (evt) {
                const dx = evt.clientX - this.startX;
                const dy = evt.clientY - this.startY;
                moved = Math.abs(dx) + Math.abs(dy) > 3;
            }
        }
        this._suppressClick = moved;
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
        return 'zoom-in';
    },
})


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

const flowerPasswordGenerator = () => ({
    memoryPassword: 'tl123456',  // 记忆密码, 默认为 'tl123456'
    distinguishCode: '',
    init() {
        this.$watch('distinguishCode', (newValue: string) => {
            const passwd = this.generatePassword()
            if (passwd) {
                this.distinguishCode = newValue
                this.$refs.passwdRef.innerText = passwd
            } else {
                this.$refs.passwdRef.innerText = ''
            }
        })
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

export {backToTop, imageLightbox, readingProgress, flowerPasswordGenerator}
