import React, { useState } from 'react';
import { DataContextType } from '../types';
import { RefreshCw, Eye, EyeOff, FileQuestion, CheckCircle2 } from 'lucide-react';

interface ExamModeViewProps {
  data: DataContextType;
}

interface QuizItem {
  id: string;
  type: string;
  question: string;
  answer: string;
  subInfo?: string; // e.g. Pinyin or Code
}

const ExamModeView: React.FC<ExamModeViewProps> = ({ data }) => {
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateQuiz = () => {
    const pool: QuizItem[] = [];

    // 1. Process Herbs
    data.herbs.forEach(item => {
      pool.push({
        id: `herb-${item.id}`,
        type: '中药学',
        subInfo: item.pinyin,
        question: `请简述中药【${item.name}】(${item.nature}，${item.flavor.join(',')}) 的主要功效。`,
        answer: item.effects.map(e => e.description).join('；')
      });
    });

    // 2. Process Formulas
    data.formulas.forEach(item => {
      pool.push({
        id: `formula-${item.id}`,
        type: '方剂学',
        subInfo: item.category,
        question: `请简述方剂【${item.name}】的功用与主治。`,
        answer: `功用：${item.functions}`
      });
    });

    // 3. Process Acupoints
    data.acupoints.forEach(item => {
      pool.push({
        id: `point-${item.id}`,
        type: '经络穴位',
        subInfo: item.code,
        question: `请描述穴位【${item.name}】的定位及主治。`,
        answer: `定位：${item.location}\n主治：${item.indications.join('、')}`
      });
    });

    // 4. Process Knowledge Points
    data.knowledgePoints.forEach(item => {
      pool.push({
        id: `kp-${item.id}`,
        type: '重点考点',
        subInfo: item.category,
        question: `【${item.category}】${item.title}`,
        answer: item.content
      });
    });

    // 5. Process Skills
    data.skills.forEach(item => {
      pool.push({
        id: `skill-${item.id}`,
        type: '技能操作',
        subInfo: item.category,
        question: `请简述【${item.title}】的操作步骤。`,
        answer: item.steps.join('\n')
      });
    });

    // Shuffle and pick 10
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    setQuestions(selected);
    setShowAnswers(false);
    setHasGenerated(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Control Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-tcm-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-xl font-bold font-serif text-tcm-900 flex items-center gap-2">
             <FileQuestion className="text-accent" />
             综合模拟试卷
           </h2>
           <p className="text-tcm-500 text-sm mt-1">从中药、方剂、穴位、考点及技能中随机抽取10题。</p>
        </div>
        
        <div className="flex gap-3">
           {hasGenerated && (
               <button 
                onClick={() => setShowAnswers(!showAnswers)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-all
                  ${showAnswers 
                    ? 'bg-tcm-100 text-tcm-800 border-tcm-200 hover:bg-tcm-200' 
                    : 'bg-white text-tcm-600 border-tcm-300 hover:border-tcm-500 hover:text-tcm-800'
                  }`}
               >
                 {showAnswers ? <EyeOff size={18} /> : <Eye size={18} />}
                 {showAnswers ? '隐藏答案' : '显示答案'}
               </button>
           )}

           <button 
             onClick={generateQuiz}
             className="flex items-center gap-2 bg-tcm-800 text-white px-5 py-2.5 rounded-lg hover:bg-tcm-900 transition-all shadow-md active:transform active:scale-95"
           >
             <RefreshCw size={18} />
             {hasGenerated ? '重新生成' : '生成新试卷'}
           </button>
        </div>
      </div>

      {/* Quiz Content */}
      {!hasGenerated ? (
        <div className="text-center py-20 bg-tcm-50 rounded-2xl border-2 border-dashed border-tcm-200">
           <div className="text-tcm-300 mb-4 flex justify-center">
             <FileQuestion size={64} />
           </div>
           <h3 className="text-lg font-serif text-tcm-600 mb-2">准备好开始测试了吗？</h3>
           <p className="text-tcm-400">点击右上角的“生成新试卷”按钮开始。</p>
        </div>
      ) : (
        <div className="space-y-6">
           {questions.map((q, idx) => (
             <div key={q.id} className="bg-white rounded-xl shadow-sm border border-tcm-200 overflow-hidden group">
                {/* Question Header */}
                <div className="p-5 border-b border-tcm-100 bg-paper">
                   <div className="flex justify-between items-start mb-3">
                      <span className="inline-block px-2 py-1 bg-tcm-100 text-tcm-600 text-xs font-bold rounded">
                        第 {idx + 1} 题 · {q.type}
                      </span>
                      {q.subInfo && (
                        <span className="text-xs text-tcm-400 font-mono tracking-wider uppercase">
                          {q.subInfo}
                        </span>
                      )}
                   </div>
                   <h3 className="text-lg font-medium text-tcm-900 leading-relaxed font-serif">
                     {q.question}
                   </h3>
                </div>

                {/* Answer Section */}
                {showAnswers ? (
                   <div className="p-5 bg-green-50/50 animate-fade-in text-tcm-800">
                      <div className="flex gap-2 items-start">
                         <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                         <div className="whitespace-pre-wrap font-medium leading-relaxed">
                            {q.answer}
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="p-5 bg-tcm-50/50 flex justify-center items-center cursor-pointer hover:bg-tcm-100 transition-colors" onClick={() => setShowAnswers(true)}>
                      <span className="text-sm text-tcm-400 flex items-center gap-2">
                        <Eye size={16} /> 点击显示所有答案
                      </span>
                   </div>
                )}
             </div>
           ))}

           <div className="flex justify-center pt-8 pb-12">
               <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-tcm-500 hover:text-tcm-800 text-sm underline"
               >
                 回到顶部
               </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default ExamModeView;