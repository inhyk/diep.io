const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const dom = {
  overlay: document.getElementById("overlay"),
  overlayTitle: document.getElementById("overlay-title"),
  overlayText: document.getElementById("overlay-text"),
  startButton: document.getElementById("start-button"),
  nicknameInput: document.getElementById("nickname-input"),
  creatorToggle: document.getElementById("creator-toggle"),
  creatorPanel: document.getElementById("creator-panel"),
  creatorBadge: document.getElementById("creator-badge"),
  creatorMessage: document.getElementById("creator-message"),
  creatorAuth: document.getElementById("creator-auth"),
  creatorPassword: document.getElementById("creator-password"),
  creatorUnlock: document.getElementById("creator-unlock"),
  creatorControls: document.getElementById("creator-controls"),
  chatStatus: document.getElementById("chat-status"),
  chatLog: document.getElementById("chat-log"),
  chatForm: document.getElementById("chat-form"),
  chatInput: document.getElementById("chat-input"),
  musicStatus: document.getElementById("music-status"),
  musicTrack: document.getElementById("music-track"),
  musicFile: document.getElementById("music-file"),
  musicToggle: document.getElementById("music-toggle"),
  musicVolume: document.getElementById("music-volume"),
  mapSelector: document.getElementById("map-selector"),
  mapCount: document.getElementById("map-count"),
  mapSummary: document.getElementById("map-summary"),
  modeButtons: [...document.querySelectorAll("[data-game-mode]")],
  compactHud: document.getElementById("compact-hud"),
  compactLevel: document.getElementById("compact-level"),
  compactPoints: document.getElementById("compact-points"),
  compactHpFill: document.getElementById("compact-hp-fill"),
  compactHpText: document.getElementById("compact-hp-text"),
  compactXpFill: document.getElementById("compact-xp-fill"),
  compactXpText: document.getElementById("compact-xp-text"),
  compactClassName: document.getElementById("compact-class-name"),
  compactClassStatus: document.getElementById("compact-class-status"),
  compactClassChoices: document.getElementById("compact-class-choices"),
  leaderboardStatus: document.getElementById("leaderboard-status"),
  leaderboardList: document.getElementById("leaderboard-list"),
  hpFill: document.getElementById("hp-fill"),
  hpText: document.getElementById("hp-text"),
  xpFill: document.getElementById("xp-fill"),
  xpText: document.getElementById("xp-text"),
  pointsLabel: document.getElementById("points-label"),
  statsMeta: document.getElementById("stats-meta"),
  classTierLabel: document.getElementById("class-tier-label"),
  className: document.getElementById("class-name"),
  classDescription: document.getElementById("class-description"),
  classStatus: document.getElementById("class-status"),
  classList: document.getElementById("class-list"),
  upgradeList: document.getElementById("upgrade-list"),
  eventFeed: document.getElementById("event-feed"),
  moveStick: document.getElementById("move-stick"),
  aimStick: document.getElementById("aim-stick"),
};

const TAU = Math.PI * 2;
const WORLD_SIZE = 5200;
const WORLD_PADDING = 180;
const GRID_SIZE = 80;
const MAX_UPGRADE_LEVEL = 12;
const UPGRADE_POINTS_PER_LEVEL = 1;
const BONUS_POINT_INTERVAL = 5;
const SHOW_MINIMAP = true;
const LEADERBOARD_LIMIT = 8;
const NICKNAME_STORAGE_KEY = "diep.io.nickname";
const MAP_STORAGE_KEY = "diep.io.map";
const MUSIC_VOLUME_STORAGE_KEY = "diep.io.musicVolume";
const CREATOR_PASSWORD = "hihi";
const TERRITORY_CELL_SIZE = 200;
const TERRITORY_TIME_LIMIT = 120;
const TARGET_SHAPES = {
  square: 36,
  squishedSquare: 12,
  triangle: 18,
  hexagon: 10,
  pentagon: 8,
  alphaPentagon: 10,
};
const TARGET_ENEMIES = 6;
const ENEMY_DAMAGE_TAKEN_MULTIPLIER = 0.78;
const TEAM_SCORE_LIMIT = 20;
const TERRITORY_SCORE_LIMIT = 180;
const SOCCER_SCORE_LIMIT = 5;

const UPGRADE_DEFS = [
  { id: "maxHealth", label: "최대 체력", hotkey: "1", code: "Digit1" },
  { id: "bulletDamage", label: "총알 피해", hotkey: "2", code: "Digit2" },
  { id: "reload", label: "재장전", hotkey: "3", code: "Digit3" },
  { id: "bulletSpeed", label: "탄속", hotkey: "4", code: "Digit4" },
  { id: "movement", label: "이동 속도", hotkey: "5", code: "Digit5" },
  { id: "bodyDamage", label: "몸통 피해", hotkey: "6", code: "Digit6" },
];

const CLASS_HOTKEYS = [
  { hotkey: "7", code: "Digit7" },
  { hotkey: "8", code: "Digit8" },
  { hotkey: "9", code: "Digit9" },
];

const ENEMY_NAME_PREFIXES = [
  "로그",
  "노바",
  "샤드",
  "벡터",
  "팬텀",
  "델타",
  "오빗",
  "헥스",
  "펄스",
  "반타",
  "에코",
  "이온",
];

const ENEMY_NAME_SUFFIXES = [
  "드리프트",
  "스파이어",
  "브레이커",
  "블룸",
  "서킷",
  "워든",
  "플레어",
  "코어",
  "맨티스",
  "스파크",
  "바이퍼",
  "볼트",
];

const BOT_CHAT_LINES = [
  "나 지금 중앙 아래쪽임",
  "알파 쪽 사람 많다",
  "오른쪽 위쪽 좀 복잡함",
  "육각형 보이면 나도 불러줘 ㅋㅋ",
  "방금 로그 하나 잡음",
  "나 거의 다음 분기 직전이야",
  "중앙은 아직 좀 빡세네",
  "잠깐 육각형 먹고 갈게",
  "왼쪽에서 오는 애들 조심",
  "이번엔 저격 쪽 갈까 고민 중",
  "포인트 좀 더 모아야겠다",
  "알파 쪽 같이 갈 사람",
];

const BOT_REPLY_RULES = [
  {
    pattern: /(안녕|ㅎㅇ|하이|hello|hi)/i,
    replies: [
      "오 안녕 ㅋㅋ 지금 막 들어왔어?",
      "안녕안녕, 지금 어디 쪽이야?",
      "왔네 ㅋㅋ 같이 좀 커보자",
    ],
  },
  {
    pattern: /(도와|살려|help)/i,
    replies: [
      "어디야? 가까우면 바로 갈게",
      "조금만 버텨봐 나도 그쪽 보는 중",
      "헉 잠깐만, 나도 합류해볼게",
    ],
  },
  {
    pattern: /(알파|오각형|alpha|pentagon)/i,
    replies: [
      "알파 봤어? 나도 지금 찾는 중",
      "알파 쪽 사람 많더라, 조심해서 가",
      "알파 먹으러 갈 거면 같이 가자",
    ],
  },
  {
    pattern: /(육각|hex)/i,
    replies: [
      "육각형 있으면 나도 좀 알려줘 ㅋㅋ",
      "나 방금 육각형 먹고 렙 좀 올림",
      "육각형 라인 괜찮더라, 금방 큰다",
    ],
  },
  {
    pattern: /(레벨|렙|level|업그레이드|포인트)/i,
    replies: [
      "나도 포인트 쌓이면 바로 찍으려고",
      "렙업 몇 번만 더 하면 편해질 듯",
      "업글은 재장전이 체감 크더라",
    ],
  },
  {
    pattern: /(어디|위치|어딨|where|spawn|중앙)/i,
    replies: [
      "나 중앙 아래쪽이야",
      "오른쪽 위쪽 좀 복잡함",
      "스폰 옆은 잠깐 한가한데 오래 있긴 애매해",
    ],
  },
  {
    pattern: /(ㅋㅋ|ㅎㅎ|lol|haha)/i,
    replies: [
      "ㅋㅋ 그러게",
      "아 그건 좀 웃기네 ㅋㅋ",
      "ㄹㅇ 나도 방금 그 생각함",
    ],
  },
  {
    pattern: /(좋|굿|nice|오케|오키|ok|ㅇㅋ|그래|콜)/i,
    replies: [
      "오 좋지 ㅋㅋ",
      "ㅇㅋ 그럼 그렇게 가자",
      "나도 그게 괜찮아 보임",
    ],
  },
  {
    pattern: /(잘하|세다|쎄다|strong|good|잘함|미쳤)/i,
    replies: [
      "방금 그건 꽤 좋았음 ㅋㅋ",
      "너도 지금 잘 크고 있던데",
      "나도 좀 탄 거 같긴 해 ㅋㅋ",
    ],
  },
  {
    pattern: /(뭐함|머함|뭐해|머해)/i,
    replies: [
      "나 지금 육각형 먹는 중",
      "알파 쪽 슬쩍 보고 있었어",
      "중앙 들어갈 각 보는 중이야",
    ],
  },
];

const BOT_REPLY_QUESTION_FALLBACKS = [
  "음 일단 중앙은 좀 위험한 편이야",
  "나도 정확히는 모르겠는데 오른쪽이 낫더라",
  "잠깐만 보고 다시 말해줄게 ㅋㅋ",
  "내가 본 건 스폰 위쪽이 좀 한가했어",
  "일단 가까운 도형부터 먹는 게 편해",
];

const BOT_REPLY_FALLBACKS = [
  "오케이 ㅋㅋ 일단 해보자",
  "나도 그렇게 생각함",
  "오 그 말은 맞네",
  "잠깐만 나 지금 육각형 먹는 중",
  "ㅋㅋ 일단 살아남고 얘기하자",
  "좋아, 나도 맞춰볼게",
];

const TEAM_DEFS = {
  blue: {
    id: "blue",
    label: "블루",
    body: "#5cc3ff",
    barrel: "#2f8ee0",
    stroke: "#125a99",
    ui: "#61c0ff",
    tint: "rgba(97, 192, 255, 0.18)",
  },
  red: {
    id: "red",
    label: "레드",
    body: "#ff6e89",
    barrel: "#d94764",
    stroke: "#ad2f46",
    ui: "#ff6e89",
    tint: "rgba(255, 110, 137, 0.18)",
  },
  rogue: {
    id: "rogue",
    label: "로그",
    body: "#ff6e89",
    barrel: "#d94764",
    stroke: "#ad2f46",
    ui: "#ff6e89",
    tint: "rgba(255, 110, 137, 0.18)",
  },
};

function createMapPalette(overrides = {}) {
  return {
    skyTop: "#153149",
    skyBottom: "#08131f",
    glowA: "rgba(76, 180, 255, 0.2)",
    glowB: "rgba(255, 110, 137, 0.12)",
    grid: "rgba(255, 255, 255, 0.05)",
    border: "rgba(189, 227, 255, 0.2)",
    minimapGlow: "rgba(76, 180, 255, 0.12)",
    ...overrides,
  };
}

function normalizedRect(x, y, width, height, fill, stroke = "", lineWidth = 0, radius = 0) {
  return { shape: "rect", normalized: true, x, y, width, height, fill, stroke, lineWidth, radius };
}

function normalizedCircle(x, y, radius, fill, stroke = "", lineWidth = 0) {
  return { shape: "circle", normalized: true, x, y, radius, fill, stroke, lineWidth };
}

function normalizedRing(x, y, outerRadius, innerRadius, fill, stroke = "", lineWidth = 0) {
  return {
    shape: "ring",
    normalized: true,
    x,
    y,
    outerRadius,
    innerRadius,
    fill,
    stroke,
    lineWidth,
  };
}

function normalizedDiamond(x, y, width, height, fill, stroke = "", lineWidth = 0) {
  return { shape: "diamond", normalized: true, x, y, width, height, fill, stroke, lineWidth };
}

function createMapDef(config) {
  return {
    id: "classic",
    label: "클래식",
    tag: "표준",
    description: "기본 전장입니다.",
    gridSize: GRID_SIZE,
    shapeScale: 1,
    shapeBias: {},
    botScale: 1,
    spawnPreset: "sides",
    territoryPattern: "sides",
    teamLayout: "sideLanes",
    soccerLayout: "classic",
    zones: [],
    ...config,
    palette: createMapPalette(config.palette),
  };
}

const MAP_DEFS = {
  classic: createMapDef({
    id: "classic",
    label: "클래식",
    tag: "표준 · 좌우 대칭",
    description: "가장 균형 잡힌 기본 전장입니다.",
    zones: [
      normalizedRect(0.08, 0.16, 0.14, 0.68, "rgba(97, 192, 255, 0.06)"),
      normalizedRect(0.78, 0.16, 0.14, 0.68, "rgba(255, 110, 137, 0.06)"),
      normalizedCircle(0.5, 0.5, 0.09, "rgba(255, 255, 255, 0.025)"),
    ],
  }),
  mirror: createMapDef({
    id: "mirror",
    label: "미러",
    tag: "중앙 복도 · 빠른 교전",
    description: "중앙 길목이 얇아 전차전이 빨리 벌어지는 맵입니다.",
    gridSize: 72,
    shapeScale: 0.95,
    shapeBias: { square: 1.25, triangle: 1.25, alphaPentagon: 0.65 },
    botScale: 1.15,
    spawnPreset: "corridor",
    territoryPattern: "cross",
    teamLayout: "corridor",
    soccerLayout: "narrow",
    palette: {
      skyTop: "#11263d",
      skyBottom: "#050d17",
      glowA: "rgba(97, 192, 255, 0.18)",
      glowB: "rgba(255, 255, 255, 0.06)",
      minimapGlow: "rgba(146, 205, 255, 0.16)",
    },
    zones: [
      normalizedRect(0.04, 0.2, 0.2, 0.6, "rgba(97, 192, 255, 0.07)"),
      normalizedRect(0.76, 0.2, 0.2, 0.6, "rgba(255, 110, 137, 0.07)"),
      normalizedRect(0.43, 0.08, 0.14, 0.84, "rgba(255, 255, 255, 0.03)"),
    ],
  }),
  eclipse: createMapDef({
    id: "eclipse",
    label: "이클립스",
    tag: "대각선 · 중심 교전",
    description: "대각선으로 넓게 파고들며 중앙 원형에서 충돌하는 맵입니다.",
    gridSize: 86,
    shapeScale: 1.02,
    shapeBias: { pentagon: 1.2, alphaPentagon: 1.15 },
    spawnPreset: "diagonal",
    territoryPattern: "diagonal",
    teamLayout: "diagonal",
    soccerLayout: "vertical",
    palette: {
      skyTop: "#1b2449",
      skyBottom: "#07101d",
      glowA: "rgba(124, 159, 255, 0.22)",
      glowB: "rgba(255, 168, 105, 0.11)",
      border: "rgba(204, 218, 255, 0.22)",
      minimapGlow: "rgba(124, 159, 255, 0.16)",
    },
    zones: [
      normalizedRing(0.5, 0.5, 0.17, 0.11, "rgba(255, 255, 255, 0.03)"),
      normalizedDiamond(0.22, 0.22, 0.18, 0.18, "rgba(97, 192, 255, 0.06)"),
      normalizedDiamond(0.78, 0.78, 0.18, 0.18, "rgba(255, 110, 137, 0.06)"),
    ],
  }),
  forge: createMapDef({
    id: "forge",
    label: "포지",
    tag: "고밀도 · 찌그러진 네모 많음",
    description: "무거운 전선과 짧은 회전 구간이 반복되는 공장형 전장입니다.",
    shapeScale: 1.16,
    shapeBias: { squishedSquare: 1.7, triangle: 1.2, alphaPentagon: 0.8 },
    spawnPreset: "pockets",
    territoryPattern: "cross",
    teamLayout: "pockets",
    soccerLayout: "boxes",
    palette: {
      skyTop: "#3a2317",
      skyBottom: "#0e0c11",
      glowA: "rgba(255, 157, 90, 0.18)",
      glowB: "rgba(255, 215, 90, 0.08)",
      grid: "rgba(255, 232, 196, 0.045)",
      border: "rgba(255, 190, 123, 0.22)",
      minimapGlow: "rgba(255, 157, 90, 0.14)",
    },
    zones: [
      normalizedRect(0.1, 0.12, 0.16, 0.76, "rgba(255, 157, 90, 0.08)"),
      normalizedRect(0.74, 0.12, 0.16, 0.76, "rgba(255, 110, 137, 0.07)"),
      normalizedDiamond(0.5, 0.5, 0.18, 0.24, "rgba(255, 215, 90, 0.05)"),
    ],
  }),
  oasis: createMapDef({
    id: "oasis",
    label: "오아시스",
    tag: "중앙 자원 · 육각형 많음",
    description: "중앙 오아시스와 네 귀퉁이 자원대가 살아 있는 넓은 맵입니다.",
    gridSize: 92,
    shapeScale: 1.08,
    shapeBias: { hexagon: 1.6, pentagon: 1.2, square: 0.8 },
    spawnPreset: "corners",
    territoryPattern: "corners",
    teamLayout: "pockets",
    soccerLayout: "wide",
    palette: {
      skyTop: "#1b3b46",
      skyBottom: "#06121b",
      glowA: "rgba(82, 222, 211, 0.18)",
      glowB: "rgba(255, 217, 122, 0.1)",
      minimapGlow: "rgba(82, 222, 211, 0.14)",
    },
    zones: [
      normalizedCircle(0.5, 0.5, 0.13, "rgba(82, 222, 211, 0.08)"),
      normalizedCircle(0.18, 0.2, 0.07, "rgba(255, 224, 140, 0.05)"),
      normalizedCircle(0.82, 0.2, 0.07, "rgba(255, 224, 140, 0.05)"),
      normalizedCircle(0.18, 0.8, 0.07, "rgba(255, 224, 140, 0.05)"),
      normalizedCircle(0.82, 0.8, 0.07, "rgba(255, 224, 140, 0.05)"),
    ],
  }),
  frostline: createMapDef({
    id: "frostline",
    label: "프로스트라인",
    tag: "상하 대칭 · 긴 전선",
    description: "상하로 길게 갈라진 빙결 전선 위에서 싸우는 맵입니다.",
    gridSize: 96,
    shapeScale: 0.94,
    shapeBias: { pentagon: 1.15, alphaPentagon: 0.7 },
    botScale: 1.08,
    spawnPreset: "northSouth",
    territoryPattern: "northSouth",
    teamLayout: "topBottom",
    soccerLayout: "vertical",
    palette: {
      skyTop: "#1a3048",
      skyBottom: "#071119",
      glowA: "rgba(153, 220, 255, 0.18)",
      glowB: "rgba(190, 243, 255, 0.08)",
      minimapGlow: "rgba(153, 220, 255, 0.14)",
    },
    zones: [
      normalizedRect(0.12, 0.07, 0.76, 0.18, "rgba(153, 220, 255, 0.06)"),
      normalizedRect(0.12, 0.75, 0.76, 0.18, "rgba(255, 255, 255, 0.03)"),
      normalizedRect(0.42, 0.22, 0.16, 0.56, "rgba(255, 255, 255, 0.025)"),
    ],
  }),
  rift: createMapDef({
    id: "rift",
    label: "리프트",
    tag: "균열 라인 · 알파 집중",
    description: "가운데 균열을 따라 고가치 도형이 몰리는 맵입니다.",
    shapeScale: 1.03,
    shapeBias: { alphaPentagon: 1.45, pentagon: 1.2, square: 0.78 },
    botScale: 1.06,
    spawnPreset: "diagonal",
    territoryPattern: "checker",
    teamLayout: "diagonal",
    soccerLayout: "arena",
    palette: {
      skyTop: "#2b163d",
      skyBottom: "#090914",
      glowA: "rgba(200, 110, 255, 0.17)",
      glowB: "rgba(255, 120, 184, 0.08)",
      border: "rgba(221, 180, 255, 0.22)",
      minimapGlow: "rgba(200, 110, 255, 0.14)",
    },
    zones: [
      normalizedDiamond(0.5, 0.5, 0.18, 0.66, "rgba(200, 110, 255, 0.08)"),
      normalizedCircle(0.22, 0.78, 0.08, "rgba(97, 192, 255, 0.05)"),
      normalizedCircle(0.78, 0.22, 0.08, "rgba(255, 110, 137, 0.05)"),
    ],
  }),
  halo: createMapDef({
    id: "halo",
    label: "헤일로",
    tag: "원형 외곽 · 중앙 장악",
    description: "바깥 링과 중앙 코어가 분리된 원형 전장입니다.",
    gridSize: 88,
    shapeScale: 1.04,
    shapeBias: { hexagon: 1.3, pentagon: 1.18, triangle: 0.86 },
    spawnPreset: "ring",
    territoryPattern: "ring",
    teamLayout: "ring",
    soccerLayout: "arena",
    palette: {
      skyTop: "#16263a",
      skyBottom: "#071018",
      glowA: "rgba(122, 219, 255, 0.18)",
      glowB: "rgba(255, 226, 142, 0.08)",
      minimapGlow: "rgba(122, 219, 255, 0.14)",
    },
    zones: [
      normalizedRing(0.5, 0.5, 0.28, 0.2, "rgba(122, 219, 255, 0.06)"),
      normalizedCircle(0.5, 0.5, 0.08, "rgba(255, 255, 255, 0.03)"),
    ],
  }),
  citadel: createMapDef({
    id: "citadel",
    label: "시타델",
    tag: "요새형 · 거점 압박",
    description: "두 요새와 중앙 광장이 선명하게 나뉜 전장입니다.",
    shapeScale: 0.92,
    shapeBias: { square: 0.86, hexagon: 1.2, alphaPentagon: 1.1 },
    botScale: 1.2,
    spawnPreset: "pockets",
    territoryPattern: "quadrants",
    teamLayout: "pockets",
    soccerLayout: "boxes",
    palette: {
      skyTop: "#1e2830",
      skyBottom: "#070c11",
      glowA: "rgba(156, 200, 255, 0.12)",
      glowB: "rgba(255, 170, 120, 0.08)",
      minimapGlow: "rgba(156, 200, 255, 0.12)",
    },
    zones: [
      normalizedRect(0.06, 0.18, 0.18, 0.64, "rgba(97, 192, 255, 0.08)"),
      normalizedRect(0.76, 0.18, 0.18, 0.64, "rgba(255, 110, 137, 0.08)"),
      normalizedRect(0.36, 0.34, 0.28, 0.32, "rgba(255, 255, 255, 0.03)"),
    ],
  }),
  delta: createMapDef({
    id: "delta",
    label: "델타",
    tag: "상하 분기 · 입체 진입",
    description: "위아래 전선에서 중앙 삼각 수로로 파고드는 맵입니다.",
    gridSize: 82,
    shapeScale: 1.02,
    shapeBias: { triangle: 1.4, square: 0.9, pentagon: 1.12 },
    spawnPreset: "northSouth",
    territoryPattern: "diagonal",
    teamLayout: "topBottom",
    soccerLayout: "vertical",
    palette: {
      skyTop: "#123342",
      skyBottom: "#071017",
      glowA: "rgba(90, 208, 255, 0.16)",
      glowB: "rgba(255, 178, 118, 0.08)",
    },
    zones: [
      normalizedDiamond(0.5, 0.26, 0.2, 0.14, "rgba(97, 192, 255, 0.06)"),
      normalizedDiamond(0.5, 0.74, 0.2, 0.14, "rgba(255, 110, 137, 0.06)"),
      normalizedDiamond(0.5, 0.5, 0.32, 0.22, "rgba(255, 255, 255, 0.03)"),
    ],
  }),
  vault: createMapDef({
    id: "vault",
    label: "볼트",
    tag: "좁은 통로 · 로그 많음",
    description: "잠긴 중앙 통로에서 교전이 몰리는 빡빡한 맵입니다.",
    gridSize: 74,
    shapeScale: 0.88,
    shapeBias: { square: 1.28, alphaPentagon: 0.55 },
    botScale: 1.28,
    spawnPreset: "corridor",
    territoryPattern: "sides",
    teamLayout: "corridor",
    soccerLayout: "narrow",
    palette: {
      skyTop: "#232936",
      skyBottom: "#080b12",
      glowA: "rgba(169, 184, 255, 0.14)",
      glowB: "rgba(255, 110, 137, 0.08)",
      minimapGlow: "rgba(169, 184, 255, 0.12)",
    },
    zones: [
      normalizedRect(0.08, 0.18, 0.16, 0.64, "rgba(97, 192, 255, 0.08)"),
      normalizedRect(0.76, 0.18, 0.16, 0.64, "rgba(255, 110, 137, 0.08)"),
      normalizedRect(0.46, 0.08, 0.08, 0.84, "rgba(255, 255, 255, 0.04)"),
    ],
  }),
  crosswind: createMapDef({
    id: "crosswind",
    label: "크로스윈드",
    tag: "십자 전장 · 다방향 진입",
    description: "십자 축을 두고 여러 방향에서 동시에 밀어붙이는 맵입니다.",
    shapeScale: 1.05,
    shapeBias: { triangle: 1.12, hexagon: 1.1 },
    spawnPreset: "quadrants",
    territoryPattern: "cross",
    teamLayout: "cross",
    soccerLayout: "classic",
    palette: {
      skyTop: "#16344d",
      skyBottom: "#061018",
      glowA: "rgba(93, 196, 255, 0.16)",
      glowB: "rgba(144, 255, 216, 0.08)",
    },
    zones: [
      normalizedRect(0.42, 0.08, 0.16, 0.84, "rgba(255, 255, 255, 0.03)"),
      normalizedRect(0.08, 0.42, 0.84, 0.16, "rgba(255, 255, 255, 0.03)"),
    ],
  }),
  dunes: createMapDef({
    id: "dunes",
    label: "듄스",
    tag: "열린 사막 · 속도전",
    description: "가림이 적고 부드럽게 흐르는 사막형 전장입니다.",
    gridSize: 104,
    shapeScale: 1.12,
    shapeBias: { square: 1.3, triangle: 1.18, hexagon: 0.92 },
    botScale: 0.94,
    spawnPreset: "sides",
    territoryPattern: "checker",
    teamLayout: "sideLanes",
    soccerLayout: "wide",
    palette: {
      skyTop: "#4b3420",
      skyBottom: "#120d11",
      glowA: "rgba(255, 201, 120, 0.16)",
      glowB: "rgba(255, 145, 91, 0.08)",
      grid: "rgba(255, 229, 186, 0.045)",
      border: "rgba(255, 209, 140, 0.2)",
      minimapGlow: "rgba(255, 201, 120, 0.12)",
    },
    zones: [
      normalizedCircle(0.28, 0.34, 0.1, "rgba(255, 218, 143, 0.05)"),
      normalizedCircle(0.72, 0.66, 0.12, "rgba(255, 171, 120, 0.05)"),
      normalizedCircle(0.52, 0.5, 0.08, "rgba(255, 255, 255, 0.02)"),
    ],
  }),
  pulse: createMapDef({
    id: "pulse",
    label: "펄스",
    tag: "네온 · 혼합 교전",
    description: "원형 구역이 튀어나오는 네온 아레나형 전장입니다.",
    gridSize: 78,
    shapeScale: 1.08,
    shapeBias: { pentagon: 1.25, hexagon: 1.16, square: 0.82 },
    botScale: 1.08,
    spawnPreset: "corners",
    territoryPattern: "quadrants",
    teamLayout: "pockets",
    soccerLayout: "arena",
    palette: {
      skyTop: "#21133d",
      skyBottom: "#070914",
      glowA: "rgba(130, 110, 255, 0.18)",
      glowB: "rgba(83, 232, 255, 0.12)",
      border: "rgba(165, 203, 255, 0.22)",
      minimapGlow: "rgba(130, 110, 255, 0.16)",
    },
    zones: [
      normalizedCircle(0.3, 0.28, 0.08, "rgba(130, 110, 255, 0.08)"),
      normalizedCircle(0.7, 0.28, 0.08, "rgba(83, 232, 255, 0.08)"),
      normalizedCircle(0.3, 0.72, 0.08, "rgba(83, 232, 255, 0.08)"),
      normalizedCircle(0.7, 0.72, 0.08, "rgba(130, 110, 255, 0.08)"),
      normalizedRing(0.5, 0.5, 0.16, 0.1, "rgba(255, 255, 255, 0.03)"),
    ],
  }),
  reactor: createMapDef({
    id: "reactor",
    label: "리액터",
    tag: "중앙 코어 · 압축 전장",
    description: "중앙 원자로를 감싸며 압박하는 코어형 전장입니다.",
    shapeScale: 0.98,
    shapeBias: { alphaPentagon: 1.35, pentagon: 1.18, square: 0.82 },
    botScale: 1.12,
    spawnPreset: "ring",
    territoryPattern: "ring",
    teamLayout: "ring",
    soccerLayout: "boxes",
    palette: {
      skyTop: "#2a2018",
      skyBottom: "#090b12",
      glowA: "rgba(255, 144, 99, 0.18)",
      glowB: "rgba(255, 215, 122, 0.09)",
      border: "rgba(255, 180, 128, 0.22)",
      minimapGlow: "rgba(255, 144, 99, 0.14)",
    },
    zones: [
      normalizedRing(0.5, 0.5, 0.24, 0.14, "rgba(255, 144, 99, 0.08)"),
      normalizedCircle(0.5, 0.5, 0.08, "rgba(255, 215, 122, 0.06)"),
    ],
  }),
  atlas: createMapDef({
    id: "atlas",
    label: "아틀라스",
    tag: "넓은 섹터 · 파밍형",
    description: "네 구역을 길게 돌며 파밍하기 좋은 넓은 전장입니다.",
    gridSize: 108,
    shapeScale: 1.22,
    shapeBias: { square: 1.22, pentagon: 1.08, alphaPentagon: 0.9 },
    botScale: 0.88,
    spawnPreset: "quadrants",
    territoryPattern: "quadrants",
    teamLayout: "cross",
    soccerLayout: "wide",
    palette: {
      skyTop: "#183145",
      skyBottom: "#071018",
      glowA: "rgba(125, 197, 255, 0.16)",
      glowB: "rgba(167, 255, 214, 0.08)",
      minimapGlow: "rgba(125, 197, 255, 0.13)",
    },
    zones: [
      normalizedRect(0.08, 0.08, 0.34, 0.34, "rgba(97, 192, 255, 0.04)"),
      normalizedRect(0.58, 0.08, 0.34, 0.34, "rgba(255, 255, 255, 0.025)"),
      normalizedRect(0.08, 0.58, 0.34, 0.34, "rgba(255, 255, 255, 0.025)"),
      normalizedRect(0.58, 0.58, 0.34, 0.34, "rgba(255, 110, 137, 0.04)"),
    ],
  }),
  basalt: createMapDef({
    id: "basalt",
    label: "바솔트",
    tag: "무거운 전선 · 압박형",
    description: "좌우 전선이 두꺼워 장기전이 자주 나오는 현무암 전장입니다.",
    gridSize: 84,
    shapeScale: 0.96,
    shapeBias: { squishedSquare: 1.3, hexagon: 1.15, square: 0.9 },
    botScale: 1.18,
    spawnPreset: "sides",
    territoryPattern: "sides",
    teamLayout: "pockets",
    soccerLayout: "narrow",
    palette: {
      skyTop: "#2c3139",
      skyBottom: "#080b10",
      glowA: "rgba(142, 170, 194, 0.14)",
      glowB: "rgba(255, 141, 110, 0.06)",
      border: "rgba(196, 216, 234, 0.18)",
      minimapGlow: "rgba(142, 170, 194, 0.12)",
    },
    zones: [
      normalizedRect(0.08, 0.14, 0.16, 0.72, "rgba(120, 148, 175, 0.07)"),
      normalizedRect(0.76, 0.14, 0.16, 0.72, "rgba(255, 129, 120, 0.06)"),
      normalizedRect(0.4, 0.3, 0.2, 0.4, "rgba(255, 255, 255, 0.025)"),
    ],
  }),
  storm: createMapDef({
    id: "storm",
    label: "스톰",
    tag: "불규칙 · 기습형",
    description: "회오리처럼 휘어진 대각 흐름이 살아 있는 전장입니다.",
    gridSize: 76,
    shapeScale: 1.06,
    shapeBias: { triangle: 1.2, hexagon: 1.16, alphaPentagon: 0.88 },
    botScale: 1.1,
    spawnPreset: "diagonal",
    territoryPattern: "diagonal",
    teamLayout: "diagonal",
    soccerLayout: "vertical",
    palette: {
      skyTop: "#172e48",
      skyBottom: "#060e17",
      glowA: "rgba(94, 160, 255, 0.18)",
      glowB: "rgba(255, 255, 255, 0.08)",
      minimapGlow: "rgba(94, 160, 255, 0.15)",
    },
    zones: [
      normalizedDiamond(0.3, 0.28, 0.16, 0.22, "rgba(97, 192, 255, 0.07)"),
      normalizedDiamond(0.7, 0.72, 0.16, 0.22, "rgba(255, 110, 137, 0.07)"),
      normalizedRing(0.5, 0.5, 0.18, 0.12, "rgba(255, 255, 255, 0.025)"),
    ],
  }),
};

