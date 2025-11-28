import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Link as LinkIcon, Star, CheckCircle2, Award } from "lucide-react";

export default function ProfessionalProfile() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-xl w-full" />
        <div className="px-8 pb-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl shrink-0">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-4xl">DK</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2 pt-2 md:pt-0 md:mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold">Eng. David Kamau</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 w-fit">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">Structural Engineer • EBK Registered</p>
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
                Professional Structural Engineer with over 10 years of experience in residential and commercial projects. 
                Specializing in reinforced concrete structures and seismic design. Committed to safety, efficiency, and innovation in construction.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">Structural Analysis</Badge>
                <Badge variant="outline">AutoCAD</Badge>
                <Badge variant="outline">Revit</Badge>
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
                  <p className="font-medium">EBK License</p>
                  <p className="text-sm text-muted-foreground">A12345678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">IEK Member</p>
                  <p className="text-sm text-muted-foreground">M.1234</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${i === 1 ? '1503387762-592deb58ef4e' : i === 2 ? '1541888946-402701108e29' : '1486406146926-c627a92ad1ab'}?w=800&auto=format&fit=crop&q=60`}
                        alt="Project"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">Westlands Commercial Complex</h3>
                      <p className="text-sm text-muted-foreground mt-1">Structural Lead • Completed 2023</p>
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
