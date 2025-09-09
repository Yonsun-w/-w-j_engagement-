# 🌐 阿里云OSS网络留言板部署指南

## 🎯 **功能概述**

现在你的宴会页面支持真正的网络留言板！所有用户的祝福都会实时同步到阿里云OSS，实现：

- 🌍 **全球同步**: 所有访问者都能看到彼此的祝福
- 💾 **永久保存**: 祝福数据安全存储在云端
- ⚡ **实时更新**: 新祝福立即出现在所有人的弹幕中
- 🛡️ **安全可靠**: 支持多种安全配置方案
- 📱 **离线备用**: 网络异常时自动降级到本地存储

---

## 🚀 **快速开始**

### **1. 创建阿里云OSS服务**

#### **开通OSS服务**
1. 登录 [阿里云控制台](https://oss.console.aliyun.com/)
2. 开通对象存储OSS服务
3. 选择合适的地域（建议选择离用户最近的）

#### **创建Bucket**
```bash
# 推荐配置
Bucket名称: your-wedding-bucket-2025  # 全球唯一名称
访问权限: 公共读
存储类型: 标准存储
```

---

### **2. 配置OSS权限**

#### **设置跨域（CORS）规则**
在OSS控制台 → 数据管理 → 跨域设置，添加规则：

```json
{
    "allowedOrigins": ["*"],
    "allowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "allowedHeaders": ["*"],
    "exposedHeaders": ["x-oss-request-id", "x-oss-server-time"],
    "maxAgeSeconds": 3600
}
```

#### **创建RAM用户（推荐）**
1. 访问 [RAM控制台](https://ram.console.aliyun.com/)
2. 创建新用户，选择"编程访问"
3. 为用户授权 `AliyunOSSFullAccess` 权限
4. 保存 `AccessKeyId` 和 `AccessKeySecret`

---

### **3. 配置项目文件**

#### **修改 `oss-config.js`**
```javascript
const OSS_CONFIG = {
    // 修改为你的配置
    region: 'oss-cn-hangzhou',              // 你的OSS区域
    bucket: 'your-wedding-bucket-2025',     // 你的bucket名称  
    endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
    
    // 祝福文件路径（可自定义）
    wishesFile: 'wishes/family-wishes.json',
    
    // 开发环境可直接填写（生产环境见安全配置）
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
    
    timeout: 10000,
    maxRetries: 3,
};
```

---

## 🛡️ **安全配置方案**

### **方案一：环境变量（推荐生产环境）**

#### **服务器部署**
```bash
# 设置环境变量
export OSS_ACCESS_KEY_ID="your_access_key_id"
export OSS_ACCESS_KEY_SECRET="your_access_key_secret"

# oss-config.js 中保持空值
accessKeyId: '',     
accessKeySecret: '', 
```

#### **GitHub Pages部署**
在GitHub仓库设置中添加Secrets：
- `OSS_ACCESS_KEY_ID`
- `OSS_ACCESS_KEY_SECRET`

### **方案二：STS临时凭证（最安全）**

#### **创建STS角色**
```javascript
// 使用STS临时凭证（需要服务器端支持）
const stsToken = await fetch('/api/sts-token').then(r => r.json());

const ossClient = new OSS({
    accessKeyId: stsToken.AccessKeyId,
    accessKeySecret: stsToken.AccessKeySecret,
    stsToken: stsToken.SecurityToken,
    region: 'oss-cn-hangzhou',
    bucket: 'your-bucket'
});
```

### **方案三：函数计算代理（推荐）**

创建阿里云函数计算，代理OSS操作：

```javascript
// 通过API代理访问OSS
async function getWishesFromAPI() {
    const response = await fetch('https://your-fc-endpoint/wishes');
    return response.json();
}

async function saveWishesToAPI(wishes) {
    const response = await fetch('https://your-fc-endpoint/wishes', {
        method: 'POST',
        body: JSON.stringify(wishes)
    });
    return response.json();
}
```

---

## 📂 **文件结构说明**

### **OSS存储结构**
```
your-bucket/
├── wishes/
│   └── family-wishes.json     # 祝福数据文件
└── backup/
    ├── wishes-2025-01-01.json # 每日备份
    └── wishes-2025-01-02.json
```

### **祝福数据格式**
```json
{
    "wishes": [
        {
            "id": 1641024000000,
            "name": "张三",
            "content": "祝新人百年好合！",
            "date": "2025/1/1",
            "timestamp": "2025-01-01T12:00:00.000Z"
        }
    ],
    "lastUpdate": "2025-01-01T12:00:00.000Z",
    "version": 1641024000000
}
```

---

## 🔧 **项目文件说明**

### **新增文件**
1. **`oss-config.js`** - OSS基础配置
2. **`wishes-oss.js`** - OSS数据管理类
3. **`oss-deployment-guide.md`** - 部署指南

### **修改文件**
1. **`script.js`** - 支持异步祝福操作
2. **`index.html`** - 引入OSS相关脚本

---

## 🧪 **测试指南**

### **本地测试**
```bash
# 1. 修改 oss-config.js 中的配置
# 2. 在浏览器中打开 index.html
# 3. 提交一条测试祝福
# 4. 检查OSS控制台中是否出现 wishes/family-wishes.json
# 5. 刷新页面，祝福应该出现在弹幕中
```

### **连接状态检查**
页面右下角会显示连接状态：
- 🟢 **绿色**：网络祝福板已连接
- 🟡 **橙色**：使用本地祝福板
- 🔴 **红色**：祝福板连接失败

### **浏览器控制台测试**
```javascript
// 测试OSS连接
console.log('OSS初始化状态:', window.wishesManager?.isInitialized);

// 获取祝福统计
window.getWishesStats().then(stats => console.log('祝福统计:', stats));

// 手动添加测试祝福
window.addWish('测试用户', '这是一条测试祝福');

// 强制刷新祝福数据
window.refreshWishes().then(wishes => console.log('最新祝福:', wishes));
```

---

## 🚨 **故障排查**

### **常见问题**

#### **1. CORS错误**
```
Access to fetch at 'https://xxx.oss-cn-hangzhou.aliyuncs.com' from origin 'xxx' has been blocked by CORS policy
```
**解决方案**: 在OSS控制台正确配置CORS规则

#### **2. 权限错误**
```
AccessDenied: You have no right to access this object
```
**解决方案**: 检查RAM用户权限或Bucket访问权限

#### **3. 网络超时**
```
RequestTimeout: Request timeout
```
**解决方案**: 增加timeout配置，或检查网络连接

#### **4. 文件不存在**
```
NoSuchKey: The specified key does not exist
```
**解决方案**: 首次运行会自动创建，属于正常现象

### **调试模式**
```javascript
// 开启详细日志
localStorage.setItem('ossDebug', 'true');

// 查看OSS请求详情
window.wishesManager.ossClient.options.debug = true;
```

---

## 💡 **性能优化建议**

### **1. 缓存策略**
- ✅ 客户端缓存5分钟
- ✅ 自动降级到本地存储
- ✅ 后台定时同步

### **2. 数据优化**
```javascript
// 定期清理老旧数据
const MAX_WISHES = 1000;
if (wishes.length > MAX_WISHES) {
    wishes = wishes.slice(0, MAX_WISHES);
}
```

### **3. 网络优化**
```javascript
// 使用CDN加速
endpoint: 'https://your-bucket.oss-accelerate.aliyuncs.com'
```

---

## 📊 **监控和维护**

### **数据备份**
```javascript
// 每日自动备份（可通过函数计算定时执行）
async function backupWishes() {
    const wishes = await getWishes();
    const date = new Date().toISOString().split('T')[0];
    await ossClient.put(`backup/wishes-${date}.json`, JSON.stringify(wishes));
}
```

### **统计信息**
```javascript
// 获取详细统计
const stats = await window.getWishesStats();
/*
{
    total: 42,                    // 总祝福数
    todayCount: 5,               // 今日新增
    uniqueUsers: 28,             // 独立用户数
    isOSSConnected: true,        // OSS连接状态
    lastUpdate: "2025/1/1 12:00:00"  // 最后更新时间
}
*/
```

---

## 🎯 **部署检查清单**

### **部署前检查**
- [ ] OSS服务已开通
- [ ] Bucket已创建并配置权限
- [ ] CORS规则已设置
- [ ] RAM用户已创建（生产环境）
- [ ] `oss-config.js` 配置正确
- [ ] 本地测试通过

### **上线后验证**
- [ ] 页面加载正常
- [ ] OSS连接状态显示为绿色
- [ ] 能成功提交祝福
- [ ] 祝福出现在弹幕中
- [ ] 多设备数据同步正常
- [ ] 离线降级功能正常

---

## 🎉 **升级完成！**

现在你的宴会邀请函拥有了真正的网络留言板功能：

### **用户体验升级**
- 🌐 **全球互动**: 所有访客都能看到彼此的祝福
- ⚡ **实时同步**: 新祝福立即出现在所有设备上
- 📱 **离线支持**: 网络异常时自动使用本地存储
- 🎯 **智能重试**: 自动重试失败的操作

### **技术架构升级**
- ☁️ **云端存储**: 数据安全存储在阿里云OSS
- 🔄 **异步处理**: 完全异步的数据操作
- 🛡️ **多重保障**: 缓存+重试+降级策略
- 📊 **可观测性**: 连接状态和统计信息

现在所有来宾的祝福都能永久保存并实时分享，让这个特殊的日子更加温馨和难忘！💕