const MAP_IDS = Object.keys(MAP_DEFS);

const GAME_MODE_DEFS = {
  ffa: {
    id: "ffa",
    label: "자유전",
    description: "도형을 파밍하고 로그 탱크를 쓰러뜨리는 기본 모드입니다.",
    objective: "개인 점수를 계속 올리세요.",
    teamBased: false,
    shapeTargets: { ...TARGET_SHAPES },
    botTargets: { rogue: TARGET_ENEMIES },
  },
  territory: {
    id: "territory",
    label: "땅따먹기",
    description: "맵을 돌아다니며 지나간 땅을 팀 색으로 칠하는 땅따먹기 모드입니다.",
    objective: `${formatDuration(TERRITORY_TIME_LIMIT)} 동안 더 많은 칸을 확보한 팀이 승리합니다.`,
    teamBased: true,
    scoreLimit: 0,
    timeLimit: TERRITORY_TIME_LIMIT,
    shapeTargets: {
      square: 20,
      squishedSquare: 8,
      triangle: 12,
      hexagon: 7,
      pentagon: 6,
      alphaPentagon: 3,
    },
    botTargets: { blue: 3, red: 4 },
  },
  team: {
    id: "team",
    label: "팀전",
    description: "블루 팀과 레드 팀이 처치 점수로 싸우는 팀 데스매치입니다.",
    objective: `먼저 ${TEAM_SCORE_LIMIT}킬을 올리는 팀이 승리합니다.`,
    teamBased: true,
    scoreLimit: TEAM_SCORE_LIMIT,
    shapeTargets: {
      square: 14,
      squishedSquare: 6,
      triangle: 8,
      hexagon: 4,
      pentagon: 4,
      alphaPentagon: 1,
    },
    botTargets: { blue: 3, red: 4 },
  },
  soccer: {
    id: "soccer",
    label: "축구",
    description: "공을 밀어서 상대 골문에 넣는 전차 축구 모드입니다.",
    objective: `먼저 ${SOCCER_SCORE_LIMIT}골을 넣는 팀이 승리합니다.`,
    teamBased: true,
    scoreLimit: SOCCER_SCORE_LIMIT,
    hasBall: true,
    shapeTargets: {
      square: 0,
      squishedSquare: 0,
      triangle: 0,
      hexagon: 0,
      pentagon: 0,
      alphaPentagon: 0,
    },
    botTargets: { blue: 2, red: 3 },
  },
};

const SHAPE_TYPES = {
  square: {
    sides: 4,
    radius: 20,
    maxHealth: 36,
    xp: 14,
    speed: 0,
    color: "#ffe274",
    stroke: "#cfa730",
    damage: 16,
  },
  squishedSquare: {
    sides: 4,
    radius: 26,
    maxHealth: 68,
    xp: 34,
    speed: 10,
    color: "#ffd38d",
    stroke: "#d18b38",
    damage: 22,
    scaleMin: 0.92,
    scaleMax: 1.08,
    points: [
      { x: -1.2, y: -0.74 },
      { x: 0.82, y: -1.02 },
      { x: 1.08, y: 0.48 },
      { x: -0.92, y: 1.02 },
    ],
  },
  triangle: {
    sides: 3,
    radius: 28,
    maxHealth: 58,
    xp: 28,
    speed: 28,
    color: "#ff9a63",
    stroke: "#d86b39",
    damage: 18,
  },
  pentagon: {
    sides: 5,
    radius: 42,
    maxHealth: 142,
    xp: 92,
    speed: 12,
    color: "#74d8ff",
    stroke: "#2b98c7",
    damage: 26,
  },
  hexagon: {
    sides: 6,
    radius: 54,
    maxHealth: 260,
    xp: 168,
    speed: 8,
    color: "#8fe388",
    stroke: "#46a64a",
    damage: 34,
    minSpawnDistance: 760,
    scaleMin: 0.94,
    scaleMax: 1.08,
  },
  alphaPentagon: {
    sides: 5,
    radius: 112,
    maxHealth: 1200,
    xp: 820,
    speed: 6,
    color: "#9ae8ff",
    stroke: "#2396bc",
    damage: 56,
    minSpawnDistance: 1400,
    scaleMin: 0.98,
    scaleMax: 1.06,
  },
};

const CLASS_DEFS = {
  basic: {
    id: "basic",
    label: "기본 전차",
    tier: 0,
    unlockLevel: 1,
    description: "균형 잡힌 시작 전차로 안정적인 전면 압박이 가능합니다.",
    colors: { body: "#48b4ff", barrel: "#1f7ed8", stroke: "#11599f" },
    modifiers: {
      maxHealth: 1,
      reloadTime: 1,
      moveSpeed: 1,
      bulletSpeed: 1,
      bulletDamage: 1,
      bodyDamage: 1,
      bulletLife: 1,
      radius: 1,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 2, length: 44, width: 20, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.02 }],
    next: ["twin", "sniper", "machine"],
  },
  twin: {
    id: "twin",
    label: "쌍포",
    tier: 1,
    unlockLevel: 8,
    description: "두 개의 포신으로 화력을 나눠 라인을 안정적으로 장악합니다.",
    colors: { body: "#5cc3ff", barrel: "#2f8ee0", stroke: "#125a99" },
    modifiers: {
      maxHealth: 1,
      reloadTime: 1.08,
      moveSpeed: 0.98,
      bulletSpeed: 0.98,
      bulletDamage: 1,
      bodyDamage: 1,
      bulletLife: 0.96,
      radius: 1,
    },
    barrels: [
      { sideOffset: -10, forwardOffset: 1, length: 41, width: 14, angleOffset: 0 },
      { sideOffset: 10, forwardOffset: 1, length: 41, width: 14, angleOffset: 0 },
    ],
    shots: [
      { barrel: 0, spread: 0.02, damageScale: 0.72, radiusScale: 0.92 },
      { barrel: 1, spread: 0.02, damageScale: 0.72, radiusScale: 0.92 },
    ],
    next: ["triplet", "spreadshot"],
  },
  sniper: {
    id: "sniper",
    label: "저격 전차",
    tier: 1,
    unlockLevel: 8,
    description: "긴 포신과 빠른 탄속으로 강한 한 발을 꽂아 넣습니다.",
    colors: { body: "#82d7ff", barrel: "#318fcb", stroke: "#18637c" },
    modifiers: {
      maxHealth: 0.98,
      reloadTime: 1.2,
      moveSpeed: 0.93,
      bulletSpeed: 1.28,
      bulletDamage: 1.22,
      bodyDamage: 0.96,
      bulletLife: 1.42,
      radius: 1,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 1, length: 66, width: 16, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.012 }],
    next: ["assassin", "hunter"],
  },
  machine: {
    id: "machine",
    label: "기관포",
    tier: 1,
    unlockLevel: 8,
    description: "정확도 대신 지속 화력과 기동성을 챙긴 전차입니다.",
    colors: { body: "#ff9357", barrel: "#e36222", stroke: "#a64412" },
    modifiers: {
      maxHealth: 0.95,
      reloadTime: 0.62,
      moveSpeed: 1.08,
      bulletSpeed: 0.92,
      bulletDamage: 0.82,
      bodyDamage: 0.96,
      bulletLife: 0.92,
      radius: 0.98,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 1, length: 40, width: 18, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.11, radiusScale: 0.9 }],
    next: ["destroyer", "gunner"],
  },
  triplet: {
    id: "triplet",
    label: "삼연장",
    tier: 2,
    unlockLevel: 16,
    description: "세 개의 평행 포신으로 끊임없이 목표를 압박합니다.",
    colors: { body: "#52d7c8", barrel: "#169a8e", stroke: "#0d6b65" },
    modifiers: {
      maxHealth: 1.05,
      reloadTime: 1.12,
      moveSpeed: 0.95,
      bulletSpeed: 1,
      bulletDamage: 1,
      bodyDamage: 1.04,
      bulletLife: 1,
      radius: 1.03,
    },
    barrels: [
      { sideOffset: -15, forwardOffset: 0, length: 40, width: 13, angleOffset: 0 },
      { sideOffset: 0, forwardOffset: 2, length: 48, width: 16, angleOffset: 0 },
      { sideOffset: 15, forwardOffset: 0, length: 40, width: 13, angleOffset: 0 },
    ],
    shots: [
      { barrel: 0, spread: 0.022, damageScale: 0.64, radiusScale: 0.84 },
      { barrel: 1, spread: 0.018, damageScale: 0.78, radiusScale: 0.95 },
      { barrel: 2, spread: 0.022, damageScale: 0.64, radiusScale: 0.84 },
    ],
    next: [],
  },
  spreadshot: {
    id: "spreadshot",
    label: "확산포",
    tier: 2,
    unlockLevel: 16,
    description: "넓게 퍼지는 탄막으로 근중거리를 장악합니다.",
    colors: { body: "#ffc064", barrel: "#df8f27", stroke: "#9e5f11" },
    modifiers: {
      maxHealth: 1.02,
      reloadTime: 1.24,
      moveSpeed: 0.93,
      bulletSpeed: 0.94,
      bulletDamage: 0.96,
      bodyDamage: 1,
      bulletLife: 0.98,
      radius: 1.02,
    },
    barrels: [
      { sideOffset: -18, forwardOffset: -2, length: 30, width: 11, angleOffset: -0.28 },
      { sideOffset: -9, forwardOffset: 0, length: 35, width: 12, angleOffset: -0.14 },
      { sideOffset: 0, forwardOffset: 2, length: 42, width: 14, angleOffset: 0 },
      { sideOffset: 9, forwardOffset: 0, length: 35, width: 12, angleOffset: 0.14 },
      { sideOffset: 18, forwardOffset: -2, length: 30, width: 11, angleOffset: 0.28 },
    ],
    shots: [
      { barrel: 0, spread: 0.03, damageScale: 0.42, speedScale: 0.86, radiusScale: 0.76 },
      { barrel: 1, spread: 0.028, damageScale: 0.5, speedScale: 0.9, radiusScale: 0.82 },
      { barrel: 2, spread: 0.024, damageScale: 0.62, speedScale: 0.95, radiusScale: 0.92 },
      { barrel: 3, spread: 0.028, damageScale: 0.5, speedScale: 0.9, radiusScale: 0.82 },
      { barrel: 4, spread: 0.03, damageScale: 0.42, speedScale: 0.86, radiusScale: 0.76 },
    ],
    next: [],
  },
  assassin: {
    id: "assassin",
    label: "암살자",
    tier: 2,
    unlockLevel: 16,
    description: "사거리와 위력이 더 강해진 초장거리 파생형입니다.",
    colors: { body: "#7cd8ff", barrel: "#259ccf", stroke: "#12617f" },
    modifiers: {
      maxHealth: 0.96,
      reloadTime: 1.36,
      moveSpeed: 0.9,
      bulletSpeed: 1.5,
      bulletDamage: 1.58,
      bodyDamage: 0.92,
      bulletLife: 1.78,
      radius: 1,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 1, length: 82, width: 17, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.008, radiusScale: 1.08 }],
    next: [],
  },
  hunter: {
    id: "hunter",
    label: "사냥꾼",
    tier: 2,
    unlockLevel: 16,
    description: "두 단계 사거리의 정밀탄으로 직선 이동 적을 노립니다.",
    colors: { body: "#9ad07a", barrel: "#5b9840", stroke: "#356423" },
    modifiers: {
      maxHealth: 1.02,
      reloadTime: 1.2,
      moveSpeed: 0.92,
      bulletSpeed: 1.32,
      bulletDamage: 1.22,
      bodyDamage: 1,
      bulletLife: 1.52,
      radius: 1.01,
    },
    barrels: [
      { sideOffset: -6, forwardOffset: 0, length: 76, width: 13, angleOffset: 0 },
      { sideOffset: 6, forwardOffset: 0, length: 56, width: 11, angleOffset: 0 },
    ],
    shots: [
      { barrel: 0, spread: 0.012, damageScale: 0.95, radiusScale: 0.95 },
      { barrel: 1, spread: 0.018, damageScale: 0.68, speedScale: 0.96, radiusScale: 0.82 },
    ],
    next: [],
  },
  destroyer: {
    id: "destroyer",
    label: "파괴자",
    tier: 2,
    unlockLevel: 16,
    description: "반동은 크지만 한 방 한 방이 치명적인 중포형입니다.",
    colors: { body: "#ff7a68", barrel: "#d94834", stroke: "#8d2317" },
    modifiers: {
      maxHealth: 1.12,
      reloadTime: 1.82,
      moveSpeed: 0.84,
      bulletSpeed: 0.98,
      bulletDamage: 1.18,
      bodyDamage: 1.12,
      bulletLife: 1.22,
      radius: 1.05,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 0, length: 54, width: 24, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.018, damageScale: 3.2, speedScale: 0.62, lifeScale: 1.26, radiusScale: 1.85, recoil: 13 }],
    next: [],
  },
  gunner: {
    id: "gunner",
    label: "연사포",
    tier: 2,
    unlockLevel: 16,
    description: "네 개의 짧은 포신으로 구역을 계속 쓸어 담습니다.",
    colors: { body: "#d2b367", barrel: "#9b7d28", stroke: "#654f13" },
    modifiers: {
      maxHealth: 1.04,
      reloadTime: 0.66,
      moveSpeed: 0.96,
      bulletSpeed: 0.9,
      bulletDamage: 0.82,
      bodyDamage: 1.04,
      bulletLife: 0.9,
      radius: 1.03,
    },
    barrels: [
      { sideOffset: -18, forwardOffset: -2, length: 34, width: 10, angleOffset: -0.03 },
      { sideOffset: -6, forwardOffset: 2, length: 42, width: 11, angleOffset: -0.01 },
      { sideOffset: 6, forwardOffset: 2, length: 42, width: 11, angleOffset: 0.01 },
      { sideOffset: 18, forwardOffset: -2, length: 34, width: 10, angleOffset: 0.03 },
    ],
    shots: [
      { barrel: 0, spread: 0.05, damageScale: 0.38, speedScale: 0.88, radiusScale: 0.72 },
      { barrel: 1, spread: 0.045, damageScale: 0.46, speedScale: 0.92, radiusScale: 0.78 },
      { barrel: 2, spread: 0.045, damageScale: 0.46, speedScale: 0.92, radiusScale: 0.78 },
      { barrel: 3, spread: 0.05, damageScale: 0.38, speedScale: 0.88, radiusScale: 0.72 },
    ],
    next: [],
  },
};

