/**
 * MXDL AI 导航站 - SEO页面生成器
 * 自动生成：工具详情页、分类页、sitemap.xml
 * 运行：node generate-pages.js
 */

const fs = require('fs');
const path = require('path');

const tools = require('./data/tools.json');

// 加载广告和联盟配置
let ads = {};
let affiliates = {};
try { ads = require('./data/ads.json'); } catch(e) {}
try { 
    const aff = require('./data/affiliates.json');
    affiliates = aff.affiliates || {};
} catch(e) {}

const CATEGORIES = {
    'ai-writing': { name: 'AI写作', icon: '✍️', desc: 'AI写作工具帮你提升写作效率，从文案创作到代码编写，覆盖各种文字处理场景' },
    'ai-image': { name: 'AI绘图', icon: '🎨', desc: 'AI绘图工具让你无需绘画基础也能创作精美图像，从概念设计到商业素材一应俱全' },
    'ai-video': { name: 'AI视频', icon: '🎬', desc: 'AI视频工具涵盖视频生成、编辑、字幕和特效，让视频创作变得简单高效' },
    'ai-coding': { name: 'AI编程', icon: '💻', desc: 'AI编程助手帮助你更高效地编写代码，从智能补全到自动生成，提升开发效率' },
    'ai-design': { name: 'AI设计', icon: '🖌️', desc: 'AI设计工具让平面设计、UI设计和品牌设计更加智能化，降低设计门槛' },
    'ai-audio': { name: 'AI音频', icon: '🎵', desc: 'AI音频工具覆盖语音合成、音乐生成和音频处理，让声音创作变得简单' },
    'ai-office': { name: 'AI办公', icon: '📊', desc: 'AI办公工具集成在文档、表格和演示中，让日常工作更高效' },
    'ai-marketing': { name: 'AI营销', icon: '📣', desc: 'AI营销工具帮助品牌高效生成营销内容和优化广告投放策略' },
    'ai-agent': { name: 'AI智能体', icon: '🤖', desc: 'AI智能体平台让你构建自定义AI助手，实现工作流程自动化和智能交互' },
    'ai-search': { name: 'AI搜索', icon: '🔍', desc: 'AI搜索引擎提供更智能的搜索体验，直接给出结构化答案而非链接列表' },
    'ai-education': { name: 'AI教育', icon: '📚', desc: 'AI教育工具为学生和教育工作者提供个性化学习体验和智能辅导' },
    'ai-data': { name: 'AI数据', icon: '📈', desc: 'AI数据分析工具让数据处理和可视化更智能，无需专业编程技能' }
};

const PRICE_LABELS = { 'free': '免费', 'free-premium': '免费增值', 'paid': '付费' };
const PRICE_COLORS = { 'free': '#22c55e', 'free-premium': '#6366f1', 'paid': '#ef4444' };
const SITE_URL = 'https://ai.mxdl.online';

function getAffiliateUrl(toolId, defaultUrl) {
    return affiliates[toolId] || defaultUrl;
}

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getInitials(name) {
    return name.charAt(0).toUpperCase();
}

