import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tools as toolsData } from '../utils/pricingData';
import { auditEngine } from '../utils/auditEngine';

export default function Audit() {
  const navigate = useNavigate();
  
  const [globalState, setGlobalState] = useState(() => {
    const saved = localStorage.getItem('spendlens_global');
    return saved ? JSON.parse(saved) : { teamSize: 1, useCase: 'mixed' };
  });

  const [selectedTools, setSelectedTools] = useState(() => {
    const saved = localStorage.getItem('spendlens_tools');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('spendlens_global', JSON.stringify(globalState));
  }, [globalState]);

  useEffect(() => {
    localStorage.setItem('spendlens_tools', JSON.stringify(selectedTools));
  }, [selectedTools]);

  const addTool = (toolId) => {
    if (selectedTools.find(t => t.toolId === toolId)) return;
    const toolConf = toolsData[toolId];
    const defaultPlan = toolConf.plans[0];
    setSelectedTools([...selectedTools, {
      id: Math.random().toString(36).substr(2, 9),
      toolId,
      planId: defaultPlan.id,
      spend: defaultPlan.defaultPrice,
      seats: globalState.teamSize
    }]);
  };

  const removeTool = (id) => {
    setSelectedTools(selectedTools.filter(t => t.id !== id));
  };

  const updateTool = (id, field, value) => {
    setSelectedTools(selectedTools.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        if (field === 'planId') {
          const plan = toolsData[t.toolId].plans.find(p => p.id === value);
          updated.spend = plan.defaultPrice * updated.seats;
        }
        if (field === 'seats') {
          const plan = toolsData[t.toolId].plans.find(p => p.id === t.planId);
          updated.spend = plan.defaultPrice * value;
        }
        return updated;
      }
      return t;
    }));
  };

  const runAudit = async () => {
    const payload = {
      teamSize: globalState.teamSize,
      useCase: globalState.useCase,
      tools: selectedTools
    };
    const results = auditEngine(payload);
    
    // Save to DB and get a unique ID
    try {
      const res = await fetch('http://localhost:5000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditData: results })
      });
      if (res.ok) {
        const { publicId } = await res.json();
        navigate(`/r/${publicId}`);
      } else {
        // Fallback for demo if backend fails
        localStorage.setItem('spendlens_results', JSON.stringify(results));
        navigate('/r/draft');
      }
    } catch (err) {
      localStorage.setItem('spendlens_results', JSON.stringify(results));
      navigate('/r/draft');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 perspective-1000 transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold mb-2 text-slate-950 dark:text-white">Configure Your Stack</h1>
          <p className="text-slate-700 dark:text-slate-400">Tell us what you use. We'll find the waste.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <AnimatePresence>
              {selectedTools.map((t, idx) => {
                const toolDef = toolsData[t.toolId];
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel p-6 rounded-2xl transform-gpu"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{toolDef.name}</h3>
                      <button onClick={() => removeTool(t.id)} className="text-red-400 hover:text-red-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Plan</label>
                        <select 
                          value={t.planId} 
                          onChange={(e) => updateTool(t.id, 'planId', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                        >
                          {toolDef.plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Seats</label>
                        <input 
                          type="number" min="1" 
                          value={t.seats}
                          onChange={(e) => updateTool(t.id, 'seats', Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Spend ($/mo)</label>
                        <input 
                          type="number" min="0" 
                          value={t.spend}
                          onChange={(e) => updateTool(t.id, 'spend', Number(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-950 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none font-mono"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {selectedTools.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-12 border border-dashed border-slate-700 rounded-2xl bg-slate-900/50"
              >
                <p className="text-slate-500">No tools added yet. Select from the right to begin.</p>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Global Context</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Team Size</label>
                  <input 
                    type="number" min="1" 
                    value={globalState.teamSize}
                    onChange={(e) => setGlobalState({...globalState, teamSize: Number(e.target.value)})}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:border-blue-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Primary Use Case</label>
                  <select 
                    value={globalState.useCase}
                    onChange={(e) => setGlobalState({...globalState, useCase: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 transition-all outline-none"
                  >
                    <option value="coding">Coding</option>
                    <option value="writing">Writing</option>
                    <option value="data">Data Analysis</option>
                    <option value="research">Research</option>
                    <option value="mixed">Mixed / General</option>
                  </select>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Add Tools</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(toolsData).map(([key, def]) => (
                  <button
                    key={key}
                    onClick={() => addTool(key)}
                    disabled={selectedTools.some(t => t.toolId === key)}
                    className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors border border-slate-300 dark:border-slate-700 font-medium"
                  >
                    + {def.name}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, translateZ: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={runAudit}
              disabled={selectedTools.length === 0}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all preserve-3d"
            >
              Run AI Audit
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
