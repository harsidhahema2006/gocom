import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();
    
    console.log("Code execution request:", { language, codeLength: code.length });

    // Language mappings
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      python: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      go: "go",
      rust: "rust",
      typescript: "typescript",
      php: "php",
      ruby: "ruby",
      kotlin: "kotlin",
      swift: "swift",
      r: "r",
      sql: "sql",
      html: "html",
    };

    const normalizedLanguage = languageMap[language] || language;

    // For now, simulate code execution with helpful messages
    // In production, this would use Docker containers for secure sandboxed execution
    let output = "";
    
    if (normalizedLanguage === "javascript" || normalizedLanguage === "typescript") {
      // For demo: try to execute simple JS code safely
      try {
        // Simple console.log capture for demo purposes
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => logs.push(args.join(" ")),
        };
        
        // Very basic eval (NOT SAFE FOR PRODUCTION - needs proper sandboxing)
        const safeCode = code.replace(/console\.log/g, "mockConsole.log");
        const func = new Function("mockConsole", safeCode);
        func(mockConsole);
        
        output = logs.join("\n") || "Code executed successfully (no output)";
      } catch (error) {
        output = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    } else {
      // For other languages, provide information about backend requirements
      output = `🚀 GoCom Code Execution\n\n` +
        `Language: ${normalizedLanguage}\n` +
        `Code length: ${code.length} characters\n\n` +
        `⚠️ Full execution engine coming soon!\n\n` +
        `For production deployment, GoCom will use Docker containers to:\n` +
        `✓ Compile and run code in isolated sandboxes\n` +
        `✓ Support 45+ programming languages\n` +
        `✓ Capture stdout, stderr, and exit codes\n` +
        `✓ Enforce time limits and resource constraints\n\n` +
        `Current demo: JavaScript execution is partially working above.`;
    }

    console.log("Code execution completed");
    
    return new Response(
      JSON.stringify({ output }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Code execution error:", e);
    return new Response(
      JSON.stringify({ 
        error: e instanceof Error ? e.message : "Unknown error",
        output: `Error: ${e instanceof Error ? e.message : "Failed to execute code"}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
