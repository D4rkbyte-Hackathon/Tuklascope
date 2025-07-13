import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadIcon = () => <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V17.25c0 .621 0 1.242 0 1.864 0 .89 0 1.334.202 1.764a2.986 2.986 0 001.162 1.162c.43.202.874.202 1.764.202h11.748c.89 0 1.334 0 1.764-.202a2.986 2.986 0 001.162-1.162c.202-.43.202-.874.202-1.764V17.25" /></svg>;
const CameraIcon = () => <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>;

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'choice' | 'camera' | 'confirm';

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [view, setView] = useState<ModalView>('choice');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (view === 'camera' && !cameraStream) {
      startCamera();
    } else if (view !== 'camera' && cameraStream) {
      stopCamera();
    }

    return () => {
        if(cameraStream) stopCamera();
    };
  }, [view]);


  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStream(stream);
      setCameraError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access was denied. Please enable it in your browser settings.");
    }
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach(track => track.stop());
    setCameraStream(null);
  };
  
  const handleClose = () => {
    stopCamera();
    setView('choice');
    setSelectedImage(null);
    setCameraError(null);
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setView('confirm');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setSelectedImage(canvas.toDataURL('image/png'));
      setView('confirm');
    }
  };

  const handleConfirmImage = () => {
    if (selectedImage) {
      navigate('/spark-results', { state: { image: selectedImage } });
      handleClose();
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    setView('choice');
  };

  if (!isOpen) return null;

  const renderChoiceView = () => (
    <>
      <h2 style={{ textAlign: 'center', color: '#0B3C6A', fontSize: 32, marginBottom: 40 }}>Start a Discovery</h2>
      <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
        <div onClick={() => fileInputRef.current?.click()} style={{ flex: 1, border: '2px dashed #ccc', borderRadius: 16, padding: '40px 20px', textAlign: 'center', cursor: 'pointer' }}>
          <UploadIcon />
          <h3 style={{ color: '#0B3C6A', marginTop: 16 }}>Upload a File</h3>
          <p style={{ color: '#6B7280' }}>Choose an existing photo.</p>
        </div>
        <div onClick={() => setView('camera')} style={{ flex: 1, border: '2px dashed #ccc', borderRadius: 16, padding: '40px 20px', textAlign: 'center', cursor: 'pointer' }}>
          <CameraIcon />
          <h3 style={{ color: '#0B3C6A', marginTop: 16 }}>Take a Picture</h3>
          <p style={{ color: '#6B7280' }}>Use your device's camera.</p>
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
      </div>
    </>
  );

  const renderCameraView = () => (
     <div style={{ textAlign: 'center', width: '100%' }}>
      <h2 style={{ color: '#0B3C6A', fontSize: 32, marginBottom: 24 }}>Align and Capture</h2>
      {cameraError ? (
        <div style={{ padding: '20px', color: '#DC2626', background: '#FEF2F2', borderRadius: 8 }}>{cameraError}</div>
      ) : (
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: 500, borderRadius: 16, border: '2px solid #E5E7EB', background: '#000' }}/>
      )}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32 }}>
        <button onClick={handleCapture} disabled={!!cameraError} style={{ background: '#FF6B2C', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '16px 32px', cursor: 'pointer', opacity: cameraError ? 0.5 : 1 }}>
          Take Picture
        </button>
        <button onClick={() => setView('choice')} style={{ background: '#E5E7EB', color: '#1F2937', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '16px 32px', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );

  const renderConfirmView = () => (
    <>
      <h2 style={{ textAlign: 'center', color: '#0B3C6A', fontSize: 32, marginBottom: 24 }}>Your Selected Image</h2>
      <img src={selectedImage!} alt="Selected" style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: 16, display: 'block', margin: '0 auto' }} />
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 32 }}>
        <button onClick={handleConfirmImage} style={{ background: '#FF6B2C', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '16px 32px', cursor: 'pointer' }}>
          Analyze this Image
        </button>
        <button onClick={resetSelection} style={{ background: '#E5E7EB', color: '#1F2937', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '16px 32px', cursor: 'pointer' }}>
          Choose/Retake
        </button>
      </div>
    </>
  );

  const renderView = () => {
    switch (view) {
      case 'camera': return renderCameraView();
      case 'confirm': return renderConfirmView();
      case 'choice':
      default: return renderChoiceView();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 40, width: '100%', maxWidth: view === 'choice' ? 800 : 600, position: 'relative', transition: 'all 0.3s' }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}>
          &times;
        </button>
        {renderView()}
      </div>
    </div>
  );
};