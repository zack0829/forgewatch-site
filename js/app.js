/* ==========================================================================
   Forgewatch 主控制脚本 - 原生 SPA 路由与交互式诊断控制大屏 (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 0. 多語言切換系統 (CN/EN Internationalization System)
    // ==========================================================================
    // 本地緩存讀取語言偏好，默認為繁體中文 'cn'，並進行安全過濾防止無效的偏好值導致崩潰
    let initialLang = localStorage.getItem('forgewatch-lang') || 'cn';
    if (initialLang !== 'cn' && initialLang !== 'en') {
        initialLang = 'cn';
    }
    window.currentLang = initialLang;

    const translations = {
        cn: {
            // 導覽列
            "[data-i18n='nav.home']": "主頁",
            "[data-i18n='nav.platform']": "平台功能",
            "[data-i18n='nav.industries']": "行业方案",
            "[data-i18n='nav.pricing']": "价格服务",
            "[data-i18n='nav.about']": "关于我们",
            "[data-i18n='nav.contact']": "联系我们",
            "[data-i18n='nav.cta']": "预约演示",
            
            // 首页 Hero 区域
            ".badge-new": "<span class=\"badge-pulse\"></span>新一代预测性维护平台",
            ".hero-title": "预知设备故障<br><span class=\"gradient-text\">防患于未然</span>",
            ".hero-subtitle": "Forgewatch 无缝接入您现有的工业设备，将原始传感器数据转化为清晰的极早期预警。大幅降低非计划停机时间，延长资产寿命，告别救火式被动修机。",
            ".hero-actions .btn-primary": "预约免费演示",
            ".hero-actions .btn-secondary": "了解工作原理",
            ".card-title-text": "设备实时健康状态 (车间 #3 产线)",
            ".health-label": "健康评分 (正常)",
            "#hero-vibration-val": "1.2 mm/s",
            "#hero-temp-val": "42.5 ℃",
            "#hero-diag-val": "运行平稳",
            ".radar-stat-item:nth-child(1) .stat-lbl": "实时振动",
            ".radar-stat-item:nth-child(2) .stat-lbl": "轴承温度",
            ".radar-stat-item:nth-child(3) .stat-lbl": "诊断状态",
            
            // 合作伙伴与数据
            ".trust-label": "备受全球顶尖运维与生产制造团队信赖",
            ".stats-grid .stat-card:nth-child(1) .stat-label": "平均减少非计划停机时间",
            ".stats-grid .stat-card:nth-child(2) .stat-label": "设备平均无故障时间（MTBF）提升",
            ".stats-grid .stat-card:nth-child(3) .stat-label": "首次获得有效故障隐患洞察时间",
            
            // 核心功能特色
            ".features-section .section-title": "全方位守护您的车间资产",
            ".features-section .section-subtitle": "Forgewatch 融合先进的物联网传感器与机器学习算法，让设备维护工作化被动为主动。",
            ".features-grid .feature-box:nth-child(1) .feature-box-title": "智能预测性维护",
            ".features-grid .feature-box:nth-child(1) .feature-box-body": "提前数周精准捕获设备磨损、不平衡及轴承过热。Forgewatch 自学习算法构建独特的“设备正常运行基准”，灵敏检测诱发重大停机故障的微小偏离趋势。",
            ".features-grid .feature-box:nth-child(2) .feature-box-title": "全渠道实时告警",
            ".features-grid .feature-box:nth-child(2) .feature-box-body": "当关键读数偏离安全阈值的第一时间，平台将通过短信、邮件及现有企业微信/钉钉/MES 系统精准推送警报。告别“停机时才发现”的阻碍窘境。",
            ".features-grid .feature-box:nth-child(3) .feature-box-title": "停机与运维成本骤降",
            ".features-grid .feature-box:nth-child(3) .feature-box-body": "让检修排单基于设备实际健康状况，而非刻板的时间表。避免紧急抢修带来的昂贵备件加急费、加班费，在产线计划性停工期内从容完成检修。",
            
            // 工作原理
            ".how-it-works-section .section-title": "极简部署，三步掌控开工率",
            ".how-it-works-section .section-subtitle": "Forgewatch 摒弃繁琐的传统工业改造，为您的工厂提供即插即用的智能闭环。",
            ".steps-container .step-card:nth-child(1) .step-title": "无缝连接 (Connect)",
            ".steps-container .step-card:nth-child(1) .step-body": "直接吸附安装 Forgewatch 无线振动与温度传感器，或直接提取您现有的 PLC 及 SCADA 系统数据流。无需推倒重建，快速激活。",
            ".steps-container .step-card:nth-child(2) .step-title": "智能监测 (Monitor)",
            ".steps-container .step-card:nth-child(2) .step-body": "为每台关键设备量身定制全天候健康评分。在统一的可视化看板中追踪历史基准、漂移趋势与早期异常读数。",
            ".steps-container .step-card:nth-child(3) .step-title": "精准排障 (Act)",
            ".steps-container .step-card:nth-child(3) .step-body": "收到带故障严重等级、推荐备件与可能成因（如“轴承不对中”或“动平衡不良”）的优先级预警，指导团队迅速排障。",
            
            // 底部 CTA
            ".bottom-cta-section .cta-title": "在您自己的真实设备上体验 Forgewatch",
            ".bottom-cta-section .cta-body": "立即预约 20 分钟专业演示，我们的专家将结合与您厂区相似的设备运行数据集，为您实操还原整个控制大屏的超早期预警过程。",
            ".bottom-cta-section .btn": "预约免费演示",
            
            // 平台大屏沙盒
            "#platform-view .page-title": "一个平台，掌控全厂资产",
            "#platform-view .section-subtitle": "从单台电机、水泵到集团化跨厂区运营，Forgewatch 为您的运维团队构筑统一、直观、智能的决策中枢。",
            ".sandbox-info h3": "交互式预测性维护沙盒演示",
            ".sandbox-intro-text": "拖动右侧的传感器参数滑块，模拟轴承磨损与异常恶化，实时观察图表和诊断中心如何防患于未然：",
            ".chart-tag": "实时传感器数据流 (100Hz)",
            ".chart-legends .legend:nth-child(1)": "<i class=\"legend-color cyan\"></i> 振动幅度 (mm/s)",
            ".chart-legends .legend:nth-child(2)": "<i class=\"legend-color orange\"></i> 轴承温度 (℃)",
            ".spark-box:nth-child(1) .spark-label": "实时振动均方根值",
            ".spark-box:nth-child(2) .spark-label": "实时轴承温度",
            ".health-gauge-widget h4": "资产实时健康指数",
            ".slider-widget h4": "工业异常模拟控制器",
            ".slider-group:nth-child(1) .slider-title": "机械结构偏心 (振动漂移)",
            ".slider-group:nth-child(2) .slider-title": "摩擦生热 (轴承温度)",
            
            // 平台四栏特色
            ".platform-features-list .platform-section-row:nth-child(1) .row-title": "1. 统一资产健康看板，告别无序猜测",
            ".platform-features-list .platform-section-row:nth-child(1) .row-body": "将生产车间内所有的电机、压缩机、泵阀和传送皮带数据汇总至单一的可视化屏幕。每个资产的健康评分、实时读数和劣化历史并排呈现，无需再繁琐比对多张电子表格，管理效率倍增。",
            ".platform-features-list .platform-section-row:nth-child(1) .bullet-list li:nth-child(1)": "支持多厂区/多产线级联拓扑结构",
            ".platform-features-list .platform-section-row:nth-child(1) .bullet-list li:nth-child(2)": "参数自定义：振动、温度、超声波、电流",
            ".platform-features-list .platform-section-row:nth-child(1) .bullet-list li:nth-child(3)": "卡片式直观界面，快速筛选高危资产",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-title": "资产监控中心 Dashboard",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-asset-card:nth-child(1) .asset-name": "#01 循环水泵电机",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-asset-card:nth-child(2) .asset-name": "#02 冲压机空气压缩机",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-asset-card:nth-child(3) .asset-name": "#03 主传动皮带齿轮箱",
            ".platform-features-list .platform-section-row:nth-child(1) .asset-info-line span": "评分",
            
            ".platform-features-list .platform-section-row:nth-child(2) .row-title": "2. 自学习异常检测，杜绝“狼来了”的假警报",
            ".platform-features-list .platform-section-row:nth-child(2) .row-body": "传统设备阈值报警要么迟缓漏报，要么因过于敏感频繁误报导致运维团队陷入警报疲劳。Forgewatch 为每台资产运行前两周的数据流建立个性化运行“指纹”。动态基准随环境温度、季节和生产载荷变化自适应调整，只在真正的损坏发生偏离时发出警告。",
            ".platform-features-list .platform-section-row:nth-child(2) .bullet-list li:nth-child(1)": "无监督学习，无需手动标注故障数据",
            ".platform-features-list .platform-section-row:nth-child(2) .bullet-list li:nth-child(2)": "自适应环境特征（如季节温度变化）",
            ".platform-features-list .platform-section-row:nth-child(2) .bullet-list li:nth-child(3)": "极早期微秒级漂移侦测",
            ".platform-features-list .platform-section-row:nth-child(2) .ui-title": "自学习动态特征指纹",
            ".platform-features-list .platform-section-row:nth-child(2) .ui-content-flex text:nth-of-type(1)": "超基准异常偏移",
            ".platform-features-list .platform-section-row:nth-child(2) .ui-content-flex text:nth-of-type(2)": "绿色带：自学习动态正常区间",
            
            ".platform-features-list .platform-section-row:nth-child(3) .row-title": "3. 多渠道协同预警，精准直达检修人员",
            ".platform-features-list .platform-section-row:nth-child(3) .row-body": "不仅仅是告警，更是行动指南。Forgewatch 支持自定义分级路由。低级别漂移会默默通知值班班长并记录于月报，而突发严重偏离则能通过企业微信、短信、邮件实时唤醒责任工程师，并附带可能原因（如轴承剥落）及推荐工器具，缩短 80% 的诊断耗时。",
            ".platform-features-list .platform-section-row:nth-child(3) .bullet-list li:nth-child(1)": "按资产严重度与值班排班智能路由",
            ".platform-features-list .platform-section-row:nth-child(3) .bullet-list li:nth-child(2)": "故障可能原因与推荐维修步骤一并下发",
            ".platform-features-list .platform-section-row:nth-child(3) .bullet-list li:nth-child(3)": "支持工单系统 (ERP/EAM) 的无缝工单流转",
            ".platform-features-list .platform-section-row:nth-child(3) .ui-title": "多渠道分级通知路由",
            ".platform-features-list .platform-section-row:nth-child(3) .alert-p-header span:nth-child(1)": "⚠️ Forgewatch 异常报警",
            ".platform-features-list .platform-section-row:nth-child(3) .alert-p-header span:nth-child(2)": "刚刚",
            
            ".platform-features-list .platform-section-row:nth-child(4) .row-title": "4. 量化价值报告，精细掌控投资回报",
            ".platform-features-list .platform-section-row:nth-child(4) .row-body": "每月为您自动生成极富洞察力的运营与投资效益报告。统计本月成功避免的灾难性停机次数、折合减少的产值损失、备件及人工工时节省金额。为设备管理人员向集团管理层汇报及申请维护预算提供坚实的数据支撑。",
            ".platform-features-list .platform-section-row:nth-child(4) .bullet-list li:nth-child(1)": "一键导出 PDF/Excel 月度设备体检月报",
            ".platform-features-list .platform-section-row:nth-child(4) .bullet-list li:nth-child(2)": "隐形损失节约估算模型",
            ".platform-features-list .platform-section-row:nth-child(4) .bullet-list li:nth-child(3)": "高故障率设备与易损件排行榜，优化备件库存",
            ".platform-features-list .platform-section-row:nth-child(4) .ui-title": "本月运维效益量化简报",
            ".platform-features-list .platform-section-row:nth-child(4) .ui-stat-bar-group:nth-child(1) span": "预估避免意外停机时间",
            ".platform-features-list .platform-section-row:nth-child(4) .ui-stat-bar-group:nth-child(2) span": "折合降低停机经济损失",
            
            // 行业方案
            "#industries-view .page-title": "为关键生产线和高精尖设备量身定制",
            "#industries-view .section-subtitle": "Forgewatch 深入各垂直制造行业的核心痛点，为核心旋转机械、冲压线等设备提供坚实防护。",
            ".industries-grid .industry-card:nth-child(1) h3": "汽车制造与冲压装配",
            ".industries-grid .industry-card:nth-child(1) p": "保障高速、超饱和大批量生产环境中的重型冲压机床、伺服主轴与工业六轴焊装机器人关节持续稳定运行，避免关键阀岛或偏心轮损伤引发整条冲装线瘫痪。",
            ".industries-grid .industry-card:nth-child(2) h3": "食品加工与灌装包装",
            ".industries-grid .industry-card:nth-child(2) p": "在卫生安全要求高、生产节奏紧凑的饮料灌装、食品封包线中，全天候守护大功率冷冻鼓风机、绞碎减速箱和封盖转塔，杜绝恶性停机导致的巨量原材料腐败与交付违约。",
            ".industries-grid .industry-card:nth-child(3) h3": "能源开发与公用事业",
            ".industries-grid .industry-card:nth-child(3) p": "实时监控偏远地区的风力发电机偏航减速箱、高压离心抽水泵与热电轮机组。提前预测关键机油杂质及定子绕组过热，降低极昂贵的无序现场故障拉练与巡检差旅成本。",
            ".industries-grid .industry-card:nth-child(4) h3": "重工业与钢铁采矿",
            ".industries-grid .industry-card:nth-child(4) p": "针对水泥磨机、炼钢辊道高负载以及矿山碎石机极其恶劣的粉尘振动工况，利用深度过滤算法消除底噪干扰，早期捕获大型低速重载轴承剥落、齿轮断齿等灾难性故障隐患。",
            
            // 价格
            "#pricing-view .page-title": "伴随您的厂区规模，灵活扩展",
            "#pricing-view .section-subtitle": "从单条实验性产线起步试点，到全球多站点无缝部署。免除长期合同捆绑，以最适合的组合开启精益维护之旅。",
            ".pricing-grid .pricing-card:nth-child(1) .plan-subtitle": "试点首选",
            ".pricing-grid .pricing-card:nth-child(1) h3": "基础体验版 (Starter)",
            ".pricing-grid .pricing-card:nth-child(1) .plan-for": "适用于单条产线或概念验证 (PoC) 项目",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(1)": "<span class=\"check-icon\">✓</span> 支持接入高达 10 台关键资产",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(2)": "<span class=\"check-icon\">✓</span> 核心资产运行健康度评估",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(3)": "<span class=\"check-icon\">✓</span> 基础邮件与系统内警报通知",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(4)": "<span class=\"check-icon\">✓</span> 5x8 小时标准远程客户支持",
            ".pricing-grid .pricing-card:nth-child(1) .btn": "联系销售人员",
            
            ".pricing-grid .pricing-card:nth-child(2) .plan-popular-badge": "最受欢迎",
            ".pricing-grid .pricing-card:nth-child(2) .plan-subtitle": "全厂守护",
            ".pricing-grid .pricing-card:nth-child(2) h3": "车间专业版 (Growth)",
            ".pricing-grid .pricing-card:nth-child(2) .plan-for": "适用于一至数个完整的生产车间",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(1)": "<span class=\"check-icon\">✓</span> 支持接入高达 100 台资产设备",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(2)": "<span class=\"check-icon\">✓</span> 自学习无监督异常漂移检测",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(3)": "<span class=\"check-icon\">✓</span> 分级预警、短信及企业微信智能路由",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(4)": "<span class=\"check-icon\">✓</span> 自动化月度效益量化与体检报告",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(5)": "<span class=\"check-icon\">✓</span> 7x24 小时优先通道高级技术支持",
            ".pricing-grid .pricing-card:nth-child(2) .btn": "开启专业评估",
            
            ".pricing-grid .pricing-card:nth-child(3) .plan-subtitle": "数字化集团",
            ".pricing-grid .pricing-card:nth-child(3) h3": "集团旗舰版 (Enterprise)",
            ".pricing-grid .pricing-card:nth-child(3) .plan-for": "适用于多集团跨厂区、多国家多站点管理",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(1)": "<span class=\"check-icon\">✓</span> 不限资产设备接入量",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(2)": "<span class=\"check-icon\">✓</span> 单点登录 (SSO) 与精细化角色权限",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(3)": "<span class=\"check-icon\">✓</span> 开放 REST API 与 Webhooks 数据库对接",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(4)": "<span class=\"check-icon\">✓</span> 专属高级大客户经理 (CSM) 持续护航",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(5)": "<span class=\"check-icon\">✓</span> SLA 级响应时间与驻场硬件调试服务",
            ".pricing-grid .pricing-card:nth-child(3) .btn": "咨询集团定制方案",
            
            // 关于我们
            "#about-view .page-title": "我们深知并受够了“抢修停机”的痛苦",
            "#about-view .about-story-p:nth-child(2)": "Forgewatch 诞生于真实粗犷的工厂车间。我们是一群曾在这片轰鸣声中工作的工程师。我们深知，当一个毫无征兆损坏的减速箱轴承突然咬死，导致整条关键流水线在深夜骤停时，那种手忙脚乱的抢修、焦急的备件催单，以及数以万计的产值损失有多痛心。",
            "#about-view .about-story-p:nth-child(3)": "于是，我们决定做点什么，打造我们自己当时最梦寐以求的利器：一个部署极其简单、能用您已有数据流、并且以最直观易懂的语言向您进行超早期示警的智能平台。",
            "#about-view .about-story-p:nth-child(4)": "今天，Forgewatch 已经帮助数以百计的制造团队成功将充满焦躁的“消防员式紧急抢修”平移为从容得体的“计划性预防检修”，让工业传感器数据真正成为保障设备平稳开工的护航战甲。",
            ".values-section .section-title": "指引我们的工业信条",
            ".values-grid .value-box:nth-child(1) h3": "务实落地，服务车间 (Practical)",
            ".values-grid .value-box:nth-child(1) p": "我们坚信产品要为奔忙在设备前线车间运维人员而建，而不是仅供会议室或PPT作秀。易懂、易用、解决实际痛点是我们的核心衡量尺标。",
            ".values-grid .value-box:nth-child(2) h3": "公开透明，杜绝黑盒 (Transparent)",
            ".values-grid .value-box:nth-child(2) p": "明确的打分算法、清晰的预警偏离依据、明晰的可能成因。我们拒绝高深莫测的机器学习“黑盒”，任何早期告警都伴有数据事实的完美佐证。",
            ".values-grid .value-box:nth-child(3) h3": "稳健可靠，开工率之盾 (Reliable)",
            ".values-grid .value-box:nth-child(3) p": "作为设备在线开工率最强有力的后盾，我们像对待最精密的设备一样，打磨平台在长周期高强度环境下的稳定性和异常预警 of 超高准度。",
            
            // 联系我们
            "#contact-view .page-title": "聊聊您的设备<br><span class=\"gradient-text\">开工率提升计划</span>",
            "#contact-view .contact-panel-sub": "告诉我们您车间的设备运行现状与难点，我们的资深工业智能诊断工程师将在 1 个工作日内给您反馈，为您量身演示专属数据看板。",
            "#contact-view .detail-item:nth-child(1) .detail-label": "公司名称",
            "#contact-view .detail-item:nth-child(2) .detail-label": "企業總部",
            "#contact-view .detail-item:nth-child(2) .detail-value": "台灣",
            "#contact-view .detail-item:nth-child(3) .detail-label": "业务合作与诊断支持",
            "label[for='fullName']": "您的姓名 *",
            "label[for='company']": "企业/机构名称 *",
            "label[for='email']": "工作邮箱地址 *",
            "label[for='message']": "您车间有哪些关键设备希望接入监测？(可选)",
            "#form-submit-btn .btn-text": "发送预约申请",
            
            // Footer
            ".footer-brand-col .footer-tagline": "专为不可承受意外停机的硬核旋转与关键加工资产提供预测性智能维护。",
            ".footer-links-grid .footer-col:nth-child(1) h4": "核心功能",
            ".footer-links-grid .footer-col:nth-child(1) ul li:nth-child(1) a": "在线监控",
            ".footer-links-grid .footer-col:nth-child(1) ul li:nth-child(2) a": "订阅计划",
            ".footer-links-grid .footer-col:nth-child(1) ul li:nth-child(3) a": "垂直行业",
            ".footer-links-grid .footer-col:nth-child(2) h4": "企业信息",
            ".footer-links-grid .footer-col:nth-child(2) ul li:nth-child(1) a": "创始团队",
            ".footer-links-grid .footer-col:nth-child(2) ul li:nth-child(2) a": "联系合作",
            ".footer-legal": "© 2026 Forgewatch 有限公司。保留所有权利。 <span class=\"legal-separator\">|</span> <span class=\"illustrative-disclaimer\">声明：本网站所展示的全部统计图表、效益估算及模拟诊断数据均作为典型试点应用效果之示意说明。</span>",
            
            // 成功弹窗
            ".success-modal-card h3": "预约申请已成功提交！",
            ".success-modal-card p:nth-of-type(1)": "感谢您关注 Forgewatch。我们已收到您的联络信息与设备需求：",
            ".modal-footer-p": "我们的资深现场物联网诊断顾问将在 <strong>1个工作日内</strong> 拨打您的联络邮箱/电话，为您建立专属的远程体验沙盒！",
            "#modal-close-btn": "返回浏览"
        },
        en: {
            // 導覽列
            "[data-i18n='nav.home']": "Home",
            "[data-i18n='nav.platform']": "Platform",
            "[data-i18n='nav.industries']": "Industries",
            "[data-i18n='nav.pricing']": "Pricing",
            "[data-i18n='nav.about']": "About",
            "[data-i18n='nav.contact']": "Contact",
            "[data-i18n='nav.cta']": "Request a Demo",
            
            // 首页 Hero 区域
            ".badge-new": "<span class=\"badge-pulse\"></span>Next-Gen Predictive Maintenance",
            ".hero-title": "Know when your machines will fail — <br><span class=\"gradient-text\">before they do.</span>",
            ".hero-subtitle": "Forgewatch connects to the equipment you already run and turns raw sensor data into clear, early warnings. Cut unplanned downtime, extend asset life, and stop reacting to breakdowns.",
            ".hero-actions .btn-primary": "Request a Demo",
            ".hero-actions .btn-secondary": "See how it works",
            ".card-title-text": "Real-time Machine Health (Line #3)",
            ".health-label": "Health Score (Normal)",
            "#hero-vibration-val": "1.2 mm/s",
            "#hero-temp-val": "42.5 ℃",
            "#hero-diag-val": "Smooth running",
            ".radar-stat-item:nth-child(1) .stat-lbl": "Live Vibration",
            ".radar-stat-item:nth-child(2) .stat-lbl": "Bearing Temp",
            ".radar-stat-item:nth-child(3) .stat-lbl": "Diagnostic",
            
            // 合作伙伴与数据
            ".trust-label": "Trusted by maintenance and operations teams across manufacturing",
            ".stats-grid .stat-card:nth-child(1) .stat-label": "average reduction in unplanned downtime",
            ".stats-grid .stat-card:nth-child(2) .stat-label": "longer mean time between failures",
            ".stats-grid .stat-card:nth-child(3) .stat-label": "to first actionable insight",
            
            // 核心功能特色
            ".features-section .section-title": "One platform for every asset on your floor.",
            ".features-section .section-subtitle": "Forgewatch connects to the equipment you already run and turns raw sensor data into clear, early warnings.",
            ".features-grid .feature-box:nth-child(1) .feature-box-title": "Predictive maintenance",
            ".features-grid .feature-box:nth-child(1) .feature-box-body": "Spot wear, imbalance, and overheating weeks ahead. Forgewatch learns each machine's normal and flags the drift that leads to failure.",
            ".features-grid .feature-box:nth-child(2) .feature-box-title": "Real-time alerts",
            ".features-grid .feature-box:nth-child(2) .feature-box-body": "Get notified the moment a reading crosses your threshold — by dashboard, email, or your existing tools. No more finding out on the factory floor.",
            ".features-grid .feature-box:nth-child(3) .feature-box-title": "Lower downtime costs",
            ".features-grid .feature-box:nth-child(3) .feature-box-body": "Schedule repairs on your terms, not the machine's. Fewer emergency stops, less overtime, and parts ordered before the line goes down.",
            
            // 工作原理
            ".how-it-works-section .section-title": "How it works",
            ".how-it-works-section .section-subtitle": "Forgewatch connects to the equipment you already run and turns raw sensor data into clear, early warnings.",
            ".steps-container .step-card:nth-child(1) .step-title": "Connect",
            ".steps-container .step-card:nth-child(1) .step-body": "Attach Forgewatch sensors or stream from your existing PLCs and SCADA systems. No rip-and-replace.",
            ".steps-container .step-card:nth-child(2) .step-title": "Monitor",
            ".steps-container .step-card:nth-child(2) .step-body": "Every asset gets a live health score. Trends, baselines, and anomalies in one dashboard.",
            ".steps-container .step-card:nth-child(3) .step-title": "Act",
            ".steps-container .step-card:nth-child(3) .step-body": "Receive prioritised alerts with the likely cause, so your team fixes the right thing first.",
            
            // 底部 CTA
            ".bottom-cta-section .cta-title": "See Forgewatch on your own equipment.",
            ".bottom-cta-section .cta-body": "Book a 20-minute demo and we'll walk through a live dashboard using data from a machine like yours.",
            ".bottom-cta-section .btn": "Request a demo",
            
            // 平台大屏沙盒
            "#platform-view .page-title": "One platform for every asset on your floor.",
            "#platform-view .section-subtitle": "From a single motor to an entire facility, Forgewatch gives your team one place to watch machine health and act before failure.",
            ".sandbox-info h3": "Interactive Predictive Maintenance Sandbox",
            ".sandbox-intro-text": "Drag the sensor sliders on the right to simulate bearing wear and see how Forgewatch alerts your team:",
            ".chart-tag": "Live Sensor Data Stream (100Hz)",
            ".chart-legends .legend:nth-child(1)": "<i class=\"legend-color cyan\"></i> Vibration Amplitude (mm/s)",
            ".chart-legends .legend:nth-child(2)": "<i class=\"legend-color orange\"></i> Bearing Temp (℃)",
            ".spark-box:nth-child(1) .spark-label": "Real-time Vibration RMS",
            ".spark-box:nth-child(2) .spark-label": "Real-time Bearing Temp",
            ".health-gauge-widget h4": "Live Asset Health Score",
            ".slider-widget h4": "Industrial Anomaly Simulator",
            ".slider-group:nth-child(1) .slider-title": "Mechanical Misalignment (Vibration)",
            ".slider-group:nth-child(2) .slider-title": "Friction Overheating (Bearing Temp)",
            
            // 平台四栏特色
            ".platform-features-list .platform-section-row:nth-child(1) .row-title": "1. One dashboard for every asset",
            ".platform-features-list .platform-section-row:nth-child(1) .row-body": "Bring every motor, pump, and conveyor into a single view. Health scores, live readings, and history side by side — no spreadsheets, no guesswork.",
            ".platform-features-list .platform-section-row:nth-child(1) .bullet-list li:nth-child(1)": "Supports plant-wide and asset-level hierarchy",
            ".platform-features-list .platform-section-row:nth-child(1) .bullet-list li:nth-child(2)": "Monitors vibration, temperature, and current",
            ".platform-features-list .platform-section-row:nth-child(1) .bullet-list li:nth-child(3)": "Intuitive cards to quickly filter high-risk assets",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-title": "Asset Monitoring Dashboard",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-asset-card:nth-child(1) .asset-name": "#01 Circulating Pump Motor",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-asset-card:nth-child(2) .asset-name": "#02 Air Compressor Motor",
            ".platform-features-list .platform-section-row:nth-child(1) .ui-asset-card:nth-child(3) .asset-name": "#03 Main Gearbox Drive",
            ".platform-features-list .platform-section-row:nth-child(1) .asset-info-line span": "Score",
            
            ".platform-features-list .platform-section-row:nth-child(2) .row-title": "2. Anomaly detection that learns",
            ".platform-features-list .platform-section-row:nth-child(2) .row-body": "Forgewatch builds a baseline for each machine from its own running data, so alerts reflect your normal — not a generic threshold that cries wolf.",
            ".platform-features-list .platform-section-row:nth-child(2) .bullet-list li:nth-child(1)": "Unsupervised learning requires no manual labeling",
            ".platform-features-list .platform-section-row:nth-child(2) .bullet-list li:nth-child(2)": "Adapts automatically to ambient load fluctuations",
            ".platform-features-list .platform-section-row:nth-child(2) .bullet-list li:nth-child(3)": "Detects microscopic drifts weeks before failure",
            ".platform-features-list .platform-section-row:nth-child(2) .ui-title": "Adaptive Dynamic Baseline Fingerprint",
            ".platform-features-list .platform-section-row:nth-child(2) .ui-content-flex text:nth-of-type(1)": "Over-Baseline Anomaly Drift",
            ".platform-features-list .platform-section-row:nth-child(2) .ui-content-flex text:nth-of-type(2)": "Green band: Self-learned dynamic normal range",
            
            ".platform-features-list .platform-section-row:nth-child(3) .row-title": "3. Alerts that reach your team",
            ".platform-features-list .platform-section-row:nth-child(3) .row-body": "Route notifications to email, SMS, or the maintenance tools you already use. Set who gets what, and when, by asset or severity.",
            ".platform-features-list .platform-section-row:nth-child(3) .bullet-list li:nth-child(1)": "Smart routing based on severity and shift schedules",
            ".platform-features-list .platform-section-row:nth-child(3) .bullet-list li:nth-child(2)": "Includes failure cause and recommended repair steps",
            ".platform-features-list .platform-section-row:nth-child(3) .bullet-list li:nth-child(3)": "Seamless API integrations with ERP/EAM systems",
            ".platform-features-list .platform-section-row:nth-child(3) .ui-title": "Multi-Channel Alert Dispatch",
            ".platform-features-list .platform-section-row:nth-child(3) .alert-p-header span:nth-child(1)": "⚠️ Forgewatch Alert Notification",
            ".platform-features-list .platform-section-row:nth-child(3) .alert-p-header span:nth-child(2)": "just now",
            
            ".platform-features-list .platform-section-row:nth-child(4) .row-title": "4. Reports that prove the value",
            ".platform-features-list .platform-section-row:nth-child(4) .row-body": "Export downtime trends, cost savings, and asset health for the people who sign off the budget. Clear numbers, every month.",
            ".platform-features-list .platform-section-row:nth-child(4) .bullet-list li:nth-child(1)": "One-click PDF/Excel export for monthly asset audits",
            ".platform-features-list .platform-section-row:nth-child(4) .bullet-list li:nth-child(2)": "Pre-built models to estimate financial cost savings",
            ".platform-features-list .platform-section-row:nth-child(4) .bullet-list li:nth-child(3)": "Identifies repetitive bad actors to optimize spares inventory",
            ".platform-features-list .platform-section-row:nth-child(4) .ui-title": "Monthly Maintenance ROI Summary",
            ".platform-features-list .platform-section-row:nth-child(4) .ui-stat-bar-group:nth-child(1) span": "Catastrophic Downtime Avoided",
            ".platform-features-list .platform-section-row:nth-child(4) .ui-stat-bar-group:nth-child(2) span": "Estimated Financial Savings",
            
            // 行业方案
            "#industries-view .page-title": "Built for the equipment that can't go down.",
            "#industries-view .section-subtitle": "Forgewatch works across the assets where a single failure stops everything.",
            ".industries-grid .industry-card:nth-child(1) h3": "Automotive Manufacturing",
            ".industries-grid .industry-card:nth-child(1) p": "Keep stamping presses and robotic cells running through high-volume production.",
            ".industries-grid .industry-card:nth-child(2) h3": "Food & Beverage",
            ".industries-grid .industry-card:nth-child(2) p": "Protect uptime on packaging and processing lines where every stoppage spoils throughput.",
            ".industries-grid .industry-card:nth-child(3) h3": "Energy & Utilities",
            ".industries-grid .industry-card:nth-child(3) p": "Monitor pumps, turbines, and remote assets where a site visit isn't always an option.",
            ".industries-grid .industry-card:nth-child(4) h3": "Heavy Industry",
            ".industries-grid .industry-card:nth-child(4) p": "Catch bearing and gearbox wear early on the equipment that's most expensive to replace.",
            
            // 价格
            "#pricing-view .page-title": "Pricing that scales with your floor.",
            "#pricing-view .section-subtitle": "Start with one line, expand to every site. No long-term lock-in to get going.",
            ".pricing-grid .pricing-card:nth-child(1) .plan-subtitle": "Pilot Plan",
            ".pricing-grid .pricing-card:nth-child(1) h3": "Starter Plan",
            ".pricing-grid .pricing-card:nth-child(1) .plan-for": "For a single line or pilot",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(1)": "<span class=\"check-icon\">✓</span> Up to 10 assets",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(2)": "<span class=\"check-icon\">✓</span> Core health monitoring",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(3)": "<span class=\"check-icon\">✓</span> Email alerts",
            ".pricing-grid .pricing-card:nth-child(1) .plan-features li:nth-child(4)": "<span class=\"check-icon\">✓</span> Standard support",
            ".pricing-grid .pricing-card:nth-child(1) .btn": "Talk to sales",
            
            ".pricing-grid .pricing-card:nth-child(2) .plan-popular-badge": "Most Popular",
            ".pricing-grid .pricing-card:nth-child(2) .plan-subtitle": "Full Floor",
            ".pricing-grid .pricing-card:nth-child(2) h3": "Growth Plan",
            ".pricing-grid .pricing-card:nth-child(2) .plan-for": "For a full facility",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(1)": "<span class=\"check-icon\">✓</span> Up to 100 assets",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(2)": "<span class=\"check-icon\">✓</span> Anomaly detection",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(3)": "<span class=\"check-icon\">✓</span> Custom alert routing",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(4)": "<span class=\"check-icon\">✓</span> Monthly reporting",
            ".pricing-grid .pricing-card:nth-child(2) .plan-features li:nth-child(5)": "<span class=\"check-icon\">✓</span> Priority support",
            ".pricing-grid .pricing-card:nth-child(2) .btn": "Get Started",
            
            ".pricing-grid .pricing-card:nth-child(3) .plan-subtitle": "Enterprise",
            ".pricing-grid .pricing-card:nth-child(3) h3": "Enterprise Plan",
            ".pricing-grid .pricing-card:nth-child(3) .plan-for": "For multi-site operations",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(1)": "<span class=\"check-icon\">✓</span> Unlimited assets",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(2)": "<span class=\"check-icon\">✓</span> SSO & roles",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(3)": "<span class=\"check-icon\">✓</span> API access",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(4)": "<span class=\"check-icon\">✓</span> Dedicated success manager",
            ".pricing-grid .pricing-card:nth-child(3) .plan-features li:nth-child(5)": "<span class=\"check-icon\">✓</span> SLA",
            ".pricing-grid .pricing-card:nth-child(3) .btn": "Contact Enterprise Sales",
            
            // 关于我们
            "#about-view .page-title": "We got tired of unplanned downtime.",
            "#about-view .about-story-p:nth-child(2)": "Forgewatch started on a factory floor, where a single failed bearing could halt an entire shift. We built the tool we wished we'd had: one that warns you early, in plain language, using the equipment you already own.",
            "#about-view .about-story-p:nth-child(3)": "Today we help maintenance and operations teams trade firefighting for planning — turning sensor data into decisions that keep the line moving.",
            "#about-view .about-story-p:nth-child(4)": "",
            ".values-section .section-title": "Our Values",
            ".values-grid .value-box:nth-child(1) h3": "Practical",
            ".values-grid .value-box:nth-child(1) p": "Built for the floor, not just the boardroom.",
            ".values-grid .value-box:nth-child(2) h3": "Transparent",
            ".values-grid .value-box:nth-child(2) p": "Clear scores, clear reasons, no black boxes.",
            ".values-grid .value-box:nth-child(3) h3": "Reliable",
            ".values-grid .value-box:nth-child(3) p": "The kind of partner uptime depends on.",
            
            // 联系我们
            "#contact-view .page-title": "Let's talk uptime.",
            "#contact-view .contact-panel-sub": "Tell us about your equipment and we'll show you what Forgewatch can see.",
            "#contact-view .detail-item:nth-child(1) .detail-label": "Company Name",
            "#contact-view .detail-item:nth-child(2) .detail-label": "Headquarters",
            "#contact-view .detail-item:nth-child(2) .detail-value": "Taiwan",
            "#contact-view .detail-item:nth-child(3) .detail-label": "Sales & Support",
            "label[for='fullName']": "Your Name *",
            "label[for='company']": "Company *",
            "label[for='email']": "Work Email *",
            "label[for='message']": "What would you like to monitor? (Optional)",
            "#form-submit-btn .btn-text": "Request a Demo",
            
            // Footer
            ".footer-brand-col .footer-tagline": "Predictive maintenance for the equipment you can't afford to lose.",
            ".footer-links-grid .footer-col:nth-child(1) h4": "Product",
            ".footer-links-grid .footer-col:nth-child(1) ul li:nth-child(1) a": "Online Monitoring",
            ".footer-links-grid .footer-col:nth-child(1) ul li:nth-child(2) a": "Subscription Plans",
            ".footer-links-grid .footer-col:nth-child(1) ul li:nth-child(3) a": "Vertical Industries",
            ".footer-links-grid .footer-col:nth-child(2) h4": "Company",
            ".footer-links-grid .footer-col:nth-child(2) ul li:nth-child(1) a": "Founding Team",
            ".footer-links-grid .footer-col:nth-child(2) ul li:nth-child(2) a": "Partnership",
            ".footer-legal": "© 2026 Forgewatch Ltd. All rights reserved. <span class=\"legal-separator\">|</span> <span class=\"illustrative-disclaimer\">Disclaimer: Figures shown across this site are illustrative, based on typical pilot deployments.</span>",
            
            // 成功弹窗
            ".success-modal-card h3": "Request Submitted Successfully!",
            ".success-modal-card p:nth-of-type(1)": "Thank you for your interest in Forgewatch. We have received your contact details and device requirements:",
            ".modal-footer-p": "Our senior IoT diagnostics consultant will contact you via your work email/phone within <strong>1 business day</strong> to set up your dedicated sandbox demonstration!",
            "#modal-close-btn": "Close"
        }
    };

    function changeLanguage(lang) {
        if (lang !== 'cn' && lang !== 'en') {
            lang = 'cn';
        }
        window.currentLang = lang;
        localStorage.setItem('forgewatch-lang', lang);

        const langMap = translations[lang] || translations['cn'];
        for (const [selector, value] of Object.entries(langMap)) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.setAttribute('placeholder', value.replace(/\s*\*$/, '')); // 移除 placeholder 中的星号格式
                } else {
                    el.innerHTML = value;
                }
            });
        }

        // 联动更新语言切换按钮高亮样式
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 刷新沙盒内的诊断卡片语言文本
        if (typeof updateSandboxScores === 'function') {
            updateSandboxScores();
        }
    }
    
    // ==========================================================================
    // 1. 原生 SPA 路由器 (Simple Hash Router)
    // ==========================================================================
    const pages = {
        '': 'home-view',
        '/': 'home-view',
        '/platform': 'platform-view',
        '/industries': 'industries-view',
        '/pricing': 'pricing-view',
        '/about': 'about-view',
        '/contact': 'contact-view'
    };

    function handleRouting() {
        const hash = window.location.hash || '#/';
        const route = hash.replace(/^#/, '');
        const targetPageId = pages[route] || 'home-view';

        // 切换页面视图
        const allPageViews = document.querySelectorAll('.page-view');
        allPageViews.forEach(view => {
            if (view.id === targetPageId) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // 联动更新顶部导航栏 Active 样式
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        navLinks.forEach(link => {
            const linkRoute = link.getAttribute('href').replace(/^#/, '');
            if (linkRoute === route || (route === '/' && linkRoute === '/home')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 针对不同页面初始化对应的动态行为
        if (targetPageId === 'home-view') {
            triggerStatsCountUp();
            startHeroDataSimulation();
        } else {
            stopHeroDataSimulation();
        }

        if (targetPageId === 'platform-view') {
            initSandboxDashboard();
        } else {
            stopSandboxDashboard();
        }

        // 每次切换路由，视口立即滚动至最顶部，并做延时备份确保 DOM 渲染高度重排后依然置顶
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 10);
        
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 50);

        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 150);
    }

    window.addEventListener('hashchange', handleRouting);
    
    // 全局拦截所有以 "#/" 开头的 SPA 路由链接点击，完全阻止浏览器默认的锚点偏移动画和滚动锚定
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (href && href.startsWith('#/')) {
            e.preventDefault();
            
            // 先行一步：在切換路由前，瞬間將視口滾動置頂！
            // 這樣可以避免因路由切換、頁面高度突變導致的瀏覽器滾動補償和錨定失效問題
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            // 微微延遲更新 Hash，確保置頂滾動已在當前幀被瀏覽器主線程渲染完成
            setTimeout(() => {
                if (window.location.hash === href) {
                    // 如果已處於當前頁面，再次強制置頂
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                } else {
                    window.location.hash = href;
                }
            }, 10);
        }
    });



    // ==========================================================================
    // 2. 顶部导航滚动变色与移动端菜单逻辑
    // ==========================================================================
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('open');
        mobileNavDrawer.classList.toggle('open');
        mobileDrawerOverlay.classList.toggle('open');
        // 锁定背景滚动
        document.body.style.overflow = mobileNavDrawer.classList.contains('open') ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileDrawerOverlay.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavDrawer.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });


    // ==========================================================================
    // 3. 首页数字递增动画效果 (Stats Count Up)
    // ==========================================================================
    let statsAnimated = false;
    function triggerStatsCountUp() {
        if (statsAnimated) return;
        const statCards = document.querySelectorAll('.stat-value');
        if (!statCards.length) return;

        statsAnimated = true;
        statCards.forEach(card => {
            const target = parseFloat(card.getAttribute('data-target'));
            const suffix = card.getAttribute('data-suffix') || '';
            const prefix = card.getAttribute('data-prefix') || '';
            const isInt = Number.isInteger(target);
            
            let current = 0;
            const duration = 1500; // 动画总时长 1.5s
            const start = performance.now();

            function animate(timestamp) {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // 使用 easeOutQuad 缓动函数
                const easeProgress = progress * (2 - progress);
                current = easeProgress * target;

                if (isInt) {
                    card.textContent = prefix + Math.floor(current) + suffix;
                } else {
                    card.textContent = prefix + current.toFixed(1) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    card.textContent = prefix + target + suffix;
                }
            }
            requestAnimationFrame(animate);
        });
    }


    // ==========================================================================
    // 4. 首页 Hero 右侧数据波动模拟 (Hero Dashboard Simulation)
    // ==========================================================================
    let heroTimer = null;
    const heroHealthEl = document.getElementById('hero-health-score');
    const heroVibeEl = document.getElementById('hero-vibration-val');
    const heroTempEl = document.getElementById('hero-temp-val');
    const heroDiagEl = document.getElementById('hero-diag-val');

    function startHeroDataSimulation() {
        if (heroTimer) clearInterval(heroTimer);
        
        let counter = 0;
        heroTimer = setInterval(() => {
            counter++;
            // 模拟极微弱的正常随机抖动
            const vVal = (1.15 + Math.sin(counter * 0.1) * 0.05 + Math.random() * 0.04).toFixed(2);
            const tVal = (42.4 + Math.cos(counter * 0.08) * 0.2 + Math.random() * 0.15).toFixed(1);
            // 98-99分跳动
            const hVal = Math.random() > 0.7 ? (Math.random() > 0.5 ? 98 : 99) : 98;
            
            if (heroVibeEl) heroVibeEl.textContent = `${vVal} mm/s`;
            if (heroTempEl) heroTempEl.textContent = `${tVal} ℃`;
            if (heroHealthEl) heroHealthEl.textContent = hVal;
        }, 1500);
    }

    function stopHeroDataSimulation() {
        if (heroTimer) {
            clearInterval(heroTimer);
            heroTimer = null;
        }
    }


    // ==========================================================================
    // 5. 平台详情页：高性能设备智能监测沙盒 (Sandbox Dashboard)
    // ==========================================================================
    let sandboxCanvas = null;
    let ctx = null;
    let animFrameId = null;

    // 滑块及实时数值读取 DOM 节点
    let sliderVibe = null;
    let sliderTemp = null;
    let labelVibe = null;
    let labelTemp = null;

    // 实时状态输出 DOM 节点
    let sparkVibeRealtime = null;
    let sparkTempRealtime = null;
    let sparkVibeStatus = null;
    let sparkTempStatus = null;

    // 智能仪表盘 DOM 节点
    let gaugePath = null;
    let scoreNum = null;
    let scoreLabel = null;

    // 诊断结果卡片 DOM 节点
    let diagCard = null;
    let diagIcon = null;
    let diagTitle = document.getElementById('diag-title');
    let diagDesc = document.getElementById('diag-desc');
    let diagActionBox = document.getElementById('diag-action-box');
    let diagActionText = document.getElementById('diag-action-text');

    // Canvas 数据流配置 (振动和温度的历史线)
    const historyLength = 70;
    const vibeHistory = new Array(historyLength).fill(1.8);
    const tempHistory = new Array(historyLength).fill(45.0);
    const baseVibeHistory = new Array(historyLength).fill(1.8); // 动态基准线
    const baseTempHistory = new Array(historyLength).fill(45.0); // 动态基准线

    let frameCount = 0;

    function initSandboxDashboard() {
        sandboxCanvas = document.getElementById('sandbox-chart');
        if (!sandboxCanvas) return;
        ctx = sandboxCanvas.getContext('2d');

        // 重新捕获 DOM（防止路由切换后面板节点更新丢失）
        sliderVibe = document.getElementById('slider-vibration');
        sliderTemp = document.getElementById('slider-temperature');
        labelVibe = document.getElementById('slide-vibe-lbl');
        labelTemp = document.getElementById('slide-temp-lbl');

        sparkVibeRealtime = document.getElementById('vibe-realtime');
        sparkTempRealtime = document.getElementById('temp-realtime');
        sparkVibeStatus = document.getElementById('vibe-realtime-status');
        sparkTempStatus = document.getElementById('temp-realtime-status');

        gaugePath = document.getElementById('sandbox-gauge-path');
        scoreNum = document.getElementById('sandbox-score-num');
        scoreLabel = document.getElementById('sandbox-score-label');

        diagCard = document.getElementById('diagnostic-card');
        diagIcon = document.getElementById('diag-icon');
        diagTitle = document.getElementById('diag-title');
        diagDesc = document.getElementById('diag-desc');
        diagActionBox = document.getElementById('diag-action-box');
        diagActionText = document.getElementById('diag-action-text');

        // 监听滑块操作
        sliderVibe.addEventListener('input', (e) => {
            labelVibe.textContent = `${parseFloat(e.target.value).toFixed(1)} mm/s`;
            updateSandboxScores();
        });

        sliderTemp.addEventListener('input', (e) => {
            labelTemp.textContent = `${e.target.value} ℃`;
            updateSandboxScores();
        });

        // 首次计算一次
        updateSandboxScores();

        // 开启 60FPS Canvas 渲染循环
        if (animFrameId) cancelAnimationFrame(animFrameId);
        renderSandboxChart();
    }

    function stopSandboxDashboard() {
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    }

    // 根据滑块值计算健康状态、告警级别及诊断成因
    function updateSandboxScores() {
        if (!sliderVibe || !sliderTemp) return;

        const vibeVal = parseFloat(sliderVibe.value);
        const tempVal = parseFloat(sliderTemp.value);

        // 1. 计算各传感器偏离正常基准（振动基准1.8，温度基准45）的差值
        const vibeDev = Math.max(0, vibeVal - 1.8);
        const tempDev = Math.max(0, tempVal - 45);

        // 2. 根据偏离度惩罚健康分 (最高 100，最低 12)
        let healthScore = Math.round(100 - (vibeDev * 11) - (tempDev * 1.3));
        healthScore = Math.max(12, Math.min(100, healthScore));

        // 更新大得分字样
        if (scoreNum) scoreNum.textContent = healthScore;

        // 3. 环形进度条 SVG Dashoffset 运算
        // 圆周长 = 2 * PI * r = 2 * 3.14159 * 40 = 251.2
        if (gaugePath) {
            const offset = 251.2 - (251.2 * healthScore) / 100;
            gaugePath.style.strokeDashoffset = offset;
            
            // 根据健康度改变圆环颜色
            if (healthScore >= 88) {
                gaugePath.style.stroke = 'var(--green)';
            } else if (healthScore >= 68) {
                gaugePath.style.stroke = 'var(--orange)';
            } else {
                gaugePath.style.stroke = 'var(--red)';
            }
        }

        const isEn = window.currentLang === 'en';

        // 4. 三级健康状态判定与诊断卡片输出
        if (healthScore >= 88) {
            // ** 正常运行状态 (绿色) **
            if (scoreLabel) scoreLabel.textContent = isEn ? 'Optimal Health' : '健康状态优';
            if (scoreLabel) scoreLabel.className = 'gauge-label text-green';

            if (sparkVibeStatus) { 
                sparkVibeStatus.textContent = isEn ? 'Normal' : '正常'; 
                sparkVibeStatus.className = 'spark-status text-green'; 
            }
            if (sparkTempStatus) { 
                sparkTempStatus.textContent = isEn ? 'Normal' : '正常'; 
                sparkTempStatus.className = 'spark-status text-green'; 
            }

            // 诊断卡片重置
            if (diagCard) diagCard.className = 'sandbox-widget diagnostic-widget';
            if (diagIcon) diagIcon.textContent = '🛡️';
            if (diagTitle) diagTitle.textContent = isEn ? 'Baseline Normal' : '设备基准运行正常';
            if (diagDesc) diagDesc.textContent = isEn 
                ? 'Unsupervised learning active. All readings align with the baseline. Fatigue and wear index are low, showing no unplanned downtime risks.' 
                : '自学习算法持续监控中。当前各项传感器读数与基准正常特征完全吻合，设备疲劳度及磨损指数均在极低水平，无计划外故障风险。';
            if (diagActionBox) diagActionBox.style.display = 'none';

        } else if (healthScore >= 68) {
            // ** 轻/中度异常状态 (橙色警示) **
            if (scoreLabel) scoreLabel.textContent = isEn ? 'Moderate Anomaly' : '中度异常警告';
            if (scoreLabel) scoreLabel.className = 'gauge-label text-orange';

            // 判定是谁引起的异常
            const isVibeFault = vibeVal > 3.5;
            const isTempFault = tempVal > 62;

            if (sparkVibeStatus) {
                sparkVibeStatus.textContent = isVibeFault 
                    ? (isEn ? 'Minor Anomaly' : '轻度异常') 
                    : (isEn ? 'Normal' : '正常');
                sparkVibeStatus.className = isVibeFault ? 'spark-status text-orange' : 'spark-status text-green';
            }
            if (sparkTempStatus) {
                sparkTempStatus.textContent = isTempFault 
                    ? (isEn ? 'Overheating' : '摩擦过热') 
                    : (isEn ? 'Normal' : '正常');
                sparkTempStatus.className = isTempFault ? 'spark-status text-orange' : 'spark-status text-green';
            }

            // 诊断卡片橙色高亮
            if (diagCard) diagCard.className = 'sandbox-widget diagnostic-widget warn-state';
            if (diagIcon) diagIcon.textContent = '⚠️';
            if (diagTitle) diagTitle.textContent = isEn ? 'Early Anomaly Drift Detected' : '检测到超基准早期漂移';
            
            let desc = '';
            let action = '';
            if (isVibeFault && !isTempFault) {
                desc = isEn 
                    ? 'Vibration amplitude is noticeably above the personalized baseline, with high-frequency noise detected, suggesting misalignment or imbalance. Asset is under accelerated fatigue.' 
                    : '振动加速度明显超出个性化正常基准，且出现特异性高频杂波，高度疑似出现【联轴器不对中】或【偏心动不平衡】。设备处于疲劳加速期。';
                action = isEn 
                    ? 'Our analysis indicates no sudden lockup hazard in the short term. We recommend scheduling a laser alignment calibration within 2 weeks.' 
                    : '算法分析该异常在短期内无突发抱死危险。建议在【2周内】配合生产调度排单，派遣运维小组携带激光对中仪进行现场校准。';
            } else if (!isVibeFault && isTempFault) {
                desc = isEn 
                    ? 'Bearing temperature rise rate is abnormally high with local heat accumulation, indicating potential dotting or lack of grease. Friction power consumption is rising.' 
                    : '轴承温升速率异常偏高，出现局部的温差过度集聚，疑似【轴承点蚀】或【润滑脂严重亏损】。摩擦功耗正持续上升。';
                action = isEn 
                    ? 'We suggest dispatching staff within 10 days for a routine check, cross-verifying with a thermal gun, and lubricating the bearing housing.' 
                    : '建议在【10天内】派人前往现场进行常规检查，使用测温枪交叉核验，并对轴承箱进行润滑剂加注。';
            } else {
                desc = isEn 
                    ? 'Vibration and temp rises are coupled and increasing, suggesting cross-aggravated bearing wear. Mechanical friction has caused micro-spalling.' 
                    : '振动及温升数值发生同步耦合上扬，这表明轴承的疲劳恶化正在交叉加劇。機械摩擦已導致微觀剝落。';
                action = isEn 
                    ? 'Estimated remaining safe life: ~14 days. We recommend scheduling an idle-hour downtime next week to replace the bearing with a spare.' 
                    : '算法预测剩余安全寿命：约14天。建议优先排布【次周生产空闲期】停机工单，调配同型号备用轴承件以防隐患扩大。';
            }

            if (diagDesc) diagDesc.textContent = desc;
            if (diagActionBox) diagActionBox.style.display = 'block';
            if (diagActionText) diagActionText.textContent = action;

        } else {
            // ** 紧急高危状态 (红色紧急) **
            if (scoreLabel) scoreLabel.textContent = isEn ? 'Critical Shutdown Risk' : '紧急停机隐患';
            if (scoreLabel) scoreLabel.className = 'gauge-label text-red';

            if (sparkVibeStatus) { 
                sparkVibeStatus.textContent = vibeVal > 5.5 
                    ? (isEn ? 'Severe Vibration' : '重度破坏振动') 
                    : (isEn ? 'High Risk Drift' : '高危漂移'); 
                sparkVibeStatus.className = 'spark-status text-orange'; 
            }
            if (sparkTempStatus) { 
                sparkTempStatus.textContent = tempVal > 78 
                    ? (isEn ? 'Critical Hot Lockup' : '超高温抱死风险') 
                    : (isEn ? 'Over-Temp' : '超温运行'); 
                sparkTempStatus.className = 'spark-status text-orange'; 
            }

            // 诊断卡片红色呼吸
            if (diagCard) diagCard.className = 'sandbox-widget diagnostic-widget alert-state';
            if (diagIcon) diagIcon.textContent = '🚨';
            if (diagTitle) diagTitle.textContent = isEn ? 'Emergency Alert: Fault Worsening' : '紧急警报：故障恶化中';
            if (diagDesc) diagDesc.textContent = isEn 
                ? 'Core readings have surged far beyond baseline! Energy loss is off the charts. Micro-spalling has likely progressed to macroscopic raceway fracture. Risk of sudden seizure, severe shaft damage, or stator coil burnout is extremely high.' 
                : '核心物理读数发生极高偏离度飙升！物理能耗指标爆表。微观剥落可能已演化为【宏观滚道碎裂】。设备极易发生灾难性的“咬合抱死”，诱发整轴毁机甚至烧毁定子线圈。';
            if (diagActionBox) diagActionBox.style.display = 'block';
            if (diagActionText) diagActionText.innerHTML = isEn
                ? '<span style="color: var(--red); font-weight: bold;">[IMMEDIATE ACTION REQUIRED]</span> Remaining time before seizure is estimated to be < 48 hours! Please issue an emergency shutdown order, cut the pump load, and dispatch the repair team immediately to avoid complete machine failure!'
                : '<span style="color: var(--red); font-weight: bold;">【立即响应】</span>算法预测设备剩余突发抱死寿命 < 48小时！请立即下达紧急停机工单，强制切断水泵负载，调派备件应急班组进行现场停工抢修，避免机组彻底报废！';
        }
    }

    // 60FPS Canvas 波形流绘制循环
    function renderSandboxChart() {
        if (!sandboxCanvas || !ctx) return;

        frameCount++;

        // 1. 获取滑块目标数值
        const targetVibe = sliderVibe ? parseFloat(sliderVibe.value) : 1.8;
        const targetTemp = sliderTemp ? parseFloat(sliderTemp.value) : 45.0;

        // 2. 模拟高频物理噪声（随机小脉冲抖动）
        // 如果滑块调得高，说明设备处于损坏偏心状态，物理噪声波动幅度也将随之成倍剧增
        const vibeNoiseScale = 0.06 + (targetVibe - 1.8) * 0.12;
        const tempNoiseScale = 0.04 + (targetTemp - 45) * 0.15;

        // 生成这一帧的含噪传感器数值
        const currentVibe = targetVibe + (Math.sin(frameCount * 0.4) * vibeNoiseScale) + (Math.random() - 0.5) * vibeNoiseScale;
        const currentTemp = targetTemp + (Math.cos(frameCount * 0.1) * tempNoiseScale) + (Math.random() - 0.5) * tempNoiseScale;

        // 更新左侧的“瞬时值读取”显示
        if (sparkVibeRealtime) sparkVibeRealtime.textContent = currentVibe.toFixed(2);
        if (sparkTempRealtime) sparkTempRealtime.textContent = currentTemp.toFixed(1);

        // 3. 历史数据数组滚动移位
        vibeHistory.shift();
        vibeHistory.push(currentVibe);

        tempHistory.shift();
        tempHistory.push(currentTemp);

        // 4. 清除并开始重新绘制 Canvas
        const width = sandboxCanvas.width;
        const height = sandboxCanvas.height;
        ctx.clearRect(0, 0, width, height);

        // 绘制背景标线网格 (5条横虚线)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        for (let i = 1; i <= 4; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(10, y);
            ctx.lineTo(width - 10, y);
            ctx.stroke();
        }
        ctx.setLineDash([]); // 还原实线

        // 计算曲线各点的 X 轴间距
        const stepX = width / (historyLength - 1);

        // ==================== 绘制温度波形 (橙色/红) ====================
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(249, 115, 22, 0.15)';
        ctx.strokeStyle = 'var(--orange)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < historyLength; i++) {
            const x = i * stepX;
            // 映射：温度从 40度-100度 映射至 Canvas 内部 y 轴 [height - 20, 20]
            const y = height - 20 - ((tempHistory[i] - 40) / 60) * (height - 40);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // ==================== 绘制振动波形 (科技蓝/红) ====================
        // 如果振动大，发光增强
        ctx.shadowBlur = targetVibe > 4.5 ? 18 : 8;
        ctx.shadowColor = targetVibe > 4.5 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.3)';
        ctx.strokeStyle = targetVibe > 4.5 ? 'var(--red)' : 'var(--cyan)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < historyLength; i++) {
            const x = i * stepX;
            // 映射：振动从 1.0 - 9.0 映射至 Canvas 内部 y 轴 [height - 25, 25]
            const y = height - 25 - ((vibeHistory[i] - 1.0) / 8.0) * (height - 50);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 还原发光特效，防止影响其他绘制
        ctx.shadowBlur = 0;

        // 绘制个性化静态安全上限基准虚线 (指示器)
        // 振动上限通常在 3.5 mm/s，温度上限通常在 60 ℃
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 5]);
        
        // 振动警示线 (y映射)
        const vWarnY = height - 25 - ((3.5 - 1.0) / 8.0) * (height - 50);
        ctx.beginPath();
        ctx.moveTo(10, vWarnY);
        ctx.lineTo(width - 10, vWarnY);
        ctx.stroke();
        
        // 绘制虚线上方文字
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = '9px Outfit';
        ctx.fillText('振动安全上限自学习阀值 (3.5 mm/s)', 15, vWarnY - 6);

        ctx.setLineDash([]); // 恢复

        // 5. 递归下一帧
        animFrameId = requestAnimationFrame(renderSandboxChart);
    }


    // ==========================================================================
    // 6. 联系我们页面：浮动 Label 输入框控制 与 表单纸飞机飞出成功提交流程
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalInfoSummary = document.getElementById('modal-info-summary');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // 阻止默认提交

            const fullName = document.getElementById('fullName').value.trim();
            const company = document.getElementById('company').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // 1. 按钮触发 loading 加载状态
            formSubmitBtn.classList.add('loading');
            formSubmitBtn.disabled = true;

            // 2. 模拟网络往返延迟 (1.2秒)
            setTimeout(() => {
                formSubmitBtn.classList.remove('loading');
                formSubmitBtn.disabled = false;

                // 填充成功弹窗的用户信息
                if (modalInfoSummary) {
                    if (window.currentLang === 'en') {
                        modalInfoSummary.innerHTML = `
                            <div>👨‍💼 <strong>Full Name:</strong> ${fullName}</div>
                            <div>🏢 <strong>Company Name:</strong> ${company}</div>
                            <div>✉️ <strong>Contact Email:</strong> ${email}</div>
                            <div>⚙️ <strong>Asset Monitoring Requirements:</strong> ${message ? message : '<span style="color: var(--text-muted)">None specified (we will recommend a default package for your industry)</span>'}</div>
                        `;
                    } else {
                        modalInfoSummary.innerHTML = `
                            <div>👨‍💼 <strong>联系姓名：</strong>${fullName}</div>
                            <div>🏢 <strong>企业名称：</strong>${company}</div>
                            <div>✉️ <strong>联络邮箱：</strong>${email}</div>
                            <div>⚙️ <strong>拟接资产需求：</strong>${message ? message : '<span style="color: var(--text-muted)">未填写特定设备，我们将根据行业默认方案推荐</span>'}</div>
                        `;
                    }
                }

                // 打开成功弹窗
                if (successModal) {
                    successModal.classList.add('open');
                    document.body.style.overflow = 'hidden'; // 锁定底层滚动
                }

                // 重置表单
                contactForm.reset();
            }, 1200);
        });
    }

    if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('open');
            document.body.style.overflow = ''; // 解锁滚动
        });
    }


    // ==========================================================================
    // 7. 微小平滑滑动滚动监听 (Sleek Anchor Scrolls)
    // ==========================================================================
    const scrollToHowBtn = document.getElementById('scroll-to-how');
    if (scrollToHowBtn) {
        scrollToHowBtn.addEventListener('click', (e) => {
            const howItWorksSection = document.getElementById('how-it-works');
            if (howItWorksSection) {
                e.preventDefault();
                howItWorksSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================================================
    // 8. 多语言切换事件绑定与初始化 (使用全局事件委派)
    // ==========================================================================
    document.addEventListener('click', (e) => {
        const langBtn = e.target.closest('.lang-btn');
        if (langBtn) {
            e.preventDefault();
            const lang = langBtn.getAttribute('data-lang');
            changeLanguage(lang);
        }
    });

    // 初始化语言
    changeLanguage(window.currentLang);

    // 首次载入觸發一次路由 (置於腳本底部避免 hoisting / TDZ 變量未定義錯誤)
    handleRouting();
});
