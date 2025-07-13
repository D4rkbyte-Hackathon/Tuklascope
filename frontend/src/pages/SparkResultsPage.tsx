import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AchievementModal } from '../components/AchievementModal';
import ReactMarkdown from 'react-markdown'; //para formatting atong mga double asterisks (**)

const API_URL = import.meta.env.VITE_API_BASE_URL;

// based ni sila sa prompts ug ai_core.py
interface IdentificationResponse {
  object_label: string;
  category_hint: string;
}

interface SparkContentResponse {
  quick_facts: string;
  stem_concepts: string;
  hands_on_project: string;
}

interface SkillsResponse {
  normalized_skills: {
    skill_name: string;
    category: string;
  }[];
}

// suway combined if mas paspas ba siya kaysas individual
interface FullDiscoveryResponse {
    identification: IdentificationResponse;
    spark_content: SparkContentResponse;
    skills: SkillsResponse;
}

const LoadingIndicator = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '20px' }}>
    <div style={{
      border: '8px solid #f3f3f3', borderTop: '8px solid #FF6B2C',
      borderRadius: '50%', width: '60px', height: '60px',
      animation: 'spin 1.2s linear infinite'
    }}></div>
    <p style={{ color: '#0B3C6A', fontWeight: 'bold', fontSize: '18px' }}>{text}</p>
    <style>{`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
  </div>
);

const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div style={{ padding: '30px', background: '#FEF2F2', borderRadius: 16, border: '2px solid #DC2626', textAlign: 'center' }}>
    <h3 style={{ color: '#DC2626' }}>Oops! An Error Occurred.</h3>
    <p style={{ color: '#991B1B', margin: '16px 0', fontFamily: 'monospace', background: '#FEE2E2', padding: '10px', borderRadius: '8px' }}>{message}</p>
    <button onClick={onRetry} style={{ background: '#FF6B2C', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '12px 24px', cursor: 'pointer' }}>
      Try Again
    </button>
  </div>
);


const SparkResultsPage = () => {
  const location = useLocation();
  const { image } = location.state || {}; // The base64 image string

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullResult, setFullResult] = useState<FullDiscoveryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'facts' | 'concepts' | 'project'>('facts');
  const [showAchievements, setShowAchievements] = useState(false);

  const fetchFullDiscovery = async () => {
    if (!image) {
      setError("No image data found. Please return to the homepage and try again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchRes = await fetch(image);
      const blob = await fetchRes.blob();
      const file = new File([blob], "discovery.png", { type: "image/png" });
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/generate-full-discovery`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Server returned an error: ${response.status}`);
      }

      const data: FullDiscoveryResponse = await response.json();
      setFullResult(data);
      if (data.skills?.normalized_skills?.length > 0) {
            setShowAchievements(true);
        }

    } catch (err: any) {
      console.error("Full discovery API call failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFullDiscovery();
  }, [image]);

  const renderStringWithMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('###')) {
        return <h4 key={index} style={{ margin: '16px 0 8px 0', color: '#1F2937' }}>{line.replace('###', '').trim()}</h4>;
      }
      if (line.match(/^\d+\./)) {
        return <p key={index} style={{ margin: '4px 0 4px 16px', textIndent: '-16px' }}>{line}</p>;
      }
      return <p key={index} style={{ margin: '4px 0' }}>{line}</p>;
    });
  };

  const TabButton = ({ label, tabName, icon }: { label: string, tabName: typeof activeTab, icon: string }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      style={{
        flex: 1, padding: '16px', fontSize: 16, fontWeight: 'bold',
        border: 'none', background: activeTab === tabName ? '#0B3C6A' : '#F3F4F6',
        color: activeTab === tabName ? 'white' : '#4B5563',
        cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );

  return (
    <>
      <Navbar />
      
      {showAchievements && fullResult?.skills?.normalized_skills && (
        <AchievementModal skills={fullResult.skills.normalized_skills} onClose={() => setShowAchievements(false)} />
      )}

      <div style={{ padding: '40px 16px', maxWidth: 900, margin: '0 auto' }}>
        {isLoading && <LoadingIndicator text="Analyzing your discovery..." />}
        {error && <ErrorDisplay message={error} onRetry={fetchFullDiscovery} />}
        
        {fullResult && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* --- IMAGE (Centered) --- */}
            <div style={{ width: '100%', maxWidth: 500 }}>
                {image && <img src={image} alt="Your discovery" style={{ width: '100%', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}/>}
            </div>

            {/* --- IDENTIFICATION PANEL (Below Image) --- */}
            <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 16, border: '1px solid #E5E7EB', textAlign: 'center', width: '100%', maxWidth: 500 }}>
                <p style={{ color: '#6B7280', fontSize: 16, margin: 0 }}>THE AI SEES...</p>
                <h2 style={{ color: '#0B3C6A', fontSize: 32, marginTop: 4, marginBottom: 0 }}>
                  {fullResult.identification?.object_label || 'An interesting object!'}
                </h2>
            </div>
            
            {/* --- TABBED CONTENT (Full Width) --- */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', width: '100%' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
                  <TabButton label="Quick Facts" tabName="facts" icon="💡" />
                  <TabButton label="STEM Concepts" tabName="concepts" icon="🔬" />
                  <TabButton label="Hands-On Project" tabName="project" icon="🛠️" />
                </div>

                <div style={{ padding: '32px 40px', minHeight: 300, animation: 'fadeIn 0.4s' }}>
                   {/* Improved Readability Styles and Markdown Component */}
                   <div style={{ fontSize: 18, lineHeight: 1.8, color: '#374151' }}>
                    {activeTab === 'facts' && <ReactMarkdown>{fullResult.spark_content.quick_facts}</ReactMarkdown>}
                    {activeTab === 'concepts' && <ReactMarkdown>{fullResult.spark_content.stem_concepts}</ReactMarkdown>}
                    {activeTab === 'project' && <ReactMarkdown>{fullResult.spark_content.hands_on_project}</ReactMarkdown>}
                   </div>
                </div>
                <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            </div>
            
            <Link to="/home" style={{ display: 'inline-block', textDecoration: 'none', background: '#0B3C6A', color: 'white', textAlign: 'center', padding: '18px 60px', borderRadius: 12, fontWeight: 'bold', fontSize: 18, marginTop: 20 }}>
              Discover Something New
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SparkResultsPage;