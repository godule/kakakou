import React from 'react';
import { Formula } from '../types';
import { X, Beaker } from 'lucide-react';

interface FormulaModalProps {
  formula: Formula | null;
  onClose: () => void;
}

const FormulaModal: React.FC<FormulaModalProps> = ({ formula, onClose }) => {
  if (!formula) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-paper w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-tcm-200">
        <div className="bg-tcm-800 text-white p-4 flex justify-between items-center relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -right-4 -top-4 opacity-10">
                <Beaker size={100} />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold tracking-wide">{formula.name}</h3>
              <p className="text-tcm-300 text-sm italic">{formula.pinyin}</p>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors z-10">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Ingredients */}
            <div>
                <h4 className="text-tcm-800 font-bold uppercase text-xs tracking-wider mb-2 border-b border-tcm-200 pb-1">组成</h4>
                <div className="grid grid-cols-2 gap-2">
                    {formula.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex justify-between bg-tcm-50 px-3 py-2 rounded-lg border border-tcm-100">
                            <span className="font-medium text-tcm-900">{ing.name}</span>
                            <span className="text-tcm-600 font-mono text-sm">{ing.dosage}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Usage */}
            <div>
                <h4 className="text-tcm-800 font-bold uppercase text-xs tracking-wider mb-2 border-b border-tcm-200 pb-1">用法</h4>
                <p className="text-tcm-700 text-sm leading-relaxed">{formula.usage}</p>
            </div>

            {/* Functions */}
            <div>
                <h4 className="text-tcm-800 font-bold uppercase text-xs tracking-wider mb-2 border-b border-tcm-200 pb-1">功用</h4>
                <p className="text-tcm-700 text-sm leading-relaxed">{formula.functions}</p>
            </div>
        </div>

        <div className="bg-tcm-50 p-3 text-center border-t border-tcm-200">
             <span className="inline-block px-3 py-1 text-xs font-semibold text-tcm-600 bg-tcm-200 rounded-full">
                {formula.category}
             </span>
        </div>
      </div>
    </div>
  );
};

export default FormulaModal;