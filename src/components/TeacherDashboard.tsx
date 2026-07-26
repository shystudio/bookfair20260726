import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BookLog, ReadingKingRank, AppSettings } from '../types';
import { exportToCSV } from '../utils/storage';
import {
  Lock,
  Unlock,
  KeyRound,
  LayoutDashboard,
  Trophy,
  Award,
  BookOpen,
  Users,
  Star,
  Download,
  Trash2,
  Edit,
  Search,
  Filter,
  Sparkles,
  Check,
  X,
  Crown,
  Printer,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface TeacherDashboardProps {
  logs: BookLog[];
  isUnlocked: boolean;
  onUnlock: (password: string) => boolean;
  onLock: () => void;
  onDeleteLog: (id: string) => void;
  onSelectLog: (log: BookLog) => void;
  onOpenReadingKingModal: (topStudents: ReadingKingRank[]) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  logs,
  isUnlocked,
  onUnlock,
  onLock,
  onDeleteLog,
  onSelectLog,
  onOpenReadingKingModal,
  settings,
  onUpdateSettings,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  
  // Password Change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(inputPassword);
    if (!success) {
      setAuthError('비밀번호가 올바르지 않습니다. (기본값: 1234)');
    } else {
      setAuthError('');
      setInputPassword('');
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.trim().length < 4) {
      setPasswordChangeSuccess('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    onUpdateSettings({ teacherPassword: newPassword.trim() });
    setPasswordChangeSuccess('비밀번호가 성공적으로 변경되었습니다!');
    setNewPassword('');
    setTimeout(() => {
      setShowPasswordChange(false);
      setPasswordChangeSuccess('');
    }, 2000);
  };

  // 1. Calculate Top 3 Reading Kings for current month
  const topStudentsOfMonth: ReadingKingRank[] = useMemo(() => {
    const studentMap = new Map<string, {
      studentName: string;
      grade: string;
      classNum: string;
      count: number;
      recentBook: string;
    }>();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    logs.forEach((log) => {
      const logDate = new Date(log.createdAt);
      // Filter logs written in the current month (or all logs fallback if few)
      const key = `${log.grade}_${log.classNum}_${log.studentName}`;
      
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          studentName: log.studentName,
          grade: log.grade,
          classNum: log.classNum,
          count: 0,
          recentBook: log.bookTitle,
        });
      }
      
      const record = studentMap.get(key)!;
      record.count += 1;
      record.recentBook = log.bookTitle;
    });

    const sorted = Array.from(studentMap.values()).sort((a, b) => b.count - a.count);

    const titles = ['골드 다독왕', '실버 지혜왕', '브론즈 열정왕'];

    return sorted.slice(0, 3).map((item, idx) => ({
      rank: (idx + 1) as 1 | 2 | 3,
      studentName: item.studentName,
      grade: item.grade,
      classNum: item.classNum,
      count: item.count,
      recentBook: item.recentBook,
      badgeTitle: titles[idx] || '독서의 달인'
    }));
  }, [logs]);

  // 2. Calculate Stats
  const totalLogsCount = logs.length;

  const classDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((l) => {
      const key = `${l.grade} ${l.classNum}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [logs]);

  const topClass = classDistribution[0] ? classDistribution[0][0] : '미등록';

  const mostReadBook = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((l) => {
      counts[l.bookTitle] = (counts[l.bookTitle] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : '미등록';
  }, [logs]);

  const averageRating = useMemo(() => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / logs.length).toFixed(1);
  }, [logs]);

  // Filtered Logs list for teacher table
  const filteredTeacherLogs = useMemo(() => {
    return logs.filter((log) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        log.bookTitle.toLowerCase().includes(term) ||
        log.studentName.toLowerCase().includes(term) ||
        log.author.toLowerCase().includes(term);

      const matchesClass = filterClass === 'all' || `${log.grade} ${log.classNum}` === filterClass;

      return matchesSearch && matchesClass;
    });
  }, [logs, searchTerm, filterClass]);

  // Locked Screen Guard
  if (!isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto my-12"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-sky-400" />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">
              교사 전용 비밀번호 인증
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              학생 기록 관리 및 대시보드 접근을 위해 교사 비밀번호를 입력해 주세요. (초기 비밀번호: <span className="text-indigo-300 font-bold">1234</span>)
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="비밀번호 입력 (예: 1234)"
                className="w-full text-center px-4 py-3.5 text-lg font-mono rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest min-h-[44px]"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center min-h-[44px]"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              인증하고 대시보드 열기
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Teacher Top Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>교사 전용 대시보드 센터</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            학급 독서 통계 및 학생 관리 📊
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            우리 반 학생들의 독서 현황을 분석하고 따뜻한 피드백과 독서왕 표창을 전달하세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportToCSV(logs)}
            className="px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-900 text-xs sm:text-sm font-semibold flex items-center transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4 mr-2" /> 엑셀(CSV) 다운로드
          </button>

          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold flex items-center transition-colors min-h-[44px]"
          >
            <KeyRound className="w-4 h-4 mr-2 text-indigo-400" /> 비밀번호 변경
          </button>

          <button
            onClick={onLock}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 text-xs sm:text-sm font-semibold flex items-center transition-colors min-h-[44px]"
          >
            <Lock className="w-4 h-4 mr-1.5" /> 잠그기
          </button>
        </div>
      </div>

      {/* Change Password Inline Form */}
      {showPasswordChange && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-indigo-950/40 border border-indigo-500/40 rounded-2xl p-5 shadow-lg max-w-lg"
        >
          <h3 className="text-sm font-bold text-white mb-2 flex items-center">
            <KeyRound className="w-4 h-4 mr-1.5 text-indigo-400" /> 교사 비밀번호 변경
          </h3>
          <form onSubmit={handlePasswordChangeSubmit} className="flex gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새로운 비밀번호 입력 (4자리 이상)"
              className="flex-1 px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              저장
            </button>
          </form>
          {passwordChangeSuccess && (
            <p className="text-xs text-indigo-300 mt-2">{passwordChangeSuccess}</p>
          )}
        </motion.div>
      )}

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">총 누적 독서록</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">{totalLogsCount} <span className="text-sm font-normal text-slate-400">건</span></p>
          <p className="text-xs text-indigo-400 mt-2 font-medium">실시간 학생 기록 모음</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">최다 독서 학급</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white tracking-tight">{topClass}</p>
          <p className="text-xs text-emerald-400 mt-2 font-medium">가장 많은 독서록 제출 학급</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">최다 읽은 도서</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-white tracking-tight truncate">{mostReadBook}</p>
          <p className="text-xs text-amber-400 mt-2 font-medium">학급 인기 베스트 도서</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">평균 만족도 별점</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-sky-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">{averageRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span></p>
          <p className="text-xs text-sky-400 mt-2 font-medium">높은 만족도의 독서 경험</p>
        </div>
      </div>

      {/* READING KING EVENT SECTION */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>이달의 독서왕 이벤트 세션</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              👑 이달의 독서왕 TOP 3 명예의 전당
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              가장 많은 독서록을 작성한 다독 학생 TOP 3를 자동으로 계산하여 시상합니다.
            </p>
          </div>

          <button
            onClick={() => onOpenReadingKingModal(topStudentsOfMonth)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center transition-all min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 mr-2 text-slate-950" />
            독서왕 발표 & 상장 출력하기 🏆
          </button>
        </div>

        {/* Top 3 Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topStudentsOfMonth.map((king) => (
            <div
              key={king.studentName + king.rank}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${
                  king.rank === 1 ? 'bg-amber-400 text-slate-950' : king.rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-amber-100'
                }`}>
                  {king.rank === 1 ? '🥇' : king.rank === 2 ? '🥈' : '🥉'}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-400 block">{king.badgeTitle}</span>
                  <h4 className="text-base font-bold text-white">
                    {king.studentName} <span className="text-xs text-slate-400 font-normal">({king.grade} {king.classNum})</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    "{king.recentBook}"
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-extrabold text-xs">
                {king.count}권
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Class Reading Distribution Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-indigo-400" />
          학급별 독서 건수 비교
        </h3>

        <div className="space-y-3 pt-2">
          {classDistribution.map(([cls, count]) => {
            const percentage = totalLogsCount > 0 ? Math.round((count / totalLogsCount) * 100) : 0;
            return (
              <div key={cls} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>{cls}</span>
                  <span>{count}건 ({percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Record Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">학생 독서록 전체 관리 목록</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              개별 독서록 피드백 입력 및 데이터 삭제 관리를 수행합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="학생이름, 도서명..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">전체 학급</option>
              {classDistribution.map(([cls]) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">작성 학생</th>
                <th className="p-3">도서명 / 지은이</th>
                <th className="p-3">분야/별점</th>
                <th className="p-3">선생님 칭찬 피드백</th>
                <th className="p-3 text-right">작성일자</th>
                <th className="p-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTeacherLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-bold text-white whitespace-nowrap">
                    {log.grade} {log.classNum} <br />
                    <span className="text-indigo-300 text-sm">{log.studentName}</span>
                  </td>

                  <td className="p-3 max-w-xs">
                    <p className="font-bold text-white line-clamp-1">{log.bookTitle}</p>
                    <p className="text-slate-400 text-[11px] truncate">{log.author} · {log.publisher}</p>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 block w-fit mb-1">
                      {log.category}
                    </span>
                    <span className="text-amber-400 font-bold">★ {log.rating}.0</span>
                  </td>

                  <td className="p-3 max-w-xs">
                    {log.teacherComment ? (
                      <span className="text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20 block truncate">
                        "{log.teacherComment}"
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">미작성</span>
                    )}
                  </td>

                  <td className="p-3 text-right whitespace-nowrap text-slate-400">
                    {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                  </td>

                  <td className="p-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onSelectLog(log)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center"
                        title="상세보기 및 칭찬 남기기"
                      >
                        <Edit className="w-3 h-3 mr-1" /> 피드백
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`'${log.studentName}' 학생의 독서록 '${log.bookTitle}'을(를) 정말 삭제하시겠습니까?`)) {
                            onDeleteLog(log.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