Object.assign(CLASS_DEFS, {
  pentaShot: {
    id: "pentaShot",
    label: "오연장",
    tier: 3,
    unlockLevel: 24,
    description: "전방 다섯 포신으로 라인을 두껍게 덮어버립니다.",
    colors: { body: "#5ce3d6", barrel: "#1aa698", stroke: "#0d6f67" },
    modifiers: {
      maxHealth: 1.08,
      reloadTime: 1.22,
      moveSpeed: 0.92,
      bulletSpeed: 1,
      bulletDamage: 0.94,
      bodyDamage: 1.06,
      bulletLife: 1.04,
      radius: 1.06,
    },
    barrels: [
      { sideOffset: -22, forwardOffset: -2, length: 36, width: 12, angleOffset: 0 },
      { sideOffset: -11, forwardOffset: 0, length: 42, width: 12, angleOffset: 0 },
      { sideOffset: 0, forwardOffset: 3, length: 50, width: 14, angleOffset: 0 },
      { sideOffset: 11, forwardOffset: 0, length: 42, width: 12, angleOffset: 0 },
      { sideOffset: 22, forwardOffset: -2, length: 36, width: 12, angleOffset: 0 },
    ],
    shots: [
      { barrel: 0, spread: 0.024, damageScale: 0.46, radiusScale: 0.78 },
      { barrel: 1, spread: 0.022, damageScale: 0.54, radiusScale: 0.82 },
      { barrel: 2, spread: 0.018, damageScale: 0.64, radiusScale: 0.94 },
      { barrel: 3, spread: 0.022, damageScale: 0.54, radiusScale: 0.82 },
      { barrel: 4, spread: 0.024, damageScale: 0.46, radiusScale: 0.78 },
    ],
    next: [],
  },
  quadTwin: {
    id: "quadTwin",
    label: "사중 쌍포",
    tier: 3,
    unlockLevel: 24,
    description: "네 개의 평행 포신으로 기동성을 유지하며 꾸준히 압박합니다.",
    colors: { body: "#61c5ff", barrel: "#2c8be0", stroke: "#155a96" },
    modifiers: {
      maxHealth: 1.04,
      reloadTime: 0.98,
      moveSpeed: 0.97,
      bulletSpeed: 1.03,
      bulletDamage: 0.92,
      bodyDamage: 1,
      bulletLife: 1,
      radius: 1.03,
    },
    barrels: [
      { sideOffset: -18, forwardOffset: -2, length: 38, width: 11, angleOffset: 0 },
      { sideOffset: -6, forwardOffset: 2, length: 46, width: 12, angleOffset: 0 },
      { sideOffset: 6, forwardOffset: 2, length: 46, width: 12, angleOffset: 0 },
      { sideOffset: 18, forwardOffset: -2, length: 38, width: 11, angleOffset: 0 },
    ],
    shots: [
      { barrel: 0, spread: 0.02, damageScale: 0.5, radiusScale: 0.78 },
      { barrel: 1, spread: 0.018, damageScale: 0.58, radiusScale: 0.84 },
      { barrel: 2, spread: 0.018, damageScale: 0.58, radiusScale: 0.84 },
      { barrel: 3, spread: 0.02, damageScale: 0.5, radiusScale: 0.78 },
    ],
    next: [],
  },
  barrage: {
    id: "barrage",
    label: "탄막포",
    tier: 3,
    unlockLevel: 24,
    description: "더 촘촘한 확산 패턴으로 화면을 탄으로 메웁니다.",
    colors: { body: "#ffd07b", barrel: "#e79b2f", stroke: "#a66811" },
    modifiers: {
      maxHealth: 1.05,
      reloadTime: 1.1,
      moveSpeed: 0.9,
      bulletSpeed: 0.92,
      bulletDamage: 0.92,
      bodyDamage: 1.02,
      bulletLife: 0.98,
      radius: 1.06,
    },
    barrels: [
      { sideOffset: -24, forwardOffset: -3, length: 28, width: 10, angleOffset: -0.32 },
      { sideOffset: -15, forwardOffset: -1, length: 32, width: 11, angleOffset: -0.2 },
      { sideOffset: -7, forwardOffset: 0, length: 36, width: 11, angleOffset: -0.1 },
      { sideOffset: 0, forwardOffset: 3, length: 42, width: 14, angleOffset: 0 },
      { sideOffset: 7, forwardOffset: 0, length: 36, width: 11, angleOffset: 0.1 },
      { sideOffset: 15, forwardOffset: -1, length: 32, width: 11, angleOffset: 0.2 },
      { sideOffset: 24, forwardOffset: -3, length: 28, width: 10, angleOffset: 0.32 },
    ],
    shots: [
      { barrel: 0, spread: 0.032, damageScale: 0.34, speedScale: 0.84, radiusScale: 0.72 },
      { barrel: 1, spread: 0.03, damageScale: 0.4, speedScale: 0.88, radiusScale: 0.76 },
      { barrel: 2, spread: 0.028, damageScale: 0.48, speedScale: 0.92, radiusScale: 0.82 },
      { barrel: 3, spread: 0.024, damageScale: 0.62, speedScale: 0.96, radiusScale: 0.92 },
      { barrel: 4, spread: 0.028, damageScale: 0.48, speedScale: 0.92, radiusScale: 0.82 },
      { barrel: 5, spread: 0.03, damageScale: 0.4, speedScale: 0.88, radiusScale: 0.76 },
      { barrel: 6, spread: 0.032, damageScale: 0.34, speedScale: 0.84, radiusScale: 0.72 },
    ],
    next: [],
  },
  shotgun: {
    id: "shotgun",
    label: "산탄포",
    tier: 3,
    unlockLevel: 24,
    description: "가까운 거리에서 묵직한 산탄을 쏟아붓는 전차입니다.",
    colors: { body: "#ffb95c", barrel: "#d76f1f", stroke: "#8f4712" },
    modifiers: {
      maxHealth: 1.1,
      reloadTime: 1.48,
      moveSpeed: 0.9,
      bulletSpeed: 0.78,
      bulletDamage: 0.9,
      bodyDamage: 1.08,
      bulletLife: 0.72,
      radius: 1.08,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 1, length: 32, width: 22, angleOffset: 0 }],
    shots: [
      { barrel: 0, angleOffset: -0.22, spread: 0.02, damageScale: 0.4, speedScale: 0.76, radiusScale: 0.74 },
      { barrel: 0, angleOffset: -0.14, spread: 0.02, damageScale: 0.44, speedScale: 0.8, radiusScale: 0.78 },
      { barrel: 0, angleOffset: -0.07, spread: 0.018, damageScale: 0.48, speedScale: 0.84, radiusScale: 0.82 },
      { barrel: 0, angleOffset: 0, spread: 0.016, damageScale: 0.54, speedScale: 0.88, radiusScale: 0.88 },
      { barrel: 0, angleOffset: 0.07, spread: 0.018, damageScale: 0.48, speedScale: 0.84, radiusScale: 0.82 },
      { barrel: 0, angleOffset: 0.14, spread: 0.02, damageScale: 0.44, speedScale: 0.8, radiusScale: 0.78 },
      { barrel: 0, angleOffset: 0.22, spread: 0.02, damageScale: 0.4, speedScale: 0.76, radiusScale: 0.74 },
    ],
    next: [],
  },
  ranger: {
    id: "ranger",
    label: "레인저",
    tier: 3,
    unlockLevel: 24,
    description: "극한의 탄속과 사거리를 가진 장거리 특화형입니다.",
    colors: { body: "#85e5ff", barrel: "#26a2d3", stroke: "#10657f" },
    modifiers: {
      maxHealth: 0.95,
      reloadTime: 1.3,
      moveSpeed: 0.92,
      bulletSpeed: 1.66,
      bulletDamage: 1.44,
      bodyDamage: 0.9,
      bulletLife: 1.95,
      radius: 1,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 1, length: 96, width: 16, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.006, radiusScale: 1.02 }],
    next: [],
  },
  deadeye: {
    id: "deadeye",
    label: "명사수",
    tier: 3,
    unlockLevel: 24,
    description: "연사력 대신 묵직한 정밀타를 선택한 클래스입니다.",
    colors: { body: "#8ad0ff", barrel: "#2b7fcb", stroke: "#14497a" },
    modifiers: {
      maxHealth: 0.98,
      reloadTime: 1.52,
      moveSpeed: 0.9,
      bulletSpeed: 1.48,
      bulletDamage: 1.82,
      bodyDamage: 0.96,
      bulletLife: 1.88,
      radius: 1.02,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 0, length: 90, width: 18, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.007, radiusScale: 1.14 }],
    next: [],
  },
  predator: {
    id: "predator",
    label: "포식자",
    tier: 3,
    unlockLevel: 24,
    description: "겹겹이 쏘는 정밀 포신으로 이탈하는 적을 추격합니다.",
    colors: { body: "#b2df77", barrel: "#5a9a3a", stroke: "#355e22" },
    modifiers: {
      maxHealth: 1.04,
      reloadTime: 1.08,
      moveSpeed: 0.93,
      bulletSpeed: 1.38,
      bulletDamage: 1.16,
      bodyDamage: 1.02,
      bulletLife: 1.62,
      radius: 1.03,
    },
    barrels: [
      { sideOffset: -10, forwardOffset: -1, length: 72, width: 12, angleOffset: 0 },
      { sideOffset: 0, forwardOffset: 2, length: 86, width: 13, angleOffset: 0 },
      { sideOffset: 10, forwardOffset: -1, length: 72, width: 12, angleOffset: 0 },
    ],
    shots: [
      { barrel: 0, spread: 0.012, damageScale: 0.7, radiusScale: 0.8 },
      { barrel: 1, spread: 0.01, damageScale: 0.92, radiusScale: 0.94 },
      { barrel: 2, spread: 0.012, damageScale: 0.7, radiusScale: 0.8 },
    ],
    next: [],
  },
  longbow: {
    id: "longbow",
    label: "장궁",
    tier: 3,
    unlockLevel: 24,
    description: "사거리와 후속탄이 더 날카로워진 헌터 계열입니다.",
    colors: { body: "#abd486", barrel: "#689c47", stroke: "#3e6528" },
    modifiers: {
      maxHealth: 1,
      reloadTime: 1.22,
      moveSpeed: 0.95,
      bulletSpeed: 1.46,
      bulletDamage: 1.26,
      bodyDamage: 1,
      bulletLife: 1.74,
      radius: 1.02,
    },
    barrels: [
      { sideOffset: -4, forwardOffset: 0, length: 92, width: 11, angleOffset: 0 },
      { sideOffset: 6, forwardOffset: -2, length: 58, width: 10, angleOffset: 0.02 },
    ],
    shots: [
      { barrel: 0, spread: 0.009, damageScale: 0.96, radiusScale: 0.9 },
      { barrel: 1, spread: 0.014, damageScale: 0.62, speedScale: 0.98, radiusScale: 0.78 },
    ],
    next: [],
  },
  annihilator: {
    id: "annihilator",
    label: "섬멸자",
    tier: 3,
    unlockLevel: 24,
    description: "더 무거운 탄으로 엄청난 충격과 반동을 만들어 냅니다.",
    colors: { body: "#ff887a", barrel: "#da4b39", stroke: "#8a261d" },
    modifiers: {
      maxHealth: 1.18,
      reloadTime: 2.08,
      moveSpeed: 0.8,
      bulletSpeed: 1.02,
      bulletDamage: 1.28,
      bodyDamage: 1.16,
      bulletLife: 1.26,
      radius: 1.08,
    },
    barrels: [{ sideOffset: 0, forwardOffset: 0, length: 60, width: 26, angleOffset: 0 }],
    shots: [{ barrel: 0, spread: 0.016, damageScale: 4.1, speedScale: 0.58, lifeScale: 1.32, radiusScale: 2.05, recoil: 16 }],
    next: [],
  },
  crusher: {
    id: "crusher",
    label: "분쇄자",
    tier: 3,
    unlockLevel: 24,
    description: "혼전 한가운데를 뚫어버리는 쌍중포입니다.",
    colors: { body: "#ff9d73", barrel: "#d9692e", stroke: "#8f3f16" },
    modifiers: {
      maxHealth: 1.14,
      reloadTime: 1.86,
      moveSpeed: 0.82,
      bulletSpeed: 0.92,
      bulletDamage: 1.14,
      bodyDamage: 1.14,
      bulletLife: 1.18,
      radius: 1.08,
    },
    barrels: [
      { sideOffset: -12, forwardOffset: 0, length: 50, width: 18, angleOffset: -0.02 },
      { sideOffset: 12, forwardOffset: 0, length: 50, width: 18, angleOffset: 0.02 },
    ],
    shots: [
      { barrel: 0, spread: 0.02, damageScale: 1.9, speedScale: 0.72, radiusScale: 1.48, recoil: 11 },
      { barrel: 1, spread: 0.02, damageScale: 1.9, speedScale: 0.72, radiusScale: 1.48, recoil: 11 },
    ],
    next: [],
  },
  minigun: {
    id: "minigun",
    label: "미니건",
    tier: 3,
    unlockLevel: 24,
    description: "작은 탄을 미친 속도로 뿌리며 계속 압박합니다.",
    colors: { body: "#d8c26f", barrel: "#9d7e1f", stroke: "#665112" },
    modifiers: {
      maxHealth: 1.02,
      reloadTime: 0.46,
      moveSpeed: 0.98,
      bulletSpeed: 0.88,
      bulletDamage: 0.68,
      bodyDamage: 1,
      bulletLife: 0.82,
      radius: 1.02,
    },
    barrels: [
      { sideOffset: -18, forwardOffset: -3, length: 32, width: 8, angleOffset: -0.04 },
      { sideOffset: -9, forwardOffset: 0, length: 36, width: 8, angleOffset: -0.02 },
      { sideOffset: 0, forwardOffset: 3, length: 42, width: 9, angleOffset: 0 },
      { sideOffset: 9, forwardOffset: 0, length: 36, width: 8, angleOffset: 0.02 },
      { sideOffset: 18, forwardOffset: -3, length: 32, width: 8, angleOffset: 0.04 },
    ],
    shots: [
      { barrel: 0, spread: 0.08, damageScale: 0.18, speedScale: 0.86, radiusScale: 0.58 },
      { barrel: 1, spread: 0.075, damageScale: 0.22, speedScale: 0.88, radiusScale: 0.6 },
      { barrel: 2, spread: 0.07, damageScale: 0.28, speedScale: 0.9, radiusScale: 0.64 },
      { barrel: 3, spread: 0.075, damageScale: 0.22, speedScale: 0.88, radiusScale: 0.6 },
      { barrel: 4, spread: 0.08, damageScale: 0.18, speedScale: 0.86, radiusScale: 0.58 },
    ],
    next: [],
  },
  streamliner: {
    id: "streamliner",
    label: "집중연사",
    tier: 3,
    unlockLevel: 24,
    description: "더 곧고 촘촘한 탄줄기로 사거리를 챙긴 거너 계열입니다.",
    colors: { body: "#e1c97b", barrel: "#a78c2f", stroke: "#6a5816" },
    modifiers: {
      maxHealth: 1.06,
      reloadTime: 0.56,
      moveSpeed: 0.96,
      bulletSpeed: 1.02,
      bulletDamage: 0.78,
      bodyDamage: 1.04,
      bulletLife: 1.02,
      radius: 1.04,
    },
    barrels: [
      { sideOffset: -16, forwardOffset: -2, length: 34, width: 10, angleOffset: -0.02 },
      { sideOffset: -8, forwardOffset: 0, length: 40, width: 10, angleOffset: -0.01 },
      { sideOffset: 0, forwardOffset: 2, length: 48, width: 11, angleOffset: 0 },
      { sideOffset: 8, forwardOffset: 0, length: 40, width: 10, angleOffset: 0.01 },
      { sideOffset: 16, forwardOffset: -2, length: 34, width: 10, angleOffset: 0.02 },
    ],
    shots: [
      { barrel: 0, spread: 0.038, damageScale: 0.28, speedScale: 0.92, radiusScale: 0.66 },
      { barrel: 1, spread: 0.034, damageScale: 0.34, speedScale: 0.96, radiusScale: 0.7 },
      { barrel: 2, spread: 0.03, damageScale: 0.42, speedScale: 1, radiusScale: 0.76 },
      { barrel: 3, spread: 0.034, damageScale: 0.34, speedScale: 0.96, radiusScale: 0.7 },
      { barrel: 4, spread: 0.038, damageScale: 0.28, speedScale: 0.92, radiusScale: 0.66 },
    ],
    next: [],
  },
});

CLASS_DEFS.triplet.next = ["pentaShot", "quadTwin"];
CLASS_DEFS.spreadshot.next = ["barrage", "shotgun"];
CLASS_DEFS.assassin.next = ["ranger", "deadeye"];
CLASS_DEFS.hunter.next = ["predator", "longbow"];
CLASS_DEFS.destroyer.next = ["annihilator", "crusher"];
CLASS_DEFS.gunner.next = ["minigun", "streamliner"];

let entityId = 0;

const state = {
  mode: "menu",
  selectedGameMode: "ffa",
  selectedMapId: loadStoredMapId(),
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  },
  camera: {
    x: WORLD_SIZE / 2,
    y: WORLD_SIZE / 2,
  },
  lastTime: 0,
  matchTime: 0,
  score: 0,
  player: null,
  bullets: [],
  shapes: [],
  enemies: [],
  match: {
    id: "ffa",
    label: "자유전",
    description: "",
    objective: "",
    mapId: "classic",
    mapLabel: "클래식",
    mapTag: "표준",
    mapDescription: "",
    mapPalette: createMapPalette(),
    mapZones: [],
    gridSize: GRID_SIZE,
    spawnPreset: "sides",
    territoryPattern: "sides",
    teamLayout: "sideLanes",
    soccerLayout: "classic",
    teamBased: false,
    scoreLimit: 0,
    timeLimit: 0,
    timeRemaining: 0,
    shapeTargets: { ...TARGET_SHAPES },
    botTargets: { rogue: TARGET_ENEMIES },
    teamScores: { blue: 0, red: 0 },
    territory: null,
    ball: null,
    winner: "",
  },
  feed: [],
  input: {
    keys: new Set(),
    mouse: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      down: false,
    },
  },
  touch: {
    moveId: null,
    aimId: null,
    moveOrigin: { x: 0, y: 0 },
    moveCurrent: { x: 0, y: 0 },
    aimOrigin: { x: 0, y: 0 },
    aimCurrent: { x: 0, y: 0 },
  },
  ui: {
    classMarkup: "",
    compactClassMarkup: "",
    leaderboardMarkup: "",
  },
  chat: {
    messages: [],
    botCooldown: randomBetween(7, 12),
    pendingReplies: [],
  },
  music: {
    audio: null,
    objectUrl: "",
    fileName: "",
    status: "파일 없음",
    volume: loadStoredMusicVolume(),
  },
  creator: {
    open: false,
    unlocked: false,
    invulnerable: false,
    infinitePoints: false,
    message: "비밀번호를 입력해 개발자 기능을 잠금 해제하세요.",
  },
};

const upgradeElements = new Map();
buildMapSelector();
dom.nicknameInput.value = loadStoredNickname();

buildUpgradeList();
initializeMusic();
resizeCanvas();
renderFeed();
syncHud();
syncCreatorPanel();
renderChat();
syncModeSelector();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", () => {
  state.input.mouse.down = false;
});

canvas.addEventListener("mousedown", (event) => {
  onMouseMove(event);
  if (state.mode !== "running") {
    startGame();
  }
  state.input.mouse.down = true;
});

canvas.addEventListener("touchstart", onTouchStart, { passive: false });
canvas.addEventListener("touchmove", onTouchMove, { passive: false });
canvas.addEventListener("touchend", onTouchEnd, { passive: false });
canvas.addEventListener("touchcancel", onTouchEnd, { passive: false });
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

dom.startButton.addEventListener("click", () => {
  startGame();
});

dom.creatorToggle.addEventListener("click", () => {
  state.creator.open = !state.creator.open;
  syncCreatorPanel();
});

dom.creatorUnlock.addEventListener("click", () => {
  unlockCreatorMode();
});

dom.creatorPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    unlockCreatorMode();
  }
});

dom.creatorPanel.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-creator-toggle]");
  if (toggle) {
    toggleCreatorFlag(toggle.dataset.creatorToggle);
    return;
  }

  const action = event.target.closest("[data-creator-action]");
  if (action) {
    runCreatorAction(action.dataset.creatorAction);
  }
});

dom.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitChatMessage();
});

dom.musicFile.addEventListener("change", () => {
  handleMusicFileSelection();
});

dom.musicToggle.addEventListener("click", () => {
  toggleMusicPlayback();
});

dom.musicVolume.addEventListener("input", () => {
  setMusicVolume(Number(dom.musicVolume.value) / 100);
});

dom.mapSelector.addEventListener("click", (event) => {
  const button = event.target.closest("[data-game-map]");
  if (button) {
    setSelectedGameMap(button.dataset.gameMap);
  }
});

for (const button of dom.modeButtons) {
  button.addEventListener("click", () => {
    setSelectedGameMode(button.dataset.gameMode);
  });
}

dom.nicknameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    startGame();
  }
});

dom.nicknameInput.addEventListener("input", () => {
  const clean = sanitizeNickname(dom.nicknameInput.value);
  if (dom.nicknameInput.value !== clean) {
    dom.nicknameInput.value = clean;
  }
  saveStoredNickname(clean);
});

dom.classList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-class-choice]");
  if (!button) {
    return;
  }

  selectClass(button.dataset.classChoice);
});

