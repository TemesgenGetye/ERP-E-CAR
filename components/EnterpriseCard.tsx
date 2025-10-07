import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit,
  Trash2,
  Building2,
  CircleCheckBig,
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  subtitle: string;
  phone: string;
  email: string;
  address: string;
  status: "ACTIVE" | "INACTIVE";
}

interface ContactCardProps {
  contact: Contact;
}

export default function EnterpriseCard({ contact }: ContactCardProps) {
  return (
    <Card className="w-full max-w-sm bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        {/* Header with icon, name and status */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {contact.name}
              </h3>
              <p className="text-xs text-gray-500">{contact.subtitle}</p>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <CircleCheckBig size={18} className="text-green-600" />
            <Badge
              variant="secondary"
              className="bg-green-100 px-2 py-1 text-green-700 rounded-full hover:bg-green-100 text-xs font-medium"
            >
              {contact.status}
            </Badge>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{contact.address}</span>
          </div>
        </div>

        {/* Footer with dropdown and actions */}
        <div className="flex items-center justify-between">
          <Select defaultValue="active">
            <SelectTrigger className="text-xs border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
