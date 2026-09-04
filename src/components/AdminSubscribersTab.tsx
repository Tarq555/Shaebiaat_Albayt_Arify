import React, { useState, useEffect } from 'react';
import {
  Users, Mail, Phone, Search, Download, Trash2,
  Calendar, CheckCircle2, MessageSquare, Tag, Shield
} from 'lucide-react';
import { Language } from '../types';
import { MarketingSubscriber } from './OffersSubscriptionModal';

interface AdminSubscribersTabProps {
  lang: Language;
}

export const AdminSubscribersTab: React.FC<AdminSubscribersTabProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [subscribers, setSubscribers] = useState<MarketingSubscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<'all' | 'whatsapp' | 'email' | 'both'>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('al_bait_marketing_subscribers');
      if (saved) {
        setSubscribers(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading subscribers', e);
    }
  }, []);

  const handleDeleteSubscriber = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المشترك؟' : 'Delete this subscriber?')) {
      const updated = subscribers.filter((s) => s.id !== id);
      setSubscribers(updated);
      try {
        localStorage.setItem('al_bait_marketing_subscribers', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving updated subscribers', e);
      }
    }
  };

  const handleExportCsv = () => {
    if (subscribers.length === 0) {
      alert(isAr ? 'لا يوجد مشتركون للتصدير بعد' : 'No subscribers to export yet');
      return;
    }

    const headers = ['ID', 'الاسم', 'رقم الهاتف', 'البريد الإلكتروني', 'قناة التواصل', 'الاهتمام', 'تاريخ التسجيل'];
    const rows = subscribers.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      s.preferredChannel,
      `"${s.interest}"`,
      new Date(s.createdAt).toLocaleDateString('ar-SA')
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `al_bait_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((sub) => {
    const matchSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChannel = filterChannel === 'all' || sub.preferredChannel === filterChannel;
    return matchSearch && matchChannel;
  });

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
        <div>
          <h3 className="text-base font-bold text-[#141414] font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-[#b8860b]" />
            <span>{isAr ? 'قائمة المشتركين في العروض والتسويق (Leads)' : 'Marketing Subscribers & Leads'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isAr
              ? `إجمالي المسجلين: ${subscribers.length} زائر مهتم بالعروض والولائم`
              : `Total Subscribers: ${subscribers.length} interested visitors`}
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-stone-900 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>{isAr ? 'تصدير المشتركين كملف Excel / CSV' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute top-3 start-3 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'البحث بالاسم، رقم الجوال أو البريد...' : 'Search by name, phone, email...'}
            className="w-full ps-9 pe-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#d4af37] bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterChannel('all')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'all'
                ? 'bg-[#141414] text-[#d4af37]'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setFilterChannel('whatsapp')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'whatsapp'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'واتساب' : 'WhatsApp'}
          </button>
          <button
            onClick={() => setFilterChannel('email')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'email'
                ? 'bg-[#141414] text-[#d4af37]'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'إيميل' : 'Email'}
          </button>
          <button
            onClick={() => setFilterChannel('both')}
            className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterChannel === 'both'
                ? 'bg-[#d4af37] text-[#141414]'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {isAr ? 'كلاهما' : 'Both'}
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
          <Users className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
          <p>{isAr ? 'لا توجد بيانات مشتركين مطابقة حالياً.' : 'No matching subscribers found.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-xs text-start">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-3 text-start">{isAr ? 'الاسم الكامل' : 'Name'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'الجوال' : 'Phone'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'القناة المفضلة' : 'Channel'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'الاهتمام' : 'Interest'}</th>
                <th className="py-3 px-3 text-start">{isAr ? 'تاريخ التسجيل' : 'Date'}</th>
                <th className="py-3 px-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#141414] whitespace-nowrap">
                    {sub.name}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-stone-800 whitespace-nowrap" dir="ltr">
                    <a
                      href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{sub.phone}</span>
                    </a>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-600 whitespace-nowrap" dir="ltr">
                    <a href={`mailto:${sub.email}`} className="hover:text-[#b8860b] inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-stone-400" />
                      <span>{sub.email}</span>
                    </a>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-[#b8860b] border border-amber-200">
                      {sub.preferredChannel === 'whatsapp' ? 'واتساب' : sub.preferredChannel === 'email' ? 'إيميل' : 'واتساب وإيميل'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-stone-600 whitespace-nowrap">
                    {sub.interest}
                  </td>
                  <td className="py-2.5 px-3 text-stone-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(sub.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title={isAr ? 'حذف هذا المشترك' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
