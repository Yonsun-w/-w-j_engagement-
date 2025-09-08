# 地图功能使用说明 🗺️

## 📍 功能概述

页面现在支持一键导航到**郑州市楚境餐厅（省政府店）**，用户点击"查看地图"按钮后：
1. **优先尝试打开百度地图APP**（如果已安装）
2. **自动回退到网页版**（如果没有安装APP）
3. **直接定位到准确位置**，无需搜索

## 🎯 使用方法

### 餐厅位置信息

在 `script.js` 文件中的 `RESTAURANT_CONFIG` 配置：

```javascript
const RESTAURANT_CONFIG = {
    // 郑州市楚境餐厅（省政府店）坐标
    latitude: 34.7466,      // 纬度
    longitude: 113.6253,    // 经度
    title: '楚境餐厅（省政府店）',    // 餐厅名称
    address: '郑州市金水区省政府附近', // 地址描述
    phone: '0371-66565555'  // 电话号码
};
```

**百度地图链接：**
- 网页版：https://map.baidu.com/poi/楚境餐厅(省政府店)
- APP版：自动调用百度地图APP

**修改为您的实际坐标：**
```javascript
const MAP_CONFIG = {
    latitude: 您的纬度,    // 例如：31.230416
    longitude: 您的经度,   // 例如：121.473701
    title: '您的地点名称',
    address: '您的详细地址',
    locationName: '自定义名称'
};
```

### 方法二：使用页面上的地图配置面板

1. **打开配置面板**：点击导航栏中的📍图标
2. **手动输入坐标**：在输入框中填入经纬度
3. **使用快速设置**：点击预设的城市按钮
4. **获取当前位置**：点击"获取当前位置"（需要允许定位权限）
5. **保存设置**：配置会自动保存到浏览器本地存储

## 🌍 如何获取准确的经纬度

### 方法一：使用百度地图获取
1. 打开 [百度地图](https://map.baidu.com)
2. 搜索您的地址
3. 右键点击确切位置，选择"这里是哪"
4. 复制显示的经纬度坐标

### 方法二：使用高德地图获取
1. 打开 [高德地图](https://www.amap.com)
2. 搜索地址并右键点击
3. 选择"这是哪儿"查看坐标
4. **注意**：高德地图使用GCJ-02坐标系，可直接使用

### 方法三：使用GPS工具
- 手机GPS定位APP
- Google Maps（国外用户）
- 专业测量设备

## 🔧 技术细节

### URL Scheme 格式
```javascript
// 百度地图APP
baidumap://map/marker?location=纬度,经度&title=标题&content=内容&src=来源标识

// 百度地图网页版
https://api.map.baidu.com/marker?location=纬度,经度&title=标题&content=内容&output=html&src=来源标识
```

### 工作流程
1. 点击"查看地图"按钮
2. 创建隐藏iframe尝试打开APP
3. 设置2秒超时，如果APP未响应则打开网页版
4. 监听窗口失焦事件判断是否成功拉起APP

## 🎨 自定义选项

### 修改按钮样式
在 `styles.css` 中找到 `.map-btn` 相关样式进行修改。

### 添加更多预设位置
在HTML中的 `.preset-locations` 区域添加更多按钮：

```html
<button class="preset-btn" 
        data-lat="您的纬度" 
        data-lng="您的经度" 
        data-title="地点名称" 
        data-address="地址描述">
    显示名称
</button>
```

### 修改地图提供商
如果您想使用其他地图服务，可以修改 `openBaiduMap()` 函数中的URL格式：

**高德地图：**
```javascript
const amapUrl = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodeURIComponent(title)}`;
```

**腾讯地图：**
```javascript
const tencentUrl = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${latitude},${longitude};title:${encodeURIComponent(title)}`;
```

## 📱 移动端体验

- **iOS**：会尝试打开百度地图APP，无APP则跳转Safari
- **Android**：会尝试打开百度地图APP，无APP则跳转默认浏览器
- **响应式设计**：配置面板在移动端全屏显示

## ⚠️ 注意事项

1. **坐标系统**：建议使用WGS84或GCJ-02坐标系
2. **权限问题**：获取当前位置需要HTTPS环境和用户授权
3. **网络连接**：地图功能需要网络连接
4. **精度范围**：
   - 纬度：-90 到 90
   - 经度：-180 到 180
5. **隐私保护**：位置信息仅保存在用户本地浏览器中

## 🔍 常见问题

**Q: 点击按钮没有反应？**
A: 检查浏览器控制台是否有错误，确认坐标格式正确。

**Q: 无法获取当前位置？**
A: 确保在HTTPS环境下使用，并允许浏览器定位权限。

**Q: 坐标显示位置不准确？**
A: 确认使用的坐标系统，不同地图服务可能使用不同坐标系。

**Q: 移动端体验不佳？**
A: 确保使用现代浏览器，配置面板针对移动端进行了优化。

## 🚀 未来扩展

- 支持更多地图服务商
- 添加路线规划功能
- 集成地址搜索功能
- 支持多个地点标记

---

💡 **提示**：建议在实际部署前先测试地图功能，确保坐标准确无误！
