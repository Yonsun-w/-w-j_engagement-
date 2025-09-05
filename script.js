// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavbar();
    initBackgroundPanel();
    initCountdown();
    initPhotoDisplay();
    initWishes();
    initParticles();
    initScrollAnimations();
    initSmoothScroll();
    initMapFunction();
    initMapConfigPanel();
    loadMapConfig();
    
    // 添加加载动画
    document.body.classList.add('loaded');
});

// 导航栏功能
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 滚动时导航栏效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加滚动样式
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 导航栏隐藏/显示效果
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 移动端菜单切换
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 点击导航链接关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 点击外部区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// 背景自定义面板
function initBackgroundPanel() {
    const bgToggle = document.getElementById('bgToggle');
    const backgroundPanel = document.getElementById('backgroundPanel');
    const panelClose = document.getElementById('panelClose');
    const bgOptions = document.querySelectorAll('.bg-option');
    const bgUpload = document.getElementById('bgUpload');
    
    // 打开/关闭面板
    bgToggle.addEventListener('click', () => {
        backgroundPanel.classList.toggle('active');
    });
    
    panelClose.addEventListener('click', () => {
        backgroundPanel.classList.remove('active');
    });
    
    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
        if (!backgroundPanel.contains(e.target) && !bgToggle.contains(e.target)) {
            backgroundPanel.classList.remove('active');
        }
    });
    
    // 选择预设背景
    bgOptions.forEach(option => {
        option.addEventListener('click', () => {
            const bgType = option.dataset.bg;
            
            // 移除所有活动状态
            bgOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // 应用背景
            switch(bgType) {
                case 'gradient1':
                    document.body.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)';
                    break;
                case 'gradient2':
                    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    break;
                case 'gradient3':
                    document.body.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                    break;
                case 'floral':
                    document.body.style.background = `
                        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="3" fill="%23ff6b9d" opacity="0.3"/><circle cx="20" cy="30" r="2" fill="%23ffc0cb" opacity="0.4"/><circle cx="80" cy="70" r="2" fill="%23ff8fab" opacity="0.4"/></svg>'),
                        linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%)
                    `;
                    document.body.style.backgroundSize = '50px 50px, cover';
                    break;
            }
            
            document.body.style.backgroundAttachment = 'fixed';
            
            // 保存到localStorage
            localStorage.setItem('selectedBackground', bgType);
        });
    });
    
    // 上传自定义背景
    bgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.body.style.background = `url('${e.target.result}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundPosition = 'center';
                
                // 移除预设背景的活动状态
                bgOptions.forEach(opt => opt.classList.remove('active'));
                
                // 保存到localStorage
                localStorage.setItem('customBackground', e.target.result);
                localStorage.setItem('selectedBackground', 'custom');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 恢复保存的背景
    const savedBg = localStorage.getItem('selectedBackground');
    if (savedBg === 'custom') {
        const customBg = localStorage.getItem('customBackground');
        if (customBg) {
            document.body.style.background = `url('${customBg}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundPosition = 'center';
        }
    } else if (savedBg) {
        const savedOption = document.querySelector(`[data-bg="${savedBg}"]`);
        if (savedOption) {
            savedOption.click();
        }
    }
}

// 倒计时功能
function initCountdown() {
    // 设置家庭聚会日期 (2025年10月3日 11:00)
    const engagementDate = new Date('2025-10-03T11:00:00').getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = engagementDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        } else {
            // 时间到了
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            
            // 显示庆祝效果
            createCelebration();
        }
    }
    
    // 立即更新一次，然后每秒更新
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 庆祝效果
function createCelebration() {
    // 创建心形雨效果
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 100);
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '-50px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    heart.style.animation = `fallDown ${Math.random() * 3 + 2}s linear forwards`;
    
    document.body.appendChild(heart);
    
    // 动画结束后移除元素
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// 添加下落动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fallDown {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 静态照片展示功能
function initPhotoDisplay() {
    // 照片现在是静态的，可以在这里添加任何照片相关的交互效果
    // 比如悬停效果、点击放大等
    const photoFrames = document.querySelectorAll('.photo-frame');
    
    photoFrames.forEach(frame => {
        frame.addEventListener('mouseenter', () => {
            frame.style.transform = 'scale(1.05)';
        });
        
        frame.addEventListener('mouseleave', () => {
            frame.style.transform = 'scale(1)';
        });
    });
}

