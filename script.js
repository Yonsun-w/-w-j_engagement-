// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initSmartScroll(); // 智能滚动功能
    initNavbar();
    initCountdown();
    initPhotoDisplay();
    initWishes();
    initParticles();
    initPetals(); // 花瓣效果
    initScrollAnimations();
    initStoryTimeline(); // 故事时间线观察
    initDanmaku(); // 弹幕功能
    initMapFunction();
    initPhoneCall();
    
    // 添加加载动画
    document.body.classList.add('loaded');
});

// 智能滚动配置
let currentPage = 0;
let isPageTransitioning = false;
let scrollTimeout;

const pages = [
    { id: 'hero', name: '首页' },
    { id: 'restaurant-section', name: '聚会地点' }, 
    { id: 'story', name: '故事' },
    { id: 'wishes-section', name: '祝福' }
];

// 初始化智能滚动功能
function initSmartScroll() {
    const container = document.getElementById('fullscreenContainer');
    if (!container) return;

    // 使用 Intersection Observer 来检测当前可见的页面
    const observerOptions = {
        root: container,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageId = entry.target.id;
                const pageIndex = pages.findIndex(page => page.id === pageId);
                if (pageIndex !== -1 && pageIndex !== currentPage) {
                    currentPage = pageIndex;
                    updatePageIndicators();
                    triggerPageChangeEvent(currentPage, pageIndex);
                }
            }
        });
    }, observerOptions);

    // 观察所有页面
    pages.forEach(page => {
        const element = document.getElementById(page.id);
        if (element) {
            observer.observe(element);
        }
    });
    
    // 初始化页面指示器
    initPageIndicators();
    
    // 监听容器滚动，更新进度
    let scrollTimer;
    container.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            updateScrollProgress();
        }, 10);
    });
    
    // 键盘导航
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// 处理键盘导航
function handleKeyboardNavigation(e) {
    if (isPageTransitioning) return;
    
    switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            navigateToPage(Math.min(currentPage + 1, pages.length - 1));
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            navigateToPage(Math.max(currentPage - 1, 0));
            break;
        case 'Home':
            e.preventDefault();
            navigateToPage(0);
            break;
        case 'End':
            e.preventDefault();
            navigateToPage(pages.length - 1);
            break;
    }
}

// 导航到指定页面
function navigateToPage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= pages.length || pageIndex === currentPage) return;
    
    isPageTransitioning = true;
    const targetElement = document.getElementById(pages[pageIndex].id);
    const container = document.getElementById('fullscreenContainer');
    
    if (targetElement && container) {
        targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // 延迟解锁
        setTimeout(() => {
            isPageTransitioning = false;
        }, 1000);
    }
}

// 更新滚动进度
function updateScrollProgress() {
    const container = document.getElementById('fullscreenContainer');
    if (!container) return;
    
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    // 这里可以用于更新某些进度指示器
}

// 初始化页面指示器
function initPageIndicators() {
    const indicators = document.getElementById('pageIndicators');
    if (!indicators) return;
    
    // 清空现有指示器
    indicators.innerHTML = '';
    
    // 创建新的指示器
    pages.forEach((page, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'page-indicator';
        indicator.setAttribute('data-page', index);
        indicator.setAttribute('data-label', page.name);
        
        if (index === 0) indicator.classList.add('active');
        
        // 点击指示器跳转页面
        indicator.addEventListener('click', () => {
            navigateToPage(index);
        });
        
        indicators.appendChild(indicator);
    });
}

// 更新页面指示器
function updatePageIndicators() {
    const indicators = document.querySelectorAll('.page-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentPage) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 触发页面切换事件
function triggerPageChangeEvent(from, to) {
    const event = new CustomEvent('pagechange', {
        detail: { from, to, pageName: pages[to].name }
    });
    document.dispatchEvent(event);
}

// 故事时间线观察功能
function initStoryTimeline() {
    const storyTimeline = document.getElementById('storyTimeline');
    
    if (!storyTimeline) return;
    
    const storyItems = storyTimeline.querySelectorAll('.story-item');
    
    // 观察故事项目的可见性
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        root: storyTimeline,
        threshold: 0.3 
    });
    
    // 观察所有故事项目
    storyItems.forEach(item => {
        storyObserver.observe(item);
    });
}

