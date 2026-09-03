import React, { useState } from 'react';
import {
  HelpCircle, ChevronDown, Sparkles, PhoneCall,
  MessageCircle, Clock, Truck, Calendar, Users, CreditCard, ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface FaqItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  icon: React.ReactNode;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-delivery',
    questionAr: 'هل يوجد توصيل للمنازل والشركات؟',
    questionEn: 'Do you offer home & corporate delivery?',
    answerAr: 'نعم، نوفر خدمة التوصيل المباشر والسريع لجميع أحياء الرياض عبر سيارات مجهزة لحفظ حرارة الأطباق الشعبية والولائم، كما يمكنكم الطلب المباشر عبر رقم الواتساب أو منصات التوصيل المعتمدة.',
    answerEn: 'Yes, we provide swift delivery across Riyadh neighborhoods with heat-insulated transport to ensure dishes arrive piping hot.',
    icon: <Truck className="w-5 h-5 text-[#d4af37]" />
  },
  {
    id: 'faq-hours',
    questionAr: 'ما هي أوقات وساعات العمل بالمطعم؟',
    questionEn: 'What are your working hours?',
    answerAr: 'نستقبلكم يومياً من الساعة 06:00 صباحاً وحتى الساعة 01:30 بعد منتصف الليل دون انقطاع. ونقدم وجبات الإفطار الصباحي، الغداء التراثي مع ولائم الحطب، ووجبات العشاء المتنوعة.',
    answerEn: 'We welcome you daily from 6:00 AM until 1:30 AM continuously, serving breakfast, wood-fired lunch feasts, and evening dinners.',
    icon: <Clock className="w-5 h-5 text-[#d4af37]" />
  },
  {
    id: 'faq-preorder',
    questionAr: 'هل يتوفر خيار الطلب المسبق للولائم والذبائح؟',
    questionEn: 'Can I pre-order large feasts & whole lambs?',
    answerAr: 'نعم بالتأكيد، نوصي بالحجز والطلب المسبق للذبائح الكاملة (تيس، حاشي، خروف نعيمي) أو الصواني الكبيرة قبل 3 إلى 4 ساعات على الأقل، لضمان طهيها على حطب السمر والتنور الطيني بأعلى درجات الإتقان.',
    answerEn: 'Yes, we recommend pre-ordering whole lambs or large banquet platters at least 3-4 hours in advance for optimal slow wood-fired smoking.',
    icon: <Calendar className="w-5 h-5 text-[#d4af37]" />
  },
  {
    id: 'faq-family-majlis',
    questionAr: 'هل توجد جلسات عائلية خاصة ومستقلة؟',
    questionEn: 'Are there private family majlis & private sections?',
    answerAr: 'نعم، يوفر صرح شعبيات البيت الريفي بالرياض قسماً خاصاً ومستقلاً للعائلات مع بارتشن وسواتر كاملة وخصوصية تامة، بالإضافة إلى صالات VIP فخمة تناسب العزائم والاجتماعات العائلية.',
    answerEn: 'Yes, we feature dedicated private family sections with complete privacy partitions, as well as luxury VIP reception halls.',
    icon: <Users className="w-5 h-5 text-[#d4af37]" />
  },
  {
    id: 'faq-reservation',
    questionAr: 'هل يمكن حجز طاولة أو جلسة مسبقاً قبل الحضور؟',
    questionEn: 'Can I reserve a table or majlis beforehand?',
    answerAr: 'نعم، يمكنك حجز جلستك العائلية أو صالة VIP مسبقاً عبر زر "حجز جلسة" بالموقع أو بالتواصل المباشر عبر الواتساب أو الهاتف لتجهيز ضيافتك قبل وصولك.',
    answerEn: 'Yes, you can easily book your family majlis or VIP hall in advance via the website reservation button or via phone/WhatsApp.',
    icon: <PhoneCall className="w-5 h-5 text-[#d4af37]" />
  },
  {
    id: 'faq-payments',
    questionAr: 'هل تتوفر خيارات الدفع الإلكتروني ومدى وApple Pay؟',
    questionEn: 'Do you accept electronic payments, Mada, and Apple Pay?',
    answerAr: 'نعم، نقبل جميع وسائل الدفع المعتمدة بالمملكة: بطاقات مدى، فيزا، ماستركارد، Apple Pay، بالإضافة إلى الدفع النقدي والدفع عند الاستلام.',
    answerEn: 'Yes, we accept all standard Saudi payment methods including Mada cards, Apple Pay, Visa, Mastercard, and cash upon delivery.',
    icon: <CreditCard className="w-5 h-5 text-[#d4af37]" />
  }
];

interface FaqSectionProps {
  lang: Language;
  onOpenReservation?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang, onOpenReservation }) => {
  const isAr = lang === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const whatsappInquiryUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم، لدي استفسار إضافي حول مطعم شعبيات البيت الريفي'
      : 'Hello, I have an inquiry regarding Shaabiyat Al-Bait Al-Reefi restaurant'
  )}`;

  return (
    <section id="faq-section" className="py-12 sm:py-16 bg-white border-b border-[#d4af37]/25 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#b8860b] border border-[#d4af37]/30">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            {isAr ? 'إجابات واضحة لراحتكم' : 'Frequently Asked Questions'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141414] tracking-tight font-heading">
            {isAr ? 'الأسئلة الشائعة والمعلومات المهمة' : 'FAQ & Visitor Guide'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-body">
            {isAr
              ? 'كل ما يهمك معرفته حول خدماتنا، أوقات العمل، التوصيل، الحجوزات والجلسات العائلية في شعبيات البيت الريفي.'
              : 'Everything you need to know about our services, opening hours, delivery, private majlis, and payments.'}
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-3 sm:space-y-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                id={`faq-accordion-item-${item.id}`}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#faf9f6] border-[#d4af37] shadow-md'
                    : 'bg-white border-stone-200 hover:border-[#d4af37]/50 shadow-xs'
                }`}
              >
                <button
                  id={`faq-toggle-btn-${item.id}`}
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-start cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200">
                      {item.icon}
                    </div>
                    <span className="text-base sm:text-lg font-bold text-[#141414] font-heading">
                      {isAr ? item.questionAr : item.questionEn}
                    </span>
                  </div>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#d4af37] text-[#141414]' : 'bg-stone-100 text-stone-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-stone-600 font-body leading-relaxed border-t border-[#d4af37]/15">
                    <p>{isAr ? item.answerAr : item.answerEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#141414] via-[#1c1c1c] to-[#141414] text-white border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-start">
            <h4 className="text-base sm:text-lg font-bold text-[#d4af37] font-heading">
              {isAr ? 'هل لديك سؤال أو طلب خاص؟' : 'Have a special request or inquiry?'}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300">
              {isAr
                ? 'فريق الضيافة جاهز للرد على استفسارك فوراً وتجهيز ولائمك بكل سرور.'
                : 'Our hospitality team is available 24/7 to answer your inquiries.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              id="faq-whatsapp-inquiry-btn"
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{isAr ? 'تواصل عبر واتساب' : 'Chat WhatsApp'}</span>
            </a>

            <a
              id="faq-call-btn"
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#141414] font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#141414]" />
              <span>{isAr ? 'اتصال مباشر' : 'Call Direct'}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
