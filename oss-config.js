// 阿里云OSS配置文件
// 注意：出于安全考虑，这些配置应该在生产环境中使用环境变量或服务器端代理

const OSS_CONFIG = {
    // OSS基本配置
    region: 'oss-cn-hangzhou',           // 你的OSS区域
    bucket: 'your-wedding-bucket',       // 你的OSS bucket名称
    endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',  // OSS endpoint
    
    // 数据文件配置
    wishesFile: 'wishes/family-wishes.json',  // 祝福数据文件路径
    
    // 访问配置（生产环境应该使用STS临时凭证或服务器代理）
    accessKeyId: '',                     // 留空，将从环境变量读取
    accessKeySecret: '',                 // 留空，将从环境变量读取
    
    // CORS和安全配置
    timeout: 10000,                      // 请求超时时间（毫秒）
    maxRetries: 3,                       // 最大重试次数
};

// 安全提示：在生产环境中，建议使用以下方案之一：
// 1. STS临时凭证
// 2. 服务器端代理API
// 3. 阿里云函数计算
// 4. 只读访问令牌

// 获取OSS客户端（需要引入阿里云OSS SDK）
function createOSSClient() {
    // 优先从环境变量获取凭证
    const accessKeyId = process.env.OSS_ACCESS_KEY_ID || OSS_CONFIG.accessKeyId;
    const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET || OSS_CONFIG.accessKeySecret;
    
    if (!accessKeyId || !accessKeySecret) {
        console.warn('OSS凭证未配置，将使用本地存储作为备用方案');
        return null;
    }
    
    try {
        // 这里需要引入阿里云OSS JavaScript SDK
        const OSS = window.OSS || require('ali-oss');
        
        return new OSS({
            region: OSS_CONFIG.region,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            bucket: OSS_CONFIG.bucket,
            endpoint: OSS_CONFIG.endpoint,
            timeout: OSS_CONFIG.timeout,
        });
    } catch (error) {
        console.error('创建OSS客户端失败:', error);
        return null;
    }
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OSS_CONFIG, createOSSClient };
} else {
    window.OSS_CONFIG = OSS_CONFIG;
    window.createOSSClient = createOSSClient;
}