dom.compactClassChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-compact-class-choice]");
  if (!button) {
    return;
  }

  selectClass(button.dataset.compactClassChoice);
});

requestAnimationFrame(frame);

function buildUpgradeList() {
  dom.upgradeList.innerHTML = UPGRADE_DEFS.map((upgrade) => {
    const pips = Array.from({ length: MAX_UPGRADE_LEVEL }, () => {
      return '<span class="upgrade__pip"></span>';
    }).join("");

    return `
      <button
        class="upgrade"
        data-upgrade="${upgrade.id}"
        type="button"
        style="--pip-count:${MAX_UPGRADE_LEVEL};"
      >
        <div class="upgrade__top">
          <span class="upgrade__label">${upgrade.hotkey}. ${upgrade.label}</span>
          <strong class="upgrade__value">0 / ${MAX_UPGRADE_LEVEL}</strong>
        </div>
        <div class="upgrade__pips">${pips}</div>
      </button>
    `;
  }).join("");

  for (const upgrade of UPGRADE_DEFS) {
    const button = dom.upgradeList.querySelector(`[data-upgrade="${upgrade.id}"]`);
    const value = button.querySelector(".upgrade__value");
    const pips = [...button.querySelectorAll(".upgrade__pip")];

    button.addEventListener("click", () => {
      applyUpgrade(upgrade.id);
    });

    upgradeElements.set(upgrade.id, { button, value, pips });
  }
}

function buildMapSelector() {
  dom.mapCount.textContent = `${MAP_IDS.length}개`;
  dom.mapSelector.innerHTML = MAP_IDS.map((mapId) => {
    const map = getMapDef(mapId);
    return `
      <button class="map-card" data-game-map="${map.id}" type="button">
        <span class="map-card__tag">${map.tag}</span>
        <strong class="map-card__title">${map.label}</strong>
        <span class="map-card__meta">${map.description}</span>
      </button>
    `;
  }).join("");
}

function getGameModeDef(modeId = state.selectedGameMode) {
  return GAME_MODE_DEFS[modeId] || GAME_MODE_DEFS.ffa;
}

function getMapDef(mapId = state.selectedMapId) {
  return MAP_DEFS[mapId] || MAP_DEFS.classic;
}

function setSelectedGameMode(modeId) {
  if (!GAME_MODE_DEFS[modeId]) {
    return;
  }

  state.selectedGameMode = modeId;
  syncModeSelector();
}

function setSelectedGameMap(mapId) {
  if (!MAP_DEFS[mapId]) {
    return;
  }

  state.selectedMapId = mapId;
  saveStoredMapId(mapId);
  syncModeSelector();
}

function syncModeSelector() {
  const modeDef = getGameModeDef();
  const mapDef = getMapDef();
  for (const button of dom.modeButtons) {
    button.classList.toggle("is-active", button.dataset.gameMode === modeDef.id);
  }

  for (const button of dom.mapSelector.querySelectorAll("[data-game-map]")) {
    button.classList.toggle("is-active", button.dataset.gameMap === mapDef.id);
  }

  dom.overlayTitle.textContent = `${modeDef.label} · ${mapDef.label}`;
  dom.overlayText.textContent = `${modeDef.description} ${modeDef.objective}`;
  dom.mapSummary.textContent = `${mapDef.label}: ${mapDef.tag}. ${mapDef.description}`;
  dom.startButton.textContent = `${modeDef.label} 시작`;
}

function createMatchState(modeId, mapId) {
  const modeDef = getGameModeDef(modeId);
  const mapDef = getMapDef(mapId);
  return {
    id: modeDef.id,
    label: modeDef.label,
    description: modeDef.description,
    objective: modeDef.objective,
    mapId: mapDef.id,
    mapLabel: mapDef.label,
    mapTag: mapDef.tag,
    mapDescription: mapDef.description,
    mapPalette: mapDef.palette,
    mapZones: mapDef.zones,
    gridSize: mapDef.gridSize || GRID_SIZE,
    spawnPreset: mapDef.spawnPreset || "sides",
    territoryPattern: mapDef.territoryPattern || "sides",
    teamLayout: mapDef.teamLayout || "sideLanes",
    soccerLayout: mapDef.soccerLayout || "classic",
    teamBased: Boolean(modeDef.teamBased),
    scoreLimit: modeDef.scoreLimit || 0,
    timeLimit: modeDef.timeLimit || 0,
    timeRemaining: modeDef.timeLimit || 0,
    shapeTargets: buildScaledTargets(modeDef.shapeTargets, mapDef.shapeScale, mapDef.shapeBias),
    botTargets: buildScaledTargets(modeDef.botTargets, mapDef.botScale),
    teamScores: { blue: 0, red: 0 },
    territory: modeDef.id === "territory" ? createTerritoryState(mapDef) : null,
    ball: modeDef.hasBall ? createSoccerBall(mapDef) : null,
    winner: "",
  };
}

function buildScaledTargets(baseTargets, scale = 1, bias = {}) {
  const result = {};
  for (const [key, value] of Object.entries(baseTargets)) {
    if (value <= 0) {
      result[key] = 0;
      continue;
    }

    const nextValue = Math.round(value * scale * (bias[key] || 1));
    result[key] = Math.max(1, nextValue);
  }
  return result;
}

function resizeCanvas() {
  state.viewport.width = window.innerWidth;
  state.viewport.height = window.innerHeight;
  state.viewport.dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = state.viewport.width * state.viewport.dpr;
  canvas.height = state.viewport.height * state.viewport.dpr;
  canvas.style.width = `${state.viewport.width}px`;
  canvas.style.height = `${state.viewport.height}px`;

  ctx.setTransform(state.viewport.dpr, 0, 0, state.viewport.dpr, 0, 0);
}

function frame(timestamp) {
  const delta = Math.min((timestamp - state.lastTime) / 1000 || 0, 0.032);
  state.lastTime = timestamp;

  if (state.mode === "running") {
    update(delta);
  }

  render();
  requestAnimationFrame(frame);
}

function startGame() {
  state.match = createMatchState(state.selectedGameMode, state.selectedMapId);
  state.mode = "running";
  state.matchTime = 0;
  state.score = 0;
  state.feed = [];
  state.bullets = [];
  state.shapes = [];
  state.enemies = [];
  state.player = createPlayer(resolvePlayerNickname());
  state.camera.x = state.player.x;
  state.camera.y = state.player.y;
  resetChat();

  spawnInitialWorld();

  pushFeed(`${state.match.label} · ${state.match.mapLabel} 시작. ${state.match.objective}`);
  pushFeed(
    state.match.teamBased
      ? "당신은 블루 팀입니다. 아군과 함께 움직이세요."
      : "도형과 로그 탱크를 정리해 개인 점수를 올리세요.",
  );
  pushFeed("1-6 키로 업그레이드 포인트를 사용하세요.");
  hideOverlay();
  syncHud();
}

function createPlayer(nickname) {
  const spawn = getSpawnPointForTeam("blue");
  const player = {
    id: nextId(),
    kind: "player",
    nickname,
    team: "blue",
    x: spawn.x,
    y: spawn.y,
    radius: 32,
    angle: 0,
    color: "#48b4ff",
    barrelColor: "#1f7ed8",
    stroke: "#11599f",
    level: 1,
    xp: 0,
    xpToNext: 120,
    points: 0,
    classId: "basic",
    lastClassUnlockKey: "",
    health: 120,
    maxHealth: 120,
    baseMaxHealth: 120,
    baseReload: 0.34,
    baseMoveSpeed: 250,
    baseBulletSpeed: 560,
    baseBulletDamage: 16,
    baseBodyDamage: 20,
    bulletSpeed: 560,
    bulletDamage: 16,
    reloadTime: 0.34,
    moveSpeed: 250,
    bodyDamage: 20,
    bulletLife: 1.18,
    barrels: [],
    weaponShots: [],
    cooldown: 0,
    regenDelay: 0,
    hitFlash: 0,
    alive: true,
    upgrades: {
      maxHealth: 0,
      bulletDamage: 0,
      reload: 0,
      bulletSpeed: 0,
      movement: 0,
      bodyDamage: 0,
    },
  };

  recomputePlayerStats(player, false);
  return player;
}

function spawnInitialWorld() {
  for (const [type, count] of Object.entries(state.match.shapeTargets)) {
    for (let index = 0; index < count; index += 1) {
      state.shapes.push(createShape(type));
    }
  }

  for (const [team, count] of Object.entries(state.match.botTargets)) {
    for (let index = 0; index < count; index += 1) {
      state.enemies.push(createEnemyTank(team));
    }
  }
}

function createShape(type) {
  const template = SHAPE_TYPES[type];
  const position = randomPointAwayFromPlayer(template.minSpawnDistance || 520);
  const scale = randomBetween(template.scaleMin || 0.9, template.scaleMax || 1.1);

  return {
    id: nextId(),
    kind: "shape",
    type,
    x: position.x,
    y: position.y,
    radius: template.radius * scale,
    rotation: randomBetween(0, TAU),
    spin: randomBetween(-0.8, 0.8),
    heading: randomBetween(0, TAU),
    speed: template.speed * randomBetween(0.75, 1.2),
    wanderTimer: randomBetween(0.9, 2.6),
    color: template.color,
    stroke: template.stroke,
    maxHealth: Math.round(template.maxHealth * scale),
    health: Math.round(template.maxHealth * scale),
    damage: template.damage,
    xpReward: template.xp,
    hitFlash: 0,
    dead: false,
  };
}

function createEnemyTank(team = "rogue") {
  const palette = TEAM_DEFS[team] || TEAM_DEFS.rogue;
  const position = getSpawnPointForTeam(team);
  const seed = randomBetween(0, TAU);
  const enemy = {
    id: nextId(),
    kind: "enemy",
    nickname: makeEnemyNickname(team),
    team,
    x: position.x,
    y: position.y,
    radius: 30,
    angle: 0,
    color: palette.body,
    barrelColor: palette.barrel,
    stroke: palette.stroke,
    level: 1,
    xp: 0,
    xpToNext: 120,
    xpGainRate: randomBetween(9, 15),
    score: 0,
    baseRadius: 30,
    baseMaxHealth: 152,
    baseMoveSpeed: 158,
    baseBodyDamage: 18,
    baseBulletDamage: 13,
    baseBulletSpeed: 430,
    baseBulletLife: 1.4,
    baseReloadTime: randomBetween(0.62, 0.84),
    maxHealth: 108,
    health: 108,
    moveSpeed: 158,
    bodyDamage: 18,
    bulletDamage: 13,
    bulletSpeed: 430,
    bulletLife: 1.4,
    barrels: [{ sideOffset: 0, forwardOffset: 2, length: 40, width: 20, angleOffset: 0 }],
    weaponShots: [{ barrel: 0, spread: 0.05 }],
    reloadTime: 0.72,
    cooldown: randomBetween(0.2, 0.72),
    aggroRange: 1100,
    seed,
    wanderTimer: randomBetween(0.8, 2),
    heading: seed,
    hitFlash: 0,
    dead: false,
    xpReward: 76,
  };

  const spawnLevel = getEnemySpawnLevel();
  setEnemyLevel(enemy, spawnLevel, false);
  enemy.health = enemy.maxHealth;
  enemy.score = Math.round(enemy.level * 110 + randomBetween(0, 80));
  return enemy;
}

function createSoccerBall(mapDef = getMapDef()) {
  const config = getSoccerFieldConfig(mapDef.soccerLayout);
  return {
    x: config.center.x,
    y: config.center.y,
    vx: 0,
    vy: 0,
    radius: 34,
    color: "#f6f0df",
    stroke: "#c4ae70",
    hitFlash: 0,
  };
}

function getSpawnPointForTeam(team) {
  const zones = getSpawnZonesForTeam(team);
  return sampleSpawnPoint(zones, state.match.teamBased ? 0 : 860);
}

function createTerritoryState(mapDef = getMapDef()) {
  const cols = Math.ceil(WORLD_SIZE / TERRITORY_CELL_SIZE);
  const rows = Math.ceil(WORLD_SIZE / TERRITORY_CELL_SIZE);
  const cells = [];
  const counts = { blue: 0, red: 0 };

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const owner = getInitialTerritoryOwner(mapDef.territoryPattern, row, col, rows, cols);

      if (owner) {
        counts[owner] += 1;
      }

      cells.push({ owner });
    }
  }

  return {
    cols,
    rows,
    cellSize: TERRITORY_CELL_SIZE,
    cells,
    counts,
  };
}

function getSpawnZonesForTeam(team) {
  if (state.match.id === "soccer") {
    return getSoccerSpawnZones(team);
  }

  const preset = state.match.spawnPreset || "sides";
  const isTeamMatch = state.match.teamBased;
  const zones = [];

  if (preset === "sides") {
    if (!isTeamMatch) {
      return [
        normalizedRect(0.12, 0.12, 0.76, 0.76, ""),
      ];
    }

    if (team === "blue") {
      return [normalizedRect(0.12, 0.2, 0.16, 0.6, "")];
    }

    return [normalizedRect(0.72, 0.2, 0.16, 0.6, "")];
  }

  if (preset === "corners") {
    if (!isTeamMatch) {
      return [
        normalizedRect(0.1, 0.1, 0.18, 0.18, ""),
        normalizedRect(0.72, 0.1, 0.18, 0.18, ""),
        normalizedRect(0.1, 0.72, 0.18, 0.18, ""),
        normalizedRect(0.72, 0.72, 0.18, 0.18, ""),
      ];
    }

    if (team === "blue") {
      return [
        normalizedRect(0.08, 0.08, 0.18, 0.18, ""),
        normalizedRect(0.08, 0.74, 0.18, 0.18, ""),
      ];
    }

    return [
      normalizedRect(0.74, 0.08, 0.18, 0.18, ""),
      normalizedRect(0.74, 0.74, 0.18, 0.18, ""),
    ];
  }

  if (preset === "northSouth") {
    if (!isTeamMatch) {
      return [normalizedRect(0.14, 0.14, 0.72, 0.72, "")];
    }

    if (team === "blue") {
      return [normalizedRect(0.22, 0.08, 0.56, 0.16, "")];
    }

    return [normalizedRect(0.22, 0.76, 0.56, 0.16, "")];
  }

  if (preset === "diagonal") {
    if (!isTeamMatch) {
      return [
        normalizedRect(0.08, 0.08, 0.2, 0.2, ""),
        normalizedRect(0.72, 0.72, 0.2, 0.2, ""),
        normalizedRect(0.08, 0.72, 0.2, 0.2, ""),
        normalizedRect(0.72, 0.08, 0.2, 0.2, ""),
      ];
    }

    if (team === "blue") {
      return [normalizedRect(0.08, 0.08, 0.2, 0.2, ""), normalizedRect(0.18, 0.18, 0.14, 0.14, "")];
    }

    return [normalizedRect(0.72, 0.72, 0.2, 0.2, ""), normalizedRect(0.68, 0.68, 0.14, 0.14, "")];
  }

  if (preset === "ring") {
    if (!isTeamMatch) {
      return [
        normalizedRing(0.5, 0.5, 0.34, 0.18, ""),
      ];
    }

    if (team === "blue") {
      return [
        normalizedRect(0.14, 0.18, 0.18, 0.22, ""),
        normalizedRect(0.14, 0.6, 0.18, 0.22, ""),
      ];
    }

    return [
      normalizedRect(0.68, 0.18, 0.18, 0.22, ""),
      normalizedRect(0.68, 0.6, 0.18, 0.22, ""),
    ];
  }

  if (preset === "corridor") {
    if (!isTeamMatch) {
      return [
        normalizedRect(0.12, 0.16, 0.76, 0.68, ""),
      ];
    }

    if (team === "blue") {
      return [normalizedRect(0.08, 0.34, 0.18, 0.32, "")];
    }

    return [normalizedRect(0.74, 0.34, 0.18, 0.32, "")];
  }

  if (preset === "quadrants") {
    if (!isTeamMatch) {
      return [
        normalizedRect(0.08, 0.08, 0.36, 0.36, ""),
        normalizedRect(0.56, 0.08, 0.36, 0.36, ""),
        normalizedRect(0.08, 0.56, 0.36, 0.36, ""),
        normalizedRect(0.56, 0.56, 0.36, 0.36, ""),
      ];
    }

    if (team === "blue") {
      return [
        normalizedRect(0.08, 0.08, 0.22, 0.22, ""),
        normalizedRect(0.08, 0.7, 0.22, 0.22, ""),
      ];
    }

    return [
      normalizedRect(0.7, 0.08, 0.22, 0.22, ""),
      normalizedRect(0.7, 0.7, 0.22, 0.22, ""),
    ];
  }

  if (preset === "pockets") {
    if (!isTeamMatch) {
      return [normalizedRect(0.12, 0.12, 0.76, 0.76, "")];
    }

    if (team === "blue") {
      return [
        normalizedRect(0.08, 0.16, 0.16, 0.18, ""),
        normalizedRect(0.08, 0.41, 0.16, 0.18, ""),
        normalizedRect(0.08, 0.66, 0.16, 0.18, ""),
      ];
    }

    return [
      normalizedRect(0.76, 0.16, 0.16, 0.18, ""),
      normalizedRect(0.76, 0.41, 0.16, 0.18, ""),
      normalizedRect(0.76, 0.66, 0.16, 0.18, ""),
    ];
  }

  return zones.length ? zones : [normalizedRect(0.14, 0.14, 0.72, 0.72, "")];
}

function getSoccerSpawnZones(team) {
  const config = getSoccerFieldConfig();
  const { inset, orientation } = config;
  const ratioInset = inset / WORLD_SIZE;

  if (orientation === "vertical") {
    if (team === "blue") {
      return [normalizedRect(0.34, ratioInset + 0.04, 0.32, 0.18, "")];
    }

    return [normalizedRect(0.34, 1 - ratioInset - 0.22, 0.32, 0.18, "")];
  }

  if (team === "blue") {
    return [normalizedRect(ratioInset + 0.04, 0.34, 0.18, 0.32, "")];
  }

  return [normalizedRect(1 - ratioInset - 0.22, 0.34, 0.18, 0.32, "")];
}

