import { useState, useEffect } from 'react';
import { getAuth, doc, getDoc, db } from '../database/firebase';

export const useUserEducation = () => {
  const [education, setEducation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEducation = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'Tuklascope-user', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setEducation(data.education || '');
        }
      } catch (error) {
        console.error('Error fetching user education:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEducation();
  }, []);

  return { education, loading };
}; 