import type {Metadata} from 'next';import './globals.css';import Header from '@/components/Header';import Footer from '@/components/Footer';
export const metadata:Metadata={title:'DreamDrive School — Avtomaktab',description:'DreamDrive School avtomaktabi. Haydovchilik kurslariga onlayn ro‘yxatdan o‘ting.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="uz"><body className="font-sans"><Header/><main className="min-h-[70vh]">{children}</main><Footer/></body></html>}