function sampleSpawnPoint(zones, minDistance = 0) {
  const anchor = state.player || { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
  const safeZones = zones?.length ? zones : [normalizedRect(0.14, 0.14, 0.72, 0.72, "")];

  for (let attempt = 0; attempt < 48; attempt += 1) {
    const zone = sample(safeZones);
    const point = samplePointInZone(zone);
    if (!minDistance || distanceBetween(point, anchor) >= minDistance) {
      return point;
    }
  }

  return samplePointInZone(sample(safeZones));
}

function samplePointInZone(zone) {
  const scale = zone.normalized ? WORLD_SIZE : 1;
  if (zone.shape === "circle" || zone.shape === "ring") {
    const centerX = zone.x * scale;
    const centerY = zone.y * scale;
    const outer = (zone.outerRadius || zone.radius) * scale;
    const inner = (zone.innerRadius || 0) * scale;
    const angle = randomBetween(0, TAU);
    const radius = Math.sqrt(randomBetween(inner * inner, outer * outer));
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  }

  const x = zone.x * scale;
  const y = zone.y * scale;
  const width = zone.width * scale;
  const height = zone.height * scale;
  return {
    x: randomBetween(x, x + width),
    y: randomBetween(y, y + height),
  };
}

function getInitialTerritoryOwner(pattern, row, col, rows, cols) {
  if (pattern === "sides") {
    if (col <= 1) {
      return "blue";
    }
    if (col >= cols - 2) {
      return "red";
    }
    return "";
  }

  if (pattern === "northSouth") {
    if (row <= 1) {
      return "blue";
    }
    if (row >= rows - 2) {
      return "red";
    }
    return "";
  }

  if (pattern === "diagonal") {
    if (col <= 1 || row <= 1) {
      return "blue";
    }
    if (col >= cols - 2 || row >= rows - 2) {
      return "red";
    }
    return "";
  }

  if (pattern === "corners") {
    if ((col <= 1 && row <= 1) || (col <= 1 && row >= rows - 2)) {
      return "blue";
    }
    if ((col >= cols - 2 && row <= 1) || (col >= cols - 2 && row >= rows - 2)) {
      return "red";
    }
    return "";
  }

  if (pattern === "ring") {
    const edge = row <= 1 || row >= rows - 2 || col <= 1 || col >= cols - 2;
    if (edge) {
      return col < cols / 2 ? "blue" : "red";
    }
    const nearCenter = Math.abs(col - cols / 2) <= 1 && Math.abs(row - rows / 2) <= 1;
    if (nearCenter) {
      return row < rows / 2 ? "blue" : "red";
    }
    return "";
  }

  if (pattern === "cross") {
    if (Math.abs(col - cols * 0.2) <= 1 || Math.abs(col - cols * 0.3) <= 1) {
      return "blue";
    }
    if (Math.abs(col - cols * 0.7) <= 1 || Math.abs(col - cols * 0.8) <= 1) {
      return "red";
    }
    return row === Math.floor(rows / 2) ? (col < cols / 2 ? "blue" : "red") : "";
  }

  if (pattern === "checker") {
    if ((row + col) % 6 === 0 && col < cols / 2) {
      return "blue";
    }
    if ((row + col + 3) % 6 === 0 && col >= cols / 2) {
      return "red";
    }
    return "";
  }

  if (pattern === "quadrants") {
    const nearBlue = col <= 2 && (row <= 2 || row >= rows - 3);
    const nearRed = col >= cols - 3 && (row <= 2 || row >= rows - 3);
    if (nearBlue) {
      return "blue";
    }
    if (nearRed) {
      return "red";
    }
  }

  return "";
}

function update(delta) {
  if (!state.player) {
    return;
  }

  state.matchTime += delta;
  if (state.player.alive) {
    updatePlayer(delta);
  }
  updateShapes(delta);
  updateEnemies(delta);
  updateBullets(delta);
  updateMatchObjectives(delta);
  updateMatchTimer(delta);
  updateCollisions(delta);
  cleanupEntities();
  maintainPopulation();
  updateChat(delta);
  syncHud();
}

function updateMatchTimer(delta) {
  if (!state.match.timeLimit || state.mode !== "running") {
    return;
  }

  state.match.timeRemaining = Math.max(0, state.match.timeRemaining - delta);
  if (state.match.timeRemaining === 0) {
    finishTimedMatch();
  }
}

function updatePlayer(delta) {
  const player = state.player;
  const movement = getMovementVector();

  player.x += movement.x * player.moveSpeed * delta;
  player.y += movement.y * player.moveSpeed * delta;
  clampEntityToWorld(player);

  player.angle = getAimAngle();
  player.cooldown -= delta;
  player.regenDelay = Math.max(0, player.regenDelay - delta);
  player.hitFlash = Math.max(0, player.hitFlash - delta * 4);

  if (player.regenDelay === 0 && player.health < player.maxHealth) {
    player.health = Math.min(player.maxHealth, player.health + player.maxHealth * 0.05 * delta);
  }

  if (shouldFirePlayer()) {
    attemptPlayerShot();
  }

  state.camera.x = lerp(state.camera.x, player.x, 1 - Math.exp(-delta * 9));
  state.camera.y = lerp(state.camera.y, player.y, 1 - Math.exp(-delta * 9));
}

function updateShapes(delta) {
  for (const shape of state.shapes) {
    shape.rotation += shape.spin * delta;
    shape.hitFlash = Math.max(0, shape.hitFlash - delta * 4);
    shape.wanderTimer -= delta;

    if (shape.wanderTimer <= 0) {
      shape.heading += randomBetween(-0.9, 0.9);
      shape.wanderTimer = randomBetween(0.8, 2.4);
    }

    if (shape.speed > 0) {
      shape.x += Math.cos(shape.heading) * shape.speed * delta;
      shape.y += Math.sin(shape.heading) * shape.speed * delta;
      bounceFromWorld(shape);
    }
  }
}

function updateEnemies(delta) {
  for (const enemy of state.enemies) {
    enemy.hitFlash = Math.max(0, enemy.hitFlash - delta * 4);
    enemy.cooldown -= delta;
    enemy.xp += enemy.xpGainRate * delta;
    enemy.score += enemy.xpGainRate * 4.5 * delta;

    while (enemy.xp >= enemy.xpToNext) {
      enemy.xp -= enemy.xpToNext;
      levelUpEnemy(enemy);
    }

    const target = getEnemyCombatTarget(enemy);
    if (target) {
      const toTargetX = target.x - enemy.x;
      const toTargetY = target.y - enemy.y;
      const distance = Math.hypot(toTargetX, toTargetY);

      if (distance <= enemy.aggroRange) {
        const targetAngle = Math.atan2(toTargetY, toTargetX);
        enemy.angle = lerpAngle(enemy.angle, targetAngle, 1 - Math.exp(-delta * 7));

        const orbit = Math.sin(performance.now() * 0.0012 + enemy.seed) * 0.45;
        const moveAngle = targetAngle + orbit + (distance < 260 ? Math.PI : 0);
        const moveX = Math.cos(moveAngle) * 0.85 + Math.cos(targetAngle + Math.PI / 2) * 0.35;
        const moveY = Math.sin(moveAngle) * 0.85 + Math.sin(targetAngle + Math.PI / 2) * 0.35;
        const moveLength = Math.hypot(moveX, moveY) || 1;

        enemy.x += (moveX / moveLength) * enemy.moveSpeed * delta;
        enemy.y += (moveY / moveLength) * enemy.moveSpeed * delta;
        clampEntityToWorld(enemy);

        if (distance < 860 && enemy.cooldown <= 0) {
          fireTankWeapon(enemy, "enemy");
          enemy.cooldown = enemy.reloadTime;
        }
        continue;
      }
    }

    const objective = getEnemyObjective(enemy);
    if (objective) {
      const targetAngle = Math.atan2(objective.y - enemy.y, objective.x - enemy.x);
      enemy.angle = lerpAngle(enemy.angle, targetAngle, 1 - Math.exp(-delta * 4));
      enemy.x += Math.cos(targetAngle) * enemy.moveSpeed * 0.56 * delta;
      enemy.y += Math.sin(targetAngle) * enemy.moveSpeed * 0.56 * delta;
      clampEntityToWorld(enemy);
    } else {
      enemy.wanderTimer -= delta;
      if (enemy.wanderTimer <= 0) {
        enemy.heading += randomBetween(-1.2, 1.2);
        enemy.wanderTimer = randomBetween(0.7, 1.8);
      }

      enemy.angle = lerpAngle(enemy.angle, enemy.heading, 1 - Math.exp(-delta * 3));
      enemy.x += Math.cos(enemy.heading) * enemy.moveSpeed * 0.35 * delta;
      enemy.y += Math.sin(enemy.heading) * enemy.moveSpeed * 0.35 * delta;
      bounceFromWorld(enemy);
    }
  }
}

function updateMatchObjectives(delta) {
  if (state.match.id === "territory") {
    updateTerritoryControl(delta);
  }

  if (state.match.id === "soccer") {
    updateSoccerBall(delta);
  }
}

function updateBullets(delta) {
  for (const bullet of state.bullets) {
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    bullet.life -= delta;
  }
}

function updateCollisions(delta) {
  const player = state.player;

  for (const bullet of state.bullets) {
    if (bullet.dead || bullet.life <= 0 || !isInWorld(bullet)) {
      bullet.dead = true;
      continue;
    }

    if (bullet.owner === "player") {
      for (const shape of state.shapes) {
        if (!shape.dead && circlesOverlap(bullet, shape)) {
          bullet.dead = true;
          damageEntity(shape, bullet.damage, { type: "player", team: player?.team || "blue" });
          break;
        }
      }

      if (!bullet.dead) {
        for (const enemy of state.enemies) {
          if (!enemy.dead && isHostilePair(player, enemy) && circlesOverlap(bullet, enemy)) {
            bullet.dead = true;
            damageEntity(enemy, bullet.damage, { type: "player", team: player?.team || "blue" });
            break;
          }
        }
      }
    } else {
      if (player.alive && isHostileTeamToTank(bullet.sourceTeam, player.team) && circlesOverlap(bullet, player)) {
        bullet.dead = true;
        damageEntity(player, bullet.damage, { type: "enemy", team: bullet.sourceTeam });
      }

      if (!bullet.dead && state.match.teamBased) {
        for (const enemy of state.enemies) {
          if (enemy.dead || enemy.id === bullet.sourceId || !isHostileTeamToTank(bullet.sourceTeam, enemy.team)) {
            continue;
          }

          if (circlesOverlap(bullet, enemy)) {
            bullet.dead = true;
            damageEntity(enemy, bullet.damage, { type: "enemy", team: bullet.sourceTeam });
            break;
          }
        }
      }
    }
  }

  for (const shape of state.shapes) {
    if (shape.dead) {
      continue;
    }

    if (player.alive && circlesOverlap(player, shape)) {
      separateCircles(player, shape, 0.62);
      damageEntity(player, shape.damage * delta, "shape");
      damageEntity(shape, player.bodyDamage * delta * 0.68, { type: "player", team: player.team });
    }
  }

  for (const enemy of state.enemies) {
    if (enemy.dead) {
      continue;
    }

    if (player.alive && circlesOverlap(player, enemy)) {
      separateCircles(player, enemy, 0.52);
      if (isHostilePair(player, enemy)) {
        damageEntity(player, enemy.bodyDamage * delta, { type: "enemy", team: enemy.team });
        damageEntity(enemy, player.bodyDamage * delta * 0.9, { type: "player", team: player.team });
      }
    }
  }

  if (state.match.teamBased) {
    for (let index = 0; index < state.enemies.length; index += 1) {
      const left = state.enemies[index];
      if (left.dead) {
        continue;
      }

      for (let inner = index + 1; inner < state.enemies.length; inner += 1) {
        const right = state.enemies[inner];
        if (!right.dead && circlesOverlap(left, right)) {
          separateCircles(left, right, 0.5);
        }
      }
    }
  }

  if (state.match.ball) {
    const ball = state.match.ball;
    const tanks = [];
    if (player.alive) {
      tanks.push(player);
    }
    tanks.push(...state.enemies.filter((enemy) => !enemy.dead));

    for (const tank of tanks) {
      if (!circlesOverlap(tank, ball)) {
        continue;
      }

      const dx = ball.x - tank.x;
      const dy = ball.y - tank.y;
      const distance = Math.hypot(dx, dy) || 1;
      const nx = dx / distance;
      const ny = dy / distance;
      const overlap = tank.radius + ball.radius - distance;

      ball.x += nx * overlap;
      ball.y += ny * overlap;
      ball.vx += nx * (180 + tank.moveSpeed * 0.72);
      ball.vy += ny * (180 + tank.moveSpeed * 0.72);
      ball.hitFlash = 0.18;
      clampBallToWorld(ball);
    }

    for (const bullet of state.bullets) {
      if (!bullet.dead && circlesOverlap(bullet, ball)) {
        bullet.dead = true;
        ball.vx += bullet.vx * 0.12;
        ball.vy += bullet.vy * 0.12;
        ball.hitFlash = 0.2;
      }
    }
  }
}

function cleanupEntities() {
  state.bullets = state.bullets.filter((bullet) => !bullet.dead && bullet.life > 0 && isInWorld(bullet));
  state.shapes = state.shapes.filter((shape) => !shape.dead);
  state.enemies = state.enemies.filter((enemy) => !enemy.dead);
}

function maintainPopulation() {
  const counts = Object.fromEntries(
    Object.keys(state.match.shapeTargets).map((type) => [type, 0]),
  );

  for (const shape of state.shapes) {
    if (counts[shape.type] !== undefined) {
      counts[shape.type] += 1;
    }
  }

  for (const [type, target] of Object.entries(state.match.shapeTargets)) {
    while (counts[type] < target) {
      state.shapes.push(createShape(type));
      counts[type] += 1;
    }
  }

  const botCounts = Object.fromEntries(
    Object.keys(state.match.botTargets).map((team) => [team, 0]),
  );

  for (const enemy of state.enemies) {
    if (botCounts[enemy.team] !== undefined) {
      botCounts[enemy.team] += 1;
    }
  }

  for (const [team, target] of Object.entries(state.match.botTargets)) {
    while ((botCounts[team] || 0) < target) {
      state.enemies.push(createEnemyTank(team));
      botCounts[team] += 1;
    }
  }
}

function attemptPlayerShot() {
  const player = state.player;
  if (player.cooldown > 0) {
    return;
  }

  fireTankWeapon(player, "player");
  player.cooldown = player.reloadTime;
}

function fireTankWeapon(source, owner) {
  const barrels = source.barrels?.length ? source.barrels : [{ sideOffset: 0, forwardOffset: 2, length: 40, width: 20, angleOffset: 0 }];
  const shots = source.weaponShots?.length ? source.weaponShots : [{ barrel: 0, spread: owner === "player" ? 0.02 : 0.05 }];

  for (const shot of shots) {
    const barrel = barrels[shot.barrel] || barrels[0];
    spawnBullet(source, owner, barrel, shot);
  }
}

function spawnBullet(source, owner, barrel, shot) {
  const spread = shot.spread ?? (owner === "player" ? 0.02 : 0.05);
  const localAngle = (barrel.angleOffset || 0) + (shot.angleOffset || 0) + randomBetween(-spread, spread);
  const worldAngle = source.angle + localAngle;
  const muzzle = getBarrelMuzzle(source, barrel);
  const bulletSpeed = source.bulletSpeed * (shot.speedScale ?? 1);
  const damage = source.bulletDamage * (shot.damageScale ?? 1);
  const life = source.bulletLife * (shot.lifeScale ?? 1);
  const radius = (owner === "player" ? 8 : 7) * (shot.radiusScale ?? 1);
  const recoil = shot.recoil ?? 5;

  state.bullets.push({
    id: nextId(),
    kind: "bullet",
    owner,
    x: muzzle.x,
    y: muzzle.y,
    vx: Math.cos(worldAngle) * bulletSpeed,
    vy: Math.sin(worldAngle) * bulletSpeed,
    radius,
    damage,
    life,
    sourceId: source.id,
    sourceTeam: source.team || null,
    color: owner === "player" ? "#d2f4ff" : "#ffc2cf",
    glow: owner === "player" ? "rgba(76, 180, 255, 0.35)" : "rgba(255, 110, 137, 0.35)",
    dead: false,
  });

  source.x -= Math.cos(worldAngle) * recoil;
  source.y -= Math.sin(worldAngle) * recoil;
  clampEntityToWorld(source);
}

function damageEntity(entity, amount, source) {
  if (entity.dead || amount <= 0) {
    return;
  }

  const sourceType = getSourceType(source);

  if (entity.kind === "player" && state.creator.invulnerable) {
    return;
  }

  if (entity.kind === "enemy" && sourceType === "player") {
    amount *= ENEMY_DAMAGE_TAKEN_MULTIPLIER;
  }

  entity.health -= amount;
  entity.hitFlash = 0.24;

  if (entity.kind === "player") {
    entity.regenDelay = 3;
  }

  if (entity.health <= 0) {
    entity.dead = true;
    onEntityDestroyed(entity, source);
  }
}

function onEntityDestroyed(entity, source) {
  const sourceType = getSourceType(source);
  const sourceTeam = getSourceTeam(source);

  if (entity.kind === "shape" && sourceType === "player") {
    gainXp(entity.xpReward);
    state.score += entity.xpReward;
    pushFeed(`${getShapeLabel(entity.type)} 파괴. +${entity.xpReward} 경험치`);
    return;
  }

  if (entity.kind === "enemy") {
    if (sourceType === "player") {
      gainXp(entity.xpReward);
      state.score += entity.xpReward;
      pushFeed(`레벨 ${entity.level} ${getTankLabel(entity)} 파괴. +${entity.xpReward} 경험치`);
    }

    if (state.match.id === "team" && sourceTeam && sourceTeam !== entity.team) {
      addTeamScore(sourceTeam, 1);
      if (state.mode === "running") {
        pushFeed(`${TEAM_DEFS[sourceTeam].label} 팀 처치 점수 +1`);
      }
    }
    return;
  }

  if (entity.kind === "player") {
    if (state.match.id === "team" && sourceTeam && sourceTeam !== entity.team) {
      addTeamScore(sourceTeam, 1);
      if (state.mode !== "running") {
        return;
      }
      pushFeed(`${TEAM_DEFS[sourceTeam].label} 팀 처치 점수 +1`);
    }

    if (state.match.teamBased) {
      pushFeed("플레이어가 격파되었습니다. 블루 진영에서 재배치합니다.");
      respawnPlayer();
      return;
    }

    entity.alive = false;
    state.mode = "dead";
    setOverlay(
      "전차 파괴됨",
      `점수 ${Math.floor(state.score)}. R 키 또는 시작 버튼으로 리스폰하세요.`,
      "리스폰",
    );
    syncChatStatus();
  }
}

function updateTerritoryControl(delta) {
  const territory = state.match.territory;
  if (!territory) {
    return;
  }

  if (state.player.alive) {
    paintTerritoryAt(state.player.x, state.player.y, state.player.team, state.player.radius * 1.8);
  }

  for (const enemy of state.enemies) {
    if (!enemy.dead) {
      paintTerritoryAt(enemy.x, enemy.y, enemy.team, enemy.radius * 1.5);
    }
  }

  state.match.teamScores.blue = territory.counts.blue;
  state.match.teamScores.red = territory.counts.red;

  if (state.match.scoreLimit && territory.counts.blue >= state.match.scoreLimit) {
    finishTeamMatch("blue");
    return;
  }

  if (state.match.scoreLimit && territory.counts.red >= state.match.scoreLimit) {
    finishTeamMatch("red");
  }
}

function updateSoccerBall(delta) {
  const ball = state.match.ball;
  if (!ball) {
    return;
  }

  const config = getSoccerFieldConfig();
  ball.hitFlash = Math.max(0, ball.hitFlash - delta * 4);
  ball.x += ball.vx * delta;
  ball.y += ball.vy * delta;
  ball.vx *= Math.exp(-delta * 1.55);
  ball.vy *= Math.exp(-delta * 1.55);

  if (config.orientation === "vertical") {
    const goalLeft = config.center.x - config.goalHalfSize;
    const goalRight = config.center.x + config.goalHalfSize;

    if (ball.x - ball.radius <= config.inset || ball.x + ball.radius >= WORLD_SIZE - config.inset) {
      ball.vx *= -0.92;
      ball.x = clamp(ball.x, config.inset + ball.radius, WORLD_SIZE - config.inset - ball.radius);
    }

    if (ball.y - ball.radius <= config.inset) {
      if (ball.x >= goalLeft && ball.x <= goalRight) {
        onSoccerGoal("red");
        return;
      }

      ball.vy = Math.abs(ball.vy) * 0.92;
      ball.y = config.inset + ball.radius;
    }

    if (ball.y + ball.radius >= WORLD_SIZE - config.inset) {
      if (ball.x >= goalLeft && ball.x <= goalRight) {
        onSoccerGoal("blue");
        return;
      }

      ball.vy = -Math.abs(ball.vy) * 0.92;
      ball.y = WORLD_SIZE - config.inset - ball.radius;
    }
    return;
  }

  const goalTop = config.center.y - config.goalHalfSize;
  const goalBottom = config.center.y + config.goalHalfSize;

  if (ball.y - ball.radius <= config.inset || ball.y + ball.radius >= WORLD_SIZE - config.inset) {
    ball.vy *= -0.92;
    ball.y = clamp(ball.y, config.inset + ball.radius, WORLD_SIZE - config.inset - ball.radius);
  }

  if (ball.x - ball.radius <= config.inset) {
    if (ball.y >= goalTop && ball.y <= goalBottom) {
      onSoccerGoal("red");
      return;
    }

    ball.vx = Math.abs(ball.vx) * 0.92;
    ball.x = config.inset + ball.radius;
  }

  if (ball.x + ball.radius >= WORLD_SIZE - config.inset) {
    if (ball.y >= goalTop && ball.y <= goalBottom) {
      onSoccerGoal("blue");
      return;
    }

    ball.vx = -Math.abs(ball.vx) * 0.92;
    ball.x = WORLD_SIZE - config.inset - ball.radius;
  }
}

function onSoccerGoal(team) {
  addTeamScore(team, 1);
  if (state.mode !== "running") {
    return;
  }

  pushFeed(`${TEAM_DEFS[team].label} 팀 골!`);
  resetSoccerPositions();
}

function resetSoccerPositions() {
  if (state.player) {
    resetTankToSpawn(state.player);
  }

  for (const enemy of state.enemies) {
    resetTankToSpawn(enemy);
  }

  if (state.match.ball) {
    const config = getSoccerFieldConfig();
    state.match.ball.x = config.center.x;
    state.match.ball.y = config.center.y;
    state.match.ball.vx = 0;
    state.match.ball.vy = 0;
    state.match.ball.hitFlash = 0;
  }
}

function addTeamScore(team, amount) {
  if (!state.match.teamBased || !team || state.mode !== "running") {
    return;
  }

  state.match.teamScores[team] = clamp(
    state.match.teamScores[team] + amount,
    0,
    state.match.scoreLimit || Number.MAX_SAFE_INTEGER,
  );

  if (state.match.scoreLimit && state.match.teamScores[team] >= state.match.scoreLimit) {
    finishTeamMatch(team);
  }
}

function finishTeamMatch(team) {
  state.mode = "menu";
  state.match.winner = team;
  setOverlay(
    `${TEAM_DEFS[team].label} 팀 승리`,
    `${state.match.label}에서 ${TEAM_DEFS[team].label} 팀이 승리했습니다. 다시 시작할 수 있습니다.`,
    "다시 시작",
  );
  syncChatStatus();
}

function finishTimedMatch() {
  if (state.mode !== "running") {
    return;
  }

  state.mode = "menu";
  const blueScore = Math.floor(state.match.teamScores.blue);
  const redScore = Math.floor(state.match.teamScores.red);

  if (blueScore === redScore) {
    state.match.winner = "";
    setOverlay(
      "시간 종료",
      `${state.match.label} 시간이 끝났습니다. 블루 ${blueScore} : ${redScore} 레드로 무승부입니다.`,
      "다시 시작",
    );
    syncChatStatus();
    return;
  }

  const winner = blueScore > redScore ? "blue" : "red";
  state.match.winner = winner;
  setOverlay(
    "시간 종료",
    `${state.match.label} 시간이 끝났습니다. ${TEAM_DEFS[winner].label} 팀 승리. 블루 ${blueScore} : ${redScore} 레드`,
    "다시 시작",
  );
  syncChatStatus();
}

function respawnPlayer() {
  if (!state.player) {
    return;
  }

  resetTankToSpawn(state.player);
  state.player.alive = true;
  state.player.dead = false;
  state.player.health = state.player.maxHealth;
  state.player.regenDelay = 0;
  state.player.cooldown = 0;
  state.camera.x = state.player.x;
  state.camera.y = state.player.y;
}

function resetTankToSpawn(tank) {
  const spawn = getSpawnPointForTeam(tank.team || "blue");
  tank.x = spawn.x;
  tank.y = spawn.y;
  tank.heading = randomBetween(0, TAU);
  tank.angle = tank.heading;
  tank.hitFlash = 0;
  tank.dead = false;
  tank.health = tank.maxHealth;
  clampEntityToWorld(tank);
}

function paintTerritoryAt(x, y, team, radius) {
  const territory = state.match.territory;
  if (!territory || !team) {
    return;
  }

  const minCol = clamp(Math.floor((x - radius) / territory.cellSize), 0, territory.cols - 1);
  const maxCol = clamp(Math.floor((x + radius) / territory.cellSize), 0, territory.cols - 1);
  const minRow = clamp(Math.floor((y - radius) / territory.cellSize), 0, territory.rows - 1);
  const maxRow = clamp(Math.floor((y + radius) / territory.cellSize), 0, territory.rows - 1);

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let col = minCol; col <= maxCol; col += 1) {
      const centerX = col * territory.cellSize + territory.cellSize / 2;
      const centerY = row * territory.cellSize + territory.cellSize / 2;
      if (Math.hypot(centerX - x, centerY - y) <= radius + territory.cellSize * 0.35) {
        claimTerritoryCell(row * territory.cols + col, team);
      }
    }
  }
}

function claimTerritoryCell(index, team) {
  const territory = state.match.territory;
  const cell = territory?.cells[index];
  if (!cell || cell.owner === team) {
    return;
  }

  if (cell.owner && territory.counts[cell.owner] > 0) {
    territory.counts[cell.owner] -= 1;
  }

  cell.owner = team;
  territory.counts[team] += 1;
}

function getNearestTerritoryTarget(enemy) {
  const territory = state.match.territory;
  if (!territory) {
    return null;
  }

  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let row = 0; row < territory.rows; row += 1) {
    for (let col = 0; col < territory.cols; col += 1) {
      const cell = territory.cells[row * territory.cols + col];
      if (!cell || cell.owner === enemy.team) {
        continue;
      }

      const target = {
        x: col * territory.cellSize + territory.cellSize / 2,
        y: row * territory.cellSize + territory.cellSize / 2,
      };
      const distance = distanceBetween(enemy, target);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = target;
      }
    }
  }

  return best;
}

function getEnemyCombatTarget(enemy) {
  const candidates = [];

  if (state.player.alive && isHostilePair(enemy, state.player)) {
    candidates.push(state.player);
  }

  if (state.match.teamBased) {
    for (const other of state.enemies) {
      if (other.id !== enemy.id && !other.dead && isHostilePair(enemy, other)) {
        candidates.push(other);
      }
    }
  }

  if (!candidates.length) {
    return null;
  }

  return candidates.reduce((best, candidate) => {
    if (!best) {
      return candidate;
    }
    return distanceBetween(enemy, candidate) < distanceBetween(enemy, best) ? candidate : best;
  }, null);
}

function getEnemyObjective(enemy) {
  if (state.match.id === "territory" && state.match.territory) {
    return getNearestTerritoryTarget(enemy);
  }

  if (state.match.id === "soccer" && state.match.ball) {
    return state.match.ball;
  }

  if (state.match.id === "team") {
    return getTeamObjectivePoint(enemy.team);
  }

  return null;
}

