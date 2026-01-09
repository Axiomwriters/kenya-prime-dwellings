import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Smartphone, Building } from "lucide-react";

interface FinancialSettingsProps {
    settings: any;
    onChange: (field: string, value: any) => void;
}

export function FinancialSettings({ settings, onChange }: FinancialSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="w-5 h-5 text-green-600" /> Payments & Commissions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="space-y-3">
                    <Label>Preferred Payout Method</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => onChange('payout_method', 'mpesa')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${settings.payout_method === 'mpesa'
                                    ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                                    : 'border-muted bg-card hover:bg-accent'
                                }`}
                        >
                            <Smartphone className="w-4 h-4" /> M-Pesa
                        </button>
                        <button
                            onClick={() => onChange('payout_method', 'bank')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${settings.payout_method === 'bank'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                                    : 'border-muted bg-card hover:bg-accent'
                                }`}
                        >
                            <Building className="w-4 h-4" /> Bank Transfer
                        </button>
                    </div>
                </div>

                {settings.payout_method === 'mpesa' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label>M-Pesa Number</Label>
                        <Input
                            placeholder="+254..."
                            value={settings.mpesa_number || ''}
                            onChange={(e) => onChange('mpesa_number', e.target.value)}
                        />
                    </div>
                )}

                {settings.payout_method === 'bank' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label>Bank Name</Label>
                            <Select value={settings.bank_name} onValueChange={(v) => onChange('bank_name', v)}>
                                <SelectTrigger><SelectValue placeholder="Select Bank" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kcb">KCB Bank</SelectItem>
                                    <SelectItem value="equity">Equity Bank</SelectItem>
                                    <SelectItem value="coop">Co-operative Bank</SelectItem>
                                    <SelectItem value="ncba">NCBA</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Account Number</Label>
                            <Input
                                placeholder="Enter account number"
                                value={settings.bank_account || ''}
                                onChange={(e) => onChange('bank_account', e.target.value)}
                            />
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
