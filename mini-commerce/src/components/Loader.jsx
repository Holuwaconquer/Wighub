import React, { useState, useEffect, useRef } from "react";
import "./loader.css";

const Loader = ({ 
  subtitle = "Minka Luxury Hair", 
  logo = "/minka2.png",
  duration = 4000 // milliseconds
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressRef = useRef(0);
  const animationRef = useRef(null);

  // ─── Haptic Feedback (optional - mobile only) ───
  const triggerHaptic = (pattern = 'light') => {
    if (navigator.vibrate) {
      if (pattern === 'light') {
        navigator.vibrate(5);
      } else if (pattern === 'complete') {
        navigator.vibrate([10, 50, 10, 50, 20]);
      }
    }
  };

  // ─── Progress Animation ───
  useEffect(() => {
    const startTime = performance.now();
    const totalDuration = duration;

    const updateProgress = (timestamp) => {
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / totalDuration, 1);
      
      // Ease in-out cubic for smooth feel
      const eased = rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
      
      const currentProgress = Math.round(eased * 100);
      
      if (currentProgress !== progressRef.current) {
        const increment = currentProgress - progressRef.current;
        
        // Trigger haptic on milestone increments
        if (increment >= 5 && currentProgress % 5 === 0) {
          triggerHaptic('light');
        }
        
        progressRef.current = currentProgress;
        setProgress(currentProgress);
      }
      
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(updateProgress);
      } else {
        setIsComplete(true);
        triggerHaptic('complete');
        // Dispatch event for parent to know loading is done
        window.dispatchEvent(new CustomEvent('loaderComplete'));
      }
    };

    animationRef.current = requestAnimationFrame(updateProgress);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration]);

  // ─── Render ───
  return (
    <div className={`loader-overlay ${isComplete ? 'loader-complete' : ''}`}>
      {/* Animated gradient background */}
      <div className="bg-gradient-animation">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`particle particle-${i + 1}`} 
            style={{ 
              '--delay': `${Math.random() * 6}s`,
              '--duration': `${6 + Math.random() * 4}s`,
              '--size': `${3 + Math.random() * 5}px`
            }} 
          />
        ))}
      </div>

      <div className="loader-content">
        {/* Outer decorative rings */}
        <div className="outer-rings">
          <div className="orbit-ring ring-1" />
          <div className="orbit-ring ring-2" />
          <div className="orbit-ring ring-3" />
        </div>

        {/* Main logo container */}
        <div className="logo-wrap">
          <div className="glass-bg" />
          <div className="glass-shimmer" />
          
          <img src={logo} alt="Minka" className="loader-logo" />
          
          {/* Animated glow layers */}
          <div className="glow-pulse" />
          <div className="glow-ring-outer" />
          
          {/* Rotating accent rings */}
          <div className="accent-ring ring-gold" />
          <div className="accent-ring ring-rose" />
        </div>

        {/* Subtitle with shimmer */}
        <div className="text-content">
          <p className="loader-subtitle">{subtitle}</p>
          <div className="shimmer-line" />
        </div>

        {/* ─── PROGRESS INDICATOR ─── */}
        <div className="progress-container">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              <div className="progress-glow" />
            </div>
            <div className="progress-sparkle" style={{ left: `${progress}%` }} />
          </div>
          
          <div className="progress-info">
            <span className="progress-percentage">{progress}%</span>
            {/* <div className="progress-status">
              {progress < 30 && '✨ Preparing'}
              {progress >= 30 && progress < 60 && '🌟 Curating'}
              {progress >= 60 && progress < 90 && '💫 Perfecting'}
              {progress >= 90 && progress < 100 && '✨ Almost there'}
              {progress === 100 && '🎉 Complete!'}
            </div> */}
          </div>
        </div>

        {/* Elegant divider with diamond */}
        <div className="divider-container">
          <span className="divider-line" />
          <span className="divider-diamond">◆</span>
          <span className="divider-line" />
        </div>
      </div>
    </div>
  );
};

export default Loader;