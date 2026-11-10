/**
 * 花密生成器独立入口：仅在花密页面（flower_passwd）加载。
 * 使用浏览器原生 Web Crypto 计算 SHA-256，不再打包 crypto-js（约 230KB）。
 */

/**
 * 计算字符串的 SHA-256 十六进制摘要
 * @param text 待摘要文本
 */
const sha256Hex = async (text: string) => {
    const data = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const flowerPasswordGenerator = () => ({
    memoryPassword: 'tl123456',  // 记忆密码, 默认为 'tl123456'
    distinguishCode: '',
    init() {
        const update = async () => {
            const password = await this.generatePassword()
            if (this.$refs.passwdRef) {
                this.$refs.passwdRef.innerText = password
            }
        }
        this.$watch('memoryPassword', update)
        this.$watch('distinguishCode', update)
    },
    async generatePassword() {
        const memoryPassword = this.memoryPassword.trim();
        const distinguishCode = this.distinguishCode.trim();
        if (memoryPassword && distinguishCode) {
            const hashPasswordStr = await sha256Hex(memoryPassword)
            const hashCodeStr = await sha256Hex(distinguishCode)
            const passwdArr: string[] = []
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

// main.ts（head 中 defer）已先执行并暴露 window.Alpine，
// 本脚本（页面底部 defer）随后执行完成组件注册，Alpine.start() 在 DOMContentLoaded 时统一启动
window.Alpine?.data('flowerPasswordGenerator', flowerPasswordGenerator)
