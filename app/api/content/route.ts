import {NextResponse} from 'next/server';
import {adminDb} from '@/lib/supabase';
export const dynamic='force-dynamic';
export async function GET(){try{const db=adminDb();const [courses,posts,settings]=await Promise.all([db.from('courses').select('*').order('sort_order'),db.from('posts').select('id,type,title,description,created_at').eq('published',true).order('created_at',{ascending:false}).limit(30),db.from('site_settings').select('key,value')]);if(courses.error||posts.error||settings.error)throw Error('Database');return NextResponse.json({courses:courses.data,posts:posts.data,settings:Object.fromEntries((settings.data||[]).map(x=>[x.key,x.value]))},{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({error:'Kontentni yuklab bo‘lmadi'},{status:503})}}
