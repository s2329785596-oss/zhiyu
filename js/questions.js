// ============================================================
// 知隅 · 千人千面测评系统 v2.0 — 完整版80题数据
// ============================================================
// Segment 1: 快速画像 32题 (id 1-32)
// Segment 2: 深度画像 32题 (id 33-64)
// Segment 3: 聊天式校准 16题 (id 65-80)
// 8维度: ATT/CON/EXP/INT/ASR/EST/EMR/EMP
// ============================================================

// ---------- 开场引导文案 ----------
const ASSESSMENT_INTRO = '这80道题里，每道题都有一个「E选项」。当ABCD都不完全符合你的时候，请一定选E，写下你真正的想法。不用写得很完整，哪怕只是一句话、一个词、一个念头。因为你写的这些，才是真正的你。';

const E_OPTION_DEFAULT_TEXT = '都不完全是，我的真实想法是……';

// E选项维度微提示映射
const E_HINTS = {
  "ATT": "比如你当时心里真正在想什么？",
  "CON": "你当时真正想做的反应是什么？",
  "EXP": "你没说出口的那句话是什么？",
  "INT": "你心里真正舒服的距离是怎样的？",
  "ASR": "你当时犹豫的是什么？",
  "EST": "那一刻你心里对自己说了什么？",
  "EMR": "那种感觉你会怎么形容？",
  "EMP": "你当时最想为对方做的是什么？"
}
;

const DIM_KEYS_V2 = ['ATT','CON','EXP','INT','ASR','EST','EMR','EMP'];
const DIM_NAMES_V2 = {
  ATT:'依恋风格',CON:'冲突应对',EXP:'情感表达',INT:'亲密需求',
  ASR:'主见程度',EST:'自尊水平',EMR:'情绪稳定',EMP:'共情能力'
};
const DIM_LABELS_V2 = {
  ATT:['安全型','焦虑型','回避型','恐惧型'],
  CON:['对抗型','妥协型','回避型','协作型'],
  EXP:['直接开放型','含蓄压抑型'],
  INT:['高需求（黏人）','低需求（独立）'],
  ASR:['强主见（果断）','弱主见（犹豫）'],
  EST:['高自尊','低自尊'],
  EMR:['稳定型','敏感型（高内耗）'],
  EMP:['高共情型','低共情型']
};
const SCORE_KEYS = {
  ATT:['ATT_secure','ATT_anxiety','ATT_avoid','ATT_fearful'],
  CON:['CON_confront','CON_compromise','CON_avoid','CON_collaborate'],
  EXP:['EXP_open','EXP_subtle','EXP_suppress'],
  INT:['INT_high','INT_medium','INT_low'],
  ASR:['ASR_strong','ASR_weak'],
  EST:['EST_high','EST_low'],
  EMR:['EMR_stable','EMR_sensitive'],
  EMP:['EMP_high','EMP_low']
};

