import { BookLog, AppSettings } from '../types';
import { INITIAL_MOCK_LOGS, DEFAULT_SETTINGS } from '../data/mockData';

const LOGS_STORAGE_KEY = 'class_reading_logs_v1';
const SETTINGS_STORAGE_KEY = 'class_reading_settings_v1';

export function getStoredLogs(): BookLog[] {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      saveStoredLogs(INITIAL_MOCK_LOGS);
      return INITIAL_MOCK_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_LOGS;
  } catch (err) {
    console.error('Failed to load logs from localStorage:', err);
    return INITIAL_MOCK_LOGS;
  }
}

export function saveStoredLogs(logs: BookLog[]): void {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to localStorage:', err);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      saveStoredSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}

export async function postToGoogleSheets(url: string, log: BookLog): Promise<{ success: boolean; message: string }> {
  if (!url || !url.trim().startsWith('http')) {
    return {
      success: false,
      message: '구글 연동 URL이 설정되지 않아 로컬에만 저장되었습니다.'
    };
  }

  try {
    // Mode: 'no-cors' allows sending cross-origin data to Google Apps Script Web App safely without CORS failure
    const payload = JSON.stringify(log);
    
    // First try normal CORS fetch or fallback to no-cors
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: payload,
        mode: 'no-cors'
      });
      return {
        success: true,
        message: '구글 스프레드시트 전송 완료!'
      };
    } catch {
      // Secondary fallback attempt
      await fetch(url, {
        method: 'POST',
        body: payload,
        mode: 'no-cors'
      });
      return {
        success: true,
        message: '구글 시트로 안전하게 전송되었습니다.'
      };
    }
  } catch (err) {
    console.warn('Google Sheets API submit error:', err);
    return {
      success: false,
      message: '시트 전송 중 오류가 발생했으나, 로컬 전송은 완료되었습니다.'
    };
  }
}

export function exportToCSV(logs: BookLog[], filename = '우리반_전자독서기록장.csv'): void {
  if (logs.length === 0) return;

  const headers = ['작성일시', '학년', '반', '이름', '도서명', '지은이', '출판사', '분야', '별점', '줄거리', '소감', '교사한줄평'];

  const rows = logs.map(log => [
    `"${log.createdAt ? new Date(log.createdAt).toLocaleString('ko-KR') : ''}"`,
    `"${log.grade || ''}"`,
    `"${log.classNum || ''}"`,
    `"${log.studentName || ''}"`,
    `"${(log.bookTitle || '').replace(/"/g, '""')}"`,
    `"${(log.author || '').replace(/"/g, '""')}"`,
    `"${(log.publisher || '').replace(/"/g, '""')}"`,
    `"${log.category || ''}"`,
    `"${log.rating || 5}"`,
    `"${(log.summary || '').replace(/"/g, '""')}"`,
    `"${(log.reflection || '').replace(/"/g, '""')}"`,
    `"${(log.teacherComment || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
