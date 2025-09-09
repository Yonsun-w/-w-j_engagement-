// 阿里云OSS祝福数据管理
class WishesOSS {
    constructor() {
        this.ossClient = null;
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = OSS_CONFIG.maxRetries || 3;
        this.cacheTTL = 5 * 60 * 1000; // 缓存5分钟
        this.lastFetchTime = 0;
        this.cachedWishes = null;
        
        this.init();
    }
    
    async init() {
        try {
            this.ossClient = createOSSClient();
            this.isInitialized = !!this.ossClient;
            
            if (!this.isInitialized) {
                console.warn('OSS客户端初始化失败，将使用本地存储');
            } else {
                console.log('OSS客户端初始化成功');
                // 预热：尝试读取一次数据
                await this.getWishes();
            }
        } catch (error) {
            console.error('OSS初始化错误:', error);
            this.isInitialized = false;
        }
    }
    
    // 从OSS读取祝福数据
    async getWishesFromOSS() {
        if (!this.isInitialized) {
            throw new Error('OSS未初始化');
        }
        
        try {
            const result = await this.ossClient.get(OSS_CONFIG.wishesFile);
            const content = result.content.toString();
            const data = JSON.parse(content);
            
            // 验证数据格式
            if (!Array.isArray(data.wishes)) {
                throw new Error('数据格式错误');
            }
            
            console.log(`从OSS读取到${data.wishes.length}条祝福`);
            return data.wishes;
            
        } catch (error) {
            if (error.code === 'NoSuchKey') {
                // 文件不存在，创建初始数据
                console.log('OSS文件不存在，创建初始数据');
                await this.saveWishesToOSS([]);
                return [];
            }
            throw error;
        }
    }
    
    // 将祝福数据保存到OSS
    async saveWishesToOSS(wishes) {
        if (!this.isInitialized) {
            throw new Error('OSS未初始化');
        }
        
        const data = {
            wishes: wishes,
            lastUpdate: new Date().toISOString(),
            version: Date.now()
        };
        
        try {
            const result = await this.ossClient.put(
                OSS_CONFIG.wishesFile, 
                Buffer.from(JSON.stringify(data, null, 2)),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                }
            );
            
            console.log(`成功保存${wishes.length}条祝福到OSS`);
            
            // 更新本地缓存
            this.cachedWishes = wishes;
            this.lastFetchTime = Date.now();
            
            return result;
            
        } catch (error) {
            console.error('保存到OSS失败:', error);
            throw error;
        }
    }
    
    // 公共方法：获取祝福（带缓存和降级）
    async getWishes() {
        // 检查缓存是否有效
        const now = Date.now();
        if (this.cachedWishes && (now - this.lastFetchTime) < this.cacheTTL) {
            console.log('使用缓存的祝福数据');
            return this.cachedWishes;
        }
        
        try {
            // 尝试从OSS读取
            const wishes = await this.getWishesFromOSS();
            this.cachedWishes = wishes;
            this.lastFetchTime = now;
            this.retryCount = 0; // 重置重试计数
            return wishes;
            
        } catch (error) {
            console.error('从OSS读取祝福失败:', error);
            
            // 降级到本地存储
            const localWishes = this.getLocalWishes();
            console.log(`降级使用本地存储，共${localWishes.length}条祝福`);
            return localWishes;
        }
    }
    
    // 公共方法：保存祝福（带重试和降级）
    async saveWishes(wishes) {
        // 立即保存到本地存储作为备份
        this.saveLocalWishes(wishes);
        
        if (!this.isInitialized) {
            console.log('OSS未初始化，仅保存到本地存储');
            return true;
        }
        
        try {
            // 先从OSS获取最新数据，防止覆盖其他用户的祝福
            const latestWishes = await this.getWishesFromOSS();
            
            // 合并祝福（新祝福在前，去重）
            const mergedWishes = this.mergeWishes(wishes, latestWishes);
            
            // 保存合并后的数据
            await this.saveWishesToOSS(mergedWishes);
            
            this.retryCount = 0;
            return true;
            
        } catch (error) {
            console.error('保存祝福到OSS失败:', error);
            
            this.retryCount++;
            if (this.retryCount < this.maxRetries) {
                console.log(`重试保存 (${this.retryCount}/${this.maxRetries})`);
                // 延迟后重试
                setTimeout(() => this.saveWishes(wishes), 1000 * this.retryCount);
            } else {
                console.error('达到最大重试次数，仅保存到本地');
                this.retryCount = 0;
            }
            
            return false;
        }
    }
    
    // 合并祝福数据（去重和排序）
    mergeWishes(newWishes, existingWishes) {
        const allWishes = [...newWishes];
        
        // 添加现有祝福，避免重复
        existingWishes.forEach(wish => {
            const exists = allWishes.some(w => 
                w.id === wish.id || 
                (w.content === wish.content && w.date === wish.date)
            );
            if (!exists) {
                allWishes.push(wish);
            }
        });
        
        // 按时间倒序排列（最新的在前面）
        return allWishes.sort((a, b) => {
            const timeA = a.id || new Date(a.date).getTime();
            const timeB = b.id || new Date(b.date).getTime();
            return timeB - timeA;
        });
    }
    
    // 本地存储备用方法
    getLocalWishes() {
        try {
            const saved = localStorage.getItem('familyWishes');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('读取本地祝福失败:', error);
            return [];
        }
    }
    
    saveLocalWishes(wishes) {
        try {
            localStorage.setItem('familyWishes', JSON.stringify(wishes));
        } catch (error) {
            console.error('保存本地祝福失败:', error);
        }
    }
    
    // 添加单个祝福
    async addWish(content) {
        const wishes = await this.getWishes();
        const newWish = {
            id: Date.now(),
            content: content,
            date: new Date().toLocaleDateString('zh-CN'),
            timestamp: new Date().toISOString()
        };
        
        wishes.unshift(newWish);
        await this.saveWishes(wishes);
        
        return newWish;
    }
    
    // 获取统计信息
    async getStats() {
        const wishes = await this.getWishes();
        return {
            total: wishes.length,
            todayCount: wishes.filter(w => 
                w.date === new Date().toLocaleDateString('zh-CN')
            ).length,
            uniqueWishes: new Set(wishes.map(w => w.content)).size, // 改为独特祝福数
            isOSSConnected: this.isInitialized,
            lastUpdate: this.lastFetchTime ? new Date(this.lastFetchTime).toLocaleString('zh-CN') : '未知'
        };
    }
    
    // 清理过期缓存
    clearCache() {
        this.cachedWishes = null;
        this.lastFetchTime = 0;
    }
    
    // 强制刷新数据
    async refresh() {
        this.clearCache();
        return await this.getWishes();
    }
}

// 创建全局实例
const wishesManager = new WishesOSS();

// 导出到全局对象
window.wishesManager = wishesManager;

// 导出兼容的方法名（支持原有调用方式）
window.getWishes = () => wishesManager.getWishes();
window.saveWishes = (wishes) => wishesManager.saveWishes(wishes);
window.addWish = (content) => wishesManager.addWish(content); // 只需要内容参数
window.getWishesStats = () => wishesManager.getStats();
window.refreshWishes = () => wishesManager.refresh();
