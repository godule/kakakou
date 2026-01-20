import React, { useState, useEffect, useMemo } from 'react';
import { DataContextType } from '../types';
import { Trash2, Plus, Edit3, X, MinusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminViewProps {
  data: DataContextType;
}

type TabType = 'herbs' | 'formulas' | 'acupoints' | 'exam' | 'skills';

const ITEMS_PER_PAGE = 5;

const AdminView: React.FC<AdminViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>('herbs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Search and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset search and pagination when switching tabs
  useEffect(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, [activeTab]);

  // Helper to safely join arrays for display in text inputs
  const safeJoin = (arr: any[], separator: string = '\n') => Array.isArray(arr) ? arr.join(separator) : '';

  // --- Filtering & Pagination Logic ---

  const getSourceData = () => {
    switch (activeTab) {
      case 'herbs': return data.herbs;
      case 'formulas': return data.formulas;
      case 'acupoints': return data.acupoints;
      case 'exam': return data.knowledgePoints;
      case 'skills': return data.skills;
      default: return [];
    }
  };

  const filteredData = useMemo(() => {
    const source = getSourceData();
    const lowerTerm = searchTerm.toLowerCase().trim();

    if (!lowerTerm) return source;

    return source.filter((item: any) => {
      // Search logic based on tab type
      switch (activeTab) {
        case 'herbs':
          return (
            item.name.includes(lowerTerm) || 
            item.pinyin.toLowerCase().includes(lowerTerm) ||
            item.category.includes(lowerTerm) ||
            item.nature.includes(lowerTerm)
          );
        case 'formulas':
          return (
            item.name.includes(lowerTerm) ||
            item.pinyin.toLowerCase().includes(lowerTerm) ||
            item.category.includes(lowerTerm) ||
            item.functions.includes(lowerTerm)
          );
        case 'acupoints':
          return (
            item.name.includes(lowerTerm) ||
            item.code.toLowerCase().includes(lowerTerm) ||
            item.location.includes(lowerTerm)
          );
        case 'exam':
          return (
            item.title.includes(lowerTerm) ||
            item.category.includes(lowerTerm) ||
            item.content.includes(lowerTerm)
          );
        case 'skills':
          return (
            item.title.includes(lowerTerm) ||
            item.category.includes(lowerTerm) ||
            item.description.includes(lowerTerm)
          );
        default:
          return false;
      }
    });
  }, [activeTab, searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page if filtering reduces pages below current page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);


  // --- Modal & Form Logic ---

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    
    if (item) {
      const processed = { ...item };
      
      if (activeTab === 'herbs') {
        processed.flavor = safeJoin(item.flavor, ',');
        processed.channels = safeJoin(item.channels, ',');
        processed.effects = item.effects ? item.effects.map((e: any) => ({...e})) : [];
      } else if (activeTab === 'formulas') {
        processed.ingredients = item.ingredients ? item.ingredients.map((i: any) => `${i.name}:${i.dosage}`).join('\n') : '';
      } else if (activeTab === 'acupoints') {
        processed.functions = safeJoin(item.functions);
        processed.indications = safeJoin(item.indications);
      } else if (activeTab === 'skills') {
        processed.steps = safeJoin(item.steps);
      }
      setFormData(processed);
    } else {
      if (activeTab === 'herbs') {
        setFormData({ effects: [], flavor: '', channels: '' });
      } else {
        setFormData({});
      }
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const id = editingItem ? editingItem.id : Date.now().toString();
    const newItem = { ...formData, id };

    if (activeTab === 'herbs') {
      newItem.flavor = typeof formData.flavor === 'string' ? formData.flavor.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean) : [];
      newItem.channels = typeof formData.channels === 'string' ? formData.channels.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean) : [];
      newItem.effects = Array.isArray(formData.effects) 
        ? formData.effects.filter((e: any) => e.description && e.description.trim() !== '')
        : [];
    } else if (activeTab === 'formulas') {
      newItem.ingredients = typeof formData.ingredients === 'string'
        ? formData.ingredients.split('\n').filter(Boolean).map((line: string) => {
            const parts = line.split(/[:：]/);
            return { name: parts[0]?.trim(), dosage: parts[1]?.trim() || '' };
          })
        : [];
    } else if (activeTab === 'acupoints') {
      newItem.functions = typeof formData.functions === 'string' ? formData.functions.split('\n').filter(Boolean) : [];
      newItem.indications = typeof formData.indications === 'string' ? formData.indications.split('\n').filter(Boolean) : [];
    } else if (activeTab === 'skills') {
      newItem.steps = typeof formData.steps === 'string' ? formData.steps.split('\n').filter(Boolean) : [];
    }

    const updateList = (list: any[], setList: (l: any[]) => void) => {
        const updated = editingItem 
          ? list.map(i => i.id === id ? newItem : i) 
          : [...list, newItem];
        setList(updated);
    };

    switch (activeTab) {
      case 'herbs': updateList(data.herbs, data.setHerbs); break;
      case 'formulas': updateList(data.formulas, data.setFormulas); break;
      case 'acupoints': updateList(data.acupoints, data.setAcupoints); break;
      case 'exam': updateList(data.knowledgePoints, data.setKnowledgePoints); break;
      case 'skills': updateList(data.skills, data.setSkills); break;
    }
    
    setIsModalOpen(false);
  };

  const addEffect = () => {
    const currentEffects = formData.effects || [];
    setFormData({ ...formData, effects: [...currentEffects, { description: '', relatedFormulaId: '' }] });
  };

  const removeEffect = (index: number) => {
    const currentEffects = [...(formData.effects || [])];
    currentEffects.splice(index, 1);
    setFormData({ ...formData, effects: currentEffects });
  };

  const updateEffect = (index: number, field: string, value: string) => {
    const currentEffects = [...(formData.effects || [])];
    currentEffects[index] = { ...currentEffects[index], [field]: value };
    setFormData({ ...formData, effects: currentEffects });
  };

  const renderFormContent = () => {
    // UPDATED: Added bg-white and text-tcm-900 to ensure visibility
    const inputClass = "w-full border border-tcm-300 rounded-lg p-2 focus:ring-2 focus:ring-tcm-500 outline-none bg-white text-tcm-900";
    const labelClass = "block text-sm font-medium text-tcm-700 mb-1";

    switch (activeTab) {
      case 'herbs':
        return (
          <>
            <div><label className={labelClass}>中药名称</label><input className={inputClass} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如：麻黄" /></div>
            <div><label className={labelClass}>拼音</label><input className={inputClass} value={formData.pinyin || ''} onChange={e => setFormData({...formData, pinyin: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
               <div><label className={labelClass}>四气</label><input className={inputClass} value={formData.nature || ''} onChange={e => setFormData({...formData, nature: e.target.value})} placeholder="例如：温" /></div>
               <div><label className={labelClass}>分类</label><input className={inputClass} value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="例如：解表药" /></div>
            </div>
            <div><label className={labelClass}>五味 (用逗号分隔)</label><input className={inputClass} value={formData.flavor || ''} onChange={e => setFormData({...formData, flavor: e.target.value})} placeholder="例如：辛, 微苦" /></div>
            <div><label className={labelClass}>归经 (用逗号分隔)</label><input className={inputClass} value={formData.channels || ''} onChange={e => setFormData({...formData, channels: e.target.value})} placeholder="例如：肺, 膀胱" /></div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className={labelClass}>功效与关联方剂</label>
                    <button onClick={addEffect} className="text-xs bg-tcm-100 hover:bg-tcm-200 text-tcm-700 px-2 py-1 rounded flex items-center gap-1">
                        <Plus size={12} /> 添加功效
                    </button>
                </div>
                <div className="space-y-2 bg-tcm-50 p-3 rounded-lg border border-tcm-200">
                    {(formData.effects || []).map((effect: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <input 
                                    className={`${inputClass} text-sm mb-1`} 
                                    value={effect.description} 
                                    onChange={e => updateEffect(idx, 'description', e.target.value)}
                                    placeholder="功效描述"
                                />
                                <select 
                                    className={`${inputClass} text-sm bg-white`}
                                    value={effect.relatedFormulaId || ''}
                                    onChange={e => updateEffect(idx, 'relatedFormulaId', e.target.value)}
                                >
                                    <option value="">-- 选择关联方剂 (可选) --</option>
                                    {data.formulas.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={() => removeEffect(idx)} className="text-red-400 hover:text-red-600 mt-2">
                                <MinusCircle size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </>
        );
      case 'formulas':
        return (
          <>
             <div><label className={labelClass}>方剂名称</label><input className={inputClass} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
             <div><label className={labelClass}>拼音</label><input className={inputClass} value={formData.pinyin || ''} onChange={e => setFormData({...formData, pinyin: e.target.value})} /></div>
             <div><label className={labelClass}>分类</label><input className={inputClass} value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
             <div><label className={labelClass}>组成 (格式：药名:剂量)</label><textarea rows={5} className={inputClass} value={formData.ingredients || ''} onChange={e => setFormData({...formData, ingredients: e.target.value})} placeholder="麻黄:9g&#10;桂枝:6g" /></div>
             <div><label className={labelClass}>用法</label><input className={inputClass} value={formData.usage || ''} onChange={e => setFormData({...formData, usage: e.target.value})} /></div>
             <div><label className={labelClass}>功用</label><input className={inputClass} value={formData.functions || ''} onChange={e => setFormData({...formData, functions: e.target.value})} /></div>
          </>
        );
      case 'acupoints':
        return (
          <>
            <div><label className={labelClass}>穴位名称</label><input className={inputClass} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div><label className={labelClass}>代码</label><input className={inputClass} value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="例如：LU7" /></div>
            <div><label className={labelClass}>定位</label><textarea rows={3} className={inputClass} value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <div><label className={labelClass}>功效 (每行一条)</label><textarea rows={3} className={inputClass} value={formData.functions || ''} onChange={e => setFormData({...formData, functions: e.target.value})} /></div>
            <div><label className={labelClass}>主治 (每行一条)</label><textarea rows={3} className={inputClass} value={formData.indications || ''} onChange={e => setFormData({...formData, indications: e.target.value})} /></div>
          </>
        );
      case 'exam':
        return (
          <>
            <div><label className={labelClass}>题目/标题</label><input className={inputClass} value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>分类</label><input className={inputClass} value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
              <div>
                <label className={labelClass}>难度</label>
                <select className={inputClass} value={formData.difficulty || 'Easy'} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                  <option value="Easy">简单</option>
                  <option value="Medium">中等</option>
                  <option value="Hard">困难</option>
                </select>
              </div>
            </div>
            <div><label className={labelClass}>答案/解析</label><textarea rows={6} className={inputClass} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
          </>
        );
      case 'skills':
        return (
          <>
             <div><label className={labelClass}>技能名称</label><input className={inputClass} value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
             <div><label className={labelClass}>分类</label><input className={inputClass} value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="例如：脉诊" /></div>
             <div><label className={labelClass}>简述</label><input className={inputClass} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
             <div><label className={labelClass}>操作步骤 (每行一步)</label><textarea rows={6} className={inputClass} value={formData.steps || ''} onChange={e => setFormData({...formData, steps: e.target.value})} /></div>
          </>
        );
      default: return null;
    }
  };

  const tabLabels: Record<TabType, string> = {
    herbs: '中药管理',
    formulas: '方剂管理',
    acupoints: '穴位管理',
    exam: '考点管理',
    skills: '技能管理'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-tcm-200 p-6">
        <h2 className="text-2xl font-serif font-bold text-tcm-900 mb-6">后台内容管理</h2>
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-tcm-100">
          {(Object.keys(tabLabels) as TabType[]).map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab ? 'bg-tcm-800 text-white' : 'bg-tcm-100 text-tcm-600 hover:bg-tcm-200'}
                `}
             >
               {tabLabels[tab]}
             </button>
          ))}
        </div>

        {/* Action Bar with Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tcm-400" size={18} />
                <input 
                    type="text" 
                    placeholder={`搜索${tabLabels[activeTab]}...`}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on search
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-tcm-200 bg-tcm-50 focus:outline-none focus:ring-2 focus:ring-tcm-400"
                />
            </div>

            <button 
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
            >
                <Plus size={16} /> 新增条目
            </button>
        </div>

        {/* Data Stats */}
        <div className="text-xs text-tcm-500 mb-2 flex justify-between">
           <span>共找到 {filteredData.length} 条数据</span>
           <span>页码: {currentPage} / {totalPages || 1}</span>
        </div>

        {/* List Content with Pagination Logic */}
        <div className="bg-tcm-50 rounded-xl p-4 min-h-[400px] flex flex-col">
            <div className="flex-1 space-y-2">
                {paginatedData.length === 0 ? (
                    <div className="text-center text-tcm-400 py-10">未找到相关数据</div>
                ) : (
                    <>
                        {activeTab === 'herbs' && paginatedData.map((item: any) => (
                            <AdminItem 
                                key={item.id} 
                                title={`${item.name} (${item.pinyin})`} 
                                subtitle={item.category} 
                                onEdit={() => openModal(item)}
                                onDelete={() => data.setHerbs(data.herbs.filter(h => h.id !== item.id))} 
                            />
                        ))}
                        
                        {activeTab === 'formulas' && paginatedData.map((item: any) => (
                            <AdminItem 
                                key={item.id} 
                                title={item.name} 
                                subtitle={item.usage} 
                                onEdit={() => openModal(item)}
                                onDelete={() => data.setFormulas(data.formulas.filter(f => f.id !== item.id))} 
                            />
                        ))}

                        {activeTab === 'acupoints' && paginatedData.map((item: any) => (
                            <AdminItem 
                                key={item.id} 
                                title={`${item.code} - ${item.name}`} 
                                subtitle={item.location.substring(0, 50) + '...'} 
                                onEdit={() => openModal(item)}
                                onDelete={() => data.setAcupoints(data.acupoints.filter(a => a.id !== item.id))} 
                            />
                        ))}

                        {activeTab === 'exam' && paginatedData.map((item: any) => (
                            <AdminItem 
                                key={item.id} 
                                title={item.title} 
                                subtitle={item.category} 
                                onEdit={() => openModal(item)}
                                onDelete={() => data.setKnowledgePoints(data.knowledgePoints.filter(k => k.id !== item.id))} 
                            />
                        ))}

                        {activeTab === 'skills' && paginatedData.map((item: any) => (
                            <AdminItem 
                                key={item.id} 
                                title={item.title} 
                                subtitle={item.category} 
                                onEdit={() => openModal(item)}
                                onDelete={() => data.setSkills(data.skills.filter(s => s.id !== item.id))} 
                            />
                        ))}
                    </>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-tcm-200">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-tcm-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-sm font-medium text-tcm-700">
                        {currentPage} <span className="text-tcm-400">/</span> {totalPages}
                    </div>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-tcm-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 text-sm">
        <strong>提示:</strong> 当前为演示模式，数据存储在本地内存中，刷新页面后会重置。
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-tcm-800 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingItem ? '编辑条目' : '新增条目'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {renderFormContent()}
            </div>

            <div className="p-4 border-t border-tcm-200 bg-tcm-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-tcm-600 hover:bg-tcm-200 rounded-lg">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-tcm-800 text-white rounded-lg hover:bg-tcm-900">保存</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const AdminItem: React.FC<{ title: string; subtitle: string; onEdit: () => void; onDelete: () => void }> = ({ title, subtitle, onEdit, onDelete }) => (
  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-tcm-200 hover:shadow-md transition-shadow">
    <div className="flex-1 min-w-0 mr-4">
      <div className="font-semibold text-tcm-900 truncate">{title}</div>
      <div className="text-xs text-tcm-500 truncate">{subtitle}</div>
    </div>
    <div className="flex gap-2 shrink-0">
        <button onClick={onEdit} className="text-tcm-400 hover:text-tcm-800 p-2">
            <Edit3 size={16} />
        </button>
        <button onClick={onDelete} className="text-red-400 hover:text-red-600 p-2">
            <Trash2 size={16} />
        </button>
    </div>
  </div>
);

export default AdminView;