// 弹幕功能
function initDanmaku() {
    const danmakuContainer = document.getElementById('danmakuContainer');
    if (!danmakuContainer) return;
    
    let danmakuQueue = [];
    let danmakuInterval;
    
    // 预设的祝福语
    const defaultWishes = [
        "祝愿新人百年好合！💕",
        "愿你们的爱情像美酒一样，越久越香醇 🍷",
        "祝福你们永远幸福美满！✨",
        "愿你们白头偕老，恩爱如初 👫",
        "愿你们的婚姻充满欢声笑语 😄",
        "祝愿你们相亲相爱一辈子！❤️",
        "愿你们的爱情故事永远美丽 📖",
        "祝福新人天作之合！🌟",
        "愿你们共度美好人生！🌈"
    ];
    
    // 启动弹幕
    async function startDanmaku() {
        try {
            // 从OSS或本地存储加载祝福
            const savedWishes = await getWishes();
            danmakuQueue = [...defaultWishes];
            
            // 添加用户祝福
            if (savedWishes && savedWishes.length > 0) {
                savedWishes.forEach(wish => {
                    danmakuQueue.push(wish.content);
                });
                console.log(`加载了${savedWishes.length}条用户祝福到弹幕队列`);
            }
            
            // 随机打乱
            danmakuQueue = shuffleArray(danmakuQueue);
            
            // 开始显示弹幕
            danmakuInterval = setInterval(createDanmaku, 2000);
            
            // 立即显示第一个
            createDanmaku();
        } catch (error) {
            console.error('启动弹幕失败:', error);
            // 如果加载失败，至少显示默认祝福
            danmakuQueue = [...defaultWishes];
            danmakuInterval = setInterval(createDanmaku, 2000);
            createDanmaku();
        }
    }
    
    async function createDanmaku() {
        if (danmakuQueue.length === 0) {
            try {
                // 重新填充队列
                danmakuQueue = [...defaultWishes];
                const savedWishes = await getWishes();
                if (savedWishes && savedWishes.length > 0) {
                    savedWishes.forEach(wish => {
                        danmakuQueue.push(wish.content);
                    });
                }
                danmakuQueue = shuffleArray(danmakuQueue);
            } catch (error) {
                console.error('重新加载祝福失败:', error);
                // 如果失败，只使用默认祝福
                danmakuQueue = [...defaultWishes];
                danmakuQueue = shuffleArray(danmakuQueue);
            }
        }
        
        const wish = danmakuQueue.pop();
        const danmakuItem = document.createElement('div');
        danmakuItem.className = 'danmaku-item';
        danmakuItem.textContent = wish;
        
        // 随机垂直位置
        const top = Math.random() * 70 + 15; // 15% to 85%
        danmakuItem.style.top = top + '%';
        
        // 随机样式
        const styles = ['', 'fast', 'slow', 'special'];
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        if (randomStyle) {
            danmakuItem.classList.add(randomStyle);
        }
        
        danmakuContainer.appendChild(danmakuItem);
        
        // 动画结束后移除
        setTimeout(() => {
            if (danmakuItem.parentNode) {
                danmakuItem.remove();
            }
        }, 20000);
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // 当页面可见时启动弹幕
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!danmakuInterval) {
                    startDanmaku();
                }
            } else {
                if (danmakuInterval) {
                    clearInterval(danmakuInterval);
                    danmakuInterval = null;
                }
            }
        });
    }, { threshold: 0.3 });
    
    const wishesSection = document.getElementById('wishes-section');
    if (wishesSection) {
        observer.observe(wishesSection);
    }
}

