import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Users, Home, Shield, DollarSign, BarChart3 } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  type: "users" | "listings" | "verifications" | "revenue" | "analytics";
  generatedAt: string;
  format: "pdf" | "csv" | "excel";
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "User Registration Report",
    description: "Comprehensive breakdown of new user registrations, demographics, and growth trends",
    type: "users",
    generatedAt: "2024-01-15",
    format: "pdf",
  },
  {
    id: "2",
    title: "Listing Performance Report",
    description: "Analysis of listing views, inquiries, and conversion rates by region",
    type: "listings",
    generatedAt: "2024-01-14",
    format: "pdf",
  },
  {
    id: "3",
    title: "Verification Queue Report",
    description: "Summary of verification requests, approval rates, and processing times",
    type: "verifications",
    generatedAt: "2024-01-13",
    format: "csv",
  },
  {
    id: "4",
    title: "Revenue Analytics Report",
    description: "Monthly revenue breakdown, commission earnings, and financial summaries",
    type: "revenue",
    generatedAt: "2024-01-12",
    format: "excel",
  },
  {
    id: "5",
    title: "Platform Analytics Report",
    description: "Traffic analysis, user behavior patterns, and engagement metrics",
    type: "analytics",
    generatedAt: "2024-01-11",
    format: "pdf",
  },
];

const getTypeIcon = (type: Report["type"]) => {
  switch (type) {
    case "users":
      return <Users className="w-5 h-5" />;
    case "listings":
      return <Home className="w-5 h-5" />;
    case "verifications":
      return <Shield className="w-5 h-5" />;
    case "revenue":
      return <DollarSign className="w-5 h-5" />;
    case "analytics":
      return <BarChart3 className="w-5 h-5" />;
  }
};

const getTypeColor = (type: Report["type"]) => {
  switch (type) {
    case "users":
      return "bg-blue-500/10 text-blue-500";
    case "listings":
      return "bg-purple-500/10 text-purple-500";
    case "verifications":
      return "bg-yellow-500/10 text-yellow-500";
    case "revenue":
      return "bg-green-500/10 text-green-500";
    case "analytics":
      return "bg-indigo-500/10 text-indigo-500";
  }
};

export default function AdminReports() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredReports = selectedType === "all"
    ? mockReports
    : mockReports.filter((r) => r.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports Center</h1>
          <p className="text-muted-foreground mt-1">Generate and download platform reports</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "users", "listings", "verifications", "revenue", "analytics"].map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            className="capitalize"
          >
            {type === "all" ? "All Reports" : type}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${getTypeColor(report.type)}`}>
                  {getTypeIcon(report.type)}
                </div>
                <Badge variant="outline" className="uppercase text-xs">
                  {report.format}
                </Badge>
              </div>
              <CardTitle className="text-base mt-3">{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(report.generatedAt).toLocaleDateString()}
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reports found for this category</p>
        </div>
      )}
    </div>
  );
}
