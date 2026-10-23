/**
 * 花密生成器独立入口：仅在花密页面（flower_passwd）加载，
 * crypto-js 不再打包进全站主 JS（main.ts）
 */
import * as CryptoJS from 'crypto-js';

const flowerPasswordGenerator = () => ({
    memoryPassword: 'tl123456',  // 记忆密码, 默认为 'tl123456'
    distinguishCode: '',
    init() {
        const update = () => {
            this.$refs.passwdRef.innerText = this.generatePassword()
        }
        this.$watch('memoryPassword', update)
        this.$watch('distinguishCode', update)
    },
    generatePassword() {
        const memoryPassword = this.memoryPassword.trim();
        const distinguishCode = this.distinguishCode.trim();
        if (memoryPassword && distinguishCode) {
            const hashPassword = CryptoJS.SHA256(memoryPassword);
            const hashCode = CryptoJS.SHA256(distinguishCode);
            // 将哈希值转换为字符串
            const hashPasswordStr = hashPassword.toString(CryptoJS.enc.Hex);
            const hashCodeStr = hashCode.toString(CryptoJS.enc.Hex);
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
