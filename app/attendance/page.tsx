
'use client';

import { useEffect, useState } from 'react';
import { getRecords, AttendanceRecord } from '@/lib/storage';
import { calculateDuration } from '@/lib/utils';
import { Search, Calendar, User, School, ArrowLeft, FilterX, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  
  // Search states
  const [searchStudent, setSearchStudent] = useState('');
  const [searchClass, setSearchClass] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const data = getRecords();
    // Sort by date and inTime descending (newest first)
    const sorted = [...data].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.inTime.localeCompare(a.inTime);
    });
    setRecords(sorted);
    setFilteredRecords(sorted);
  }, []);

  useEffect(() => {
    let result = records;
    if (searchStudent) {
      result = result.filter(r => r.studentNumber.toLowerCase().includes(searchStudent.toLowerCase()));
    }
    if (searchClass) {
      result = result.filter(r => r.className.toLowerCase().includes(searchClass.toLowerCase()));
    }
    if (searchDate) {
      result = result.filter(r => r.date === searchDate);
    }
    setFilteredRecords(result);
  }, [searchStudent, searchClass, searchDate, records]);

  const clearFilters = () => {
    setSearchStudent('');
    setSearchClass('');
    setSearchDate('');
  };

  const clearRecords = () => {
    if (confirm('すべての出席記録を削除してもよろしいですか？')) {
      localStorage.removeItem('attendance_records');
      setRecords([]);
      setFilteredRecords([]);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:text-primary transition-colors border border-slate-200 dark:border-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">出席記録</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={clearRecords}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
            >
              <Trash2 className="w-4 h-4" />
              すべて削除
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="glass p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3 h-3" /> 学籍番号
            </label>
            <input 
              type="text"
              placeholder="学籍番号で検索..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <School className="w-3 h-3" /> クラス
            </label>
            <input 
              type="text"
              placeholder="クラスで検索..."
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3 h-3" /> 日付
            </label>
            <input 
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button 
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FilterX className="w-4 h-4" />
            フィルターをクリア
          </button>
        </div>

        {/* Table/List View */}
        <div className="glass rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Mobile List (hidden on desk) */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center text-slate-400">記録が見つかりません</div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{record.studentNumber}</p>
                      <p className="text-sm text-slate-500">{record.className}</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-500">
                      {record.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold">入室</span>
                      <span className="text-green-600 font-medium">{record.inTime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold">退室</span>
                      <span className="text-amber-600 font-medium">{record.outTime || '--:--:--'}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold">滞在時間</span>
                      <span className="font-bold text-indigo-600">
                        {record.outTime ? calculateDuration(record.inTime, record.outTime) : '--'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  <th className="px-6 py-4">学籍番号</th>
                  <th className="px-6 py-4">クラス</th>
                  <th className="px-6 py-4">日付</th>
                  <th className="px-6 py-4">入室時刻</th>
                  <th className="px-6 py-4">退室時刻</th>
                  <th className="px-6 py-4">滞在時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                      検索条件に一致する記録が見つかりません
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{record.studentNumber}</td>
                      <td className="px-6 py-4 text-slate-500">{record.className}</td>
                      <td className="px-6 py-4 text-slate-500">{record.date}</td>
                      <td className="px-6 py-4 text-green-600 font-mono font-medium">{record.inTime}</td>
                      <td className="px-6 py-4 text-amber-600 font-mono font-medium">{record.outTime || '--:--:--'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold">
                          {record.outTime ? calculateDuration(record.inTime, record.outTime) : '--'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
