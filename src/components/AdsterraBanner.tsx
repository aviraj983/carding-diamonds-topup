import React, { useEffect, useRef, useState } from 'react';

export const AdsterraBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(728);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
        if (width < 728 && width > 0) {
          setScale(width / 728);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    // Extra checks after layout settles
    const timer1 = setTimeout(handleResize, 150);
    const timer2 = setTimeout(handleResize, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const adHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 728px;
        height: 90px;
        overflow: hidden;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '21b1935a106089a1410d53d22580da62',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    <\/script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/21b1935a106089a1410d53d22580da62/invoke.js"><\/script>
  </body>
</html>`;

  const bannerHeight = Math.max(30, Math.round(90 * scale));

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden flex flex-col items-center justify-center my-3 relative select-none rounded-xl bg-black/30 border border-white/5 py-1"
      id="adsterra-banner-728x90"
    >
      {/* Scaled Banner Container */}
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{
          width: '100%',
          height: `${bannerHeight}px`,
        }}
      >
        <div
          style={{
            width: '728px',
            height: '90px',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            position: 'absolute',
            top: 0,
            left: '50%',
            marginLeft: '-364px',
          }}
        >
          <iframe
            title="Sponsored Advertisement"
            srcDoc={adHtml}
            width="728"
            height="90"
            scrolling="no"
            frameBorder="0"
            style={{
              width: '728px',
              height: '90px',
              border: 'none',
              overflow: 'hidden',
              display: 'block',
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>
    </div>
  );
};
