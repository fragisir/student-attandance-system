
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  getStoredStudentNumber, 
  setStoredStudentNumber, 
  getRecordForToday, 
  saveRecord,
  AttendanceRecord 
} from '@/lib/storage';
import { formatDate, formatTime } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  ArrowRight,
  Loader2,
  CalendarDays,
  School
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CLASS_LIST = Array.from({ length: 17 }, (_, i) => `DX-24 ${String(i + 1).padStart(2, '0')}`);

function ScanPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [studentNumber, setStudentNumber] = useState<string>('');
  const [inputNumber, setInputNumber] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already_done' | 'loading'>('loading');
  const [lastAction, setLastAction] = useState<{ type: 'in' | 'out', time: string } | null>(null);

  useEffect(() => {
    const stored = getStoredStudentNumber();
    if (stored) {
      setStudentNumber(stored);
      setInputNumber(stored);
    }
    setStatus('idle');
  }, []);

  const processAttendance = (sNum: string, className: string) => {
    if (!className) return;
    
    setStatus('loading');
    const today = formatDate(new Date());
    const now = formatTime(new Date());
    
    setTimeout(() => {
      const existing = getRecordForToday(sNum, className, today);

      if (!existing) {
        // Record IN
        const newRecord: AttendanceRecord = {
          id: `${sNum}-${className}-${today}`,
          className,
          studentNumber: sNum,
          date: today,
          inTime: now,
        };
        saveRecord(newRecord);
        setLastAction({ type: 'in', time: now });
        setStatus('success');
      } else if (!existing.outTime) {
        // Record OUT
        existing.outTime = now;
        saveRecord(existing);
        setLastAction({ type: 'out', time: now });
        setStatus('success');
      } else {
        setStatus('already_done');
      }
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputNumber.trim() && selectedClass) {
      setStoredStudentNumber(inputNumber.trim());
      setStudentNumber(inputNumber.trim());
      processAttendance(inputNumber.trim(), selectedClass);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-slate-500 animate-pulse font-medium">出席を処理中...</p>
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">出席を記録する</h1>
          <p className="text-slate-500 dark:text-slate-400">詳細を入力してください。</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3 h-3" /> 学籍番号
              </label>
              <input 
                required
                type="text" 
                placeholder="例: STU12345"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <School className="w-3 h-3" /> クラスを選択
              </label>
              <select 
                required
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-lg appearance-none cursor-pointer"
              >
                <option value="" disabled>クラスを選択してください</option>
                {CLASS_LIST.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group"
          >
            出席を送信
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
                {lastAction?.type === 'in' ? '出席完了！' : '退席完了！'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium whitespace-pre-wrap">
                学籍番号: <span className="text-slate-900 dark:text-slate-200">{studentNumber}</span>{'\n'}
                クラス: <span className="text-slate-900 dark:text-slate-200">{selectedClass}</span>
              </p>
            </div>

            <div className="glass p-6 rounded-2xl flex items-center justify-between border-green-200 dark:border-green-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-slate-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">記録時刻</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{lastAction?.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">アクション</p>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  lastAction?.type === 'in' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                )}>
                  {lastAction?.type === 'in' ? '入室' : '退室'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/')}
              className="w-full py-4 text-slate-500 font-medium hover:text-slate-900 transition-colors"
            >
              ホームに戻る
            </button>
          </motion.div>
        )}

        {status === 'already_done' && (
          <motion.div 
            key="already_done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">記録済み</h2>
              <p className="text-slate-500 dark:text-slate-400">
                本日の <span className="font-bold">{selectedClass}</span> の出席記録は既に完了しています。
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border-amber-200 dark:border-amber-900/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">学籍番号</span>
                <span className="font-bold">{studentNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">日付</span>
                <span className="font-bold">{formatDate(new Date())}</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/')}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl"
            >
              ホームに戻る
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-center">
      <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <ScanPageContent />
      </Suspense>
    </main>
  );
}
