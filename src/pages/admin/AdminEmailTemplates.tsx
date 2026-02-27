import { useState } from "react";
import {
  Mail, Eye, Copy, Edit3, Check, Undo2, Palette, Code2, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: "transactional" | "marketing" | "system";
  body: string;
  lastEdited: string;
  active: boolean;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    subject: "Your order #{{order_id}} has been confirmed!",
    description: "Sent when a customer places a new order",
    category: "transactional",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px;">Order Confirmed! 🎉</h1>
  <p style="color: #555;">Hi {{customer_name}},</p>
  <p style="color: #555;">Thank you for your order! We're preparing your items with care.</p>
  <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-weight: bold;">Order #{{order_id}}</p>
    <p style="margin: 4px 0; color: #555;">Total: {{order_total}}</p>
    <p style="margin: 4px 0; color: #555;">Date: {{order_date}}</p>
  </div>
  <a href="{{tracking_url}}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Track Your Order</a>
  <p style="color: #999; font-size: 12px; margin-top: 30px;">Fashion Spectrum — Redefining African Fashion</p>
</div>`,
    lastEdited: "2 days ago",
    active: true,
  },
  {
    id: "shipping-notification",
    name: "Shipping Notification",
    subject: "Your order #{{order_id}} has been shipped!",
    description: "Sent when an order is shipped",
    category: "transactional",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px;">Your Order is On Its Way! 📦</h1>
  <p style="color: #555;">Hi {{customer_name}},</p>
  <p style="color: #555;">Great news! Your order has been shipped and is on its way to you.</p>
  <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-weight: bold;">Tracking: {{tracking_number}}</p>
    <p style="margin: 4px 0; color: #555;">Carrier: {{carrier}}</p>
    <p style="margin: 4px 0; color: #555;">Estimated delivery: {{delivery_date}}</p>
  </div>
  <a href="{{tracking_url}}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Track Package</a>
</div>`,
    lastEdited: "5 days ago",
    active: true,
  },
  {
    id: "welcome-email",
    name: "Welcome Email",
    subject: "Welcome to Fashion Spectrum, {{customer_name}}!",
    description: "Sent when a new customer registers",
    category: "transactional",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px;">Welcome to Fashion Spectrum! ✨</h1>
  <p style="color: #555;">Hi {{customer_name}},</p>
  <p style="color: #555;">We're thrilled to have you join our community of fashion enthusiasts. Explore our curated collection of premium African fashion.</p>
  <a href="{{shop_url}}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Start Shopping</a>
  <p style="color: #555; margin-top: 20px;">Use code <strong>WELCOME10</strong> for 10% off your first order!</p>
</div>`,
    lastEdited: "1 week ago",
    active: true,
  },
  {
    id: "password-reset",
    name: "Password Reset",
    subject: "Reset your Fashion Spectrum password",
    description: "Sent when a customer requests a password reset",
    category: "system",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px;">Password Reset Request</h1>
  <p style="color: #555;">Hi {{customer_name}},</p>
  <p style="color: #555;">We received a request to reset your password. Click the button below to create a new password.</p>
  <a href="{{reset_url}}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Reset Password</a>
  <p style="color: #999; font-size: 12px; margin-top: 20px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
</div>`,
    lastEdited: "2 weeks ago",
    active: true,
  },
  {
    id: "abandoned-cart",
    name: "Abandoned Cart",
    subject: "You left something behind, {{customer_name}}!",
    description: "Sent when a customer abandons their cart",
    category: "marketing",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px;">Forgot Something? 🛒</h1>
  <p style="color: #555;">Hi {{customer_name}},</p>
  <p style="color: #555;">You left some amazing items in your cart. Don't let them get away!</p>
  <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; color: #555;">{{cart_items}}</p>
    <p style="margin: 8px 0 0; font-weight: bold;">Total: {{cart_total}}</p>
  </div>
  <a href="{{cart_url}}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Complete Your Order</a>
  <p style="color: #555; margin-top: 20px;">Use code <strong>COMEBACK5</strong> for 5% off!</p>
</div>`,
    lastEdited: "3 days ago",
    active: true,
  },
  {
    id: "review-request",
    name: "Review Request",
    subject: "How was your order, {{customer_name}}?",
    description: "Sent after order delivery to request a review",
    category: "marketing",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px;">We'd Love Your Feedback! ⭐</h1>
  <p style="color: #555;">Hi {{customer_name}},</p>
  <p style="color: #555;">We hope you're enjoying your recent purchase! Your feedback helps us serve you better.</p>
  <a href="{{review_url}}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Leave a Review</a>
</div>`,
    lastEdited: "1 week ago",
    active: true,
  },
];

const categoryColors = {
  transactional: "bg-primary/10 text-primary border-primary/20",
  marketing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  system: "bg-muted text-muted-foreground border-border",
};

const AdminEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem("admin_email_templates");
    return saved ? JSON.parse(saved) : defaultTemplates;
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "transactional" | "marketing" | "system">("all");
  const { toast } = useToast();

  const filtered = categoryFilter === "all"
    ? templates
    : templates.filter((t) => t.category === categoryFilter);

  const startEdit = (template: EmailTemplate) => {
    setEditing(template.id);
    setEditData({ ...template });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditData(null);
  };

  const saveEdit = () => {
    if (!editData) return;
    const updated = templates.map((t) =>
      t.id === editData.id ? { ...editData, lastEdited: "Just now" } : t
    );
    setTemplates(updated);
    localStorage.setItem("admin_email_templates", JSON.stringify(updated));
    setEditing(null);
    setEditData(null);
    toast({ title: "Template saved successfully" });
  };

  const resetTemplate = (id: string) => {
    const original = defaultTemplates.find((t) => t.id === id);
    if (original) {
      const updated = templates.map((t) => (t.id === id ? { ...original } : t));
      setTemplates(updated);
      localStorage.setItem("admin_email_templates", JSON.stringify(updated));
      if (editing === id) {
        setEditData({ ...original });
      }
      toast({ title: "Template reset to default" });
    }
  };

  const toggleActive = (id: string) => {
    const updated = templates.map((t) =>
      t.id === id ? { ...t, active: !t.active } : t
    );
    setTemplates(updated);
    localStorage.setItem("admin_email_templates", JSON.stringify(updated));
  };

  const copyHtml = (body: string) => {
    navigator.clipboard.writeText(body);
    toast({ title: "HTML copied to clipboard" });
  };

  // Editor view
  if (editing && editData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Edit: {editData.name}
            </h1>
            <p className="text-sm font-body text-muted-foreground mt-1">{editData.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={cancelEdit} className="font-body">
              Cancel
            </Button>
            <Button onClick={saveEdit} className="font-body">
              <Check size={14} className="mr-1.5" /> Save Template
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className="font-body text-sm">Template Name</Label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="font-body mt-1.5"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm">Subject Line</Label>
                  <Input
                    value={editData.subject}
                    onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                    className="font-body mt-1.5"
                  />
                  <p className="text-xs font-body text-muted-foreground mt-1">
                    Use {"{{variable}}"} for dynamic content
                  </p>
                </div>
                <div>
                  <Label className="font-body text-sm">HTML Body</Label>
                  <Textarea
                    value={editData.body}
                    onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                    className="font-mono text-xs mt-1.5 min-h-[400px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold">Preview</h3>
              <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-body transition-colors",
                    previewMode === "desktop" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  )}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-body transition-colors flex items-center gap-1",
                    previewMode === "mobile" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Smartphone size={12} /> Mobile
                </button>
              </div>
            </div>
            <Card className={cn(
              "overflow-hidden",
              previewMode === "mobile" && "max-w-[375px] mx-auto"
            )}>
              <div className="bg-secondary/30 px-4 py-2 border-b border-border">
                <p className="text-xs font-body text-muted-foreground">Subject: {editData.subject}</p>
              </div>
              <CardContent className="p-0">
                <div
                  className="p-4"
                  dangerouslySetInnerHTML={{
                    __html: editData.body
                      .replace(/\{\{customer_name\}\}/g, "Sarah Johnson")
                      .replace(/\{\{order_id\}\}/g, "1042")
                      .replace(/\{\{order_total\}\}/g, "₦85,000")
                      .replace(/\{\{order_date\}\}/g, "Feb 27, 2026")
                      .replace(/\{\{tracking_number\}\}/g, "NG12345678")
                      .replace(/\{\{carrier\}\}/g, "DHL Express")
                      .replace(/\{\{delivery_date\}\}/g, "Mar 3, 2026")
                      .replace(/\{\{cart_total\}\}/g, "₦45,000")
                      .replace(/\{\{cart_items\}\}/g, "Royal Blue Agbada × 1, Gold Kaftan × 1")
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail size={24} />
            Email Templates
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Customize automated emails sent to your customers
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {(["all", "transactional", "marketing", "system"] as const).map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className={cn(
              "font-body text-xs capitalize",
              categoryFilter === cat && "border-primary bg-primary/5 text-primary"
            )}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat} ({cat === "all" ? templates.length : templates.filter((t) => t.category === cat).length})
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className={cn("transition-all", !template.active && "opacity-60")}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-heading text-base flex items-center gap-2">
                    {template.name}
                    <Badge variant="outline" className={cn("text-[10px] font-body capitalize", categoryColors[template.category])}>
                      {template.category}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="font-body text-xs">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground mb-1">Subject:</p>
                <p className="text-sm font-body text-foreground">{template.subject}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-body text-muted-foreground">
                  Edited {template.lastEdited}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => copyHtml(template.body)} className="h-8 w-8 p-0">
                    <Copy size={13} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Undo2 size={13} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-heading">Reset template?</AlertDialogTitle>
                        <AlertDialogDescription className="font-body">
                          This will reset "{template.name}" to its default content. Your customizations will be lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => resetTemplate(template.id)} className="font-body">
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="outline" size="sm" onClick={() => startEdit(template)} className="font-body text-xs h-8">
                    <Edit3 size={12} className="mr-1" /> Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminEmailTemplates;
