import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { DataContextType, ViewState, Herb, Formula, Acupoint, KnowledgePoint, Skill } from './types';
import { INITIAL_HERBS, INITIAL_FORMULAS, INITIAL_ACUPOINTS, INITIAL_KNOWLEDGE, INITIAL_SKILLS } from './constants';
import FormulaModal from './components/FormulaModal';
import AdminView from './components/AdminView';
import AIChatView from './components/AIChatView';
import { Search, ChevronDown, ChevronUp, MapPin, Pill, Book, Activity, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('herbs');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local State Management (Simulating Database)
  const [herbs, setHerbs] = useState<Herb[]>(INITIAL_HERBS);
  const [formulas, setFormulas] = useState<Formula[]>(INITIAL_FORMULAS);
  const [acupoints, setAcupoints] = useState<Acupoint[]>(INITIAL_ACUPOINTS);
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>(INITIAL_KNOWLEDGE);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);

  // Reset search when view changes
  useEffect(() => {
    setSearchTerm('');
  }, [currentView]);

  // Modal State
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);

  // Helper to find formula
  const showFormula = (id?: string) => {
    if (!id) return;
    const found = formulas.find(f => f.id === id);
    if (found) setSelectedFormula(found);
  };

  // Helper to find herb name
  const getHerbName = (id: string) => herbs.find(h => h.id === id)?.name || id;
  // Helper to find formula name
  const getFormulaName = (id: string) => formulas.find(f => f.id === id)?.name || id;

  const dataContext: DataContextType = {
    herbs, formulas, acupoints, knowledgePoints, skills,
    setHerbs, setFormulas, setAcupoints, setKnowledgePoints, setSkills
  };

  // Renderers for different views
  const renderHerbs = () => {
    const filteredHerbs = herbs.filter(h => 
      h.name.includes(searchTerm) || 
      h.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.category.includes(searchTerm) ||
      h.nature.includes(searchTerm) ||
      h.effects.some(e => e.description.includes(searchTerm))
    );

    if (filteredHerbs.length === 0) {
      return <div className="text-center text-tcm-400 py-12">未找到匹配的中药</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {filteredHerbs.map(herb => (
          <div key={herb.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-tcm-100 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-tcm-900 group-hover:text-tcm-700">{herb.name}</h3>
                <p className="text-tcm-500 italic">{herb.pinyin}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${herb.nature.includes('温') || herb.nature.includes('热') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {herb.nature}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {herb.flavor.map(f => <span key={f} className="text-xs bg-tcm-50 text-tcm-600 px-2 py-1 rounded border border-tcm-200">{f}</span>)}
                <span className="text-tcm-300">|</span>
                {herb.channels.map(c => <span key={c} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">{c}</span>)}
              </div>

              <div className="bg-tcm-50 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase text-tcm-400 mb-2 tracking-wider">功效与应用</h4>
                <ul className="space-y-2">
                  {herb.effects.map((effect, idx) => (
                    <li key={idx} className="text-sm text-tcm-800 flex items-start justify-between group/item">
                      <span>• {effect.description}</span>
                      {effect.relatedFormulaId && (
                        <button 
                          onClick={() => showFormula(effect.relatedFormulaId)}
                          className="text-xs text-accent hover:underline flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2 shrink-0"
                        >
                          <Pill size={12} />
                          查看方剂
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAcupoints = () => {
    const filteredAcupoints = acupoints.filter(pt => 
      pt.name.includes(searchTerm) ||
      pt.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.location.includes(searchTerm) ||
      pt.indications.some(i => i.includes(searchTerm)) ||
      pt.functions.some(f => f.includes(searchTerm))
    );

    if (filteredAcupoints.length === 0) {
      return <div className="text-center text-tcm-400 py-12">未找到匹配的穴位</div>;
    }

    return (
      <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAcupoints.map(pt => (
                  <div key={pt.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-tcm-100 flex flex-col">
                      <div className="bg-tcm-800 p-4 text-white flex justify-between items-center">
                          <div>
                              <h3 className="text-xl font-bold">{pt.name}</h3>
                              <span className="text-tcm-300 font-mono text-sm">{pt.code}</span>
                          </div>
                          <MapPin className="opacity-50" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col gap-4">
                          <div>
                              <h4 className="text-xs font-bold text-tcm-400 uppercase tracking-wider mb-1">定位</h4>
                              <p className="text-sm text-tcm-700 leading-relaxed">{pt.location}</p>
                          </div>
                          
                          <div className="bg-tcm-50 p-3 rounded-lg border border-tcm-100">
                               <h4 className="text-xs font-bold text-tcm-400 uppercase tracking-wider mb-2">主治</h4>
                               <div className="flex flex-wrap gap-1">
                                  {pt.indications.map(i => (
                                      <span key={i} className="text-xs bg-white px-2 py-1 rounded shadow-sm text-tcm-600">{i}</span>
                                  ))}
                               </div>
                          </div>

                           <div className="mt-auto pt-4 border-t border-tcm-100">
                               <h4 className="text-xs font-bold text-tcm-400 uppercase tracking-wider mb-2">临床配伍</h4>
                               <div className="text-xs space-y-1">
                                  {pt.relatedHerbIds && pt.relatedHerbIds.length > 0 && (
                                      <div className="flex gap-2 items-center text-emerald-700">
                                          <SproutIcon size={12} />
                                          配药: {pt.relatedHerbIds.map(hid => getHerbName(hid)).join(', ')}
                                      </div>
                                  )}
                                  {pt.relatedFormulaIds && pt.relatedFormulaIds.length > 0 && (
                                      <div className="flex gap-2 items-center text-accent">
                                          <Pill size={12} />
                                          配方: {pt.relatedFormulaIds.map(fid => (
                                              <button key={fid} onClick={() => showFormula(fid)} className="hover:underline">
                                                  {getFormulaName(fid)}
                                              </button>
                                          ))}
                                      </div>
                                  )}
                               </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    );
  };

  const renderFormulas = () => {
    const filteredFormulas = formulas.filter(f => 
      f.name.includes(searchTerm) ||
      f.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.includes(searchTerm) ||
      f.functions.includes(searchTerm) ||
      f.ingredients.some(i => i.name.includes(searchTerm))
    );

    if (filteredFormulas.length === 0) {
      return (
        <div className="max-w-4xl mx-auto text-center py-12">
            <div className="text-tcm-400 mb-4">未找到匹配的方剂</div>
             <button 
                onClick={() => setCurrentView('admin')}
                className="w-full py-4 border-2 border-dashed border-tcm-300 rounded-xl text-tcm-500 hover:border-tcm-500 hover:text-tcm-700 transition-all font-medium flex justify-center items-center gap-2"
              >
                  + 添加自定义方剂
              </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fade-in max-w-4xl mx-auto">
          {filteredFormulas.map(f => (
              <div key={f.id} onClick={() => setSelectedFormula(f)} className="bg-white p-4 rounded-xl border border-tcm-200 shadow-sm hover:shadow-md cursor-pointer transition-all flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                      <div className="bg-tcm-100 p-3 rounded-full text-tcm-600 group-hover:bg-tcm-800 group-hover:text-white transition-colors">
                          <Pill size={20} />
                      </div>
                      <div>
                          <h3 className="font-bold text-lg text-tcm-900">{f.name}</h3>
                          <p className="text-xs text-tcm-500">{f.pinyin} • {f.category}</p>
                      </div>
                  </div>
                  <div className="text-right hidden sm:block">
                      <p className="text-sm text-tcm-600 max-w-md truncate">{f.functions}</p>
                  </div>
              </div>
          ))}
          <button 
            onClick={() => setCurrentView('admin')}
            className="w-full py-4 border-2 border-dashed border-tcm-300 rounded-xl text-tcm-500 hover:border-tcm-500 hover:text-tcm-700 transition-all font-medium flex justify-center items-center gap-2"
          >
              + 添加自定义方剂
          </button>
      </div>
    );
  };

  const renderExam = () => {
    const filteredKnowledge = knowledgePoints.filter(kp => 
      kp.title.includes(searchTerm) ||
      kp.content.includes(searchTerm) ||
      kp.category.includes(searchTerm)
    );

    if (filteredKnowledge.length === 0) {
      return <div className="text-center text-tcm-400 py-12">未找到匹配的考点</div>;
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-tcm-800">重点考点 & 记忆卡</h2>
              <div className="text-sm text-tcm-500">共 {filteredKnowledge.length} 个知识点</div>
          </div>

          {filteredKnowledge.map(kp => (
              <div key={kp.id} className="bg-white rounded-xl shadow-sm border border-tcm-200 overflow-hidden">
                  <details className="group">
                      <summary className="flex justify-between items-center p-5 cursor-pointer list-none bg-white hover:bg-tcm-50 transition-colors">
                          <div className="flex items-center gap-3">
                              <Book className="text-accent" size={20} />
                              <span className="font-semibold text-tcm-900 text-lg">{kp.title}</span>
                          </div>
                          <span className="transition group-open:rotate-180">
                              <ChevronDown size={20} className="text-tcm-400" />
                          </span>
                      </summary>
                      <div className="p-5 pt-0 border-t border-tcm-100 bg-paper">
                           <div className="flex gap-2 mb-3 mt-4">
                              <span className="text-xs bg-tcm-200 text-tcm-700 px-2 py-1 rounded">{kp.category}</span>
                              <span className={`text-xs px-2 py-1 rounded text-white ${kp.difficulty === 'Easy' ? 'bg-green-500' : 'bg-orange-500'}`}>{kp.difficulty === 'Easy' ? '简单' : kp.difficulty === 'Medium' ? '中等' : '困难'}</span>
                           </div>
                           <p className="text-tcm-800 leading-relaxed font-serif text-lg">{kp.content}</p>
                      </div>
                  </details>
              </div>
          ))}
      </div>
    );
  };

  const renderSkills = () => {
    const filteredSkills = skills.filter(skill => 
      skill.title.includes(searchTerm) ||
      skill.description.includes(searchTerm) ||
      skill.category.includes(searchTerm)
    );

    if (filteredSkills.length === 0) {
      return <div className="text-center text-tcm-400 py-12">未找到匹配的技能</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {filteredSkills.map(skill => (
              <div key={skill.id} className="bg-white rounded-2xl shadow-sm border border-tcm-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Activity size={100} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-tcm-900 mb-2 relative z-10">{skill.title}</h3>
                  <p className="text-sm text-tcm-500 mb-4 bg-tcm-50 inline-block px-2 py-1 rounded">{skill.category}</p>
                  
                  <p className="text-tcm-700 mb-4 italic">"{skill.description}"</p>
                  
                  <div className="space-y-3 relative z-10">
                      <h4 className="font-bold text-xs uppercase text-tcm-400 tracking-wider">操作步骤</h4>
                      {skill.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-tcm-800 text-white flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                              </div>
                              <p className="text-sm text-tcm-800 mt-0.5">{step}</p>
                          </div>
                      ))}
                  </div>
              </div>
          ))}
      </div>
    );
  };

  const getTitle = () => {
      switch(currentView) {
          case 'herbs': return '中药学资料库';
          case 'acupoints': return '经络穴位图谱';
          case 'formulas': return '方剂学宝典';
          case 'exam': return '中医重点考点';
          case 'skills': return '临床技能操作';
          case 'admin': return '后台管理系统';
          case 'ai_chat': return 'AI 灵枢助手';
          default: return '';
      }
  }

  const getSubtitle = () => {
      switch(currentView) {
          case 'herbs': return '探索四气五味、升降浮沉。';
          case 'acupoints': return '掌握穴位定位与主治功效。';
          case 'formulas': return '学习君臣佐使的组方艺术。';
          case 'exam': return '备战执业医师与期末考试。';
          case 'skills': return '精进望闻问切与推拿针灸。';
          default: return '';
      }
  }

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      
      {/* Header Area for Content */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-down">
        <div>
           <h2 className="text-3xl font-serif font-bold text-tcm-900 capitalize tracking-tight">
             {getTitle()}
           </h2>
           <p className="text-tcm-500 mt-1">
             {getSubtitle()}
           </p>
        </div>
        
        {currentView !== 'ai_chat' && currentView !== 'admin' && (
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tcm-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索数据库..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-tcm-200 bg-white focus:outline-none focus:ring-2 focus:ring-tcm-400 w-full md:w-64"
                />
             </div>
        )}
      </div>

      {/* Main Content Render */}
      {currentView === 'herbs' && renderHerbs()}
      {currentView === 'acupoints' && renderAcupoints()}
      {currentView === 'formulas' && renderFormulas()}
      {currentView === 'exam' && renderExam()}
      {currentView === 'skills' && renderSkills()}
      {currentView === 'admin' && <AdminView data={dataContext} />}
      {currentView === 'ai_chat' && <AIChatView />}

      {/* Modals */}
      <FormulaModal formula={selectedFormula} onClose={() => setSelectedFormula(null)} />
    </Layout>
  );
};

// Simple Icon component helper
const SproutIcon = ({size}: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.3-1.1-.6-2.3-1.9-3-4 1.4.2 2.5.8 3.5 1.6"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
)

export default App;