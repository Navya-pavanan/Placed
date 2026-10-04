import React from 'react';

/**
 * PlacedWatermark
 * ---------------
 * Renders a subtle PLACED wordmark watermark centered in the main content area.
 * Uses placeduplogo.jpg (white-background wordmark) so the background blends
 * seamlessly with the light page background at low opacity.
 */
const PlacedWatermark = () => (
  <div className="watermark-container">
    <img src="/placeduplogo.jpg" alt="" className="placed-bg-watermark" aria-hidden="true" />
  </div>
);

export default PlacedWatermark;
