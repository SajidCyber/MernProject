import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, HandHeart } from 'lucide-react';

export default function ClaimButton({ status = 'Available', onClick, loading = false }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    if (status !== 'Available' || loading || clicked) return;
    setClicked(true);
    try {
      await onClick?.();
    } catch {
      setClicked(false);
    }
  };

  const isDisabled = status !== 'Available' || loading || clicked;

  const getButtonContent = () => {
    if (loading || clicked) {
      return (
        <>
          <Loader2 size={18} className="spin" />
          Claiming...
        </>
      );
    }
    if (status === 'Available') {
      return (
        <>
          <HandHeart size={18} />
          Claim Food
        </>
      );
    }
    return (
      <>
        <Check size={18} />
        {status}
      </>
    );
  };

  return (
    <motion.button
      className={`btn ${isDisabled ? 'btn-disabled' : 'btn-primary'}`}
      onClick={handleClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      style={{
        opacity: isDisabled && status !== 'Available' ? 0.7 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
    >
      {getButtonContent()}
    </motion.button>
  );
}

// Add spin animation via style
const style = document.createElement('style');
style.textContent = `
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .btn-disabled {
    background: var(--gray-200) !important;
    color: var(--gray-500) !important;
    box-shadow: none !important;
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('claim-btn-styles')) {
  style.id = 'claim-btn-styles';
  document.head.appendChild(style);
}
