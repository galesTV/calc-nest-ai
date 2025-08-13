import { useState } from "react";
import { Calculator as CalculatorIcon, Sparkles, Heart, Users } from "lucide-react";
import { CalculatorGenerator } from "@/components/CalculatorGenerator";
import { PrebuiltCalculators } from "@/components/PrebuiltCalculators";
import { Calculator } from "@/components/Calculator";

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

const Index = () => {
  const [generatedCalculator, setGeneratedCalculator] = useState<GeneratedCalculator | null>(null);

  const handleCalculatorGenerated = (calculator: GeneratedCalculator) => {
    // Create a calculation function from the generated string
    const onCalculate = (values: Record<string, number>) => {
      try {
        // This is a simplified version - in production you'd want a safer eval alternative
        const func = new Function('values', calculator.calculateFunction);
        return func(values);
      } catch (error) {
        console.error('Error in generated calculation:', error);
        return {};
      }
    };

    setGeneratedCalculator({
      ...calculator,
      onCalculate,
    } as any);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-primary shadow-glow">
                <CalculatorIcon className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  CalcNest
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The cozy home for all your calculations. Create custom calculators instantly with AI, 
                or use our ready-made tools. Making math friendly, one calculation at a time.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI-Powered Generation
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Cozy & Intuitive
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Community Driven
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Generator Section */}
        <div className="space-y-8">
          <div className="max-w-2xl mx-auto">
            <CalculatorGenerator onCalculatorGenerated={handleCalculatorGenerated} />
          </div>
          
          {/* Display Generated Calculator */}
          {generatedCalculator && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground">Your Generated Calculator</h3>
                <p className="text-muted-foreground">Ready to use!</p>
              </div>
              <Calculator
                title={generatedCalculator.title}
                description={generatedCalculator.description}
                fields={generatedCalculator.fields}
                onCalculate={(generatedCalculator as any).onCalculate}
              />
            </div>
          )}
        </div>

        {/* Prebuilt Calculators */}
        <PrebuiltCalculators />
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>Built with ❤️ for anyone who loves friendly math tools</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
