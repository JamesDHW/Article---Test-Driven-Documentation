import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('demo-auth');
  const isAuth = !!authCookie?.value;

  if (isAuth) {
    redirect('/projects');
  }
  
  redirect('/login');
}
