import { useState } from "react";
import Header from "@/components/Header";
import CodeEditor from "@/components/CodeEditor";
import OutputConsole from "@/components/OutputConsole";
import AIHelper from "@/components/AIHelper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { toast } from "sonner";

const defaultCode = `// Welcome to GoCom - Your Futuristic Online Compiler
// Select a language and start coding!

function greet(name) {
  console.log("Hello, " + name + "!");
  console.log("Welcome to GoCom - Where Code Meets AI");
}

greet("Developer");`;

const Index = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean | undefined>(undefined);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("// Running code...\n");

    try {
      const EXECUTE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-code`;
      
      const response = await fetch(EXECUTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOutput(data.output || "// No output");
        setExecutionSuccess(data.success !== false);
        if (data.success !== false) {
          toast.success("Code executed successfully!");
        } else {
          toast.error("Code execution failed");
        }
      } else {
        setOutput(data.output || `Error: ${data.error || "Failed to execute code"}`);
        setExecutionSuccess(false);
        toast.error("Code execution failed");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Network error";
      setOutput(`Error: ${errorMsg}`);
      toast.error("Failed to connect to execution server");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header 
        onRun={handleRunCode} 
        isRunning={isRunning}
        code={code}
        language={language}
        output={output}
      />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65} minSize={30}>
              <CodeEditor
                language={language}
                onLanguageChange={setLanguage}
                code={code}
                onCodeChange={setCode}
              />
            </ResizablePanel>
            <ResizableHandle className="bg-border" />
            <ResizablePanel defaultSize={35} minSize={20}>
              <OutputConsole output={output} success={executionSuccess} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        
        <ResizableHandle className="bg-primary/30 w-1" />
        
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <AIHelper code={code} language={language} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