// 祝福留言功能
function initWishes() {
    const wishText = document.getElementById('wishText');
    const wishName = document.getElementById('wishName');
    const submitBtn = document.getElementById('submitWish');
    const wishesList = document.getElementById('wishesList');
    
    // 提交祝福
    submitBtn.addEventListener('click', () => {
        const text = wishText.value.trim();
        const name = wishName.value.trim();
        
        if (text && name) {
            addWish(name, text);
            wishText.value = '';
            wishName.value = '';
            
            // 提交成功提示
            showNotification('祝愿已留下！感谢家人的美好祝福 💕');
        } else {
            showNotification('请填写完整的祝福内容和家人姓名');
        }
    });
    
    // 回车键提交
    wishText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitBtn.click();
        }
    });
    
    // 加载保存的祝福
    loadWishes();
}

function addWish(name, content) {
    const wishes = getWishes();
    const newWish = {
        id: Date.now(),
        name: name,
        content: content,
        date: new Date().toLocaleDateString('zh-CN')
    };
    
    wishes.unshift(newWish);
    saveWishes(wishes);
    displayWish(newWish);
}

function displayWish(wish) {
    const wishesList = document.getElementById('wishesList');
    const wishElement = document.createElement('div');
    wishElement.className = 'wish-item';
    wishElement.innerHTML = `
        <div class="wish-header">
            <span class="wish-author">${wish.name}</span>
            <span class="wish-date">${wish.date}</span>
        </div>
        <div class="wish-content">${wish.content}</div>
    `;
    
    wishesList.insertBefore(wishElement, wishesList.firstChild);
    
    // 添加入场动画
    setTimeout(() => {
        wishElement.style.opacity = '1';
        wishElement.style.transform = 'translateY(0)';
    }, 100);
}

function loadWishes() {
    const wishes = getWishes();
    wishes.forEach(wish => {
        displayWish(wish);
    });
}

function getWishes() {
    const saved = localStorage.getItem('familyWishes');
    return saved ? JSON.parse(saved) : [];
}

function saveWishes(wishes) {
    localStorage.setItem('familyWishes', JSON.stringify(wishes));
}

// 通知提示
function showNotification(message) {
    // 移除已存在的通知
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 粒子效果
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const animationDuration = Math.random() * 6 + 4;
        const opacity = Math.random() * 0.6 + 0.2;
        
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: 100%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            animation-duration: ${animationDuration}s;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        particlesContainer.appendChild(particle);
        
        // 动画结束后移除粒子
        setTimeout(() => {
            particle.remove();
        }, (animationDuration + 2) * 1000);
    }
    
    // 定期创建粒子
    setInterval(createParticle, 500);
    
    // 初始创建一些粒子
    for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 200);
    }
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // 观察所有带有data-aos属性的元素
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 平滑滚动
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动到顶部按钮
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        font-size: 16px;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // 点击滚动到顶部
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 悬停效果
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'translateY(0) scale(1)';
    });
}

// 地图配置 - 可自定义经纬度
const MAP_CONFIG = {
    // 默认坐标（北京天安门广场示例，请修改为实际地址坐标）
    latitude: 39.908823,    // 纬度
    longitude: 116.397470,  // 经度
    title: '聚会地点',       // 地点标题
    address: '温馨的家中环境', // 地址描述
    // 可选：自定义地点名称
    locationName: 'W & J 的家庭聚会地点'
};

