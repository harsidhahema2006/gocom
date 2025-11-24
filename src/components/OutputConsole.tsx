import { Terminal, CheckCircle2, XCircle } from "lucide-react";

interface OutputConsoleProps {
  output: string;
  success?: boolean;
}

const OutputConsole = ({ output, success }: OutputConsoleProps) => {
  const hasOutput = output && output !== "";
  const isRunning = output === "// Running code...\n";
  
  return (
    <div className="h-full flex flex-col bg-card/30">
      <div className="flex items-center gap-2 p-4 border-b border-border bg-card/50">
        <Terminal className="w-4 h-4 text-neon-green" />
        <span className="text-sm font-semibold text-neon-green">Output Console</span>
        {hasOutput && !isRunning && (
          success ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500 ml-auto" />
          )
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className={`text-sm font-mono whitespace-pre-wrap ${
          !hasOutput ? "text-muted-foreground" : 
          success ? "text-foreground" : "text-red-400"
        }`}>
          {output || "// Run your code to see output here..."}
        </pre>
      </div>
    </div>
  );
};

export default OutputConsole;
