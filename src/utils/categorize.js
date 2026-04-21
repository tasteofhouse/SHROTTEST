// Keyword + channel-dictionary based YouTube category classification.

export const CATEGORIES = [
  { id: 'game',      label: '게임',        emoji: '🎮', color: '#8B5CF6' },
  { id: 'animal',    label: '동물/자연',   emoji: '🐱', color: '#10B981' },
  { id: 'food',      label: '음식/먹방',   emoji: '🍜', color: '#F59E0B' },
  { id: 'comedy',    label: '예능/유머',   emoji: '😂', color: '#FBBF24' },
  { id: 'drama',     label: '영화/드라마', emoji: '🎬', color: '#A78BFA' },
  { id: 'music',     label: '음악',        emoji: '🎵', color: '#EC4899' },
  { id: 'sports',    label: '스포츠',      emoji: '⚽', color: '#EF4444' },
  { id: 'news',      label: '뉴스/시사',   emoji: '📰', color: '#3B82F6' },
  { id: 'education', label: '교육/지식',   emoji: '📚', color: '#06B6D4' },
  { id: 'lifestyle', label: '뷰티/라이프', emoji: '💄', color: '#F472B6' },
  { id: 'tech',      label: 'IT/테크',     emoji: '💻', color: '#60A5FA' },
  { id: 'etc',       label: '기타',        emoji: '🌀', color: '#9CA3AF' },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Direct channel-name substring map. Weight = strong signal (10 points).
// Matched as a case-insensitive substring of the channel name.
const CHANNEL_DICT = [
  // ════════════════════════════════════════════════════════════
  // 🎮 GAME
  // ════════════════════════════════════════════════════════════
  // 스트리머 / 유튜버
  [/풍월량|테스터훈|김블루|감스트|파카|우왁굳|탬탬버린|주르르|비챤|뢰투스|괴물쥐|릴카|한동숙|삼식이|러너|눈꽃|설설설|뽀삐tv|악어tv/i, 'game'],
  [/이세계아이돌|징버거|단테|폭딜|도파|클템|캐리소프트|양띵|도티|잠뜰|허팝|홍방장|공혁준|침침|전소미게임|소닉|딩dong|이재혁|고수달|우리|떵개떵/i, 'game'],
  // e스포츠 / 게임사
  [/T1|젠지|KT롤스터|DRX|농심레드포스|한화생명|LSB|위즈|광동프릭스|LoL 챔피언십|LCK|프나틱|Cloud9|팀리퀴드|G2 Esports|Fnatic/i, 'game'],
  [/닌텐도코리아|플레이스테이션 코리아|Xbox Korea|소니인터랙티브|넥슨|넷마블|크래프톤|스마일게이트|카카오게임즈|엔씨소프트|펄어비스|컴투스|게임빌/i, 'game'],
  [/게임|gaming|gameplay|esports|이스포츠|LCK|LoL|롤|배그|발로란트|valorant|마인크래프트|minecraft|overwatch|오버워치|스팀|steam|닌텐도|엑박|xbox|플스|playstation|원신|로블록스|roblox|치지직|아프리카|스트리머/i, 'game'],

  // ════════════════════════════════════════════════════════════
  // 😂 COMEDY / ENTERTAINMENT
  // ════════════════════════════════════════════════════════════
  // 코미디 / 인터넷 예능
  [/침착맨|피식대학|숏박스|빵송국|장삐쭈|쿠쿠크루|쏘영|워크맨|문명특급|짤툰|흑역사클럽|라임튜브|허경환|오마이비키|빠더너스|B급며느리/i, 'comedy'],
  [/와썹맨|곽튜브|네고왕|핵인싸|킹아|이상준|스튜디오 와플|스튜디오 룰루랄라|채널 십오야|채널A 스튜디오|딩고|딩고프리스타일|스케치북/i, 'comedy'],
  [/뻔뻔한tv|장도연|이영지|엠카운트다운|흥카운트다운|신박한 정리|아이콘택트|라디오스타|유퀴즈|놀면뭐하니|미운우리새끼|런닝맨|1박2일|신서유기/i, 'comedy'],
  // 방송사 예능
  [/무한도전|나 혼자 산다|강심장|유재석|박명수|정준하|강호동|이경규|신동엽|김구라|탁재훈|이수근|전현무|조세호|홍진경|김종민|이광수|지석진|하하/i, 'comedy'],
  [/MBC 예능|SBS 예능|KBS 예능|tvN D|tvN 예능|JTBC 예능|채널A 예능|코미디빅리그|개그콘서트|코미디tv|스탠드업코미디/i, 'comedy'],

  // ════════════════════════════════════════════════════════════
  // 🎬 DRAMA / FILM
  // ════════════════════════════════════════════════════════════
  [/스튜디오드래곤|넷플릭스 코리아|Disney+코리아|웨이브|왓챠|티빙|시즌|CJ ENM|KBS드라마|MBC드라마|SBS드라마|JTBC드라마|tvN드라마/i, 'drama'],
  [/씨네필|키노라이츠|영화의전당|무비코멘터리|결말포함|스포주의|영화클립|드라마클립|하이라이트.*(드라마|영화)|명장면|OST|사운드트랙/i, 'drama'],
  [/드라마|영화|시네마|무비|filmmaker|movie|cinema|예고편|trailer|리뷰.*(영화|드라마)|디즈니|마블|DC|어벤저스|넷플릭스.*(드라마|영화)/i, 'drama'],

  // ════════════════════════════════════════════════════════════
  // 🎵 MUSIC
  // ════════════════════════════════════════════════════════════
  // 음반사 / 레이블
  [/HYBE|BIGHIT|빅히트|SM엔터|JYP엔터|YG엔터|스타쉽|FNC|큐브|플레디스|RBW|울림|IST엔터|모스트콘텐츠|앤씨티 코리아|키이스트|빌리프랩/i, 'music'],
  [/1theK|엠넷|MNET|멜론|melon|vlive|위버스|하이브레코드|지니뮤직|벅스뮤직|뮤직뱅크|인기가요|쇼챔피언|더쇼|쇼음악중심/i, 'music'],
  // 4세대 아이돌
  [/방탄소년단|BTS|BANGTANTV|블랙핑크|BLACKPINK|뉴진스|NewJeans|아이브|IVE|에스파|aespa|세븐틴|SEVENTEEN|트와이스|TWICE|르세라핌|LE SSERAFIM/i, 'music'],
  [/스트레이키즈|StrayKids|ITZY|있지|케플러|Kep1er|엔하이픈|ENHYPEN|TXT|투모로우바이투게더|NCT|엔시티|WayV|웨이션브이|aespa|에스파|몬스타엑스/i, 'music'],
  [/레드벨벳|Red Velvet|엑소|EXO|샤이니|SHINee|빅뱅|BigBang|소녀시대|SNSD|EXID|마마무|MAMAMOO|에이핑크|AOA|2NE1|f(x)|씨엔블루|인피니트|B1A4/i, 'music'],
  // 솔로 / 인디
  [/박재범|Jay Park|지코|ZICO|코드쿤스트|Code Kunst|넉살|빈지노|Beenzino|오혁|린|멜로망스|10cm|헤이즈|볼빨간사춘기|악동뮤지션|AKMU/i, 'music'],
  [/이찬혁|이수현|폴킴|정승환|임재현|소란|윤하|에픽하이|Epik High|다이나믹듀오|크러쉬|Crush|딘|DEAN|청하|황치열|임창정|이적|김범수/i, 'music'],
  [/뮤직|음악|노래|song|cover|커버|MV|뮤비|k-?pop|kpop|콘서트|공연|아이돌|뮤지컬|오케스트라|클래식|재즈|힙합|발라드/i, 'music'],

  // ════════════════════════════════════════════════════════════
  // ⚽ SPORTS
  // ════════════════════════════════════════════════════════════
  // 국내 선수
  [/손흥민|이강인|김민재|황희찬|황인범|정우영|류현진|김하성|이정후|양현종|오타니|다르빗슈|박지성|차범근|안정환|이동국|기성용/i, 'sports'],
  // KBO 구단
  [/두산베어스|삼성라이온즈|KIA타이거즈|LG트윈스|SSG랜더스|롯데자이언츠|키움히어로즈|NC다이노스|kt wiz|한화이글스/i, 'sports'],
  // 해외 구단
  [/토트넘|맨체스터유나이티드|맨시티|첼시|아스날|리버풀|레알마드리드|바르셀로나|아틀레티코|PSG|바이에른|도르트문트|나폴리|인테르|유벤투스|아약스/i, 'sports'],
  // 스포츠 방송 / 채널
  [/SPOTV|스포티비|KBO 공식|MLB 공식|NBA 공식|UFC 공식|스포츠서울|스포탈코리아|KBSN 스포츠|SBS Sports|MBC Sports|SBS Golf|Golf|골프/i, 'sports'],
  [/축구|야구|농구|배구|KBO|MLB|EPL|NBA|UFC|격투|하이라이트.*(축구|야구|경기)|스포츠|올림픽|월드컵|아시안게임|수영|테니스|배드민턴|탁구|볼링/i, 'sports'],

  // ════════════════════════════════════════════════════════════
  // 🍜 FOOD
  // ════════════════════════════════════════════════════════════
  // 유명 먹방/요리 채널
  [/백종원|쯔양|tzuyang|히밥|보영이네|시니시니|떠먹는하루|황제승|먹적|가나쵸코|가나초코|탕탕후루|엠브로|꼬질이|입짧은햇님|홍사운드/i, 'food'],
  [/강식당|먹방TV|임다|오늘뭐먹지|성시경 먹을텐데|쿠캣|다이닝플러스|요리왕비룡|이연복|승우아빠|해먹남녀|이밥차|닥터오유|집밥선생|국민레시피/i, 'food'],
  [/맛있겠다 맛집탐방|전국 맛집|먹방여행|미식가|쩝쩝박사|먹방대학|밥친구|식신|또간집|흑백요리사|냉삼|한식대첩|집밥백선생|라끼남/i, 'food'],
  [/먹방|mukbang|요리|레시피|recipe|쿡방|셰프|디저트|dessert|베이킹|맛집|식당|푸드|food|먹스타그램|혼밥|야식|치킨|피자|라면|떡볶이|삼겹살/i, 'food'],

  // ════════════════════════════════════════════════════════════
  // 📰 NEWS / CURRENT AFFAIRS
  // ════════════════════════════════════════════════════════════
  [/JTBC 뉴스|KBS 뉴스|SBS 뉴스|MBC 뉴스|YTN|채널A|TV조선|MBN|연합뉴스TV|뉴스타파|오마이뉴스|시사IN|미디어오늘|더탐사/i, 'news'],
  [/김어준|뉴스공장|sbs 비디오머그|비디오머그|뉴스1|뉴시스|한국경제|조선일보|중앙일보|동아일보|한겨레|경향신문|매일경제|한국일보|서울경제/i, 'news'],
  [/뉴스|news|보도|속보|시사|정치|사회|경제|breaking|국제|사건|이슈|뉴스룸|탐사보도|국회|대통령|총선|대선|논평|팩트체크/i, 'news'],

  // ════════════════════════════════════════════════════════════
  // 📚 EDUCATION / KNOWLEDGE
  // ════════════════════════════════════════════════════════════
  // 과학 / 지식
  [/셜록현준|안될과학|과학드림|사피엔스 스튜디오|체인지그라운드|세바시|궤도|리뷰엉이 지식|이과형|과학쿠키|지식해적단|북툰|허준이|1분과학/i, 'education'],
  // 입시 / 어학
  [/공부왕찐천재|최태성|이지수능교육|EBSi|메가스터디|대성마이맥|시대인재|이투스|스터디코드|수능|내신|토익|토플|오픽|영단기|해커스|시원스쿨/i, 'education'],
  // 재테크 / 경제
  [/신사임당|강환국|슈카월드|박곰희tv|주식|코인|부동산|재테크|경제공부|투자|삼프로tv|삼프로|한국경제tv|이데일리tv|경제야놀자|머니투데이|돈|월급|적금|ETF/i, 'education'],
  // 자기계발 / 인문
  [/체인지그라운드|세바시|드로잉덕|닥터프렌즈|정신건강|심리|인문학|철학|역사|역사저널|문학|글쓰기|스타트업|창업|마케팅|브랜딩/i, 'education'],
  [/EBS|TED|교육|강의|lecture|공부|study|지식|과학|science|역사|history|영어|수학|물리|화학|다큐|documentary|자기계발|해설|explained/i, 'education'],

  // ════════════════════════════════════════════════════════════
  // 💄 LIFESTYLE / BEAUTY / VLOG
  // ════════════════════════════════════════════════════════════
  // 뷰티
  [/다또아|씬님|회사원A|레나|풍자|슈스스TV|소영뷰티|다예|헤이지니|뚱카롱|이사배|포니신혜|포니|레오제이|자이언트핑크|오늘의하늘|에뛰드|달바|닥터자르트/i, 'lifestyle'],
  // 라이프스타일 / 브이로그
  [/박막례|보겸|육퇴후|달라스튜디오|빠니보틀|원지|곽준빈|이사배|김잼|나도현|신사임당 브이로그|워라밸|미니멀라이프|제로웨이스트|홈스타일링/i, 'lifestyle'],
  [/여행.*(브이로그|vlog)|해외여행|국내여행|여행기|배낭여행|한달살기|워킹홀리데이|세계여행|일본여행|유럽여행|미국여행|동남아|제주|부산|서울/i, 'lifestyle'],
  [/브이로그|vlog|일상|daily|데일리|뷰티|beauty|메이크업|makeup|화장|스킨케어|패션|fashion|ootd|쇼핑|네일|인테리어|살림|홈카페|루틴|모닝루틴/i, 'lifestyle'],

  // ════════════════════════════════════════════════════════════
  // 💻 TECH / IT / CARS
  // ════════════════════════════════════════════════════════════
  // 테크 유튜버
  [/잇섭|긱블|리뷰엉이|나는리뷰어다|테크유목민|잡톡|비교해TV|뻔뻔한TV|유우키|맥심TV|권아솔|IT동아|기즈모|두바이초코렛|박영진tv|딱따구리tv|Mrwhosetheboss|mkbhd|MKBHD/i, 'tech'],
  // 기업 공식
  [/삼성전자|LG전자|애플코리아|마이크로소프트|구글코리아|네이버|카카오|SKT|KT공식|LGU+|현대자동차|기아공식|테슬라코리아/i, 'tech'],
  // 자동차
  [/오토뷰|카랩|모터트렌드|다나와자동차|박병일자동차|자동차리뷰|드라이브|시승기|신차|전기차|EV|하이브리드|자전거|오토바이|바이크|모터|드론/i, 'tech'],
  [/IT|리뷰|언박싱|unbox|테크|tech|아이폰|iphone|갤럭시|galaxy|삼성|samsung|LG|애플|apple|맥북|macbook|컴퓨터|PC|노트북|가젯|gadget|코딩|개발|프로그래밍|AI|인공지능|ChatGPT|GPT/i, 'tech'],

  // ════════════════════════════════════════════════════════════
  // 🐱 ANIMAL / NATURE
  // ════════════════════════════════════════════════════════════
  // 동물 채널
  [/크림히어로즈|루루와 친구들|SBS TV동물농장|수리노을TV|냥이와 댕댕이|댕댕연구소|하루댕이|냥코|어메이징 동물|뚜TV|워뇽이|빙봉TV|댕냥이|고양씨|댕댕이|냥이|캣타워/i, 'animal'],
  [/동물|강아지|고양이|냥이|댕댕|멍멍|판다|코끼리|호랑이|사자|곰|반려|pet|animal|wild|야생|자연농장|동물원|수족관|puppy|kitten|dog|cat|앵무새|햄스터|토끼|고슴도치|페럿|거북이/i, 'animal'],
];

// Title/channel keyword buckets (individual scoring).
const KEYWORDS = {
  game: [
    '게임','플레이','공략','롤','lol','배그','battleground','fps','rpg','mmo','gta',
    '마인크래프트','minecraft','fortnite','포트나이트','valorant','발로란트','overwatch',
    '오버워치','steam','스팀','nintendo','닌텐도','xbox','엑박','playstation','플스',
    '원신','genshin','로블록스','roblox','모바일게임','던파','메이플','리그오브레전드',
    'lck','lcs','esports','e-스포츠','이스포츠','스트리머','twitch','트위치','치지직',
    'gameplay','lets play','retro','고전게임','gaming','gamer','도타','dota','카트라이더',
    '서든어택','피파','fifa','nba2k','파이널판타지','젤다','zelda','엘든링','elden',
    '발키리','디아블로','스타크래프트','스타','롤드컵','worlds','msi','msq',
  ],
  animal: [
    '강아지','고양이','냥이','댕댕','멍멍','고양','동물','반려','펫','pet','puppy','kitten',
    'dog','cat','animal','자연','nature','wildlife','야생','새','bird','물고기','fish',
    '수달','판다','panda','햄스터','토끼','앵무새','사자','호랑이','곰','코끼리','기린',
    '하마','코뿔소','악어','뱀','블랙맘바','독사','맹수','야수','정글','동물원','수족관',
    '돌고래','고래','상어','얼룩말','치타','재규어','늑대','여우','너구리','오소리',
    '고라니','사슴','거북이','거북','도마뱀','이구아나','앵무','펭귄','나무늘보','원숭이',
    '침팬지','고릴라','다람쥐','고슴도치','페럿','구피','금붕어','잉어','베타',
  ],
  food: [
    '먹방','mukbang','요리','맛집','음식','food','cooking','recipe','레시피','쿡방','asmr',
    'chef','셰프','디저트','dessert','베이킹','baking','라면','치킨','피자','초밥','스시',
    '햄버거','햄버','eat','eating','맛있','매운맛','김치','떡볶이','족발','보쌈','삼겹살',
    '고기','스테이크','steak','카페','브런치','편의점','편의점음식','분식','짜장','짬뽕',
    '중식','일식','양식','한식','분식','일본여행.*먹','홈쿡','집밥','간식','디저트','빵',
    '브레드','케이크','파스타','비빔밥','국밥','냉면','우동','라멘','ramen','sushi','stew',
    '요리왕비룡','백종원','이연복','승우아빠','해먹남녀',
  ],
  comedy: [
    '예능','유머','웃긴','웃음','개그','코미디','comedy','funny','humor','재밌','재미있',
    '반전','몰카','ㅋㅋ','ㅎㅎ','짤','밈','meme','피식','웃참','폭소','빵터짐','뿜',
    '개그맨','코미디언','개코','유튜버','스탠드업','standup','농담','장난','도전','챌린지',
    'challenge','리액션','reaction','반응','모르핀','호불호','몰래','브이라이브','장기자랑',
    '무한도전','1박2일','신서유기','런닝맨','나혼자산다','놀면뭐하니','라디오스타',
    '라스','로또','유재석','박명수','정준하','하하','강호동','이경규','신동엽','김구라',
    '탁재훈','이수근','전현무','조세호','홍진경','침착맨','피식대학','숏박스','빵송국',
    'B급','병맛','병맛더빙','자막','더빙','dub',
  ],
  drama: [
    '드라마','영화','시네마','무비','film','movie','cinema','넷플릭스','netflix','디즈니',
    'disney','disney+','디즈니플러스','웨이브','왓챠','티빙','시즌','season','편집',
    '예고편','trailer','예고','ost','결말','결말포함','엔딩','시놉시스','리뷰','review',
    '해석','해리포터','마블','marvel','dc','어벤저스','avengers','스타워즈','star wars',
    '반지의제왕','lord of the rings','매트릭스','matrix','배트맨','batman','스파이더맨',
    'spider-man','spiderman','아이언맨','ironman','캡틴아메리카','토르','헐크','hulk',
    '미스터션샤인','도깨비','사랑의불시착','이태원클라쓰','빈센조','오징어게임','squid game',
    '더글로리','낭만닥터','펜트하우스','펜하','응답하라','슬기로운','피끓는','k-drama',
    '연기','명장면','감독','director','배우','actor','출연',
  ],
  news: [
    '뉴스','news','속보','보도','정치','사회','경제','politics','economy','economics',
    '시사','breaking','국제','사건','이슈','YTN','KBS','SBS','MBC','JTBC','TV조선','채널A',
    'MBN','연합뉴스','뉴스1','한겨레','조선일보','중앙일보','동아일보','한국경제','매일경제',
    'SBS 8뉴스','KBS 9시','뉴스룸','탐사보도','시사매거진','뉴스데스크','국회','대통령',
    '총선','대선','정당','여당','야당','대통령실','청와대','국방부','경찰','검찰',
  ],
  sports: [
    '축구','야구','농구','배구','골프','테니스','복싱','격투','soccer','football','baseball',
    'basketball','volleyball','golf','tennis','boxing','ufc','mma','스포츠','sports','KBO',
    'NBA','MLB','NFL','NHL','EPL','라리가','laliga','분데스리가','bundesliga','세리에',
    'seriea','챔피언스리그','champions league','월드컵','worldcup','올림픽','olympic',
    '손흥민','이강인','김민재','박지성','류현진','김하성','오타니','메시','호날두','messi',
    'ronaldo','음바페','mbappe','홈런','골','득점','패스','어시스트','pk','페널티',
    '하이라이트','highlight','요약','예선','결승','4강','경기','트레이닝','training',
    'KBL','KOVO','V리그','K리그','프로야구','빅뱃','SPOTV','MBC스포츠플러스',
  ],
  music: [
    '뮤직','music','노래','song','커버','cover','live','라이브','콘서트','concert','공연',
    '아이돌','idol','kpop','k-pop','K-POP','mv','뮤비','아티스트','artist','프로듀서',
    'producer','bts','방탄','blackpink','블랙핑크','뉴진스','newjeans','아이브','ive',
    '에스파','aespa','세븐틴','seventeen','트와이스','twice','레드벨벳','red velvet',
    '엑소','exo','샤이니','shinee','빅뱅','bigbang','소녀시대','girls generation','EXID',
    '장원영','안유진','리사','제니','로제','지수','정국','지민','뷔','정국','슈가','RM',
    '피아노','piano','기타','guitar','베이스','bass','드럼','drum','dj','edm','랩','rap',
    'hip-hop','hiphop','힙합','rnb','록','rock','메탈','metal','재즈','jazz','발라드',
    'ballad','ost','뮤지컬','musical','오케스트라','orchestra','클래식','classic',
    'HYBE','SM','JYP','YG','STARSHIP','FNC','Cube','1theK','엠넷','MNET','melon','멜론',
    '지니뮤직','bugs','vibe',
  ],
  education: [
    '강의','lecture','공부','study','교육','education','tutorial','튜토리얼','과학',
    'science','수학','math','algebra','geometry','역사','history','영어','english',
    '언어','language','TED','TEDx','TED-Ed','다큐','documentary','정보','팁','tips',
    'how to','방법','지식','knowledge','해설','explained','EBS','학습','자기계발',
    '셜록현준','북툰','지식해적단','지식한방','지식채널e','궤도','안될과학','과학드림',
    '1분과학','세상의모든과학','리뷰엉이','카이스트','서울대','연세대','고려대','대학',
    '토익','toeic','토플','toefl','오픽','opic','ielts','영문법','grammar','단어','암기',
    '기출','수능','공부법','필기','노트','인강','인터넷강의','공인중개사','공무원',
    '자격증','증권','투자','주식','stock','finance','경제학','철학','philosophy',
  ],
  lifestyle: [
    '브이로그','vlog','일상','daily','데일리','라이프','lifestyle','morning','아침',
    '하루','루틴','routine','모닝루틴','나이트루틴','뷰티','beauty','메이크업','makeup',
    '스킨케어','skincare','화장','lip','립','아이섀도','eyeshadow','마스카라','mascara',
    '파운데이션','foundation','쿠션','쿠션팩트','네일','nail','헤어','hair','머리','염색',
    '패션','fashion','ootd','코디','출근룩','데이트룩','쇼핑','shopping','하울','haul',
    '옷','셔츠','원피스','니트','자켓','청바지','스니커즈','sneakers','나이키','nike',
    '아디다스','adidas','스타벅스','starbucks','카페','cafe','인테리어','interior',
    '집꾸','홈스타일링','미니멀','minimal','살림','livingkit','정리','organize','청소',
    '요가','yoga','필라테스','pilates','다이어트','diet','운동','workout','홈트','gym',
    '헬스','헬스장','fitness','홈카페','인스타','instagram',
  ],
  tech: [
    'IT','IT리뷰','리뷰','review','언박싱','unbox','unboxing','테크','tech','technology',
    '가젯','gadget','아이폰','iphone','갤럭시','galaxy','삼성','samsung','LG','애플','apple',
    '맥북','macbook','아이패드','ipad','갤탭','galaxy tab','에어팟','airpods','버즈','buds',
    '노이즈캔슬링','noise cancelling','이어폰','earphone','헤드폰','headphone','스피커',
    'speaker','컴퓨터','PC','노트북','laptop','데스크탑','desktop','키보드','keyboard',
    '마우스','mouse','모니터','monitor','그래픽카드','gpu','cpu','ssd','ram','메모리',
    '프로세서','processor','intel','amd','nvidia','rtx','ryzen','스마트홈','smart home',
    '홈네트워크','공유기','router','프로그래밍','programming','코딩','coding','개발자',
    'developer','github','vs code','리눅스','linux','ubuntu','android','ios','앱','app',
    'ai','인공지능','chatgpt','gpt','llm','claude','클로드','anthropic','openai','deepmind',
    '자동차','car','벤츠','benz','bmw','아우디','audi','포르쉐','porsche','현대','기아',
    '테슬라','tesla','전기차','ev','하이브리드','suv','세단','sedan','오토바이','바이크',
    '모터','motorcycle','드론','drone','로봇','robot','가상현실','vr','ar','mr',
  ],
};

function scoreText(text, keywords) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) score += 1;
  }
  return score;
}

