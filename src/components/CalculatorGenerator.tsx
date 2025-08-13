import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedCalculator {
  title: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    value: number;
    readonly?: boolean;
  }>;
  calculateFunction: string;
}

interface CalculatorGeneratorProps {
  onCalculatorGenerated: (calculator: GeneratedCalculator) => void;
}

export const CalculatorGenerator = ({ onCalculatorGenerated }: CalculatorGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateCalculator = async () => {
    if (!prompt.trim()) {
      toast({ 
        title: "Please enter a description", 
        description: "Tell me what kind of calculator you'd like to create!",
        variant: "destructive" 
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-calculator', {
        body: { prompt: prompt.trim() }
      });

      if (error) throw error;

      const calculator = data.calculator;
      onCalculatorGenerated(calculator);
      
      toast({ 
        title: "Calculator generated!", 
        description: `Created "${calculator.title}" for you to use.` 
      });
      
      setPrompt("");
    } catch (error) {
      console.error('Error generating calculator:', error);
      toast({ 
        title: "Generation failed", 
        description: "Please try again with a different description.",
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const examplePrompts = [
    "Calculate mortgage payments with principal, interest rate, and loan term",
    "Tip calculator for restaurant bills with customizable tip percentage",
    "Investment ROI calculator with initial investment and returns",
    "BMI calculator using height and weight",
    "Compound interest calculator for savings growth"
  ];

  return (
    <Card className="shadow-soft border-border/50 bg-gradient-to-br from-card via-background to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          Generate Your Calculator
        </CardTitle>
        <p className="text-muted-foreground">
          Describe the calculator you need in plain English and I'll create it for you!
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="e.g., 'Create a tip calculator for restaurant bills with the ability to split between multiple people'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-20 resize-none transition-all duration-200 hover:border-primary/50 focus:border-primary"
            disabled={isGenerating}
          />
        </div>

        <Button
          onClick={generateCalculator}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Calculator
            </>
          )}
        </Button>

        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Example ideas:</p>
          <div className="grid gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left text-sm p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                disabled={isGenerating}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};