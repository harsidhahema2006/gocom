import { Play, Save, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import gocomLogo from "@/assets/gocom-logo.png";
import { toast } from "sonner";

interface HeaderProps {
  onRun: () => void;
  isRunning: boolean;
}

const Header = ({ onRun, isRunning }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-6">
      <div className="flex items-center gap-3">
        <img src={gocomLogo} alt="GoCom Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold glow-text-cyan">
          Go<span className="text-secondary glow-text-purple">Com</span>
        </h1>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={() => toast.info("Save feature coming soon!")}
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={() => toast.info("Share feature coming soon!")}
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button 
          className="gap-2 bg-gradient-to-r from-primary to-secondary glow-cyan"
          onClick={onRun}
          disabled={isRunning}
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Running..." : "Run Code"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