// ---------- 第一段：快速画像 32题 ----------
const questions_segment1 = [
  {
    "id": 1,
    "segment": 1,
    "dimension": "ATT",
    "scene": "被冷处理",
    "title": "你和女朋友因为一点小事闹了点不愉快，第二天早上你发现她朋友圈发了一张自拍，配了句\"今天的天气真好☀️\"——但就是不回你昨晚发的消息。你盯着屏幕看了两遍，心想——",
    "options": [
      {
        "key": "A",
        "text": "她是不是在故意气我？是不是想分手了？赶紧又发了条\"在吗？\"",
        "scores": {
          "ATT_anxiety": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "发朋友圈说明心情还行，没什么大事，先忙自己的",
        "scores": {
          "ATT_secure": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "C",
        "text": "她可能需要点时间消化，等中午再发一句\"中午吃什么？\"",
        "scores": {
          "ATT_secure": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "行，你不回那我也不发了，反正我也没什么好说的",
        "scores": {
          "ATT_avoid": 2,
          "EXP_suppress": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "EMR",
      "CON",
      "EXP"
    ]
  },
  {
    "id": 2,
    "segment": 1,
    "dimension": "ATT",
    "scene": "对方晚回消息",
    "title": "周三晚上 11 点，你洗完澡躺在沙发上，给她发了句\"今天那个客户太难搞了，想跟你聊聊\"。显示已读，但过了 40 分钟还没回。你翻了个身，手机屏幕亮了一下又暗了——",
    "options": [
      {
        "key": "A",
        "text": "已读不回……是不想聊还是跟别人聊天呢？把聊天记录翻来覆去看了三遍",
        "scores": {
          "ATT_anxiety": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "可能真的在忙吧。放下手机，打开游戏继续打",
        "scores": {
          "ATT_secure": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "C",
        "text": "有点在意，但克制住不刷手机，去刷了会儿视频分散注意力",
        "scores": {
          "ATT_fearful": 2,
          "EST_low": 1
        }
      },
      {
        "key": "D",
        "text": "算了，本来也不是什么重要的事，不聊就不聊了",
        "scores": {
          "ATT_avoid": 2,
          "INT_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "EMR",
      "EST",
      "INT"
    ]
  },
  {
    "id": 3,
    "segment": 1,
    "dimension": "ATT",
    "scene": "对方说\"需要空间\"",
    "title": "在一起两个月，你感觉越来越上头，恨不得天天黏在一起。但昨晚她突然说：\"我觉得我们节奏有点快，我需要一点自己的空间。\"你心里咯噔一下——",
    "options": [
      {
        "key": "A",
        "text": "完了完了，她是不是不喜欢我了？当天晚上辗转反侧，第二天忍不住又找她",
        "scores": {
          "ATT_anxiety": 2,
          "INT_high": 1
        }
      },
      {
        "key": "B",
        "text": "正常，两个月确实该调调节奏。约好自己的兄弟周末打球",
        "scores": {
          "ATT_secure": 2,
          "INT_low": 1
        }
      },
      {
        "key": "C",
        "text": "有点慌，但没表现出来，跟她说\"好，我也正好这周忙\"",
        "scores": {
          "ATT_fearful": 2,
          "EXP_suppress": 1
        }
      },
      {
        "key": "D",
        "text": "行，那就冷几天吧，反正太黏了也有点累",
        "scores": {
          "ATT_avoid": 2,
          "INT_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "INT",
      "EXP"
    ]
  },
  {
    "id": 4,
    "segment": 1,
    "dimension": "ATT",
    "scene": "吵完架后",
    "title": "昨晚吵得挺凶，她说了一句\"你从来都不理解我\"，你摔门去了客厅沙发睡。第二天早上你在厨房倒水，看到她坐在餐桌前吃早餐，两个人对视了一秒——",
    "options": [
      {
        "key": "A",
        "text": "赶紧凑过去：\"昨天的事是我不对，别生气了好不好？\"",
        "scores": {
          "ATT_anxiety": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "假装没看见，拿了杯水回房间继续躺着",
        "scores": {
          "ATT_avoid": 2,
          "CON_avoid": 1
        }
      },
      {
        "key": "C",
        "text": "默默给她倒了杯牛奶放桌上，然后说：\"晚上想吃啥？我去买\"",
        "scores": {
          "ATT_secure": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "冷着脸说了句\"早\"，然后出门上班",
        "scores": {
          "ATT_avoid": 2,
          "CON_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "EXP",
      "CON",
      "EMP"
    ]
  },
  {
    "id": 5,
    "segment": 1,
    "dimension": "CON",
    "scene": "观点对立",
    "title": "周末你想去吃日料，她说\"日料太贵了不值，吃火锅就行\"。你觉得这不是钱的问题，是你想吃的不一样。服务员在旁边等你们决定——",
    "options": [
      {
        "key": "A",
        "text": "\"日料也没多贵啊，偶尔吃一顿怎么了？就吃日料吧\"",
        "scores": {
          "CON_confront": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "B",
        "text": "\"行吧行吧，火锅就火锅\"",
        "scores": {
          "CON_compromise": 2,
          "ASR_weak": 1
        }
      },
      {
        "key": "C",
        "text": "\"你怎么觉得不值？上次那家 XXX 性价比挺高的，要不换一家试试？\"",
        "scores": {
          "CON_collaborate": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "\"那这周吃火锅，下周吃日料，轮着来？\"",
        "scores": {
          "CON_compromise": 2,
          "ASR_strong": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "ASR",
      "EMP"
    ]
  },
  {
    "id": 6,
    "segment": 1,
    "dimension": "CON",
    "scene": "被误解",
    "title": "你好不容易提前完成项目，跟女朋友分享喜悦。她来了一句：\"哟，这么积极，是不是为了早点下班好去跟谁约会啊？\"你知道她在开玩笑，但那语气让你有点不舒服——",
    "options": [
      {
        "key": "A",
        "text": "\"你能不能别这样？我加了一周班你知道吗？\"",
        "scores": {
          "CON_confront": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "没接话，低头看手机，心里不太舒服但懒得解释",
        "scores": {
          "CON_avoid": 2,
          "EXP_suppress": 1
        }
      },
      {
        "key": "C",
        "text": "笑着说：\"你想多啦，我就是想赶紧忙完周末好好陪你\"",
        "scores": {
          "CON_collaborate": 2,
          "EST_high": 1
        }
      },
      {
        "key": "D",
        "text": "\"你觉得是就是吧\"",
        "scores": {
          "CON_compromise": 2,
          "EST_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "EXP",
      "EST"
    ]
  },
  {
    "id": 7,
    "segment": 1,
    "dimension": "CON",
    "scene": "冷战僵局",
    "title": "你们已经三天没怎么说话了。她不找你，你也没主动。你刷到她的朋友圈，发现她转了一首歌，歌词写着\"等不到的天亮\"。你盯着屏幕看了好一会儿——",
    "options": [
      {
        "key": "A",
        "text": "受不了了，直接去找她把话说清楚：\"你到底想怎么样？\"",
        "scores": {
          "CON_confront": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "继续等，谁先开口谁就输了",
        "scores": {
          "CON_avoid": 2,
          "EST_high": 1
        }
      },
      {
        "key": "C",
        "text": "买了她爱吃的那家草莓蛋糕，放到她桌上，什么都没说",
        "scores": {
          "CON_collaborate": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "反思了一下，好像确实是自己那天话说重了，发了一句\"那天是我不对\"",
        "scores": {
          "CON_compromise": 2,
          "EMP_high": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "ATT",
      "EST",
      "EMP"
    ]
  },
  {
    "id": 8,
    "segment": 1,
    "dimension": "CON",
    "scene": "价值观冲突",
    "title": "在一起半年了，你最近在想辞职创业的事。但她明确说：\"我觉得你现在的工作挺好的，安安稳稳的不行吗？\"你知道她是为你们好，但你心里那团火真的灭不了——",
    "options": [
      {
        "key": "A",
        "text": "\"你不懂，我不想 30 岁了还后悔自己什么都没试过\"",
        "scores": {
          "CON_confront": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "B",
        "text": "没再往下聊，但这事你也没打算放弃",
        "scores": {
          "CON_avoid": 2,
          "EXP_suppress": 1
        }
      },
      {
        "key": "C",
        "text": "\"我理解你的担心，你怕的是万一失败了怎么办对吧？我们可以先聊聊最坏的结果\"",
        "scores": {
          "CON_collaborate": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "\"你说得也有道理，我再想想吧\"",
        "scores": {
          "CON_compromise": 2,
          "ASR_weak": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "ASR",
      "EXP",
      "EMP"
    ]
  },
  {
    "id": 9,
    "segment": 1,
    "dimension": "EXP",
    "scene": "说喜欢",
    "title": "暧昧了一个多月了，每天晚上聊到凌晨，你明显感觉她对你有意思。周五晚上她发了条朋友圈，配了首歌，歌词是\"你好，能不能想见我\"。你知道时机差不多了——",
    "options": [
      {
        "key": "A",
        "text": "约她周六出来，吃饭的时候自然地牵她的手",
        "scores": {
          "EXP_open": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "B",
        "text": "直接发消息：\"我喜欢你，做我女朋友吧\"",
        "scores": {
          "EXP_open": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "C",
        "text": "给她分享一首歌，歌词里有\"我也是\"",
        "scores": {
          "EXP_subtle": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "再等等吧，万一是我多想了呢",
        "scores": {
          "EXP_subtle": 2,
          "ATT_fearful": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "ASR",
      "ATT",
      "EMP"
    ]
  },
  {
    "id": 10,
    "segment": 1,
    "dimension": "EXP",
    "scene": "说对不起",
    "title": "你答应她周末陪她去看她一直想看的那个展，结果你打游戏忘了，周六早上她才打电话问你。你一拍脑门——确实是自己鸽了——",
    "options": [
      {
        "key": "A",
        "text": "马上打电话过去，认认真真道歉，说清楚自己为什么忘了，保证不会有下次",
        "scores": {
          "EXP_open": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "B",
        "text": "下午直接出现在她楼下，带着她最爱的那家奶茶：\"走，现在就去\"",
        "scores": {
          "EXP_open": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "发了一大段消息，从道歉到反思到\"我以后一定设闹钟\"全写了",
        "scores": {
          "EXP_open": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "D",
        "text": "\"我知道错了，但我也不是故意的嘛……\"",
        "scores": {
          "EXP_subtle": 2,
          "CON_compromise": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "EMR",
      "ASR",
      "CON"
    ]
  },
  {
    "id": 11,
    "segment": 1,
    "dimension": "EXP",
    "scene": "说不满",
    "title": "她有个习惯让你很不舒服——每次约好了时间，她都要迟到半小时以上。你今天又在她家楼下等了 35 分钟了，旁边便利店的大爷都认识你了——",
    "options": [
      {
        "key": "A",
        "text": "等她下来直接说：\"你能不能有点时间观念？每次都这样\"",
        "scores": {
          "EXP_open": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "B",
        "text": "见面后阴阳怪气：\"你可算下来了，我差点以为你搬这儿了\"",
        "scores": {
          "EXP_subtle": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "C",
        "text": "忍了，上了车才说\"没事\"，但一整个约会都不太想说话",
        "scores": {
          "EXP_suppress": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "D",
        "text": "上车后很平静地说：\"下次我们约的时间提前半小时？这样你迟到了我也刚到\"",
        "scores": {
          "EXP_open": 2,
          "CON_collaborate": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "CON",
      "EMR"
    ]
  },
  {
    "id": 12,
    "segment": 1,
    "dimension": "EXP",
    "scene": "说\"我需要你\"",
    "title": "连续加班两周，周五晚上你一个人在出租屋里，外卖吃了一半就放下了。手机响了，是她发来的表情包。你盯着天花板躺了五分钟——",
    "options": [
      {
        "key": "A",
        "text": "直接给她打电话：\"今天特别累，你能来陪我待一会儿吗？\"",
        "scores": {
          "EXP_open": 2,
          "INT_high": 1
        }
      },
      {
        "key": "B",
        "text": "什么都不说，但希望她能看出来你状态不对",
        "scores": {
          "EXP_subtle": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "C",
        "text": "回了个表情包，然后继续一个人待着",
        "scores": {
          "EXP_suppress": 2,
          "INT_low": 1
        }
      },
      {
        "key": "D",
        "text": "发了条朋友圈，配了首很丧的歌，设了仅她可见",
        "scores": {
          "EXP_subtle": 2,
          "ATT_fearful": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "INT",
      "ATT"
    ]
  },
  {
    "id": 13,
    "segment": 1,
    "dimension": "INT",
    "scene": "想见面频率",
    "title": "你们刚在一起三周，正是最甜的时候。但你发现一个规律——她几乎每天都想见面，周三晚上也问\"你今晚有空吗\"。你看了看自己的日程——",
    "options": [
      {
        "key": "A",
        "text": "太好了其实我也想天天见！把工作以外的时间全排给她",
        "scores": {
          "INT_high": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "虽然很想，但还是跟她说\"这周咱们周四和周日见？其他时间各自安排\"",
        "scores": {
          "INT_medium": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "C",
        "text": "不用天天见吧，周末整天待在一起就够了",
        "scores": {
          "INT_low": 2,
          "EST_high": 1
        }
      },
      {
        "key": "D",
        "text": "各自忙各自的，想见了自然就见了，不需要排日程",
        "scores": {
          "INT_low": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "ATT",
      "EST"
    ]
  },
  {
    "id": 14,
    "segment": 1,
    "dimension": "INT",
    "scene": "分享隐私意愿",
    "title": "在一起两个月了，聊得越来越好。有天晚上她靠在沙发上，很认真地问你：\"你之前那段感情……是因为什么分手的？\"你知道这个问题迟早会来——",
    "options": [
      {
        "key": "A",
        "text": "全部说出来，前任是谁、怎么认识的、怎么分的全都讲了",
        "scores": {
          "INT_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "大概说了说，但一些太痛的部分，比如她做过的一些事，还是没说",
        "scores": {
          "INT_medium": 2,
          "EXP_subtle": 1
        }
      },
      {
        "key": "C",
        "text": "先问她：\"你呢？你先说我听着\"",
        "scores": {
          "INT_low": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "\"都过去了，不想再提了\"",
        "scores": {
          "INT_low": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "EXP",
      "CON",
      "ATT"
    ]
  },
  {
    "id": 15,
    "segment": 1,
    "dimension": "INT",
    "scene": "独处需求",
    "title": "周六下午，你难得没有安排。你其实想一个人在家打两把游戏、然后去跑个步。但女朋友昨晚说了\"周六我们去看那个新开的商场吧\"——",
    "options": [
      {
        "key": "A",
        "text": "在家打游戏，她想来的话随时欢迎，不想来就各玩各的",
        "scores": {
          "INT_low": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "B",
        "text": "一个人待着有什么意思，当然陪她去逛商场",
        "scores": {
          "INT_high": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "C",
        "text": "上午自己去跑步健身，下午陪她逛商场",
        "scores": {
          "INT_medium": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "D",
        "text": "在沙发上各干各的也挺好的，她刷剧我打游戏，偶尔聊两句",
        "scores": {
          "INT_low": 2,
          "EMR_stable": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "ASR",
      "CON",
      "EMR"
    ]
  },
  {
    "id": 16,
    "segment": 1,
    "dimension": "INT",
    "scene": "朋友与伴侣平衡",
    "title": "周五晚上 7 点，你的好兄弟们攒了半年的局，终于定在今晚聚餐。但女朋友下午说\"今晚心情不好，想让你陪我\"。两边都找你——",
    "options": [
      {
        "key": "A",
        "text": "直接跟兄弟们说今晚去不了，留下来陪女朋友",
        "scores": {
          "INT_high": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "B",
        "text": "跟女朋友商量：\"今晚兄弟有个重要的局，我陪你吃个晚饭再去？\"",
        "scores": {
          "INT_medium": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "C",
        "text": "跟女朋友说\"今晚先自己待一下，明天补上\"，然后去赴兄弟的局",
        "scores": {
          "INT_low": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "D",
        "text": "两边都不放，看能不能协调一下时间——先去聚餐，早点结束再去找她",
        "scores": {
          "INT_medium": 2,
          "ASR_weak": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "CON",
      "ASR"
    ]
  },
  {
    "id": 17,
    "segment": 1,
    "dimension": "ASR",
    "scene": "约会地点选择",
    "title": "你们在一起一个月，每次约会她都问\"你想去哪\"，但其实你也不知道去哪。打开手机地图，商圈那几层你都快逛遍了，她还在等你拿主意——",
    "options": [
      {
        "key": "A",
        "text": "直接定了一家你收藏很久的居酒屋，发定位给她：\"周六晚上 7 点这家\"",
        "scores": {
          "ASR_strong": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "\"随便吧，你说了算\"",
        "scores": {
          "ASR_weak": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "C",
        "text": "找了三个不同类型的——日料、火锅、新开的泰餐，让她挑",
        "scores": {
          "ASR_strong": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "问了一圈朋友的推荐，最后选了一个\"大众点评评分最高\"的",
        "scores": {
          "ASR_weak": 2,
          "EST_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "EXP",
      "CON",
      "EST"
    ]
  },
  {
    "id": 18,
    "segment": 1,
    "dimension": "ASR",
    "scene": "关系节奏把控",
    "title": "暧昧第三周，气氛正好。你们已经牵过手了，她说\"这周末来我家吧，我做饭给你吃\"。你心里其实还没完全准备好——不是不喜欢她，是觉得有点快——",
    "options": [
      {
        "key": "A",
        "text": "按自己的节奏来：\"这周有点忙，下周吧\"",
        "scores": {
          "ASR_strong": 2,
          "ATT_avoid": 1
        }
      },
      {
        "key": "B",
        "text": "直接跟她说：\"我觉得我们进展有点快，能不能慢一点？\"",
        "scores": {
          "ASR_strong": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "C",
        "text": "去吧，都到这步了，不去好像不太好",
        "scores": {
          "ASR_weak": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "D",
        "text": "\"让我想想\"——但其实自己也没想清楚",
        "scores": {
          "ASR_weak": 2,
          "ATT_fearful": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "ATT",
      "EXP",
      "CON"
    ]
  },
  {
    "id": 19,
    "segment": 1,
    "dimension": "ASR",
    "scene": "朋友反对时",
    "title": "你的两个最好的哥们儿私下跟你说：\"哥，你女朋友那个态度不太对啊，上次聚会她全程看手机，感觉不太尊重人。你确定？\"你知道他们说的是事实——",
    "options": [
      {
        "key": "A",
        "text": "认真听他们说完，然后说\"我知道，但我自己想再试试\"",
        "scores": {
          "ASR_strong": 2,
          "EST_high": 1
        }
      },
      {
        "key": "B",
        "text": "当场怼回去：\"你们别管我的事\"",
        "scores": {
          "ASR_strong": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "C",
        "text": "嘴上说\"没事没事\"，但回来以后开始重新审视这段关系",
        "scores": {
          "ASR_weak": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "D",
        "text": "越想越觉得兄弟们说得对，开始跟女朋友保持距离",
        "scores": {
          "ASR_weak": 2,
          "ATT_anxiety": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "EST",
      "CON",
      "EMR",
      "ATT"
    ]
  },
  {
    "id": 20,
    "segment": 1,
    "dimension": "ASR",
    "scene": "重大决定",
    "title": "你拿到了一个外地的好机会——薪资翻倍、岗位更好，但意味着要离开现在这座城市。你女朋友在这里，她明确表示不想异地。HR 给你三天时间答复——",
    "options": [
      {
        "key": "A",
        "text": "接。事业是自己的，感情不能绑住前途",
        "scores": {
          "ASR_strong": 2,
          "INT_low": 1
        }
      },
      {
        "key": "B",
        "text": "不去。她在的地方才是家，工作可以以后再找",
        "scores": {
          "ASR_weak": 2,
          "INT_high": 1
        }
      },
      {
        "key": "C",
        "text": "跟她坐下来谈，看看有没有两个人都能接受的方案",
        "scores": {
          "ASR_strong": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "先答应下来，走一步看一步",
        "scores": {
          "ASR_weak": 2,
          "CON_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "INT",
      "CON"
    ]
  },
  {
    "id": 21,
    "segment": 1,
    "dimension": "EST",
    "scene": "被夸时",
    "title": "女朋友靠在你肩膀上，说了句\"你怎么这么好，做饭好吃人又体贴，我上辈子拯救了银河系吧\"。你心里其实挺开心的——",
    "options": [
      {
        "key": "A",
        "text": "开心，但嘴上说\"哪有啦，一般般吧\"",
        "scores": {
          "EST_low": 2,
          "EXP_subtle": 1
        }
      },
      {
        "key": "B",
        "text": "笑着说\"那是，你运气好\"，心里觉得自己确实值得",
        "scores": {
          "EST_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "C",
        "text": "心里犯嘀咕——她是不是有事求我？",
        "scores": {
          "EST_low": 2,
          "ATT_fearful": 1
        }
      },
      {
        "key": "D",
        "text": "觉得……她夸的跟我认识的不是同一个人吧",
        "scores": {
          "EST_low": 2,
          "EMR_sensitive": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "EXP",
      "ATT",
      "EMR"
    ]
  },
  {
    "id": 22,
    "segment": 1,
    "dimension": "EST",
    "scene": "被批评时",
    "title": "她忽然很认真地说：\"我觉得你不够上进，跟你在一起有点看不到未来。\"你知道她说的是你最近跳槽的事，但那句话扎得很深——",
    "options": [
      {
        "key": "A",
        "text": "沉默了很久，心里反复想\"我是不是真的不行\"",
        "scores": {
          "EST_low": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "有点生气：\"你凭什么这么说我？你知道我做了什么吗？\"",
        "scores": {
          "EST_high": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "C",
        "text": "虽然不舒服，但冷静下来觉得她说得对，认真想想该怎么调整",
        "scores": {
          "EST_high": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "D",
        "text": "\"行，那我去改\"——但心里很委屈",
        "scores": {
          "EST_low": 2,
          "CON_compromise": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "EMR",
      "CON"
    ]
  },
  {
    "id": 23,
    "segment": 1,
    "dimension": "EST",
    "scene": "被比较时",
    "title": "她刷手机的时候随口说了句：\"你看我同事的男朋友，又带她去三亚了，还送了个包……\"你没接话。她看了你一眼：\"你觉得呢？\"——",
    "options": [
      {
        "key": "A",
        "text": "\"那你跟他过去算了\"",
        "scores": {
          "EST_low": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "B",
        "text": "心里不舒服但没说话，默默想着\"我确实不如人家\"",
        "scores": {
          "EST_low": 2,
          "EXP_suppress": 1
        }
      },
      {
        "key": "C",
        "text": "\"你是想让我带你去？那咱们计划一下呗\"",
        "scores": {
          "EST_high": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "\"每个人方式不一样吧，我上周不也给你做了那顿大餐？\"",
        "scores": {
          "EST_high": 2,
          "ASR_strong": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "CON",
      "EXP",
      "ASR"
    ]
  },
  {
    "id": 24,
    "segment": 1,
    "dimension": "EST",
    "scene": "被拒绝时",
    "title": "你跟公司心仪的岗位投了简历，面试也过了终面，但最后被刷了。HR 说\"你很不错，但这次有更合适的人选\"。晚上一个人走在回去的路上——",
    "options": [
      {
        "key": "A",
        "text": "有点失落，但打开招聘软件又投了五家，觉得下一个更好",
        "scores": {
          "EST_high": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "B",
        "text": "躺在床上翻来覆去，想\"是不是我真的不够好\"",
        "scores": {
          "EST_low": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "C",
        "text": "觉得是运气问题，这公司不识货而已",
        "scores": {
          "EST_high": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "D",
        "text": "越想越没劲，觉得自己什么都做不好",
        "scores": {
          "EST_low": 2,
          "EMR_sensitive": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "EMR",
      "CON"
    ]
  },
  {
    "id": 25,
    "segment": 1,
    "dimension": "EMR",
    "scene": "对方冷处理",
    "title": "你发了三条消息给她，从早上等到晚上，她一条都没回。你打开朋友圈，发现她两小时前点赞了一条搞笑视频——",
    "options": [
      {
        "key": "A",
        "text": "每隔五分钟看一次手机，什么都做不进去，脑子里全是\"她到底什么意思\"",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "注意到了，但没往心里去，该干嘛干嘛去了",
        "scores": {
          "EMR_stable": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "C",
        "text": "有点在意，但告诉自己\"可能只是顺手点的\"，然后去找朋友打球",
        "scores": {
          "EMR_stable": 2,
          "EST_high": 1
        }
      },
      {
        "key": "D",
        "text": "直接把手机扔一边，你冷我也冷，看谁先找谁",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "ATT",
      "EST"
    ]
  },
  {
    "id": 26,
    "segment": 1,
    "dimension": "EMR",
    "scene": "吵架后",
    "title": "昨晚你们吵得很大，她说了一些让你很伤心的话。今天早上你请了半天假，一个人在房间里待着——",
    "options": [
      {
        "key": "A",
        "text": "脑子里反复回放她说的每句话，越想越难受，洗澡的时候差点哭出来",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "有点烦，但去健身房撸了一小时铁，出来就好了大半",
        "scores": {
          "EMR_stable": 2,
          "EST_high": 1
        }
      },
      {
        "key": "C",
        "text": "约了朋友出去吃饭，聊了点别的，情绪慢慢回来了",
        "scores": {
          "EMR_stable": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "没什么感觉，吵完就过了，该干嘛干嘛",
        "scores": {
          "EMR_stable": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "ATT",
      "EST",
      "EMP"
    ]
  },
  {
    "id": 27,
    "segment": 1,
    "dimension": "EMR",
    "scene": "被拒绝后",
    "title": "你跟一个女生表白被拒了，她说\"我们还是做朋友吧\"。那是你追了两个月的人。第二天是周六——",
    "options": [
      {
        "key": "A",
        "text": "一觉睡到下午三点，不想见任何人，打开手机又关掉",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "心里不舒服，但约了朋友出去打球，晚上回来已经好多了",
        "scores": {
          "EMR_stable": 2,
          "EST_high": 1
        }
      },
      {
        "key": "C",
        "text": "翻来覆去想\"到底哪里做得不够好\"，一直到凌晨两点才睡着",
        "scores": {
          "EMR_sensitive": 2,
          "EST_low": 1
        }
      },
      {
        "key": "D",
        "text": "无所谓，继续投简历……不是，继续在交友软件上认识新人",
        "scores": {
          "EMR_stable": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "ATT",
      "EST"
    ]
  },
  {
    "id": 28,
    "segment": 1,
    "dimension": "EMR",
    "scene": "压力大时",
    "title": "下周一有一个很重要的述职，做不好可能影响晋升。偏偏这两天跟女朋友又在冷战。周日晚上你一个人坐在书桌前——",
    "options": [
      {
        "key": "A",
        "text": "两件事搅在一起，焦虑得翻来覆去睡不着",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "先把述职的材料整理好，感情的事周一再说",
        "scores": {
          "EMR_stable": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "工作还好，但一想到她的事就莫名烦躁，述职材料看了三遍都没看进去",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "D",
        "text": "勉强在处理事情，但整个人的状态很差，谁说话都听不进去",
        "scores": {
          "EMR_sensitive": 2,
          "EMP_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "ATT",
      "ASR",
      "EMP"
    ]
  },
  {
    "id": 29,
    "segment": 1,
    "dimension": "EMP",
    "scene": "对方哭时",
    "title": "你们在一起后，她第一次在你面前哭了。不是因为你们吵架，是她妈妈生病住院了。她靠在沙发上，眼泪一直流，说不出完整的话——",
    "options": [
      {
        "key": "A",
        "text": "什么都没说，过去把她抱住，让她靠着你哭完",
        "scores": {
          "EMP_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "坐在旁边安静陪着，递纸巾，等她平复了再问\"需要我做什么？\"",
        "scores": {
          "EMP_high": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "C",
        "text": "开始想解决办法——哪个医院好、要不要帮忙挂号、医保怎么弄",
        "scores": {
          "EMP_low": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "D",
        "text": "有点手足无措，不知道说什么，去倒了杯水放在她面前",
        "scores": {
          "EMP_low": 2,
          "EXP_subtle": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "EXP",
      "EMR",
      "ASR"
    ]
  },
  {
    "id": 30,
    "segment": 1,
    "dimension": "EMP",
    "scene": "对方抱怨时",
    "title": "她下班回来，一坐下就开始吐槽：\"我们那个组长真的绝了，又把别人的活甩给我，我都加班三天了！\"她越说越气，筷子拍桌上了——",
    "options": [
      {
        "key": "A",
        "text": "跟着一起骂：\"你们组长也太离谱了吧！这种人不配当领导！\"",
        "scores": {
          "EMP_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "认真听她说完，然后问：\"那你现在最希望怎样？是想骂他还是想解决？\"",
        "scores": {
          "EMP_high": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "C",
        "text": "边听边帮她分析：\"其实你组长可能也觉得你比较好说话……\"",
        "scores": {
          "EMP_low": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "\"嗯嗯\"\"是吗\"\"太惨了\"——然后赶紧夹了个菜给她，\"先吃饭先吃饭\"",
        "scores": {
          "EMP_low": 2,
          "CON_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "EXP",
      "CON"
    ]
  },
  {
    "id": 31,
    "segment": 1,
    "dimension": "EMP",
    "scene": "对方压力大",
    "title": "她最近负责的项目马上要上线了，连续一周加班到 10 点，昨天凌晨两点还在改方案。今天早上她给你发了条消息：\"好累啊，感觉快撑不住了😢\"——",
    "options": [
      {
        "key": "A",
        "text": "偷偷给她点了她最爱吃的那家粥，附了张纸条：\"你最棒了，加油\"",
        "scores": {
          "EMP_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "打了个电话过去：\"你现在需要什么？我帮你理一理进度？\"",
        "scores": {
          "EMP_high": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "\"辛苦了宝贝，早点睡吧，明天会好的\"",
        "scores": {
          "EMP_low": 2,
          "EXP_subtle": 1
        }
      },
      {
        "key": "D",
        "text": "回了个\"抱抱\"的表情包",
        "scores": {
          "EMP_low": 2,
          "EXP_subtle": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "EXP",
      "ASR"
    ]
  },
  {
    "id": 32,
    "segment": 1,
    "dimension": "EMP",
    "scene": "对方心情低落",
    "title": "她最近心情一直不太好，朋友圈也不怎么发了。你问她怎么了，她说\"没什么，就是不太想说话\"。你们坐在一起看电视，她全程盯着屏幕但明显没在看——",
    "options": [
      {
        "key": "A",
        "text": "\"走，出去兜兜风，换个心情\"",
        "scores": {
          "EMP_high": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "B",
        "text": "什么都不问，默默把电视音量调小，靠着她坐着",
        "scores": {
          "EMP_high": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "C",
        "text": "讲笑话、分享好玩的短视频，努力让她笑出来",
        "scores": {
          "EMP_low": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "D",
        "text": "有点不知道该怎么办，心想\"算了，她想说的时候自然会说\"",
        "scores": {
          "EMP_low": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "ASR",
      "EMR",
      "EXP",
      "ATT"
    ]
  }
];

// ---------- 第二段：深度画像 32题 ----------
const questions_segment2 = [
  {
    "id": 33,
    "segment": 2,
    "dimension": "ATT",
    "scene": "冷处理时内心恐惧",
    "title": "你已经给她发了两条消息，她一直没回。你打开她社交账号，发现她半小时前给闺蜜的朋友圈点了赞。你坐在工位上，手指悬在屏幕上方——",
    "options": [
      {
        "key": "A",
        "text": "心里涌上一股恐惧感——\"她是不是真的不喜欢我了？我是不是做错了什么？\"",
        "scores": {
          "ATT_anxiety": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "有点烦，但很快告诉自己\"不回就不回呗，我又不缺人聊\"",
        "scores": {
          "ATT_avoid": 2,
          "EST_high": 1
        }
      },
      {
        "key": "C",
        "text": "脑子里反复过最近的聊天，逐字逐句检查自己是不是说错了话",
        "scores": {
          "ATT_fearful": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "D",
        "text": "觉得她可能就是在忙，先把手头的事做完再说",
        "scores": {
          "ATT_secure": 2,
          "EMR_stable": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "EMR",
      "EST"
    ]
  },
  {
    "id": 34,
    "segment": 2,
    "dimension": "ATT",
    "scene": "异性朋友背后的念头",
    "title": "她有个从小一起长大的男闺蜜，周末经常约着打球。她跟你说\"他就是我哥们儿，你想多了\"。你嘴上说\"我知道\"，但心里——",
    "options": [
      {
        "key": "A",
        "text": "其实很在意，总忍不住想\"他们真的只是朋友吗？\"",
        "scores": {
          "ATT_anxiety": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "觉得没必要管太多，她有她的社交圈很正常",
        "scores": {
          "ATT_secure": 2,
          "INT_low": 1
        }
      },
      {
        "key": "C",
        "text": "表面不说，但会默默观察她对那个人的态度有没有不一样",
        "scores": {
          "ATT_fearful": 2,
          "EST_low": 1
        }
      },
      {
        "key": "D",
        "text": "心里有点酸，但不想表现得太小气，选择压下去",
        "scores": {
          "ATT_anxiety": 2,
          "EXP_suppress": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "EMR",
      "EST",
      "EXP",
      "INT"
    ]
  },
  {
    "id": 35,
    "segment": 2,
    "dimension": "ATT",
    "scene": "异地时的安全感",
    "title": "你们因为工作要异地三个月。她走了第一个星期，你一个人在家里，阳台上她晾的毛巾还没收。晚上你打开微信——",
    "options": [
      {
        "key": "A",
        "text": "盯着她的头像发呆，想发消息又怕打扰她，纠结了半天最后发了句\"今天冷，多穿点\"",
        "scores": {
          "ATT_anxiety": 2,
          "INT_high": 1
        }
      },
      {
        "key": "B",
        "text": "该干嘛干嘛，晚上打个视频挺好的，异地反而有点自由",
        "scores": {
          "ATT_secure": 2,
          "INT_low": 1
        }
      },
      {
        "key": "C",
        "text": "心里空落落的，但告诉自己\"异地又不是分手，别矫情了\"",
        "scores": {
          "ATT_fearful": 2,
          "EXP_suppress": 1
        }
      },
      {
        "key": "D",
        "text": "感觉松了一口气，终于不用每天报备了",
        "scores": {
          "ATT_avoid": 2,
          "INT_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "INT",
      "EXP"
    ]
  },
  {
    "id": 36,
    "segment": 2,
    "dimension": "ATT",
    "scene": "她说\"我爱你\"之后",
    "title": "纪念日那天吃饭，烛光摇曳，她忽然放下筷子，认真看着你说\"我爱你\"。你心里很清楚她也爱你，但听到这句话的瞬间——",
    "options": [
      {
        "key": "A",
        "text": "很感动，但紧接着闪过一个念头——\"我能做到吗？万一我做不到呢？\"",
        "scores": {
          "ATT_fearful": 2,
          "EST_low": 1
        }
      },
      {
        "key": "B",
        "text": "自然地回应\"我也爱你\"，心里觉得很踏实",
        "scores": {
          "ATT_secure": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "C",
        "text": "笑了笑，没接话，拿起杯子喝了口水——不是不爱，是不知道怎么说出口",
        "scores": {
          "ATT_avoid": 2,
          "EXP_suppress": 1
        }
      },
      {
        "key": "D",
        "text": "有点不自在，赶紧说\"快吃快吃，菜凉了\"",
        "scores": {
          "ATT_avoid": 2,
          "EXP_suppress": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "比如你当时心里真正在想什么？"
    },
    "primary_dim": "ATT",
    "secondary_dim": [
      "EST",
      "EXP"
    ]
  },
  {
    "id": 37,
    "segment": 2,
    "dimension": "CON",
    "scene": "被误解时最痛的是什么",
    "title": "你辛辛苦苦加班到半夜赶出来的方案，她看了说\"你这不就是复制粘贴的吗，有什么难的\"。你知道她在开玩笑，但那句话扎得比想象中深——",
    "options": [
      {
        "key": "A",
        "text": "最痛的不是那句话本身，而是\"她根本不知道我做了什么\"的那种不被看见",
        "scores": {
          "CON_collaborate": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "B",
        "text": "最痛的是\"为什么每次都是我在解释\"的那种疲惫",
        "scores": {
          "CON_avoid": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "C",
        "text": "其实没什么痛不痛的，解释清楚就行了",
        "scores": {
          "CON_avoid": 2,
          "ATT_avoid": 1
        }
      },
      {
        "key": "D",
        "text": "最痛的是自己好像确实没能让她满意的那种挫败感",
        "scores": {
          "CON_compromise": 2,
          "EST_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "EMP",
      "EMR",
      "ATT",
      "EST"
    ]
  },
  {
    "id": 38,
    "segment": 2,
    "dimension": "CON",
    "scene": "被甩锅时的本能反应",
    "title": "你们共同负责的事情搞砸了，她当着朋友的面说\"都是他出的主意，我当时就觉得不太对\"。所有人都看向你——",
    "options": [
      {
        "key": "A",
        "text": "当场反驳：\"这话可不对吧，当时你不也同意了吗？\"",
        "scores": {
          "CON_confront": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "没吭声，笑了笑岔开话题，回去以后再跟她说",
        "scores": {
          "CON_avoid": 2,
          "EST_low": 1
        }
      },
      {
        "key": "C",
        "text": "平静地说：\"这个问题咱们私下聊，现在不是说这个的时候\"",
        "scores": {
          "CON_collaborate": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "D",
        "text": "嘴上说\"算了算了\"，但心里已经给她减了很多分",
        "scores": {
          "CON_compromise": 2,
          "EST_low": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "EXP",
      "EST",
      "ASR"
    ]
  },
  {
    "id": 39,
    "segment": 2,
    "dimension": "CON",
    "scene": "冷战时心里在想什么",
    "title": "你们已经互相不理了两天。你躺在床上，手机放在枕边，屏幕时不时亮一下——",
    "options": [
      {
        "key": "A",
        "text": "心里反复想\"这次到底谁对谁错\"，想到半夜也没想出个结论",
        "scores": {
          "CON_collaborate": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "在想\"要是我先低头了，以后她会不会越来越过分\"",
        "scores": {
          "CON_confront": 2,
          "EST_high": 1
        }
      },
      {
        "key": "C",
        "text": "在想\"算了，反正吵来吵去也没用，还不如各过各的\"",
        "scores": {
          "CON_avoid": 2,
          "ATT_avoid": 1
        }
      },
      {
        "key": "D",
        "text": "在想\"她是不是也在等我消息\"，最后发了句\"别生气了\"",
        "scores": {
          "CON_compromise": 2,
          "EMP_high": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "EMR",
      "EST",
      "ATT",
      "EMP"
    ]
  },
  {
    "id": 40,
    "segment": 2,
    "dimension": "CON",
    "scene": "父母反对时的选择",
    "title": "她来你家吃饭，饭后你妈私下拉你说\"这姑娘不太合适，你看看你表姐那个对象……\"你知道你妈说的条件你都有，但她就是不喜欢——",
    "options": [
      {
        "key": "A",
        "text": "直接跟妈说\"我喜欢她，你们的事你们管，我的事我自己做主\"",
        "scores": {
          "CON_confront": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "B",
        "text": "不跟妈正面刚，但也不改变自己的选择，该怎样怎样",
        "scores": {
          "CON_avoid": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "认真跟妈聊，问她具体觉得哪里不合适，看看有没有道理",
        "scores": {
          "CON_collaborate": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "开始犹豫——毕竟妈看人比自己准，万一她说的对呢",
        "scores": {
          "CON_compromise": 2,
          "ASR_weak": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时真正想做的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": [
      "ASR",
      "EMP"
    ]
  },
  {
    "id": 41,
    "segment": 2,
    "dimension": "EXP",
    "scene": "说喜欢之后怕什么",
    "title": "你终于跟她表白了，她说\"我也是\"。那天晚上你躺在床上，天花板上的灯关了，窗帘缝里透进一点光——",
    "options": [
      {
        "key": "A",
        "text": "心里突然很慌——\"在一起以后，我是不是就不能做自己了？\"",
        "scores": {
          "EXP_subtle": 2,
          "ATT_fearful": 1
        }
      },
      {
        "key": "B",
        "text": "觉得踏实，心里想的是\"终于可以光明正大对她好了\"",
        "scores": {
          "EXP_open": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "C",
        "text": "有点不真实感，反复想\"真的假的？她真的也喜欢我？\"",
        "scores": {
          "EXP_subtle": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "D",
        "text": "什么也没想，翻了个身就睡着了",
        "scores": {
          "EXP_open": 2,
          "EMR_stable": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "ATT",
      "EMR"
    ]
  },
  {
    "id": 42,
    "segment": 2,
    "dimension": "EXP",
    "scene": "道歉时卡住的是什么",
    "title": "你跟朋友约好的饭局迟到了一个小时，因为送她回家耽误了。朋友开玩笑说\"重色轻友\"，你该道歉——",
    "options": [
      {
        "key": "A",
        "text": "大大方方说\"是是是，我错了，下次请你们吃顿好的\"",
        "scores": {
          "EXP_open": 2,
          "EST_high": 1
        }
      },
      {
        "key": "B",
        "text": "嘴上在道歉，心里其实在想\"我送女朋友回家有错吗\"",
        "scores": {
          "EXP_subtle": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "C",
        "text": "笑着说\"没办法，谁让我摊上这事了\"——语气有点自嘲",
        "scores": {
          "EXP_subtle": 2,
          "EST_low": 1
        }
      },
      {
        "key": "D",
        "text": "不好意思开口，默默多喝了两杯酒算赔罪",
        "scores": {
          "EXP_suppress": 2,
          "EXP_subtle": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "EST",
      "CON"
    ]
  },
  {
    "id": 43,
    "segment": 2,
    "dimension": "EXP",
    "scene": "表达感谢的方式",
    "title": "她在你加班最忙的那周，每天给你送饭。周五晚上你终于忙完了，想跟她说声谢谢——",
    "options": [
      {
        "key": "A",
        "text": "直接说\"谢谢你这段时间，真的辛苦你了\"，然后给她一个拥抱",
        "scores": {
          "EXP_open": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "B",
        "text": "没说谢，但周末偷偷给她买了她念叨很久的那个包",
        "scores": {
          "EXP_subtle": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "发了条很长的消息，从感谢到感慨到\"我真的很幸运\"",
        "scores": {
          "EXP_open": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "D",
        "text": "心里很感激，但嘴上说不出来，做了顿好吃的就当表了态",
        "scores": {
          "EXP_suppress": 2,
          "EMP_high": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "EMP",
      "ASR",
      "EMR"
    ]
  },
  {
    "id": 44,
    "segment": 2,
    "dimension": "EXP",
    "scene": "说出恐惧的那一刻",
    "title": "最近公司裁员的风声越来越大，你晚上翻来覆去睡不着。她醒了问你怎么了——",
    "options": [
      {
        "key": "A",
        "text": "直接说了：\"我怕被裁，万一失业了怎么办\"",
        "scores": {
          "EXP_open": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "B",
        "text": "\"没什么，就是有点睡不着\"——不想让她跟着担心",
        "scores": {
          "EXP_suppress": 2,
          "INT_low": 1
        }
      },
      {
        "key": "C",
        "text": "说了工作的事，但只说了个大概，最深的恐惧没讲",
        "scores": {
          "EXP_subtle": 2,
          "ATT_fearful": 1
        }
      },
      {
        "key": "D",
        "text": "叹了口气说\"没事\"，翻了个身假装睡了",
        "scores": {
          "EXP_suppress": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": [
      "ATT",
      "INT"
    ]
  },
  {
    "id": 45,
    "segment": 2,
    "dimension": "INT",
    "scene": "天天见面背后的真实想法",
    "title": "在一起两个月，她基本每天下班都想来找你。你觉得频率有点高了——",
    "options": [
      {
        "key": "A",
        "text": "其实自己也想要天天见，只是担心她觉得你太黏人",
        "scores": {
          "INT_high": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "想见但也需要自己的空间，觉得一周见三四次比较舒服",
        "scores": {
          "INT_medium": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "C",
        "text": "说实话有点窒息，但又怕拒绝了显得不在乎她",
        "scores": {
          "INT_low": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "D",
        "text": "觉得没必要天天见，一个月见几次就够了，各自有各自的生活",
        "scores": {
          "INT_low": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "ATT",
      "CON"
    ]
  },
  {
    "id": 46,
    "segment": 2,
    "dimension": "INT",
    "scene": "她要求你多分享时",
    "title": "在一起三个月了，她有一次很认真地说：\"你好像从来不跟我说你心里在想什么，我觉得离你很远。\"——",
    "options": [
      {
        "key": "A",
        "text": "心里一紧——其实不是不想说，是不知道怎么说，怕说了反而把事情搞复杂",
        "scores": {
          "INT_low": 2,
          "EXP_suppress": 1
        }
      },
      {
        "key": "B",
        "text": "认真想了想，觉得她说得对，以后试着多说说",
        "scores": {
          "INT_medium": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "C",
        "text": "有点烦——\"我在身边陪着不就是分享了吗，一定要说出来吗？\"",
        "scores": {
          "INT_low": 2,
          "ATT_avoid": 1
        }
      },
      {
        "key": "D",
        "text": "说\"我其实想的挺多的\"，但之后还是没什么变化",
        "scores": {
          "INT_low": 2,
          "CON_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "EXP",
      "ATT",
      "CON"
    ]
  },
  {
    "id": 47,
    "segment": 2,
    "dimension": "INT",
    "scene": "聊到未来时的内心活动",
    "title": "你们在一起半年了。某天晚上看剧的时候，她突然说\"你觉得我们以后会在哪个城市定居？\"——",
    "options": [
      {
        "key": "A",
        "text": "很开心她也在想这些，聊了很多关于未来的想法",
        "scores": {
          "INT_high": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "B",
        "text": "有点慌——觉得自己还没准备好想这么远",
        "scores": {
          "INT_low": 2,
          "ATT_fearful": 1
        }
      },
      {
        "key": "C",
        "text": "随口说了个模棱两可的答案，然后赶紧岔开话题",
        "scores": {
          "INT_low": 2,
          "ATT_avoid": 1
        }
      },
      {
        "key": "D",
        "text": "认真想了下说\"现在说这个还太早了吧\"",
        "scores": {
          "INT_low": 2,
          "ASR_strong": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "ATT",
      "ASR"
    ]
  },
  {
    "id": 48,
    "segment": 2,
    "dimension": "INT",
    "scene": "长期承诺的真实态度",
    "title": "在一起一年了。她问你\"你有想过结婚吗？\"不是逼你，就是很自然地聊到了——",
    "options": [
      {
        "key": "A",
        "text": "想过，而且挺期待的——\"跟你在一起越久越觉得，可以\"",
        "scores": {
          "INT_high": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "B",
        "text": "没认真想过，觉得结婚这事不用急，顺其自然",
        "scores": {
          "INT_medium": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "C",
        "text": "想过，但心里有个声音说\"万一以后变了呢\"",
        "scores": {
          "INT_low": 2,
          "ATT_fearful": 1
        }
      },
      {
        "key": "D",
        "text": "\"结婚？还没到那一步吧\"——不是不想，是觉得太远了",
        "scores": {
          "INT_low": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里真正舒服的距离是怎样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": [
      "ATT"
    ]
  },
  {
    "id": 49,
    "segment": 2,
    "dimension": "ASR",
    "scene": "日常小事上的犹豫",
    "title": "周末中午，她问\"今天吃外卖还是出去吃？\"这么简单的问题，你——",
    "options": [
      {
        "key": "A",
        "text": "直接说\"出去吃吧，我想吃那家牛肉面\"",
        "scores": {
          "ASR_strong": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "纠结了半天——外卖省事但出去吃氛围好，最后说了句\"都行\"",
        "scores": {
          "ASR_weak": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "C",
        "text": "想了想说\"你决定吧，我跟着你\"",
        "scores": {
          "ASR_weak": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "D",
        "text": "说了个\"随便\"，但心里其实有点想吃某个东西",
        "scores": {
          "ASR_weak": 2,
          "EXP_suppress": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "EXP",
      "EMR",
      "CON"
    ]
  },
  {
    "id": 50,
    "segment": 2,
    "dimension": "ASR",
    "scene": "她影响你的决定时",
    "title": "你本来打算跳槽去一家创业公司，offer 都拿到了。她得知以后说\"创业公司风险太大了，现在这个不是挺稳定的吗\"——",
    "options": [
      {
        "key": "A",
        "text": "重新审视了一下，觉得她说得有道理，放弃了那个 offer",
        "scores": {
          "ASR_weak": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "B",
        "text": "认真跟她聊了为什么想去，聊完还是按自己的想法走",
        "scores": {
          "ASR_strong": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "C",
        "text": "嘴上说\"我考虑考虑\"，其实已经决定去了，只是不想跟她吵",
        "scores": {
          "ASR_strong": 2,
          "EXP_subtle": 1
        }
      },
      {
        "key": "D",
        "text": "开始纠结——她说的也不是没道理，万一创业公司倒了怎么办",
        "scores": {
          "ASR_weak": 2,
          "EMR_sensitive": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "CON",
      "EXP",
      "EMR"
    ]
  },
  {
    "id": 51,
    "segment": 2,
    "dimension": "ASR",
    "scene": "她犹豫时你推不推",
    "title": "你们在商量国庆要不要一起出去旅行。她想去云南但又怕人多，想去三亚又觉得贵。你们已经讨论了一周还没定——",
    "options": [
      {
        "key": "A",
        "text": "做了个决定：\"去大理吧，我去订机票酒店，你不用管了\"",
        "scores": {
          "ASR_strong": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "B",
        "text": "继续陪她纠结——\"要不大理？要不三亚？再看看呗\"",
        "scores": {
          "ASR_weak": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "C",
        "text": "列了两个方案的优缺点发给她，让她最后拍板",
        "scores": {
          "ASR_strong": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "\"那要不去年再去？今年确实不太好选\"——拖着",
        "scores": {
          "ASR_weak": 2,
          "CON_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "CON"
    ]
  },
  {
    "id": 52,
    "segment": 2,
    "dimension": "ASR",
    "scene": "吵架后的决策",
    "title": "你们因为一件事吵得不可开交。她说\"你变了\"，你说\"你也是\"。吵完冷静下来——",
    "options": [
      {
        "key": "A",
        "text": "觉得自己没错，但主动去缓和关系——\"我刚才语气不好，但事情本身的观点我没变\"",
        "scores": {
          "ASR_strong": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "B",
        "text": "反思了很久，觉得可能是自己确实有问题，决定改",
        "scores": {
          "ASR_weak": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "C",
        "text": "觉得自己没错，等她自己消气",
        "scores": {
          "ASR_strong": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "D",
        "text": "不知道到底谁对谁错，脑子里一团浆糊",
        "scores": {
          "ASR_weak": 2,
          "EMR_sensitive": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时犹豫的是什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": [
      "CON",
      "EMR"
    ]
  },
  {
    "id": 53,
    "segment": 2,
    "dimension": "EST",
    "scene": "被夸时内心的真实对话",
    "title": "她跟朋友吃饭回来，很开心地跟你说\"我朋友都说我男朋友特别好，特别羡慕我\"。你——",
    "options": [
      {
        "key": "A",
        "text": "心里暖了一下，觉得\"嗯，我确实对她挺好的\"",
        "scores": {
          "EST_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "有点不好意思——\"她朋友又不了解我，只看到了表面\"",
        "scores": {
          "EST_low": 2,
          "EXP_subtle": 1
        }
      },
      {
        "key": "C",
        "text": "有点心虚——\"万一哪天做得不好了，她会不会很失望？\"",
        "scores": {
          "EST_low": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "D",
        "text": "觉得挺好的，但没表现出来，说了句\"那当然\"就过去了",
        "scores": {
          "EST_high": 2,
          "EXP_subtle": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "EXP",
      "ATT"
    ]
  },
  {
    "id": 54,
    "segment": 2,
    "dimension": "EST",
    "scene": "她条件比你好的时候",
    "title": "你们在一起半年了。她工作比你好，收入比你高，朋友圈里都是你够不着的圈子。某天她同事聚会你陪同出席——",
    "options": [
      {
        "key": "A",
        "text": "有点不自在，觉得自己像个配角，话比平时少了很多",
        "scores": {
          "EST_low": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "没什么感觉，她的优秀是她的，你有自己的节奏",
        "scores": {
          "EST_high": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "C",
        "text": "暗暗较劲，想着要更努力，不能被她甩太远",
        "scores": {
          "EST_high": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "D",
        "text": "坦然面对，偶尔自嘲一下\"我这是找了个大佬\"",
        "scores": {
          "EST_high": 2,
          "EXP_open": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "EMR",
      "ASR",
      "EXP"
    ]
  },
  {
    "id": 55,
    "segment": 2,
    "dimension": "EST",
    "scene": "被分手威胁时",
    "title": "她生气的时候说了句\"大不了分手算了\"。你知道她是气话，但那三个字像刀一样——",
    "options": [
      {
        "key": "A",
        "text": "心里一沉，第一反应是\"我是不是真的配不上她\"",
        "scores": {
          "EST_low": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "冷静地说\"你冷静一下，这种话别随便说\"",
        "scores": {
          "EST_high": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "也很生气：\"你每次吵完都说这话，有意思吗？\"",
        "scores": {
          "EST_low": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "D",
        "text": "什么都没说，但那个晚上一直在想\"如果她真的走了怎么办\"",
        "scores": {
          "EST_low": 2,
          "ATT_fearful": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "ATT",
      "CON",
      "ASR"
    ]
  },
  {
    "id": 56,
    "segment": 2,
    "dimension": "EST",
    "scene": "被误解时的自我评价",
    "title": "你送了她一份很用心准备的礼物，她收到以后说了句\"就这？\"。你当时笑了一下，但那天晚上躺在床上——",
    "options": [
      {
        "key": "A",
        "text": "反复想\"是不是我真的不够好？她想要的也许根本不是这个\"",
        "scores": {
          "EST_low": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "觉得无所谓——\"她开玩笑而已，我了解她就够了\"",
        "scores": {
          "EST_high": 2,
          "EMR_stable": 1
        }
      },
      {
        "key": "C",
        "text": "有点生气——\"她怎么不看看我的心意呢\"",
        "scores": {
          "EST_high": 2,
          "CON_confront": 1
        }
      },
      {
        "key": "D",
        "text": "告诉自己\"下次别花那么多心思了，免得失望\"",
        "scores": {
          "EST_low": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那一刻你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": [
      "EMR",
      "CON",
      "ATT"
    ]
  },
  {
    "id": 57,
    "segment": 2,
    "dimension": "EMR",
    "scene": "冷处理时的连锁反应",
    "title": "她一整天没回你消息。你不是那种容易焦虑的人，但今天有点不一样——",
    "options": [
      {
        "key": "A",
        "text": "先是焦虑，然后生气，然后又开始反省自己，情绪像坐过山车",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "注意到了，但很快就回到自己的节奏——该工作工作，该吃饭吃饭",
        "scores": {
          "EMR_stable": 2,
          "ATT_secure": 1
        }
      },
      {
        "key": "C",
        "text": "告诉自己别在意，但每隔一阵还是忍不住看一眼手机",
        "scores": {
          "EMR_sensitive": 2,
          "EST_low": 1
        }
      },
      {
        "key": "D",
        "text": "有点烦，但不想表现出来，去健身房跑了五公里回来就好了",
        "scores": {
          "EMR_stable": 2,
          "ASR_strong": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "ATT",
      "EST",
      "ASR"
    ]
  },
  {
    "id": 58,
    "segment": 2,
    "dimension": "EMR",
    "scene": "吵完架后一个人的深夜",
    "title": "吵完架她回了娘家。你一个人在家，洗完澡坐在沙发上，家里突然很安静——",
    "options": [
      {
        "key": "A",
        "text": "脑子停不下来，反复回放吵架的每一个细节，越想越睡不着",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "有点难受，但洗了个热水澡、看了会儿书，十一点就睡了",
        "scores": {
          "EMR_stable": 2,
          "EST_high": 1
        }
      },
      {
        "key": "C",
        "text": "给朋友打了个电话聊了半小时，情绪慢慢平复了",
        "scores": {
          "EMR_stable": 2,
          "EMP_high": 1
        }
      },
      {
        "key": "D",
        "text": "没什么特别的感觉，打开游戏打了一局就睡了",
        "scores": {
          "EMR_stable": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "ATT",
      "EST",
      "EMP"
    ]
  },
  {
    "id": 59,
    "segment": 2,
    "dimension": "EMR",
    "scene": "焦虑的真正源头",
    "title": "最近你总觉得有点焦虑，说不上来为什么。晚上躺在床上认真想了一下——",
    "options": [
      {
        "key": "A",
        "text": "主要是怕她不够爱我——如果她真的爱我，为什么最近都不怎么找我？",
        "scores": {
          "EMR_sensitive": 2,
          "ATT_anxiety": 1
        }
      },
      {
        "key": "B",
        "text": "主要是工作上的事——下个月有个考核，还没准备好",
        "scores": {
          "EMR_stable": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "其实是很多事搅在一起——工作、感情、家里，哪个都没处理好",
        "scores": {
          "EMR_sensitive": 2,
          "INT_high": 1
        }
      },
      {
        "key": "D",
        "text": "其实也没什么好焦虑的，可能就是最近没睡好",
        "scores": {
          "EMR_stable": 2,
          "ATT_secure": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "ATT",
      "ASR",
      "INT"
    ]
  },
  {
    "id": 60,
    "segment": 2,
    "dimension": "EMR",
    "scene": "她否定你时的恢复速度",
    "title": "她说\"我觉得你跟以前不一样了，你是不是不在乎我了\"。你知道自己不是不在乎，但这句话让你很沮丧——",
    "options": [
      {
        "key": "A",
        "text": "整整两天都缓不过来，做什么都提不起劲，脑子里全是那句话",
        "scores": {
          "EMR_sensitive": 2,
          "EST_low": 1
        }
      },
      {
        "key": "B",
        "text": "当天有点烦，但第二天跟朋友吃了顿火锅就缓过来了",
        "scores": {
          "EMR_stable": 2,
          "EST_high": 1
        }
      },
      {
        "key": "C",
        "text": "认真跟她聊了自己的想法，聊完就放下了",
        "scores": {
          "EMR_stable": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "没什么感觉，她说什么就是什么吧",
        "scores": {
          "EMR_stable": 2,
          "ATT_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种感觉你会怎么形容？"
    },
    "primary_dim": "EMR",
    "secondary_dim": [
      "EST",
      "CON",
      "ATT"
    ]
  },
  {
    "id": 61,
    "segment": 2,
    "dimension": "EMP",
    "scene": "她哭的时候你第一反应是什么",
    "title": "她妈妈身体出了问题，她在医院走廊里哭得说不出话。你站在旁边——",
    "options": [
      {
        "key": "A",
        "text": "心里也跟着难受得不行，眼泪差点也掉下来",
        "scores": {
          "EMP_high": 2,
          "EMR_sensitive": 1
        }
      },
      {
        "key": "B",
        "text": "抱紧她，心里在想要怎么帮她度过这一关",
        "scores": {
          "EMP_high": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "C",
        "text": "开始想下一步该做什么——找医生、查资料、问保险",
        "scores": {
          "EMP_low": 2,
          "ASR_strong": 1
        }
      },
      {
        "key": "D",
        "text": "有点不知道该怎么办，但知道陪着就好",
        "scores": {
          "EMP_low": 2,
          "EXP_subtle": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "EMR",
      "ASR",
      "EXP"
    ]
  },
  {
    "id": 62,
    "segment": 2,
    "dimension": "EMP",
    "scene": "她反复抱怨同一件事",
    "title": "她第三次跟你吐槽同一个同事了。上次你也听了，上上次你也听了——",
    "options": [
      {
        "key": "A",
        "text": "虽然有点烦，但还是认真听——她愿意跟你说是信任你",
        "scores": {
          "EMP_high": 2,
          "CON_compromise": 1
        }
      },
      {
        "key": "B",
        "text": "直接说\"你上次也说了，要不你试试直接跟她谈？\"",
        "scores": {
          "EMP_low": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "C",
        "text": "认真听，但心里在想\"她是不是只是想找个人说，不一定要解决\"",
        "scores": {
          "EMP_high": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "\"嗯嗯\"应付着，同时在想自己的事",
        "scores": {
          "EMP_low": 2,
          "CON_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "CON"
    ]
  },
  {
    "id": 63,
    "segment": 2,
    "dimension": "EMP",
    "scene": "她开心时的真实反应",
    "title": "她中了公司的年会大奖，兴高采烈地打电话给你——\"我中了一等奖！五千块！\"——",
    "options": [
      {
        "key": "A",
        "text": "替她高兴得不行，比自己中了还开心",
        "scores": {
          "EMP_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "说了句\"恭喜\"，但心里觉得也就那样吧",
        "scores": {
          "EMP_low": 2,
          "ATT_avoid": 1
        }
      },
      {
        "key": "C",
        "text": "替她开心，但也忍不住想\"这钱够干嘛的\"",
        "scores": {
          "EMP_low": 2,
          "EST_high": 1
        }
      },
      {
        "key": "D",
        "text": "笑着说\"不错啊\"，然后问\"你打算怎么花？\"",
        "scores": {
          "EMP_high": 2,
          "CON_collaborate": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "EXP",
      "ATT",
      "EST",
      "CON"
    ]
  },
  {
    "id": 64,
    "segment": 2,
    "dimension": "EMP",
    "scene": "她跟朋友吵架后",
    "title": "她最好的闺蜜跟她闹翻了，她在你面前一边说一边哭：\"我把她当最好的朋友，她居然这么对我……\"——",
    "options": [
      {
        "key": "A",
        "text": "特别心疼，觉得她的难过就是你的难过，陪着她一直到她平静",
        "scores": {
          "EMP_high": 2,
          "EXP_open": 1
        }
      },
      {
        "key": "B",
        "text": "安静听她说，等她哭完了再问\"你们是因为什么走到这一步的？\"",
        "scores": {
          "EMP_high": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "C",
        "text": "帮她分析：\"你有没有想过，可能她也有她的苦衷？\"",
        "scores": {
          "EMP_low": 2,
          "CON_collaborate": 1
        }
      },
      {
        "key": "D",
        "text": "\"别难过了，为不值得的人哭不划算\"",
        "scores": {
          "EMP_low": 2,
          "CON_avoid": 1
        }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为对方做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": [
      "EXP",
      "CON"
    ]
  }
];

// ---------- 第三段：聊天式校准16题（选项+聊天式） ----------
const questions_segment3 = [
  {
    "id": 65,
    "segment": 3,
    "dimension": "ATT",
    "scene": "突然觉得孤单的瞬间",
    "title": "有没有那种时刻——对方明明在，你却突然觉得很孤单？比如在一起看电影，她靠在你肩上，你心里却空落落的——",
    "options": [
      {
        "key": "A",
        "text": "经常有，尤其是她不回应我的时候，那种孤单感特别强烈",
        "scores": { "ATT_anxiety": 2, "EMR_sensitive": 1 }
      },
      {
        "key": "B",
        "text": "很少，她在的时候我基本都挺安心的",
        "scores": { "ATT_secure": 2, "EMR_stable": 1 }
      },
      {
        "key": "C",
        "text": "有时候有，但说不清是因为什么，可能是我自己需要空间",
        "scores": { "ATT_avoid": 2, "INT_low": 1 }
      },
      {
        "key": "D",
        "text": "有时候想靠近有时候又想逃，自己也搞不定",
        "scores": { "ATT_fearful": 2, "EST_low": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那种孤单感具体是什么味道？"
    },
    "primary_dim": "ATT",
    "secondary_dim": ["EMR", "INT"]
  },
  {
    "id": 66,
    "segment": 3,
    "dimension": "ATT",
    "scene": "什么让你最心安",
    "title": "在一段感情里，最让你觉得心安的是什么？不是'应该有'的，是你真正感受到的那个——",
    "options": [
      {
        "key": "A",
        "text": "她随时在、秒回消息、天天联系，我才知道她是我的",
        "scores": { "ATT_anxiety": 2, "INT_high": 1 }
      },
      {
        "key": "B",
        "text": "互相信任，不用时刻粘着，各忙各的也知道对方在",
        "scores": { "ATT_secure": 2, "INT_medium": 1 }
      },
      {
        "key": "C",
        "text": "有各自的空间，不用时刻报备，见面时全心投入",
        "scores": { "ATT_avoid": 2, "EST_high": 1 }
      },
      {
        "key": "D",
        "text": "说不上来，我也还在找这种感觉",
        "scores": { "ATT_fearful": 2, "EST_low": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里最心安的画面是什么样的？"
    },
    "primary_dim": "ATT",
    "secondary_dim": ["INT", "EST"]
  },
  {
    "id": 67,
    "segment": 3,
    "dimension": "CON",
    "scene": "吵架时的节奏",
    "title": "你们吵架的时候，你是那种当场必须把话说完的人，还是会先冷一冷再说？半夜三点脑子停不下来那种——",
    "options": [
      {
        "key": "A",
        "text": "当场说清楚，不说完睡不着，拖到明天更难受",
        "scores": { "CON_confront": 2, "ATT_anxiety": 1 }
      },
      {
        "key": "B",
        "text": "先各自冷静，过几天再说，冲动的时候容易说错话",
        "scores": { "CON_avoid": 2, "EMR_stable": 1 }
      },
      {
        "key": "C",
        "text": "我会先让步，别吵了，感情比道理重要",
        "scores": { "CON_compromise": 2, "EMP_high": 1 }
      },
      {
        "key": "D",
        "text": "我会想办法聊到一个两个人都能接受的方案",
        "scores": { "CON_collaborate": 2, "EMP_high": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你吵架时身体最先有的反应是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": ["EMR", "ATT"]
  },
  {
    "id": 68,
    "segment": 3,
    "dimension": "CON",
    "scene": "最受不了的吵架方式",
    "title": "你最受不了的是哪种吵架方式？就是那种一碰到你就炸、瞬间不想聊了的——",
    "options": [
      {
        "key": "A",
        "text": "翻旧账、人身攻击——'你跟你爸一样''你从来都这样'",
        "scores": { "CON_confront": 2, "EST_high": 1 }
      },
      {
        "key": "B",
        "text": "冷战、不说话、甩脸子——比吵还难受",
        "scores": { "CON_avoid": 1, "ATT_anxiety": 2 }
      },
      {
        "key": "C",
        "text": "声音大、态度凶——一凶我就缩了，什么都不想说了",
        "scores": { "CON_compromise": 2, "EXP_suppress": 1 }
      },
      {
        "key": "D",
        "text": "无所谓、吵完就过了——好像什么都不在乎",
        "scores": { "CON_avoid": 2, "ATT_avoid": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你最怕的那种吵架方式是什么？"
    },
    "primary_dim": "CON",
    "secondary_dim": ["EXP", "ATT"]
  },
  {
    "id": 69,
    "segment": 3,
    "dimension": "EXP",
    "scene": "说'我想你'",
    "title": "你上一次跟别人说'我很想你'是什么时候？说出口的那一刻感觉怎么样——",
    "options": [
      {
        "key": "A",
        "text": "经常说，很自然就说出来了，不觉得有什么",
        "scores": { "EXP_open": 2, "ATT_secure": 1 }
      },
      {
        "key": "B",
        "text": "说过，但很别扭，做了很多心理建设才发出去",
        "scores": { "EXP_subtle": 2, "ATT_anxiety": 1 }
      },
      {
        "key": "C",
        "text": "说不出来，一般用行动代替——比如突然去找她",
        "scores": { "EXP_suppress": 2, "EXP_subtle": 1 }
      },
      {
        "key": "D",
        "text": "想不起来，好像从来没说过这种话",
        "scores": { "EXP_suppress": 2, "ATT_avoid": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你没说出口的那句话是什么？"
    },
    "primary_dim": "EXP",
    "secondary_dim": ["ATT", "INT"]
  },
  {
    "id": 70,
    "segment": 3,
    "dimension": "EXP",
    "scene": "心情不好时的选择",
    "title": "心情不好的时候，你是更愿意一个人待着，还是希望有人来陪你？就是那个最真实的本能反应——",
    "options": [
      {
        "key": "A",
        "text": "希望有人陪，想找人聊聊，说出来就好了",
        "scores": { "EXP_open": 2, "INT_high": 1 }
      },
      {
        "key": "B",
        "text": "看情况，会先自己消化一下，实在消化不了再找人",
        "scores": { "EXP_subtle": 2, "EMR_stable": 1 }
      },
      {
        "key": "C",
        "text": "一个人待着，不想让别人看到自己这样",
        "scores": { "EXP_suppress": 2, "ATT_avoid": 1 }
      },
      {
        "key": "D",
        "text": "希望对方能看出来但不用我说，说出来就没意思了",
        "scores": { "EXP_subtle": 2, "ATT_anxiety": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心情不好时最希望她怎么做？"
    },
    "primary_dim": "EXP",
    "secondary_dim": ["INT", "ATT"]
  },
  {
    "id": 71,
    "segment": 3,
    "dimension": "INT",
    "scene": "谈恋爱后时间的变化",
    "title": "谈恋爱以后，你自己的时间变少了吗？你介意吗？认真想想——",
    "options": [
      {
        "key": "A",
        "text": "变少了但很开心，跟她在一起就是自己的时间",
        "scores": { "INT_high": 2, "ATT_anxiety": 1 }
      },
      {
        "key": "B",
        "text": "有一点，但觉得正常，感情本来就需要投入",
        "scores": { "INT_medium": 2, "ATT_secure": 1 }
      },
      {
        "key": "C",
        "text": "变了很多，有时候需要喘口气但不敢说",
        "scores": { "INT_low": 2, "EXP_suppress": 1 }
      },
      {
        "key": "D",
        "text": "没什么变化，各过各的挺好的",
        "scores": { "INT_low": 2, "ATT_avoid": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里理想的相处节奏是什么样的？"
    },
    "primary_dim": "INT",
    "secondary_dim": ["EXP", "ATT"]
  },
  {
    "id": 72,
    "segment": 3,
    "dimension": "INT",
    "scene": "想一个人待着的时刻",
    "title": "你有没有那种时刻——特别想一个人待着，什么都不想干？这种时候多吗？",
    "options": [
      {
        "key": "A",
        "text": "很少，有她在就不想一个人待着",
        "scores": { "INT_high": 2, "ATT_anxiety": 1 }
      },
      {
        "key": "B",
        "text": "偶尔，一周有个一两次，正常需要",
        "scores": { "INT_medium": 2, "EMR_stable": 1 }
      },
      {
        "key": "C",
        "text": "经常，几乎每天都需要一段自己的时间",
        "scores": { "INT_low": 2, "ATT_avoid": 1 }
      },
      {
        "key": "D",
        "text": "很多，我觉得一个人待着最舒服",
        "scores": { "INT_low": 2, "EST_high": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你一个人待着的时候一般在做什么？"
    },
    "primary_dim": "INT",
    "secondary_dim": ["EST", "EMR"]
  },
  {
    "id": 73,
    "segment": 3,
    "dimension": "ASR",
    "scene": "自己说了算的决定",
    "title": "你最近做过最'自己说了算'的一个决定是什么？不管大小——",
    "options": [
      {
        "key": "A",
        "text": "想了就做，我最近几个决定都很果断",
        "scores": { "ASR_strong": 2, "EST_high": 1 }
      },
      {
        "key": "B",
        "text": "想了很久才做，其实也挺纠结的",
        "scores": { "ASR_weak": 2, "EST_low": 1 }
      },
      {
        "key": "C",
        "text": "其实也不是什么大事，日常的都是她定",
        "scores": { "ASR_weak": 2, "CON_compromise": 1 }
      },
      {
        "key": "D",
        "text": "比较大的事，我认真考虑了各方面才定的",
        "scores": { "ASR_strong": 2, "CON_collaborate": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你做决定时最先想到的声音是谁的？"
    },
    "primary_dim": "ASR",
    "secondary_dim": ["EST", "CON"]
  },
  {
    "id": 74,
    "segment": 3,
    "dimension": "ASR",
    "scene": "她不同意你的想法",
    "title": "如果她不同意你的某个想法，你一般会怎么办？就是那个第一反应——",
    "options": [
      {
        "key": "A",
        "text": "跟她好好聊，但最后我还是会按自己的想法走",
        "scores": { "ASR_strong": 2, "CON_collaborate": 1 }
      },
      {
        "key": "B",
        "text": "会犹豫，可能会改变主意",
        "scores": { "ASR_weak": 2, "CON_compromise": 1 }
      },
      {
        "key": "C",
        "text": "算了算了，她说有道理就不做了",
        "scores": { "ASR_weak": 2, "CON_compromise": 1 }
      },
      {
        "key": "D",
        "text": "先听听她的理由，然后看情况",
        "scores": { "ASR_strong": 2, "EMP_high": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你让步的时候心里真正在想什么？"
    },
    "primary_dim": "ASR",
    "secondary_dim": ["CON", "EMP"]
  },
  {
    "id": 75,
    "segment": 3,
    "dimension": "EST",
    "scene": "说自己最大的优点",
    "title": "你觉得自己最大的优点是什么？能马上说出来吗？不用想——",
    "options": [
      {
        "key": "A",
        "text": "很快说出来，而且说得很自然",
        "scores": { "EST_high": 2, "EXP_open": 1 }
      },
      {
        "key": "B",
        "text": "想了半天，说了但有点不好意思",
        "scores": { "EST_low": 2, "EXP_subtle": 1 }
      },
      {
        "key": "C",
        "text": "优点？不太确定自己有啥特别的",
        "scores": { "EST_low": 2, "ATT_fearful": 1 }
      },
      {
        "key": "D",
        "text": "说了但加了很多自我贬低的修饰，'还行吧''一般般'",
        "scores": { "EST_low": 2, "EXP_suppress": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你心里对自己最真实的评价是什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": ["EXP", "ATT"]
  },
  {
    "id": 76,
    "segment": 3,
    "dimension": "EST",
    "scene": "被人当面否定",
    "title": "如果有人当面说你不行，你心里第一反应是什么？不是你会怎么回，是心里那一下——",
    "options": [
      {
        "key": "A",
        "text": "不服，那就证明给你看",
        "scores": { "EST_high": 2, "CON_confront": 1 }
      },
      {
        "key": "B",
        "text": "有点受伤，会想是不是真的",
        "scores": { "EST_low": 2, "EMR_sensitive": 1 }
      },
      {
        "key": "C",
        "text": "无所谓，不重要的人说的不算",
        "scores": { "EST_high": 2, "ATT_avoid": 1 }
      },
      {
        "key": "D",
        "text": "很生气，觉得被冒犯了",
        "scores": { "EST_low": 2, "CON_confront": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那个瞬间你心里对自己说了什么？"
    },
    "primary_dim": "EST",
    "secondary_dim": ["CON", "EMR"]
  },
  {
    "id": 77,
    "segment": 3,
    "dimension": "EMR",
    "scene": "上一次失眠",
    "title": "你上一次失眠是什么时候？当时脑子里在想什么？",
    "options": [
      {
        "key": "A",
        "text": "最近经常，翻来覆去想很多事",
        "scores": { "EMR_sensitive": 2, "ATT_anxiety": 1 }
      },
      {
        "key": "B",
        "text": "很久以前了，想了一件事第二天就解决了",
        "scores": { "EMR_stable": 2, "ASR_strong": 1 }
      },
      {
        "key": "C",
        "text": "不记得了，我一般倒头就睡",
        "scores": { "EMR_stable": 2, "ATT_secure": 1 }
      },
      {
        "key": "D",
        "text": "有时候会，但主要是因为某个特定的事",
        "scores": { "EMR_sensitive": 1, "EMR_stable": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你失眠时脑子里转得最多的是什么？"
    },
    "primary_dim": "EMR",
    "secondary_dim": ["ATT", "ASR"]
  },
  {
    "id": 78,
    "segment": 3,
    "dimension": "EMR",
    "scene": "给自己打分",
    "title": "你觉得你现在整体状态怎么样？满分10分你给自己打几分？诚实一点——",
    "options": [
      {
        "key": "A",
        "text": "7分以上，挺好的",
        "scores": { "EMR_stable": 2, "EST_high": 1 }
      },
      {
        "key": "B",
        "text": "5到6分，一般般",
        "scores": { "EMR_sensitive": 2, "EST_low": 1 }
      },
      {
        "key": "C",
        "text": "4分以下，最近很差",
        "scores": { "EMR_sensitive": 2, "ATT_anxiety": 1 }
      },
      {
        "key": "D",
        "text": "说不上来，时好时坏",
        "scores": { "EMR_sensitive": 2, "ATT_fearful": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "那个分数背后你真正想说什么？"
    },
    "primary_dim": "EMR",
    "secondary_dim": ["EST", "ATT"]
  },
  {
    "id": 79,
    "segment": 3,
    "dimension": "EMP",
    "scene": "看到别人比你更难受",
    "title": "你有没有过那种……看到别人难过你比他还难受的时刻？",
    "options": [
      {
        "key": "A",
        "text": "经常有，很容易感同身受，看个电影都能哭",
        "scores": { "EMP_high": 2, "EMR_sensitive": 1 }
      },
      {
        "key": "B",
        "text": "有过，但不太多",
        "scores": { "EMP_low": 1, "EMP_high": 1 }
      },
      {
        "key": "C",
        "text": "很少，我会先想怎么解决",
        "scores": { "EMP_low": 2, "ASR_strong": 1 }
      },
      {
        "key": "D",
        "text": "不太会，觉得每个人要自己处理情绪",
        "scores": { "EMP_low": 2, "ATT_avoid": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你最容易为谁心疼？"
    },
    "primary_dim": "EMP",
    "secondary_dim": ["EMR", "ATT"]
  },
  {
    "id": 80,
    "segment": 3,
    "dimension": "EMP",
    "scene": "她心情不好但不说",
    "title": "如果她心情不好但不说原因，你会怎么做？",
    "options": [
      {
        "key": "A",
        "text": "不问原因，先陪着，让她知道我在",
        "scores": { "EMP_high": 2, "EXP_subtle": 1 }
      },
      {
        "key": "B",
        "text": "一直问怎么了，想知道原因才能帮忙",
        "scores": { "EMP_low": 1, "ATT_anxiety": 1 }
      },
      {
        "key": "C",
        "text": "让她自己待会儿，过会儿就好了",
        "scores": { "EMP_low": 2, "ATT_avoid": 1 }
      },
      {
        "key": "D",
        "text": "发个红包、买杯奶茶，用实际行动哄",
        "scores": { "EMP_low": 1, "EXP_subtle": 1 }
      }
    ],
    "eOption": {
      "key": "E",
      "text": "都不完全是，我的真实想法是……",
      "eHint": "你当时最想为她做的是什么？"
    },
    "primary_dim": "EMP",
    "secondary_dim": ["EXP", "ATT"]
  }
];


const questions_full = [...questions_segment1,...questions_segment2,...questions_segment3];

/**
 * 获取某道题的E选项数据
 * @param {number} questionId
 * @returns {{text: string, eHint: string}} E选项文本和微提示
 */
function getEOption(questionId) {
  const q = questions_full.find(x => x.id === questionId);
  if (!q || !q.eOption) return null;
  return q.eOption;
}

function calcSegmentScore(userAnswers, questionSet) {
  const scores = {};
  Object.values(SCORE_KEYS).flat().forEach(k => scores[k] = 0);
  userAnswers.forEach(a => {
    if (a.selectedKey === 'E') return; // E不参与评分
    const q = questionSet.find(x => x.id === a.questionId);
    if (!q) return;
    const o = q.options.find(x => x.key === a.selectedKey);
    if (!o || !o.scores) return;
    Object.entries(o.scores).forEach(([k,v]) => { if(scores[k]!==undefined) scores[k]+=v; });
  });
  return scores;
}

function mergeProfile(s1, s2, s3) {
  const m = {};
  Object.values(SCORE_KEYS).flat().forEach(k => m[k] = (s1[k]||0)+(s2[k]||0)+((s3&&s3[k])||0));
  return m;
}

function getProfileLabels(ms) {
  const r = {};
  for (const d of DIM_KEYS_V2) {
    const keys = SCORE_KEYS[d], labels = DIM_LABELS_V2[d];
    let mx = -1, mi = 0;
    keys.forEach((k,i) => { if ((ms[k]||0)>mx) { mx=ms[k]; mi=i; } });
    r[d] = labels[mi] || '未知';
  }
  return r;
}

window.QuestionsData = {
  ASSESSMENT_INTRO, E_OPTION_DEFAULT_TEXT, E_HINTS,
  DIM_KEYS_V2, DIM_NAMES_V2, DIM_LABELS_V2, SCORE_KEYS,
  questions_full, questions_segment1, questions_segment2, questions_segment3,
  getEOption, calcSegmentScore, mergeProfile, getProfileLabels
}
window.ASSESSMENT_INTRO = ASSESSMENT_INTRO;
window.E_OPTION_DEFAULT_TEXT = E_OPTION_DEFAULT_TEXT;
window.E_HINTS = E_HINTS;
window.DIM_KEYS_V2 = DIM_KEYS_V2;
window.DIM_NAMES_V2 = DIM_NAMES_V2;
window.DIM_LABELS_V2 = DIM_LABELS_V2;
window.SCORE_KEYS = SCORE_KEYS;
window.questions_segment1 = questions_segment1;
window.questions_segment2 = questions_segment2;
window.questions_segment3 = questions_segment3;
window.questions_full = questions_full;