// 地图配置面板功能
function initMapConfigPanel() {
    const mapConfigToggle = document.getElementById('mapConfigToggle');
    const mapConfigPanel = document.getElementById('mapConfigPanel');
    const mapPanelClose = document.getElementById('mapPanelClose');
    const updateMapConfigBtn = document.getElementById('updateMapConfig');
    const getCurrentLocationBtn = document.getElementById('getCurrentLocationBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    // 打开/关闭面板
    mapConfigToggle?.addEventListener('click', () => {
        mapConfigPanel.classList.toggle('active');
        // 关闭背景面板
        document.getElementById('backgroundPanel').classList.remove('active');
    });
    
    mapPanelClose?.addEventListener('click', () => {
        mapConfigPanel.classList.remove('active');
    });
    
    // 点击外部关闭面板
    document.addEventListener('click', (e) => {
        if (!mapConfigPanel.contains(e.target) && !mapConfigToggle.contains(e.target)) {
            mapConfigPanel.classList.remove('active');
        }
    });
    
    // 更新地图配置
    updateMapConfigBtn?.addEventListener('click', () => {
        const newLat = parseFloat(document.getElementById('newLat').value);
        const newLng = parseFloat(document.getElementById('newLng').value);
        const newTitle = document.getElementById('newTitle').value.trim();
        const newAddress = document.getElementById('newAddress').value.trim();
        
        if (isNaN(newLat) || isNaN(newLng)) {
            showNotification('请输入有效的经纬度数值');
            return;
        }
        
        if (newLat < -90 || newLat > 90) {
            showNotification('纬度应在 -90 到 90 之间');
            return;
        }
        
        if (newLng < -180 || newLng > 180) {
            showNotification('经度应在 -180 到 180 之间');
            return;
        }
        
        const config = {
            latitude: newLat,
            longitude: newLng
        };
        
        if (newTitle) config.title = newTitle;
        if (newAddress) config.address = newAddress;
        
        updateMapConfig(config);
        updateMapDisplay();
        
        // 清空输入框
        document.getElementById('newLat').value = '';
        document.getElementById('newLng').value = '';
        document.getElementById('newTitle').value = '';
        document.getElementById('newAddress').value = '';
    });
    
    // 获取当前位置
    getCurrentLocationBtn?.addEventListener('click', () => {
        getCurrentLocation();
    });
    
    // 预设位置按钮
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lat = parseFloat(btn.dataset.lat);
            const lng = parseFloat(btn.dataset.lng);
            const title = btn.dataset.title;
            const address = btn.dataset.address;
            
            updateMapConfig({
                latitude: lat,
                longitude: lng,
                title: title,
                address: address
            });
            updateMapDisplay();
        });
    });
    
    // 初始化显示
    updateMapDisplay();
}

// 更新地图配置显示
function updateMapDisplay() {
    const { latitude, longitude, title, address } = MAP_CONFIG;
    
    const currentLat = document.getElementById('currentLat');
    const currentLng = document.getElementById('currentLng');
    const currentTitle = document.getElementById('currentTitle');
    const currentLocation = document.getElementById('currentLocation');
    
    if (currentLat) currentLat.textContent = latitude.toFixed(6);
    if (currentLng) currentLng.textContent = longitude.toFixed(6);
    if (currentTitle) currentTitle.textContent = title;
    
    // 更新当前位置显示
    if (currentLocation) {
        currentLocation.innerHTML = `
            <p><strong>经度：</strong><span>${longitude.toFixed(6)}</span></p>
            <p><strong>纬度：</strong><span>${latitude.toFixed(6)}</span></p>
            <p><strong>地点：</strong><span>${title}</span></p>
            <p><strong>描述：</strong><span>${address}</span></p>
        `;
    }
}

// 地图功能
function initMapFunction() {
    const mapBtn = document.getElementById('mapBtn');
    if (!mapBtn) return;
    
    mapBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openBaiduMap();
    });
}

