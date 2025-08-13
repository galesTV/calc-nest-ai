import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator as CalculatorIcon, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalculatorField {
  name: string;
  label: string;
  value: number;
  formula?: string;
  readonly?: boolean;
}

interface CalculatorProps {
  title: string;
  description?: string;
  fields: CalculatorField[];
  onCalculate?: (values: Record<string, number>) => Record<string, number>;
}

export const Calculator = ({ title, description, fields: initialFields, onCalculate }: CalculatorProps) => {
  const [fields, setFields] = useState<CalculatorField[]>(initialFields);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newFields = [...fields];
    newFields[index].value = numValue;
    setFields(newFields);

    // Auto-calculate if function provided
    if (onCalculate) {
      const inputValues = newFields.reduce((acc, field) => {
        if (!field.readonly) {
          acc[field.name] = field.value;
        }
        return acc;
      }, {} as Record<string, number>);

      const results = onCalculate(inputValues);
      
      // Update readonly fields with results
      const updatedFields = newFields.map(field => {
        if (field.readonly && results[field.name] !== undefined) {
          return { ...field, value: results[field.name] };
        }
        return field;
      });
      
      setFields(updatedFields);
    }
  };

  const copyResults = () => {
    const results = fields
      .filter(field => field.readonly)
      .map(field => `${field.label}: ${field.value.toLocaleString()}`)
      .join('\n');
    
    navigator.clipboard.writeText(results);
    setCopied(true);
    toast({ title: "Results copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-calculator border-border/50 bg-gradient-to-br from-card to-muted/30 hover:shadow-glow transition-all duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <CalculatorIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {fields.map((field, index) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </Label>
              <div className="relative">
                <Input
                  id={field.name}
                  type="number"
                  value={field.value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={field.readonly}
                  className={`transition-all duration-200 ${
                    field.readonly 
                      ? 'bg-gradient-calculation border-accent/50 font-semibold text-accent-foreground' 
                      : 'hover:border-primary/50 focus:border-primary'
                  }`}
                  placeholder="0"
                />
                {field.readonly && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {fields.some(field => field.readonly) && (
          <Button
            onClick={copyResults}
            variant="outline"
            className="w-full transition-all duration-200 hover:bg-accent/20 hover:border-accent"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Results
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};