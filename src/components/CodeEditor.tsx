import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import LanguageSelector from "./LanguageSelector";

interface CodeEditorProps {
  language: string;
  onLanguageChange: (language: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
}

const CodeEditor = ({ language, onLanguageChange, code, onCodeChange }: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Create Monaco editor
    const editor = monaco.editor.create(editorRef.current, {
      value: code,
      language: language === "cpp" ? "cpp" : language,
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
    });

    monacoEditorRef.current = editor;

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      onCodeChange(editor.getValue());
    });

    return () => {
      editor.dispose();
    };
  }, []);

  // Update language when it changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language === "cpp" ? "cpp" : language);
      }
    }
  }, [language]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <LanguageSelector selectedLanguage={language} onLanguageChange={onLanguageChange} />
        <span className="text-sm text-muted-foreground">editor.{language}</span>
      </div>
      <div ref={editorRef} className="flex-1" />
    </div>
  );
};

export default CodeEditor;