function getTeamObjectivePoint(team) {
  const layout = state.match.teamLayout || "sideLanes";

  if (layout === "topBottom") {
    return team === "blue"
      ? { x: WORLD_SIZE / 2, y: WORLD_SIZE * 0.64 }
      : { x: WORLD_SIZE / 2, y: WORLD_SIZE * 0.36 };
  }

  if (layout === "diagonal") {
    return team === "blue"
      ? { x: WORLD_SIZE * 0.66, y: WORLD_SIZE * 0.66 }
      : { x: WORLD_SIZE * 0.34, y: WORLD_SIZE * 0.34 };
  }

  if (layout === "ring") {
    return team === "blue"
      ? { x: WORLD_SIZE * 0.58, y: WORLD_SIZE / 2 }
      : { x: WORLD_SIZE * 0.42, y: WORLD_SIZE / 2 };
  }

  if (layout === "corridor") {
    return team === "blue"
      ? { x: WORLD_SIZE * 0.58, y: WORLD_SIZE / 2 }
      : { x: WORLD_SIZE * 0.42, y: WORLD_SIZE / 2 };
  }

  if (layout === "cross") {
    return team === "blue"
      ? { x: WORLD_SIZE * 0.58, y: WORLD_SIZE * 0.42 }
      : { x: WORLD_SIZE * 0.42, y: WORLD_SIZE * 0.58 };
  }

  if (layout === "pockets") {
    return team === "blue"
      ? { x: WORLD_SIZE * 0.6, y: WORLD_SIZE / 2 }
      : { x: WORLD_SIZE * 0.4, y: WORLD_SIZE / 2 };
  }

  return team === "blue"
    ? { x: WORLD_SIZE * 0.64, y: WORLD_SIZE / 2 }
    : { x: WORLD_SIZE * 0.36, y: WORLD_SIZE / 2 };
}

function isHostilePair(a, b) {
  if (!a || !b) {
    return false;
  }

  if (!state.match.teamBased) {
    return (
      (a.kind === "player" && b.kind === "enemy") ||
      (a.kind === "enemy" && b.kind === "player")
    );
  }

  return isHostileTeamToTank(a.team, b.team);
}

function isHostileTeamToTank(sourceTeam, targetTeam) {
  return Boolean(sourceTeam && targetTeam && sourceTeam !== targetTeam);
}

function getSourceType(source) {
  return typeof source === "string" ? source : source?.type || "";
}

function getSourceTeam(source) {
  if (typeof source === "object" && source) {
    return source.team || "";
  }

  if (source === "player") {
    return state.player?.team || "blue";
  }

  return "";
}

function getTankLabel(tank) {
  return TEAM_DEFS[tank.team]?.label || "로그";
}

function clampBallToWorld(ball) {
  const config = getSoccerFieldConfig();
  ball.x = clamp(ball.x, config.inset + ball.radius, WORLD_SIZE - config.inset - ball.radius);
  ball.y = clamp(ball.y, config.inset + ball.radius, WORLD_SIZE - config.inset - ball.radius);
}

function gainXp(amount) {
  const player = state.player;
  player.xp += amount;

  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level += 1;
    player.points += UPGRADE_POINTS_PER_LEVEL;
    if (player.level % BONUS_POINT_INTERVAL === 0) {
      player.points += 1;
    }
    player.xpToNext = Math.round(player.xpToNext * 1.22 + 18);
    player.health = Math.min(player.maxHealth, player.health + 28);
    recomputePlayerStats(player, true);
    pushFeed(
      player.level % BONUS_POINT_INTERVAL === 0
        ? `레벨 ${player.level}. 보너스 업그레이드 포인트 획득.`
        : `레벨 ${player.level}. 업그레이드 포인트 획득.`,
    );
  }

  maybeAnnounceClassUnlock(player);
}

function recomputePlayerStats(player, keepHealthValue) {
  const previousHealth = player.health;
  const previousMax = player.maxHealth || player.baseMaxHealth;
  const healthRatio = previousMax > 0 ? previousHealth / previousMax : 1;
  const classDef = CLASS_DEFS[player.classId] || CLASS_DEFS.basic;

  player.maxHealth = (player.baseMaxHealth + player.level * 4 + player.upgrades.maxHealth * 24) * classDef.modifiers.maxHealth;
  player.reloadTime = Math.max(0.08, (player.baseReload - player.upgrades.reload * 0.028) * classDef.modifiers.reloadTime);
  player.moveSpeed = (player.baseMoveSpeed + player.upgrades.movement * 22 + player.level * 1.4) * classDef.modifiers.moveSpeed;
  player.bulletSpeed = (player.baseBulletSpeed + player.upgrades.bulletSpeed * 58) * classDef.modifiers.bulletSpeed;
  player.bulletDamage = (player.baseBulletDamage + player.upgrades.bulletDamage * 4.8 + player.level * 0.75) * classDef.modifiers.bulletDamage;
  player.bodyDamage = (player.baseBodyDamage + player.upgrades.bodyDamage * 5.2 + player.level * 0.3) * classDef.modifiers.bodyDamage;
  player.bulletLife = (1.18 + player.upgrades.bulletSpeed * 0.07) * classDef.modifiers.bulletLife;
  player.radius = 32 * classDef.modifiers.radius;
  player.color = classDef.colors.body;
  player.barrelColor = classDef.colors.barrel;
  player.stroke = classDef.colors.stroke;
  player.barrels = classDef.barrels.map((barrel) => ({ ...barrel }));
  player.weaponShots = classDef.shots.map((shot) => ({ ...shot }));

  if (keepHealthValue) {
    player.health = Math.min(player.maxHealth, previousHealth);
  } else {
    player.health = Math.max(1, Math.round(player.maxHealth * healthRatio));
  }
}

function getEnemySpawnLevel() {
  const playerLevel = state.player?.level ?? 1;
  const timeLevel = Math.floor(state.matchTime / 45);
  const floorLevel = Math.max(1, Math.min(30, Math.floor((playerLevel - 1) * 0.6) + 1 + timeLevel));
  const variance = Math.floor(randomBetween(0, 3));
  return clamp(floorLevel + variance, 1, 36);
}

function levelUpEnemy(enemy) {
  setEnemyLevel(enemy, enemy.level + 1, true);
  enemy.score += enemy.level * 24;
}

function setEnemyLevel(enemy, level, restoreHealth) {
  const previousHealth = enemy.health;
  const previousMax = enemy.maxHealth || enemy.baseMaxHealth;
  const healthRatio = previousMax > 0 ? previousHealth / previousMax : 1;

  enemy.level = clamp(Math.floor(level), 1, 36);
  enemy.xpToNext = Math.round(118 + enemy.level * 38 + enemy.level * enemy.level * 1.75);
  enemy.radius = enemy.baseRadius + enemy.level * 0.78;
  enemy.maxHealth = enemy.baseMaxHealth + enemy.level * 30;
  enemy.moveSpeed = enemy.baseMoveSpeed + enemy.level * 1.9;
  enemy.bodyDamage = enemy.baseBodyDamage + enemy.level * 1.2;
  enemy.bulletDamage = enemy.baseBulletDamage + enemy.level * 1.08;
  enemy.bulletSpeed = enemy.baseBulletSpeed + enemy.level * 7.2;
  enemy.bulletLife = enemy.baseBulletLife + enemy.level * 0.022;
  enemy.reloadTime = Math.max(0.24, enemy.baseReloadTime - enemy.level * 0.011);
  enemy.aggroRange = 1100 + enemy.level * 12;
  enemy.xpReward = Math.round(92 + enemy.level * 26);

  if (restoreHealth) {
    enemy.health = Math.min(enemy.maxHealth, previousHealth + enemy.maxHealth * 0.18);
  } else {
    enemy.health = Math.max(1, Math.round(enemy.maxHealth * healthRatio));
  }
}

function applyUpgrade(id) {
  const player = state.player;
  if (!player || state.mode !== "running") {
    return;
  }

  const infinitePoints = isCreatorInfinitePoints();
  if (!infinitePoints && player.points <= 0) {
    return;
  }

  if (player.upgrades[id] >= MAX_UPGRADE_LEVEL) {
    return;
  }

  if (!infinitePoints) {
    player.points -= 1;
  }
  player.upgrades[id] += 1;
  recomputePlayerStats(player, true);
  player.health = Math.min(player.maxHealth, player.health + 18);

  const upgrade = UPGRADE_DEFS.find((entry) => entry.id === id);
  if (upgrade) {
    pushFeed(`${upgrade.label} ${player.upgrades[id]}단계 달성.`);
  }

  syncHud();
}

function maybeAnnounceClassUnlock(player) {
  const choices = getAvailableClassChoices(player);
  const unlockKey = choices.length ? `${player.classId}:${choices.map((choice) => choice.id).join(",")}` : "";

  if (unlockKey && player.lastClassUnlockKey !== unlockKey) {
    player.lastClassUnlockKey = unlockKey;
    pushFeed(`전차 분기 해금: ${choices.map((choice, index) => `${CLASS_HOTKEYS[index].hotkey}.${choice.label}`).join("  ")}`);
  }
}

function getAvailableClassChoices(player) {
  if (!player) {
    return [];
  }

  const currentClass = CLASS_DEFS[player.classId] || CLASS_DEFS.basic;
  if (!currentClass.next.length) {
    return [];
  }

  const choices = currentClass.next.map((id) => CLASS_DEFS[id]);
  const unlockLevel = choices[0]?.unlockLevel ?? Number.POSITIVE_INFINITY;
  return player.level >= unlockLevel ? choices : [];
}

function getNextClassUnlock(player) {
  if (!player) {
    return null;
  }

  const currentClass = CLASS_DEFS[player.classId] || CLASS_DEFS.basic;
  if (!currentClass.next.length) {
    return null;
  }

  const choices = currentClass.next.map((id) => CLASS_DEFS[id]);
  return {
    level: choices[0]?.unlockLevel ?? Number.POSITIVE_INFINITY,
    tier: choices[0]?.tier ?? currentClass.tier,
  };
}

function selectClass(classId) {
  const player = state.player;
  if (!player || state.mode !== "running") {
    return;
  }

  const choices = getAvailableClassChoices(player);
  if (!choices.some((choice) => choice.id === classId)) {
    return;
  }

  player.classId = classId;
  recomputePlayerStats(player, true);
  player.health = Math.min(player.maxHealth, player.health + player.maxHealth * 0.16);
  pushFeed(`전차 변경: ${CLASS_DEFS[classId].label}`);
  maybeAnnounceClassUnlock(player);
  syncHud();
}

