import React from 'react';
import { getAuth } from '../database/firebase';
import { getUserDiscoveriesRealtime } from '../database/firebase';

export interface RecentDiscovery {
  id: number;
  image: string;
  timestamp: string;
  fullResult: any;
}

interface RecentDiscoveriesProps {
  onSelect: (discovery: RecentDiscovery) => void;
}

export const RecentDiscoveries: React.FC<RecentDiscoveriesProps> = ({ onSelect }) => {
  const [discoveries, setDiscoveries] = React.useState<RecentDiscovery[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      setIsLoading(false);
      setError('Please log in to view your discoveries');
      return;
    }

    // Subscribe to real-time updates of user discoveries
    const unsubscribe = getUserDiscoveriesRealtime(currentUser.uid, (userDiscoveries) => {
      setDiscoveries(userDiscoveries);
      setIsLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div style={{ color: '#6B7280', fontSize: 16 }}>Loading discoveries...</div>;
  }

  if (error) {
    return <div style={{ color: '#DC2626', fontSize: 16 }}>{error}</div>;
  }

  if (discoveries.length === 0) {
    return <div style={{ color: '#6B7280', fontSize: 16 }}>No recent discoveries yet. Start exploring to see your discoveries here!</div>;
  }

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {discoveries.map((d) => (
        <div
          key={d.id}
          style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            padding: 16,
            width: 180,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow 0.2s',
          }}
          onClick={() => onSelect(d)}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
        >
          <img src={d.image} alt="Discovery" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
          <div style={{ fontWeight: 700, color: '#0B3C6A', fontSize: 16, marginBottom: 4 }}>
            {d.fullResult?.identification?.object_label || 'Discovery'}
          </div>
          <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 4 }}>
            {new Date(d.timestamp).toLocaleString()}
          </div>
          <div style={{ color: '#FF6B2C', fontSize: 13, fontWeight: 500 }}>
            View Details
          </div>
        </div>
      ))}
    </div>
  );
}; 