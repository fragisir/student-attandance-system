
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
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 text-center glass rounded-3xl shadow-2xl animate-in space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            出席管理システム
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            QRコードをスキャンして出席を記録してください
          </p>
        </div>

        <div className="flex justify-center p-6 bg-white rounded-2xl shadow-inner dark:bg-slate-800">
          <QRCodeSVG 
            value={scanUrl} 
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <QrCode className="w-4 h-4" />
            <span>スキャンして出席開始</span>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link 
              href="/attendance"
              className="text-sm font-medium text-slate-400 hover:text-primary transition-colors hover:underline"
            >
              出席記録を表示
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
