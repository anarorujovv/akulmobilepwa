import React from 'react';
import useTheme from '../theme/useTheme';

const MyPagination = ({ itemSize, page, setPage, pageSize }) => {
  const theme = useTheme();
  const totalPages = Math.ceil(itemSize / pageSize);

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          style={{
            padding: '5px 10px',
            margin: '0 2px',
            border: `1px solid ${theme.primary}`,
            backgroundColor: i === page ? theme.primary : theme.bg,
            color: i === page ? theme.bg : theme.primary,
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          style={{
            padding: '5px 10px',
            margin: '0 2px',
            border: `1px solid ${theme.primary}`,
            backgroundColor: theme.bg,
            color: theme.primary,
            borderRadius: 2,
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.5 : 1,
            fontSize: 12
          }}
        >
          &lt;
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          style={{
            padding: '5px 10px',
            margin: '0 2px',
            border: `1px solid ${theme.primary}`,
            backgroundColor: theme.bg,
            color: theme.primary,
            borderRadius: 2,
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            opacity: page === totalPages ? 0.5 : 1,
            fontSize: 12
          }}
        >
          &gt;
        </button>
      </div>
      <div style={{ margin: 20 }} />
    </div>
  );
};

export default MyPagination;