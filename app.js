(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const root = document.documentElement;
  const toast = $('#toast');
  let currentLang = 'en';
  let audioOn = false;
  let audioCtx = null;
  let ambientTimer = null;
  let ambientMaster = null;
  let ambientWet = null;
  let ambientMotif = [];
  let ambientBeat = 0;
  let lastScroll = 0;
  let activeStoryKey = 'now';
  let activeNotebookKey = 'ai';
  let activeProfileKey = null;
  let activeProjectKey = null;

  const copy = {
    en: {
      'boot.loading':'LOADING MEMORIES...',
      'rail.note':'( PLEASE* )<br><small>handle with wonder<br>build with play</small>',
      'rail.promise':'(PROMISE <span>∞</span> YOU)',
      'nav.home':'HOME','nav.story':'STORY','nav.portfolio':'PORTFOLIO','nav.contact':'CONTACT',
      'hero.scroll':'SCROLL TO EXPLORE','hero.axis':'AI · GAMES · DESIGN',
      'hero.signal1':'[01] CHOOSE INTEREST OR EDUCATION','hero.signal2':'[02] FOLLOW THE HIGHLIGHT','hero.signal3':'[03] CLICK AN OBJECT FOR DETAILS',
      'focus.instruction':'FOCUS MODE IS ON — INTEREST AND EDUCATION ROTATE EVERY 30 SECONDS',
      'focus.experience':'EXPERIENCE','focus.interest':'INTEREST','focus.education':'EDUCATION',
      'hero.title1':'SYSTEMS','hero.title2':'BECOME','hero.title3':'STORIES','hero.title4':'IN PLAY<span class="blink-dot">.</span>',
      'hero.subtitle':'I turn AI, product systems and playful interactions into experiences people can understand, use and remember.',
      'hero.cta.story':'ENTER STORY <span>→</span>','hero.cta.portfolio':'SEE PORTFOLIO','hero.cta.contact':'GET IN TOUCH',
      'object.pressButton':'PRESS A BUTTON','object.notebook':'Systems, play, memory.','common.openDetails':'OPEN DETAILS ↗',
      'object.productFlow':'Product Flow','object.phoneTeaser':'Four nodes. One complete experience.',
      'object.designTitle':'Interaction Design','object.designTeaser':'Observe → Prototype → Test',
      'object.interestsTitle':'IDEAS','object.interestsTeaser':'Games · systems · culture',
      'object.soundCaption':'Emotion, translated into visual language.','object.focusMode':'FOCUS MODE',
      'hero.pixelPalsSig':'Turning worries into remedies.<br>Ars Electronica 2025',
      'hero.buildStamp':'◉ 2025 · BUILD · PLAY · SHARE',
      'slip.tencent.eyebrow':'01 / EXPERIENCE','slip.tencent.title':'TENCENT','slip.tencent.sub':'Cloud Game × Mini-game',
      'slip.xiaomi.eyebrow':'02 / EXPERIENCE','slip.xiaomi.title':'XIAOMI','slip.xiaomi.sub':'AI Product Strategy',
      'slip.yanyin.eyebrow':'03 / EXPERIENCE','slip.yanyin.title':'YANIN TECH','slip.yanyin.sub':'Research Tools · 0→1',
      'slip.shanghaitech.eyebrow':'01 / EDUCATION','slip.shanghaitech.title':'SHANGHAITECH','slip.shanghaitech.sub':'B.Eng. Computer Science',
      'slip.hkbu.eyebrow':'02 / EDUCATION','slip.hkbu.title':'HKBU','slip.hkbu.sub':'M.Sc. AI & Digital Media',
      'story.openDetails':'OPEN FULL EXPERIENCE ↗','story.index':'01 / STORY','story.kicker':'FROM SYSTEMS TO FEELING','story.title':'I build structures people can <em>feel.</em>',
      'story.node.now.time':'NOW','story.node.now.title':'AI Product × Games','story.node.now.sub':'Tencent · Cloud gaming & mini-game systems',
      'story.node.before.time':'BEFORE','story.node.before.title':'AI Interaction Strategy','story.node.before.sub':'Xiaomi · Rules, intent and response systems',
      'story.node.yanyin.time':'EARLIER','story.node.yanyin.title':'Research Product 0→1','story.node.yanyin.sub':'Yanin Tech · ELN & protocol tools',
      'story.node.origin.time':'ORIGIN','story.node.origin.title':'Computer Science × AI & Media','story.node.origin.sub':'ShanghaiTech → Hong Kong Baptist University',
      'portfolio.index':'02 / SELECTED WORK','portfolio.kicker':'CLICK, FILTER, OPEN — ORIGINAL PROJECT MATERIALS INSIDE','portfolio.title':'Selected <em>systems</em> & experiments.',
      'portfolio.filter.all':'ALL','portfolio.filter.product':'PRODUCT','portfolio.filter.game':'GAME','portfolio.filter.research':'RESEARCH',
      'portfolio.modalHint':'Use the arrows, thumbnails, mouse wheel or keyboard ← → to browse the original project pages.',
      'contact.index':'03 / CONTACT','contact.kicker':'OPEN CHANNEL_','contact.title':'Let’s make complex things feel <em>alive.</em>',
      'contact.subtitle':'AI products, game systems, interactive narratives or strange prototypes — send a signal.',
      'contact.to':'TO','contact.subject':'SUBJECT','contact.message':'MESSAGE','contact.subjectPlaceholder':'What are we building?','contact.messagePlaceholder':'Tell me the strange, useful or playful thing you have in mind.','contact.copy':'COPY EMAIL','contact.send':'SEND SIGNAL →',
      'social.index':'04 / ELSEWHERE','social.kicker':'KEEP IN TOUCH_','social.title':'Find me <em>elsewhere.</em>','social.subtitle':'More process, experiments and work-in-progress live here.','social.xhs':'XIAOHONGSHU','social.github':'GITHUB'
    },
    zh: {
      'boot.loading':'正在加载记忆...',
      'rail.note':'（请*）<br><small>保持好奇<br>用玩心创造</small>',
      'rail.promise':'（与你 <span>∞</span> 共创）',
      'nav.home':'首页','nav.story':'经历','nav.portfolio':'作品集','nav.contact':'联系我',
      'hero.scroll':'向下探索','hero.axis':'AI · 游戏 · 设计',
      'hero.signal1':'[01] 选择兴趣或学历','hero.signal2':'[02] 跟随高亮元素','hero.signal3':'[03] 点击物件查看详情',
      'focus.instruction':'专注模式已开启 — 兴趣与学历每 30 秒自动轮换',
      'focus.experience':'经历','focus.interest':'兴趣','focus.education':'学历',
      'hero.title1':'让系统','hero.title2':'成为','hero.title3':'可体验的','hero.title4':'故事<span class="blink-dot">。</span>',
      'hero.subtitle':'我把 AI、产品系统和游戏化交互，做成人们能够理解、使用并记住的体验。',
      'hero.cta.story':'查看经历 <span>→</span>','hero.cta.portfolio':'查看作品集','hero.cta.contact':'联系我',
      'object.pressButton':'按下一个按键','object.notebook':'系统、游戏与记忆。','common.openDetails':'查看详情 ↗',
      'object.productFlow':'产品流程','object.phoneTeaser':'四个节点，一段完整体验。',
      'object.designTitle':'交互设计','object.designTeaser':'观察 → 原型 → 验证',
      'object.interestsTitle':'兴趣','object.interestsTeaser':'游戏 · 系统 · 文化',
      'object.soundCaption':'把情绪翻译成可见的语言。','object.focusMode':'专注模式',
      'hero.pixelPalsSig':'把烦恼转化为安慰。<br>林茨电子艺术节 2025',
      'hero.buildStamp':'◉ 2025 · 构建 · 游戏 · 分享',
      'slip.tencent.eyebrow':'01 / 实习经历','slip.tencent.title':'腾讯','slip.tencent.sub':'云游戏 × 微信小游戏',
      'slip.xiaomi.eyebrow':'02 / 实习经历','slip.xiaomi.title':'小米','slip.xiaomi.sub':'AI 产品策略',
      'slip.yanyin.eyebrow':'03 / 实习经历','slip.yanyin.title':'衍因科技','slip.yanyin.sub':'科研工具 · 从 0 到 1',
      'slip.shanghaitech.eyebrow':'01 / 教育经历','slip.shanghaitech.title':'上海科技大学','slip.shanghaitech.sub':'计算机科学与技术 工学学士',
      'slip.hkbu.eyebrow':'02 / 教育经历','slip.hkbu.title':'香港浸会大学','slip.hkbu.sub':'人工智能与数字媒体 理学硕士',
      'story.openDetails':'查看完整经历 ↗','story.index':'01 / 经历','story.kicker':'从系统走向真实体验','story.title':'我设计的不只是功能，而是人能够<em>感受到的系统。</em>',
      'story.node.now.time':'现在','story.node.now.title':'AI 产品 × 游戏','story.node.now.sub':'腾讯 · 云游戏与微信小游戏系统',
      'story.node.before.time':'此前','story.node.before.title':'AI 交互策略','story.node.before.sub':'小米 · 规则、意图与回答策略',
      'story.node.yanyin.time':'更早','story.node.yanyin.title':'科研产品从 0 到 1','story.node.yanyin.sub':'衍因科技 · ELN 与实验流程工具',
      'story.node.origin.time':'起点','story.node.origin.title':'计算机 × AI 与数字媒体','story.node.origin.sub':'上海科技大学 → 香港浸会大学',
      'portfolio.index':'02 / 代表作品','portfolio.kicker':'点击、筛选、打开 — 内含真实项目原稿','portfolio.title':'我做过的<em>系统</em>与实验。',
      'portfolio.filter.all':'全部','portfolio.filter.product':'产品','portfolio.filter.game':'游戏','portfolio.filter.research':'研究',
      'portfolio.modalHint':'可使用箭头、缩略图、鼠标滚轮或键盘 ← → 浏览原始作品页。',
      'contact.index':'03 / 联系我','contact.kicker':'建立连接_','contact.title':'让复杂的东西，变得<em>鲜活而可用。</em>',
      'contact.subtitle':'AI 产品、游戏系统、互动叙事或奇怪但有用的原型，都可以来聊。',
      'contact.to':'收件人','contact.subject':'主题','contact.message':'留言','contact.subjectPlaceholder':'我们要一起做什么？','contact.messagePlaceholder':'告诉我你正在思考的、有用的、好玩的或奇怪的想法。','contact.copy':'复制邮箱','contact.send':'发送邮件 →',
      'social.index':'04 / 其他平台','social.kicker':'继续保持连接_','social.title':'也可以在<em>这里找到我。</em>','social.subtitle':'更多创作过程、实验和进行中的项目在这里更新。','social.xhs':'小红书','social.github':'GitHub'
    }
  };

  const local = (en, zh) => ({ en, zh });

  const profileData = {
    tencent: {
      code:'EXPERIENCE_01', type:local('EXPERIENCE','实习经历'), title:local('Tencent','腾讯'),
      role:local('Product Intern · Cloud Game & WeChat Mini-games','产品实习生 · 云游戏与微信小游戏'),
      summary:local('I build reusable ToB platform capabilities for game activation, acquisition and operations, translating fragmented business needs into configurable systems that game teams can test, publish and reuse.','我负责云游戏与微信小游戏中台的促活、拉新和运营能力建设，把分散的业务诉求整理成游戏团队能够配置、测试、发布和复用的平台系统。'),
      facts:local([
        ['Business scope','WeChat mini-games, cloud gaming, playable ads and game-operation platforms'],
        ['Collaboration','Product, design, front-end, server, testing, game clients and game operations'],
        ['Working method','Requirement framing, process diagrams, edge cases, acceptance testing and launch follow-up'],
        ['Product orientation','ToB system capability building rather than one-off campaign delivery']
      ],[
        ['业务范围','微信小游戏、云游戏、试玩广告与游戏运营平台'],
        ['协作角色','产品、设计、前端、服务端、测试、游戏客户端与游戏运营'],
        ['工作方式','需求收敛、流程图、边界情况、功能验收与上线跟进'],
        ['产品取向','建设可复用的 ToB 系统能力，而不是只交付单次活动']
      ]),
      sectionTitle:local('SELECTED RESPONSIBILITIES & RESULTS','核心工作与结果'),
      points:local([
        'Designed a configurable activity center covering floating entries, banner placements, fallback icons, test-preview states and publication rules, reducing repeated one-off front-end coordination for game teams.',
        'Defined the subscription-message workflow from user targeting and delivery configuration to validation across test and grey environments.',
        'Participated in ad fallback and reporting acceptance, standardizing event naming and result fields so exposure, failure and fallback behavior could be traced.',
        'Built playable-ad prototypes and planned a reusable insight workflow connecting creative patterns, mechanics and performance feedback.'
      ],[
        '设计可配置的活动中心，覆盖悬浮入口、Banner、兜底 Icon、测试预览与发布规则，减少游戏侧反复协调一次性前端改动。',
        '梳理订阅消息从目标用户筛选、下发配置到测试与灰度验证的完整流程。',
        '参与广告兜底与埋点验收，统一事件命名和结果字段，使曝光、失败与兜底行为可追踪。',
        '制作试玩广告原型，并规划连接创意模式、玩法结构与效果反馈的可复用洞察流程。'
      ]),
      metrics:local([],[]),
      tags:['TENCENT','PLATFORM PRODUCT','GAMES','AI PRODUCT'], actions:local([],[]), art:'./assets/tencent-penguin.png'
    },
    xiaomi: {
      code:'EXPERIENCE_02', type:local('EXPERIENCE','实习经历'), title:local('Xiaomi','小米'),
      role:local('AI Product Intern · XiaoAI','AI 产品实习生 · 小爱产品部'),
      summary:local('I worked on product rules and answer strategies for an in-car front-vehicle recognition feature, turning unstable model output into clearer triggering conditions, response boundaries and user-facing feedback.','我参与车载前车识别功能的产品规则与回答策略设计，把不稳定的模型结果转化为更清晰的触发条件、回答边界和用户反馈。'),
      facts:local([['Product','In-car front-vehicle recognition'],['Problem','Incorrect AI results were amplified after being spoken aloud'],['Responsibility','Trigger rules, answer strategy, grey-test analysis and iteration'],['Goal','Make uncertain model results understandable and dependable']], [['产品场景','车载前车识别'],['核心问题','错误识别结果被语音播报放大'],['负责内容','触发规则、回答策略、灰度分析与迭代'],['目标','让不确定的模型结果变得可理解、可依赖']]),
      sectionTitle:local('SELECTED RESPONSIBILITIES & RESULTS','核心工作与结果'),
      points:local([
        'Reviewed recognition failures during grey testing and identified cases where model uncertainty should not be directly presented as a confident answer.',
        'Adjusted triggering conditions and designed differentiated response strategies for valid, uncertain and failed recognition results.',
        'Used user re-questioning and effective-answer ratios to evaluate whether the revised strategy actually reduced confusion.',
        'Translated model limitations into product behavior that algorithm, product and experience teams could discuss and validate together.'
      ],[
        '复盘灰度测试中的识别失败，识别出模型不确定时不应直接以确定口吻播报的场景。',
        '调整识别触发条件，并为有效、低置信度和失败结果设计不同的回答策略。',
        '使用用户重问率和有效回答占比判断策略是否真正减少困惑。',
        '把模型限制翻译成算法、产品与体验团队能够共同讨论和验证的产品行为。'
      ]),
      metrics:local([['+20%','Effective-answer share'],['32.4% → 12.7%','Repeat-question rate']], [['+20%','有效回答占比'],['32.4% → 12.7%','用户重问率']]),
      tags:['XIAOMI','AI PRODUCT','MODEL UX','RESPONSE STRATEGY'], actions:local([],[])
    },
    yanyin: {
      code:'EXPERIENCE_03', type:local('EXPERIENCE','实习经历'), title:local('Yanin Tech','衍因科技'),
      role:local('Product Intern · Scientific Research Tools','产品实习生 · 科研工具'),
      summary:local('I participated in building a digital laboratory and ELN product from zero to one for principal investigators and biological laboratories, focusing on standardized records and reusable experimental knowledge.','我参与面向 PI 与生物实验室的数字化实验室管理与 ELN 产品从 0 到 1 建设，重点解决实验记录标准化与实验知识复用问题。'),
      facts:local([['Users','Principal investigators and biological laboratories'],['Product','Digital laboratory management and ELN'],['Stage','0-to-1 product construction'],['Focus','Experiment records, Protocol templates and recommendations']], [['用户','PI 与生物实验室'],['产品','数字化实验室管理与 ELN'],['阶段','产品从 0 到 1 建设'],['重点','实验记录、Protocol 模板与推荐']]),
      sectionTitle:local('SELECTED RESPONSIBILITIES & RESULTS','核心工作与结果'),
      points:local([
        'Designed and drove PDF table export so experiment records could be standardized, reviewed and archived in a format suitable for compliance and collaboration.',
        'Collected experimental procedures from research websites and converted fragmented information into structured Protocol templates.',
        'Improved Protocol recommendation logic so researchers could reuse relevant methods instead of repeatedly searching and rewriting procedures.',
        'Worked from real laboratory workflows rather than generic office-software assumptions, helping the functions become core selling points that supported customer signing.'
      ],[
        '设计并推进 PDF 表格导出，使实验记录能够以适合审批、协作和合规归档的格式标准化输出。',
        '从科研网站收集实验流程，把分散的信息整理为结构化 Protocol 模板。',
        '优化 Protocol 推荐逻辑，让研究人员能够复用相关方法，减少反复搜索和重写实验步骤。',
        '从真实实验室流程出发，而不是套用通用办公软件逻辑，相关功能最终成为产品核心卖点并推动客户签约。'
      ]),
      metrics:local([['0 → 1','ELN product build'],['PDF','Standardized export'],['Protocol','Structured knowledge reuse']], [['0 → 1','ELN 产品建设'],['PDF','标准化导出'],['Protocol','结构化知识复用']]),
      tags:['0→1','ELN','B2B','RESEARCH TOOLS'], actions:local([],[])
    },
    game: {
      code:'INTEREST_01', type:local('INTEREST','兴趣'), title:local('Games','游戏'),
      role:local('Player · System observer · Prototype maker','玩家 · 系统观察者 · 原型创作者'),
      summary:local('Games are both my long-term interest and the medium through which I understand feedback, motivation, cooperation and competition.','游戏既是我长期投入的兴趣，也是我理解反馈、动机、合作与竞争机制的方式。'),
      facts:local([['Experience','FPS, MOBA, racing, strategy, party, cooperation and narrative'],['Perspective','Feedback, motivation, social systems and player agency'],['Making','AI-native games, playable mechanics and interactive prototypes']], [['体验类型','FPS、MOBA、竞速、策略、派对、合作与叙事'],['观察视角','反馈、动机、社交系统与玩家能动性'],['创作方向','AI 原生游戏、试玩玩法与交互原型']]),
      sectionTitle:local('HOW I TURN PLAY INTO DESIGN','我如何把游玩转化为设计'),
      points:local(['Long-term experience across competitive and narrative genres.','Reached the Beijing Top 16 in the Honor of Kings Women’s Open.','Translate observations from play into mechanics, system rules and testable prototypes.'],['长期体验竞技、合作与叙事等多类游戏。','曾进入《王者荣耀》女子公开赛北京站前 16 强。','把游玩观察转化为玩法机制、系统规则与可验证原型。']),
      metrics:local([['TOP 16','Honor of Kings Women’s Open · Beijing'],['AI TRPG','Playable online prototype']], [['前 16','《王者荣耀》女子公开赛北京站'],['AI 跑团','可在线体验的游戏原型']]),
      tags:['FPS','MOBA','NARRATIVE','SYSTEM DESIGN'], actions:local([['PLAY AI TRPG','https://ai-trpg-nu.vercel.app/','primary']],[['试玩 AI 跑团','https://ai-trpg-nu.vercel.app/','primary']])
    },
    design: {
      code:'INTEREST_02', type:local('INTEREST','兴趣'), title:local('Interaction & Design','交互与设计'),
      role:local('HCI · Service design · Emotional narratives','人机交互 · 服务设计 · 情感叙事'),
      summary:local('I use research, prototyping and visual systems to make technology feel cultural, humane and playful.','我通过研究、原型和视觉系统，让技术呈现出文化感、人情味与玩乐性。'),
      facts:local([['Methods','User research, service blueprint, prototyping and evaluation'],['Themes','Emotion, culture, care and human-AI relationships'],['Output','Interactive installations, apps, studies and physical prototypes']], [['方法','用户研究、服务蓝图、原型与评估'],['主题','情绪、文化、关怀与人机关系'],['产出','互动装置、应用、研究与物理原型']]),
      sectionTitle:local('SELECTED DESIGN PRACTICE','代表设计实践'),
      points:local(['Pixel Pals turns worries into cross-cultural remedies and was exhibited at Ars Electronica 2025.','Flowering explores healthcare service design and doctor-patient communication.','Shape of Sound studies how emotion can survive speech-to-text.','Block Bot explores screen-free physical programming for children.'],['Pixel Pals 将烦恼转化为跨文化安慰方式，并入选 2025 林茨电子艺术节。','Flowering 探索医疗服务设计与医患沟通。','Shape of Sound 研究如何在语音转文字中保留情绪。','Block Bot 探索面向儿童的无屏物理编程。']),
      metrics:local([['2025','Ars Electronica exhibition'],['4','Documented design projects']], [['2025','林茨电子艺术节展出'],['4','完整设计项目']]),
      tags:['HCI','SERVICE DESIGN','ARS ELECTRONICA','EMOTION'], actions:local([['OPEN PIXEL PALS','https://pixel-pals.my.canva.site/','primary'],['SEE PORTFOLIO','#portfolio','secondary']],[['打开 Pixel Pals','https://pixel-pals.my.canva.site/','primary'],['查看作品集','#portfolio','secondary']])
    },
    'ai-making': {
      code:'INTEREST_03', type:local('INTEREST','兴趣'), title:local('AI-native Making','AI 原生创作'),
      role:local('Agents · Interactive narratives · Rapid prototypes','Agent · 互动叙事 · 快速原型'),
      summary:local('I treat AI as a material that changes rules, authorship and player agency rather than a decorative feature.','我把 AI 视为会改变规则、创作关系和玩家能动性的材料，而不是装饰性功能。'),
      facts:local([['Approach','Small, testable demos before large systems'],['Interest','Agents, interactive narrative and procedural content'],['Question','Does AI create a new interaction, or merely automate an old one?']], [['方法','先做小而可验证的 Demo，再扩展系统'],['兴趣','Agent、互动叙事与程序化内容'],['判断问题','AI 是否创造了新交互，而不只是自动化旧流程？']]),
      sectionTitle:local('CURRENT EXPERIMENTS','当前实验'),
      points:local(['Built an AI TRPG with narration, risk escalation, extraction choices and session reports.','Experiment with AI agents, playable mechanics and content-generation workflows.','Use prototypes to test whether an AI interaction is meaningful, understandable and fun.'],['制作带有 AI 旁白、风险升级、撤离选择与结局报告的 AI 跑团。','持续尝试 AI Agent、试玩玩法和内容生成工作流。','通过原型判断 AI 交互是否真正有意义、易理解且好玩。']),
      metrics:local([['LIVE','AI TRPG online'],['DEMO FIRST','Prototype-led validation']], [['在线','AI 跑团可直接体验'],['Demo 优先','以原型驱动验证']]),
      tags:['AI AGENT','GAME','PROTOTYPE','NARRATIVE'], actions:local([['PLAY AI TRPG','https://ai-trpg-nu.vercel.app/','primary'],['GITHUB','https://github.com/guaiwu012','secondary']],[['试玩 AI 跑团','https://ai-trpg-nu.vercel.app/','primary'],['GitHub','https://github.com/guaiwu012','secondary']])
    },
    shanghaitech: {
      code:'EDUCATION_01', type:local('EDUCATION','教育经历'), title:local('ShanghaiTech University','上海科技大学'),
      role:local('B.Eng. in Computer Science and Technology · Minor Certificate in Interaction Design','计算机科学与技术 工学学士 · 交互设计辅修证书'),
      summary:local('My undergraduate training connected systems, code and algorithms with user research, prototyping and interaction design.','本科阶段把系统、代码与算法训练，与用户研究、原型制作和交互设计结合在一起。'),
      facts:local([['Major','Computer Science and Technology'],['Additional training','Minor Certificate in Interaction Design'],['Practice','HCI, service design, physical computing and research prototypes']], [['主修','计算机科学与技术'],['额外学习','交互设计辅修证书'],['实践方向','人机交互、服务设计、物理计算与研究原型']]),
      sectionTitle:local('EDUCATION DETAILS','教育信息'),
      points:local(['Built a technical foundation in programming, algorithms and system thinking.','Used interaction-design courses to connect technical feasibility with user research and experience.','Completed Shape of Sound, Flowering and Block Bot as documented course projects.'],['建立编程、算法与系统思维基础。','通过交互设计课程把技术可行性与用户研究、体验设计连接起来。','完成 Shape of Sound、Flowering 与 Block Bot 等完整课程项目。']),
      metrics:local([['B.ENG.','Computer Science'],['MINOR','Interaction Design']], [['工学学士','计算机科学与技术'],['辅修证书','交互设计']]),
      tags:['SHANGHAITECH','COMPUTER SCIENCE','HCI'], actions:local([],[])
    },
    hkbu: {
      code:'EDUCATION_02', type:local('EDUCATION','教育经历'), title:local('Hong Kong Baptist University','香港浸会大学'),
      role:local('M.Sc. in Artificial Intelligence and Digital Media · In progress','人工智能与数字媒体 理学硕士 · 在读'),
      summary:local('The programme extends my technical background into digital media, communication and AI-driven creative practice.','硕士阶段把技术背景进一步延伸到数字媒体、传播与 AI 驱动的创作实践。'),
      facts:local([['Programme','Artificial Intelligence and Digital Media'],['Direction','AI, digital media, communication and creative technology'],['Expected graduation','October 2026']], [['专业','人工智能与数字媒体'],['方向','AI、数字媒体、传播与创意技术'],['预计毕业','2026 年 10 月']]),
      sectionTitle:local('EDUCATION DETAILS','教育信息'),
      points:local(['Develop a cross-disciplinary view of how AI systems enter media and culture.','Connect technical prototypes with communication, narrative and audience experience.','Continue exploring AI-native interactive work and game experiences.'],['从跨学科角度理解 AI 系统如何进入媒体与文化。','把技术原型与传播、叙事和受众体验连接起来。','持续探索 AI 原生互动作品与游戏体验。']),
      metrics:local([['M.SC.','AI & Digital Media'],['2026.10','Expected graduation']], [['理学硕士','人工智能与数字媒体'],['2026.10','预计毕业']]),
      tags:['HKBU','AI','DIGITAL MEDIA'], actions:local([],[])
    },
    'education-path': {
      code:'EDUCATION_PATH', type:local('EDUCATION','教育路径'), title:local('CS → AI & Digital Media','计算机 → AI 与数字媒体'),
      role:local('ShanghaiTech University → Hong Kong Baptist University','上海科技大学 → 香港浸会大学'),
      summary:local('My education moves from computer-science systems and interaction design toward AI, media and cross-disciplinary creative practice.','我的学习路径从计算机系统与交互设计，延伸到 AI、媒体与跨学科创作实践。'),
      facts:local([['Undergraduate','B.Eng. Computer Science and Technology · Interaction Design minor'],['Postgraduate','M.Sc. Artificial Intelligence and Digital Media'],['Expected graduation','October 2026']], [['本科','计算机科学与技术工学学士 · 交互设计辅修'],['硕士','人工智能与数字媒体理学硕士'],['预计毕业','2026 年 10 月']]),
      sectionTitle:local('HOW THE TWO DISCIPLINES CONNECT','两段学习如何连接'),
      points:local(['Computer science gave me the ability to understand system constraints and communicate with engineering.','Interaction design trained me to observe users, map services and test prototypes.','AI and digital media extend this foundation into narrative, culture and creative technology.'],['计算机训练让我理解系统约束，并能够与研发有效协作。','交互设计训练让我观察用户、梳理服务并验证原型。','AI 与数字媒体进一步把这套能力延伸到叙事、文化和创意技术。']),
      metrics:local([['CS','System foundation'],['HCI','Human lens'],['AIDM','Creative AI practice']], [['CS','系统基础'],['HCI','人的视角'],['AIDM','AI 创意实践']]),
      tags:['CS','HCI','AI','DIGITAL MEDIA'], actions:local([],[])
    }
  };

  const stories = {
    now: local({num:'1',profile:'tencent',visual:'tencent',title:'Platform systems that reduce repeated work for game teams.',copy:'At Tencent, I translate activation, acquisition and operational needs into reusable capabilities with clear configuration, test, publication and acceptance rules.'},{num:'1',profile:'tencent',visual:'tencent',title:'让游戏团队少做重复工作的平台系统。',copy:'在腾讯，我把促活、拉新与运营诉求转化成可复用能力，并补齐配置、测试、发布和验收规则。'}),
    before: local({num:'2',profile:'xiaomi',visual:'AI',title:'Product rules that make uncertain AI output more dependable.',copy:'At Xiaomi, I redesigned trigger conditions and answer strategies for front-vehicle recognition, using effective-answer and re-questioning data to verify the experience.'},{num:'2',profile:'xiaomi',visual:'AI',title:'让不确定的 AI 输出变得更可靠的产品规则。',copy:'在小米，我重做前车识别的触发条件与回答策略，并用有效回答占比和用户重问率验证体验。'}),
    yanyin: local({num:'3',profile:'yanyin',visual:'ELN',title:'A research product built from real laboratory workflows.',copy:'At Yanin Tech, I participated in an ELN product from zero to one, designing standardized export, Protocol templates and recommendation capabilities for biological laboratories.'},{num:'3',profile:'yanyin',visual:'ELN',title:'从真实实验流程中长出来的科研产品。',copy:'在衍因科技，我参与 ELN 产品从 0 到 1 建设，为生物实验室设计标准化导出、Protocol 模板与推荐能力。'}),
    origin: local({num:'4',profile:'education-path',visual:'CS↔AI',title:'From computer systems to AI, media and human experience.',copy:'Computer science gave me structure; interaction design gave me a human lens; AI and digital media expanded both into narrative and creative practice.'},{num:'4',profile:'education-path',visual:'CS↔AI',title:'从计算机系统，走向 AI、媒体与人的体验。',copy:'计算机给我结构，交互设计给我人的视角，AI 与数字媒体又把两者延伸到叙事和创意实践。'})
  };

  const notePages = {
    ai: local({title:'AI × GAMES',teaser:'Agents, memory and player agency.'},{title:'AI × 游戏',teaser:'Agent、记忆与玩家能动性。'}),
    ads: local({title:'PLAYABLE ADS',teaser:'Hook, interaction and performance.'},{title:'试玩广告',teaser:'首帧、交互与效果反馈。'}),
    ux: local({title:'INTERACTION',teaser:'Observe, prototype and test.'},{title:'交互设计',teaser:'观察、原型与验证。'})
  };


  const pageList = (folder,count) => Array.from({length:count},(_,i)=>`./assets/projects/${folder}/page-${String(i+1).padStart(2,'0')}.webp`);
  const projects = {
    trpg:{idx:'PROJECT_01',size:'compact',card:local({title:'AI TRPG',tag:'LIVE AI GAME',summary:'A suspense text RPG with AI narration, escalating risk and an end-of-session report.',open:'PLAY / OPEN ↗'},{title:'AI 跑团',tag:'在线 AI 游戏',summary:'由 AI 旁白驱动的悬疑文字跑团，包含风险升级、撤离选择和结局报告。',open:'开始游戏 ↗'}),detail:local({summary:'A suspense text RPG with AI narration, risk escalation, an early-extraction decision and an AI-generated session report at the end.',meta:['Live AI game','Interactive narrative','Risk system'],flow:['Start an investigation','Choose under uncertainty','Extract or push deeper','Receive a session report'],links:[['PLAY LIVE','https://ai-trpg-nu.vercel.app/','primary']]},{summary:'一款由 AI 旁白推动的悬疑文字跑团。玩家需要在风险不断升级的调查中选择提前撤离或继续深入，并在结束后获得 AI 生成的本局报告。',meta:['在线 AI 游戏','互动叙事','风险系统'],flow:['进入调查','在不确定中选择','撤离或继续深入','生成本局报告'],links:[['开始游戏','https://ai-trpg-nu.vercel.app/','primary']]}),images:['./assets/projects/ai-trpg-cover.svg']},
    pixel:{idx:'PROJECT_02',size:'portrait',card:local({title:'Pixel Pals',tag:'INTERACTIVE INSTALLATION',summary:'An algorithmic, cross-cultural archive that turns personal worries into acts of comfort.',open:'VIEW WORK ↗'},{title:'Pixel Pals',tag:'互动媒体装置',summary:'把个人烦恼拆成像素，再重组为来自不同文化的安慰方式。',open:'查看作品 ↗'}),detail:local({summary:'An interactive media installation where a worry is broken into pixels and reassembled into a culturally grounded comfort word, turning algorithmic matching into a visible act of care.',meta:['Ars Electronica 2025','Interactive installation','AI + culture'],flow:['Enter a worry','Match a cultural remedy','Watch robots move pixels','Read its cultural meaning'],links:[['OPEN PIXEL PALS','https://pixel-pals.my.canva.site/','primary'],['VIEW FULL PDF','./assets/docs/pixelpals.pdf','secondary']]},{summary:'观众输入的烦恼词会被算法拆解成像素，再由机器人搬运并重组为来自全球文化的安慰词，把无形的算法匹配变成可见的关怀行动。',meta:['林茨电子艺术节 2025','互动媒体装置','AI × 文化'],flow:['输入烦恼','匹配文化安慰方式','观看机器人搬运像素','阅读对应文化含义'],links:[['打开 Pixel Pals','https://pixel-pals.my.canva.site/','primary'],['查看完整 PDF','./assets/docs/pixelpals.pdf','secondary']]}),images:pageList('pixelpals',1)},
    flowering:{idx:'PROJECT_03',size:'wide',card:local({title:'Flowering',tag:'SERVICE DESIGN',summary:'A prognosis-stage medical service connecting patient data, emotional support and follow-up care.',open:'VIEW 11 PAGES ↗'},{title:'Flowering',tag:'服务设计',summary:'连接患者数据、情绪支持与预后随访的医疗服务设计。',open:'查看 11 页 ↗'}),detail:local({summary:'A medical prognosis service-design concept that combines health data, emotional support, follow-up care, a reviewed knowledge base and patient-doctor communication.',meta:['Service design','Healthcare','UX research'],flow:['Research patients and staff','Map stakeholders and services','Build the service blueprint','Prototype the mobile experience'],links:[['VIEW FULL PDF','./assets/docs/flowering.pdf','primary'],['DESIGN DOCUMENT','https://vu19zbapr9.feishu.cn/docx/BzlkdfrGboopDhxJwUdcFp6Lnhf','secondary']]},{summary:'面向医疗预后阶段的服务设计，将健康数据、情绪支持、随访管理、审核知识库和医患沟通整合进一套系统。',meta:['服务设计','医疗健康','用户研究'],flow:['调研患者与医护人员','梳理利益相关者与服务流程','绘制服务蓝图','完成移动端高保真原型'],links:[['查看完整 PDF','./assets/docs/flowering.pdf','primary'],['查看设计文档','https://vu19zbapr9.feishu.cn/docx/BzlkdfrGboopDhxJwUdcFp6Lnhf','secondary']]}),images:pageList('flowering',11)},
    sound:{idx:'PROJECT_04',size:'wide',card:local({title:'Shape of Sound',tag:'HCI RESEARCH',summary:'Preserving emotion in speech-to-text through emoji, visual feedback and evaluated prototypes.',open:'VIEW 10 PAGES ↗'},{title:'声音的形状',tag:'人机交互研究',summary:'通过表情符号和视觉反馈，在语音转文字中保留情绪。',open:'查看 10 页 ↗'}),detail:local({summary:'An HCI project testing how voice emotion can survive speech-to-text through emoji and visual cues, with formative research, prototypes and comparative evaluation.',meta:['HCI research','Speech-to-text','Emotion'],flow:['Study voice-message friction','Compare expression methods','Build the processing pipeline','Evaluate accuracy and emotion'],links:[['VIEW FULL PDF','./assets/docs/shapeofsound.pdf','primary'],['VIEW REPOSITORY','https://github.com/guaiwu012/CS160-HCI','secondary']]},{summary:'一项研究语音情绪如何在语音转文字中被保留的人机交互项目，包含形成性研究、表达方式比较、原型和对照评估。',meta:['人机交互研究','语音转文字','情绪计算'],flow:['研究语音消息使用阻力','比较不同情绪表达方式','搭建处理流程','评估准确率与情绪增强效果'],links:[['查看完整 PDF','./assets/docs/shapeofsound.pdf','primary'],['查看代码仓库','https://github.com/guaiwu012/CS160-HCI','secondary']]}),images:pageList('shapeofsound',10)},
    blockbot:{idx:'PROJECT_05',size:'wide',card:local({title:'Block Bot',tag:'PHYSICAL COMPUTING',summary:'A screen-free programming toy that lets children command a trolley with colored blocks.',open:'VIEW 9 PAGES ↗'},{title:'Block Bot',tag:'物理计算',summary:'儿童通过排列彩色指令块，控制小车移动的无屏编程玩具。',open:'查看 9 页 ↗'}),detail:local({summary:'A screen-free physical programming toy for children aged 3–6. Colored direction blocks are scanned by a trolley and converted into movement instructions.',meta:['Physical computing','Arduino','Education'],flow:['Arrange direction blocks','Scan their colors','Store the commands','Run the trolley path'],links:[['VIEW FULL PDF','./assets/docs/blockbot.pdf','primary'],['VIEW CODE / VIDEO','https://github.com/guaiwu012/BLOCK-BOT','secondary']]},{summary:'面向 3–6 岁儿童的无屏物理编程玩具。小车扫描彩色方向块，并把颜色转换为对应的移动指令。',meta:['物理计算','Arduino','教育科技'],flow:['排列方向积木','扫描颜色','存储指令','执行小车路径'],links:[['查看完整 PDF','./assets/docs/blockbot.pdf','primary'],['查看代码与视频','https://github.com/guaiwu012/BLOCK-BOT','secondary']]}),images:pageList('blockbot',9)},
    mogao:{idx:'PROJECT_06',size:'portrait',card:local({title:'Mogao Traces',tag:'AI CULTURAL TOURISM',summary:'An AI-driven cultural tourism system for reading, navigating and caring for the Mogao Caves.',open:'VIEW PROJECT BOARD ↗'},{title:'莫高寻迹',tag:'AI 文旅交互',summary:'以 AI 驱动的莫高窟文旅交互系统，连接洞窟导览、环境感知与文化叙事。',open:'查看项目展板 ↗'}),detail:local({summary:'An AI-driven interaction system for the Mogao Caves, connecting visitor routes, environmental sensing, cave health information and cultural storytelling.',meta:['Cultural tourism','AI interaction','Information visualization'],flow:['Read the site','Sense environmental pressure','Shape a visitor route','Reveal cultural stories'],links:[['VIEW PROJECT BOARD','./assets/projects/mogao/page-01.png','primary']]},{summary:'面向莫高窟的 AI 文旅交互系统，将游客路径、环境感知、洞窟健康信息与文化叙事连接起来。',meta:['文旅交互','AI 系统','信息可视化'],flow:['理解场地与问题','感知环境压力','规划游客路径','展开文化叙事'],links:[['查看项目展板','./assets/projects/mogao/page-01.png','primary']]}),images:['./assets/projects/mogao/page-01.png']},
    touch:{idx:'PROJECT_07',size:'wide',video:'https://raw.githubusercontent.com/guaiwu012/fay-memory-portfolio-refined/main/assets/projects/touch-to-talk.mp4',poster:'./assets/projects/touch-to-talk-cover.svg',card:local({title:'Touch to Talk',tag:'COMMUNICATION DESIGN',summary:'An AR-driven sign language learning game about turning touch into a shared conversation.',open:'PLAY PROJECT VIDEO ↗'},{title:'Touch to Talk',tag:'AR 手语学习游戏',summary:'一款由 AR 驱动的手语学习游戏，把触碰变成共享的沟通体验。',open:'播放项目视频 ↗'}),detail:local({summary:'An AR-driven sign language learning game that uses touch, gesture and playful interaction to make communication practice feel shared.',meta:['AR interaction','Sign language learning','Game design'],flow:['Frame a conversation','Learn through gesture','Practice the exchange','Turn touch into talk'],links:[['OPEN DRIVE FOLDER','https://drive.google.com/drive/folders/1FUkBSuQJNBKtSAj_jYvgCk1iM8ojqWMj','secondary']]},{summary:'一款由 AR 驱动的手语学习游戏，通过触碰、手势和游戏化互动，让沟通练习变成共享体验。',meta:['AR 交互','手语学习','游戏设计'],flow:['进入沟通场景','通过手势学习','练习互动表达','让触碰成为对话'],links:[['打开 Drive 文件夹','https://drive.google.com/drive/folders/1FUkBSuQJNBKtSAj_jYvgCk1iM8ojqWMj','secondary']]}),images:['./assets/projects/touch-to-talk-cover.svg']}
  };

  const showToast = (en, zh = en) => {
    toast.textContent = currentLang === 'zh' ? zh : en;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const ensureAudio = async () => {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    return audioCtx;
  };

  const tone = (freq = 420, duration = .08, type = 'sine') => {
    if (!audioOn) return;
    ensureAudio().then(ctx => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    });
  };

  const buildAmbientMotif = () => {
    const scale = [220, 261.63, 293.66, 329.63, 392, 440]; // A minor pentatonic
    let index = 1 + Math.floor(Math.random() * 3);
    ambientMotif = Array.from({length:8}, (_, step) => {
      if (step > 0) {
        const move = Math.random() < .22 ? 0 : (Math.random() < .5 ? -1 : 1);
        index = Math.max(0, Math.min(scale.length - 1, index + move));
      }
      return scale[index];
    });
  };

  const scheduleAmbientNote = () => {
    if (!audioOn || !audioCtx || !ambientMaster) return;
    if (!ambientMotif.length || ambientBeat % 16 === 0) buildAmbientMotif();
    const now = audioCtx.currentTime + .02;
    const freq = ambientMotif[ambientBeat % ambientMotif.length];
    const lead = audioCtx.createOscillator();
    const shimmer = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    const shimmerGain = audioCtx.createGain();
    lead.type = 'triangle';
    shimmer.type = 'sine';
    lead.frequency.setValueAtTime(freq, now);
    shimmer.frequency.setValueAtTime(freq * 2, now);
    shimmer.detune.setValueAtTime((Math.random() - .5) * 8, now);
    noteGain.gain.setValueAtTime(.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(.045, now + .08);
    noteGain.gain.exponentialRampToValueAtTime(.0001, now + .9);
    shimmerGain.gain.setValueAtTime(.0001, now);
    shimmerGain.gain.exponentialRampToValueAtTime(.012, now + .1);
    shimmerGain.gain.exponentialRampToValueAtTime(.0001, now + .65);
    lead.connect(noteGain); shimmer.connect(shimmerGain);
    noteGain.connect(ambientMaster); shimmerGain.connect(ambientWet);
    lead.start(now); shimmer.start(now);
    lead.stop(now + 1); shimmer.stop(now + .8);

    if (ambientBeat % 4 === 0) {
      const bass = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(ambientBeat % 8 === 0 ? 110 : 130.81, now);
      bassGain.gain.setValueAtTime(.0001, now);
      bassGain.gain.exponentialRampToValueAtTime(.03, now + .05);
      bassGain.gain.exponentialRampToValueAtTime(.0001, now + 1.2);
      bass.connect(bassGain); bassGain.connect(ambientMaster);
      bass.start(now); bass.stop(now + 1.3);
    }
    ambientBeat += 1;
  };

  const startAmbient = async () => {
    if (ambientTimer) return;
    const ctx = await ensureAudio();
    ambientMaster = ctx.createGain();
    ambientWet = ctx.createGain();
    const delay = ctx.createDelay(.7);
    const feedback = ctx.createGain();
    delay.delayTime.value = .28;
    feedback.gain.value = .22;
    ambientMaster.gain.setValueAtTime(.0001, ctx.currentTime);
    ambientMaster.gain.exponentialRampToValueAtTime(.22, ctx.currentTime + .7);
    ambientWet.gain.value = .11;
    ambientMaster.connect(ctx.destination);
    ambientWet.connect(delay);
    delay.connect(feedback); feedback.connect(delay);
    delay.connect(ctx.destination);
    ambientBeat = 0; buildAmbientMotif();
    scheduleAmbientNote();
    ambientTimer = setInterval(scheduleAmbientNote, 680);
  };

  const stopAmbient = () => {
    if (ambientTimer) clearInterval(ambientTimer);
    ambientTimer = null;
    if (ambientMaster && audioCtx) {
      const master = ambientMaster;
      master.gain.cancelScheduledValues(audioCtx.currentTime);
      master.gain.setValueAtTime(Math.max(master.gain.value, .0001), audioCtx.currentTime);
      master.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .45);
      setTimeout(() => { try { master.disconnect(); } catch {} }, 520);
    }
    ambientMaster = null; ambientWet = null; ambientMotif = []; ambientBeat = 0;
  };

  const getLocal = value => value?.[currentLang] ?? value?.en ?? value;

  const applyStaticLanguage = () => {
    root.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    document.title = currentLang === 'zh' ? 'Fay — AI 产品 × 游戏 × 交互设计' : 'Fay — AI Product × Games';
    const meta = $('meta[name="description"]');
    if (meta) meta.content = currentLang === 'zh' ? 'Fay 的个人作品集：AI 产品、游戏系统与交互设计。' : "Fay's interactive portfolio — AI product, game systems and interaction design.";
    $$('[data-i18n]').forEach(el => {
      const value = copy[currentLang][el.dataset.i18n];
      if (value == null) return;
      if (value.includes('<')) el.innerHTML = value; else el.textContent = value;
    });
    $$('[data-i18n-html]').forEach(el => {
      const value = copy[currentLang][el.dataset.i18nHtml];
      if (value != null) el.innerHTML = value;
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      const value = copy[currentLang][el.dataset.i18nPlaceholder];
      if (value != null) el.placeholder = value;
    });
    $('#language-toggle').textContent = currentLang === 'en' ? '中文' : 'EN';
    $('#language-toggle').setAttribute('aria-pressed', String(currentLang === 'zh'));
    renderNotebook(activeNotebookKey, false);
    renderStory(activeStoryKey, false);
    renderProjectCards();
    if ($('#profile-modal')?.open && activeProfileKey) renderProfile(activeProfileKey);
    if ($('#project-modal')?.open && activeProjectKey) openProject(activeProjectKey, true);
  };

  window.addEventListener('load', () => setTimeout(() => $('#boot-screen').classList.add('done'), 1050));

  // Cursor spotlight + custom orbit
  const orbit = $('#cursor-orbit');
  let rawX = innerWidth / 2, rawY = innerHeight / 2, smoothX = rawX, smoothY = rawY;
  window.addEventListener('pointermove', e => {
    rawX = e.clientX; rawY = e.clientY;
    root.style.setProperty('--mx', `${rawX}px`); root.style.setProperty('--my', `${rawY}px`);
  });
  const animateCursor = () => {
    smoothX += (rawX - smoothX) * .16; smoothY += (rawY - smoothY) * .16;
    if (orbit) orbit.style.transform = `translate(${smoothX - 46}px,${smoothY - 46}px)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
  $$('a,button,.object-card,.draggable,.profile-slip').forEach(el => {
    el.addEventListener('mouseenter', () => orbit?.classList.add('hot'));
    el.addEventListener('mouseleave', () => orbit?.classList.remove('hot'));
  });

  // Header behavior and section navigation
  const header = $('#top-shell');
  const navLinks = $$('.main-nav a');
  const sections = $$('[data-section]');
  window.addEventListener('scroll', () => {
    const y = scrollY;
    header.classList.toggle('hidden', y > lastScroll && y > 180);
    lastScroll = y;
    let current = 'home';
    sections.forEach(section => { if (y >= section.offsetTop - 260) current = section.dataset.section; });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }, {passive:true});

  $('#language-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    applyStaticLanguage();
    showToast(currentLang === 'en' ? 'LANGUAGE: ENGLISH' : 'LANGUAGE: CHINESE', currentLang === 'zh' ? '语言：中文' : '语言：英文');
  });

  $('#sound-control').addEventListener('click', async e => {
    audioOn = !audioOn;
    e.currentTarget.setAttribute('aria-pressed', String(audioOn));
    e.currentTarget.classList.toggle('music-on', audioOn);
    if (audioOn) {
      await ensureAudio();
      tone(560,.12,'triangle');
      startAmbient();
    } else {
      stopAmbient();
    }
    showToast(audioOn ? 'SOUND + AMBIENT SYNTH: ON' : 'SOUND: OFF', audioOn ? '界面音效与合成背景音乐：开启' : '声音：关闭');
  });

  const modes = ['PLAY','BUILD','OBSERVE'];
  const modesZh = ['游玩','构建','观察'];
  let modeIndex = 0;
  $('#mode-cycle').addEventListener('click', e => {
    modeIndex = (modeIndex + 1) % modes.length;
    e.currentTarget.textContent = currentLang === 'zh' ? modesZh[modeIndex] : modes[modeIndex];
    document.body.dataset.mode = modes[modeIndex].toLowerCase();
    tone(330 + modeIndex * 120,.1,'square');
    showToast(`MODE: ${modes[modeIndex]}`, `模式：${modesZh[modeIndex]}`);
  });

  // Focus categories + automatic 30-second rotation
  const focusKeys = ['interest','education'];
  let focusIndex = 0;
  let focusTimer = null;
  const restartProgress = () => {
    const p = $('.focus-progress');
    if (!p) return;
    p.classList.add('restart'); void p.offsetWidth; p.classList.remove('restart');
  };
  const setFocus = (key, announce = false) => {
    focusIndex = focusKeys.indexOf(key);
    document.body.dataset.focus = key;
    $$('.focus-buttons button').forEach(btn => {
      const on = btn.dataset.focus === key;
      btn.classList.toggle('active', on); btn.setAttribute('aria-selected', String(on));
    });
    restartProgress();
    if (announce) {
      const label = copy[currentLang][`focus.${key}`];
      showToast(`FOCUS: ${copy.en[`focus.${key}`]}`, `高亮：${copy.zh[`focus.${key}`]}`);
      tone(330 + focusIndex * 120,.08,'triangle');
    }
  };
  const resetFocusTimer = () => {
    clearInterval(focusTimer);
    focusTimer = setInterval(() => setFocus(focusKeys[(focusIndex + 1) % focusKeys.length], false), 30000);
  };
  $$('.focus-buttons button').forEach(btn => btn.addEventListener('click', () => {
    document.body.classList.add('focus-mode');
    $('#headphones').setAttribute('aria-pressed','true');
    setFocus(btn.dataset.focus, true); resetFocusTimer();
  }));
  setFocus('interest'); resetFocusTimer();

  // Generic tilt: bounded and never cumulative, so hover cannot enlarge an object indefinitely.
  $$('.tilt').forEach(card => {
    const initialStyle = card.getAttribute('style') || '';
    let baseTransform = '';
    card.addEventListener('pointerenter', () => {
      const computed = getComputedStyle(card).transform;
      baseTransform = computed === 'none' ? '' : computed;
    });
    card.addEventListener('pointermove', e => {
      if (innerWidth < 900) return;
      const r = card.getBoundingClientRect();
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const rx = clamp(((e.clientY-r.top)/r.height-.5)*-6, -3.5, 3.5);
      const ry = clamp(((e.clientX-r.left)/r.width-.5)*6, -3.5, 3.5);
      card.style.transform = `${baseTransform} perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`.trim();
    });
    card.addEventListener('pointerleave', () => card.setAttribute('style', initialStyle));
  });

  // Controller actions
  $$('.pad-buttons button').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const action = btn.dataset.action;
    $('#controller-status').textContent = action.toUpperCase();
    tone({play:540,build:360,impact:180,reset:700}[action],.11,action==='impact'?'sawtooth':'square');
    if (action === 'play') {
      document.body.classList.remove('focus-mode'); $('#headphones').setAttribute('aria-pressed','false');
      showToast('PLAY MODE — EVERYTHING IS A PROTOTYPE','游玩模式 — 一切都可以成为原型');
    } else if (action === 'build') {
      $$('.object-card').forEach((el,i)=>setTimeout(()=>el.animate([{translate:'0 0'},{translate:'0 -10px'},{translate:'0 0'}],{duration:420}),i*35));
      showToast('BUILD MODE — SYSTEMS AS MATERIAL','构建模式 — 把系统当作材料');
    } else if (action === 'impact') {
      document.body.classList.add('impact-flash'); setTimeout(()=>document.body.classList.remove('impact-flash'),600);
      showToast('IMPACT MODE — MAKE IT MEANINGFUL','影响模式 — 让体验真正有意义');
    } else {
      document.body.classList.add('focus-mode'); $('#headphones').setAttribute('aria-pressed','true'); setFocus(focusKeys[focusIndex]);
      showToast('CANVAS RESET','画布已重置');
    }
  }));

  const renderNotebook = (key, withTone = true) => {
    activeNotebookKey = key;
    const item = getLocal(notePages[key]);
    $('#notebook-page').innerHTML = `<h2>${item.title}</h2><p class="object-teaser">${item.teaser}</p><button class="detail-trigger" data-profile="ai-making">${copy[currentLang]['common.openDetails']}</button>`;
    $$('.notebook-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.page===key));
    const labels = currentLang === 'zh' ? {ai:'AI × 游戏',ads:'试玩广告',ux:'交互设计'} : {ai:'AI × GAMES',ads:'PLAYABLE ADS',ux:'INTERACTION'};
    $$('.notebook-tabs button').forEach(b=>b.textContent=labels[b.dataset.page]);
    if (withTone) tone(390,.06,'triangle');
  };
  $$('.notebook-tabs button').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();renderNotebook(btn.dataset.page)}));
  $('#next-note').addEventListener('click',e=>{e.stopPropagation();const buttons=$$('.notebook-tabs button');const active=$('.notebook-tabs button.active');renderNotebook(buttons[(buttons.indexOf(active)+1)%buttons.length].dataset.page)});

  // Draggable notes
  $$('.draggable').forEach(el => {
    let dragging=false, ox=0, oy=0;
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('button,a')) return;
      dragging=true; el.setPointerCapture(e.pointerId); el.classList.add('dragging');
      const r=el.getBoundingClientRect(); ox=e.clientX-r.left; oy=e.clientY-r.top;
      el.style.position='fixed'; el.style.left=`${r.left}px`; el.style.top=`${r.top}px`; el.style.right='auto'; el.style.bottom='auto';
      tone(260,.05,'square');
    });
    el.addEventListener('pointermove',e=>{if(!dragging)return;el.style.left=`${e.clientX-ox}px`;el.style.top=`${e.clientY-oy}px`});
    const end=()=>{if(!dragging)return;dragging=false;el.classList.remove('dragging');showToast('NOTE PINNED','便签已固定')};
    el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  });

  const soundTones = {
    calm:local('CALM / LOW ENERGY','平静 / 低能量'),curious:local('CURIOUS / RISING','好奇 / 上升'),joy:local('JOY / BRIGHT','喜悦 / 明亮'),tension:local('TENSION / DENSE','紧张 / 密集'),wonder:local('WONDER / OPEN','惊奇 / 开放')
  };
  $$('.sound-nodes circle').forEach((node,i)=>{
    node.addEventListener('mouseenter',()=>{$('#tone-readout').textContent=getLocal(soundTones[node.dataset.tone]);tone(260+i*100,.12,'sine')});
    node.addEventListener('click',e=>{e.stopPropagation();showToast(soundTones[node.dataset.tone].en,soundTones[node.dataset.tone].zh)});
  });

  $('#headphones').addEventListener('click',e=>{
    const on=e.currentTarget.getAttribute('aria-pressed')!=='true';
    e.currentTarget.setAttribute('aria-pressed',String(on));document.body.classList.toggle('focus-mode',on);
    tone(on?220:520,.15,'sine');showToast(on?'FOCUS MODE: ON':'FOCUS MODE: OFF',on?'专注模式：开启':'专注模式：关闭');
  });
  const tracks=['CURIOSITY','EMOTION','PLAY','MEMORY']; const tracksZh=['好奇','情绪','游玩','记忆']; let track=0;
  $('#cassette').addEventListener('click',e=>{e.stopPropagation();track=(track+1)%tracks.length;$('#cassette-track').textContent=currentLang==='zh'?`音轨 0${track+1} / ${tracksZh[track]}`:`TRACK 0${track+1} / ${tracks[track]}`;tone(320+track*90,.1,'triangle');showToast(`NOW PLAYING: ${tracks[track]}`,`正在播放：${tracksZh[track]}`)});

  const renderStory = (key, animate = true) => {
    activeStoryKey = key;
    const s = getLocal(stories[key]);
    $$('.story-node').forEach(b=>b.classList.toggle('active',b.dataset.story===key));
    const visual = s.visual === 'tencent'
      ? `<button class="story-visual-card story-art-tencent" data-profile="${s.profile}" aria-label="Open full experience"><img src="./assets/tencent-penguin.png" alt="Blue-purple digital penguin illustration"><span>${copy[currentLang]['story.openDetails']}</span></button>`
      : `<button class="story-visual-card story-art-symbol" data-profile="${s.profile}" aria-label="Open full experience"><strong>${s.visual}</strong><span>${copy[currentLang]['story.openDetails']}</span></button>`;
    $('#story-display').innerHTML=`${visual}<div class="story-copy"><div class="story-number">${s.num}</div><h3>${s.title}</h3><p>${s.copy}</p></div>`;
    if (animate) $('#story-display').animate([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:420});
  };
  $$('.story-node').forEach(btn=>btn.addEventListener('click',()=>{renderStory(btn.dataset.story);tone(360,.08,'triangle')}));

  // Profile detail modal
  const profileModal=$('#profile-modal');
  const renderProfile = key => {
    activeProfileKey=key;
    const d=profileData[key]; if(!d)return;
    $('#profile-code').textContent=d.code;
    $('#profile-kicker').textContent=getLocal(d.type);
    $('#profile-title').textContent=getLocal(d.title);
    $('#profile-role').textContent=getLocal(d.role);
    $('#profile-summary').textContent=getLocal(d.summary);
    $('#profile-tags').innerHTML=d.tags.map(x=>`<span>${x}</span>`).join('');
    $('#profile-facts').innerHTML=getLocal(d.facts).map(([label,value])=>`<div><span>${label}</span><b>${value}</b></div>`).join('');
    $('#profile-points-title').textContent=getLocal(d.sectionTitle);
    $('#profile-points').innerHTML=getLocal(d.points).map((x,i)=>`<div data-no="${i+1}">${x}</div>`).join('');
    $('#profile-metrics').innerHTML=getLocal(d.metrics).map(([value,label])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('');
    $('#profile-actions').innerHTML=getLocal(d.actions).map(([label,url,kind])=>`<a class="${kind==='secondary'?'secondary':''}" href="${url}" ${url.startsWith('#')?'':'target="_blank" rel="noopener"'}>${label} ↗</a>`).join('');
    const art=$('#profile-visual-image'),orbit=$('.profile-orbit-art');
    if(d.art){art.src=d.art;art.alt=`${getLocal(d.title)} illustration`;art.hidden=false;orbit.hidden=true}else{art.hidden=true;art.removeAttribute('src');orbit.hidden=false;orbit.querySelector('span').textContent=(getLocal(d.title).match(/[A-Z]/g)||['✦']).slice(0,3).join('')||'✦'}
    $$('#profile-actions a[href^="#"]').forEach(a=>a.addEventListener('click',()=>profileModal.close()));
  };
  const openProfile = key => {renderProfile(key);if(!profileModal.open)profileModal.showModal();tone(520,.1,'triangle')};
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-profile]');
    if(!trigger || trigger.id==='pixel-pals-card')return;
    if(e.target.closest('.pad-buttons,.notebook-tabs,.sound-nodes,#cassette'))return;
    e.preventDefault();e.stopPropagation();openProfile(trigger.dataset.profile);
  });
  $('#profile-modal-close').addEventListener('click',()=>profileModal.close());
  profileModal.addEventListener('click',e=>{if(e.target===profileModal)profileModal.close()});

  // Project filters and real project gallery
  const renderProjectCards = () => {
    $$('.project-card').forEach(card=>{
      const d=getLocal(projects[card.dataset.project].card);
      card.querySelector('[data-project-field="tag"]').textContent=d.tag;
      card.querySelector('[data-project-field="title"]').textContent=d.title;
      card.querySelector('[data-project-field="summary"]').textContent=d.summary;
      card.querySelector('[data-project-field="open"]').textContent=d.open;
    });
  };
  $$('.filters button').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.filters button').forEach(b=>b.classList.toggle('active',b===btn));
    $$('.project-card').forEach(card=>card.classList.toggle('hidden',btn.dataset.filter!=='all'&&!card.dataset.category.includes(btn.dataset.filter)));
    showToast(`FILTER: ${copy.en[`portfolio.filter.${btn.dataset.filter}`]}`,`筛选：${copy.zh[`portfolio.filter.${btn.dataset.filter}`]}`);
  }));

  const projectModal=$('#project-modal'); const modalImage=$('#modal-image'); const modalVideo=$('#modal-video'); const thumbs=$('#gallery-thumbs');
  let activeProject=null,activeImage=0;
  const renderGallery=()=>{
    const videoSrc=activeProject?.video;
    if(videoSrc){
      modalImage.hidden=true; modalVideo.hidden=false; modalVideo.src=videoSrc; modalVideo.poster=activeProject.poster||''; modalVideo.load();
      $('#gallery-prev').hidden=true; $('#gallery-next').hidden=true; $('#gallery-counter').hidden=true; thumbs.hidden=true; $('.modal-hint').hidden=true;
      $('#modal-gallery').classList.add('single-image','video-mode');
      return;
    }
    modalVideo.pause(); modalVideo.hidden=true; modalVideo.removeAttribute('src'); modalVideo.removeAttribute('poster'); modalImage.hidden=false;
    const images=activeProject?.images||[];
    const multi=images.length>1;
    modalImage.src=images[activeImage];
    modalImage.alt=`${getLocal(activeProject.card).title} project page ${activeImage+1}`;
    $('#gallery-counter').textContent=`${activeImage+1} / ${images.length}`;
    $$('.gallery-thumb').forEach((b,i)=>b.classList.toggle('active',i===activeImage));
    $('#gallery-prev').hidden=!multi; $('#gallery-next').hidden=!multi; $('#gallery-counter').hidden=!multi;
    thumbs.hidden=!multi; $('.modal-hint').hidden=!multi;
    $('#modal-gallery').classList.toggle('single-image',!multi); $('#modal-gallery').classList.remove('video-mode');
    modalImage.animate([{opacity:.2,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'});
  };
  const moveGallery=step=>{if(!activeProject||activeProject.images.length<2)return;activeImage=(activeImage+step+activeProject.images.length)%activeProject.images.length;renderGallery();tone(420+activeImage*8,.04,'triangle')};
  const openProject=(key,refresh=false)=>{
    activeProjectKey=key;activeProject=projects[key];if(!refresh)activeImage=0;
    const card=getLocal(activeProject.card),detail=getLocal(activeProject.detail);
    projectModal.classList.remove('project-modal--compact','project-modal--portrait','project-modal--wide');
    projectModal.classList.add(`project-modal--${activeProject.size}`);
    $('#modal-index').textContent=activeProject.idx;$('#modal-title').textContent=card.title;$('#modal-summary').textContent=detail.summary;
    $('#modal-meta').innerHTML=detail.meta.map(x=>`<span>${x}</span>`).join('');
    $('#modal-flow').innerHTML=detail.flow.map((x,i)=>`<span><b>${i+1}</b>${x}</span>`).join('');
    $('#modal-actions').innerHTML=detail.links.map(([label,url,kind])=>`<a class="${kind==='secondary'?'secondary':''}" href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join('');
    thumbs.innerHTML=activeProject.images.length>1?activeProject.images.map((src,i)=>`<button class="gallery-thumb ${i===activeImage?'active':''}" data-index="${i}" aria-label="Open project page ${i+1}"><img src="${src}" alt="" loading="lazy"></button>`).join(''):'';
    $$('.gallery-thumb').forEach(btn=>btn.addEventListener('click',()=>{activeImage=Number(btn.dataset.index);renderGallery()}));
    renderGallery();if(!projectModal.open)projectModal.showModal();if(!refresh)tone(520,.1,'triangle');
  };
  $$('.project-card').forEach(card=>card.addEventListener('click',()=>openProject(card.dataset.project)));
  $('#pixel-pals-card').addEventListener('click',()=>openProject('pixel'));
  $('#gallery-prev').addEventListener('click',()=>moveGallery(-1));$('#gallery-next').addEventListener('click',()=>moveGallery(1));
  $('#gallery-stage').addEventListener('wheel',e=>{if(!activeProject||activeProject.images.length<2||Math.abs(e.deltaY)<8)return;e.preventDefault();moveGallery(e.deltaY>0?1:-1)},{passive:false});
  $('#modal-close').addEventListener('click',()=>projectModal.close());projectModal.addEventListener('click',e=>{if(e.target===projectModal)projectModal.close()});projectModal.addEventListener('close',()=>modalVideo.pause());
  document.addEventListener('keydown',e=>{if(projectModal.open){if(e.key==='ArrowLeft')moveGallery(-1);if(e.key==='ArrowRight')moveGallery(1);if(e.key==='Escape')projectModal.close()}else if(profileModal.open&&e.key==='Escape')profileModal.close()});

  $('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#email-field').value);showToast('EMAIL COPIED','邮箱已复制')}catch{showToast('COPY FAILED — SELECT IT MANUALLY','复制失败，请手动选择邮箱')}});

  // Initial render
  renderNotebook('ai',false);renderStory('now',false);renderProjectCards();applyStaticLanguage();
})();
