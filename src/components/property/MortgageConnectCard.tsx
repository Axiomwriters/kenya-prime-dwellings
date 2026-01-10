import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgePercent, Building2, Calculator, CheckCircle2, ArrowRight } from "lucide-react";

interface Lender {
    id: number;
    name: string;
    logo?: string; // Optional logo text/url
    rate: number;
    minDeposit: number;
    maxTenure: number;
    features: string[];
    color: string;
}

const lenders: Lender[] = [
    {
        id: 1,
        name: "KCB Bank",
        rate: 13.9,
        minDeposit: 10,
        maxTenure: 25,
        features: ["100% Financing for salaried", "Buy & Build options"],
        color: "bg-green-600"
    },
    {
        id: 2,
        name: "NCBA",
        rate: 13.5,
        minDeposit: 20,
        maxTenure: 25,
        features: ["Fast processing", "Construction loans"],
        color: "bg-amber-600"
    },
    {
        id: 3,
        name: "Stanbic Bank",
        rate: 14.1,
        minDeposit: 10,
        maxTenure: 20,
        features: ["Single digit rate (USD)", "Diaspora mortgages"],
        color: "bg-blue-600"
    }
];

export function MortgageConnectCard({ propertyValue }: { propertyValue: number }) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <Card className="border-border/50 shadow-sm overflow-hidden group">
            <div className="h-1 bg-gradient-to-r from-green-500 via-amber-500 to-blue-500" />
            <CardHeader className="bg-muted/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Building2 className="w-5 h-5 text-primary" />
                    Mortgage & Financing Options
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                    Connect with pre-vetted lenders for this property. Est. property value: <span className="font-semibold text-foreground">{formatCurrency(propertyValue)}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="grid gap-4">
                    {lenders.map((lender) => {
                        // Simple monthly repayment estimate (P * r * (1+r)^n) / ((1+r)^n - 1)
                        // r = monthly rate, n = months
                        const principal = propertyValue * (1 - lender.minDeposit / 100);
                        const r = lender.rate / 100 / 12;
                        const n = lender.maxTenure * 12;
                        const monthlyPay = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

                        return (
                            <div key={lender.id} className="relative rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    {/* Lender Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-lg ${lender.color} flex items-center justify-center text-white font-bold text-xs`}>
                                                {lender.name.substring(0, 3).toUpperCase()}
                                            </div>
                                            <h4 className="font-bold text-base">{lender.name}</h4>
                                            <Badge variant="outline" className="text-[10px] ml-2 border-primary/20 text-primary">Verified Lender</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <BadgePercent className="w-3.5 h-3.5" /> Rate: <span className="font-semibold text-foreground">{lender.rate}%</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calculator className="w-3.5 h-3.5" /> Deposit: <span className="font-semibold text-foreground">{lender.minDeposit}%</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {lender.features.map((feat, i) => (
                                                <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {feat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Side */}
                                    <div className="flex flex-col items-end justify-between gap-2 min-w-[140px] border-l border-border/50 pl-4">
                                        <div className="text-right">
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-tight">Est. Monthly</div>
                                            <div className="text-lg font-bold text-primary">{formatCurrency(monthlyPay)}</div>
                                        </div>
                                        <Button size="sm" variant="outline" className="w-full text-xs hover:bg-primary hover:text-white transition-colors">
                                            Get Pre-Approved <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Need a custom financing plan?</span>
                    <Button variant="link" className="h-auto p-0 text-primary font-semibold">Talk to a Mortgage Broker</Button>
                </div>
            </CardContent>
        </Card>
    );
}