// 导航栏功能
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端菜单切换
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 点击导航链接
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetId = href.substring(1); // 移除 #
            
            // 找到对应的页面索引
            const pageIndex = pages.findIndex(page => page.id === targetId);
            if (pageIndex !== -1) {
                navigateToPage(pageIndex);
            }
            
            // 关闭移动端菜单
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // 监听页面变化，更新导航栏状态
    document.addEventListener('pagechange', (e) => {
        if (e.detail.to > 0) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
}

// 花瓣效果
function initPetals() {
    const petalsContainer = document.getElementById('petals');
    if (!petalsContainer) return;
    
    const petalTypes = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '💮', '🏵️', '🌿'];
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = petalTypes[Math.floor(Math.random() * petalTypes.length)];
        
        // 随机属性
        const size = Math.random() * 20 + 15; // 15-35px
        const startPosition = Math.random() * 100; // 0-100%
        const animationDuration = Math.random() * 8 + 5; // 5-13秒
        const rotationSpeed = Math.random() * 360 + 180; // 180-540度
        const sway = Math.random() * 100 + 50; // 50-150px摆动幅度
        const opacity = Math.random() * 0.7 + 0.3; // 0.3-1.0透明度
        
        petal.style.cssText = `
            position: fixed;
            left: ${startPosition}%;
            top: -50px;
            font-size: ${size}px;
            opacity: ${opacity};
            pointer-events: none;
            z-index: 10;
            animation: petalFall${Math.floor(Math.random() * 3) + 1} ${animationDuration}s linear forwards;
            --sway: ${sway}px;
            --rotation: ${rotationSpeed}deg;
        `;
        
        petalsContainer.appendChild(petal);
        
        // 动画结束后移除花瓣
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
            }
        }, animationDuration * 1000);
    }
    
    // 持续创建花瓣
    function startPetalRain() {
        createPetal();
        setTimeout(startPetalRain, Math.random() * 800 + 200); // 200-1000ms间隔
    }
    
    // 启动花瓣雨
    startPetalRain();
    
    // 初始创建一些花瓣
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createPetal(), i * 300);
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
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
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
    const submitBtn = document.getElementById('submitWish');
    
    if (!wishText || !submitBtn) return;
    
    // 提交祝福
    submitBtn.addEventListener('click', async () => {
        const text = wishText.value.trim();
        
        if (!text) {
            showNotification('请填写祝福内容 😊');
            return;
        }
        
        try {
            // 禁用按钮防止重复提交
            submitBtn.disabled = true;
            submitBtn.textContent = '发送中...';
            
            // 保存祝福
            await addWish(text);
            
            // 清空表单
            wishText.value = '';
            
            // 提交成功提示
            showNotification('祝愿已发送！您的祝福将出现在弹幕中 🎉');
            
            // 立即添加到弹幕
            addDanmakuWish(text);
            
        } catch (error) {
            console.error('提交祝福失败:', error);
            showNotification('发送失败，请稍后重试 😟');
        } finally {
            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.textContent = '发送祝福弹幕';
        }
    });
    
    // 回车键提交
    wishText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitBtn.click();
        }
    });
}

async function addWish(content) {
    try {
        // 显示加载状态
        showNotification('正在保存祝福...');
        
        // 如果使用了OSS管理器
        if (window.wishesManager) {
            const newWish = await window.wishesManager.addWish(content);
            showNotification('祝福保存成功！💕');
            return newWish;
        }
        
        // 降级到本地存储
        const wishes = await getWishes();
        const newWish = {
            id: Date.now(),
            content: content,
            date: new Date().toLocaleDateString('zh-CN'),
            timestamp: new Date().toISOString()
        };
        
        wishes.unshift(newWish);
        await saveWishes(wishes);
        showNotification('祝福保存成功！💕');
        return newWish;
        
    } catch (error) {
        console.error('保存祝福失败:', error);
        showNotification('保存失败，请稍后重试 😟');
        throw error;
    }
}

function addDanmakuWish(wishText) {
    const danmakuContainer = document.getElementById('danmakuContainer');
    if (!danmakuContainer) return;
    
    const danmakuItem = document.createElement('div');
    danmakuItem.className = 'danmaku-item special';
    danmakuItem.textContent = wishText;
    
    // 随机垂直位置
    const top = Math.random() * 70 + 15;
    danmakuItem.style.top = top + '%';
    
    danmakuContainer.appendChild(danmakuItem);
    
    // 动画结束后移除
    setTimeout(() => {
        if (danmakuItem.parentNode) {
            danmakuItem.remove();
        }
    }, 20000);
}

async function getWishes() {
    try {
        // 如果使用了OSS管理器
        if (window.wishesManager) {
            return await window.wishesManager.getWishes();
        }
        
        // 降级到本地存储
        const saved = localStorage.getItem('familyWishes');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('读取祝福失败:', error);
        // 最终降级到本地存储
        const saved = localStorage.getItem('familyWishes');
        return saved ? JSON.parse(saved) : [];
    }
}

