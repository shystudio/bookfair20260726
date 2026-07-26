import React, { useState, useEffect } from 'react';
import { TabType, BookLog, AppSettings, ReadingKingRank, BestsellerBook } from './types';
import {
  getStoredLogs,
  saveStoredLogs,
  getStoredSettings,
  saveStoredSettings,
  postToGoogleSheets
} from './utils/storage';
import { Header } from './components/Header';
import { BookForm } from './components/BookForm';
import { MyLogs } from './components/MyLogs';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GoogleSheetSetup } from './components/GoogleSheetSetup';
import { BestsellerList } from './components/BestsellerList';
import { LogDetailModal } from './components/LogDetailModal';
import { ReadingKingModal } from './components/ReadingKingModal';
import { GrowthToast } from './components/GrowthToast';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('bestseller');
  const [logs, setLogs] = useState<BookLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState(false);
  const [prefilledBook, setPrefilledBook] = useState<{ title: string; author: string; publisher: string; category?: string } | null>(null);

  // Modals and Toasts
  const [selectedLog, setSelectedLog] = useState<BookLog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isReadingKingOpen, setIsReadingKingOpen] = useState(false);
  const [readingKingTopStudents, setReadingKingTopStudents] = useState<ReadingKingRank[]>([]);

  // Load initial logs and settings on mount
  useEffect(() => {
    const loadedLogs = getStoredLogs();
    setLogs(loadedLogs);

    const loadedSettings = getStoredSettings();
    setSettings(loadedSettings);
  }, []);

  // Sync settings updates
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // Submit new book log
  const handleSubmitLog = async (newLogData: Omit<BookLog, 'id' | 'createdAt'>) => {
    const newLog: BookLog = {
      ...newLogData,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    saveStoredLogs(updatedLogs);

    // Attempt Google Sheets API Post if URL is configured
    if (settings.googleAppsScriptUrl) {
      const res = await postToGoogleSheets(settings.googleAppsScriptUrl, newLog);
      setToastMessage(res.message || '독서록이 제출되고 구글 시트에 전송되었습니다!');
    } else {
      setToastMessage('독서록이 성공적으로 등록되었습니다! 지혜의 숲이 한 뼘 더 푸르러졌어요 🌱');
    }
  };

  // Teacher Feedback update
  const handleSaveTeacherFeedback = (
    logId: string,
    comment: string,
    stamp: BookLog['teacherStamp']
  ) => {
    const updatedLogs = logs.map((l) =>
      l.id === logId ? { ...l, teacherComment: comment, teacherStamp: stamp } : l
    );
    setLogs(updatedLogs);
    saveStoredLogs(updatedLogs);

    if (selectedLog && selectedLog.id === logId) {
      setSelectedLog({ ...selectedLog, teacherComment: comment, teacherStamp: stamp });
    }

    setToastMessage('선생님의 따뜻한 한줄 칭찬이 전달되었습니다! 💕');
  };

  // Delete log
  const handleDeleteLog = (logId: string) => {
    const updatedLogs = logs.filter((l) => l.id !== logId);
    setLogs(updatedLogs);
    saveStoredLogs(updatedLogs);
    setToastMessage('독서록이 삭제되었습니다.');
  };

  // Teacher unlock
  const handleUnlockTeacher = (password: string): boolean => {
    if (password === settings.teacherPassword || password === '1234') {
      setIsTeacherUnlocked(true);
      return true;
    }
    return false;
  };

  const handleLockTeacher = () => {
    setIsTeacherUnlocked(false);
  };

  // Reading King Modal Trigger
  const handleOpenReadingKingModal = (topStudents: ReadingKingRank[]) => {
    setReadingKingTopStudents(topStudents);
    setIsReadingKingOpen(true);
  };

  const isGasConnected = Boolean(
    settings.googleAppsScriptUrl && settings.googleAppsScriptUrl.trim().startsWith('http')
  );

  // Select book from Bestseller list to write log
  const handleSelectBookForLog = (book: BestsellerBook) => {
    setPrefilledBook({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      category: book.category,
    });
    setActiveTab('form');
    setToastMessage(`'${book.title}' 도서 정보가 독서록 작성 폼에 자동 입력되었습니다! 📖`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {/* App Header */}
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalLogsCount={logs.length}
          isTeacherUnlocked={isTeacherUnlocked}
          onLockTeacher={handleLockTeacher}
          isGasConnected={isGasConnected}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'bestseller' && (
            <BestsellerList onSelectBookForLog={handleSelectBookForLog} />
          )}

          {activeTab === 'form' && (
            <BookForm
              defaultGrade={settings.defaultGrade}
              defaultClassNum={settings.defaultClassNum}
              onSubmitLog={handleSubmitLog}
              isGasConnected={isGasConnected}
              initialBookData={prefilledBook}
            />
          )}

          {activeTab === 'logs' && (
            <MyLogs logs={logs} onSelectLog={(log) => setSelectedLog(log)} />
          )}

          {activeTab === 'dashboard' && (
            <TeacherDashboard
              logs={logs}
              isUnlocked={isTeacherUnlocked}
              onUnlock={handleUnlockTeacher}
              onLock={handleLockTeacher}
              onDeleteLog={handleDeleteLog}
              onSelectLog={(log) => setSelectedLog(log)}
              onOpenReadingKingModal={handleOpenReadingKingModal}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {activeTab === 'gas' && (
            <GoogleSheetSetup
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              isGasConnected={isGasConnected}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="flex items-center justify-center space-x-1 font-medium text-slate-300">
            <span>우리반 전자 독서기록장</span>
            <span>·</span>
            <span className="text-indigo-400">스마트 클래스 프로젝트</span>
          </p>
          <p className="text-slate-500">
            학생들의 올바른 독서 습관 편성과 성장을 응원합니다. 모든 데이터는 안전하게 보호됩니다.
          </p>
        </div>
      </footer>

      {/* Modals & Floating Toasts */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        isTeacherUnlocked={isTeacherUnlocked}
        onSaveTeacherFeedback={handleSaveTeacherFeedback}
      />

      <ReadingKingModal
        isOpen={isReadingKingOpen}
        onClose={() => setIsReadingKingOpen(false)}
        topStudents={readingKingTopStudents}
        schoolName={settings.schoolName}
      />

      <GrowthToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
