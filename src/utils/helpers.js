// Generate random room code
export const generateRoomCode = () => {
  return 'ROOM' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// Escape HTML to prevent XSS
export const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Download file
export const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Get file extension from language
export const getFileExtension = (language) => {
  const extensions = {
    javascript: 'js',
    typescript: 'ts',
    html: 'html',
    css: 'css',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    csharp: 'cs'
  };
  return extensions[language] || 'txt';
};

// Get language from file extension
export const getLanguageFromExtension = (extension) => {
  const languages = {
    js: 'javascript',
    ts: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    cs: 'csharp'
  };
  return languages[extension.toLowerCase()] || 'javascript';
};

// Format code output
export const formatOutput = (output, type = 'info') => {
  const prefixes = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: '📌'
  };
  
  return `${prefixes[type] || ''} ${output}`;
};

// Get user initials
export const getUserInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Check if running in iframe
export const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

// Generate random color
export const getRandomColor = () => {
  const colors = [
    '#2ecc71', '#3498db', '#9b59b6', '#e74c3c',
    '#f39c12', '#1abc9c', '#e67e22', '#95a5a6'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Parse query parameters
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};