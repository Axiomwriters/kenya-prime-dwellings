import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ProjectHealthStats } from "@/components/command-center/ProjectHealthStats";
import { ProjectFilters } from "@/components/command-center/ProjectFilters";
import { ProjectCommandItem } from "@/components/command-center/ProjectCommandItem";
import { EmptyProjectState } from "@/components/command-center/EmptyProjectState";
import { AddProjectModal } from "@/components/add-project-modal/AddProjectModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function MyProjects() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["professional-projects", user?.id],
    queryFn: async () => {
      // Return null on error to trigger fallback to mock data
      try {
        const { data, error } = await supabase
          .from("professional_projects")
          .select("*")
          .eq("professional_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          return null;
        }
        return data;
      } catch (err) {
        console.error("Fetch error:", err);
        return null;
      }
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Mock data for projects
  const MOCK_PROJECTS = [
    {
      id: '1',
      title: 'Luxury Villa Bathroom Remodel',
      location: 'Runda, Nairobi',
      budget: 1200000,
      status: 'Completed',
      category: 'Renovation',
      images: ['https://images.unsplash.com/photo-1600585154340-be6164a83639?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'],
      created_at: new Date().toISOString(),
      views: 1500,
      saves: 60,
      inquiries: 12,
      health_score: 95
    },
    {
      id: '2',
      title: 'Modern Office Fit-out',
      location: 'Westlands, Nairobi',
      budget: 3500000,
      status: 'In Progress',
      category: 'Construction',
      images: ['https://images.unsplash.com/photo-1573496774435-6b8a486a8b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'],
      created_at: new Date().toISOString(),
      views: 800,
      saves: 25,
      inquiries: 5,
      health_score: 85
    },
    {
      id: '3',
      title: 'Garden Landscaping Project',
      location: 'Karen, Nairobi',
      budget: 800000,
      status: 'Completed',
      category: 'Landscape',
      images: ['https://images.unsplash.com/photo-1585333362078-d0a75a5b7b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'],
      created_at: new Date().toISOString(),
      views: 2200,
      saves: 120,
      inquiries: 20,
      health_score: 92
    },
  ];

  const displayProjects = projects?.length ? projects : MOCK_PROJECTS;
  const filteredProjects = displayProjects?.filter(_ => true); // Replace with actual filter logic

  return (
    <div className="space-y-8 pb-12">
      <AddProjectModal open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage, optimize, and track your project portfolio performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI Insights
          </Button>
          <Button onClick={() => setIsAddProjectOpen(true)} className="bg-primary shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Button>
        </div>
      </div>

      {/* Top Stats Section */}
      <ProjectHealthStats />

      {/* Main Content Area */}
      <div className="space-y-6">
        <ProjectFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {!filteredProjects || filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-accent/20">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Your Portfolio is Empty</h3>
            <p className="text-muted-foreground max-w-sm mt-1 mb-6">
              Add projects to see them listed here with performance metrics and AI insights.
            </p>
            <Button onClick={() => setIsAddProjectOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </div>
        ) : (
          <div className="px-4 lg:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {filteredProjects.map((project) => (
                  <CarouselItem key={project.id} className="basis-[90%] md:basis-1/2 lg:basis-1/3 pl-4">
                    <ProjectCommandItem project={project} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden lg:block">
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
}
