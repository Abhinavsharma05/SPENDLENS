import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tools as toolsData } from '../utils/pricingData';

// Client-side intelligent summary generator
const generateClientSummary = (results) => {
  const { totalMonthlySavings, totalAnnualSavings, toolResults, originalData } = results;
  const teamSize = originalData?.teamSize || 1;
  const useCase = originalData?.useCase || 'mixed';
  const totalCurrentSpend = toolResults.reduce((sum, t) => sum + Number(t.spend), 0);

  // Find the tool with the highest potential savings
  const sortedByWaste = [...toolResults].sort((a, b) => (b.result?.savings || 0) - (a.result?.savings || 0));
  const biggestWaste = sortedByWaste[0];
  const biggestWasteName = biggestWaste ? (toolsData[biggestWaste.toolId]?.name || biggestWaste.toolId) : null;
  const biggestWasteSavings = biggestWaste?.result?.savings || 0;

  // Check for redundancy
  const chatTools = toolResults.filter(t => ['chatgpt', 'claude', 'gemini'].includes(t.toolId));
  const codingTools = toolResults.filter(t => ['cursor', 'github_copilot'].includes(t.toolId));
  const hasRedundantChat = chatTools.length > 1;
  const hasRedundantCoding = codingTools.length > 1;

  let summary = '';

  if (totalMonthlySavings <= 0 && toolResults.length > 0) {
    summary = `Your ${teamSize}-person team's AI stack of ${toolResults.length} tool${toolResults.length > 1 ? 's' : ''} totaling $${totalCurrentSpend}/mo is well-optimized for ${useCase} workflows. No immediate cost reductions are recommended. Consider revisiting in 3 months as AI pricing evolves rapidly.`;
  } else {
    // Opening
    summary = `Your ${teamSize}-person team spends $${totalCurrentSpend.toLocaleString()}/mo across ${toolResults.length} AI tool${toolResults.length > 1 ? 's' : ''}. `;

    // Biggest opportunity
    if (biggestWasteName && biggestWasteSavings > 0) {
      summary += `The biggest optimization opportunity is ${biggestWasteName}, where ${biggestWaste.result?.recommendedAction?.toLowerCase() || 'plan adjustment'} could save $${Math.round(biggestWasteSavings)}/mo. `;
    }

    // Redundancy insight
    if (hasRedundantChat) {
      const chatNames = chatTools.map(t => toolsData[t.toolId]?.name).join(' and ');
      summary += `You're running ${chatNames} simultaneously—consolidating to one could eliminate redundant subscriptions. `;
    }
    if (hasRedundantCoding) {
      const codeNames = codingTools.map(t => toolsData[t.toolId]?.name).join(' and ');
      summary += `Both ${codeNames} are active; most teams see no benefit from dual coding assistants. `;
    }

    // Closing
    summary += `Total recoverable savings: $${Math.round(totalMonthlySavings).toLocaleString()}/mo ($${Math.round(totalAnnualSavings).toLocaleString()}/yr).`;
  }

  return summary;
};

export default function Result() {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [aiSummary, setAiSummary] = useState("Generating AI insights...");
  const [email, setEmail] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);

  useEffect(() => {
    // For MVP, we're loading from localStorage. In production this fetches from backend via `id`
    const saved = localStorage.getItem('spendlens_results');
    if (saved) {
      const parsed = JSON.parse(saved);
      setResults(parsed);
      fetchSummary(parsed);
    }
  }, [id]);

  const fetchSummary = async (data) => {
    // Generate a smart client-side summary immediately
    const clientSummary = generateClientSummary(data);
    setAiSummary(clientSummary);

    // Then try to get an even better AI-powered summary from the backend
    try {
      const res = await fetch('http://localhost:5000/api/audit/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditData: data })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.summary && json.summary.length > 50) {
          setAiSummary(json.summary);
        }
      }
    } catch (err) {
      // Client-side summary already set, no action needed
    }
  };

  const handleCapture = (e) => {
    e.preventDefault();
    setLeadCaptured(true);
    // Submit to /api/leads
    fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, results })
    }).catch(() => {});
  };

  if (!results) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Audit Data...</div>;

  const { totalMonthlySavings, totalAnnualSavings, toolResults } = results;
  const isHighSavings = totalMonthlySavings > 500;
  const isOptimal = totalMonthlySavings < 100;

  return (
    <main className="min-h-screen bg-slate-950 p-6 perspective-1000">
      <div className="max-w-5xl mx-auto py-12">
        
        <Link to="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-block">&larr; Back to Home</Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 30, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl text-slate-400 mb-4 tracking-tight">Your Potential Savings</h1>
          <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 drop-shadow-2xl">
            ${totalAnnualSavings.toLocaleString()}
            <span className="text-2xl text-emerald-500/50 block mt-2">/ year</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <h2 className="text-2xl font-bold text-white mb-4">AI Executive Summary</h2>
              <p className="text-slate-300 leading-relaxed text-lg">{aiSummary}</p>
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mt-8 mb-4">Tool Breakdown</h2>
              {toolResults.map((t, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  key={t.id} 
                  className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-slate-900/50 px-4 py-2 rounded-bl-xl text-emerald-400 font-mono font-bold">
                    Save ${Math.round(t.result.savings)}/mo
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{toolsData[t.toolId].name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-slate-500">Current Spend:</span>
                      <span className="ml-2 text-white font-mono">${t.spend}/mo</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Seats:</span>
                      <span className="ml-2 text-white font-mono">{t.seats}</span>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4">
                    <div className="font-bold text-blue-300 mb-1">Recommended Action: {t.result.recommendedAction}</div>
                    <p className="text-slate-300 text-sm">{t.result.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-8 rounded-3xl preserve-3d ${isHighSavings ? 'bg-gradient-to-b from-blue-900 to-slate-900 border border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'glass-panel'}`}
            >
              {isHighSavings ? (
                <>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-6 text-white shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Capture Real Savings</h3>
                  <p className="text-blue-200 mb-6">
                    You have over $500/mo in potential savings. Credex can provide infrastructure credits to slash this bill even further.
                  </p>
                </>
              ) : isOptimal ? (
                <>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">You're spending well.</h3>
                  <p className="text-slate-300 mb-6">Your stack is optimized. Get notified when new AI pricing models or credits can save you money.</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Save this Report</h3>
                  <p className="text-slate-300 mb-6">Email this audit to yourself or your team to action these changes.</p>
                </>
              )}

              {!leadCaptured ? (
                <form onSubmit={handleCapture} className="space-y-4">
                  <input 
                    type="email" 
                    required
                    placeholder="Work Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                  />
                  <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
                    {isHighSavings ? 'Book Free Consultation' : 'Send me the Report'}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-500/20 text-emerald-300 rounded-xl font-medium text-center">
                  Check your inbox! We've sent the details.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
