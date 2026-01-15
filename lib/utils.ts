
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0];
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function calculateDuration(inTime: string, outTime: string): string {
    const [inH, inM, inS] = inTime.split(':').map(Number);
    const [outH, outM, outS] = outTime.split(':').map(Number);

    const inDate = new Date(0, 0, 0, inH, inM, inS);
    const outDate = new Date(0, 0, 0, outH, outM, outS);

    const diffMs = outDate.getTime() - inDate.getTime();
    if (diffMs < 0) return '0h 0m';

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs}時間 ${diffMins}分`;
}
