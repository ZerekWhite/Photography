export type PortfolioGroup = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

export type PortfolioProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  previewImages: string[];
  groups: PortfolioGroup[];
};

type CreateProjectInput = Omit<PortfolioProject, 'previewImages'> & {
  previewImages?: string[];
};

const flattenGroups = (groups: PortfolioGroup[]) => groups.flatMap((g) => g.images);

const createProject = (input: CreateProjectInput): PortfolioProject => {
  const allImages = flattenGroups(input.groups);
  return {
    ...input,
    previewImages: input.previewImages ?? allImages.slice(0, 6),
  };
};

export const portfolioProjects: PortfolioProject[] = [
  createProject({
    id: 1,
    title: '都市织影',
    category: '城市',
    description: '穿行在街巷与天际线之间，记录每座城市独有的节奏。',
    groups: [
      {
        id: 'city',
        title: '城市风光',
        description: '光与影，是城市的灵魂。',
        images: [
          '/images/city/city-1.jpg',
          '/images/city/city-2.jpg',
          '/images/city/city-3.jpg',
          '/images/city/city-4.jpg',
          '/images/city/city-5.jpg',
          '/images/city/city-6.JPG',
        ],
      },
      {
        id: 'osaka',
        title: '大阪',
        description: '大阪的街道，是城市的中心，也是城市的边界。',
        images: [
          '/images/city/osaka-1.jpg',
          '/images/city/osaka-2.jpg',
          '/images/city/osaka-3.JPG',
          '/images/city/osaka-4.JPG',
          '/images/city/osaka-7.jpg',
          '/images/city/osaka-9.jpg',
          '/images/city/Osaka-0.jpg',
          '/images/city/osaka-13.jpg',
          '/images/city/osaka-24.jpg',
          '/images/city/osaka-25.jpg',
        ],
      },
      {
        id: 'kyoto',
        title: '京都',
        description: '古色古香的街道，宁静而充满文化气息。',
        images: [
          '/images/city/Kyoto-1.jpg',
          '/images/city/Kyoto-4.jpg',
          '/images/city/Kyoto-5.jpg',
          '/images/city/Kyoto-2.jpg',
          '/images/city/kyoto-7.JPG',
          '/images/city/Kyoto-6.JPG',
          '/images/city/Kyoto-13.JPG',
          '/images/city/Kyoto-14.JPG',
          '/images/city/Kyoto-15.JPG',
          '/images/city/Kyoto-16.JPG',
          '/images/city/Kyoto-17.JPG',
          '/images/city/Kyoto-8.JPG',
          '/images/city/Kyoto-9.jpg',
          '/images/city/Kyoto-3.JPG',

        ],
      },
      {
        id: 'tokyo',
        title: '东京',
        description: '城市的速度与密度，构成了一个永远醒着的城市。',
        images: [
          '/images/city/Tokyo-1.jpg',
          '/images/city/Tokyo-2.jpg',
          '/images/city/Tokyo-3.jpg',
          '/images/city/Tokyo-4.jpg',
          '/images/city/Tokyo-5.jpg',
          '/images/city/Tokyo-6.jpg',
          '/images/city/Tokyo-7.jpg',
          '/images/city/Tokyo-8.jpg',
          '/images/city/Tokyo-9.JPG',
          '/images/city/Tokyo-10.jpg',
        ],
      },
      {
        id: 'takayama',
        title: '飞弹高山・神山旧梦',
        description: '踏入《冰菓》的取景地，古街的石板路、宫川的流水、斐太高中的轮廓，都藏着折木奉太郎与千反田爱瑠的青春余温，用镜头拾起这份属于飞弹高山的温柔与好奇。',
        images: [
          '/images/city/takayama-1.jpg',
          '/images/city/takayama-4.jpg',
          '/images/city/takayama-5.jpg',
          '/images/city/takayama-6.JPG',
          '/images/city/takayama-7.jpg',
          '/images/city/takayama-19.jpg',
          '/images/city/takayama-10.jpg',
          '/images/city/takayama-11.jpg',
          '/images/city/takayama-12.jpg',
          '/images/city/takayama-14.jpg',
          '/images/city/takayama-15.jpg',
          '/images/city/takayama-16.jpg',
          '/images/city/takayama-31.jpg',
        ],
      },
      {
        id: ' Sydney',
        title: '悉尼',
        description: '在繁忙与繁华中，寻找悉尼的独特气质。',
        images: [
          '/images/city/Sydney-1.jpg',
          '/images/city/Sydney-2.jpg',
          '/images/city/Sydney-4.jpg',
          '/images/city/Sydney-7.jpg',
          '/images/city/sydney-15.jpg',
          '/images/city/sydney-20.jpg',
          '/images/city/sydney-27.jpg',
          '/images/city/sydney-28.jpg',
          '/images/city/sydney-29.jpg',
          '/images/city/sydney-51.jpg',
          '/images/city/sydney-1-2.jpg',
          '/images/city/sydney-1-4.jpg',
          '/images/city/sydney-1-3.jpg',
          '/images/city/sydney-1-5.jpg',
        ],
      },
      {
      id: 'golden coast',
      title: '黄金海岸',
      description: '在黄金海岸，你可以找到最接近原始的光。',
      images: [
        '/images/city/golden-1.jpg',
        '/images/city/golden-2.jpg',
        '/images/city/golden-4.jpg',
        '/images/city/golden-5.jpg',
        '/images/city/golden-6.jpg',
      ],
      },
      {
        id: 'bangkok',
        title: '曼谷',
        description: '曼谷，一个充满活力与魅力的城市，让人流连忘返。',
        images: [
          '/images/city/bangkok-1.jpg',
          '/images/city/bangkok-2.jpg',
          '/images/city/bangkok-5.jpg',
          '/images/city/Bangkok-10.JPG',
          '/images/city/Bangkok-15.JPG',
          '/images/city/bangkok-4.jpg',
          '/images/city/Bangkok-16.JPG',
          '/images/city/Bangkok-18.JPG',
          '/images/city/Bangkok-19.JPG',
          '/images/city/bangkok-3.jpg',
          '/images/city/bangkok-28.JPG',
        ],
      },
      {
        id: 'nagoya',
        title: '名古屋',
        description: '行走名古屋，用照片收藏这座城。',
        images: [
          '/images/city/nagoya-1.jpg',
          '/images/city/nagoya-2.jpg',
          '/images/city/nagoya-5.jpg',
          '/images/city/nagoya-6.jpg',
          '/images/city/nagoya-3.jpg',
          '/images/city/nagoya-4.jpg',
        ],
      },
      {
        id: 'nara',
        title: '奈良',
        description: '古寺、小鹿与千年时光，都被我轻轻定格。',
        images: [
          '/images/city/nara-0.jpg',
          '/images/city/nara-1.jpg',
        ],
      },
      {
        id: 'Uji',
        title: '宇治',
        description: '一抹抹茶绿，藏着宇治最温柔的日式风雅。',
        images: [
          '/images/city/UJI-1.jpg',
          '/images/city/Uji-2.jpg',
          '/images/city/Uji-4.jpg',
          '/images/city/Uji-5.jpg',
          '/images/city/Uji-7.jpg',
          '/images/city/Uji-6.jpg',
          '/images/city/Uji-9.jpg',
          '/images/city/Uji-10.jpg',
        ],
      },
      {
        id: 'baichuanxiang',
        title: '白川乡・雪落合掌',
        description: '冬日雪覆白川乡，合掌村落静卧山间，用镜头收藏这童话般的雪夜与温柔。',
        images: [
          '/images/city/baichuanxiang-0.JPG',
          '/images/city/baichuanxiang-2.JPG',
          '/images/city/baichuanxiang-5.JPG',
          '/images/city/baichuanxiang-7.JPG',
          '/images/city/baichuanxiang-8.JPG',
          '/images/city/baichuanxiang-12.JPG',
          '/images/city/baichuanxiang-13.JPG',
          '/images/city/baichuanxiang-3.JPG',
          '/images/city/baichuanxiang-1.JPG',
          '/images/city/baichuanxiang-4.JPG',

        ],
      },
      {
        id: 'puji',
        title: '普吉岛',
        description: '阳光、沙滩与海浪，是普吉岛写给夏天的诗.',
        images: [
          '/images/city/puji-2.jpg',
          '/images/city/puji-3.jpg',
          '/images/city/puji-7.jpg',
          '/images/city/puji-8.jpg',
          '/images/city/puji-12.jpg',
          '/images/city/puji-14.jpg',
          '/images/city/puji-15.jpg',
          '/images/city/puji-16.jpg',
          '/images/city/puji-19.jpg',
          '/images/city/puji-20.jpg',
        ],
      },
      {
        id: 'bali',
        title: '巴厘岛・夏日岛屿诗',
        description: '盛夏的巴厘岛，阳光、椰林与海浪相拥，用镜头记录这片热带海岛的热烈与温柔。',
        images: [
          '/images/city/bali-2.jpg',
          '/images/city/bali-1.jpg',
          '/images/city/bali-3.jpg',
          '/images/city/bali-4.jpg',
          '/images/city/bali-5.jpg',
          '/images/city/bali-6.jpg',
          '/images/city/bali-8.jpg',
        ],
      },
      {
        id: 'taiyuan',
        title: '太原',
        description: '一城古韵，满目烟火，记录太原的厚重与日常。',
        images: [
          '/images/city/taiyuan-1.jpg',
          '/images/city/taiyuan-2.jpg',
        ],
      },
      {
        id: 'xinzou',
        title: '忻州',
        description: '山河壮阔，文脉悠长，用镜头留住忻州的岁月风华。',
        images: [
          '/images/city/xinzou-1.jpg',
          '/images/city/xinzou-2.jpg',
          '/images/city/xinzou-4.jpg',
        ],
      },
    ],
  }),
  createProject({
    id: 2,
    title: '旷野遐想',
    category: '自然',
    description: '在风与云之间，收集更接近原始的光。',
    groups: [
      {
        id: 'xinsuigao',
        title: '新穗高・雪境之巅',
        description: '雪落满峰，云雾漫山，在冬日新穗高，用镜头收藏日本北阿尔卑斯最纯净的白色童话。',
        images: [
          '/images/nature/xinsuigao-6.JPG',
          '/images/nature/xinsuigao-9.jpg',
          '/images/nature/xinsuigao-14.jpg',
          '/images/nature/xinsuigao-15.JPG',
          '/images/city/xinsuigao-1.jpg',
          '/images/city/xinsuigao-2.jpg',
        ],
      },
      {
        id: 'beach',
        title: '澳洲夏岸・日光沙滩', // TODO: Change title
        description: '盛夏的澳洲海岸，阳光滚烫，海风自由，用镜头定格这片澄澈蔚蓝里的热烈与温柔。',
        images: [
          '/images/nature/noosa-1.jpg',
          '/images/nature/noosa-2.jpg',
          '/images/nature/noosa-3.jpg',
          '/images/nature/noosa-7.JPG',
          '/images/nature/Sydney-5.jpg',
          '/images/nature/sydney-25.JPG',
          '/images/nature/garden-8.JPG',
          '/images/nature/garden-10.JPG',
          '/images/nature/noosa-8.jpeg',
          '/images/nature/cronulla-2.JPG',
          '/images/nature/cronulla-3.JPG',
          '/images/nature/cronulla-4.JPG',
          '/images/nature/cronulla-5.JPG',
        ],
      },
      {
        id: 'haian',
        title: '海岸丘陵・落日归山海',
        description: '沿着海岸丘陵追逐黄昏，把落日、海风与起伏的地平线，一同收进镜头里。',
        images: [
          '/images/nature/sydney-22.jpg',
          '/images/nature/puji-6.JPG',
          '/images/nature/sydney-21.jpg',
          '/images/nature/sydney-23.JPG',
          '/images/nature/sydney-43.jpg',
        ],
      },
    ],
  }),
  createProject({
    id: 3,
    title: '文融山水',
    category: '人文',
    description: '人的痕迹与自然的尺度，在同一帧里相遇。',
    groups: [
      {
        id: 'daohe',
        title: '稻荷',
        description: '穿过千本鸟居，走进一场朱红的光影梦境。',
        images: [
          '/images/cultural/daohe-1.jpg',
          '/images/cultural/daohe-2.jpg',
          '/images/cultural/daohe-5.jpg',
          '/images/cultural/daohe-7.JPG',
          '/images/cultural/daohe-8.JPG',
        ],
      },
      {
        id: 'huandidao',
        title: '皇帝岛',
        description: '安达曼海的夏，凝在皇帝岛的一湾碧透与白沙之上。',
        images: [
          '/images/cultural/puji-11.JPG',
          '/images/cultural/puji-13.JPG',
          '/images/cultural/puji-12.JPG',
        ],
      },
      {
        id: 'maple',
        title: '枫叶',
        description: '风过红叶，便是京都最美的诗。',
        images: [
          '/images/cultural/Koyto-19.jpg',
          '/images/cultural/Kyoto-20.JPG',
          '/images/cultural/Kyoto-21.JPG',
          '/images/cultural/Kyoto-22.jpg',
          '/images/cultural/Kyoto-23.jpg',
          '/images/cultural/Kyoto-24.jpg',
          '/images/cultural/Kyoto-25.jpg',
          '/images/cultural/Kyoto-26.jpg',
          '/images/cultural/Kyoto-27.JPG',
          '/images/cultural/Kyoto-28.jpg',
          '/images/cultural/Kyoto-29.jpg',
          '/images/cultural/Kyoto-30.jpg',
          '/images/cultural/Kyoto-31.jpg',
          '/images/cultural/Kyoto-32.jpg',
        ],
      },
    ],
  }),
  createProject({
    id: 4,
    title: '心野逐欢',
    category: '生活',
    description: '此刻定格，便是岁月里最温柔的纪念。',
    groups: [
      {
        id: 'wawa',
        title: '蒙特维尔・粉夏暖阳',
        description: '蒙特维尔的夏日阳光刚好，你眼里的光，比风景更动人。',
        images: [
          '/images/life/wawa-3.jpg',
          '/images/life/wawa-4.jpg',
          '/images/life/wawa-5.jpg',
          '/images/life/wawa-7.jpg',
          '/images/life/wawa-8.jpg',
          '/images/life/wawa-9.jpg',
        ],
      },
      {
        id: 'wawa',
        title: '曼谷夏序・香茅清欢',
        description: '盛夏曼谷，一杯香茅斑斓茶，清冽酸甜，是镜头里最鲜活的夏日气息。',
        images: [
          '/images/life/wawa-20.jpg',
          '/images/life/wawa-13.jpg',
          '/images/life/wawa-14.jpg',
          '/images/life/wawa-17.jpg',
          '/images/life/wawa-18.jpg',
          '/images/life/wawa-20-1.jpg',
          '/images/life/wawa-20-2.jpg',
        ],
      },
      {
        id: 'wawa',
        title: '和服映夏',
        description: '蝉鸣、古街、和服与你，是我心中京都最动人的模样。',
        images: [
          '/images/life/wawa-39.jpg',
          '/images/life/wawa-40.jpg',
          '/images/life/wawa-41.jpg',
          '/images/life/wawa-42.jpg',
          '/images/life/wawa-43.jpg',
          '/images/life/wawa-32.jpg',
          '/images/life/wawa-35.jpg',
          '/images/life/wawa-34.jpg',
          '/images/life/wawa-36.jpg',
          '/images/life/wawa-37.jpg',
        ],
      },
        {
        id: 'drinks',
        title: '环球饮记',
        description: '用一瓶饮品，记住一座城。这是我独有的，温柔旅行纪念。',
        images: [
          '/images/life/bangkok-10.JPG',
          '/images/life/bangkok-11.JPG',
          '/images/life/Bangkok-13.JPG',
        ],
      },
      {
        id: 'street',
        title: '高山老街',
        description: '循着动漫的足迹，在高山老街，遇见最动人的你。',
        images: [
          '/images/life/wawa-21.jpg',
          '/images/life/wawa-22.jpg',
          '/images/life/wawa-23.jpg',
        ],
      },
      {
        id: 'liancang',
        title: '镰仓海边',
        description: '镰仓的风，蔚蓝的海，夏日的JK少女。',
        images: [
          '/images/life/Kamakura-1.JPG',
          '/images/life/Kamakura-4.JPG',
          '/images/life/Kamakura-5.JPG',
          '/images/life/Kamakura-7.JPG',
          '/images/life/Kamakura-8.JPG',
        ],
      },
      {
        id: 'beach',
        title: '海岸拾光录',
        description: '以沙滩为幕，以路人为主角，在世界的每一片海边，收藏不期而遇的美好。',
        images: [
          '/images/life/noosa-11.jpg',
          '/images/life/noosa-10.jpg',
          '/images/life/puji-11.jpg',
          '/images/life/puji-33.jpg',
        ],
      },

    ],
  }),
];

export const getProjectById = (id: number) => portfolioProjects.find((p) => p.id === id);

export const getProjectAllImages = (project: PortfolioProject) => flattenGroups(project.groups);

export type ProjectImageMeta = {
  src: string;
  groupId: string;
  groupTitle: string;
  groupIndex: number;
  globalIndex: number;
};

export const getProjectImageMetaList = (project: PortfolioProject): ProjectImageMeta[] => {
  const meta: ProjectImageMeta[] = [];
  let globalIndex = 0;
  project.groups.forEach((g) => {
    g.images.forEach((src, groupIndex) => {
      meta.push({
        src,
        groupId: g.id,
        groupTitle: g.title,
        groupIndex,
        globalIndex,
      });
      globalIndex += 1
    });
  });
  return meta;
};

export const getProjectImageMetaByIndex = (project: PortfolioProject, index: number) =>
  getProjectImageMetaList(project)[index];
