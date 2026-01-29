import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Link as LinkIcon, Star, CheckCircle2, Award, LayoutGrid, Construction } from "lucide-react";

export default function ProfessionalProfile() {
  const [portfolioType, setPortfolioType] = useState<"renders" | "projects">("renders");

  const renders = [
    { id: 1, title: "Modern Villa Concept", subtitle: "3D Architectural Visualization", image: "/portfolio/renders/render1.jpg" },
    { id: 2, title: "Luxury Apartment Render", subtitle: "Interior & Exterior Design", image: "/portfolio/renders/render2.jpg" },
    { id: 3, title: "Corporate Plaza Concept", subtitle: "Conceptual Design", image: "/portfolio/renders/render3.jpg" },
    { id: 4, title: "Residential Estate Layout", subtitle: "Master Planning", image: "/portfolio/renders/render4.jpg" },
    { id: 5, title: "Hillside Mansion Render", subtitle: "3D Visualization", image: "/portfolio/renders/render5.jpg" },
    { id: 6, title: "Urban Loft Concept", subtitle: "Architectural Design", image: "/portfolio/renders/render6.jpg" },
  ];

  const projects = [
    { id: 1, title: "Syokimau Heights", subtitle: "Live Construction Stage", image: "/portfolio/projects/project1.jpg" },
    { id: 2, title: "Kilimani Apartments", subtitle: "Structural Framing", image: "/portfolio/projects/project2.jpg" },
    { id: 3, title: "Westlands Towers", subtitle: "Foundation Work", image: "/portfolio/projects/project3.jpg" },
    { id: 4, title: "Runda Gated Community", subtitle: "Site Development", image: "/portfolio/projects/project4.jpg" },
    { id: 5, title: "Lavington Villas", subtitle: "Wall Construction", image: "/portfolio/projects/project5.jpg" },
    { id: 6, title: "Kileleshwa Residency", subtitle: "Reinforcement Work", image: "/portfolio/projects/project6.jpg" },
    { id: 7, title: "Karen Executive Suites", subtitle: "Exterior Finishing", image: "/portfolio/projects/project7.jpg" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl w-full" />
        <div className="px-8 pb-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl shrink-0">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-4xl">AW</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2 pt-2 md:pt-0 md:mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold">Arch. Wamae</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 w-fit">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">Architects profile page • Registered Architect</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Nairobi, Kenya</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined 2023</span>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto md:mb-4">
              <Button variant="outline" className="flex-1 md:flex-none">Message</Button>
              <Button className="flex-1 md:flex-none">Connect</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Registered Architect with a passion for sustainable design and modern aesthetics. 
                Over 8 years of experience in translating client visions into functional, beautiful living spaces.
                Specializing in residential architecture, 3D visualization, and project management from concept to completion.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">Architectural Design</Badge>
                <Badge variant="outline">3D Rendering</Badge>
                <Badge variant="outline">Sustainable Design</Badge>
                <Badge variant="outline">Project Management</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">BORAQS License</p>
                  <p className="text-sm text-muted-foreground">Reg. No. A/1234</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">AAK Member</p>
                  <p className="text-sm text-muted-foreground">Member No. 5678</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="portfolio" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews (12)
              </TabsTrigger>
              <TabsTrigger 
                value="cpd" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                CPD & Training
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-6 space-y-6">
              <div className="flex justify-center mb-8">
                <div className="flex p-1 bg-muted rounded-lg shadow-inner">
                  <button
                    onClick={() => setPortfolioType("renders")}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      portfolioType === "renders"
                        ? "bg-background text-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    3D Render
                  </button>
                  <button
                    onClick={() => setPortfolioType("projects")}
                    className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      portfolioType === "projects"
                        ? "bg-background text-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Construction className="w-4 h-4" />
                    Projects
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(portfolioType === "renders" ? renders : projects).map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-muted/60">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-xs font-medium uppercase tracking-wider">View Details</p>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2 font-medium">
                        {portfolioType === "renders" ? <LayoutGrid className="w-3.5 h-3.5" /> : <Construction className="w-3.5 h-3.5" />}
                        {item.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Reviews section coming soon...
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cpd" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  CPD records coming soon...
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
