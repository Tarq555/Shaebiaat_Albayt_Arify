import React, { useState, useEffect } from 'react';
import {
  X, User, Phone, Mail, Lock, ShieldCheck, CheckCircle2,
  Tag, ArrowLeft, ArrowRight, AlertCircle, Sparkles, LogOut, KeyRound
} from 'lucide-react';
import { Language, MemberUser } from '../types';
import {
  validateNameField, validatePhoneField, validateEmailField,
  sanitizeNameInput, sanitizePhoneInput
} from '../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentMember: MemberUser | null;
  onMemberLogin: (member: MemberUser) => void;
  onMemberLogout: () => void;
  isAdmin: boolean;
  onAdminLoginSuccess: () => void;
  initialTab?: 'member' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentMember,
  onMemberLogin,
  onMemberLogout,
  isAdmin,
  onAdminLoginSuccess,
  initialTab = 'member'
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeTab, setActiveTab] = useState<'member' | 'admin'>(initialTab);

  // Member form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; email?: boolean }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  // Admin PIN state
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setPin('');
      setPinError('');
      setIsSuccess(false);
      setErrors({});
      setTouched({});
      // Lock background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Real-time sanitization without intrusive upfront rules
  const handleNameChange = (val: string) => {
    const clean = sanitizeNameInput(val);
    setName(clean);
    if (touched.name) {
      const res = validateNameField(clean);
      setErrors((prev) => ({ ...prev, name: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handlePhoneChange = (val: string) => {
    const clean = sanitizePhoneInput(val);
    setPhone(clean);
    if (touched.phone) {
      const res = validatePhoneField(clean);
      setErrors((prev) => ({ ...prev, phone: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      const res = validateEmailField(val, false);
      setErrors((prev) => ({ ...prev, email: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  const handleBlur = (field: 'name' | 'phone' | 'email') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') {
      const res = validateNameField(name);
      setErrors((prev) => ({ ...prev, name: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    } else if (field === 'phone') {
      const res = validatePhoneField(phone);
      setErrors((prev) => ({ ...prev, phone: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    } else if (field === 'email') {
      const res = validateEmailField(email, false);
      setErrors((prev) => ({ ...prev, email: res.isValid ? undefined : (isAr ? res.messageAr : res.messageEn) }));
    }
  };

  // Submit Member Sign In
  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });

    const nameValidation = validateNameField(name);
    const phoneValidation = validatePhoneField(phone);
    const emailValidation = validateEmailField(email, false);

    const newErrors: { name?: string; phone?: string; email?: string } = {};
    if (!nameValidation.isValid) newErrors.name = isAr ? nameValidation.messageAr : nameValidation.messageEn;
    if (!phoneValidation.isValid) newErrors.phone = isAr ? phoneValidation.messageAr : phoneValidation.messageEn;
    if (!emailValidation.isValid) newErrors.email = isAr ? emailValidation.messageAr : emailValidation.messageEn;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const generatedVoucher = `REEF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember: MemberUser = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      loginTime: Date.now(),
      discountCode: generatedVoucher
    };

    // Save lead subscriber for admin records
    try {
      const savedSubs = localStorage.getItem('al_bait_marketing_subscribers');
      const subscribers = savedSubs ? JSON.parse(savedSubs) : [];
      const newSub = {
        id: `sub-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredChannel: 'both',
        interest: 'أعضاء الذواقة والولائم',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('al_bait_marketing_subscribers', JSON.stringify([newSub, ...subscribers]));
    } catch {
      // ignore
    }

    onMemberLogin(newMember);
    setVoucherCode(generatedVoucher);
    setIsSuccess(true);
  };

  // Admin PIN verification
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const savedPin = localStorage.getItem('al_bait_admin_pin');
    const effectivePin = (savedPin && savedPin.trim().length >= 4) ? savedPin.trim() : '8899';

    if (pin.trim() === effectivePin) {
      onAdminLoginSuccess();
      onClose();
    } else {
      setPinError(isAr ? 'رمز المرور غير صحيح. يرجى المحاولة مرة أخرى.' : 'Incorrect PIN. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#141414] text-white flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center">
              {activeTab === 'member' ? <User className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </h3>
              <p className="text-xs text-stone-300">
                {isAr ? 'شعبيات البيت الريفي - الرياض' : 'Shaabiyat Al-Bait Al-Reefi'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Standard Tabs: Members / Staff */}
        <div className="grid grid-cols-2 p-1.5 bg-[#faf9f6] border-b border-stone-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('member');
              setIsSuccess(false);
            }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'member'
                ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                : 'text-stone-600 hover:text-[#141414]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isAr ? 'حساب الأعضاء والزوار' : 'Member Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setIsSuccess(false);
            }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-[#141414] text-[#d4af37] shadow-xs'
                : 'text-stone-600 hover:text-[#141414]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{isAr ? 'طاقم العمل والإدارة' : 'Staff / Admin'}</span>
          </button>
        </div>

        {/* Tab 1: Member Account View */}
        {activeTab === 'member' && (
          <div className="p-5 sm:p-6">
            {/* If Already Logged In */}
            {currentMember && !isSuccess ? (
              <div className="space-y-5 text-center py-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#141414] font-heading">
                    {isAr ? `أهلاً بك، ${currentMember.name}` : `Welcome back, ${currentMember.name}`}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    {currentMember.phone}
                  </p>
                </div>

                {currentMember.discountCode && (
                  <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#d4af37]/40 space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#b8860b]">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{isAr ? 'كوبون الخصم الخاص بك (10%)' : 'Your 10% Discount Code'}</span>
                    </div>
                    <div className="font-mono font-extrabold text-base text-[#141414] tracking-wider select-all">
                      {currentMember.discountCode}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#141414] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    {isAr ? 'متابعة التصفح' : 'Continue Browsing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onMemberLogout();
                    }}
                    className="py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                </div>
              </div>
            ) : isSuccess ? (
              /* Success View */
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-400 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[#141414] font-heading">
                    {isAr ? 'تم تسجيل دخولك بنجاح!' : 'Successfully Signed In!'}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {isAr
                      ? `أهلاً بك يا ${name}. يسعدنا انضمامك ويسرنا تقديم خصم ترحيبي خاص بك.`
                      : `Welcome, ${name}. We are pleased to offer you a welcome discount.`}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-[#d4af37] space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#b8860b]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{isAr ? 'كوبون الخصم الترحيبي (10%)' : 'Welcome 10% Voucher'}</span>
                  </div>
                  <div className="font-mono font-extrabold text-base text-[#141414] tracking-wider select-all">
                    {voucherCode}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-[#141414] text-[#d4af37] text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  {isAr ? 'تم، العودة للموقع' : 'Done, return to site'}
                </button>
              </div>
            ) : (
              /* Clean International Form without unsolicited marketing or upfront constraint text */
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder={isAr ? 'مثال: عبد الله بن محمد' : 'e.g. Abdullah Mohammed'}
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-hidden transition-colors ${
                      errors.name
                        ? 'border-red-400 bg-red-50/40 text-red-900'
                        : 'border-stone-300 focus:border-[#d4af37] bg-white'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-[11px] mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'رقم الجوال' : 'Mobile Phone'}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="05xxxxxxxx"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-hidden transition-colors ${
                      errors.phone
                        ? 'border-red-400 bg-red-50/40 text-red-900'
                        : 'border-stone-300 focus:border-[#d4af37] bg-white'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-[11px] mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-hidden transition-colors ${
                      errors.email
                        ? 'border-red-400 bg-red-50/40 text-red-900'
                        : 'border-stone-300 focus:border-[#d4af37] bg-white'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-[11px] mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isAr ? 'تسجيل الدخول / المتابعة' : 'Sign In / Continue'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Admin & Staff Access */}
        {activeTab === 'admin' && (
          <div className="p-5 sm:p-6">
            {isAdmin ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#d4af37] text-[#d4af37] mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#141414] font-heading">
                    {isAr ? 'أنت مسجل كمدير نظام حالياً' : 'Logged in as Admin'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    {isAr ? 'يمكنك الوصول لكافة أدوات التعديل والإدارة' : 'Full access to management tools'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#141414] text-[#d4af37] text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'العودة للوحة التحكم' : 'Return to Dashboard'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdminVerify} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {isAr ? 'رمز مرور الإدارة (PIN)' : 'Admin PIN'}
                  </label>
                  <p className="text-[11px] text-stone-500">
                    {isAr ? 'أدخل الرمز المخصص لطاقم إدارة المطعم' : 'Enter designated staff PIN'}
                  </p>
                </div>

                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-lg font-mono px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#d4af37] focus:outline-hidden"
                />

                {pinError && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pinError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#141414] hover:bg-black text-[#d4af37] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isAr ? 'دخول لوحة الإدارة' : 'Access Admin'}</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
