import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  MessageCircle, 
  Mail,
  CheckCircle,
  MapPin,
  Star,
  Building2,
  Clock
} from "lucide-react";

interface AgentContactCardProps {
  agentName: string;
  agentPhone?: string;
  propertyTitle: string;
}

export function AgentContactCard({ agentName, agentPhone, propertyTitle }: AgentContactCardProps) {
  const handleWhatsApp = () => {
    const phone = agentPhone || "+254712345678";
    const message = `Hi ${agentName}! I'm interested in ${propertyTitle}. Could you provide more details?`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    const phone = agentPhone || "+254712345678";
    window.open(`tel:${phone}`);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry about ${propertyTitle}`);
    const body = encodeURIComponent(`Hi ${agentName},\n\nI'm interested in ${propertyTitle}. Could you provide more details?\n\nThank you.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="overflow-hidden shadow-lg border-2">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 h-20" />
      
      <CardHeader className="pb-3 pt-0">
        <div className="flex flex-col items-center -mt-12">
          <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
            <AvatarImage src="/placeholder-avatar.jpg" alt={agentName} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {agentName?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center mt-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-foreground">{agentName}</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 border-green-200 text-xs">
                <CheckCircle className="w-3 h-3" /> Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" />
              Nairobi, Kenya
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Building2 className="w-3 h-3" />
              <span>Properties</span>
            </div>
            <p className="text-lg font-bold text-foreground">24+</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>Rating</span>
            </div>
            <p className="text-lg font-bold text-foreground">4.8</p>
          </div>
        </div>

        <Separator />

        {/* Contact Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white h-11"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp Agent
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleCall}
              variant="outline"
              className="h-11"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            
            <Button 
              onClick={handleEmail}
              variant="outline"
              className="h-11"
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div className="text-center space-y-1 pt-2">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Mon-Sat, 9:00 AM - 6:00 PM</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Typically replies within 1 hour
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