function matchChannelDict(channel) {
  if (!channel) return null;
  for (const [re, cat] of CHANNEL_DICT) {
    if (re.test(channel)) return cat;
  }
  return null;
}

/**
 * Classify one entry. Channel name weighs more than title.
 * Returns a category id or 'etc'.
 */
export function classifyLocally(channel, title = '') {
  // 1. Famous-channel substring match (highest confidence)
  const ch = matchChannelDict(channel);
  if (ch) return ch;

  // 2. Keyword scoring: channel x3 weight, title x1 weight
  const channelText = channel || '';
  const titleText = title || '';
  let bestId = null;
  let bestScore = 0;
  for (const [id, keywords] of Object.entries(KEYWORDS)) {
    const s = scoreText(channelText, keywords) * 3 + scoreText(titleText, keywords);
    if (s > bestScore) {
      bestScore = s;
      bestId = id;
    }
  }
  return bestScore > 0 ? bestId : 'etc';
}

export function aggregateCategories(shorts, channelCategoryMap = null) {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
  for (const s of shorts) {
    let cat;
    if (channelCategoryMap && channelCategoryMap[s.channel]) {
      cat = channelCategoryMap[s.channel];
    } else {
      cat = classifyLocally(s.channel, s.title);
    }
    if (!(cat in counts)) cat = 'etc';
    counts[cat] += 1;
  }
  const total = shorts.length || 1;
  return CATEGORIES.map((c) => ({
    ...c,
    count: counts[c.id],
    ratio: counts[c.id] / total,
  }));
}
