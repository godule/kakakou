import React, { useState } from 'react';
import { DataContextType } from '../types';
import { Trash2, Plus, Edit3, X, MinusCircle } from 'lucide-react';

interface AdminViewProps {
  data: DataContextType;
}

type TabType = 'herbs' | 'formulas' | 'acupoints' | 'exam' | 'skills';

const AdminView: React.FC<AdminViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>('herbs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Generic form state
  const [formData, setFormData] = useState<any>({});

  // Helper to safely join arrays for display in text inputs
  const safeJoin = (arr: any[], separator: string = '\n') => Array.isArray(arr) ? arr.join(separator) : '';

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    
    if (item) {
      // Pre-process data for form friendliness
      const processed = { ...item };
      
      if (activeTab === 'herbs') {
        processed.flavor = safeJoin(item.flavor, ',');
        processed.channels = safeJoin(item.channels, ',');
        // Keep effects as array to preserve formula associations
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
      // Defaults for new item
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

    // Post-process specific fields back to data structure
    if (activeTab === 'herbs') {
      newItem.flavor = typeof formData.flavor === 'string' ? formData.flavor.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean) : [];
      newItem.channels = typeof formData.channels === 'string' ? formData.channels.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean) : [];
      // Filter out empty effects
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

    // Update State
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

  // Logic for dynamic effects list in Herbs
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
    const inputClass = "w-full border border-tcm-300 rounded-lg p-2 focus:ring-2 focus:ring-tcm-500 outline-none";
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
            
            {/* Dynamic Effects List with Formula Association */}
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
                                    placeholder="功效描述 (例如: 发汗解表)"
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
                    {(formData.effects || []).length === 0 && (
                        <p className="text-xs text-tcm-400 text-center py-2">暂无功效，请点击上方按钮添加。</p>
                    )}
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
             <div><label className={labelClass}>组成 (格式：药名:剂量，每行一个)</label><textarea rows={5} className={inputClass} value={formData.ingredients || ''} onChange={e => setFormData({...formData, ingredients: e.target.value})} placeholder="麻黄:9g&#10;桂枝:6g" /></div>
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
             <div><label className={labelClass}>分类</label><input className={inputClass} value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="例如：脉诊、推拿" /></div>
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

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-tcm-500">正在管理: {tabLabels[activeTab]}</span>
            <button 
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
                <Plus size={16} /> 新增条目
            </button>
        </div>

        {/* List */}
        <div className="bg-tcm-50 rounded-xl p-4 min-h-[400px]">
            {activeTab === 'herbs' && (
              <div className="space-y-2">
                {data.herbs.map(item => (
                  <AdminItem 
                    key={item.id} 
                    title={`${item.name} (${item.pinyin})`} 
                    subtitle={item.category} 
                    onEdit={() => openModal(item)}
                    onDelete={() => data.setHerbs(data.herbs.filter(h => h.id !== item.id))} 
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'formulas' && (
               <div className="space-y-2">
                {data.formulas.map(item => (
                  <AdminItem 
                    key={item.id} 
                    title={item.name} 
                    subtitle={item.usage} 
                    onEdit={() => openModal(item)}
                    onDelete={() => data.setFormulas(data.formulas.filter(f => f.id !== item.id))} 
                  />
                ))}
              </div>
            )}

            {activeTab === 'acupoints' && (
              <div className="space-y-2">
                {data.acupoints.map(item => (
                  <AdminItem 
                    key={item.id} 
                    title={`${item.code} - ${item.name}`} 
                    subtitle={item.location.substring(0, 50) + '...'} 
                    onEdit={() => openModal(item)}
                    onDelete={() => data.setAcupoints(data.acupoints.filter(a => a.id !== item.id))} 
                  />
                ))}
              </div>
            )}

            {activeTab === 'exam' && (
              <div className="space-y-2">
               {data.knowledgePoints.map(item => (
                 <AdminItem 
                   key={item.id} 
                   title={item.title} 
                   subtitle={item.category} 
                   onEdit={() => openModal(item)}
                   onDelete={() => data.setKnowledgePoints(data.knowledgePoints.filter(k => k.id !== item.id))} 
                 />
               ))}
             </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-2">
                {data.skills.map(item => (
                  <AdminItem 
                    key={item.id} 
                    title={item.title} 
                    subtitle={item.category} 
                    onEdit={() => openModal(item)}
                    onDelete={() => data.setSkills(data.skills.filter(s => s.id !== item.id))} 
                  />
                ))}
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
    <div>
      <div className="font-semibold text-tcm-900">{title}</div>
      <div className="text-xs text-tcm-500">{subtitle}</div>
    </div>
    <div className="flex gap-2">
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