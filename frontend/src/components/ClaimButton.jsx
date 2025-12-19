import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, HandHeart, Clock, AlertCircle } from 'lucide-react';
import './ClaimButton.css';

export default function ClaimButton({ status = 'Available', onClick, loading = false, claimStatus = null, isExpired = false }) {
  const [clicked, setClicked] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    // Don't allow click if expired, not available, loading, clicked, or already has a claim
    if (isExpired || status !== 'Available' || loading || clicked || claimStatus) return;
    setClicked(true);
    try {
      await onClick?.();
      setSuccess(true);
    } catch {
      setClicked(false);
    }
  };

  // Disable if expired, not available, loading, clicked, or already has a claim
  const isDisabled = isExpired || status !== 'Available' || loading || clicked || claimStatus;

  const getButtonContent = () => {
    // Show expired state first
    if (isExpired) {
      return (
        <>
          <AlertCircle size={18} />
          Expired
        </>
      );
    }
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
