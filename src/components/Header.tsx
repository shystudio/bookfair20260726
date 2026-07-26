import React from 'react';
import { TabType } from '../types';
import {
  PenTool,
  BookOpen,
  LayoutDashboard,
  Link2,
  Lock,
  Unlock,
  Sparkles,
  Award
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalLogsCount: number;
  isTeacherUnlocked: boolean;
  onLockTeacher: () => void;
  isGasConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalLogsCount,
  isTeacherUnlocked,
  onLockTeacher,
  isGasConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-amber-200">
                  우리반 감성 인터넷 서점 & 독서기록장
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 mr-1" /> 스마트 클래스 서재
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                책향기가 솔솔 풍기는 지혜의 서재에서 함께 생각의 숲을 가꿔요 📚✨
              </p>
            </div>
          </div>

          {/* Quick Info Badges (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            <div className="flex items-center px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <span className="text-slate-400 mr-1.5">누적 독서록:</span>
              <span className="font-bold text-indigo-400 text-sm">{totalLogsCount}</span>
              <span className="text-slate-400 ml-0.5">건</span>
            </div>
            
            <div className={`flex items-center px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              isGasConnected 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isGasConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isGasConnected ? '구글 시트 실시간 연동 중' : '로컬 전용 저장 모드'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-3 pt-1 no-scrollbar border-t border-slate-800/80 mt-1">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'form'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PenTool className="w-4 h-4 mr-2" />
            독서 기록하기
            <span className="ml-1.5 px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">학생용</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            나의 독서록
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-950 border border-indigo-400/40 text-indigo-300 font-bold">
              {totalLogsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-2 text-indigo-300" />
            교사 대시보드 & 통계
            {isTeacherUnlocked ? (
              <span className="ml-2 flex items-center px-2 py-0.5 text-[11px] rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                <Unlock className="w-3 h-3 mr-1" /> 인증됨
              </span>
            ) : (
              <span className="ml-2 flex items-center px-2 py-0.5 text-[11px] rounded-full bg-slate-800 text-slate-400">
                <Lock className="w-3 h-3 mr-1" /> 잠김
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gas')}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap min-h-[44px] ${
              activeTab === 'gas'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Link2 className="w-4 h-4 mr-2" />
            구글 시트 연동 설정
          </button>

          {isTeacherUnlocked && (
            <button
              onClick={onLockTeacher}
              title="교사 모드 잠그기"
              className="ml-auto flex items-center px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 min-h-[44px]"
            >
              <Lock className="w-3.5 h-3.5 mr-1" /> 대시보드 잠그기
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
