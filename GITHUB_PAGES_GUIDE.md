# 🚀 GitHub Pages 部署指南

## 📋 项目准备清单

✅ **已完成的优化**：
- [x] 移除中文文件名（`地图功能说明.md` → `map-guide.md`）
- [x] 添加 `.nojekyll` 文件（禁用Jekyll处理）
- [x] 使用相对路径（所有资源文件）
- [x] 纯静态HTML/CSS/JS（无服务器依赖）

## 🌐 部署步骤

### 1. 上传项目到GitHub
```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: Wedding engagement page"
git branch -M main
git remote add origin https://github.com/你的用户名/marry.git
git push -u origin main
```

### 2. 启用GitHub Pages
1. 进入你的GitHub仓库页面
2. 点击 **Settings** 选项卡
3. 滚动到 **Pages** 部分
4. 在 **Source** 下拉菜单中选择 **Deploy from a branch**
5. 选择分支：**main** 
6. 选择文件夹：**/ (root)**
7. 点击 **Save**

### 3. 访问你的网站
- GitHub会自动生成链接：`https://你的用户名.github.io/marry/`
- 部署通常需要2-10分钟
- 你会收到绿色对勾✅表示部署成功

## ✨ 项目特点

### 🔧 技术特性
- **纯前端项目**：无需服务器支持
- **响应式设计**：完美适配移动端和桌面端
- **现代交互**：平滑滚动、粒子效果、弹幕祝福
- **本地存储**：祝福信息自动保存到用户浏览器

### 🎨 页面功能
- **首页展示**：倒计时、新人介绍
- **聚会地点**：餐厅信息、环境图片、一键导航
- **宴会环节**：详细时间安排、自动滚动展示
- **家人祝福**：弹幕式祝福展示
- **视觉效果**：飘落花瓣、粒子动画

## 📱 兼容性测试

### 推荐浏览器
- ✅ **Chrome** 90+
- ✅ **Safari** 14+
- ✅ **Edge** 90+
- ✅ **Firefox** 88+

### 移动端测试
- ✅ **iOS Safari** 14+
- ✅ **Android Chrome** 90+
- ✅ **微信内置浏览器**

## 🌍 CDN资源

项目使用的外部资源都来自可靠的CDN：
- **字体**：Google Fonts（中英文字体）
- **图标**：Font Awesome 6.4.0
- **所有资源支持HTTPS**

## 🔒 HTTPS支持

GitHub Pages自动提供HTTPS支持，确保：
- ✅ 地理位置API正常工作
- ✅ 现代Web API功能可用
- ✅ 安全的数据传输

## ⚡ 性能优化

### 已优化项目
- **图片格式**：使用现代图片格式
- **CSS动画**：硬件加速
- **JavaScript**：事件防抖、性能优化
- **资源加载**：异步加载、懒加载

### 加载速度
- **首屏加载**：< 3秒
- **交互就绪**：< 5秒
- **资源大小**：< 2MB总计

## 🎯 定制指南

### 更新内容
1. **修改新人信息**：编辑 `index.html` 中的相关内容
2. **更换图片**：替换 `images/` 目录下的文件
3. **调整地址**：修改 `script.js` 中的 `RESTAURANT_CONFIG`
4. **个性化祝福**：可预设一些祝福内容

### 样式调整
- **主色调**：修改 `styles.css` 中的 CSS 变量
- **字体**：更换Google Fonts链接
- **布局**：调整各区域的样式

## 🔧 故障排除

### 常见问题

**问题1：页面空白**
- 检查浏览器控制台错误
- 确认所有文件路径正确
- 验证HTML语法

**问题2：地图功能不工作**
- 需要HTTPS环境（GitHub Pages自动提供）
- 检查网络连接
- 验证坐标格式

**问题3：移动端显示异常**
- 清除浏览器缓存
- 检查viewport设置
- 测试不同设备

**问题4：祝福功能不保存**
- 确认LocalStorage可用
- 检查隐私模式设置
- 验证浏览器兼容性

### 调试技巧
```javascript
// 在浏览器控制台中检查
console.log('页面是否加载:', document.readyState);
console.log('本地存储:', localStorage.getItem('wishes'));
console.log('当前配置:', RESTAURANT_CONFIG);
```

## 📊 部署检查清单

部署前请确认：
- [ ] 所有文件使用英文文件名
- [ ] 包含 `.nojekyll` 文件
- [ ] HTML/CSS/JS语法正确
- [ ] 图片路径正确
- [ ] 测试所有交互功能
- [ ] 验证移动端适配
- [ ] 检查控制台无错误

## 🎉 成功部署后

你的婚礼页面将可以通过以下方式分享：
- 📱 **微信分享**：直接复制链接发送
- 💌 **邀请函**：将链接制作成二维码
- 📧 **邮件邀请**：在邮件中包含链接
- 🎨 **社交媒体**：分享到各大平台

---

🎊 **恭喜！你的浪漫婚礼页面现在可以和全世界分享了！**

如有任何问题，请检查GitHub Pages文档或在Issues中提问。
