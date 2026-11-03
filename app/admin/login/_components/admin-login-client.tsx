"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseConfig, DEFAULT_PUBLISHABLE_KEY } from "@/lib/supabase/config";
import { useAppStore } from "@/providers/app-store-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Fingerprint,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Database,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const {
    isSupabaseConnected,
    configureSupabaseConnection,
    refreshFromDatabase,
  } = useAppStore();

  const [tab, setTab] = useState<"pass" | "otp" | "bio">("pass");
  const authMode = "signin" as "signin" | "signup";
  const [email, setEmail] = useState("admin@amanikhalil.sa");
  const [password, setPassword] = useState("AmaniAtelier2025!");
  const [phone, setPhone] = useState("+966501284492");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Supabase connection helper state
  const [showDbSetup, setShowDbSetup] = useState(false);
  const [projectUrl, setProjectUrl] = useState("");
  const [publishableKey, setPublishableKey] = useState(DEFAULT_PUBLISHABLE_KEY);

  useEffect(() => {
    const cfg = getSupabaseConfig();
    if (cfg.url) setProjectUrl(cfg.url);
    if (cfg.key) setPublishableKey(cfg.key);
  }, []);

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await configureSupabaseConnection(projectUrl, publishableKey);
    setIsLoading(false);
    setShowDbSetup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();

      if (!supabase) {
        toast.error(
          "يرجى إدخال رابط مشروع Supabase (Project URL) أولاً لتفعيل المصادقة الحقيقية",
          {
            description:
              "اضغطي على زر إعداد اتصال Supabase أعلاه وألصقي رابط المشروع.",
          }
        );
        setShowDbSetup(true);
        setIsLoading(false);
        return;
      }

      if (tab === "pass") {
        if (!email.trim() || !password.trim()) {
          toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
          setIsLoading(false);
          return;
        }


        // Password sign-in; admin rights are verified via the is_admin() RPC below.
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          toast.error("فشل تسجيل الدخول", { description: error.message });
          setIsLoading(false);
          return;
        }

        const { data: isAdminData } = await supabase.rpc("is_admin");
        if (isAdminData !== true) {
          await supabase.auth.signOut();
          toast.error("هذا الحساب لا يملك صلاحيات الإدارة");
          setIsLoading(false);
          return;
        }

        if (data.user) {
          await refreshFromDatabase();
          toast.success(
            "تم التحقق عبر Supabase Auth بنجاح • مرحباً بكِ في لوحة تحكم أماني خليل ✨"
          );
          window.location.href = nextPath;
          return;
        }
      } else if (tab === "otp") {
        if (!otpSent) {
          // Send Magic Link / Email OTP via Supabase
          const targetEmail = email.trim();
          const { error } = await supabase.auth.signInWithOtp({
            email: targetEmail,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                nextPath
              )}`,
            },
          });
          if (error) {
            toast.error("تعذر إرسال رمز التحقق عبر Supabase Auth", {
              description: error.message,
            });
          } else {
            setOtpSent(true);
            toast.success(`تم إرسال رمز التحقق والرابط السحري إلى ${targetEmail} ✨`);
          }
          setIsLoading(false);
          return;
        } else {
          const { data, error } = await supabase.auth.verifyOtp({
            email: email.trim(),
            token: otpCode.trim(),
            type: "email",
          });
          if (error || !data.session) {
            toast.error("رمز التحقق غير صحيح أو منتهي الصلاحية", {
              description: error?.message,
            });
            setIsLoading(false);
            return;
          }
          const { data: otpAdmin } = await supabase.rpc("is_admin");
          if (otpAdmin !== true) {
            await supabase.auth.signOut();
            toast.error("هذا الحساب لا يملك صلاحيات الإدارة");
            setIsLoading(false);
            return;
          }
          await refreshFromDatabase();
          toast.success("تم التحقق من رمز OTP بنجاح ✨");
          router.push(nextPath);
          router.refresh();
          return;
        }
      } else {
        toast.info(
          "يرجى تسجيل الدخول بالبريد وكلمة المرور أولاً لتفعيل Passkey الحيوي في حسابك."
        );
        setTab("pass");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء الاتصال بخادم المصادقة", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      data-shell-ui="true"
      className="min-h-screen bg-[#fff8f7] flex flex-col justify-between"
    >
      {/* Top Security & Supabase Status Banner */}
      <div className="w-full py-3 px-6 sm:px-12 flex flex-wrap items-center justify-between gap-2 border-b border-[#f3dedf] text-xs text-[#524345]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#735c00]" />
          <span className="font-medium tracking-wide">
            Supabase Auth SSR • Protected Atelier Gateway
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDbSetup((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
              isSupabaseConnected
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-900 border-amber-300"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {isSupabaseConnected
                ? "قاعدة بيانات Supabase متصلة ✓"
                : "إعداد رابط مشروع Supabase"}
            </span>
          </button>
          <div className="text-[11px] font-mono text-[#795900] bg-[#faee9e]/50 px-2.5 py-0.5 rounded-full hidden sm:block">
            @supabase/ssr • RLS Active
          </div>
        </div>
      </div>

      {/* Collapsible Supabase Project URL Setup Bar */}
      {showDbSetup && (
        <div className="w-full bg-[#fff0f1] border-b border-[#d7c1c3] px-4 py-4">
          <form
            data-react-form="true"
            onSubmit={handleSaveSupabaseConfig}
            className="max-w-4xl mx-auto space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#2f020d] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#735c00]" />
                <span>إعداد الاتصال المباشر بمشروع Supabase (Amani Khalil)</span>
              </h3>
              <span className="text-[11px] text-[#524345]">
                انسخي رابط المشروع من زر Connect الأخضر في لوحة Supabase
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5">
                <Input
                  type="url"
                  dir="ltr"
                  required
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://lbcywxlfbdshflznapxx.supabase.co"
                  className="bg-white text-xs h-10 font-mono"
                />
              </div>
              <div className="md:col-span-5">
                <Input
                  type="text"
                  dir="ltr"
                  required
                  value={publishableKey}
                  onChange={(e) => setPublishableKey(e.target.value)}
                  placeholder="sb_publishable_..."
                  className="bg-white text-xs h-10 font-mono"
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold"
                >
                  حفظ واتصال
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl rounded-3xl bg-white shadow-[0_16px_50px_rgba(74,21,33,0.08)] border border-[#f3dedf] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left/Visual Editorial Panel */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-8 sm:p-10 bg-gradient-to-br from-[#4a1521] via-[#3a0d17] to-[#20000a] text-white min-h-[460px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-soft-light opacity-30 scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6hDJLaVFhqjdWK-7ieSZSZg0prQ-nNi6zIHHaaijV99eBrlkGLU7rGeCFGkkvxwtv8jhJ8M43IfyNOmwa6N5bgd1fuuhx6tsNGBc42FqWymG3hGVoMI9FEeIBZzxw2Dt-UWWzZoi6XrbaV2tUz6DUtRI9qs4lFk8UgNn6FP5IUoJG-2aXqdaC4bRw3vcVAnsg4LHzcvcJx_PcCxz6nbQsFBaSy7jdUSGdCwGan4c')",
              }}
            />
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#faee9e]/15 blur-3xl pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-[#faee9e]">
                <ShieldCheck className="w-3.5 h-3.5" />
                بوابة الإدارة المركزية والتحكم
              </span>
              <span className="w-8 h-8 rounded-full bg-[#faee9e]/20 text-[#faee9e] flex items-center justify-center text-xs font-bold">
                AK
              </span>
            </div>

            {/* Quote / Center Content */}
            <div className="relative z-10 my-auto py-8">
              <div className="inline-flex p-2 rounded-full bg-[#faee9e]/20 text-[#faee9e] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <blockquote className="font-serif text-xl sm:text-2xl font-bold leading-relaxed text-white">
                “حيث تلتقي حرفية الفخامة بأعلى معايير الإدارة والخصوصية الرقمية.”
              </blockquote>
              <div className="w-12 h-1 bg-[#faee9e] my-4 rounded-full" />
              <p className="text-xs text-white/80 leading-relaxed">
                المنصة الحصرية الخاصة بإدارة جلسات كبار الشخصيات، تقويم حجوزات العرائس الملكية،
                والتنسيق اللوجستي لأتيليه الرياض عبر Supabase Auth.
              </p>
            </div>

            {/* Security Status Box */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#faee9e]" />
                <div>
                  <div className="text-xs font-bold text-white">
                    حماية المسارات (Protected Routes)
                  </div>
                  <div className="text-[10px] text-white/70">
                    جلسة مصادقة Supabase مشفرة ومحمية بـ RLS
                  </div>
                </div>
              </div>
              <div
                className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  isSupabaseConnected ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
            </div>
          </div>

          {/* Right/Authentication Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              {/* Header with Logo */}
              <div className="flex items-center justify-between pb-4 border-b border-[#f3dedf] mb-6">
                <Link href="/" className="inline-block">
                  <Image
                    src="/logo.png"
                    alt="أماني خليل | Amani Khalil"
                    width={180}
                    height={48}
                    className="h-10 sm:h-12 w-auto object-contain"
                    priority
                  />
                </Link>
                <span className="text-[11px] font-medium text-[#735c00] bg-[#faee9e]/50 px-3 py-1 rounded-full">
                  Supabase Auth الموثق
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold font-serif text-[#2f020d]">
                    {authMode === "signin"
                      ? "تسجيل الدخول الإداري"
                      : "إنشاء حساب إداري جديد"}
                  </h1>
                  <p className="text-xs text-[#524345]">
                    {authMode === "signin"
                      ? "أدخلي بيانات حسابك في Supabase للوصول إلى لوحة التحكم المحمية."
                      : "سجلي بريدك الإلكتروني وكلمة المرور لإنشاء حساب المديرة في Supabase Auth."}
                  </p>
                </div>

              </div>

              {/* Tabs for Auth method */}
              <Tabs
                value={tab}
                onValueChange={(val) => setTab(val as "pass" | "otp" | "bio")}
                className="w-full space-y-5"
              >
                <TabsList className="grid grid-cols-3 bg-[#fceeed] p-1 rounded-2xl">
                  <TabsTrigger
                    value="pass"
                    className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#2f020d] data-[state=active]:shadow-sm rounded-xl py-2"
                  >
                    البريد وكلمة المرور
                  </TabsTrigger>
                  <TabsTrigger
                    value="otp"
                    className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#2f020d] data-[state=active]:shadow-sm rounded-xl py-2"
                  >
                    رمز OTP عبر البريد
                  </TabsTrigger>
                  <TabsTrigger
                    value="bio"
                    className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#2f020d] data-[state=active]:shadow-sm rounded-xl py-2"
                  >
                    مفتاح Passkey
                  </TabsTrigger>
                </TabsList>

                {/* Form */}
                <form
                  data-react-form="true"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <TabsContent value="pass" className="space-y-4 m-0">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-[#2f020d]">
                        البريد الإلكتروني الإداري
                      </Label>
                      <div className="relative">
                        <Input
                          type="email"
                          dir="ltr"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@amanikhalil.sa"
                          className="pe-10 bg-[#fff8f7] border-[#d7c1c3] text-xs h-11 rounded-xl text-left font-mono"
                          required
                        />
                        <Mail className="w-4 h-4 text-[#795900] absolute start-3 top-3.5" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-[#2f020d]">
                          كلمة المرور المشفرة (6 أحرف على الأقل)
                        </Label>
                        <button
                          type="button"
                          onClick={() => setTab("otp")}
                          className="text-[11px] text-[#735c00] hover:underline cursor-pointer"
                        >
                          الدخول عبر رمز OTP؟
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          dir="ltr"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          minLength={6}
                          className="pe-10 ps-10 bg-[#fff8f7] border-[#d7c1c3] text-xs h-11 rounded-xl text-left"
                          required={tab === "pass"}
                        />
                        <KeyRound className="w-4 h-4 text-[#795900] absolute start-3 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute end-3 top-3.5 text-[#524345] hover:text-[#2f020d]"
                          aria-label="إظهار كلمة المرور"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="otp" className="space-y-4 m-0">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-[#2f020d]">
                        البريد الإلكتروني الإداري لاستلام رمز التحقق (Magic Link / OTP)
                      </Label>
                      <div className="relative">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pe-10 bg-[#fff8f7] border-[#d7c1c3] text-xs h-11 rounded-xl font-mono text-left"
                          dir="ltr"
                          required={tab === "otp"}
                        />
                        <Mail className="w-4 h-4 text-[#795900] absolute end-3 top-3.5" />
                      </div>
                      {otpSent && (
                        <div className="pt-2 space-y-1.5">
                          <Label className="text-xs font-semibold text-[#2f020d]">
                            أدخلي رمز التحقق المرسل (6 أرقام)
                          </Label>
                          <Input
                            type="text"
                            dir="ltr"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="bg-white border-[#735c00] text-center font-mono text-sm h-11 rounded-xl"
                          />
                        </div>
                      )}
                      <p className="text-[11px] text-[#524345]">
                        سيتم إرسال رمز تحقق فوري ورابط دخول مباشر عبر Supabase Auth.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="bio" className="space-y-4 m-0">
                    <div className="p-6 rounded-2xl bg-[#fff8f7] border border-[#f3dedf] text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#faee9e]/60 text-[#735c00] flex items-center justify-center mx-auto">
                        <Fingerprint className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2f020d]">
                          Apple Touch ID / Windows Hello Passkey
                        </div>
                        <div className="text-[11px] text-[#524345] mt-1">
                          مرتبط بجلسة Supabase Auth المعتمدة على هذا الجهاز.
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#524345]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded accent-[#4a1521] w-4 h-4"
                      />
                      <span>البقاء متصلاً عبر الكوكيز الآمنة (SSR Session)</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      Supabase JWT
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جارٍ المصادقة عبر Supabase Auth...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {tab === "otp"
                            ? otpSent
                              ? "تأكيد رمز OTP والدخول"
                              : "إرسال رمز التحقق عبر Supabase"
                            : authMode === "signup"
                            ? "إنشاء الحساب الإداري والدخول"
                            : "تسجيل الدخول الآمن"}
                        </span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Tabs>
            </div>

            {/* Support Footer */}
            <div className="pt-4 border-t border-[#f3dedf] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#524345]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>موثق من المركز السعودي للأعمال • #FL-9941082</span>
              </div>
              <a
                href="https://wa.me/966501284492"
                target="_blank"
                rel="noreferrer"
                className="text-[#735c00] font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>طوارئ الدخول والدعم الفني</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-xs text-[#524345] border-t border-[#f3dedf]">
        © 2025 Amani Khalil Haute Beauté Atelier • جميع الحقوق محفوظة لخبيرة التجميل أماني خليل •
        الرياض، المملكة العربية السعودية
      </footer>
    </div>
  );
}
