/* Editor.jsx - REAL-TIME COLLABORATION VERSION */
// 🔴 CHANGES: forwardRef, socket integration, cursor tracking, typing indicators
// 🔴 ICONS ONLY: Run, Save, Clear buttons show only icons, no text

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { FaPlay, FaSave, FaTrash } from 'react-icons/fa';
import './Editor.css';

const Editor = forwardRef(({ user, role, showToast, socket, roomId }, ref) => {
  
  // ========== EXISTING STATES ==========
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('script.js');
  const [code, setCode] = useState(`// Welcome to CollabCode!
// Write your JavaScript code here

console.log("Hello, World!");

// Simple function
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("CollabCode"));

// Simple calculation
let a = 10;
let b = 5;
console.log(a + " + " + b + " = " + (a + b));`);

  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Welcome to CollabCode!</h1>
    <p>This is a simple HTML page.</p>
    <button onclick="sayHello()">Click Me</button>
    
    <script src="script.js"></script>
</body>
</html>`);
  
  const [cssCode, setCssCode] = useState(`/* CSS Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #2ecc71;
    text-align: center;
}

p {
    color: #333;
    font-size: 16px;
    line-height: 1.5;
}

button {
    background-color: #2ecc71;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #27ae60;
}`);

  const [jsCode, setJsCode] = useState(`// JavaScript Code
console.log("Hello, World!");

function sayHello() {
    alert("Hello from JavaScript!");
    console.log("Button clicked!");
}

function addNumbers(x, y) {
    return x + y;
}

let result = addNumbers(5, 3);
console.log("5 + 3 = " + result);

for(let i = 1; i <= 5; i++) {
    console.log("Number: " + i);
}`);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // ========== NEW STATES FOR REAL-TIME ==========
  const [isConnected, setIsConnected] = useState(false);
  const [otherCursors, setOtherCursors] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const isLocalChange = useRef(false);
  const typingTimeoutRef = useRef(null);

  // Languages with proper file names
  const languages = [
    { value: 'html', label: 'HTML', extension: 'html', fileName: 'index.html' },
    { value: 'css', label: 'CSS', extension: 'css', fileName: 'style.css' },
    { value: 'javascript', label: 'JavaScript', extension: 'js', fileName: 'script.js' }
  ];

  // Update code when switching languages
  useEffect(() => {
    if (language === 'html') {
      setCode(htmlCode);
    } else if (language === 'css') {
      setCode(cssCode);
    } else if (language === 'javascript') {
      setCode(jsCode);
    }
  }, [language]);

  // EXPOSE METHODS TO PARENT COMPONENT
  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() || code,
    setValue: (newCode) => {
      if (editorRef.current) {
        editorRef.current.setValue(newCode);
      }
      setCode(newCode);
    },
    getLanguage: () => language
  }));

  // SOCKET LISTENERS FOR REAL-TIME SYNC
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('code-update', (data) => {
      if (!isLocalChange.current && data.userId !== socket.id) {
        const newCode = data.code;
        setCode(newCode);
        if (editorRef.current) {
          editorRef.current.setValue(newCode);
        }
        showToast(`${data.userName} made changes`);
      }
      isLocalChange.current = false;
    });

    socket.on('cursor-update', (data) => {
      if (data.userId !== socket.id) {
        setOtherCursors(prev => ({
          ...prev,
          [data.userId]: { ...data.cursor, name: data.userName }
        }));
      }
    });

    socket.on('user-typing', (data) => {
      if (data.userId !== socket.id) {
        setTypingUsers(prev => {
          const exists = prev.find(u => u.id === data.userId);
          if (!exists && data.isTyping) {
            return [...prev, { id: data.userId, name: data.userName }];
          } else if (!data.isTyping) {
            return prev.filter(u => u.id !== data.userId);
          }
          return prev;
        });
        
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u.id !== data.userId));
        }, 2000);
      }
    });

    return () => {
      socket.off('code-update');
      socket.off('cursor-update');
      socket.off('user-typing');
    };
  }, [socket, showToast]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((e) => {
      if (socket && isConnected && roomId) {
        socket.emit('cursor-move', {
          roomId: roomId,
          userId: socket.id,
          userName: user?.name || 'User',
          cursor: {
            line: e.position.lineNumber,
            column: e.position.column
          }
        });
      }
    });

    editor.onDidChangeModelContent(() => {
      handleTyping();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveCode();
    });
  };

  const handleTyping = () => {
    if (socket && isConnected && roomId) {
      socket.emit('typing-start', {
        roomId: roomId,
        userId: socket.id,
        userName: user?.name || 'User'
      });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing-stop', {
          roomId: roomId,
          userId: socket.id
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const decorations = [];
    
    Object.entries(otherCursors).forEach(([userId, cursor]) => {
      decorations.push({
        range: new monacoRef.current.Range(cursor.line, cursor.column, cursor.line, cursor.column),
        options: {
          className: 'remote-cursor',
          hoverMessage: { value: `${cursor.name} is here` },
          showIfCollapsed: true
        }
      });
    });
    
    editorRef.current.deltaDecorations([], decorations);
  }, [otherCursors]);

  const handleLanguageChange = (e) => {
    if (language === 'html') {
      setHtmlCode(code);
    } else if (language === 'css') {
      setCssCode(code);
    } else if (language === 'javascript') {
      setJsCode(code);
    }
    
    const newLang = e.target.value;
    setLanguage(newLang);
    
    const lang = languages.find(l => l.value === newLang);
    setFileName(lang.fileName);
    
    if (newLang === 'html') {
      setCode(htmlCode);
    } else if (newLang === 'css') {
      setCode(cssCode);
    } else if (newLang === 'javascript') {
      setCode(jsCode);
    }
    
    showToast(`Switched to ${lang.label} (${lang.fileName})`);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    isLocalChange.current = true;
    
    if (language === 'html') {
      setHtmlCode(newCode);
    } else if (language === 'css') {
      setCssCode(newCode);
    } else if (language === 'javascript') {
      setJsCode(newCode);
    }
    
    if (socket && isConnected && roomId) {
      socket.emit('code-change', {
        roomId: roomId,
        code: newCode,
        userId: socket.id,
        userName: user?.name || 'User',
        language: language
      });
    }
  };

  const handleRunCode = () => {
    const outputFrame = document.getElementById('output-frame');
    const outputContent = document.getElementById('output-content');
    
    if (language === 'html') {
      let combinedHTML = htmlCode;
      
      if (combinedHTML.includes('href="style.css"')) {
        combinedHTML = combinedHTML.replace(
          '<link rel="stylesheet" href="style.css">',
          `<style>\n${cssCode}\n</style>`
        );
      }
      
      if (combinedHTML.includes('src="script.js"')) {
        combinedHTML = combinedHTML.replace(
          '<script src="script.js"></script>',
          `<script>\n${jsCode}\n</script>`
        );
      }
      
      const blob = new Blob([combinedHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      outputFrame.src = url;
      outputFrame.style.display = 'block';
      outputContent.style.display = 'none';
      
      outputFrame.onload = () => {
        URL.revokeObjectURL(url);
      };
      
      showToast('Website preview with CSS and JavaScript!');
      
    } else if (language === 'css') {
      const previewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <style>
        ${cssCode}
    </style>
</head>
<body>
    <h1>CSS Style Preview</h1>
    <p>This paragraph shows your CSS styling.</p>
    <button>Styled Button</button>
    <div>
        <p>Another element with your styles.</p>
    </div>
</body>
</html>`;
      
      const blob = new Blob([previewHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      outputFrame.src = url;
      outputFrame.style.display = 'block';
      outputContent.style.display = 'none';
      
      outputFrame.onload = () => {
        URL.revokeObjectURL(url);
      };
      
      showToast('CSS preview updated!');
      
    } else if (language === 'javascript') {
      outputFrame.style.display = 'none';
      outputContent.style.display = 'block';
      
      const originalConsole = { ...console };
      const logs = [];
      
      console.log = (...args) => {
        logs.push(`📌 ${args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')}`);
        originalConsole.log(...args);
      };
      
      console.error = (...args) => {
        logs.push(`❌ ${args.join(' ')}`);
        originalConsole.error(...args);
      };
      
      console.warn = (...args) => {
        logs.push(`⚠️ ${args.join(' ')}`);
        originalConsole.warn(...args);
      };
      
      console.info = (...args) => {
        logs.push(`ℹ️ ${args.join(' ')}`);
        originalConsole.info(...args);
      };
      
      try {
        const result = eval(jsCode);
        
        let outputText = '';
        if (logs.length > 0) {
          outputText = logs.join('\n');
        }
        if (result !== undefined && logs.length === 0) {
          outputText = `📤 Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`;
        }
        
        if (!outputText) {
          outputText = '✅ Code executed successfully (no output)';
        }
        
        outputContent.innerHTML = outputText.replace(/\n/g, '<br>');
        
      } catch (error) {
        outputContent.innerHTML = `❌ Error: ${error.message}<br><br>Stack trace:<br>${error.stack}`;
      } finally {
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
      }
    }
  };

  const handleSaveCode = () => {
    const currentCode = editorRef.current?.getValue() || code;
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Code saved as ${fileName}`);
  };

  const handleClearCode = () => {
    if (editorRef.current) {
      editorRef.current.setValue('');
    } else {
      setCode('');
    }
    
    if (language === 'html') {
      setHtmlCode('');
    } else if (language === 'css') {
      setCssCode('');
    } else if (language === 'javascript') {
      setJsCode('');
    }
    
    showToast('Editor cleared');
  };

  // ========== RENDER COMPONENT - ICONS ONLY (No Text Labels) ==========
  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="file-info">
          <i className="fas fa-file-code"></i>
          <span className="file-name">{fileName}</span>
          <span className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Live' : '○ Offline'}
          </span>
        </div>
        
        <div className="editor-toolbar">
          <select 
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          
          {/* 🔴 ICON ONLY - Run Button */}
          <button className="btn btn-primary" onClick={handleRunCode} title="Run (Ctrl+Enter)">
            <FaPlay />
          </button>
          
          {/* 🔴 ICON ONLY - Save Button */}
          <button className="btn btn-outline" onClick={handleSaveCode} title="Save (Ctrl+S)">
            <FaSave />
          </button>
          
          {/* 🔴 ICON ONLY - Clear Button */}
          <button className="btn btn-outline" onClick={handleClearCode} title="Clear Editor">
            <FaTrash />
          </button>
        </div>
      </div>

      {/* TYPING INDICATOR */}
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.map(u => u.name).join(', ')} is typing...
        </div>
      )}

      <div className="editor-wrapper">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            readOnly: role === 'student' ? false : false,
            renderWhitespace: 'selection',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true
          }}
        />
      </div>
    </div>
  );
});

export default Editor;