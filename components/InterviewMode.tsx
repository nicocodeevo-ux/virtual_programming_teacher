import React, { useState, useEffect } from 'react';
import { generateLesson } from '../services/geminiService';

interface InterviewModeProps {
  data: any;
  onSave: (d: any) => void;
  onReset: () => void;
}

export const InterviewMode: React.FC<InterviewModeProps> = ({ data, onSave, onReset }) => {
  const [local, setLocal] = useState<any>({});
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [importUrl, setImportUrl] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  useEffect(() => {
    setLocal(JSON.parse(JSON.stringify(data || {})));
    setSelectedKey(Object.keys(data || {})[0] || '');
  }, [data]);

  const updateLanguageName = (key: string, name: string) => {
    setLocal((prev: any) => ({ ...prev, [key]: { ...prev[key], name } }));
  };

  const addTopic = (key: string) => {
    const title = `New Topic ${Date.now()}`;
    const prompt = 'Write a short prompt for this topic.';
    setLocal((prev: any) => ({
      ...prev,
      [key]: { ...prev[key], topics: [...(prev[key].topics || []), { title, prompt }] },
    }));
  };

  const getServerFetchBase = () => {
    // Try environment override first
    const override = (globalThis as any).__VPT_PROXY_URL__;
    if (override) return override.replace(/\/$/, '');
    // Default to same host but port 4000 (server/index.mjs)
    try {
      const loc = window.location.origin;
      return loc.replace(/:\d+$/, ':4000');
    } catch {
      return 'http://localhost:4000';
    }
  };

  const importFromUrl = async (key: string, url: string) => {
    if (!url) return;
    setIsImporting(true);
    try {
      const base = getServerFetchBase();
      const res = await fetch(`${base}/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error(`Failed to fetch from proxy: ${res.status}`);
      const text = await res.text();
      const snippet = text.slice(0, 4000);
      const title = `Imported: ${new URL(url).hostname}`;
      const prompt = `Create a teaching lesson and exercises based on the following content from ${url}:\n\n${snippet}`;
      setLocal((prev: any) => ({
        ...prev,
        [key]: { ...prev[key], topics: [...(prev[key].topics || []), { title, prompt, sourceUrl: url }] },
      }));
      setImportUrl('');
      setSelectedKey(key);
    } catch (err) {
      console.error('Import failed', err);
      alert('Failed to import from URL. Check the console for details.');
    } finally {
      setIsImporting(false);
    }
  };

  const updateTopic = (key: string, idx: number, field: 'title' | 'prompt' | 'interviewQuestions' | 'exercises' | 'sourceUrl', value: any) => {
    const topics = [...(local[key].topics || [])];
    topics[idx] = { ...topics[idx], [field]: value };
    setLocal((prev: any) => ({ ...prev, [key]: { ...prev[key], topics } }));
  };

  const addLanguage = () => {
    const key = `lang_${Date.now()}`;
    setLocal((prev: any) => ({ ...prev, [key]: { name: 'New Language', topics: [] } }));
    setSelectedKey(key);
  };

  const removeTopic = (key: string, idx: number) => {
    const topics = [...(local[key].topics || [])];
    topics.splice(idx, 1);
    setLocal((prev: any) => ({ ...prev, [key]: { ...prev[key], topics } }));
  };

  const removeLanguage = (key: string) => {
    const copy = { ...local };
    delete copy[key];
    setLocal(copy);
    setSelectedKey(Object.keys(copy)[0] || '');
  };

  return (
    <div className="mt-6 bg-primary/60 border border-slate-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Interview Mode — Edit Languages & Lessons</h3>
        <div className="flex gap-2">
          <button onClick={() => onSave(local)} className="px-3 py-1 rounded bg-accent text-primary font-semibold">Save</button>
          <button onClick={onReset} className="px-3 py-1 rounded bg-slate-700 text-slate-200">Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-secondary/30 p-3 rounded">
          <div className="flex flex-col gap-2">
            {Object.keys(local || {}).map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKey(k)}
                className={`text-left px-2 py-1 rounded ${selectedKey === k ? 'bg-accent text-primary' : 'hover:bg-slate-700'}`}>
                {local[k].name || k}
              </button>
            ))}
            <div className="mt-2">
              <button onClick={addLanguage} className="px-2 py-1 rounded bg-sky-500 text-white">+ Add Language</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-secondary/20 p-3 rounded">
          {!selectedKey ? (
            <div className="text-slate-400">Select or add a language to edit.</div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <input value={local[selectedKey]?.name || ''} onChange={(e) => updateLanguageName(selectedKey, e.target.value)} className="flex-1 bg-primary/30 px-2 py-1 rounded text-white" />
                <button onClick={() => removeLanguage(selectedKey)} className="px-2 py-1 rounded bg-red-600 text-white">Remove</button>
                <button onClick={() => addTopic(selectedKey)} className="px-2 py-1 rounded bg-green-600 text-white">+ Topic</button>
              </div>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input value={importUrl} onChange={(e) => setImportUrl(e.target.value)} placeholder="https://example.com/article" className="col-span-2 bg-primary/10 px-2 py-1 rounded text-sm" />
                <button disabled={isImporting} onClick={() => importFromUrl(selectedKey, importUrl)} className="px-3 py-1 rounded bg-blue-600 text-white">{isImporting ? 'Importing...' : 'Import from URL'}</button>
              </div>
              <div className="mb-4 flex gap-2">
                <button onClick={() => {
                  // export local as JSON download
                  const blob = new Blob([JSON.stringify(local, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'vpt_languages.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }} className="px-3 py-1 rounded bg-sky-600 text-white">Export JSON</button>

                <label className="px-3 py-1 rounded bg-emerald-600 text-white cursor-pointer">
                  Import JSON
                  <input type="file" accept="application/json" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const parsed = JSON.parse(String(ev.target?.result || '{}'));
                        setLocal(parsed);
                        alert('Imported JSON into editor. Click Save to persist.');
                      } catch (err) {
                        alert('Failed to parse JSON file.');
                      }
                    };
                    reader.readAsText(f);
                  }} className="hidden" />
                </label>

                <button onClick={async () => {
                  // auto-generate Qs & Exercises from selected topic using AI
                  const topic = local[selectedKey]?.topics?.slice(-1)[0];
                  if (!topic) { alert('No topic selected to generate from'); return; }
                  const prompt = `Given the following content, produce a JSON object with keys \"interviewQuestions\" (array of 6 short interview-style questions) and \"exercises\" (array of 4 hands-on exercises). Return ONLY valid JSON. Content:\n\n${topic.prompt}`;
                  try {
                    const resp = await generateLesson(prompt);
                    // try to parse JSON from the response
                    const jsonStart = resp.indexOf('{');
                    const jsonText = jsonStart >= 0 ? resp.slice(jsonStart) : resp;
                    const parsed = JSON.parse(jsonText);
                    updateTopic(selectedKey, local[selectedKey].topics.length - 1, 'interviewQuestions', parsed.interviewQuestions || []);
                    updateTopic(selectedKey, local[selectedKey].topics.length - 1, 'exercises', parsed.exercises || []);
                    alert('Generated interview questions and exercises and added to the topic. Click Save to persist.');
                  } catch (err) {
                    console.error('Auto-generate failed', err);
                    alert('Auto-generation failed. See console for details.');
                  }
                }} className="px-3 py-1 rounded bg-purple-600 text-white">Auto-generate Qs & Exercises</button>
              </div>

              <div className="space-y-3">
                {(local[selectedKey]?.topics || []).map((t: any, idx: number) => (
                  <div key={idx} className="bg-primary/30 p-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <input value={t.title} onChange={(e) => updateTopic(selectedKey, idx, 'title', e.target.value)} className="flex-1 bg-primary/20 px-2 py-1 rounded text-white" />
                      <button onClick={() => removeTopic(selectedKey, idx)} className="px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                    </div>
                    <textarea value={t.prompt} onChange={(e) => updateTopic(selectedKey, idx, 'prompt', e.target.value)} className="w-full bg-primary/10 p-2 rounded text-sm" rows={3} />
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm text-slate-300">Interview Questions (one per line)</label>
                        <textarea value={(t.interviewQuestions || []).join('\n')} onChange={(e) => {
                          const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                          updateTopic(selectedKey, idx, 'interviewQuestions', lines as any);
                        }} className="w-full bg-primary/10 p-2 rounded text-sm" rows={3} />
                      </div>
                      <div>
                        <label className="text-sm text-slate-300">Exercises (one per line)</label>
                        <textarea value={(t.exercises || []).join('\n')} onChange={(e) => {
                          const lines = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                          updateTopic(selectedKey, idx, 'exercises', lines as any);
                        }} className="w-full bg-primary/10 p-2 rounded text-sm" rows={3} />
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => {
                            // copy interview questions into exercises
                            const q = (t.interviewQuestions || []);
                            updateTopic(selectedKey, idx, 'exercises', q as any);
                          }} className="px-2 py-1 rounded bg-accent text-primary text-sm">Copy Q → Exercises</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {((local[selectedKey]?.topics || []).length === 0) && (
                  <div className="text-slate-400">No topics yet. Add one with + Topic.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewMode;
