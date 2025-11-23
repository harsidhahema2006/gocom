import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const languages = [
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "python", name: "Python", icon: "PY" },
  { id: "java", name: "Java", icon: "JAVA" },
  { id: "cpp", name: "C++", icon: "C++" },
  { id: "c", name: "C", icon: "C" },
  { id: "go", name: "Go", icon: "GO" },
  { id: "rust", name: "Rust", icon: "RS" },
  { id: "typescript", name: "TypeScript", icon: "TS" },
  { id: "php", name: "PHP", icon: "PHP" },
  { id: "ruby", name: "Ruby", icon: "RB" },
  { id: "kotlin", name: "Kotlin", icon: "KT" },
  { id: "swift", name: "Swift", icon: "SW" },
  { id: "r", name: "R", icon: "R" },
  { id: "sql", name: "SQL", icon: "SQL" },
  { id: "html", name: "HTML/CSS/JS", icon: "WEB" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const currentLang = languages.find(l => l.id === selectedLanguage) || languages[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/50 hover:border-primary">
          <span className="text-xs font-bold text-primary">{currentLang.icon}</span>
          <span>{currentLang.name}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className="gap-3 cursor-pointer"
          >
            <span className="text-xs font-bold text-primary w-8">{lang.icon}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