async function saveWishes(wishes) {
    try {
        // 如果使用了OSS管理器
        if (window.wishesManager) {
            return await window.wishesManager.saveWishes(wishes);
        }
        
        // 降级到本地存储
        localStorage.setItem('familyWishes', JSON.stringify(wishes));
        return true;
    } catch (error) {
        console.error('保存祝福失败:', error);
        // 最终降级到本地存储
        localStorage.setItem('familyWishes', JSON.stringify(wishes));
        return false;
    }
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
    if (!particlesContainer) return;
    
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

// 餐厅位置配置 - 固定不可修改
const RESTAURANT_CONFIG = {
    // 郑州市楚境餐厅（省政府店）坐标
    latitude: 34.7466,      // 纬度
    longitude: 113.6253,    // 经度
    title: '楚境餐厅（省政府店）',    // 餐厅名称
    address: '郑州市金水区省政府附近', // 地址描述
    phone: '0371-66565555'  // 电话号码
};

// 地图功能
function initMapFunction() {
    const mapBtn = document.getElementById('mapBtn');
    if (!mapBtn) return;
    
    mapBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openBaiduMap();
    });
}

// 电话功能
function initPhoneCall() {
    const callBtn = document.querySelector('.call-btn');
    if (!callBtn) return;
    
    callBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const phone = RESTAURANT_CONFIG.phone;
        // 尝试拨打电话
        window.location.href = `tel:${phone}`;
        showNotification(`正在为您拨打 ${phone} 📞`);
    });
}

// 打开百度地图
function openBaiduMap() {
    const { latitude, longitude, title, address } = RESTAURANT_CONFIG;
    
    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    
    // 百度地图网页版链接
    const baiduWebUrl = `https://map.baidu.com/poi/%E6%A5%9A%E5%A2%83%E9%A4%90%E5%8E%85(%E7%9C%81%E6%94%BF%E5%BA%9C%E5%BA%97)/@12663006.531564746,4108577.489719764,19z?uid=b7d23b502bd7f1c38605bf66&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl`;
    
    if (!isMobile) {
        // 桌面端直接打开网页版
        window.open(baiduWebUrl, '_blank');
        showNotification('正在为您打开百度地图网页版 🗺️');
        return;
    }
    
    if (isWechat) {
        // 微信内置浏览器直接打开网页版
        window.location.href = baiduWebUrl;
        showNotification('正在为您打开百度地图 🗺️');
        return;
    }
    
    // 移动端：尝试多种方式拉起地图App
    const appUrls = [
        // 百度地图App URL schemes
        `baidumap://map/place/detail?uid=b7d23b502bd7f1c38605bf66&src=webapp`,
        `bdapp://map/place/detail?uid=b7d23b502bd7f1c38605bf66`,
        
        // 通用地图 schemes
        `geo:${latitude},${longitude}?q=${encodeURIComponent(title)}`,
        `maps://maps.google.com/maps?q=${latitude},${longitude}`,
        
        // 高德地图作为备选
        `iosamap://poi?sourceApplication=webapp&pid=&appname=webapp&mid=&lat=${latitude}&lon=${longitude}&pname=${encodeURIComponent(title)}`
    ];
    
    let appLaunched = false;
    let attemptIndex = 0;
    
    function tryLaunchApp() {
        if (attemptIndex >= appUrls.length || appLaunched) {
            // 所有尝试都失败，打开网页版
            if (!appLaunched) {
                window.open(baiduWebUrl, '_blank');
                showNotification('正在为您打开百度地图网页版 🗺️');
            }
            return;
        }
        
        const currentUrl = appUrls[attemptIndex];
        attemptIndex++;
        
        // 创建隐藏链接尝试拉起App
        const link = document.createElement('a');
        link.href = currentUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // 监听页面可见性变化，判断是否成功拉起App
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                appLaunched = true;
                showNotification('正在为您打开地图App 📱');
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                document.body.removeChild(link);
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // 尝试点击链接
        try {
            link.click();
        } catch (e) {
            console.log('App launch attempt failed:', e);
        }
        
        // 短暂延迟后清理并尝试下一个
        setTimeout(() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (document.body.contains(link)) {
                document.body.removeChild(link);
            }
            
            if (!appLaunched) {
                tryLaunchApp();
            }
        }, 800);
    }
    
    // 开始尝试
    tryLaunchApp();
    
    // 兜底：2秒后如果都没成功，直接打开网页版
    setTimeout(() => {
        if (!appLaunched) {
            window.open(baiduWebUrl, '_blank');
            showNotification('正在为您打开百度地图网页版 🗺️');
        }
    }, 2000);
}

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