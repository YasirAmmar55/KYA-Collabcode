import { useEffect, useRef } from 'react';

export const useMonaco = (initialValue = '', language = 'javascript') => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Monaco
    const loadMonaco = async () => {
      const monaco = await import('monaco-editor');
      
      // Create editor
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: initialValue,
        language: language,
        theme: 'vs-dark',
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
        renderWhitespace: 'selection',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true
      });

      // Add keyboard shortcuts
      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        // Run code
        console.log('Run code');
      });

      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        // Save code
        console.log('Save code');
      });
    };

    loadMonaco();

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        import('monaco-editor').then(monaco => {
          monaco.editor.setModelLanguage(model, language);
        });
      }
    }
  }, [language]);

  const getValue = () => {
    return editorRef.current ? editorRef.current.getValue() : '';
  };

  const setValue = (value) => {
    if (editorRef.current) {
      editorRef.current.setValue(value);
    }
  };

  return {
    containerRef,
    editorRef,
    getValue,
    setValue
  };
};