function syncHud() {
  const player = state.player;
  if (!player) {
    dom.hpFill.style.width = "0%";
    dom.xpFill.style.width = "0%";
    dom.hpText.textContent = "0 / 0";
    dom.xpText.textContent = "0 / 0";
    dom.pointsLabel.textContent = "0 포인트";
    dom.statsMeta.textContent = "레벨 1";
    syncUpgradeButtons(null);
    syncClassPanel(null);
    syncCompactHud(null);
    syncLeaderboard(null);
    syncChatStatus();
    return;
  }

  const hpRatio = clamp(player.health / player.maxHealth, 0, 1);
  const xpRatio = clamp(player.xp / player.xpToNext, 0, 1);

  dom.hpFill.style.width = `${hpRatio * 100}%`;
  dom.xpFill.style.width = `${xpRatio * 100}%`;
  dom.hpText.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`;
  dom.xpText.textContent = `${Math.floor(player.xp)} / ${player.xpToNext}`;
  dom.pointsLabel.textContent = getPlayerPointsLabel(player);
  dom.statsMeta.textContent = state.match.teamBased
    ? `${state.match.label} | ${state.match.mapLabel} | ${getMatchScoreSummary()} | 개인 점수 ${Math.floor(state.score)}`
    : `레벨 ${player.level} | ${state.match.mapLabel} | ${CLASS_DEFS[player.classId].label} | 점수 ${Math.floor(state.score)} | 도형 ${state.shapes.length}개 | 로그 ${state.enemies.length}기`;

  syncUpgradeButtons(player);
  syncClassPanel(player);
  syncCompactHud(player);
  syncLeaderboard(player);
}

function syncUpgradeButtons(player) {
  for (const upgrade of UPGRADE_DEFS) {
    const ui = upgradeElements.get(upgrade.id);
    const level = player ? player.upgrades[upgrade.id] : 0;
    const maxed = level >= MAX_UPGRADE_LEVEL;
    const disabled = !player || (!isCreatorInfinitePoints() && player.points <= 0) || state.mode !== "running" || maxed;

    ui.value.textContent = `${level} / ${MAX_UPGRADE_LEVEL}`;
    ui.button.classList.toggle("is-disabled", disabled && !maxed);
    ui.button.classList.toggle("is-maxed", maxed);

    for (let index = 0; index < ui.pips.length; index += 1) {
      ui.pips[index].classList.toggle("is-on", index < level);
    }
  }
}

function renderFeed() {
  if (state.feed.length === 0) {
    dom.eventFeed.innerHTML = '<div class="feed-item">전투 로그가 여기에 표시됩니다.</div>';
    return;
  }

  dom.eventFeed.innerHTML = state.feed
    .map((item) => `<div class="feed-item">${item}</div>`)
    .join("");
}

function pushFeed(message) {
  state.feed.unshift(message);
  state.feed = state.feed.slice(0, 5);
  renderFeed();
  pushChatMessage("시스템", message, "system");
}

function render() {
  ctx.setTransform(state.viewport.dpr, 0, 0, state.viewport.dpr, 0, 0);
  ctx.clearRect(0, 0, state.viewport.width, state.viewport.height);

  drawArena();
  drawWorld();
  drawCrosshair();
  drawMiniMap();
}

function drawArena() {
  const width = state.viewport.width;
  const height = state.viewport.height;
  const palette = state.match.mapPalette || createMapPalette();
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, palette.skyTop);
  gradient.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.72, height * 0.24, 0, width * 0.72, height * 0.24, width * 0.4);
  glow.addColorStop(0, palette.glowA);
  glow.addColorStop(1, "rgba(76, 180, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const lowGlow = ctx.createRadialGradient(width * 0.2, height * 0.78, 0, width * 0.2, height * 0.78, width * 0.35);
  lowGlow.addColorStop(0, palette.glowB);
  lowGlow.addColorStop(1, "rgba(255, 110, 137, 0)");
  ctx.fillStyle = lowGlow;
  ctx.fillRect(0, 0, width, height);
}

function drawWorld() {
  const offsetX = state.viewport.width / 2 - state.camera.x;
  const offsetY = state.viewport.height / 2 - state.camera.y;

  ctx.save();
  ctx.translate(offsetX, offsetY);

  drawGrid();
  drawMatchWorldDecorations();

  ctx.strokeStyle = state.match.mapPalette?.border || "rgba(189, 227, 255, 0.2)";
  ctx.lineWidth = 12;
  ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);

  for (const shape of state.shapes) {
    drawPolygon(shape);
    drawHealthBar(
      shape.x,
      shape.y - shape.radius - 18,
      clamp(shape.radius * 1.55, 42, 148),
      6,
      shape.health / shape.maxHealth,
    );
  }

  for (const bullet of state.bullets) {
    drawBullet(bullet);
  }

  if (state.match.ball) {
    drawSoccerBall(state.match.ball);
  }

  for (const enemy of state.enemies) {
    drawTank(enemy);
    drawHealthBar(
      enemy.x,
      enemy.y - enemy.radius - 20,
      clamp(enemy.radius * 1.7, 52, 110),
      6,
      enemy.health / enemy.maxHealth,
    );
    drawTankLabel(
      enemy,
      `${enemy.nickname} · 레벨 ${enemy.level}`,
      enemy.team === "blue" ? "rgba(210, 244, 255, 0.95)" : "rgba(255, 224, 233, 0.92)",
    );
  }

  if (state.player) {
    drawTank(state.player);
    drawTankLabel(state.player, state.player.nickname, "rgba(210, 244, 255, 0.95)");
  }

  ctx.restore();
}

function drawGrid() {
  const left = state.camera.x - state.viewport.width / 2;
  const right = state.camera.x + state.viewport.width / 2;
  const top = state.camera.y - state.viewport.height / 2;
  const bottom = state.camera.y + state.viewport.height / 2;
  const gridSize = state.match.gridSize || GRID_SIZE;

  ctx.strokeStyle = state.match.mapPalette?.grid || "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let x = Math.floor(left / gridSize) * gridSize; x <= right; x += gridSize) {
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
  }

  for (let y = Math.floor(top / gridSize) * gridSize; y <= bottom; y += gridSize) {
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
  }

  ctx.stroke();
}

function drawMatchWorldDecorations() {
  drawMapZones(0, 0, 1);

  if (state.match.id === "territory") {
    drawTerritoryCells();
    return;
  }

  if (state.match.id === "team") {
    drawTeamLanes();
    return;
  }

  if (state.match.id === "soccer") {
    drawSoccerField();
  }
}

function drawMapZones(originX, originY, scale) {
  for (const zone of state.match.mapZones || []) {
    ctx.save();
    traceMapZone(zone, originX, originY, scale);
    if (zone.fill) {
      ctx.fillStyle = zone.fill;
      if (zone.shape === "ring") {
        ctx.fill("evenodd");
      } else {
        ctx.fill();
      }
    }
    if (zone.stroke) {
      ctx.strokeStyle = zone.stroke;
      ctx.lineWidth = Math.max(1, (zone.lineWidth || 4) * scale);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function traceMapZone(zone, originX, originY, scale) {
  const factor = zone.normalized ? WORLD_SIZE * scale : scale;
  const x = originX + zone.x * factor;
  const y = originY + zone.y * factor;

  ctx.beginPath();

  if (zone.shape === "rect") {
    const width = zone.width * factor;
    const height = zone.height * factor;
    const radius = Math.min(zone.radius * factor || 0, width / 2, height / 2);
    if (radius > 0) {
      roundRect(ctx, x, y, width, height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
    return;
  }

  if (zone.shape === "circle") {
    ctx.arc(x, y, zone.radius * factor, 0, TAU);
    return;
  }

  if (zone.shape === "ring") {
    ctx.arc(x, y, zone.outerRadius * factor, 0, TAU);
    ctx.moveTo(x + zone.innerRadius * factor, y);
    ctx.arc(x, y, zone.innerRadius * factor, 0, TAU, true);
    return;
  }

  if (zone.shape === "diamond") {
    const width = zone.width * factor;
    const height = zone.height * factor;
    ctx.moveTo(x, y - height / 2);
    ctx.lineTo(x + width / 2, y);
    ctx.lineTo(x, y + height / 2);
    ctx.lineTo(x - width / 2, y);
    ctx.closePath();
  }
}

function drawTerritoryCells() {
  const territory = state.match.territory;
  if (!territory) {
    return;
  }

  const left = state.camera.x - state.viewport.width / 2;
  const right = state.camera.x + state.viewport.width / 2;
  const top = state.camera.y - state.viewport.height / 2;
  const bottom = state.camera.y + state.viewport.height / 2;
  const startCol = clamp(Math.floor(left / territory.cellSize), 0, territory.cols - 1);
  const endCol = clamp(Math.ceil(right / territory.cellSize), 0, territory.cols - 1);
  const startRow = clamp(Math.floor(top / territory.cellSize), 0, territory.rows - 1);
  const endRow = clamp(Math.ceil(bottom / territory.cellSize), 0, territory.rows - 1);

  ctx.save();
  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const cell = territory.cells[row * territory.cols + col];
      if (!cell?.owner) {
        continue;
      }

      const x = col * territory.cellSize;
      const y = row * territory.cellSize;
      ctx.fillStyle = cell.owner === "blue" ? "rgba(97, 192, 255, 0.14)" : "rgba(255, 110, 137, 0.14)";
      ctx.fillRect(x, y, territory.cellSize, territory.cellSize);
    }
  }
  ctx.restore();
}

function drawTeamLanes() {
  ctx.save();
  const layout = state.match.teamLayout || "sideLanes";

  if (layout === "topBottom") {
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.fillRect(WORLD_SIZE * 0.12, 0, WORLD_SIZE * 0.76, WORLD_SIZE * 0.18);
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.fillRect(WORLD_SIZE * 0.12, WORLD_SIZE * 0.82, WORLD_SIZE * 0.76, WORLD_SIZE * 0.18);
    ctx.restore();
    return;
  }

  if (layout === "diagonal") {
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(WORLD_SIZE * 0.34, 0);
    ctx.lineTo(0, WORLD_SIZE * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.beginPath();
    ctx.moveTo(WORLD_SIZE, WORLD_SIZE);
    ctx.lineTo(WORLD_SIZE * 0.66, WORLD_SIZE);
    ctx.lineTo(WORLD_SIZE, WORLD_SIZE * 0.66);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }

  if (layout === "ring") {
    ctx.beginPath();
    ctx.moveTo(WORLD_SIZE / 2, WORLD_SIZE / 2);
    ctx.arc(WORLD_SIZE / 2, WORLD_SIZE / 2, WORLD_SIZE * 0.34, Math.PI * 0.6, Math.PI * 1.4);
    ctx.closePath();
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(WORLD_SIZE / 2, WORLD_SIZE / 2);
    ctx.arc(WORLD_SIZE / 2, WORLD_SIZE / 2, WORLD_SIZE * 0.34, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.closePath();
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.fill();
    ctx.restore();
    return;
  }

  if (layout === "corridor") {
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.fillRect(0, WORLD_SIZE * 0.28, WORLD_SIZE * 0.24, WORLD_SIZE * 0.44);
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.fillRect(WORLD_SIZE * 0.76, WORLD_SIZE * 0.28, WORLD_SIZE * 0.24, WORLD_SIZE * 0.44);
    ctx.fillStyle = "rgba(255, 255, 255, 0.028)";
    ctx.fillRect(WORLD_SIZE * 0.44, 0, WORLD_SIZE * 0.12, WORLD_SIZE);
    ctx.restore();
    return;
  }

  if (layout === "cross") {
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.fillRect(0, WORLD_SIZE * 0.42, WORLD_SIZE * 0.48, WORLD_SIZE * 0.16);
    ctx.fillRect(WORLD_SIZE * 0.18, 0, WORLD_SIZE * 0.16, WORLD_SIZE * 0.42);
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.fillRect(WORLD_SIZE * 0.52, WORLD_SIZE * 0.42, WORLD_SIZE * 0.48, WORLD_SIZE * 0.16);
    ctx.fillRect(WORLD_SIZE * 0.66, WORLD_SIZE * 0.58, WORLD_SIZE * 0.16, WORLD_SIZE * 0.42);
    ctx.restore();
    return;
  }

  if (layout === "pockets") {
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.fillRect(0, WORLD_SIZE * 0.14, WORLD_SIZE * 0.18, WORLD_SIZE * 0.18);
    ctx.fillRect(0, WORLD_SIZE * 0.41, WORLD_SIZE * 0.18, WORLD_SIZE * 0.18);
    ctx.fillRect(0, WORLD_SIZE * 0.68, WORLD_SIZE * 0.18, WORLD_SIZE * 0.18);
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.fillRect(WORLD_SIZE * 0.82, WORLD_SIZE * 0.14, WORLD_SIZE * 0.18, WORLD_SIZE * 0.18);
    ctx.fillRect(WORLD_SIZE * 0.82, WORLD_SIZE * 0.41, WORLD_SIZE * 0.18, WORLD_SIZE * 0.18);
    ctx.fillRect(WORLD_SIZE * 0.82, WORLD_SIZE * 0.68, WORLD_SIZE * 0.18, WORLD_SIZE * 0.18);
    ctx.restore();
    return;
  }

  ctx.fillStyle = TEAM_DEFS.blue.tint;
  ctx.fillRect(0, WORLD_SIZE * 0.12, WORLD_SIZE * 0.18, WORLD_SIZE * 0.76);
  ctx.fillStyle = TEAM_DEFS.red.tint;
  ctx.fillRect(WORLD_SIZE * 0.82, WORLD_SIZE * 0.12, WORLD_SIZE * 0.18, WORLD_SIZE * 0.76);
  ctx.restore();
}

function drawSoccerField() {
  const config = getSoccerFieldConfig();
  const {
    center,
    orientation,
    inset,
    goalHalfSize,
    goalDepth,
    centerRadius,
    penaltyDepth,
    penaltyHalfSize,
  } = config;

  ctx.save();
  ctx.fillStyle = "rgba(36, 110, 61, 0.12)";
  ctx.fillRect(inset, inset, WORLD_SIZE - inset * 2, WORLD_SIZE - inset * 2);

  ctx.strokeStyle = "rgba(237, 248, 255, 0.16)";
  ctx.lineWidth = 8;
  ctx.strokeRect(inset, inset, WORLD_SIZE - inset * 2, WORLD_SIZE - inset * 2);

  if (orientation === "vertical") {
    ctx.beginPath();
    ctx.moveTo(inset, center.y);
    ctx.lineTo(WORLD_SIZE - inset, center.y);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(center.x, inset);
    ctx.lineTo(center.x, WORLD_SIZE - inset);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(center.x, center.y, centerRadius, 0, TAU);
  ctx.stroke();

  if (orientation === "vertical") {
    ctx.strokeRect(center.x - penaltyHalfSize, inset, penaltyHalfSize * 2, penaltyDepth);
    ctx.strokeRect(center.x - penaltyHalfSize, WORLD_SIZE - inset - penaltyDepth, penaltyHalfSize * 2, penaltyDepth);
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.fillRect(center.x - goalHalfSize, inset - goalDepth * 0.5, goalHalfSize * 2, goalDepth);
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.fillRect(center.x - goalHalfSize, WORLD_SIZE - inset - goalDepth * 0.5, goalHalfSize * 2, goalDepth);
  } else {
    ctx.strokeRect(inset, center.y - penaltyHalfSize, penaltyDepth, penaltyHalfSize * 2);
    ctx.strokeRect(WORLD_SIZE - inset - penaltyDepth, center.y - penaltyHalfSize, penaltyDepth, penaltyHalfSize * 2);
    ctx.fillStyle = TEAM_DEFS.blue.tint;
    ctx.fillRect(inset - goalDepth * 0.5, center.y - goalHalfSize, goalDepth, goalHalfSize * 2);
    ctx.fillStyle = TEAM_DEFS.red.tint;
    ctx.fillRect(WORLD_SIZE - inset - goalDepth * 0.5, center.y - goalHalfSize, goalDepth, goalHalfSize * 2);
  }
  ctx.restore();
}

function getSoccerFieldConfig(layoutId = state.match.soccerLayout) {
  const config = {
    center: { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 },
    orientation: "horizontal",
    inset: WORLD_PADDING,
    goalHalfSize: 360,
    goalDepth: 120,
    centerRadius: 240,
    penaltyDepth: 280,
    penaltyHalfSize: 560,
  };

  if (layoutId === "wide") {
    config.inset = 170;
    config.goalHalfSize = 450;
    config.centerRadius = 280;
    config.penaltyDepth = 330;
    config.penaltyHalfSize = 690;
  } else if (layoutId === "narrow") {
    config.inset = 310;
    config.goalHalfSize = 280;
    config.goalDepth = 100;
    config.centerRadius = 180;
    config.penaltyDepth = 220;
    config.penaltyHalfSize = 480;
  } else if (layoutId === "boxes") {
    config.inset = 220;
    config.goalHalfSize = 340;
    config.goalDepth = 130;
    config.centerRadius = 220;
    config.penaltyDepth = 360;
    config.penaltyHalfSize = 640;
  } else if (layoutId === "arena") {
    config.inset = 210;
    config.goalHalfSize = 390;
    config.goalDepth = 130;
    config.centerRadius = 270;
    config.penaltyDepth = 300;
    config.penaltyHalfSize = 620;
  } else if (layoutId === "vertical") {
    config.orientation = "vertical";
    config.inset = 210;
    config.goalHalfSize = 360;
    config.goalDepth = 120;
    config.centerRadius = 230;
    config.penaltyDepth = 300;
    config.penaltyHalfSize = 580;
  }

  return config;
}

function drawSoccerBall(ball) {
  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius, 0, TAU);
  ctx.fillStyle = ball.color;
  ctx.strokeStyle = ball.stroke;
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(-8, -6, 8, 0, TAU);
  ctx.arc(10, 5, 6, 0, TAU);
  ctx.fillStyle = "rgba(24, 36, 46, 0.22)";
  ctx.fill();

  if (ball.hitFlash > 0) {
    ctx.globalAlpha = ball.hitFlash;
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius + 6, 0, TAU);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  ctx.restore();
}

function drawPolygon(shape) {
  const template = SHAPE_TYPES[shape.type];
  const sides = template.sides;
  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.rotation);
  ctx.beginPath();

  for (let index = 0; index < sides; index += 1) {
    const x = template.points
      ? template.points[index].x * shape.radius
      : Math.cos((index / sides) * TAU) * shape.radius;
    const y = template.points
      ? template.points[index].y * shape.radius
      : Math.sin((index / sides) * TAU) * shape.radius;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fillStyle = shape.color;
  ctx.strokeStyle = shape.stroke;
  ctx.lineWidth = 6;
  ctx.fill();
  ctx.stroke();

  if (shape.hitFlash > 0) {
    ctx.globalAlpha = shape.hitFlash;
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  ctx.restore();
}

function drawTank(tank) {
  ctx.save();
  ctx.translate(tank.x, tank.y);
  ctx.rotate(tank.angle);

  for (const barrel of tank.barrels || []) {
    ctx.save();
    ctx.translate(barrel.forwardOffset || 0, barrel.sideOffset || 0);
    ctx.rotate(barrel.angleOffset || 0);
    ctx.fillStyle = tank.barrelColor;
    ctx.strokeStyle = tank.stroke;
    ctx.lineWidth = 5;
    roundRect(ctx, barrel.backOffset || 0, -(barrel.width || 20) / 2, barrel.length, barrel.width || 20, Math.min(8, (barrel.width || 20) / 2));
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();

  ctx.save();
  ctx.translate(tank.x, tank.y);
  ctx.beginPath();
  ctx.arc(0, 0, tank.radius, 0, TAU);
  ctx.fillStyle = tank.color;
  ctx.strokeStyle = tank.stroke;
  ctx.lineWidth = 6;
  ctx.fill();
  ctx.stroke();

  if (tank.hitFlash > 0) {
    ctx.globalAlpha = tank.hitFlash;
    ctx.beginPath();
    ctx.arc(0, 0, tank.radius, 0, TAU);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  ctx.restore();
}

function drawBullet(bullet) {
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = bullet.glow;
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.radius, 0, TAU);
  ctx.fillStyle = bullet.color;
  ctx.fill();
  ctx.restore();
}

function drawHealthBar(x, y, width, height, ratio) {
  const clamped = clamp(ratio, 0, 1);
  ctx.save();
  ctx.translate(x - width / 2, y);
  roundRect(ctx, 0, 0, width, height, height / 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fill();
  roundRect(ctx, 0, 0, width * clamped, height, height / 2);
  ctx.fillStyle = "#7ce38e";
  ctx.fill();
  ctx.restore();
}

function drawTankLabel(tank, text, color) {
  ctx.save();
  ctx.translate(tank.x, tank.y - tank.radius - 34);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = "700 12px Avenir Next, Trebuchet MS, sans-serif";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(6, 17, 29, 0.72)";
  ctx.strokeText(text, 0, 0);
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawCrosshair() {
  if (state.touch.aimId !== null) {
    return;
  }

  const x = state.input.mouse.x;
  const y = state.input.mouse.y;

  ctx.save();
  ctx.strokeStyle = "rgba(237, 248, 255, 0.75)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, TAU);
  ctx.moveTo(x - 22, y);
  ctx.lineTo(x - 6, y);
  ctx.moveTo(x + 22, y);
  ctx.lineTo(x + 6, y);
  ctx.moveTo(x, y - 22);
  ctx.lineTo(x, y - 6);
  ctx.moveTo(x, y + 22);
  ctx.lineTo(x, y + 6);
  ctx.stroke();
  ctx.restore();
}

function drawMiniMap() {
  if (!SHOW_MINIMAP) {
    return;
  }

  const radius = clamp(Math.min(state.viewport.width, state.viewport.height) * 0.11, 68, 104);
  const padding = 24;
  const centerX = state.viewport.width - radius - padding;
  const centerY = state.viewport.height - radius - padding;
  const diameter = radius * 2;
  const mapLeft = centerX - radius;
  const mapTop = centerY - radius;
  const scale = diameter / WORLD_SIZE;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, TAU);
  ctx.fillStyle = "rgba(5, 14, 24, 0.66)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(189, 227, 255, 0.18)";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 14, 0, TAU);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, TAU);
  ctx.clip();

  const glow = ctx.createRadialGradient(centerX, centerY, radius * 0.15, centerX, centerY, radius);
  glow.addColorStop(0, state.match.mapPalette?.minimapGlow || "rgba(76, 180, 255, 0.12)");
  glow.addColorStop(1, "rgba(76, 180, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(mapLeft, mapTop, diameter, diameter);

  drawMapZones(mapLeft, mapTop, scale);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let factor = 0.25; factor < 1; factor += 0.25) {
    const offset = WORLD_SIZE * factor * scale;
    ctx.beginPath();
    ctx.moveTo(mapLeft + offset, mapTop);
    ctx.lineTo(mapLeft + offset, mapTop + diameter);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mapLeft, mapTop + offset);
    ctx.lineTo(mapLeft + diameter, mapTop + offset);
    ctx.stroke();
  }

  const viewportWidth = state.viewport.width * scale;
  const viewportHeight = state.viewport.height * scale;
  const viewportX = mapLeft + state.camera.x * scale - viewportWidth / 2;
  const viewportY = mapTop + state.camera.y * scale - viewportHeight / 2;
  ctx.strokeStyle = "rgba(237, 248, 255, 0.18)";
  ctx.strokeRect(viewportX, viewportY, viewportWidth, viewportHeight);

  for (const shape of state.shapes) {
    drawMiniMapDot(
      mapLeft + shape.x * scale,
      mapTop + shape.y * scale,
      getMiniMapShapeRadius(shape),
      shape.color,
    );
  }

  if (state.match.id === "territory" && state.match.territory) {
    const territory = state.match.territory;
    for (let row = 0; row < territory.rows; row += 1) {
      for (let col = 0; col < territory.cols; col += 1) {
        const cell = territory.cells[row * territory.cols + col];
        if (!cell?.owner) {
          continue;
        }

        ctx.fillStyle = cell.owner === "blue" ? "rgba(97, 192, 255, 0.55)" : "rgba(255, 110, 137, 0.55)";
        ctx.fillRect(
          mapLeft + col * territory.cellSize * scale,
          mapTop + row * territory.cellSize * scale,
          territory.cellSize * scale,
          territory.cellSize * scale,
        );
      }
    }
  }

  for (const enemy of state.enemies) {
    drawMiniMapDot(
      mapLeft + enemy.x * scale,
      mapTop + enemy.y * scale,
      3,
      TEAM_DEFS[enemy.team]?.ui || "#ff6e89",
    );
  }

  if (state.player) {
    const px = mapLeft + state.player.x * scale;
    const py = mapTop + state.player.y * scale;
    drawMiniMapDot(px, py, 4.5, "#61c0ff");

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(
      px + Math.cos(state.player.angle) * 12,
      py + Math.sin(state.player.angle) * 12,
    );
    ctx.strokeStyle = "rgba(210, 244, 255, 0.95)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, 8, 0, TAU);
    ctx.strokeStyle = "rgba(97, 192, 255, 0.24)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (state.match.ball) {
    drawMiniMapDot(mapLeft + state.match.ball.x * scale, mapTop + state.match.ball.y * scale, 3.5, "#f6f0df");
  }

  ctx.restore();
}

function onKeyDown(event) {
  if (isTypingTarget(event.target)) {
    if (event.code === "Escape") {
      event.preventDefault();
      event.target.blur();
    }
    return;
  }

  if (state.mode === "running" && event.code === "Enter") {
    event.preventDefault();
    dom.chatInput.focus();
    return;
  }

  if (event.code === "Backquote") {
    event.preventDefault();
    state.creator.open = !state.creator.open;
    syncCreatorPanel();
    return;
  }

  state.input.keys.add(event.code);

  if (event.code === "Space") {
    state.input.mouse.down = true;
    event.preventDefault();
  }

  if (state.mode !== "running" && (event.code === "Space" || event.code === "Enter")) {
    startGame();
    return;
  }

  if (event.code === "KeyR" && state.mode !== "running") {
    startGame();
    return;
  }

  const upgrade = UPGRADE_DEFS.find((entry) => entry.code === event.code);
  if (upgrade) {
    applyUpgrade(upgrade.id);
  }

  const choiceIndex = CLASS_HOTKEYS.findIndex((entry) => entry.code === event.code);
  if (choiceIndex !== -1) {
    const choices = getAvailableClassChoices(state.player);
    if (choices[choiceIndex]) {
      selectClass(choices[choiceIndex].id);
    }
  }
}

function onKeyUp(event) {
  state.input.keys.delete(event.code);
  if (event.code === "Space") {
    state.input.mouse.down = false;
  }
}

function onMouseMove(event) {
  state.input.mouse.x = event.clientX;
  state.input.mouse.y = event.clientY;
}

function onTouchStart(event) {
  event.preventDefault();

  if (state.mode !== "running") {
    startGame();
  }

  for (const touch of event.changedTouches) {
    if (touch.clientX < state.viewport.width / 2 && state.touch.moveId === null) {
      state.touch.moveId = touch.identifier;
      state.touch.moveOrigin.x = touch.clientX;
      state.touch.moveOrigin.y = touch.clientY;
      state.touch.moveCurrent.x = touch.clientX;
      state.touch.moveCurrent.y = touch.clientY;
    } else if (state.touch.aimId === null) {
      state.touch.aimId = touch.identifier;
      state.touch.aimOrigin.x = touch.clientX;
      state.touch.aimOrigin.y = touch.clientY;
      state.touch.aimCurrent.x = touch.clientX;
      state.touch.aimCurrent.y = touch.clientY;
      state.input.mouse.down = true;
    }
  }

  syncTouchSticks();
}

function onTouchMove(event) {
  event.preventDefault();

  for (const touch of event.changedTouches) {
    if (touch.identifier === state.touch.moveId) {
      state.touch.moveCurrent.x = touch.clientX;
      state.touch.moveCurrent.y = touch.clientY;
    } else if (touch.identifier === state.touch.aimId) {
      state.touch.aimCurrent.x = touch.clientX;
      state.touch.aimCurrent.y = touch.clientY;
    }
  }

  syncTouchSticks();
}

function onTouchEnd(event) {
  event.preventDefault();

  for (const touch of event.changedTouches) {
    if (touch.identifier === state.touch.moveId) {
      state.touch.moveId = null;
    } else if (touch.identifier === state.touch.aimId) {
      state.touch.aimId = null;
      state.input.mouse.down = false;
    }
  }

  syncTouchSticks();
}

function syncTouchSticks() {
  updateTouchStick(dom.moveStick, state.touch.moveId, state.touch.moveOrigin, state.touch.moveCurrent);
  updateTouchStick(dom.aimStick, state.touch.aimId, state.touch.aimOrigin, state.touch.aimCurrent);
}

function updateTouchStick(element, identifier, origin, current) {
  if (identifier === null) {
    element.hidden = true;
    return;
  }

  const dx = current.x - origin.x;
  const dy = current.y - origin.y;
  const distance = Math.min(28, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);
  const nubX = Math.cos(angle) * distance;
  const nubY = Math.sin(angle) * distance;
  const nub = element.querySelector(".touch-stick__nub");

  element.hidden = false;
  element.style.left = `${origin.x}px`;
  element.style.top = `${origin.y}px`;
  nub.style.transform = `translate(calc(-50% + ${nubX}px), calc(-50% + ${nubY}px))`;
}

function shouldFirePlayer() {
  return state.input.mouse.down;
}

function getMovementVector() {
  let x = 0;
  let y = 0;

  if (state.input.keys.has("KeyW") || state.input.keys.has("ArrowUp")) {
    y -= 1;
  }
  if (state.input.keys.has("KeyS") || state.input.keys.has("ArrowDown")) {
    y += 1;
  }
  if (state.input.keys.has("KeyA") || state.input.keys.has("ArrowLeft")) {
    x -= 1;
  }
  if (state.input.keys.has("KeyD") || state.input.keys.has("ArrowRight")) {
    x += 1;
  }

  if (state.touch.moveId !== null) {
    const dx = state.touch.moveCurrent.x - state.touch.moveOrigin.x;
    const dy = state.touch.moveCurrent.y - state.touch.moveOrigin.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 4) {
      x += dx / 58;
      y += dy / 58;
    }
  }

  const magnitude = Math.hypot(x, y);
  if (magnitude > 1) {
    x /= magnitude;
    y /= magnitude;
  }

  return { x, y };
}

function getAimAngle() {
  if (state.touch.aimId !== null) {
    return Math.atan2(
      state.touch.aimCurrent.y - state.viewport.height / 2,
      state.touch.aimCurrent.x - state.viewport.width / 2,
    );
  }

  return Math.atan2(
    state.input.mouse.y - state.viewport.height / 2,
    state.input.mouse.x - state.viewport.width / 2,
  );
}

function randomPointAwayFromPlayer(minDistance) {
  const anchor = state.player || { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const point = {
      x: randomBetween(WORLD_PADDING, WORLD_SIZE - WORLD_PADDING),
      y: randomBetween(WORLD_PADDING, WORLD_SIZE - WORLD_PADDING),
    };

    if (distanceBetween(point, anchor) >= minDistance) {
      return point;
    }
  }

  return {
    x: randomBetween(WORLD_PADDING, WORLD_SIZE - WORLD_PADDING),
    y: randomBetween(WORLD_PADDING, WORLD_SIZE - WORLD_PADDING),
  };
}

function clampEntityToWorld(entity) {
  entity.x = clamp(entity.x, entity.radius, WORLD_SIZE - entity.radius);
  entity.y = clamp(entity.y, entity.radius, WORLD_SIZE - entity.radius);
}

function getBarrelMuzzle(source, barrel) {
  const anchorX = barrel.forwardOffset || 0;
  const anchorY = barrel.sideOffset || 0;
  const barrelAngle = barrel.angleOffset || 0;
  const muzzleX = anchorX + Math.cos(barrelAngle) * ((barrel.backOffset || 0) + barrel.length);
  const muzzleY = anchorY + Math.sin(barrelAngle) * ((barrel.backOffset || 0) + barrel.length);
  const rotated = rotatePoint(muzzleX, muzzleY, source.angle);

  return {
    x: source.x + rotated.x,
    y: source.y + rotated.y,
  };
}

function bounceFromWorld(entity) {
  if (entity.x <= entity.radius || entity.x >= WORLD_SIZE - entity.radius) {
    entity.heading = Math.PI - entity.heading;
  }

  if (entity.y <= entity.radius || entity.y >= WORLD_SIZE - entity.radius) {
    entity.heading = -entity.heading;
  }

  clampEntityToWorld(entity);
}

function circlesOverlap(a, b) {
  return distanceBetween(a, b) < a.radius + b.radius;
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function separateCircles(a, b, aWeight) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy) || 0.0001;
  const overlap = a.radius + b.radius - distance;

  if (overlap <= 0) {
    return;
  }

  const nx = dx / distance;
  const ny = dy / distance;
  const bWeight = 1 - aWeight;

  a.x -= nx * overlap * aWeight;
  a.y -= ny * overlap * aWeight;
  b.x += nx * overlap * bWeight;
  b.y += ny * overlap * bWeight;

  clampEntityToWorld(a);
  clampEntityToWorld(b);
}

function isInWorld(entity) {
  return (
    entity.x >= -120 &&
    entity.y >= -120 &&
    entity.x <= WORLD_SIZE + 120 &&
    entity.y <= WORLD_SIZE + 120
  );
}

function nextId() {
  entityId += 1;
  return entityId;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function lerpAngle(start, end, amount) {
  let delta = ((end - start + Math.PI) % TAU) - Math.PI;
  if (delta < -Math.PI) {
    delta += TAU;
  }
  return start + delta * amount;
}

function rotatePoint(x, y, angle) {
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
  };
}

function drawMiniMapDot(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

function syncLeaderboard(player) {
  if (!player) {
    dom.leaderboardStatus.textContent = "상위 0";
    const markup = '<div class="leaderboard__empty">닉네임을 정하고 게임을 시작하세요.</div>';
    if (state.ui.leaderboardMarkup !== markup) {
      state.ui.leaderboardMarkup = markup;
      dom.leaderboardList.innerHTML = markup;
    }
    return;
  }

  const entries = [
    {
      id: player.id,
      nickname: player.nickname,
      level: player.level,
      score: Math.floor(state.score),
      label: state.match.teamBased
        ? `${TEAM_DEFS[player.team].label} · ${CLASS_DEFS[player.classId].label}`
        : CLASS_DEFS[player.classId].label,
      isPlayer: true,
    },
    ...state.enemies.map((enemy) => ({
      id: enemy.id,
      nickname: enemy.nickname,
      level: enemy.level,
      score: Math.floor(enemy.score),
      label: state.match.teamBased ? TEAM_DEFS[enemy.team].label : "로그",
      isPlayer: false,
    })),
  ].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    return right.level - left.level;
  });

  const playerRank = entries.findIndex((entry) => entry.isPlayer) + 1;
  const topEntries = entries.slice(0, LEADERBOARD_LIMIT);
  const playerInTop = topEntries.some((entry) => entry.isPlayer);
  const renderEntries = playerInTop ? topEntries : [...topEntries.slice(0, LEADERBOARD_LIMIT - 1), entries[playerRank - 1]];

  dom.leaderboardStatus.textContent = state.match.teamBased
    ? `${state.match.mapLabel} · ${getMatchStatusLabel()}`
    : `${state.match.mapLabel} · 내 순위 #${playerRank}`;

  const markup = renderEntries
    .map((entry) => {
      const rank = entries.findIndex((ranked) => ranked.id === entry.id) + 1;
      return `
        <div class="leaderboard__row ${entry.isPlayer ? "is-player" : ""}">
          <span class="leaderboard__rank">${rank}</span>
          <div class="leaderboard__main">
            <strong class="leaderboard__name">${escapeHtml(entry.nickname)}</strong>
            <span class="leaderboard__meta">${entry.label} · 레벨 ${entry.level}</span>
          </div>
          <strong class="leaderboard__score">${entry.score}</strong>
        </div>
      `;
    })
    .join("");

  if (state.ui.leaderboardMarkup !== markup) {
    state.ui.leaderboardMarkup = markup;
    dom.leaderboardList.innerHTML = markup;
  }
}

