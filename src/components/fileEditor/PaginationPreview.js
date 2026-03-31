// components/fileEditor/PaginationPreview.jsx
import { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';

const PAGE_WIDTH = 794;   // A4 at 96dpi ≈ 794px
const PAGE_HEIGHT = 1123; // A4 at 96dpi ≈ 1123px
const DEFAULT_MARGIN = 60;

export default function PaginationPreview({
  content,
  margins = DEFAULT_MARGIN,
  onMarginChange
}) {
  const containerRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [currentMargins, setCurrentMargins] = useState(margins);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - 32;
      setScale(available < PAGE_WIDTH ? available / PAGE_WIDTH : 1);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!content) { setPages([]); return; }

    const splitIntoPages = () => {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = content;
      tempContainer.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: ${PAGE_WIDTH - currentMargins * 2}px;
      `;
      document.body.appendChild(tempContainer);

      const pageElements = [];
      let currentPageContent = [];
      let currentHeight = 0;
      const usableHeight = PAGE_HEIGHT - currentMargins * 2;

      Array.from(tempContainer.children).forEach((child) => {
        const clone = child.cloneNode(true);
        const height = clone.getBoundingClientRect().height || 40;

        if (currentHeight + height > usableHeight) {
          pageElements.push([...currentPageContent]);
          currentPageContent = [clone];
          currentHeight = height;
        } else {
          currentPageContent.push(clone);
          currentHeight += height;
        }
      });

      if (currentPageContent.length > 0) pageElements.push(currentPageContent);

      document.body.removeChild(tempContainer);

      setPages(
        pageElements.map(pageChildren => {
          const div = document.createElement('div');
          pageChildren.forEach(child => div.appendChild(child));
          return div.innerHTML;
        })
      );
    };

    const timeout = setTimeout(splitIntoPages, 50);
    return () => clearTimeout(timeout);
  }, [content, currentMargins]);

  const handleMarginChange = (newMargin) => {
    setCurrentMargins(newMargin);
    if (onMarginChange) onMarginChange(newMargin);
  };

  return (
    <Box sx={{ position: 'relative', py: 4 }}>
      {/* Margin Controls (top-right) */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 20,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.paper',
        p: 0.5,
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Typography variant="caption" color="text.secondary">Margin:</Typography>
        <input
          type="range"
          min="20"
          max="120"
          value={currentMargins}
          onChange={(e) => handleMarginChange(Number(e.target.value))}
          style={{ width: 100 }}
        />
        <Typography variant="caption" sx={{ minWidth: 30 }}>
          {currentMargins}px
        </Typography>
      </Box>

      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          alignItems: 'center',
          width: '100%',
        }}
      >
        {pages.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            No content to preview
          </Paper>
        ) : (
          pages.map((pageHtml, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                width: PAGE_WIDTH,
                minHeight: PAGE_HEIGHT,
                bgcolor: '#fff',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                p: `${currentMargins}px`,
                transformOrigin: 'top',
                transform: `scale(${scale})`,
                '&:before': {
                  content: `"Page ${index + 1}"`,
                  position: 'absolute',
                  top: 12,
                  right: 20,
                  fontSize: '10px',
                  color: '#888',
                  opacity: 0.6,
                }
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: pageHtml }}
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden'
                }}
              />
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
}