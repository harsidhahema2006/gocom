import { Terminal } from "lucide-react";

interface OutputConsoleProps {
  output: string;
}

const OutputConsole = ({ output }: OutputConsoleProps) => {
  return (
    <div className="h-full flex flex-col bg-card/30">
      <div className="flex items-center gap-2 p-4 border-b border-border bg-card/50">
        <Terminal className="w-4 h-4 text-neon-green" />
        <span className="text-sm font-semibold text-neon-green">Output Console</span>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
          {output || "// Run your code to see output here..."}
        </pre>
      </div>
    </div>
  );
};

export default OutputConsole;
