'use client';

import { useEffect, useState } from 'react';

/**
 * Component to display advertisements or GIFs during loading
 */
export default function LoadingAds(): JSX.Element {
  // Array of ASCII art advertisements
  const asciiAds = [
    `
[ UNDERGROUND TECHNO ]
[ LIVE PERFORMANCES  ]
[ EVERY FRIDAY      ]`,
    `
[ NEW RELEASE      ]
[ "VorteX"   ]
[ NEURAL NETWORK   ]`,
    `
[ TOKEN HOLDERS    ]
[ EXCLUSIVE ACCESS ]
[ SECRET ROOMS     ]`,
    `
[ Cult of Beats  ]
[ MINT PASSPORT    ]
[ BACKSPACE.XYZ    ]`
  ];

  // State for current ad
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Rotate ads every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % asciiAds.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [asciiAds.length]);

  return (
    <div className="loading-ads">
      <pre>{asciiAds[currentAdIndex]}</pre>
      
      <style jsx>{`
        .loading-ads {
          margin-top: 1rem;
          padding: 0.5rem;
          border: none;
          max-width: 100%;
          overflow: hidden;
          opacity: 0.7;
        }
        
        pre {
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: var(--font-size-small);
          text-align: center;
          white-space: pre;
          margin: 0;
          line-height: 1.4;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
