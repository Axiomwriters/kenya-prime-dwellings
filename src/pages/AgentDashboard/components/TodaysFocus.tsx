import { ArrowRight, Zap, RefreshCw, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TodaysFocus() {
  const actions = [
    {
      id: 1,
      title: "Adjust pricing for 'Riverside Apartment'",
      impact: "Could increase enquiries by ~15%",
      time: "2 min",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      id: 2,
      title: "Follow up with 3 hot leads",
      impact: "High chance of viewing today",
      time: "5 min",
      icon: Hand,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      id: 3,
      title: "Boost 'Lavington Villa' listing",
      impact: "Views dropped 12% this week",
      time: "1 min",
      icon: RefreshCw,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🔥</span> Today's Focus
        </h2>
        <span className="text-sm text-muted-foreground">
          You have 3 actions that could increase enquiries today.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Card key={action.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${action.bg}`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {action.time}
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm line-clamp-2">{action.title}</h3>
                <p className="text-xs text-green-600 mt-1 font-medium">{action.impact}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="w-full text-xs h-8">
                  Fix now
                </Button>
                <Button size="sm" variant="ghost" className="w-full text-xs h-8">
                  Remind me
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
