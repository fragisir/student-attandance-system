
'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { Loader2, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const scanUrl = `${origin}/scan`;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm md:max-w-md p-6 md:p-10 text-center glass rounded-3xl shadow-2xl animate-in space-y-6 md:space-y-8 mt-[-10vh] md:mt-0">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance leading-tight">
            出席管理システム
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium px-2">
            QRコードをスキャンして出席を記録してください
          </p>
        </div>

        <div className="flex justify-center p-4 md:p-8 bg-white rounded-3xl shadow-inner dark:bg-slate-800/50">
          <QRCodeSVG 
            value={scanUrl} 
            size={220}
            level="H"
            includeMargin={true}
            className="w-full h-auto max-w-[200px] md:max-w-none"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-center gap-2.5 text-sm md:text-base font-semibold text-slate-400">
            <QrCode className="w-5 h-5 text-primary" />
            <span>スキャンして出席開始</span>
          </div>
          
          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800">
            <Link 
              href="/attendance"
              className="text-sm md:text-base font-bold text-slate-400 hover:text-primary transition-all hover:underline underline-offset-4"
            >
              出席記録を表示
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
