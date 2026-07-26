import { BookLog, AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  googleAppsScriptUrl: '',
  teacherPassword: '1234',
  defaultGrade: '5학년',
  defaultClassNum: '2반',
  schoolName: '꿈나무 초등학교',
};

export const INITIAL_MOCK_LOGS: BookLog[] = [
  {
    id: 'log-1',
    grade: '5학년',
    classNum: '2반',
    studentName: '김민준',
    bookTitle: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    publisher: '열린책들',
    summary: '비행기 조종사가 사막에 불시착하여 만난 어린 왕자와의 대화를 그린 이야기입니다. 어린 왕자는 여러 행성을 여행하며 만난 장미, 여우, 어른들과의 만남을 통해 길들여진다는 것과 마음으로 보는 진실의 의미를 깨달아갑니다.',
    reflection: '여우가 한 말 중 "가장 중요한 것은 눈에 보이지 않아"라는 대사가 가장 기억에 남습니다. 겉모습보다 마음의 소중함을 알게 되었고, 제 주변 친구들과의 우정도 소중히 여겨야겠다고 생각했어요.',
    rating: 5,
    category: '문학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    teacherComment: '어린 왕자의 깊은 메시지를 마음으로 잘 이해하고 정리했군요! 우정에 대한 소중한 깨달음 아주 훌륭해요. 🌟',
    teacherStamp: 'thinker',
  },
  {
    id: 'log-2',
    grade: '5학년',
    classNum: '2반',
    studentName: '이서연',
    bookTitle: '마당을 나온 암탉',
    author: '황선미',
    publisher: '사계절',
    summary: '양계장에 갇혀 알만 낳던 암탉 잎싹이가 자유를 찾아 마당을 나와 야생에서 청둥오리 아기 초록이를 키우며 모성애와 자유의 가치를 실천하는 이야기입니다.',
    reflection: '잎싹이가 위험을 무릅쓰고 아기 오리를 정성껏 돌보는 모습에서 어머니의 사랑을 느꼈습니다. 스스로 삶을 개척해 나가는 용기가 멋졌습니다.',
    rating: 5,
    category: '문학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    teacherComment: '용기와 모성애에 대해 진심 어린 마음으로 글을 적어주었어요. 서연이의 따뜻한 감성이 돋보입니다! 💕',
    teacherStamp: 'heart',
  },
  {
    id: 'log-3',
    grade: '5학년',
    classNum: '2반',
    studentName: '김민준',
    bookTitle: '아몬드',
    author: '손원평',
    publisher: '창비',
    summary: '감정을 느끼지 못하는 편도체(아몬드)를 가진 윤재가 세상을 향해 걸어가며 불운한 사고와 새로운 친구 곤이를 만나 감정과 공감의 의미를 배워가는 이야기입니다.',
    reflection: '타인의 아픔에 공감하는 것이 얼마나 소중한지 생각해보게 되었습니다. 나와 다른 사람을 편견 없이 바라보는 마음을 가지겠습니다.',
    rating: 5,
    category: '문학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    teacherComment: '공감과 이해에 대한 깊은 성찰이 돋보이는 훌륭한 독서록입니다! 👏',
    teacherStamp: 'super',
  },
  {
    id: 'log-4',
    grade: '5학년',
    classNum: '2반',
    studentName: '박도현',
    bookTitle: '파브르 곤충기',
    author: '장 앙리 파브르',
    publisher: '웅진주니어',
    summary: '왕소똥구리, 사마귀, 개미 등 다양한 곤충들의 생태와 행동을 오랜 기간 직접 관찰하고 기록한 자연 과학 이야기입니다.',
    reflection: '작은 곤충 하나도 자연 속에서 살아가는 지혜와 질서를 가지고 있다는 점이 신기했습니다. 학교 운동장에 있는 곤충들도 좀 더 자세히 관찰해보고 싶습니다.',
    rating: 4,
    category: '과학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    teacherComment: '자연을 향한 호기심과 관찰력이 아주 훌륭합니다. 도현이의 탐구 정신을 응원해요! 🔍',
    teacherStamp: 'growth',
  },
  {
    id: 'log-5',
    grade: '5학년',
    classNum: '2반',
    studentName: '이서연',
    bookTitle: '자전거 도둑',
    author: '박완서',
    publisher: '다림',
    summary: '청계천 상회에서 일하는 시골 출신 수남이가 양심의 가책과 물질적 유혹 사이에서 갈등하며 진정한 양심의 가치를 깨닫는 이야기입니다.',
    reflection: '어려운 상황에서도 양심을 지키는 것이 얼마나 힘들지만 가치 있는 일인지 깨달았습니다. 당당하고 정직하게 행동하겠습니다.',
    rating: 5,
    category: '문학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    teacherComment: '양심의 가치에 대한 또렷한 생각이 느껴집니다. 참 잘했어요! ✨',
    teacherStamp: 'thinker',
  },
  {
    id: 'log-6',
    grade: '5학년',
    classNum: '1반',
    studentName: '최유진',
    bookTitle: '세종대왕: 글을 창제한 성군',
    author: '설민석',
    publisher: '단꿈아이',
    summary: '백성을 진심으로 사랑하여 누구나 쉽게 배우고 자신의 생각을 펼칠 수 있도록 훈민정음을 창제하신 세종대왕의 애민 정신과 애환을 살펴본 역사책입니다.',
    reflection: '우리가 날마다 사용하는 한글이 세종대왕님의 깊은 백성 사랑에서 비롯되었다는 사실에 감사함을 느꼈습니다. 올바른 우리말을 사용해야겠습니다.',
    rating: 5,
    category: '역사',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: 'log-7',
    grade: '5학년',
    classNum: '2반',
    studentName: '김민준',
    bookTitle: '해리 포터와 마법사의 돌',
    author: 'J.K. 롤링',
    publisher: '문학수첩',
    summary: '자신이 마법사임을 알게 된 해리 포터가 호그와트 마법학교에 입학하여 친구 론, 헤르미온느와 함께 마법 세계의 비밀과 마법사의 돌을 지켜내는 판타지 소설입니다.',
    reflection: '용기와 친구들과의 협동심이 어떤 악도 물리칠 수 있다는 믿음을 배웠습니다. 흥미진진해서 손에서 책을 놓을 수 없었습니다!',
    rating: 5,
    category: '문학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'log-8',
    grade: '5학년',
    classNum: '2반',
    studentName: '박도현',
    bookTitle: '지구의 숨 쉬는 비밀, 환경 이야기',
    author: '김남길',
    publisher: '시공주니어',
    summary: '지구 온난화와 미세플라스틱 문제 등 지구가 처한 환경 위기를 살펴보고 생활 속에서 실천할 수 있는 탄소 중립 생활법을 소개한 책입니다.',
    reflection: '분리수거와 텀블러 사용 같은 작은 실천이 지구를 살리는 큰 시작이 될 수 있음을 알았습니다. 당장 오늘부터 1회용품 사용을 줄이겠습니다.',
    rating: 4,
    category: '과학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'log-9',
    grade: '5학년',
    classNum: '3반',
    studentName: '정예원',
    bookTitle: '모모',
    author: '미하엘 엔데',
    publisher: '비룡소',
    summary: '시간 도둑들에게 사람들의 소중한 시간을 빼앗긴 세상을 위해 경청의 귀를 가진 모모와 거북 카시오페아가 시간을 되찾아주는 상상력 넘치는 이야기입니다.',
    reflection: '바쁜 일상 속에서 진정으로 사람들과 소통하고 시간을 소중히 여기는 법을 익혔습니다. 잘 들어주는 친구가 되고 싶습니다.',
    rating: 5,
    category: '문학',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
  {
    id: 'log-10',
    grade: '5학년',
    classNum: '2반',
    studentName: '이서연',
    bookTitle: '미술관에 간 화학자',
    author: '전창림',
    publisher: '랜덤하우스코리아',
    summary: '명화 속에 숨겨진 물감의 화학적 성분과 보존 기술, 미술 작품 뒤의 과학적 원리를 쉽고 재미있게 들려주는 융합 과학 도서입니다.',
    reflection: '미술과 과학이 이렇게 긴밀하게 연결되어 있는지 몰랐습니다. 색채 뒤에 감춰진 과학적 비밀을 통해 새로운 시각을 넓혔습니다.',
    rating: 5,
    category: '예술',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * [우리반 전자 독서기록장] Google Apps Script (Code.gs)
 * 
 * 사용 방법:
 * 1. 구글 드라이브에서 새로운 '구글 스프레드시트'를 만듭니다.
 * 2. 상단 메뉴 [확장 프로그램] -> [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 삭제하고 아래 코드를 복사하여 붙여넣습니다.
 * 4. 우측 상단 [배포] -> [새 배포] 클릭
 * 5. 유형 선택: [웹 앱]
 *    - 설명: 전자 독서기록장 연동
 *    - 다음 사용자 권한으로 실행: [나 (내 계정)]
 *    - 액세스 권한이 있는 사용자: [모든 사용자 (Anyone)] -> 매우 중요!
 * 6. [배포] 버튼을 누르고 '웹 앱 URL'을 복사하여 독서기록장 설정 메뉴에 등록하세요.
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "우리반 전자 독서기록장 API 서비스가 정상 작동 중입니다."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 헤더 열이 비어있으면 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "작성일시",
        "학년",
        "반",
        "이름",
        "도서명",
        "지은이",
        "출판사",
        "줄거리",
        "소감",
        "별점",
        "분야"
      ]);
      
      // 헤더 서식 스타일 적용 (인디고 톤 & 볼드)
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setBackground("#312E81");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setRowHeight(1, 35);
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("전송된 데이터가 없습니다.");
    }

    // 시트 새 행 추가
    var rowData = [
      data.createdAt || new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      data.grade || "",
      data.classNum || "",
      data.studentName || "",
      data.bookTitle || "",
      data.author || "",
      data.publisher || "",
      data.summary || "",
      data.reflection || "",
      data.rating || 5,
      data.category || "문학"
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "독서기록이 구글 시트에 성공적으로 저장되었습니다."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export const BOOK_CATEGORIES = [
  '문학',
  '과학',
  '역사',
  '인문',
  '예술',
  '사회/교양',
  '수학',
  '기타'
];

export interface ReadingQuote {
  id: string;
  quote: string;
  author: string;
  bookOrRole: string;
  tag: string;
  bgGradient: string;
}

export const FAMOUS_READING_QUOTES: ReadingQuote[] = [
  {
    id: 'q1',
    quote: "책 없는 방은 영혼 없는 몸과 같다.",
    author: "마르쿠스 시세로",
    bookOrRole: "고대 로마의 철학자",
    tag: "지혜와 영혼",
    bgGradient: "from-indigo-900 via-slate-900 to-purple-950"
  },
  {
    id: 'q2',
    quote: "오늘의 나를 있게 한 것은 동네 도서관이었다. 하버드 졸업장보다 소중한 것은 독서하는 습관이다.",
    author: "빌 게이츠",
    bookOrRole: "마이크로소프트 창업자",
    tag: "꿈과 습관",
    bgGradient: "from-blue-900 via-slate-900 to-indigo-950"
  },
  {
    id: 'q3',
    quote: "좋은 책을 읽는 것은 지난 몇 세기의 가장 훌륭한 사람들과 대화를 나누는 것과 같다.",
    author: "르네 데카르트",
    bookOrRole: "근대 철학의 아버지",
    tag: "시공간 대화",
    bgGradient: "from-emerald-950 via-slate-900 to-teal-950"
  },
  {
    id: 'q4',
    quote: "한 권의 좋은 책을 읽음으로써 자신의 삶에서 새 시대를 연 사람들이 있다.",
    author: "헨리 데이비드 소로",
    bookOrRole: "《월든》 저자",
    tag: "새로운 시작",
    bgGradient: "from-amber-950 via-slate-900 to-amber-900"
  },
  {
    id: 'q5',
    quote: "독서는 마음을 위한 운동이다. 육체에 운동이 필요한 것처럼, 정신에는 독서가 필요하다.",
    author: "조셉 애디슨",
    bookOrRole: "영국의 문학가",
    tag: "정신과의 대화",
    bgGradient: "from-purple-950 via-slate-900 to-indigo-900"
  },
  {
    id: 'q6',
    quote: "당신이 읽는 책이 곧 당신이 누구인지를 말해준다.",
    author: "랄프 월도 에머슨",
    bookOrRole: "미국의 시인·사상가",
    tag: "자아 발견",
    bgGradient: "from-rose-950 via-slate-900 to-indigo-950"
  }
];

export const SEL_ENCOURAGEMENT_QUOTES = [
  "생각의 깊이가 한 계단 더 올라섰어요! 🍃",
  "책 속에서 나만의 소중한 보물을 찾았군요! 💎",
  "지혜의 나무에 싱그러운 새 잎이 돋아났습니다! 🌱",
  "스스로 생각하고 경험을 넓혀가는 모습이 멋져요! 🌟",
  "오늘도 책과 함께 마음이 한 한 뼘 더 커졌어요! ❤️"
];
