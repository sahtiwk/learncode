import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function UpgradeToPro() {
  return (
    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 mt-6 shadow-2xl flex flex-col items-center text-center group transition-all hover:border-zinc-800">
      <div className="bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800 mb-5 group-hover:scale-110 transition-transform duration-500">
        <Image 
            src="/game.png" 
            alt="Crown Icon" 
            width={70} 
            height={70} 
            className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        />
      </div>
      
      <h2 className="font-game text-xl text-white mb-2 tracking-tight">Upgrade to Pro</h2>
      <p className="text-zinc-500 text-[11px] leading-relaxed mb-8 px-4 font-medium uppercase tracking-[0.1em]">
        Join Pro Membership and Get All course access
      </p>
      
      <Button 
        variant="pixel" 
        className="w-full font-game py-6 text-xs tracking-[0.2em] shadow-lg shadow-yellow-500/10 active:scale-[0.98] transition-all uppercase"
      >
        Upgrade
      </Button>
    </div>
  );
}
