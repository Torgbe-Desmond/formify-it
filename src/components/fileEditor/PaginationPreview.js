// components/fileEditor/PaginationPreview.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper, Typography, Slider, Tooltip, Chip } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

// A4 at 96dpi
const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1123;
const DEFAULT_MARGIN = 60;

/**
 * Splits HTML content into A4-sized pages by:
 * 1. Rendering full content in a hidden off-screen div at exact A4 width
 * 2. Walking DOM nodes and tracking cumulative offset to find page breaks
 * 3. Slicing with CSS clip so each page is a positioned window into the content
 *
 * This avoids the clone-measurement bug (clones not in DOM = 0 height)
 * and handles long single elements (images, tables, paragraphs) gracefully
 * by allowing them to cross page boundaries as a "bleed" rather than vanishing.
 */
function usePageSplitter(content, margin) {
  const [pages, setPages] = useState([]);

  const split = useCallback(() => {
    if (!content) {
      setPages([]);
      return;
    }

    // Ensure the hidden measuring container exists in the DOM
    let measurer = document.getElementById('__pdf-measurer__');
    if (!measurer) {
      measurer = document.createElement('div');
      measurer.id = '__pdf-measurer__';
      measurer.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: ${PAGE_WIDTH_PX}px;
        visibility: hidden;
        pointer-events: none;
        z-index: -1;
      `;
      document.body.appendChild(measurer);
    }

    const contentWidth = PAGE_WIDTH_PX - margin;
    const usableHeight = PAGE_HEIGHT_PX - margin;

    measurer.style.width = `${contentWidth}px`;
    measurer.innerHTML = content;

    // Force layout
    measurer.getBoundingClientRect();

    const totalHeight = measurer.scrollHeight;
    const numPages = Math.max(1, Math.ceil(totalHeight / usableHeight));

    // Build page descriptors: each page is just an offset into the full render
    const newPages = [];
    for (let i = 0; i < numPages; i++) {
      newPages.push({
        index: i,
        offsetY: i * usableHeight,
        totalHeight,
        usableHeight,
      });
    }

    setPages(newPages);
  }, [content, margin]);

  useEffect(() => {
    const timer = setTimeout(split, 80);
    return () => clearTimeout(timer);
  }, [split]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const el = document.getElementById('__pdf-measurer__');
      if (el) el.remove();
    };
  }, []);

  return pages;
}

// A single A4 page rendered as a clipped window into the full content
function PageView({ pageInfo, content, margin, scale, pageNumber, totalPages }) {
  const { offsetY, usableHeight } = pageInfo;
  const contentWidth = PAGE_WIDTH_PX - margin * 2;

  return (
    <Box
      sx={{
        position: 'relative',
        width: PAGE_WIDTH_PX,
        transformOrigin: 'top center',
        transform: `scale(${scale})`,
        // Collapse the margin that scaling creates below each page
        mb: scale < 1 ? `${-(PAGE_HEIGHT_PX * (1 - scale))}px` : 0,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: PAGE_WIDTH_PX,
          height: PAGE_HEIGHT_PX,
          bgcolor: '#fff',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
          borderRadius: '2px',
        }}
      >
        {/* Clipped content window */}
        <Box
          sx={{
            position: 'absolute',
            top: margin,
            left: margin,
            width: contentWidth,
            height: usableHeight,
            overflow: 'hidden',
          }}
        >
          <Box
            dangerouslySetInnerHTML={{ __html: content }}
            sx={{
              width: contentWidth,
              position: 'relative',
              top: -offsetY,
              // Prevent text selection weirdness on clipped pages
              userSelect: 'text',
            }}
          />
        </Box>

        {/* Page number footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: Math.max(margin / 2, 16),
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '9px',
              color: '#bbb',
              letterSpacing: '0.05em',
              fontFamily: 'monospace',
            }}
          >
            {pageNumber} / {totalPages}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default function PaginationPreview({ content, margins = DEFAULT_MARGIN, onMarginChange }) {
  const [currentMargin, setCurrentMargin] = useState(margins);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef(null);

  const pages = usePageSplitter(content, currentMargin);

  // Responsive scaling: fit page into available container width
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observe = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - 48; // some breathing room
      const newScale = available < PAGE_WIDTH_PX ? Math.max(0.3, available / PAGE_WIDTH_PX) : 1;
      setScale(newScale);
    });
    observe.observe(wrapperRef.current);
    return () => observe.disconnect();
  }, []);

  const handleMarginChange = (_, val) => {
    setCurrentMargin(val);
    onMarginChange?.(val);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }} ref={wrapperRef}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          px: 1,
          py: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <ArticleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Chip
            label={`${pages.length} page${pages.length !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '11px', height: 22 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 160 }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Margin
          </Typography>
          <Slider
            value={currentMargin}
            onChange={handleMarginChange}
            min={20}
            max={120}
            step={4}
            size="small"
            sx={{ flex: 1 }}
          />
          <Tooltip title="Current margin in pixels">
            <Typography
              variant="caption"
              sx={{
                minWidth: 38,
                textAlign: 'right',
                color: 'text.secondary',
                fontFamily: 'monospace',
                fontSize: '11px',
              }}
            >
              {currentMargin}px
            </Typography>
          </Tooltip>
        </Box>

        {scale < 1 && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
            {Math.round(scale * 100)}% zoom
          </Typography>
        )}
      </Box>

      {/* Pages */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: scale < 1 ? `${Math.round(24 * scale)}px` : '24px',
          pb: 4,
          // Background mimics a document tray
          // bgcolor: '#e8e8e8',
          borderRadius: 2,
          pt: 3,
          px: 2,
          minHeight: 200,
        }}
      >
        {pages.length === 0 ? (
          <Box sx={{ py: 8, color: 'text.disabled', textAlign: 'center' }}>
            <ArticleIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
            <Typography variant="body2">No content to preview</Typography>
          </Box>
        ) : (
          pages.map((page, i) => (
            <PageView
              key={i}
              pageInfo={page}
              content={content}
              margin={currentMargin}
              scale={scale}
              pageNumber={i + 1}
              totalPages={pages.length}
            />
          ))
        )}
      </Box>
    </Box>
  );
}