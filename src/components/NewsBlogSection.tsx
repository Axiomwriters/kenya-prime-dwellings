import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Nairobi Real Estate Market Hits New Highs in 2024",
    excerpt: "Property values in premium areas like Karen and Westlands continue to surge as demand outpaces supply in Kenya's capital city.",
    author: "Sarah Mwangi",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Market Analysis",
    image: "/api/placeholder/300/200"
  },
  {
    id: "2",
    title: "Investment Guide: Best Areas to Buy Property in Kenya",
    excerpt: "Discover the top locations offering the highest ROI for property investors, from emerging suburbs to established commercial districts.",
    author: "James Kariuki",
    date: "2024-01-12",
    readTime: "8 min read",
    category: "Investment",
    image: "/api/placeholder/300/200"
  },
  {
    id: "3",
    title: "The Rise of Short-Stay Rentals in Nairobi",
    excerpt: "How Airbnb and similar platforms are transforming the rental market and creating new opportunities for property owners.",
    author: "Grace Wanjiku",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Trends",
    image: "/api/placeholder/300/200"
  },
  {
    id: "4",
    title: "Affordable Housing Initiative: What You Need to Know",
    excerpt: "Government's latest affordable housing program offers new pathways to homeownership for middle-income Kenyans.",
    author: "Peter Ochieng",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Policy",
    image: "/api/placeholder/300/200"
  },
  {
    id: "5",
    title: "Sustainable Building Practices Gain Momentum",
    excerpt: "Green building technologies and eco-friendly materials are becoming the new standard in Kenya's construction industry.",
    author: "Mary Njeri",
    date: "2024-01-05",
    readTime: "4 min read",
    category: "Sustainability",
    image: "/api/placeholder/300/200"
  },
  {
    id: "6",
    title: "Commercial Real Estate Outlook for 2024",
    excerpt: "Office spaces and retail properties show promising recovery as businesses adapt to post-pandemic market dynamics.",
    author: "David Mutua",
    date: "2024-01-03",
    readTime: "6 min read",
    category: "Commercial",
    image: "/api/placeholder/300/200"
  }
];

export function NewsBlogSection() {
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => (
    <Card
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] animate-scale-in w-full border-border/50"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 flex items-center justify-center">
          <div className="text-5xl font-bold text-primary/50">
            {post.title.charAt(0)}
          </div>
        </div>
        {/* Category badge overlay */}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 text-xs shadow-lg backdrop-blur-sm bg-background/80"
        >
          {post.category}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">
          {post.title}
        </h3>

        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          {post.readTime}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground/80 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <span className="font-medium">{formatDate(post.date)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-[11px] sm:text-xs">{post.author}</span>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-2 transition-transform flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Latest Updates
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real Estate News & Insights
          </h2>
          <p className="text-base text-muted-foreground/80 max-w-xl mx-auto mb-2 italic">
            Stay informed with the latest market trends and tips
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Expert insights and analysis to help you make informed decisions
            in Kenya's dynamic real estate market.
          </p>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {mockBlogPosts.map((post, index) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <BlogCard post={post} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background hidden md:flex" />
            <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background hidden md:flex" />
          </Carousel>
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
} 