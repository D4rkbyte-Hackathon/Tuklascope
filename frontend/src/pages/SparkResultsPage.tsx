import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AchievementModal } from '../components/AchievementModal';
import ReactMarkdown from 'react-markdown'; //para formatting atong mga double asterisks (**)
import { getAuth, saveUserDiscovery, updateUserStats, saveUserSkills } from '../database/firebase';
import { useUserEducation } from '../hooks/useUserEducation';
import { DiscoveryModal } from '../components/DiscoveryModal';
import { ALL_BADGES, Badge } from '../database/gamification';


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

// Multi-Stage Loading Indicator
const loadingStages = [
  "Warming up the AI brain... ",
  "Analyzing image pixels... ",
  "Identifying the object... ",
  "Searching STEM knowledge base... ",
  "Crafting educational content... ",
  "Extracting key skills... ",
  "Almost there! Just a moment... "
];

const LoadingIndicator = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    // This effect will cycle through the loading messages
    const interval = setInterval(() => {
      setCurrentStage((prevStage) => (prevStage + 1) % loadingStages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '20px' }}>
      <div style={{
        border: '8px solid #f3f3f3', borderTop: '8px solid #FF6B2C',
        borderRadius: '50%', width: '60px', height: '60px',
        animation: 'spin 1.2s linear infinite'
      }}></div>
      <p style={{ color: '#0B3C6A', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
        {loadingStages[currentStage]}
      </p>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

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
  const { image, recentDiscovery, questId} = location.state || {}; // The base64 image string or recent discovery
  const { education, loading: educationLoading } = useUserEducation();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullResult, setFullResult] = useState<FullDiscoveryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'facts' | 'concepts' | 'project'>('facts');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [awardedBadge, setAwardedBadge] = useState<Badge | null>(null);

  const fetchFullDiscovery = async () => {
    if (!image) {
      setError("No image data found. Please return to the homepage and try again.");
      setIsLoading(false);
      return;
    }

    if (!education || education.trim() === '') {
      setError("To continue, please update your profile with your education level.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert the base64 image string to a File object
      const fetchRes = await fetch(image);
      const blob = await fetchRes.blob();
      const file = new File([blob], "discovery.png", { type: "image/png" });
      
      // Create a single FormData object for the API call
      const formData = new FormData();
      formData.append('image', file);
      formData.append('grade_level', education);// I remove the junior high school so it doesnt assume that the user is in junior high school

      // Make a single, efficient API call to the combined endpoint
      const response = await fetch(`${API_URL}/api/generate-full-discovery`, {
        method: 'POST',
        body: formData,
      });


      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Discovery failed: ${response.status}`);
      }

      const data: FullDiscoveryResponse = await response.json();

      setFullResult(data);
      if (data.skills?.normalized_skills?.length > 0) {
        setShowAchievements(true);
      }
      
      // Save discovery to Firebase
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const newEntry = {
          id: Date.now(),
          image,
          timestamp: new Date().toISOString(),
          fullResult: data
        };
        
        try {
          await saveUserDiscovery(currentUser.uid, newEntry);
        } catch (error) {
          console.error('Failed to save discovery:', error);
          // Don't show error to user as the discovery was still successful
        }

        //save the skills (this will also add points for skills)
        if (data.skills?.normalized_skills) {
          await saveUserSkills(currentUser.uid, data.skills.normalized_skills);
        }

        // award points and update streak for the discovery itself
        await updateUserStats(currentUser.uid, 10, true); // +10 points for a new discovery

      } else {
        console.log('User not logged in - discovery not saved to profile');
      }

    } catch (err: any) {
      console.error("Full discovery API call failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (recentDiscovery) {
      setFullResult(recentDiscovery.fullResult);
      setIsLoading(false);
      setError(null);
      return;
    }
    // Only proceed if education data is loaded
    if (!educationLoading) {
      if (!education || education.trim() === '') {
        setError("To continue, please update your profile with your education level.");
        setIsLoading(false);
      } else {
        fetchFullDiscovery();
      }
    }
  }, [image, recentDiscovery, education, educationLoading]);

  useEffect(() => {
  // If the page was loaded with the specific questId from the Pathways page...
  if (questId === 'quest_garden_safari') {
    // Find the corresponding badge from our data file.
    const badge = ALL_BADGES.find(b => b.id === 'badge_garden_explorer');
    if (badge) {
      // Trigger the modal to show the badge.
      setAwardedBadge(badge);

      // Save the earned badge ID to the browser's local storage to make it permanent.
      const earnedBadges: string[] = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
      if (!earnedBadges.includes(badge.id)) {
        earnedBadges.push(badge.id);
        localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
      }
    }
  }
}, [questId]); // This effect runs only when questId changes.

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
      {awardedBadge && (
        <AchievementModal
          skills={[{ skill_name: awardedBadge.name, category: awardedBadge.description }]}
          onClose={() => setAwardedBadge(null)}
          customIcon={awardedBadge.icon}
        />
      )}
      
      {showAchievements && fullResult?.skills?.normalized_skills && (
        <AchievementModal skills={fullResult.skills.normalized_skills} onClose={() => setShowAchievements(false)} />
      )}

      <div style={{ padding: '40px 16px', maxWidth: 900, margin: '0 auto' }}>
        {isLoading && <LoadingIndicator />}
        {error && <ErrorDisplay message={error} onRetry={fetchFullDiscovery} />}
        
        {fullResult && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* --- IMAGE (Centered) --- */}
            <div style={{ width: '100%', maxWidth: 500 }}>
                {(() => {
                  const displayImage = recentDiscovery?.image || image || null;
                  if (displayImage) {
                    return <img src={displayImage} alt="Your discovery" style={{ width: '100%', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}/>;
                  } else {
                    return <div style={{ width: '100%', height: 240, background: '#F3F4F6', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 20 }}>
                      No image available
                    </div>;
                  }
                })()}
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
            
            <Link to="/home" style={{ display: 'none' }} />
            <button
              className="spark-button"
              style={{ display: 'inline-block', background: '#0B3C6A', color: 'white', textAlign: 'center', padding: '18px 60px', borderRadius: 12, fontWeight: 'bold', fontSize: 18, marginTop: 20, border: 'none', cursor: 'pointer' }}
              onClick={() => setShowDiscoveryModal(true)}
            >
              Discover Something New
            </button>
          </div>
        )}
      </div>

      {/* DiscoveryModal overlay */}
      <DiscoveryModal isOpen={showDiscoveryModal} onClose={() => setShowDiscoveryModal(false)} />

      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .spark-results-container {
            padding: 20px 16px !important;
          }
          
          .spark-results-content {
            gap: 20px !important;
          }
          
          .spark-image {
            margin-bottom: 16px !important;
          }
          
          .spark-image img {
            border-radius: 20px !important;
          }
          
          .spark-identification {
            padding: 16px 20px !important;
            margin-bottom: 16px !important;
          }
          
          .spark-identification p {
            font-size: 14px !important;
          }
          
          .spark-identification h2 {
            font-size: 24px !important;
            line-height: 1.2 !important;
          }
          
          .spark-tabs {
            flex-wrap: wrap !important;
          }
          
          .spark-tab-button {
            padding: 12px !important;
            font-size: 14px !important;
            min-height: 44px !important;
          }
          
          .spark-content {
            padding: 20px !important;
          }
          
          .spark-content > div {
            font-size: 16px !important;
            line-height: 1.6 !important;
          }
          
          .spark-button {
            padding: 16px 40px !important;
            font-size: 16px !important;
            min-height: 44px !important;
            width: 100% !important;
            max-width: 300px !important;
          }
          
          .loading-indicator p {
            font-size: 16px !important;
            text-align: center !important;
          }
          
          .error-display {
            padding: 24px 20px !important;
            margin: 16px !important;
          }
          
          .error-display h3 {
            font-size: 18px !important;
            margin-bottom: 12px !important;
          }
          
          .error-display p {
            font-size: 14px !important;
            word-break: break-word !important;
          }
          
          .error-display button {
            font-size: 14px !important;
            min-height: 44px !important;
          }
        }
        
        @media (max-width: 480px) {
          .spark-identification h2 {
            font-size: 20px !important;
          }
          
          .spark-content > div {
            font-size: 14px !important;
          }
          
          .spark-button {
            font-size: 14px !important;
          }
        }
      `}</style>
    </>
  );
};

export default SparkResultsPage;