import { Herb, Formula, Acupoint, KnowledgePoint, Skill } from './types';

export const INITIAL_FORMULAS: Formula[] = [
  {
    id: 'f1',
    name: '麻黄汤',
    pinyin: 'Ma Huang Tang',
    ingredients: [
      { name: '麻黄', dosage: '9g' },
      { name: '桂枝', dosage: '6g' },
      { name: '杏仁', dosage: '6g' },
      { name: '甘草', dosage: '3g' },
    ],
    usage: '水煎服。',
    functions: '发汗解表，宣肺平喘。',
    category: '解表剂',
  },
  {
    id: 'f2',
    name: '桂枝汤',
    pinyin: 'Gui Zhi Tang',
    ingredients: [
      { name: '桂枝', dosage: '9g' },
      { name: '芍药', dosage: '9g' },
      { name: '生姜', dosage: '9g' },
      { name: '大枣', dosage: '3枚' },
      { name: '甘草', dosage: '6g' },
    ],
    usage: '水煎服，啜热稀粥。',
    functions: '解肌发表，调和营卫。',
    category: '解表剂',
  },
  {
    id: 'f3',
    name: '四君子汤',
    pinyin: 'Si Jun Zi Tang',
    ingredients: [
      { name: '人参', dosage: '10g' },
      { name: '白术', dosage: '9g' },
      { name: '茯苓', dosage: '9g' },
      { name: '甘草', dosage: '6g' },
    ],
    usage: '水煎服。',
    functions: '益气健脾。',
    category: '补益剂',
  }
];

export const INITIAL_HERBS: Herb[] = [
  {
    id: 'h1',
    name: '麻黄',
    pinyin: 'Ma Huang',
    nature: '温',
    flavor: ['辛', '微苦'],
    channels: ['肺', '膀胱'],
    category: '解表药',
    effects: [
      { description: '发汗解表', relatedFormulaId: 'f1' },
      { description: '宣肺平喘', relatedFormulaId: 'f1' },
      { description: '利水消肿' },
    ],
  },
  {
    id: 'h2',
    name: '桂枝',
    pinyin: 'Gui Zhi',
    nature: '温',
    flavor: ['辛', '甘'],
    channels: ['心', '肺', '膀胱'],
    category: '解表药',
    effects: [
      { description: '发汗解肌', relatedFormulaId: 'f2' },
      { description: '温通经脉' },
      { description: '助阳化气' },
    ],
  },
  {
    id: 'h3',
    name: '人参',
    pinyin: 'Ren Shen',
    nature: '微温',
    flavor: ['甘', '微苦'],
    channels: ['肺', '脾'],
    category: '补气药',
    effects: [
      { description: '大补元气' },
      { description: '补脾益肺', relatedFormulaId: 'f3' },
      { description: '安神益智' },
    ],
  }
];

export const INITIAL_ACUPOINTS: Acupoint[] = [
  {
    id: 'a1',
    name: '列缺',
    code: 'LU7',
    location: '前臂桡侧缘，桡骨茎突上方，腕横纹上1.5寸，当肱桡肌与拇长展肌腱之间。',
    functions: ['宣肺解表', '通经活络'],
    indications: ['头痛', '咳嗽', '咽喉肿痛', '口眼歪斜'],
    relatedHerbIds: ['h1', 'h2'],
    relatedFormulaIds: ['f1'],
  },
  {
    id: 'a2',
    name: '足三里',
    code: 'ST36',
    location: '小腿外侧，犊鼻下3寸，犊鼻与解溪连线上。',
    functions: ['燥化脾湿', '生发胃气'],
    indications: ['胃痛', '呕吐', '腹胀', '虚劳'],
    relatedHerbIds: ['h3'],
    relatedFormulaIds: ['f3'],
  }
];

export const INITIAL_KNOWLEDGE: KnowledgePoint[] = [
  {
    id: 'k1',
    title: '八纲辨证',
    category: '诊断学',
    difficulty: 'Easy',
    content: '八纲是指阴、阳、表、里、寒、热、虚、实。它是中医辨证的总纲。',
  },
  {
    id: 'k2',
    title: '风寒感冒与风热感冒的区别',
    category: '诊断学',
    difficulty: 'Medium',
    content: '风寒：恶寒重发热轻，无汗，鼻塞流清涕，舌苔薄白，脉浮紧。风热：发热重恶寒轻，有汗，咽喉红肿疼痛，舌苔薄黄，脉浮数。',
  }
];

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 's1',
    title: '脉诊：滑脉',
    category: '脉诊',
    description: '往来流利，如盘走珠。',
    steps: [
      '病人取坐位或正卧位，手臂放平，与心脏近于同一水平。',
      '医生用三指指目按压桡动脉。',
      '指下感觉脉气流畅，圆滑如珠。',
      '临床意义：主痰饮、食积、实热，亦见于青壮年或孕妇。',
    ],
  },
  {
    id: 's2',
    title: '推拿：滚法',
    category: '手法',
    description: '用手背近小指侧部分或小指、无名指、中指的掌指关节背侧附着于一定部位上。',
    steps: [
      '沉肩，垂肘，松腕。',
      '以肘部为支点，前臂作主动摆动。',
      '带动腕关节作伸屈和前臂旋转的复合运动。',
      '频率每分钟120-160次，吸定于操作部位，不可跳动或摩擦。',
    ],
  }
];