// 打开百度地图
function openBaiduMap() {
    const { latitude, longitude, title, address, locationName } = MAP_CONFIG;
    
    // 百度地图APP的URL Scheme
    const baiduAppUrl = `baidumap://map/marker?location=${latitude},${longitude}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(address)}&src=webapp.marry.wj`;
    
    // 百度地图网页版备用链接
    const baiduWebUrl = `https://api.map.baidu.com/marker?location=${latitude},${longitude}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(address)}&output=html&src=webapp.marry.wj`;
    
    // 尝试打开百度地图APP
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = baiduAppUrl;
    document.body.appendChild(iframe);
    
    // 设置超时，如果APP未打开则打开网页版
    let timeout = setTimeout(() => {
        // 移除iframe
        document.body.removeChild(iframe);
        // 打开网页版地图
        window.open(baiduWebUrl, '_blank');
        showNotification('正在为您打开百度地图网页版 🗺️');
    }, 2000);
    
    // 如果成功拉起APP，清除超时
    window.addEventListener('blur', () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        showNotification('正在为您打开百度地图APP 📱');
    }, { once: true });
    
    // 立即移除iframe的备用方案
    setTimeout(() => {
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 100);
}

// 更新地图配置的函数
function updateMapConfig(newConfig) {
    Object.assign(MAP_CONFIG, newConfig);
    // 保存到localStorage
    localStorage.setItem('mapConfig', JSON.stringify(MAP_CONFIG));
    showNotification('地图位置已更新 📍');
}

// 从localStorage恢复地图配置
function loadMapConfig() {
    const saved = localStorage.getItem('mapConfig');
    if (saved) {
        try {
            const savedConfig = JSON.parse(saved);
            Object.assign(MAP_CONFIG, savedConfig);
            // 延迟更新显示，确保DOM已加载
            setTimeout(() => {
                if (typeof updateMapDisplay === 'function') {
                    updateMapDisplay();
                }
            }, 100);
        } catch (e) {
            console.warn('地图配置加载失败，使用默认配置');
        }
    }
}

// 获取用户位置的函数（可选功能）
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showNotification('您的浏览器不支持地理定位功能');
        return;
    }
    
    showNotification('正在获取您的位置...');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            updateMapConfig({
                latitude: latitude,
                longitude: longitude,
                title: '当前位置',
                address: '您当前所在的位置'
            });
            updateMapDisplay();
            showNotification('已设置为当前位置 📍');
        },
        (error) => {
            let message = '无法获取位置信息';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = '位置访问被拒绝，请在浏览器设置中允许位置访问';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = '位置信息不可用';
                    break;
                case error.TIMEOUT:
                    message = '获取位置信息超时';
                    break;
            }
            showNotification(message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// 页面加载完成后的额外设置
window.addEventListener('load', () => {
    // 预加载动画
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #ff6b9d 0%, #ffc0cb 100%);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    const loaderHeart = document.createElement('div');
    loaderHeart.innerHTML = '💕';
    loaderHeart.style.cssText = `
        font-size: 4rem;
        animation: heartbeat 1s infinite;
    `;
    
    loader.appendChild(loaderHeart);
    document.body.appendChild(loader);
    
    // 延迟隐藏加载动画
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1500);
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面出现错误:', e.error);
});

// 性能监控
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('页面加载完成时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// 添加一些额外的互动效果
document.addEventListener('mousemove', (e) => {
    // 鼠标跟随效果（可选）
    if (Math.random() > 0.995) { // 低频率创建
        createMouseParticle(e.clientX, e.clientY);
    }
});

function createMouseParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(255, 107, 157, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: mouseParticle 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// 添加鼠标粒子动画
const mouseParticleStyle = document.createElement('style');
mouseParticleStyle.textContent = `
    @keyframes mouseParticle {
        0% {
            transform: scale(0) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(1) translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(mouseParticleStyle);
