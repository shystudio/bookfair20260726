export interface BookLog {
  id: string;
  grade: string;        // e.g. "5학년"
  classNum: string;     // e.g. "2반"
  studentName: string;  // e.g. "김민준"
  bookTitle: string;    // e.g. "어린 왕자"
  author: string;       // e.g. "앙투안 드 생텍쥐페리"
  publisher: string;    // e.g. "열린책들"
  summary: string;      // 줄거리
  reflection: string;   // 소감 및 느낀 점
  rating: number;       // 별점 (1~5)
  category: string;     // 분야 (e.g. "문학", "과학", "역사", "인문", "예술", "기타")
  createdAt: string;    // ISO Date String YYYY-MM-DD HH:mm:ss
  teacherComment?: string; // 교사 한줄 칭찬
  teacherStamp?: 'super' | 'thinker' | 'growth' | 'heart' | null; // 교사 칭찬 도장
}

export interface AppSettings {
  googleAppsScriptUrl: string;
  teacherPassword: string;
  defaultGrade: string;
  defaultClassNum: string;
  schoolName: string;
}

export type TabType = 'bestseller' | 'form' | 'logs' | 'dashboard' | 'gas';

export interface BestsellerBook {
  rank: number;
  title: string;
  author: string;
  publisher: string;
  description: string;
  category: string;
}

export interface FilterState {
  grade: string;
  classNum: string;
  studentName: string;
  bookTitle: string;
  category: string;
  sortBy: 'latest' | 'oldest' | 'rating' | 'student';
}

export interface ReadingKingRank {
  rank: 1 | 2 | 3;
  studentName: string;
  grade: string;
  classNum: string;
  count: number;
  recentBook: string;
  badgeTitle: string;
}
