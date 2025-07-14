'use client';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/modeToggle';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Maximize, X, Minimize, Pin, PinOff } from 'lucide-react';

export default function TitleBar() {
  const [window, setWindow] = useState<any>(null);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const handleMinimize = async () => {
    if (!window) return;
    window.minimize();
  };

  const handleMaximize = async () => {
    if (!window) return;
    window.toggleMaximize();
  };

  const handleClose = async () => {
    if (!window) return;
    window.close();
  };

  const handlePin = async () => {
    if (!window) return;
    window.setAlwaysOnTop(!isPinned);
    setIsPinned(!isPinned);
  };

  useEffect(() => {
    const initWindow = async () => {
      const win = getCurrentWindow();
      setWindow(win);
      const unlisten = await win.onResized(async () => {
        setIsMaximized(await win.isMaximized());
      });

      return () => unlisten();
    };

    initWindow();
  }, []);
  return (
    <>
      <main className='fixed top-0 left-0 w-full h-16 z-50 p-4 gap-2 flex items-center'>
        <Label
          className='text-2xl font-bold cursor-grab w-full'
          data-tauri-drag-region
        >
          Hebei Finance University
        </Label>
      </main>
      <div className='flex justify-end fixed top-0 right-0 p-4 gap-2 z-50'>
        <ModeToggle />
        <Button variant='outline' size='icon' onClick={handlePin}>
          {isPinned ? <PinOff /> : <Pin />}
        </Button>
        <Button variant='outline' size='icon' onClick={handleMinimize}>
          <Minus />
        </Button>
        <Button variant='outline' size='icon' onClick={handleMaximize}>
          {isMaximized ? <Minimize /> : <Maximize />}
        </Button>
        <Button variant='outline' size='icon' onClick={handleClose}>
          <X />
        </Button>
      </div>
    </>
  );
}
