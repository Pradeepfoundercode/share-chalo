import React, { useState } from 'react';
import { Tag, Car, Palette, Armchair } from 'lucide-react';
import brandTagIcon from '../../assets/vehicles/price-tag-icon.svg';
import colorIcon from '../../assets/vehicles/color-palette.svg';
import seatTypeIcon from '../../assets/vehicles/seat-type.svg';
import BrandTab from '../../components/vehicleMaster/BrandTab';
import ModelTab from '../../components/vehicleMaster/ModelTab';
import ColorTab from '../../components/vehicleMaster/ColorTab';
import SeatTypeTab from '../../components/vehicleMaster/SeatTypeTab';

export default function VehicleMaster() {
  const [activeTab, setActiveTab] = useState('Brand');

  // Tab definitions
  const tabs = [
    { name: 'Brand', image: brandTagIcon, icon: Tag },
    { name: 'Model', icon: Car },
    { name: 'Color', image: colorIcon, icon: Palette },
    // { name: 'Seat Type', image: seatTypeIcon, icon: Armchair },
  ];

  return (
    <div className="space-y-3.5 select-none pb-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#fed011] text-black shadow-amber-300/40'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {tab.image ? (
                <img
                  src={tab.image}
                  alt={tab.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                />
              ) : (
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] shrink-0" />
              )}
              <span className="text-[13px] sm:text-[15px] truncate">{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'Brand' && <BrandTab />}
        {activeTab === 'Model' && <ModelTab />}
        {activeTab === 'Color' && <ColorTab />}
        {/* {activeTab === 'Seat Type' && <SeatTypeTab />} */}
      </div>
    </div>
  );
}