// Generate tool detail page
function generateToolPage(tool) {
    const url = getAffiliateUrl(tool.id, tool.url);
    const cat = CATEGORIES[tool.category] || { name: tool.category, icon: '🔧' };
    const priceColor = PRICE_COLORS[tool.pricing] || '#6366f1';
    const priceLabel = PRICE_LABELS[tool.pricing] || tool.pricing;
    const related = tools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6);
    const ratingStars = '★'.repeat(Math.floor(tool.rating || 3)) + '☆'.repeat(5 - Math.floor(tool.rating || 3));
    const hasAffiliate = !!affiliates[tool.id];
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(tool.name)} - AI工具详细介绍 | MXDL AI</title>
    <meta name="description" content="${escapeHtml(tool.description)}。了解${tool.name}的功能、定价和使用方式，快速上手这款AI工具。">
    <meta name="keywords" content="${tool.name}, AI工具, ${cat.name}, ${tool.tags.slice(0,3).join(', ')}">
    <meta property="og:title" content="${escapeHtml(tool.name)} - AI工具详细介绍 | MXDL AI">
    <meta property="og:description" content="${escapeHtml(tool.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/tools/${tool.id}.html">
    <link rel="canonical" href="${SITE_URL}/tools/${tool.id}.html">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "${escapeHtml(tool.name)}",
        "description": "${escapeHtml(tool.description)}",
        "applicationCategory": "AI工具",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "${tool.pricing === 'free' ? '0' : ' varies'}",
            "priceCurrency": "CNY"
        }
    }
    </script>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --primary: #6366f1; --primary-dark: #4f46e5; --primary-light: #818cf8; --bg: #0f0f1a; --bg-card: #1a1a2e; --bg-card-hover: #222240; --text: #e8e8f0; --text-muted: #9494b8; --border: #2a2a45; --gradient: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); --shadow: 0 4px 24px rgba(99,102,241,0.1); }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; min-height: 100vh; }
        .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
        a { color: var(--primary-light); text-decoration: none; }
        a:hover { opacity: 0.8; }
        
        header { position: sticky; top: 0; z-index: 100; background: rgba(15,15,26,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
        header .container { display: flex; align-items: center; justify-content: space-between; height: 60px; }
        .logo { font-size: 22px; font-weight: 800; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .logo span { -webkit-text-fill-color: #e8e8f0; font-weight: 400; font-size: 13px; }
        .back-link { color: var(--text-muted); font-size: 14px; }
        
        .breadcrumb { padding: 24px 0 12px; font-size: 13px; color: var(--text-muted); }
        .breadcrumb a { color: var(--text-muted); }
        .breadcrumb span { color: var(--text); }
        
        .tool-header { padding: 24px 0 32px; border-bottom: 1px solid var(--border); }
        .tool-header .icon { width: 64px; height: 64px; border-radius: 16px; background: var(--gradient); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: white; margin-bottom: 16px; }
        .tool-header h1 { font-size: 32px; font-weight: 800; margin-bottom: 12px; }
        .tool-header .meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
        .tool-header .meta .tag { padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; }
        .tag-cat { background: rgba(99,102,241,0.12); color: var(--primary-light); }
        .tag-price { background: rgba(239,68,68,0.1); color: #ef4444; }
        .tag-free { background: rgba(34,197,94,0.1); color: #22c55e; }
        .tag-freemium { background: rgba(99,102,241,0.1); color: var(--primary-light); }
        .tool-header p { font-size: 16px; color: var(--text-muted); line-height: 1.7; max-width: 700px; margin-bottom: 20px; }
        .btn-visit { display: inline-block; padding: 14px 36px; border-radius: 12px; background: var(--gradient); color: white; font-size: 15px; font-weight: 600; transition: all 0.25s; }
        .btn-visit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); opacity: 1; }
        
        .tool-detail { padding: 32px 0; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .info-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
        .info-item .label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
        .info-item .value { font-size: 14px; font-weight: 600; }
        
        .tags-section { margin-bottom: 32px; }
        .tags-section h3 { font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
        .tags-list { display: flex; gap: 8px; flex-wrap: wrap; }
        .tags-list span { padding: 4px 12px; border-radius: 6px; background: rgba(99,102,241,0.08); color: var(--text-muted); font-size: 13px; }
        
        .rating-display { margin-bottom: 24px; }
        .rating-display .stars { color: #f59e0b; font-size: 20px; }
        .rating-display .score { font-size: 14px; color: var(--text-muted); margin-left: 8px; }
        
        .affiliate-note { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); border-radius: 10px; padding: 14px 18px; font-size: 13px; color: var(--text-muted); margin-bottom: 32px; }
        
        .related-tools { padding: 32px 0; border-top: 1px solid var(--border); }
        .related-tools h2 { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
        .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
        .related-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 16px; transition: all 0.25s; }
        .related-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .related-card h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .related-card p { font-size: 13px; color: var(--text-muted); }
        
        footer { border-top: 1px solid var(--border); padding: 32px 0; text-align: center; color: var(--text-muted); font-size: 13px; }
        
        @media (max-width: 768px) {
            .tool-header h1 { font-size: 24px; }
            .info-grid { grid-template-columns: 1fr 1fr; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <a href="/" class="logo">MXDL <span>AI</span></a>
            <a href="/" class="back-link">← 返回首页</a>
        </div>
    </header>

    <main class="container">
        <nav class="breadcrumb">
            <a href="/">首页</a> / <a href="/">${cat.name}</a> / <span>${escapeHtml(tool.name)}</span>
        </nav>

        <div class="tool-header">
            <div class="icon">${getInitials(tool.name)}</div>
            <h1>${escapeHtml(tool.name)}</h1>
            <div class="meta">
                <span class="tag tag-cat">${cat.icon} ${cat.name}</span>
                <span class="tag ${tool.pricing === 'free' ? 'tag-free' : tool.pricing === 'free-premium' ? 'tag-freemium' : 'tag-price'}">${priceLabel}</span>
                ${hasAffiliate ? '<span class="tag" style="background:rgba(245,158,11,0.1);color:#f59e0b;">🤑 有佣金</span>' : ''}
            </div>
            <p>${escapeHtml(tool.description)}</p>
            <a href="${escapeHtml(url)}" class="btn-visit" target="_blank" rel="${hasAffiliate ? 'sponsored' : 'noopener'}">访问官网 →</a>
        </div>

        <div class="tool-detail">
            <div class="rating-display">
                <span class="stars">${ratingStars}</span>
                <span class="score">${tool.rating}/5</span>
            </div>

            <div class="info-grid">
                <div class="info-item">
                    <div class="label">分类</div>
                    <div class="value">${cat.icon} ${cat.name}</div>
                </div>
                <div class="info-item">
                    <div class="label">定价方式</div>
                    <div class="value" style="color:${priceColor}">${priceLabel}</div>
                </div>
                <div class="info-item">
                    <div class="label">官网</div>
                    <div class="value"><a href="${escapeHtml(url)}" target="_blank" rel="${hasAffiliate ? 'sponsored' : 'noopener'}">访问 →</a></div>
                </div>
                <div class="info-item">
                    <div class="label">收录时间</div>
                    <div class="value">2026年5月</div>
                </div>
            </div>

            ${tool.tags.length > 0 ? `
            <div class="tags-section">
                <h3>标签</h3>
                <div class="tags-list">
                    ${tool.tags.map(t => `<span>${t}</span>`).join('')}
                </div>
            </div>` : ''}

            ${hasAffiliate ? '<div class="affiliate-note">💡 通过本页链接注册/订阅，我们将获得少量佣金，这帮助我们维持网站运营，不影响你的购买价格。</div>' : ''}
        </div>

        ${related.length > 0 ? `
        <div class="related-tools">
            <h2>同类AI工具推荐</h2>
            <div class="related-grid">
                ${related.map(r => `
                <a href="/tools/${r.id}.html" class="related-card">
                    <h4>${escapeHtml(r.name)}</h4>
                    <p>${escapeHtml(r.description.substring(0, 60))}...</p>
                </a>`).join('')}
            </div>
        </div>` : ''}
    </main>

    <footer>
        <div class="container">
            <p><a href="/">MXDL AI</a> · 发现最好用的AI工具 · 收录${tools.length}+ AI工具</p>
        </div>
    </footer>
</body>
</html>`;
}

// Generate category page
function generateCategoryPage(catKey, catVal) {
    const catTools = tools.filter(t => t.category === catKey);
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${catVal.name}工具 - AI${catVal.name}工具推荐 | MXDL AI</title>
    <meta name="description" content="${catVal.desc}。收录${catTools.length}款AI${catVal.name}工具，含详细介绍和对比。">
    <meta name="keywords" content="AI${catVal.name}, ${catVal.name}工具, AI工具推荐">
    <link rel="canonical" href="${SITE_URL}/category/${catKey}.html">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --primary: #6366f1; --primary-dark: #4f46e5; --primary-light: #818cf8; --bg: #0f0f1a; --bg-card: #1a1a2e; --bg-card-hover: #222240; --text: #e8e8f0; --text-muted: #9494b8; --border: #2a2a45; --gradient: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
        a { color: var(--primary-light); text-decoration: none; }
        header { position: sticky; top: 0; z-index: 100; background: rgba(15,15,26,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
        header .container { display: flex; align-items: center; justify-content: space-between; height: 60px; }
        .logo { font-size: 22px; font-weight: 800; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .logo span { -webkit-text-fill-color: #e8e8f0; font-weight: 400; font-size: 13px; }
        .breadcrumb { padding: 24px 0; font-size: 13px; color: var(--text-muted); }
        .breadcrumb a { color: var(--text-muted); }
        .cat-header { padding: 0 0 24px; }
        .cat-header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
        .cat-header .icon { font-size: 36px; margin-bottom: 8px; }
        .cat-header p { color: var(--text-muted); font-size: 15px; }
        .cat-header .count { color: var(--primary-light); font-weight: 600; }
        .tool-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; padding-bottom: 48px; }
        .tool-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; transition: all 0.25s; }
        .tool-item:hover { border-color: var(--primary); transform: translateY(-2px); }
        .tool-item h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .tool-item .badge { font-size: 11px; padding: 2px 10px; border-radius: 20px; font-weight: 600; display: inline-block; margin-bottom: 8px; }
        .badge-free { background: rgba(34,197,94,0.15); color: #22c55e; }
        .badge-paid { background: rgba(239,68,68,0.15); color: #ef4444; }
        .badge-freemium { background: rgba(99,102,241,0.15); color: var(--primary-light); }
        .tool-item p { font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
        .tool-item .tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .tool-item .tags span { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(99,102,241,0.08); color: var(--text-muted); }
        .tool-item .footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .tool-item .footer .rating { color: #f59e0b; font-size: 12px; }
        footer { border-top: 1px solid var(--border); padding: 32px 0; text-align: center; color: var(--text-muted); font-size: 13px; }
        @media (max-width: 768px) { .tool-list { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <a href="/" class="logo">MXDL <span>AI</span></a>
            <a href="/" style="color:var(--text-muted);font-size:14px;">← 返回首页</a>
        </div>
    </header>
    <main class="container">
        <nav class="breadcrumb">
            <a href="/">首页</a> / <span>${catVal.name}</span>
        </nav>
        <div class="cat-header">
            <div class="icon">${catVal.icon}</div>
            <h1>AI${catVal.name}工具</h1>
            <p>${catVal.desc}</p>
            <p style="margin-top:8px;">共收录 <span class="count">${catTools.length}</span> 款AI${catVal.name}工具</p>
        </div>
        <div class="tool-list">
            ${catTools.map(t => {
                const ratingStars = '★'.repeat(Math.floor(t.rating || 3)) + '☆'.repeat(5 - Math.floor(t.rating || 3));
                const badgeClass = t.pricing === 'free' ? 'badge-free' : t.pricing === 'free-premium' ? 'badge-freemium' : 'badge-paid';
                const priceLabel = PRICE_LABELS[t.pricing] || t.pricing;
                return `
                <a href="/tools/${t.id}.html" class="tool-item">
                    <span class="badge ${badgeClass}">${priceLabel}</span>
                    <h3>${escapeHtml(t.name)}</h3>
                    <p>${escapeHtml(t.description.substring(0, 80))}...</p>
                    <div class="tags">${t.tags.slice(0,3).map(tag => `<span>${tag}</span>`).join('')}</div>
                    <div class="footer">
                        <span class="rating">${ratingStars}</span>
                        <span style="font-size:13px;color:var(--primary-light);">查看详情 →</span>
                    </div>
                </a>`;
            }).join('')}
        </div>
    </main>
    <footer>
        <div class="container">
            <p><a href="/">MXDL AI</a> · 发现最好用的AI工具 · 收录${tools.length}+ AI工具</p>
        </div>
    </footer>
</body>
</html>`;
}

// Generate sitemap.xml
function generateSitemap() {
    const urls = [];
    urls.push({ loc: '/', priority: '1.0', changefreq: 'daily' });
    
    for (const catKey of Object.keys(CATEGORIES)) {
        urls.push({ loc: `/category/${catKey}.html`, priority: '0.8', changefreq: 'weekly' });
    }
    
    for (const tool of tools) {
        urls.push({ loc: `/tools/${tool.id}.html`, priority: '0.6', changefreq: 'monthly' });
    }
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;
}

// Generate robots.txt
function generateRobots() {
    return `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ==== MAIN ====
console.log('🚀 MXDL AI SEO页面生成器');

// Create directories
['tools', 'category'].forEach(dir => {
    const p = path.join(__dirname, dir);
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p);
        console.log(`📁 Created ${dir}/ directory`);
    }
});

// Generate tool pages
console.log(`\n📄 Generating ${tools.length} tool pages...`);
tools.forEach(tool => {
    const html = generateToolPage(tool);
    fs.writeFileSync(path.join(__dirname, 'tools', `${tool.id}.html`), html);
});
console.log(`✅ ${tools.length} tool pages generated!`);

// Generate category pages
const catKeys = Object.keys(CATEGORIES);
console.log(`\n📄 Generating ${catKeys.length} category pages...`);
catKeys.forEach(key => {
    const html = generateCategoryPage(key, CATEGORIES[key]);
    fs.writeFileSync(path.join(__dirname, 'category', `${key}.html`), html);
});
console.log(`✅ ${catKeys.length} category pages generated!`);

// Generate sitemap
console.log('\n📄 Generating sitemap.xml...');
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), generateSitemap());
console.log('✅ sitemap.xml generated!');

// Generate robots.txt
console.log('📄 Generating robots.txt...');
fs.writeFileSync(path.join(__dirname, 'robots.txt'), generateRobots());
console.log('✅ robots.txt generated!');

// Stats
const totalPages = 1 + tools.length + catKeys.length;
console.log(`\n🎉 Done! Total pages: ${totalPages}`);
console.log(`   - Home: 1`);
console.log(`   - Tool detail: ${tools.length}`);
console.log(`   - Category: ${catKeys.length}`);
console.log(`   - sitemap.xml + robots.txt`);
