'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { UserIcon, GlobeLock, LockKeyholeIcon } from 'lucide-react';
export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [vpnPassword, setVpnPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(true);
  const [vpn, setVpn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const checkCookieAndState = async () => {
      const ok = await invoke<boolean>('check_cookie_and_state');
      if (ok) {
        router.push('/main/info');
        toast('已自动登录');
      } else {
        setUsername(localStorage.getItem('Username') || '');
        setPassword(localStorage.getItem('Password') || '');
        setVpnPassword(localStorage.getItem('VpnPassword') || '');
      }
    };
    checkCookieAndState();
  }, []);

  const handleRememberChange = (checked: boolean) => {
    if (checked) {
      localStorage.setItem('Username', username);
      localStorage.setItem('Password', password);
      localStorage.setItem('VpnPassword', vpnPassword);
    } else {
      localStorage.removeItem('Username');
      localStorage.removeItem('Password');
      localStorage.removeItem('VpnPassword');
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    let text;
    if (vpn) {
      text = await invoke<string>('manual_login', {
        username,
        vpnPassword: vpnPassword,
        oaPassword: password,
      });
    } else {
      text = await invoke<string>('manual_login', {
        username,
        vpnPassword: password,
        oaPassword: password,
      });
    }
    console.log(text);
    if (text === '登录成功') {
      if (remember) {
        handleRememberChange(true);
      }
      router.push('/main/info');
    }
    toast(text);
    setLoading(false);
  };
  return (
    <Card className='w-full max-w-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <CardHeader>
        <CardTitle>Login to HBFU Plus</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2 '>
              <Label htmlFor='student-id'>
                <UserIcon />
                Student ID
              </Label>
              <Input
                id='student-id'
                type='text'
                placeholder='Student ID'
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {vpn && (
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='vpn-password'>
                    <GlobeLock />
                    VPN Password
                  </Label>
                </div>
                <Input
                  id='vpn-password'
                  type='password'
                  placeholder='VPN Password'
                  required
                  value={vpnPassword}
                  onChange={(e) => setVpnPassword(e.target.value)}
                />
              </div>
            )}
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>
                  <LockKeyholeIcon />
                  Password
                </Label>
              </div>
              <Input
                id='password'
                type='password'
                placeholder='Password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <div className='flex flex-row gap-2 items-center justify-between ml-6 mr-6'>
        <div className='flex items-start gap-3'>
          <Checkbox
            id='remember'
            defaultChecked={remember}
            onCheckedChange={() => setRemember(!remember)}
          />
          <Label htmlFor='remember'>记住密码</Label>
        </div>
        <div className='flex items-start gap-3'>
          <Checkbox
            id='vpn'
            defaultChecked={vpn}
            onCheckedChange={() => setVpn(!vpn)}
          />
          <Label htmlFor='vpn'>VPN与教务系统密码不一致</Label>
        </div>
      </div>
      <CardFooter className='flex-row gap-2'>
        <Button
          type='button'
          className='w-full'
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </Button>
      </CardFooter>
    </Card>
  );
}
