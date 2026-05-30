// WORD BUILDER - Kelime Kategorileri
// Her kategori yalnızca word_builder_dictionary.js'te geçerli olan kelimeleri içerir.
// Bonus mantığı: o turdaki aktif kategoriden bir kelime yapılırsa hasar x2 uygulanır.

const CATEGORIES = [
  {
    id: 'HAYVANLAR',
    label: '🐾 Hayvanlar',
    color: '#4ade80',
    glow:  'rgba(74,222,128,0.7)',
    words: new Set([
      'ANT','APE','ASS','BAT','BEAR','BEE','BIRD','BISON','BUCK','BUFFALO','BULL','BUNNY','BUTTERFLY',
      'CAMEL','CAT','CHICKEN','CLAM','COD','COW','COYOTE','CRAB','CRANE','CROW','CUB',
      'DEER','DOE','DOG','DONKEY','DOVE','DRAGON','DUCK',
      'EAGLE','ELK','EMU',
      'FALCON','FISH','FLY','FOX','FROG',
      'GNU','GOAT','GOOSE','GORILLA','GULL',
      'HARE','HAWK','HEN','HOG','HORSE',
      'IBIS',
      'JAGUAR','JAY',
      'KITTEN','KITE',
      'LAMB','LEOPARD','LION','LIZARD','LOBSTER','LYNX',
      'MOLE','MONKEY','MOOSE','MULE',
      'OCTOPUS','OTTER','OWL','OYSTER',
      'PANTHER','PARROT','PENGUIN','PIG','PIGEON','PIKE','PONY','PYTHON',
      'RABBIT','RAM','RAT','RAVEN','RAY','RHINO',
      'SALMON','SEAL','SHEEP','SLUG','SNAKE','SPARROW','SPIDER','SQUID','STAG','STORK','SWAN',
      'TIGER','TROUT','TURTLE',
      'WHALE','WOLF','WORM',
      'ZEBRA',
      'BADGER','BEAVER'
    ])
  },
  {
    id: 'DOGA',
    label: '🌿 Doğa',
    color: '#86efac',
    glow:  'rgba(134,239,172,0.7)',
    words: new Set([
      'AIR','ALPS','ASH',
      'BAY','BEACH','BLUFF','BROOK','BUSH',
      'CANYON','CAPE','CAVE','CLIFF','CLOUD','COAST','CORAL','CRATER','CREEK','CREST',
      'DALE','DELTA','DESERT','DEW','DIRT','DUNE','DUSK','DUST',
      'EARTH',
      'FALLS','FIELD','FLINT','FLOOD','FLORA','FOG','FORD','FOREST','FROST',
      'GALE','GLACIER','GLEN','GORGE','GRANITE','GRAVEL','GROVE','GULF',
      'HEATH','HILL',
      'ICE','INLET','ISLAND',
      'JUNGLE',
      'LAGOON','LAKE','LAVA','LEAF',
      'MARSH','MEADOW','MESA','MIST','MOSS','MOUNT','MUD',
      'OASIS','OCEAN','ORE',
      'PEAK','PLAIN','PLATEAU','POND','POOL','PRAIRIE',
      'RAIN','RAPIDS','REED','REEF','RIDGE','RIVER','ROCK','ROOT',
      'SAND','SEA','SHORE','SKY','SLOPE','SNOW','SOIL','SPRING','STONE','STORM','STRAIT','STREAM','SUMMIT','SWAMP',
      'TIDE','TIMBER','TORRENT','TREE',
      'VALLEY','VAPOR','VINE','VOLCANO',
      'WATER','WAVE','WETLAND','WIND','WOOD'
    ])
  },
  {
    id: 'BESINLER',
    label: '🍎 Besinler',
    color: '#f97316',
    glow:  'rgba(249,115,22,0.7)',
    words: new Set([
      'APPLE',
      'BACON','BANANA','BASIL','BEAN','BEEF','BERRY','BISCUIT','BREAD','BUTTER',
      'CAKE','CANDY','CARROT','CEREAL','CHEESE','CHERRY','CHICKEN','CHIP','CHOP','CLAM','COCOA','COFFEE','CORN','CREAM','CRISP','CURRY',
      'DATE','DOUGH',
      'EGG',
      'FIG','FISH','FLOUR','FUDGE',
      'GARLIC','GINGER','GRAPE',
      'HAM','HERB','HONEY',
      'JAM','JELLY','JUICE',
      'LAMB','LEMON','LIME',
      'MANGO','MAPLE','MEAT','MILK','MINT',
      'NUT',
      'OIL','OLIVE','ONION','ORANGE',
      'PASTA','PASTRY','PEACH','PEANUT','PEAR','PEPPER','PIE','PIZZA','PLUM','PORK','POTATO',
      'RICE','ROLL','RUM','RYE',
      'SAGE','SALAD','SALMON','SALT','SAUCE','SEED','SOUP','SPICE','STEAK','SUGAR','SYRUP',
      'TACO','TOAST','TOMATO','TUNA','TURKEY',
      'VANILLA','VINEGAR',
      'WALNUT','WHEAT','WINE',
      'YOGURT'
    ])
  },
  {
    id: 'MESLEKLER',
    label: '👔 Meslekler',
    color: '#60a5fa',
    glow:  'rgba(96,165,250,0.7)',
    words: new Set([
      'ACTOR','AGENT','ANALYST','ARTIST','AUTHOR',
      'BAKER','BANKER','BARBER','BUILDER','BUTCHER',
      'CASHIER','CHEF','CHEMIST','CLERK','COACH','COOK','COUNSEL',
      'DEAN','DENTIST','DOCTOR','DRIVER',
      'EDITOR',
      'FARMER',
      'GUARD','GUIDE',
      'HERALD',
      'JUDGE',
      'KEEPER',
      'LAWYER','LEADER',
      'MAID','MANAGER','MASON','MENTOR','MINER','MONK',
      'NURSE',
      'OFFICER',
      'PAINTER','PASTOR','PILOT','POET','PORTER','PRIEST','PRINTER',
      'RANGER',
      'SAILOR','SCHOLAR','SCOUT','SELLER','SENATOR','SINGER','SOLDIER','SURGEON',
      'TAILOR','TEACHER','TRAINER','TUTOR',
      'VENDOR','VET',
      'WRITER'
    ])
  },
  {
    id: 'SPOR',
    label: '⚽ Spor',
    color: '#facc15',
    glow:  'rgba(250,204,21,0.7)',
    words: new Set([
      'ACE','ARCHER','ARCHERY',
      'BALL','BOXING',
      'CAPTAIN','CATCH','CHESS','CIRCUIT','COACH','COURT','CRICKET','CYCLING',
      'DART','DEFENSE','DIVE','DUEL',
      'FENCING','FIELD','FINALS','FITNESS','FLOAT','FOOTBALL','BASKETBALL','HANDBALL',
      'GAME','GOAL','GOLF','GYM',
      'HIT','HOCKEY',
      'JUMP',
      'KARATE','KICK',
      'LAP','LEAGUE','LIFT',
      'MATCH','MEDAL','MOTOR',
      'NET',
      'OFFENSE',
      'PASS','PITCH','POLO','POOL',
      'RACE','RALLY','RECORD','RELAY','RING','ROUND','RUGBY','RUN',
      'SERVE','SET','SHOT','SKATE','SKI','SLAM','SOCCER','SPRINT','SURF','SWIM',
      'TACKLE','TEAM','TENNIS','THROW','TRACK','TROPHY','TURF',
      'VAULT','VOLLEY',
      'WARM','WIN',
      'YOGA'
    ])
  },
  {
    id: 'TEKNOLOJI',
    label: '💻 Teknoloji',
    color: '#a78bfa',
    glow:  'rgba(167,139,250,0.7)',
    words: new Set([
      'ARRAY','AUDIO',
      'BACKUP','BATTERY','BINARY','BOOT','BROWSER','BUG','BYTE','BOT',
      'CABLE','CACHE','CHIP','CIRCUIT','CLICK','CLOUD','CODE','COMPILE','CONNECT','CORE','CURSOR',
      'DATA','DEBUG','DEVICE','DIGITAL','DISK','DISPLAY','DOMAIN','DRIVE','DRIVER',
      'ENGINE','ERROR',
      'FILE','FILTER','FLASH','FONT','FORMAT','FRAME',
      'GAME',
      'HACK','HOST',
      'INPUT','INSTALL',
      'JAVA',
      'KERNEL',
      'LAPTOP','LASER','LINK','LOOP',
      'MACRO','MEMORY','MENU','MODEM','MODULE','MONITOR','MOUSE',
      'NET','NETWORK','NODE',
      'OPEN','OUTPUT',
      'PATCH','PIXEL','PORT','POWER','PRINT','PROCESS','PROGRAM','PROXY',
      'QUERY',
      'RADIO','RAM','REBOOT','ROUTER',
      'SCAN','SCREEN','SCRIPT','SEARCH','SECURE','SERVER','SIGNAL','SPEED','STORAGE','STREAM','SYNC','SYSTEM',
      'TOKEN',
      'UPLOAD','USER',
      'VIDEO','VIRTUAL','VIRUS',
      'WIDGET'
    ])
  },
  {
    id: 'DUYGULAR',
    label: '❤️ Duygular',
    color: '#f472b6',
    glow:  'rgba(244,114,182,0.7)',
    words: new Set([
      'AFRAID','ANGER','ANXIETY','ANXIOUS','AWE',
      'BLISS','BORED',
      'CALM','CONTENT','COURAGE','CURIOUS',
      'DESPAIR','DOUBT','DREAD',
      'EAGER','ENVY','EXCITED',
      'FEAR','FOND','FURY',
      'GLAD','GRIEF','GUILT',
      'HAPPY','HATE','HOPE','HORROR','HUMBLE','HURT',
      'JEALOUS','JOY',
      'LONELY','LOVE','LUST',
      'MAD','MOODY',
      'NERVOUS',
      'PANIC','PASSION','PITY','PLEASED','PRIDE',
      'RAGE','REGRET','RELIEF',
      'SAD','SHAME','SHOCK','SORROW','STRESS',
      'TENDER','TERROR','TRUST',
      'WEARY','WONDER','WORRIED'
    ])
  },
  {
    id: 'RENKLER',
    label: '🎨 Renkler',
    color: '#fb923c',
    glow:  'rgba(251,146,60,0.7)',
    words: new Set([
      'AMBER','AQUA','AZURE',
      'BEIGE','BLACK','BLUE','BROWN',
      'COBALT','COPPER','CORAL','CREAM','CRIMSON','CYAN',
      'DENIM',
      'EBONY','EMERALD',
      'GOLD','GOLDEN','GRAY','GREEN',
      'INDIGO','IVORY',
      'JADE',
      'KHAKI',
      'LILAC','LIME',
      'MAGENTA','MAROON','MAUVE','MINT','MUSTARD',
      'NAVY',
      'OCHRE','OLIVE','ONYX','ORANGE',
      'PEACH','PINK','PLUM','PURPLE',
      'RED','ROSE','RUBY','RUST',
      'SAGE','SCARLET','SILVER','SLATE',
      'TAN','TEAL','TOPAZ',
      'VIOLET',
      'WHITE',
      'YELLOW'
    ])
  },
  {
    id: 'EYLEMLER',
    label: '⚡ Eylemler',
    color: '#fbbf24',
    glow:  'rgba(251,191,36,0.7)',
    words: new Set([
      'ACT','ADD','AID','AIM','ALLOW','ANSWER','ASK','AVOID',
      'BAN','BAR','BEG','BET','BID','BITE','BLEND','BLOCK','BLOW','BOUNCE','BREAK','BUILD','BURN','BUY',
      'CALL','CARRY','CATCH','CHANGE','CHASE','CHOP','CLAIM','CLEAN','CLIMB','CLOSE','COLLECT','COPY','COUNT','CREATE','CUT',
      'DARE','DEAL','DECIDE','DIG','DIVE','DRAG','DRAW','DRINK','DRIVE','DROP',
      'EARN','EAT','ESCAPE','EXPLORE',
      'FALL','FEAR','FEEL','FIGHT','FIND','FIX','FLEE','FLOAT','FLY','FOLD','FOLLOW','FORCE','FORM',
      'GET','GIVE','GRAB','GROW','GUARD','GUIDE',
      'HIT','HOLD','HUNT',
      'JUMP',
      'KICK','KILL','KNOW',
      'LEAD','LEARN','LEAVE','LIFT','LINK','LISTEN','LIVE','LOSE',
      'MAKE','MARK','MEET','MOVE',
      'OPEN','ORDER',
      'PASS','PICK','PLAN','PLAY','PULL','PUSH',
      'READ','RIDE','RISE','RUN',
      'SAVE','SEARCH','SELL','SEND','SERVE','SHARE','SHOW','SING','SIT','SKIP','SLAM','SLEEP','SLIP','SOLVE','SPIN','STAND','START','STAY','STEAL','STOP','SWIM',
      'TAKE','TALK','TEACH','TELL','THINK','THROW','TOUCH','TRAVEL','TRY','TURN',
      'UNITE','USE',
      'WALK','WANT','WASH','WATCH','WIN','WORK','WRITE'
    ])
  },
  {
    id: 'SAYILAR',
    label: '🔢 Sayılar',
    color: '#38bdf8',
    glow:  'rgba(56,189,248,0.7)',
    words: new Set([
      'ZERO',
      'ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','TEN',
      'ELEVEN','TWELVE','FIFTEEN','SIXTEEN',
      'TWENTY','THIRTY','FORTY','FIFTY','SIXTY','SEVENTY','EIGHTY','NINETY',
      'HUNDRED','MILLION','BILLION',
      'FIRST','SECOND','THIRD','FOURTH','FIFTH','SIXTH','SEVENTH','EIGHTH','NINTH','TENTH',
      'HALF','QUARTER','DOUBLE','TRIPLE','SINGLE',
      'ONCE','TWICE',
      'DOZEN','SCORE','GROSS'
    ])
  }
];

// Round başına kategori seç — aynı oyunda tekrar etmez, tümü bitince sıfırlanır
function pickRoundCategories(roundCount) {
  const shuffled = [...CATEGORIES].sort(() => Math.random() - 0.5);
  const result = [];
  for (let i = 0; i < roundCount; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}
