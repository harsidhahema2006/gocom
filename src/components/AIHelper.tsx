import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Zap, Code, CheckCircle2, Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useAIChat } from "@/hooks/useAIChat";

interface AIHelperProps {
  code: string;
  language: string;
}

const AIHelper = ({ code, language }: AIHelperProps) => {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { icon: Zap, label: "Fix Errors", color: "text-destructive", action: "fix" },
    { icon: Code, label: "Optimize", color: "text-neon-cyan", action: "optimize" },
    { icon: Languages, label: "Convert Language", color: "text-secondary", action: "convert" },
    { icon: CheckCircle2, label: "Generate Tests", color: "text-neon-green", action: "test" },
  ];

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleQuickAction = (action: string, label: string) => {
    const prompt = `${label} this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    sendMessage(prompt, action);
  };

  return (
    <div className="h-full flex flex-col bg-card/30 border-l border-border">
      <div className="flex items-center gap-2 p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
        <Sparkles className="w-5 h-5 text-primary glow-cyan" />
        <span className="font-bold text-lg">GoCom IntelliFix</span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 border-b border-border">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            className="gap-2 border-primary/30 hover:border-primary hover:glow-cyan"
            onClick={() => handleQuickAction(action.action, action.label)}
            disabled={isLoading || !code.trim()}
          >
            <action.icon className={`w-4 h-4 ${action.color}`} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <Card
              key={idx}
              className={`p-3 ${
                message.role === "user"
                  ? "bg-primary/10 border-primary/30 ml-4"
                  : "bg-card border-secondary/30 mr-4"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </Card>
          ))}
          {isLoading && (
            <Card className="p-3 bg-card border-secondary/30 mr-4">
              <p className="text-sm text-muted-foreground animate-pulse">Thinking...</p>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-input border-primary/30 focus:border-primary"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-gradient-to-r from-primary to-secondary glow-cyan"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIHelper;
