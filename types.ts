// Data Models

export interface Ingredient {
  name: string;
  dosage: string;
}

export interface Formula {
  id: string;
  name: string;
  pinyin: string;
  ingredients: Ingredient[];
  usage: string;
  functions: string;
  category: string;
}

export interface HerbEffect {
  description: string;
  relatedFormulaId?: string; // Link to a formula ID
}

export interface Herb {
  id: string;
  name: string;
  pinyin: string;
  nature: string; // e.g., Warm, Cold
  flavor: string[]; // e.g., Sweet, Pungent
  channels: string[]; // e.g., Lung, Bladder
  effects: HerbEffect[];
  category: string;
}

export interface Acupoint {
  id: string;
  name: string;
  code: string; // e.g., LU7
  location: string;
  functions: string[];
  indications: string[];
  relatedHerbIds?: string[];
  relatedFormulaIds?: string[];
}

export interface KnowledgePoint {
  id: string;
  title: string;
  category: string;
  content: string; // The answer/explanation
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Skill {
  id: string;
  title: string; // e.g., Pulse Diagnosis - Slippery Pulse
  category: string;
  description: string;
  steps: string[];
}

// UI State Types
export type ViewState = 'herbs' | 'acupoints' | 'formulas' | 'exam' | 'skills' | 'admin' | 'quiz';

export interface DataContextType {
  herbs: Herb[];
  formulas: Formula[];
  acupoints: Acupoint[];
  knowledgePoints: KnowledgePoint[];
  skills: Skill[];
  setHerbs: (data: Herb[]) => void;
  setFormulas: (data: Formula[]) => void;
  setAcupoints: (data: Acupoint[]) => void;
  setKnowledgePoints: (data: KnowledgePoint[]) => void;
  setSkills: (data: Skill[]) => void;
}