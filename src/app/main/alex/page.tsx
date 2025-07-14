'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useState } from 'react';

export default function SimpleProfileCard() {
  const [copied, setCopied] = useState<string>('');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className='justify-center flex items-center w-[calc(100vw-140px)] h-[calc(100vh-100px)]'>
      <TooltipProvider>
        <Card className='w-full max-w-xs mx-auto text-center'>
          <CardHeader>
            <Avatar className='w-20 h-20 mx-auto'>
              <AvatarImage src='/alex.png' alt='ALEXNIAN' />
              <AvatarFallback>1IANZ</AvatarFallback>
            </Avatar>
            <h2 className='text-xl font-semibold mt-4'>ALEX NIAN</h2>
          </CardHeader>

          <CardContent className='space-y-4'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => copyToClipboard('1587005702', 'qq')}
                >
                  QQ: 1587005702
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied === 'qq' ? '复制成功！🎉' : '点击复制QQ'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => copyToClipboard('Ez4Nian', 'wechat')}
                >
                  微信: Ez4Nian
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied === 'wechat' ? '复制成功！🎉' : '点击复制微信'}
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
