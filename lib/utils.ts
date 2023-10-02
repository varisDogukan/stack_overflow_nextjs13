import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();  
  const elapsedMilliseconds = now.getTime() - createdAt.getTime();

  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedDays > 0) {
    return `${elapsedDays} day${elapsedDays !== 1 ? 's' : ''} ago`;
  } else if (elapsedHours > 0) {
    return `${elapsedHours} hour${elapsedHours !== 1 ? 's' : ''} ago`;
  } else if (elapsedMinutes > 0) {
    return `${elapsedMinutes} minute${elapsedMinutes !== 1 ? 's' : ''} ago`;
  } else {
    return `${elapsedSeconds} second${elapsedSeconds !== 1 ? 's' : ''} ago`;
  }
};


export  const formatLargeNumber = (number: number): string => {
  if (Math.abs(number) >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B';
  } else if (Math.abs(number) >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M';
  } else if (Math.abs(number) >= 1e3) {
    return (number / 1e3).toFixed(2) + 'K';
  } else {
    return number.toString();
  }
}