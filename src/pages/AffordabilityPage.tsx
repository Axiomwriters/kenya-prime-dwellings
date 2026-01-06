import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AffordabilityCalculator } from "@/components/agents/AffordabilityCalculator";

const AffordabilityPage = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-full overflow-x-hidden">
            <div className="mb-8 space-y-4">
                <Button
                    variant="ghost"
                    className="pl-0 hover:bg-transparent hover:text-primary gap-2"
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className="w-4 h-4" /> Return Home
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Smart Affordability Agent</h1>
                    <p className="text-muted-foreground mt-2">
                        Use our AI-driven agent to calculate your budget and connect with top verified lenders in real-time.
                    </p>
                </div>
            </div>
            <AffordabilityCalculator />
        </div>
    );
};

export default AffordabilityPage;
