import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, HandHeart, Clock, XCircle } from 'lucide-react';
import './ClaimButton.css';

export default function ClaimButton({ status = 'Available', onClick, loading = false, claimStatus = null }) {
  const [clicked, setClicked] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    // Don't allow click if already claimed or has pending/approved claim
    if (status !== 'Available' || loading || clicked || claimStatus) return;
    setClicked(true);
    try {
      await onClick?.();
      setSuccess(true);
    } catch {
      setClicked(false);
    }
  };

  // Disable if not available, loading, clicked, or already has a claim
  const isDisabled = status !== 'Available' || loading || clicked || claimStatus;

  const getButtonContent = () => {
    // Show claim status if user already has a claim on this food
    if (claimStatus === 'Pending') {
      return (
        <>
          <Clock size={18} />
          Pending
        </>
      );
    }
    if (claimStatus === 'Approved') {
      return (
        <>
          <Check size={18} />
          Approved
        </>
      );
    }
    if (claimStatus === 'Rejected') {
      return (
        <>
          <XCircle size={18} />
          Rejected
        </>
      );
    }
    if (success) {
      return (
        <>
          <Clock size={18} />
          Pending
        </>
      );
    }
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
      className={`claim-btn ${isDisabled ? 'disabled' : ''} ${success ? 'success' : ''}`}
      onClick={handleClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
    >
      {getButtonContent()}
    </motion.button>
  );
}
