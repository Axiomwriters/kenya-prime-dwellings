
import { useState } from "react";
import { Calculator, DollarSign, Building2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { HandpickedProperties } from "@/components/agents/HandpickedProperties";
import { ActiveAdvertCard } from "@/components/agents/ActiveAdvertCard";

interface Lender {
  id: string;
  name: string;
  rate: number;
  minDeposit: number;
  logo: string;
}

const MOCK_LENDERS: Lender[] = [
  { id: "1", name: "Equity Bank", rate: 12.5, minDeposit: 10, logo: "EQ" },
  { id: "2", name: "KCB Bank", rate: 13.0, minDeposit: 15, logo: "KCB" },
  { id: "3", name: "Co-op Bank", rate: 11.5, minDeposit: 20, logo: "CO" },
  { id: "4", name: "NCBA", rate: 12.0, minDeposit: 10, logo: "NCBA" },
];

export const AffordabilityCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(13.0); // Default market rate

  const calculateAffordability = () => {
    // 1. Calculate Max Monthly Repayment (30% of Income rule)
    const maxMonthlyRepayment = monthlyIncome * 0.35;

    // 2. Calculate Max Loan Amount (PV formula)
    // PV = PMT * (1 - (1 + r)^-n) / r
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;

    let maxLoanAmount = 0;
    if (r > 0) {
      maxLoanAmount = maxMonthlyRepayment * (1 - Math.pow(1 + r, -n)) / r;
    } else {
      maxLoanAmount = maxMonthlyRepayment * n;
    }

    // 3. Max Home Price
    const maxHomePrice = maxLoanAmount + deposit;

    return {
      maxMonthlyRepayment,
      maxLoanAmount,
      maxHomePrice,
    };
  };

  const { maxMonthlyRepayment, maxHomePrice } = calculateAffordability();

  // Find best lenders
  const matchedLenders = MOCK_LENDERS.filter(l => l.rate <= interestRate + 1).slice(0, 3);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(val);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6 min-w-0">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Affordability Calculator
            </CardTitle>
            <CardDescription>
              Estimate your budget and find the best verified lenders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Monthly Gross Income (KES)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="e.g 150000"
                  className="pl-9"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Available Deposit / Down Payment (KES)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="e.g 1000000"
                  className="pl-9"
                  value={deposit || ''}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Loan Term (Years): {loanTerm}</Label>
              </div>
              <Slider
                value={[loanTerm]}
                min={5}
                max={30}
                step={1}
                onValueChange={(val) => setLoanTerm(val[0])}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Interest Rate (%): {interestRate}</Label>
              </div>
              <Slider
                value={[interestRate]}
                min={5}
                max={25}
                step={0.5}
                onValueChange={(val) => setInterestRate(val[0])}
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Advert Card in Left Column */}
        <ActiveAdvertCard />
      </div>

      <div className="space-y-6 min-w-0">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Your Potential Power</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Max Property Value</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(maxHomePrice)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Monthly Repayment</p>
              <p className="text-xl font-semibold">{formatCurrency(maxMonthlyRepayment)}</p>
            </div>
            <div className="text-xs text-muted-foreground pt-4 border-t border-primary/10">
              *Estimates based on a {interestRate}% interest rate over {loanTerm} years. Actual qualification varies.
            </div>
          </CardContent>
        </Card>

        {/* Handpicked Homes Section */}
        <HandpickedProperties maxPrice={maxHomePrice} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Lenders</CardTitle>
            <CardDescription>Based on your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchedLenders.map((lender) => (
              <div key={lender.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                    {lender.logo}
                  </div>
                  <div>
                    <p className="font-medium">{lender.name}</p>
                    <p className="text-xs text-muted-foreground">Rates from {lender.rate}%</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  Connect
                </Button>
              </div>
            ))}
            <Button className="w-full mt-2" variant="ghost">View All Lenders</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