function resetChat() {
  state.chat.messages = [];
  state.chat.botCooldown = randomBetween(5, 9);
  state.chat.pendingReplies = [];
  renderChat();
  syncChatStatus();
  pushChatMessage("시스템", "게임이 시작됐습니다. 엔터로 채팅할 수 있습니다.", "system");
}

function initializeMusic() {
  const audio = new Audio();
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = state.music.volume;
  state.music.audio = audio;
  dom.musicVolume.value = String(Math.round(state.music.volume * 100));

  audio.addEventListener("loadeddata", () => {
    if (audio.paused) {
      state.music.status = "준비됨";
    }
    syncMusicPanel();
  });

  audio.addEventListener("play", () => {
    state.music.status = "재생 중";
    syncMusicPanel();
  });

  audio.addEventListener("pause", () => {
    if (state.music.fileName) {
      state.music.status = "일시정지";
    }
    syncMusicPanel();
  });

  audio.addEventListener("error", () => {
    state.music.status = "재생 실패";
    syncMusicPanel();
  });

  syncMusicPanel();
}

function handleMusicFileSelection() {
  const file = dom.musicFile.files?.[0];
  if (!file || !state.music.audio) {
    return;
  }

  if (state.music.objectUrl) {
    URL.revokeObjectURL(state.music.objectUrl);
  }

  state.music.objectUrl = URL.createObjectURL(file);
  state.music.fileName = file.name;
  state.music.status = "불러오는 중...";
  state.music.audio.src = state.music.objectUrl;
  state.music.audio.currentTime = 0;
  state.music.audio.load();
  syncMusicPanel();
  playMusic();
}

function playMusic() {
  if (!state.music.audio || !state.music.fileName) {
    return;
  }

  state.music.status = "재생 시작 중...";
  syncMusicPanel();

  const playback = state.music.audio.play();
  if (playback?.catch) {
    playback.catch(() => {
      state.music.status = "재생 버튼을 눌러 시작";
      syncMusicPanel();
    });
  }
}

function toggleMusicPlayback() {
  if (!state.music.audio || !state.music.fileName) {
    return;
  }

  if (state.music.audio.paused) {
    playMusic();
    return;
  }

  state.music.audio.pause();
}

function setMusicVolume(volume) {
  const nextVolume = clamp(volume, 0, 1);
  state.music.volume = nextVolume;
  if (state.music.audio) {
    state.music.audio.volume = nextVolume;
  }
  saveStoredMusicVolume(nextVolume);
  syncMusicPanel();
}

function syncMusicPanel() {
  const hasTrack = Boolean(state.music.fileName);
  const isPlaying = hasTrack && state.music.audio && !state.music.audio.paused;

  dom.musicStatus.textContent = hasTrack ? (isPlaying ? "재생 중" : state.music.status) : "파일 없음";
  dom.musicTrack.textContent = hasTrack ? state.music.fileName : "직접 가진 오디오 파일을 불러오세요";
  dom.musicToggle.disabled = !hasTrack;
  dom.musicToggle.textContent = isPlaying ? "일시정지" : "재생";
}

function updateChat(delta) {
  if (state.chat.pendingReplies.length) {
    for (const reply of state.chat.pendingReplies) {
      reply.delay -= delta;
    }

    const readyReplies = state.chat.pendingReplies.filter((reply) => reply.delay <= 0);
    state.chat.pendingReplies = state.chat.pendingReplies.filter((reply) => reply.delay > 0);

    for (const reply of readyReplies) {
      const speaker = state.enemies.find((enemy) => enemy.id === reply.speakerId);
      pushChatMessage(speaker?.nickname || reply.author, reply.text, "bot");
    }
  }

  state.chat.botCooldown -= delta;
  if (state.chat.pendingReplies.length || state.chat.botCooldown > 0 || state.enemies.length === 0) {
    return;
  }

  const speaker = sample(state.enemies);
  if (speaker) {
    pushChatMessage(speaker.nickname, sample(BOT_CHAT_LINES), "bot");
  }

  state.chat.botCooldown = randomBetween(8, 15);
}

function submitChatMessage() {
  const text = sanitizeChatMessage(dom.chatInput.value);
  if (!text || state.mode !== "running" || !state.player) {
    return;
  }

  pushChatMessage(state.player.nickname, text, "player");
  queueEnemyReplies(text);
  dom.chatInput.value = "";
  state.chat.botCooldown = randomBetween(10, 16);
  dom.chatInput.blur();
}

function pushChatMessage(author, text, kind) {
  state.chat.messages.push({
    id: nextId(),
    author,
    text,
    kind,
  });
  state.chat.messages = state.chat.messages.slice(-22);
  renderChat();
}

function renderChat() {
  if (state.chat.messages.length === 0) {
    dom.chatLog.innerHTML = '<div class="chat-empty">채팅이 여기에 표시됩니다.</div>';
    return;
  }

  dom.chatLog.innerHTML = state.chat.messages
    .map((message) => {
      return `
        <div class="chat-message chat-message--${message.kind}">
          <span class="chat-message__author">${escapeHtml(message.author)}</span>
          <span class="chat-message__body">${escapeHtml(message.text)}</span>
        </div>
      `;
    })
    .join("");

  dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
}

function syncChatStatus() {
  if (state.mode !== "running") {
    dom.chatStatus.textContent = "게임 시작 전";
    dom.chatInput.disabled = true;
    dom.chatInput.placeholder = "게임 시작 후 채팅 가능";
    return;
  }

  dom.chatStatus.textContent = document.activeElement === dom.chatInput ? "입력 중..." : "엔터로 채팅";
  dom.chatInput.disabled = false;
  dom.chatInput.placeholder = "메시지 입력";
}

function queueEnemyReplies(playerText) {
  if (state.enemies.length === 0) {
    return;
  }

  const replyCount = Math.min(state.enemies.length, Math.random() < 0.4 ? 2 : 1);
  const speakers = shuffle([...state.enemies]).slice(0, replyCount);
  const usedReplies = new Set();

  state.chat.pendingReplies = [];

  for (let index = 0; index < speakers.length; index += 1) {
    const speaker = speakers[index];
    const replyText = buildEnemyReplyText(playerText, usedReplies);
    state.chat.pendingReplies.push({
      speakerId: speaker.id,
      author: speaker.nickname,
      text: replyText,
      delay: randomBetween(0.7, 1.6) + index * randomBetween(0.8, 1.4),
    });
  }
}

function buildEnemyReplyText(playerText, usedReplies) {
  const normalized = playerText.toLowerCase();
  const rule = BOT_REPLY_RULES.find((entry) => entry.pattern.test(normalized));
  const isQuestion = /[?？]$/.test(playerText.trim()) || /(뭐|왜|어디|어떻게|언제|누가|맞아|임\?|야\?)/.test(normalized);
  const pool = rule?.replies || (isQuestion ? BOT_REPLY_QUESTION_FALLBACKS : BOT_REPLY_FALLBACKS);

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const reply = sample(pool);
    if (!usedReplies.has(reply)) {
      usedReplies.add(reply);
      return reply;
    }
  }

  const fallback = sample(BOT_REPLY_FALLBACKS);
  usedReplies.add(fallback);
  return fallback;
}

function getMiniMapShapeRadius(shape) {
  if (shape.type === "alphaPentagon") {
    return 4.8;
  }

  if (shape.type === "squishedSquare") {
    return 2.2;
  }

  if (shape.type === "hexagon") {
    return 3.4;
  }

  if (shape.type === "pentagon") {
    return 2.6;
  }

  return 1.7;
}

function getShapeLabel(type) {
  if (type === "square") {
    return "네모";
  }

  if (type === "squishedSquare") {
    return "찌그러진 네모";
  }

  if (type === "triangle") {
    return "삼각형";
  }

  if (type === "pentagon") {
    return "오각형";
  }

  if (type === "hexagon") {
    return "육각형";
  }

  if (type === "alphaPentagon") {
    return "알파 오각형";
  }

  return type;
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function hideOverlay() {
  dom.overlay.classList.add("is-hidden");
}

function setOverlay(title, text, buttonLabel) {
  dom.overlayTitle.textContent = title;
  dom.overlayText.textContent = text;
  dom.startButton.textContent = buttonLabel;
  dom.overlay.classList.remove("is-hidden");
  requestAnimationFrame(() => {
    dom.nicknameInput.focus();
    dom.nicknameInput.select();
  });
}

function syncCreatorPanel() {
  dom.creatorPanel.classList.toggle("is-hidden", !state.creator.open);
  dom.creatorToggle.classList.toggle("is-unlocked", state.creator.unlocked);
  dom.creatorToggle.textContent = state.creator.unlocked ? "제작자 활성" : "제작자";
  dom.creatorBadge.textContent = state.creator.unlocked ? "해금됨" : "잠김";
  dom.creatorMessage.textContent = state.creator.message;
  dom.creatorAuth.hidden = state.creator.unlocked;
  dom.creatorControls.hidden = !state.creator.unlocked;

  for (const button of dom.creatorPanel.querySelectorAll("[data-creator-toggle]")) {
    const flag = button.dataset.creatorToggle;
    button.classList.toggle("is-active", Boolean(state.creator[flag]));
  }

  if (state.creator.open && !state.creator.unlocked) {
    requestAnimationFrame(() => {
      dom.creatorPassword.focus();
      dom.creatorPassword.select();
    });
  }
}

function syncClassPanel(player) {
  if (!player) {
    dom.classTierLabel.textContent = "티어 0";
    dom.className.textContent = "기본 전차";
    dom.classDescription.textContent = "균형 잡힌 시작 전차입니다.";
    dom.classStatus.textContent = "첫 분기는 레벨 8에서 해금됩니다.";

    if (state.ui.classMarkup !== '<div class="class-note">레벨 8이 되면 쌍포, 저격 전차, 기관포로 분기할 수 있습니다.</div>') {
      state.ui.classMarkup = '<div class="class-note">레벨 8이 되면 쌍포, 저격 전차, 기관포로 분기할 수 있습니다.</div>';
      dom.classList.innerHTML = state.ui.classMarkup;
    }
    return;
  }

  const currentClass = CLASS_DEFS[player.classId] || CLASS_DEFS.basic;
  const choices = getAvailableClassChoices(player);
  const nextUnlock = getNextClassUnlock(player);

  dom.className.textContent = currentClass.label;
  dom.classDescription.textContent = currentClass.description;

  if (choices.length) {
    dom.classTierLabel.textContent = `티어 ${choices[0].tier} 해금`;
    dom.classStatus.textContent = `${CLASS_HOTKEYS.slice(0, choices.length).map((entry) => entry.hotkey).join(", ")} 키로 분기를 선택하세요.`;

    const markup = choices.map((choice, index) => {
      return `
        <button
          class="class-card"
          data-class-choice="${choice.id}"
          type="button"
          style="--class-accent:${choice.colors.body};"
        >
          <div class="class-card__top">
            <span class="class-card__title">${choice.label}</span>
            <span class="class-card__hotkey">${CLASS_HOTKEYS[index].hotkey}</span>
          </div>
          <p class="class-card__text">${choice.description}</p>
        </button>
      `;
    }).join("");

    if (state.ui.classMarkup !== markup) {
      state.ui.classMarkup = markup;
      dom.classList.innerHTML = markup;
    }
    return;
  }

  if (nextUnlock) {
    dom.classTierLabel.textContent = `티어 ${currentClass.tier}`;
    dom.classStatus.textContent = `다음 분기는 레벨 ${nextUnlock.level}에서 해금됩니다.`;
    const markup = `<div class="class-note">살아남아 레벨 ${nextUnlock.level}에 도달하면 다음 전차 분기가 열립니다.</div>`;
    if (state.ui.classMarkup !== markup) {
      state.ui.classMarkup = markup;
      dom.classList.innerHTML = markup;
    }
    return;
  }

  dom.classTierLabel.textContent = `티어 ${currentClass.tier}`;
  dom.classStatus.textContent = "최종 전차입니다.";
  const markup = '<div class="class-note">이 분기는 최종 진화입니다. 업그레이드와 점수를 계속 쌓으세요.</div>';
  if (state.ui.classMarkup !== markup) {
    state.ui.classMarkup = markup;
    dom.classList.innerHTML = markup;
  }
}

function syncCompactHud(player) {
  if (!player) {
    dom.compactLevel.textContent = "레벨 1";
    dom.compactPoints.textContent = "0 포인트";
    dom.compactHpFill.style.width = "0%";
    dom.compactXpFill.style.width = "0%";
    dom.compactHpText.textContent = "0 / 0";
    dom.compactXpText.textContent = "0 / 0";
    dom.compactClassName.textContent = "기본 전차";
    dom.compactClassStatus.textContent = "레벨 8에서 전차 분기 해금";

    const markup = '<div class="compact-class-note">레벨을 올리면 전차 분기가 열립니다.</div>';
    if (state.ui.compactClassMarkup !== markup) {
      state.ui.compactClassMarkup = markup;
      dom.compactClassChoices.innerHTML = markup;
    }
    return;
  }

  const currentClass = CLASS_DEFS[player.classId] || CLASS_DEFS.basic;
  const hpRatio = clamp(player.health / player.maxHealth, 0, 1);
  const xpRatio = clamp(player.xp / player.xpToNext, 0, 1);
  const choices = getAvailableClassChoices(player);
  const nextUnlock = getNextClassUnlock(player);

  dom.compactLevel.textContent = state.match.teamBased
    ? `${state.match.label} · ${state.match.mapLabel}`
    : `${state.match.mapLabel} · 레벨 ${player.level}`;
  dom.compactPoints.textContent = state.match.teamBased
    ? getMatchStatusLabel()
    : getPlayerPointsLabel(player);
  dom.compactHpFill.style.width = `${hpRatio * 100}%`;
  dom.compactXpFill.style.width = `${xpRatio * 100}%`;
  dom.compactHpText.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`;
  dom.compactXpText.textContent = `${Math.floor(player.xp)} / ${player.xpToNext}`;
  dom.compactClassName.textContent = state.match.teamBased
    ? `${currentClass.label} | ${TEAM_DEFS[player.team].label} 팀`
    : `${currentClass.label} | 티어 ${currentClass.tier}`;

  if (choices.length) {
    dom.compactClassStatus.textContent = `전차 분기 가능: ${CLASS_HOTKEYS.slice(0, choices.length).map((entry) => entry.hotkey).join(", ")}`;
    const markup = choices.map((choice, index) => {
      return `
        <button
          class="compact-class-choice"
          data-compact-class-choice="${choice.id}"
          type="button"
        >
          <span class="compact-class-choice__hotkey">${CLASS_HOTKEYS[index].hotkey}</span>
          <strong>${choice.label}</strong>
        </button>
      `;
    }).join("");

    if (state.ui.compactClassMarkup !== markup) {
      state.ui.compactClassMarkup = markup;
      dom.compactClassChoices.innerHTML = markup;
    }
    return;
  }

  if (player.points > 0) {
    dom.compactClassStatus.textContent = "1-6 키로 업그레이드";
  } else if (nextUnlock) {
    dom.compactClassStatus.textContent = `다음 분기 레벨 ${nextUnlock.level}`;
  } else {
    dom.compactClassStatus.textContent = "최종 전차 도달";
  }

  const note = player.points > 0
    ? `<div class="compact-class-note">${player.points} 포인트 사용 가능. 1-6 키로 전차를 강화하세요.</div>`
    : nextUnlock
      ? `<div class="compact-class-note">현재 전차: ${currentClass.label}. 레벨 ${nextUnlock.level}에서 다음 분기가 해금됩니다.</div>`
      : `<div class="compact-class-note">${currentClass.label}은 최종 진화입니다. 점수를 올리고 스탯을 최대까지 찍으세요.</div>`;

  if (state.ui.compactClassMarkup !== note) {
    state.ui.compactClassMarkup = note;
    dom.compactClassChoices.innerHTML = note;
  }

  syncChatStatus();
}

function resolvePlayerNickname() {
  const clean = sanitizeNickname(dom.nicknameInput.value);
  const nickname = !clean || clean === "Tank" ? "전차" : clean;
  dom.nicknameInput.value = nickname;
  saveStoredNickname(nickname);
  return nickname;
}

function getMatchScoreSummary() {
  if (!state.match.teamBased) {
    return "";
  }

  if (state.match.id === "territory") {
    return `${TEAM_DEFS.blue.label} ${Math.floor(state.match.teamScores.blue)}칸 : ${Math.floor(state.match.teamScores.red)}칸 ${TEAM_DEFS.red.label}`;
  }

  return `${TEAM_DEFS.blue.label} ${Math.floor(state.match.teamScores.blue)} : ${Math.floor(state.match.teamScores.red)} ${TEAM_DEFS.red.label}`;
}

function getMatchStatusLabel() {
  const score = getMatchScoreSummary();
  if (!state.match.timeLimit) {
    return score;
  }

  return `${score} | ${formatDuration(state.match.timeRemaining)}`;
}

function formatDuration(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safe / 60);
  const remain = safe % 60;
  return `${minutes}:${String(remain).padStart(2, "0")}`;
}

function getPlayerPointsLabel(player) {
  return isCreatorInfinitePoints() ? "∞ 포인트" : `${player.points} 포인트`;
}

function isCreatorInfinitePoints() {
  return state.creator.unlocked && state.creator.infinitePoints;
}

function unlockCreatorMode() {
  if (dom.creatorPassword.value === CREATOR_PASSWORD) {
    state.creator.unlocked = true;
    state.creator.message = "제작자 모드가 해금되었습니다. 아래 기능을 사용할 수 있습니다.";
    dom.creatorPassword.value = "";
    pushFeed("제작자 모드 해금.");
  } else {
    state.creator.message = "비밀번호가 틀렸습니다.";
    dom.creatorPassword.select();
  }

  syncHud();
  syncCreatorPanel();
}

function toggleCreatorFlag(flag) {
  if (!state.creator.unlocked) {
    return;
  }

  state.creator[flag] = !state.creator[flag];
  if (flag === "invulnerable") {
    state.creator.message = state.creator.invulnerable ? "무적이 활성화되었습니다." : "무적이 비활성화되었습니다.";
  }

  if (flag === "infinitePoints") {
    state.creator.message = state.creator.infinitePoints ? "무한 포인트가 활성화되었습니다." : "무한 포인트가 비활성화되었습니다.";
  }

  syncHud();
  syncCreatorPanel();
}

function runCreatorAction(action) {
  if (!state.creator.unlocked) {
    return;
  }

  if (!state.player || state.mode !== "running") {
    state.creator.message = "먼저 게임을 시작하세요.";
    syncCreatorPanel();
    return;
  }

  if (action === "heal") {
    state.player.health = state.player.maxHealth;
    state.player.regenDelay = 0;
    state.creator.message = "플레이어 체력을 모두 회복했습니다.";
    pushFeed("제작자: 전체 회복.");
  }

  if (action === "levels") {
    grantPlayerLevels(5);
    state.creator.message = "5레벨을 올렸습니다.";
    pushFeed("제작자: +5레벨.");
  }

  if (action === "points") {
    state.player.points += 10;
    state.creator.message = "업그레이드 포인트 10을 지급했습니다.";
    pushFeed("제작자: +10포인트.");
  }

  if (action === "spawnEnemy") {
    state.enemies.push(createEnemyTank());
    state.creator.message = "로그 탱크 1기를 소환했습니다.";
    pushFeed("제작자: 로그 탱크 소환.");
  }

  if (action === "spawnAlpha") {
    state.shapes.push(createShape("alphaPentagon"));
    state.creator.message = "알파 오각형 1개를 소환했습니다.";
    pushFeed("제작자: 알파 오각형 소환.");
  }

  if (action === "clearEnemies") {
    const removed = state.enemies.length;
    state.enemies = [];
    state.creator.message = `${removed}기 로그 탱크를 제거했습니다.`;
    pushFeed(`제작자: 로그 ${removed}기 제거.`);
  }

  syncHud();
  syncCreatorPanel();
}

function grantPlayerLevels(count) {
  const player = state.player;
  for (let index = 0; index < count; index += 1) {
    player.level += 1;
    player.points += UPGRADE_POINTS_PER_LEVEL;
    if (player.level % BONUS_POINT_INTERVAL === 0) {
      player.points += 1;
    }
    player.xpToNext = Math.round(player.xpToNext * 1.22 + 18);
  }

  recomputePlayerStats(player, true);
  player.health = player.maxHealth;
  maybeAnnounceClassUnlock(player);
}

function loadStoredNickname() {
  try {
    const stored = sanitizeNickname(localStorage.getItem(NICKNAME_STORAGE_KEY) || "");
    return !stored || stored === "Tank" ? "전차" : stored;
  } catch {
    return "전차";
  }
}

function loadStoredMapId() {
  try {
    const stored = localStorage.getItem(MAP_STORAGE_KEY) || "classic";
    return MAP_DEFS[stored] ? stored : "classic";
  } catch {
    return "classic";
  }
}

function loadStoredMusicVolume() {
  try {
    const raw = Number.parseFloat(localStorage.getItem(MUSIC_VOLUME_STORAGE_KEY) || "0.55");
    return clamp(Number.isFinite(raw) ? raw : 0.55, 0, 1);
  } catch {
    return 0.55;
  }
}

function saveStoredMusicVolume(value) {
  try {
    localStorage.setItem(MUSIC_VOLUME_STORAGE_KEY, String(clamp(value, 0, 1)));
  } catch {
    return;
  }
}

function saveStoredNickname(value) {
  try {
    localStorage.setItem(NICKNAME_STORAGE_KEY, value || "전차");
  } catch {
    return;
  }
}

function saveStoredMapId(value) {
  try {
    localStorage.setItem(MAP_STORAGE_KEY, MAP_DEFS[value] ? value : "classic");
  } catch {
    return;
  }
}

function sanitizeNickname(value) {
  return (value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 16);
}

function sanitizeChatMessage(value) {
  return (value || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);
}

function makeEnemyNickname(team = "rogue") {
  if (team === "blue") {
    return `블루 ${sample(ENEMY_NAME_SUFFIXES)}`;
  }

  if (team === "red") {
    return `레드 ${sample(ENEMY_NAME_SUFFIXES)}`;
  }

  return `${sample(ENEMY_NAME_PREFIXES)} ${sample(ENEMY_NAME_SUFFIXES)}`;
}

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isTypingTarget(target) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}
