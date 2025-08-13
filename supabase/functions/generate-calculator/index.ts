import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating calculator for prompt:', prompt);

    const systemPrompt = `You are a calculator generator for CalcNest. Create a calculator based on the user's description.

Return a JSON object with this exact structure:
{
  "title": "Calculator Name",
  "description": "Brief description of what it calculates",
  "fields": [
    { "name": "input1", "label": "Input Label", "value": 0, "readonly": false },
    { "name": "output1", "label": "Output Label", "value": 0, "readonly": true }
  ],
  "calculateFunction": "return { output1: values.input1 * 2 };"
}

Rules:
1. Input fields have readonly: false, output fields have readonly: true
2. The calculateFunction should be valid JavaScript that takes a 'values' object and returns an object with calculated results
3. All calculations should handle edge cases (division by zero, negative numbers, etc.)
4. Use clear, descriptive field names and labels
5. Include appropriate default values
6. Keep calculations accurate and practical

Example for "tip calculator":
{
  "title": "Tip Calculator",
  "description": "Calculate tips and total bill amount",
  "fields": [
    { "name": "bill", "label": "Bill Amount ($)", "value": 0, "readonly": false },
    { "name": "tipPercent", "label": "Tip Percentage (%)", "value": 18, "readonly": false },
    { "name": "tipAmount", "label": "Tip Amount ($)", "value": 0, "readonly": true },
    { "name": "total", "label": "Total Amount ($)", "value": 0, "readonly": true }
  ],
  "calculateFunction": "const tipAmount = (values.bill * values.tipPercent) / 100; const total = values.bill + tipAmount; return { tipAmount: Math.round(tipAmount * 100) / 100, total: Math.round(total * 100) / 100 };"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);

    // Parse the JSON response from OpenAI
    let calculator;
    try {
      calculator = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse calculator JSON:', parseError, generatedContent);
      throw new Error('Invalid calculator format generated');
    }

    // Validate the calculator structure
    if (!calculator.title || !calculator.fields || !Array.isArray(calculator.fields)) {
      console.error('Invalid calculator structure:', calculator);
      throw new Error('Invalid calculator structure');
    }

    console.log('Successfully generated calculator:', calculator.title);

    return new Response(JSON.stringify({ calculator }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-calculator function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate calculator',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});