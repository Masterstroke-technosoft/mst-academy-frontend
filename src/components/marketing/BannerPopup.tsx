'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BannerPopupProps {
  imageSrc?: string;
  destinationUrl?: string;
  altText?: string;
  delayMs?: number;
}

export default function BannerPopup({
  imageSrc = "/pop_up_academy2.jpg",
  destinationUrl = "https://masterstroke.academy/register?ref=BLOCKTALK",
  altText = "Banner Popup",
  delayMs = 1000
}: BannerPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isCloseActive, setIsCloseActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // Inline styling objects
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    pointerEvents: 'none'
  };

  // Backdrop overlay that makes the background elements look transparent/faded
  const backdropStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    pointerEvents: 'auto',
    cursor: 'default',
    transition: 'opacity 0.3s ease'
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '512px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    pointerEvents: 'auto',
    transform: 'scale(1)',
    animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
  };

  const linkStyle: React.CSSProperties = {
    display: 'block',
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    cursor: 'pointer'
  };

  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%'
  };

  const imageStyle: React.CSSProperties = {
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
  };

  const hoverOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0)',
    transition: 'background-color 0.3s ease'
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isCloseHovered ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
    color: '#ffffff',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease',
    transform: isCloseActive ? 'scale(0.95)' : (isCloseHovered ? 'scale(1.1)' : 'scale(1)'),
    zIndex: 10
  };

  const closeIconStyle: React.CSSProperties = {
    width: '16px',
    height: '16px'
  };

  return (
    <div style={overlayStyle}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .banner-popup-backdrop {
          background-color: rgba(0, 0, 0, 0.65) !important;
        }
        @media (prefers-color-scheme: dark) {
          .banner-popup-dark-bg {
            background-color: #09090b !important;
          }
          .banner-popup-backdrop {
            background-color: rgba(0, 0, 0, 0.8) !important;
          }
        }
      `}} />

      {/* Transparent background overlay screen */}
      <div
        className="banner-popup-backdrop"
        style={backdropStyle}
        onClick={handleClose}
      />

      {/* Main Container of the Popup */}
      <div className="banner-popup-dark-bg" style={containerStyle}>

        {/* Clickable Area wrapping the image */}
        <Link
          href={destinationUrl}
          onClick={handleClose}
          style={linkStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={imageWrapperStyle}>
            <Image
              src={imageSrc}
              alt={altText}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              style={imageStyle}
              priority
            />
            {/* Dark overlay that shows up on hover */}
            <div style={hoverOverlayStyle} />
          </div>
        </Link>

        {/* Top-Right "X" Close Button */}
        <button
          onClick={handleClose}
          style={closeButtonStyle}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => {
            setIsCloseHovered(false);
            setIsCloseActive(false);
          }}
          onMouseDown={() => setIsCloseActive(true)}
          onMouseUp={() => setIsCloseActive(false)}
          aria-label="Close popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            style={closeIconStyle}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

      </div>
    </div>
  );
}
