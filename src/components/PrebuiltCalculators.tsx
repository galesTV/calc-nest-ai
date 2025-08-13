import { Calculator } from "./Calculator";

const tipCalculator = {
  title: "Tip Calculator",
  description: "Calculate tips and split bills easily",
  fields: [
    { name: "bill", label: "Bill Amount ($)", value: 0 },
    { name: "tipPercentage", label: "Tip Percentage (%)", value: 18 },
    { name: "people", label: "Number of People", value: 1 },
    { name: "tipAmount", label: "Tip Amount ($)", value: 0, readonly: true },
    { name: "totalAmount", label: "Total Amount ($)", value: 0, readonly: true },
    { name: "perPerson", label: "Per Person ($)", value: 0, readonly: true },
  ],
  onCalculate: (values: Record<string, number>) => {
    const tipAmount = (values.bill * values.tipPercentage) / 100;
    const totalAmount = values.bill + tipAmount;
    const perPerson = totalAmount / Math.max(values.people, 1);
    
    return {
      tipAmount: Math.round(tipAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      perPerson: Math.round(perPerson * 100) / 100,
    };
  },
};

const mortgageCalculator = {
  title: "Mortgage Calculator",
  description: "Calculate monthly mortgage payments",
  fields: [
    { name: "principal", label: "Loan Amount ($)", value: 0 },
    { name: "rate", label: "Annual Interest Rate (%)", value: 3.5 },
    { name: "years", label: "Loan Term (Years)", value: 30 },
    { name: "monthlyPayment", label: "Monthly Payment ($)", value: 0, readonly: true },
    { name: "totalInterest", label: "Total Interest ($)", value: 0, readonly: true },
    { name: "totalPaid", label: "Total Amount Paid ($)", value: 0, readonly: true },
  ],
  onCalculate: (values: Record<string, number>) => {
    const monthlyRate = values.rate / 100 / 12;
    const numberOfPayments = values.years * 12;
    
    if (monthlyRate === 0) {
      const monthlyPayment = values.principal / numberOfPayments;
      return {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalInterest: 0,
        totalPaid: values.principal,
      };
    }
    
    const monthlyPayment = values.principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPaid = monthlyPayment * numberOfPayments;
    const totalInterest = totalPaid - values.principal;
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
    };
  },
};

const bmiCalculator = {
  title: "BMI Calculator",
  description: "Calculate your Body Mass Index",
  fields: [
    { name: "weight", label: "Weight (lbs)", value: 0 },
    { name: "height", label: "Height (inches)", value: 0 },
    { name: "bmi", label: "BMI", value: 0, readonly: true },
    { name: "category", label: "Category", value: 0, readonly: true },
  ],
  onCalculate: (values: Record<string, number>) => {
    if (values.weight <= 0 || values.height <= 0) {
      return { bmi: 0, category: 0 };
    }
    
    const bmi = (values.weight * 703) / (values.height * values.height);
    let categoryNum = 0; // Will show as 0, but we'll handle display in the component
    
    return {
      bmi: Math.round(bmi * 10) / 10,
      category: categoryNum,
    };
  },
};

export const PrebuiltCalculators = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Popular Calculators</h2>
        <p className="text-muted-foreground">
          Try these ready-made calculators or generate your own above
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Calculator {...tipCalculator} />
        <Calculator {...mortgageCalculator} />
        <Calculator {...bmiCalculator} />
      </div>
    </div>
  );
};