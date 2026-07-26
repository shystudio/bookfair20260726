import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookLog } from '../types';
import {
  X,
  BookOpen,
  Calendar,
  User,
  Star,
  Quote,
  Heart,
  Award,
  MessageSquare,
  Printer,
  Sparkles,
  Check
} from 'lucide-react';

interface LogDetailModalProps {
  log: BookLog | null;
  onClose: () => void;
  isTeacherUnlocked?: boolean;
  onSaveTeacherFeedback?: (logId: string, comment: string, stamp: BookLog['teacherStamp']) => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({
  log,
  onClose,
  isTeacherUnlocked = false,
  onSaveTeacherFeedback,
}) => {
  const [editingComment, setEditingComment] = useState('');
  const [editingStamp, setEditingStamp] = useState<BookLog['teacherStamp']>('super');
  const [isEditing, setIsEditing] = useState(false);

  if (!log) return null;

  const handleStartEdit = () => {
    setEditingComment(log.teacherComment || '');
    setEditingStamp(log.teacherStamp || 'super');
    setIsEditing(true);
  };

  const handleSaveFeedback = () => {
    if (onSaveTeacherFeedback) {
      onSaveTeacherFeedback(log.id, editingComment, editingStamp);
    }
    setIsEditing(false);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />

          {/* Modal Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {log.category || '문학'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {new Date(log.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {log.bookTitle}
                </h2>
                <p className="text-sm text-slate-400">
                  {log.author} 지음 {log.publisher ? `· ${log.publisher}` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Badge & Rating */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400">작성 학생</span>
                <p className="text-sm font-bold text-white">
                  {log.grade} {log.classNum} <span className="text-indigo-300">{log.studentName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400 mr-2">도서 평가:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= log.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Book Content Sections */}
          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-indigo-300 flex items-center">
                <Quote className="w-4 h-4 mr-1.5 text-indigo-400" /> 줄거리 요약
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {log.summary}
              </div>
            </div>

            {/* Reflection */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-emerald-300 flex items-center">
                <Heart className="w-4 h-4 mr-1.5 text-emerald-400" /> 나의 감상 및 소감
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {log.reflection}
              </div>
            </div>

            {/* Teacher Comment & Stamp */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-amber-300 flex items-center">
                  <Award className="w-4 h-4 mr-1.5 text-amber-400" /> 선생님의 한줄 칭찬 & 응원 도장
                </h3>
                {isTeacherUnlocked && !isEditing && (
                  <button
                    onClick={handleStartEdit}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    {log.teacherComment ? '칭찬 수정하기' : '+ 칭찬 작성하기'}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-2">
                      칭찬 도장 선택
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'super', label: '최고예요! 🌟', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                        { id: 'thinker', label: '생각왕 🧠', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
                        { id: 'growth', label: '쑥쑥성장 🌱', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                        { id: 'heart', label: '감동가득 💕', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEditingStamp(item.id as BookLog['teacherStamp'])}
                          className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                            item.bg
                          } ${
                            editingStamp === item.id
                              ? 'ring-2 ring-white scale-105 shadow-md'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      선생님 한줄 응원 메시지
                    </label>
                    <textarea
                      value={editingComment}
                      onChange={(e) => setEditingComment(e.target.value)}
                      rows={3}
                      placeholder="학생의 성장과 생각을 격려하는 따뜻한 메시지를 남겨주세요."
                      className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-slate-800"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveFeedback}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 flex items-center"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> 저장하기
                    </button>
                  </div>
                </div>
              ) : log.teacherComment ? (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-100 flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-300 font-bold text-lg shadow-inner">
                    {log.teacherStamp === 'super' && '🌟'}
                    {log.teacherStamp === 'thinker' && '🧠'}
                    {log.teacherStamp === 'growth' && '🌱'}
                    {log.teacherStamp === 'heart' && '💕'}
                    {!log.teacherStamp && '✨'}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 block mb-0.5">
                      담임 교사 피드백
                    </span>
                    <p className="text-sm leading-relaxed text-amber-100/90 font-medium">
                      "{log.teacherComment}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-center text-xs text-slate-400">
                  {isTeacherUnlocked ? (
                    <span>아직 등록된 교사 피드백이 없습니다. 상단에서 칭찬을 남겨보세요!</span>
                  ) : (
                    <span>교사의 한줄 칭찬이 대기 중입니다. 🌸</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrintCard}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium flex items-center transition-colors min-h-[44px]"
            >
              <Printer className="w-4 h-4 mr-1.5" /> 독서 카드 인쇄
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-md shadow-indigo-600/30 min-h-[44px]"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
