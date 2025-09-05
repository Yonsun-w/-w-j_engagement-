# 照片添加说明

## 📸 如何添加新人照片

### 1. 准备照片
- **新娘照片**: 命名为 `bride.jpg` 或 `bride.png`
- **新郎照片**: 命名为 `groom.jpg` 或 `groom.png`
- **建议尺寸**: 正方形照片效果最佳（比如 400x400 像素）
- **格式支持**: JPG、PNG、GIF

### 2. 照片放置
将准备好的照片文件放在当前 `images` 文件夹中：
```
images/
├── bride.jpg    （新娘照片）
├── groom.jpg    （新郎照片）
└── README.md    （本说明文件）
```

### 3. 修改CSS样式
在 `styles.css` 文件中，找到以下部分并修改：

```css
/* 如果您提供了照片URL，可以在这里设置 */
.bride-photo.has-image {
    background-image: url('images/bride.jpg');  /* 修改为您的新娘照片路径 */
    background-size: cover;
    background-position: center;
}

.groom-photo.has-image {
    background-image: url('images/groom.jpg');  /* 修改为您的新郎照片路径 */
    background-size: cover;
    background-position: center;
}
```

### 4. 激活照片显示
在 `index.html` 中，找到照片显示区域，添加 `has-image` 类：

```html
<!-- 新娘照片 -->
<div class="photo-display bride-photo has-image">
    <i class="fas fa-female"></i>
</div>

<!-- 新郎照片 -->
<div class="photo-display groom-photo has-image">
    <i class="fas fa-male"></i>
</div>
```

### 5. 完成
保存所有文件后刷新页面，您的照片就会显示出来了！

## 💡 小贴士
- 照片会自动调整大小适应圆形框架
- 如果照片不是正方形，可能会被裁剪
- 可以使用在线工具将照片裁剪成正方形
- 照片文件大小建议控制在1MB以内，确保页面加载速度

## 🔧 高级设置
如果您想要更多自定义选项，可以：
1. 调整 `border-radius` 改变照片形状
2. 添加滤镜效果让照片更艺术
3. 设置悬停动画效果
4. 添加照片边框装饰

需要帮助请随时询问！
