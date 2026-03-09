// components/Home/Stats.js
'use client';

import { Users, Calendar, Home, Trophy } from 'lucide-react';

const Stats = () => {
  const stats = [
    { 
      value: '25', 
      label: 'Housemates',
      icon: Users
    },
    { 
      value: '30', 
      label: 'Days',
      icon: Calendar
    },
    { 
      value: '1', 
      label: 'House',
      icon: Home
    },
    { 
      value: '$30K', 
      label: 'Worth of Prizes',
      icon: Trophy
    },
  ];
  
  return (
    <section className="container mx-auto px-3 md:px-4 mt-4 md:mt-6 mb-6 md:mb-8">
      <div className="flex items-center justify-center flex-nowrap gap-2 md:gap-6 overflow-x-auto py-2">
        {stats.map((stat, index) => (
          <div key={index} className="relative group flex-shrink-0">
            {/* Blurry background tab - smaller on mobile */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-white/10 backdrop-blur-md rounded-lg md:rounded-xl -m-1 md:-m-1.5 z-0 border border-white/10"></div>
            
            {/* Fraction-style layout - scaled for mobile */}
            <div className="relative z-10 flex items-center p-2 md:p-3">
              {/* Left: Number and label stacked - smaller on mobile */}
              <div className="flex flex-col justify-center mr-2 md:mr-4">
                {/* Value - reduced by half on mobile */}
                <div className="text-lg md:text-3xl font-bold text-white leading-none">
                  {stat.value}
                </div>
                
                {/* Label - much smaller on mobile */}
                <div className="text-white/60 text-[8px] md:text-xs font-medium mt-0.5 md:mt-1 uppercase tracking-wider whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
              
              {/* Right: Vertical separator line - shorter on mobile */}
              <div className="h-4 md:h-8 w-px bg-gradient-to-b from-transparent via-[#d4ff00]/40 to-transparent mr-1.5 md:mr-3"></div>
              
              {/* Icon with lemon green - smaller on mobile */}
              <div className="p-1 md:p-1.5 rounded md:rounded-lg bg-black/30 backdrop-blur-sm">
                <stat.icon className="w-3 h-3 md:w-4 md:h-4 text-[#d4ff00] drop-shadow-[0_0_4px_rgba(212,255,0,0.5)] md:drop-shadow-[0_0_8px_rgba(212,255,0,0.5)]" />
              </div>
            </div>
            
            {/* Hover glow effect - desktop only */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-[#d4ff00]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div> 
        ))}
      </div>
    </section>
  );
};

export default Stats;