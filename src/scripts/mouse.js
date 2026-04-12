// ========== 特效：鼠标跟随图标 ==========
(function(){
    if (typeof window === 'undefined') return;

    const img = document.createElement('div')
    img.className = 'mouseImg'
    document.body.appendChild(img)

    // 鼠标最新位置
    let targetX=0,targetY=0;
    // 图片所在位置
    let currentX=0,currentY=0;

    // 监听鼠标移动时间，实时记录鼠标位置
    window.addEventListener('mousemove',(event)=>{
        targetX = event.clientX
        targetY = event.clientY
    })

    // 更新跟随图片的实际位置
    function animation(){
        // 新位置 = 当前位置 + (目标位置 - 当前位置) * 缓动系数
        // 系数越小，跟随越“黏”，延迟越大；系数越大，跟随越跟手。
        currentX+=(targetX-currentX)*0.8;
        currentY+=(targetY-currentY)*0.8;

        img.style.left = (currentX-img.offsetWidth/2) + 'px';
        img.style.top = (currentY-img.offsetHeight/2) + 'px';

        // 请求下一帧继续执行animation，形成不间断的动画循环
        requestAnimationFrame(animation);
    }
    animation()

    document.addEventListener('mouseleave',()=>{
        img.style.opacity='0'
    })
    document.addEventListener('mouseenter',()=>{
        img.style.opacity='1'
    })

})();

// ========== 特效：鼠标点击水波扩散特效 ==========
// 点击波纹特效（Canvas 版本）
(function() {
    if (typeof window === 'undefined') return;

    // 获取或创建 Canvas 图层（如果之前有鼠标跟随 Canvas，可以共用或新建）
    let canvas = document.getElementById('click-effect-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'click-effect-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 存储活跃的波纹对象
    let ripples = [];

    // 监听点击事件
    window.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        ripples.push({
            x, y,
            radius: 5,
            maxRadius: 80,
            alpha: 0.8,
            life: 1.0,      // 生命值 1 -> 0
            speed: 4        // 每帧半径增量
        });
    });

    // 动画循环：绘制所有波纹并更新状态
    function animateRipples() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < ripples.length; i++) {
            const r = ripples[i];
            r.radius += r.speed;
            r.life -= 0.02;      // 生命衰减
            r.alpha = r.life * 0.8;
            
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(111, 167, 83, ${r.alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // 可选：填充内圈淡出
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(111, 167, 83, ${r.alpha * 0.3})`;
            ctx.fill();
        }
        
        // 移除生命值耗尽的波纹
        ripples = ripples.filter(r => r.life > 0);
        
        requestAnimationFrame(animateRipples);
    }
    
    animateRipples();
})();