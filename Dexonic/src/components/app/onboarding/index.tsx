// 'use client';
// import { Icons } from '@/components/common/icons';
// import { Images } from '@/components/common/images';
// import { Button } from '@/components/ui/button';
// import { useTelegram } from '@/contexts/telegram';
// import { useRouter } from 'next/navigation';
// import { isNil } from 'lodash';

// export default function OnboardingPage() {
//     const { login } = useTelegram();
//     const router = useRouter();

//     const handleLogin = async () => {
//         if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
//             const user = window.Telegram.WebApp.initDataUnsafe.user?.id ?? 0;
//             if (isNil(user)) {
//                 return;
//             }
//             await login(user);
//             router.push('/');
//         }
//     };

//     return (
//         <>
//             <div className="relative min-h-screen overflow-visible !bg-[#F4F5FB]">
//                 <div className="onboarding-background fixed inset-0 flex h-full w-full items-center justify-center" />
//                 <div className="inset-0 flex items-center justify-center">
//                     <Images.onboardingFigure className="fixed top-10" />
//                 </div>
//                 <div className="fixed bottom-0 left-0 right-0 p-4">
//                     <Images.dexonicLogo />
//                     <p className="mt-4 text-left text-lg text-gray-700">
//                         Empower traders worldwide with AI-driven insight for more informed trading
//                         decisions
//                     </p>
//                     <div className="mt-auto flex w-full justify-end bg-transparent">
//                         <Button
//                             className="h-14 w-14 rounded-full"
//                             size="icon"
//                             onClick={handleLogin}
//                         >
//                             <Icons.chevronRight className="h-8 w-8" />
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
