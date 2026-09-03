import { Currency } from '../types';

// Standard Saudi Riyal base rates for Riyadh Flagship
const RATES: Record<Currency, { rate: number; symbolAr: string; symbolEn: string }> = {
  SAR: { rate: 1, symbolAr: 'ر.س', symbolEn: 'SAR' },
  USD: { rate: 1 / 3.75, symbolAr: '$', symbolEn: 'USD' },
  YER: { rate: 65, symbolAr: 'ر.ي', symbolEn: 'YER' },
};

export function formatPrice(amountInSar: number, currency: Currency = 'SAR', isAr: boolean = true): string {
  // If legacy data stored price in YER (> 350 for individual dishes), normalize smoothly to SAR
  const normalizedSar = amountInSar > 350 ? Math.round(amountInSar / 65) : amountInSar;
  const info = RATES[currency] || RATES.SAR;
  const converted = normalizedSar * info.rate;
  
  if (currency === 'YER') {
    return `${Math.round(converted).toLocaleString('en-US')} ${isAr ? info.symbolAr : info.symbolEn}`;
  }
  
  const formattedNumber = Number.isInteger(Math.round(converted * 10) / 10)
    ? Math.round(converted).toString()
    : (Math.round(converted * 10) / 10).toFixed(1);

  return `${formattedNumber} ${isAr ? info.symbolAr : info.symbolEn}`;
}
