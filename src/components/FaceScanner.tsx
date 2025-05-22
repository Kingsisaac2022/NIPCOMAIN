import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, RefreshCw } from 'lucide-react';
import Button from './Button';

interface FaceScannerProps {
  onCapture: (imageSrc: string) => void;
  label?: string;
  required?: boolean;
}

const FaceScanner: React.FC<FaceScannerProps> = ({
  onCapture,
  label = "Face Verification",
  required = false,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startCapture = async () => {
    setIsCapturing(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCapturing(false);
    }
  };
  
  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/png');
        setCapturedImage(imageSrc);
        onCapture(imageSrc);
        stopCapture();
      }
    }
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
    startCapture();
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);
  
  return (
    <div className="mb-4">
      <label className="label">
        {label} {required && <span className="text-error">*</span>}
      </label>
      
      <div className="border-2 border-gray-700 rounded-lg p-4">
        {!isCapturing && !capturedImage ? (
          <div className="text-center py-8">
            <Button 
              onClick={startCapture} 
              icon={<Camera size={20} />}
            >
              Start Camera
            </Button>
          </div>
        ) : isCapturing ? (
          <div className="flex flex-col items-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="rounded-lg max-h-64 mb-4"
            />
            <div className="flex gap-4">
              <Button 
                onClick={captureImage} 
                variant="primary"
                icon={<Camera size={20} />}
              >
                Capture
              </Button>
              <Button 
                onClick={stopCapture} 
                variant="outline"
                icon={<X size={20} />}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : capturedImage ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="rounded-lg max-h-64" 
              />
              <div className="absolute top-2 right-2 bg-success text-white p-1 rounded-full">
                <Check size={16} />
              </div>
            </div>
            <Button 
              onClick={resetCapture} 
              variant="outline"
              icon={<RefreshCw size={20} />}
            >
              Retake
            </Button>
          </div>
        ) : null}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaceScanner;