
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { LandingPage, LandingPageSection, LandingPageSectionType } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
    Layout, Save, ArrowLeft, Wand2, Plus, Trash2, 
    Smartphone, Monitor, Image as ImageIcon, Type, 
    CheckCircle, Palette, Settings, MoveUp, MoveDown,
    MessageSquare, List, CreditCard, FormInput, Sparkles
} from 'lucide-react';

export const LandingPageBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { landingPages, addLandingPage, updateLandingPage } = useCRM();

  // Builder State
  const [pageData, setPageData] = useState<LandingPage>({
      id: '',
      name: 'דף נחיתה חדש',
      sections: [
          {
              id: 'hero1',
              type: 'hero',
              content: {
                  headline: 'כותרת ראשית מושכת',
                  subheadline: 'תת כותרת שמסבירה את הערך ללקוח',
                  imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2301',
                  buttonText: 'קריאה לפעולה'
              }
          }
      ],
      theme: { primaryColor: '#7c3aed', font: 'Rubik' },
      formConfig: {
          title: 'השאר פרטים',
          fields: ['name', 'phone'],
          buttonText: 'שלח עכשיו'
      },
      thankYouPage: {
          title: 'תודה רבה!',
          message: 'פרטיך התקבלו בהצלחה.'
      },
      published: false,
      createdAt: ''
  });

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('hero1');
  const [showAddSection, setShowAddSection] = useState(false);
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
        const existing = landingPages.find(p => p.id === id);
        if (existing) setPageData(existing);
    }
  }, [id, landingPages]);

  const handleSave = () => {
    if (id === 'new') {
        addLandingPage(pageData);
    } else if (id) {
        updateLandingPage(id, pageData);
    }
    navigate('/landing-pages');
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt || !process.env.API_KEY) {
        if(!process.env.API_KEY) alert("Missing API Key");
        return;
    }

    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const systemPrompt = `
        You are an expert copywriter and landing page designer.
        Generate a JSON object representing a landing page.
        Structure:
        {
            "theme": { "primaryColor": "hex" },
            "sections": [
                { "type": "hero", "content": { "headline": "", "subheadline": "", "buttonText": "" } },
                { "type": "features", "content": { "features": [{ "title": "", "description": "", "icon": "check" }] } },
                { "type": "testimonials", "content": { "testimonials": [{ "name": "", "role": "", "quote": "" }] } },
                { "type": "form", "content": { "headline": "Ready?", "subheadline": "Join us" } }
            ]
        }
        Return ONLY valid JSON.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: `Business Description: ${aiPrompt}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            }
        });

        const generated = JSON.parse(response.text);
        
        // Map generated sections to internal structure with IDs
        const newSections = generated.sections.map((s: any) => ({
            ...s,
            id: Math.random().toString(36).substr(2, 9),
            content: {
                ...s.content,
                // Add IDs to array items if they exist
                features: s.content.features?.map((f: any) => ({ ...f, id: Math.random().toString(36).substr(2, 9) })),
                testimonials: s.content.testimonials?.map((t: any) => ({ ...t, id: Math.random().toString(36).substr(2, 9) })),
                imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80' // Default image
            }
        }));

        setPageData(prev => ({
            ...prev,
            theme: { ...prev.theme, ...generated.theme },
            sections: newSections
        }));
        setShowAiModal(false);
    } catch (e) {
        console.error("AI Generation failed", e);
        alert("שגיאה ביצירת תוכן, אנא נסה שנית.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateHeroImage = async (sectionId: string, headline: string, subheadline: string) => {
      if (!process.env.API_KEY) return alert("Missing API Key");
      
      setGeneratingImageFor(sectionId);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          // Ask Gemini for a visual description suitable for image generation
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Based on this landing page headline: "${headline}" and subheadline: "${subheadline}", 
              generate a single, concise, vivid English image prompt (max 15 words) that would make a perfect background image for the hero section. 
              Do not include words like "image of" or "picture of". Just the visual description.`,
          });
          
          const imagePrompt = response.text.trim();
          console.log("Generated prompt:", imagePrompt);
          
          // Use pollintaions.ai to generate the image URL
          const newImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`;
          
          updateSectionContent(sectionId, { imageUrl: newImageUrl });

      } catch (e) {
          console.error("Image generation failed", e);
          alert("שגיאה ביצירת תמונה");
      } finally {
          setGeneratingImageFor(null);
      }
  };

  const addSection = (type: LandingPageSectionType) => {
      const newSection: LandingPageSection = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          content: {}
      };

      // Default content based on type
      if (type === 'hero') {
          newSection.content = { headline: 'כותרת ראשית', subheadline: 'תיאור קצר', buttonText: 'לחץ כאן', imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c' };
      } else if (type === 'features') {
          newSection.content = { features: [{ id: 'f1', title: 'יתרון לדוגמה', description: 'הסבר קצר', icon: 'check' }] };
      } else if (type === 'testimonials') {
          newSection.content = { testimonials: [{ id: 't1', name: 'לקוח מרוצה', role: 'מנכ״ל', quote: 'שירות מדהים!' }] };
      } else if (type === 'text') {
          newSection.content = { html: '<h2>כותרת פסקה</h2><p>כתוב כאן טקסט חופשי...</p>' };
      } else if (type === 'form') {
          newSection.content = { headline: 'הצטרפו אלינו', subheadline: 'מלאו פרטים' };
      }

      setPageData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
      setExpandedSection(newSection.id);
      setShowAddSection(false);
  };

  const removeSection = (id: string) => {
      setPageData(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
      const newSections = [...pageData.sections];
      if (direction === 'up' && index > 0) {
          [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      } else if (direction === 'down' && index < newSections.length - 1) {
          [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      }
      setPageData(prev => ({ ...prev, sections: newSections }));
  };

  const updateSectionContent = (sectionId: string, content: any) => {
      setPageData(prev => ({
          ...prev,
          sections: prev.sections.map(s => s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s)
      }));
  };

  const renderEditorSidebar = () => {
    return (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
             {/* Tabs */}
             <div className="flex border-b border-gray-200 bg-gray-50">
                <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'content' ? 'text-purple-600 border-b-2 border-purple-600 bg-white' : 'text-gray-500'}`}>תוכן</button>
                <button onClick={() => setActiveTab('design')} className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'design' ? 'text-purple-600 border-b-2 border-purple-600 bg-white' : 'text-gray-500'}`}>עיצוב</button>
                <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-sm font-medium transition ${activeTab === 'settings' ? 'text-purple-600 border-b-2 border-purple-600 bg-white' : 'text-gray-500'}`}>הגדרות</button>
             </div>

             <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {activeTab === 'content' && (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-gray-800">מבנה הדף</h3>
                            <button onClick={() => setShowAiModal(true)} className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:shadow-md transition">
                                <Wand2 size={12} />
                                <span>AI Magic</span>
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {pageData.sections.map((section, index) => (
                                <div key={section.id} className={`border rounded-lg bg-white overflow-hidden transition-all ${expandedSection === section.id ? 'border-purple-300 shadow-md ring-1 ring-purple-100' : 'border-gray-200'}`}>
                                    {/* Header / Draggable Handle */}
                                    <div 
                                        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">
                                                {section.type === 'hero' && <ImageIcon size={14} />}
                                                {section.type === 'features' && <List size={14} />}
                                                {section.type === 'testimonials' && <MessageSquare size={14} />}
                                                {section.type === 'form' && <FormInput size={14} />}
                                                {section.type === 'text' && <Type size={14} />}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {section.type === 'hero' ? 'אזור ראשי' : 
                                                 section.type === 'features' ? 'רשימת יתרונות' : 
                                                 section.type === 'testimonials' ? 'המלצות' : 
                                                 section.type === 'form' ? 'טופס לידים' : 'טקסט חופשי'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                            <button disabled={index === 0} onClick={() => moveSection(index, 'up')} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveUp size={12} /></button>
                                            <button disabled={index === pageData.sections.length - 1} onClick={() => moveSection(index, 'down')} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><MoveDown size={12} /></button>
                                            <button onClick={() => removeSection(section.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                                        </div>
                                    </div>

                                    {/* Editor Content */}
                                    {expandedSection === section.id && (
                                        <div className="p-3 border-t border-gray-100 bg-white space-y-3 animate-in slide-in-from-top-2">
                                            {/* HERO EDITOR */}
                                            {section.type === 'hero' && (
                                                <>
                                                    <div>
                                                        <label className="text-xs text-gray-500">כותרת</label>
                                                        <input 
                                                            value={section.content.headline || ''}
                                                            onChange={(e) => updateSectionContent(section.id, { headline: e.target.value })}
                                                            className="w-full text-sm p-2 border border-gray-300 rounded focus:border-purple-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">תת כותרת</label>
                                                        <textarea 
                                                            value={section.content.subheadline || ''}
                                                            onChange={(e) => updateSectionContent(section.id, { subheadline: e.target.value })}
                                                            className="w-full text-sm p-2 border border-gray-300 rounded h-16 focus:border-purple-500 outline-none resize-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-xs text-gray-500">תמונה (URL)</label>
                                                            <button 
                                                                onClick={() => handleGenerateHeroImage(section.id, section.content.headline || '', section.content.subheadline || '')}
                                                                disabled={generatingImageFor === section.id}
                                                                className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded border border-purple-100 hover:bg-purple-100 transition flex items-center gap-1"
                                                            >
                                                                {generatingImageFor === section.id ? (
                                                                    <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                                                ) : <Sparkles size={10} />}
                                                                צור ב-AI
                                                            </button>
                                                        </div>
                                                        <input 
                                                            value={section.content.imageUrl || ''}
                                                            onChange={(e) => updateSectionContent(section.id, { imageUrl: e.target.value })}
                                                            className="w-full text-sm p-2 border border-gray-300 rounded focus:border-purple-500 outline-none"
                                                        />
                                                        {section.content.imageUrl && (
                                                            <img src={section.content.imageUrl} alt="Preview" className="w-full h-24 object-cover mt-2 rounded border border-gray-100" />
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {/* FEATURES EDITOR */}
                                            {section.type === 'features' && (
                                                <div className="space-y-2">
                                                    {section.content.features?.map((feat, fIdx) => (
                                                        <div key={feat.id} className="border border-gray-100 rounded p-2 relative group">
                                                            <button 
                                                                className="absolute top-1 left-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                                onClick={() => {
                                                                    const newFeatures = section.content.features?.filter((_, i) => i !== fIdx);
                                                                    updateSectionContent(section.id, { features: newFeatures });
                                                                }}
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                            <input 
                                                                value={feat.title}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...(section.content.features || [])];
                                                                    newFeatures[fIdx].title = e.target.value;
                                                                    updateSectionContent(section.id, { features: newFeatures });
                                                                }}
                                                                className="w-full text-sm font-medium border-none p-1 focus:ring-0 placeholder-gray-400"
                                                                placeholder="כותרת היתרון"
                                                            />
                                                            <input 
                                                                value={feat.description}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...(section.content.features || [])];
                                                                    newFeatures[fIdx].description = e.target.value;
                                                                    updateSectionContent(section.id, { features: newFeatures });
                                                                }}
                                                                className="w-full text-xs text-gray-500 border-none p-1 focus:ring-0 placeholder-gray-300"
                                                                placeholder="תיאור קצר"
                                                            />
                                                        </div>
                                                    ))}
                                                    <button 
                                                        onClick={() => {
                                                            const newFeatures = [...(section.content.features || []), { id: Math.random().toString(), title: 'יתרון חדש', description: 'תיאור', icon: 'check' }];
                                                            updateSectionContent(section.id, { features: newFeatures });
                                                        }}
                                                        className="w-full py-2 text-xs text-purple-600 border border-purple-200 border-dashed rounded hover:bg-purple-50"
                                                    >
                                                        + הוסף יתרון
                                                    </button>
                                                </div>
                                            )}

                                            {/* TESTIMONIALS EDITOR */}
                                            {section.type === 'testimonials' && (
                                                <div className="space-y-2">
                                                    {section.content.testimonials?.map((t, tIdx) => (
                                                        <div key={t.id} className="border border-gray-100 rounded p-2 relative group bg-gray-50/50">
                                                            <button 
                                                                className="absolute top-1 left-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                                onClick={() => {
                                                                    const newTestimonials = section.content.testimonials?.filter((_, i) => i !== tIdx);
                                                                    updateSectionContent(section.id, { testimonials: newTestimonials });
                                                                }}
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                            <input 
                                                                value={t.name}
                                                                onChange={(e) => {
                                                                    const newArr = [...(section.content.testimonials || [])];
                                                                    newArr[tIdx].name = e.target.value;
                                                                    updateSectionContent(section.id, { testimonials: newArr });
                                                                }}
                                                                className="w-full text-sm font-medium border-none p-1 bg-transparent focus:ring-0"
                                                                placeholder="שם הממליץ"
                                                            />
                                                             <input 
                                                                value={t.quote}
                                                                onChange={(e) => {
                                                                    const newArr = [...(section.content.testimonials || [])];
                                                                    newArr[tIdx].quote = e.target.value;
                                                                    updateSectionContent(section.id, { testimonials: newArr });
                                                                }}
                                                                className="w-full text-xs text-gray-500 border-none p-1 bg-transparent focus:ring-0"
                                                                placeholder="תוכן ההמלצה"
                                                            />
                                                        </div>
                                                    ))}
                                                     <button 
                                                        onClick={() => {
                                                            const newArr = [...(section.content.testimonials || []), { id: Math.random().toString(), name: 'לקוח חדש', role: '', quote: 'כתוב כאן המלצה...' }];
                                                            updateSectionContent(section.id, { testimonials: newArr });
                                                        }}
                                                        className="w-full py-2 text-xs text-purple-600 border border-purple-200 border-dashed rounded hover:bg-purple-50"
                                                    >
                                                        + הוסף המלצה
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {/* FORM EDITOR */}
                                            {section.type === 'form' && (
                                                <div className="text-xs text-gray-500 p-2 bg-yellow-50 rounded border border-yellow-100">
                                                    הטופס נמשך מהגדרות הדף הכלליות. ניתן לשנות שדות בלשונית "הגדרות".
                                                </div>
                                            )}

                                             {/* TEXT EDITOR */}
                                             {section.type === 'text' && (
                                                <div>
                                                    <label className="text-xs text-gray-500">תוכן (HTML)</label>
                                                    <textarea 
                                                        value={section.content.html || ''}
                                                        onChange={(e) => updateSectionContent(section.id, { html: e.target.value })}
                                                        className="w-full text-sm p-2 border border-gray-300 rounded h-32 focus:border-purple-500 outline-none font-mono"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add Section Button */}
                            <div className="relative">
                                {showAddSection ? (
                                    <div className="grid grid-cols-2 gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg animate-in fade-in zoom-in duration-200">
                                        {[
                                            {type: 'hero', label: 'אזור ראשי', icon: <ImageIcon size={16}/>},
                                            {type: 'features', label: 'רשימת יתרונות', icon: <List size={16}/>},
                                            {type: 'testimonials', label: 'המלצות', icon: <MessageSquare size={16}/>},
                                            {type: 'form', label: 'טופס לידים', icon: <FormInput size={16}/>},
                                            {type: 'text', label: 'טקסט חופשי', icon: <Type size={16}/>},
                                        ].map(item => (
                                            <button 
                                                key={item.type}
                                                onClick={() => addSection(item.type as LandingPageSectionType)}
                                                className="flex flex-col items-center gap-2 p-3 hover:bg-purple-50 rounded-lg transition text-gray-600 hover:text-purple-700"
                                            >
                                                {item.icon}
                                                <span className="text-xs font-medium">{item.label}</span>
                                            </button>
                                        ))}
                                        <button 
                                            onClick={() => setShowAddSection(false)}
                                            className="col-span-2 text-xs text-gray-400 py-1 hover:text-gray-600"
                                        >
                                            ביטול
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setShowAddSection(true)}
                                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        <span>הוסף אזור חדש</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'design' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">צבע ראשי</label>
                            <div className="flex flex-wrap gap-2">
                                {['#7c3aed', '#2563eb', '#db2777', '#16a34a', '#ea580c', '#000000'].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setPageData({...pageData, theme: {...pageData.theme, primaryColor: c}})}
                                        className={`w-8 h-8 rounded-full border-2 ${pageData.theme.primaryColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                        style={{backgroundColor: c}}
                                    />
                                ))}
                                <input 
                                    type="color" 
                                    value={pageData.theme.primaryColor}
                                    onChange={(e) => setPageData({...pageData, theme: {...pageData.theme, primaryColor: e.target.value}})}
                                    className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">פונט</label>
                            <select 
                                value={pageData.theme.font}
                                onChange={(e) => setPageData({...pageData, theme: {...pageData.theme, font: e.target.value}})}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="Rubik">Rubik (ברירת מחדל)</option>
                                <option value="Heebo">Heebo</option>
                                <option value="Assistant">Assistant</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">שם הדף (פנימי)</label>
                            <input 
                                value={pageData.name}
                                onChange={(e) => setPageData({...pageData, name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-3">הגדרות טופס</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500">כותרת הטופס</label>
                                    <input 
                                        value={pageData.formConfig.title}
                                        onChange={(e) => setPageData({...pageData, formConfig: {...pageData.formConfig, title: e.target.value}})}
                                        className="w-full p-2 border border-gray-300 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">טקסט כפתור</label>
                                    <input 
                                        value={pageData.formConfig.buttonText}
                                        onChange={(e) => setPageData({...pageData, formConfig: {...pageData.formConfig, buttonText: e.target.value}})}
                                        className="w-full p-2 border border-gray-300 rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-2">שדות להצגה</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-1 text-sm text-gray-600"><input type="checkbox" checked={pageData.formConfig.fields.includes('name')} readOnly className="rounded text-purple-600"/> שם</label>
                                        <label className="flex items-center gap-1 text-sm text-gray-600"><input type="checkbox" checked={pageData.formConfig.fields.includes('phone')} readOnly className="rounded text-purple-600"/> טלפון</label>
                                        <label className="flex items-center gap-1 text-sm text-gray-600"><input type="checkbox" checked={pageData.formConfig.fields.includes('email')} readOnly className="rounded text-purple-600"/> אימייל</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                             <h4 className="font-bold text-gray-800 mb-3">דף תודה</h4>
                             <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500">כותרת</label>
                                    <input 
                                        value={pageData.thankYouPage.title}
                                        onChange={(e) => setPageData({...pageData, thankYouPage: {...pageData.thankYouPage, title: e.target.value}})}
                                        className="w-full text-sm p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">הודעה</label>
                                    <textarea 
                                        value={pageData.thankYouPage.message}
                                        onChange={(e) => setPageData({...pageData, thankYouPage: {...pageData.thankYouPage, message: e.target.value}})}
                                        className="w-full text-sm p-2 border border-gray-300 rounded h-20"
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
  };

  const renderPreview = () => {
    return (
        <div className={`bg-white shadow-2xl transition-all duration-300 overflow-y-auto custom-scrollbar ${previewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[30px] border-8 border-gray-900' : 'w-full h-full'}`}>
            {pageData.sections.map((section) => {
                switch(section.type) {
                    case 'hero':
                        return (
                            <div key={section.id} className="relative text-white py-20 px-6 text-center" style={{backgroundColor: pageData.theme.primaryColor}}>
                                <div className="absolute inset-0 opacity-20 bg-black mix-blend-multiply"></div>
                                {section.content.imageUrl && (
                                    <div className="absolute inset-0 z-0">
                                         <img src={section.content.imageUrl} className="w-full h-full object-cover opacity-30 mix-blend-overlay" alt="Hero" />
                                    </div>
                                )}
                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <h1 className="text-4xl font-bold mb-4 leading-tight">{section.content.headline}</h1>
                                    <p className="text-xl opacity-90 mb-8">{section.content.subheadline}</p>
                                    {section.content.buttonText && (
                                        <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition transform">
                                            {section.content.buttonText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    case 'features':
                        return (
                            <div key={section.id} className="py-16 px-6 bg-gray-50">
                                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {section.content.features?.map((f, i) => (
                                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                                                <CheckCircle size={24} style={{color: pageData.theme.primaryColor}} />
                                            </div>
                                            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                                            <p className="text-gray-500 text-sm">{f.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    case 'testimonials':
                        return (
                            <div key={section.id} className="py-16 px-6 bg-white">
                                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">מה הלקוחות אומרים</h2>
                                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {section.content.testimonials?.map((t, i) => (
                                        <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                <img src={t.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} alt={t.name} />
                                            </div>
                                            <div>
                                                <p className="text-gray-600 italic mb-2">"{t.quote}"</p>
                                                <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                                                <span className="text-xs text-gray-500">{t.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    case 'form':
                        return (
                            <div key={section.id} className="py-16 px-6 bg-gray-50 border-t border-gray-200">
                                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                                    {section.content.headline && <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{section.content.headline}</h2>}
                                    {section.content.subheadline && <p className="text-center text-gray-500 mb-6">{section.content.subheadline}</p>}
                                    
                                    {/* Use Global Form Config for fields */}
                                    <div className="space-y-4">
                                        <h3 className="text-center font-medium text-gray-700 mb-4">{pageData.formConfig.title}</h3>
                                        {pageData.formConfig.fields.includes('name') && (
                                            <input placeholder="שם מלא" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2" style={{'--tw-ring-color': pageData.theme.primaryColor} as any} />
                                        )}
                                        {pageData.formConfig.fields.includes('phone') && (
                                            <input placeholder="טלפון" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2" style={{'--tw-ring-color': pageData.theme.primaryColor} as any} />
                                        )}
                                        {pageData.formConfig.fields.includes('email') && (
                                            <input placeholder="אימייל" className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:ring-2" style={{'--tw-ring-color': pageData.theme.primaryColor} as any} />
                                        )}
                                        <button 
                                            className="w-full text-white font-bold py-3 rounded-lg shadow transition hover:opacity-90"
                                            style={{backgroundColor: pageData.theme.primaryColor}}
                                        >
                                            {pageData.formConfig.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    case 'text':
                         return (
                            <div key={section.id} className="py-16 px-6">
                                <div className="max-w-3xl mx-auto prose prose-purple" dangerouslySetInnerHTML={{ __html: section.content.html || '' }} />
                            </div>
                        );
                    default:
                        return null;
                }
            })}

            {/* Footer */}
            <div className="py-6 text-center text-gray-400 text-xs border-t border-gray-100 bg-gray-50">
                <p>&copy; {new Date().getFullYear()} כל הזכויות שמורות</p>
            </div>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/landing-pages')} className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Layout size={20} className="text-purple-600" />
                    בונה דפי הנחיתה
                </h1>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded transition ${previewMode === 'desktop' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}
                >
                    <Monitor size={20} />
                </button>
                <button 
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded transition ${previewMode === 'mobile' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}
                >
                    <Smartphone size={20} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                 <button onClick={() => setShowAiModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium">
                    <Wand2 size={18} />
                    <span>AI Assistant</span>
                 </button>
                 <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg shadow-purple-200"
                >
                    <Save size={18} />
                    <span>שמור ופרסם</span>
                 </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
            {renderEditorSidebar()}
            <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto">
                {renderPreview()}
            </div>
        </div>

        {/* AI Modal */}
        {showAiModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex justify-between items-center mb-2">
                             <div className="flex items-center gap-2">
                                <Wand2 size={24} />
                                <h3 className="text-xl font-bold">יצירת דף עם AI</h3>
                             </div>
                             <button onClick={() => setShowAiModal(false)} className="text-white/80 hover:text-white"><ArrowLeft size={24} className="rotate-180" /></button>
                        </div>
                        <p className="text-indigo-100 text-sm">תאר את העסק שלך ואנחנו נבנה עבורך את הדף המושלם.</p>
                    </div>
                    
                    <div className="p-6">
                        <textarea 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="לדוגמה: אני מורה ליוגה שפותחת סדנה חדשה למתחילים בתל אביב. אני רוצה להדגיש רוגע, גמישות ובריאות..."
                            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none text-gray-800"
                        />
                        
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !aiPrompt}
                                className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all
                                    ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg shadow-indigo-200'}
                                `}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>הקסם קורה...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} />
                                        <span>צור דף עכשיו</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
