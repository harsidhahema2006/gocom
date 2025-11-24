import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Piston API language mappings
const languageMap: Record<string, { language: string; version?: string }> = {
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "c++", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
  csharp: { language: "csharp", version: "6.12.0" },
  go: { language: "go", version: "1.16.2" },
  rust: { language: "rust", version: "1.68.2" },
  php: { language: "php", version: "8.2.3" },
  ruby: { language: "ruby", version: "3.0.1" },
  kotlin: { language: "kotlin", version: "1.8.20" },
  swift: { language: "swift", version: "5.3.3" },
  r: { language: "r", version: "4.1.1" },
  perl: { language: "perl", version: "5.36.0" },
  lua: { language: "lua", version: "5.4.4" },
  haskell: { language: "haskell", version: "9.0.1" },
  scala: { language: "scala", version: "3.2.2" },
  dart: { language: "dart", version: "2.19.6" },
  elixir: { language: "elixir", version: "1.11.3" },
  clojure: { language: "clojure", version: "1.10.3" },
  fsharp: { language: "fsharp", version: "5.0.201" },
  groovy: { language: "groovy", version: "3.0.7" },
  lisp: { language: "commonlisp", version: "2.1.2" },
  cobol: { language: "cobol", version: "3.1.2" },
  fortran: { language: "fortran", version: "10.2.0" },
  julia: { language: "julia", version: "1.8.5" },
  nim: { language: "nim", version: "1.6.14" },
  ocaml: { language: "ocaml", version: "4.12.0" },
  pascal: { language: "pascal", version: "3.2.2" },
  prolog: { language: "prolog", version: "8.4.3" },
  racket: { language: "racket", version: "8.3.0" },
  scheme: { language: "scheme", version: "9.5.1" },
  bash: { language: "bash", version: "5.2.0" },
  sql: { language: "sqlite3", version: "3.36.0" },
  assembly: { language: "nasm", version: "2.15.5" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();
    
    console.log("Code execution request:", { language, codeLength: code.length });

    const langConfig = languageMap[language.toLowerCase()];
    
    if (!langConfig) {
      return new Response(
        JSON.stringify({ 
          output: `Language "${language}" is not supported.\n\nSupported languages: ${Object.keys(languageMap).join(", ")}`,
          success: false 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Execute code using Piston API
    const pistonResponse = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            content: code,
          },
        ],
      }),
    });

    if (!pistonResponse.ok) {
      throw new Error(`Piston API error: ${pistonResponse.status}`);
    }

    const result = await pistonResponse.json();
    
    console.log("Piston result:", result);

    let output = "";
    let success = true;

    // Check for compilation or runtime errors
    if (result.compile && result.compile.code !== 0) {
      success = false;
      output = `Compilation Error:\n${result.compile.stderr || result.compile.output}`;
    } else if (result.run.code !== 0) {
      success = false;
      output = `Runtime Error:\n${result.run.stderr || result.run.output}`;
    } else {
      // Successful execution
      const stdout = result.run.stdout || "";
      const stderr = result.run.stderr || "";
      
      if (stdout) {
        output = stdout;
      } else if (stderr) {
        output = stderr;
      } else {
        output = "Program executed successfully with no output.";
      }
    }

    console.log("Code execution completed:", { success });
    
    return new Response(
      JSON.stringify({ output, success }),
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
        output: `Execution Error: ${e instanceof Error ? e.message : "Failed to execute code"}`,
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
