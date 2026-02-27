import { useState, useCallback } from "react";
import {
  Mail, Eye, Copy, Edit3, Check, Undo2, Palette, Code2, Smartphone, Plus, Trash2,
  Type, AlignLeft, MousePointerClick, Image, Minus, GripVertical, ArrowUp, ArrowDown, ChevronDown
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
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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

type BlockType = "heading" | "text" | "button" | "image" | "divider" | "spacer";

interface EmailBlock {
  id: string;
  type: BlockType;
  content: string;
  url?: string;
  align?: "left" | "center" | "right";
  color?: string;
  bgColor?: string;
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

// --- Visual Email Builder helpers ---

const parseHtmlToBlocks = (html: string): EmailBlock[] => {
  const blocks: EmailBlock[] = [];
  const div = document.createElement("div");
  div.innerHTML = html;
  
  // Find the inner container
  const container = div.querySelector("div") || div;
  
  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      blocks.push({ id: `b-${Date.now()}-${Math.random()}`, type: "text", content: node.textContent.trim() });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    
    if (tag === "h1" || tag === "h2" || tag === "h3") {
      blocks.push({ id: `b-${Date.now()}-${Math.random()}`, type: "heading", content: el.textContent || "" });
    } else if (tag === "a" && el.style.display === "inline-block") {
      blocks.push({ id: `b-${Date.now()}-${Math.random()}`, type: "button", content: el.textContent || "Button", url: el.getAttribute("href") || "#" });
    } else if (tag === "img") {
      blocks.push({ id: `b-${Date.now()}-${Math.random()}`, type: "image", content: el.getAttribute("alt") || "", url: el.getAttribute("src") || "" });
    } else if (tag === "hr") {
      blocks.push({ id: `b-${Date.now()}-${Math.random()}`, type: "divider", content: "" });
    } else if (tag === "p" || tag === "div" || tag === "span") {
      // Check if it's a nested block with multiple children
      const text = el.innerHTML;
      if (text.trim()) {
        blocks.push({ id: `b-${Date.now()}-${Math.random()}`, type: "text", content: el.textContent || "" });
      }
    }
  });
  
  if (blocks.length === 0) {
    blocks.push({ id: `b-${Date.now()}`, type: "heading", content: "Your Email Title" });
    blocks.push({ id: `b-${Date.now()}-2`, type: "text", content: "Hi {{customer_name}}," });
    blocks.push({ id: `b-${Date.now()}-3`, type: "text", content: "Your email content goes here." });
    blocks.push({ id: `b-${Date.now()}-4`, type: "button", content: "Call to Action", url: "#" });
  }
  
  return blocks;
};

const blocksToHtml = (blocks: EmailBlock[]): string => {
  const inner = blocks.map((block) => {
    switch (block.type) {
      case "heading":
        return `  <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px;">${block.content}</h1>`;
      case "text":
        return `  <p style="color: #555; margin: 0 0 12px; line-height: 1.6;">${block.content}</p>`;
      case "button":
        return `  <a href="${block.url || "#"}" style="display: inline-block; background: ${block.bgColor || "#1a1a1a"}; color: ${block.color || "#fff"}; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 8px 0;">${block.content}</a>`;
      case "image":
        return `  <img src="${block.url || ""}" alt="${block.content}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0;" />`;
      case "divider":
        return `  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />`;
      case "spacer":
        return `  <div style="height: 24px;"></div>`;
      default:
        return "";
    }
  }).join("\n");
  
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">\n${inner}\n</div>`;
};

const blockTypeConfig: { type: BlockType; icon: React.ReactNode; label: string }[] = [
  { type: "heading", icon: <Type size={14} />, label: "Heading" },
  { type: "text", icon: <AlignLeft size={14} />, label: "Text" },
  { type: "button", icon: <MousePointerClick size={14} />, label: "Button" },
  { type: "image", icon: <Image size={14} />, label: "Image" },
  { type: "divider", icon: <Minus size={14} />, label: "Divider" },
];

// --- Block Editor Component ---
const BlockEditor = ({ blocks, onChange }: { blocks: EmailBlock[]; onChange: (blocks: EmailBlock[]) => void }) => {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const addBlock = (type: BlockType) => {
    const newBlock: EmailBlock = {
      id: `b-${Date.now()}`,
      type,
      content: type === "heading" ? "New Heading" : type === "text" ? "Your text here..." : type === "button" ? "Click Here" : type === "divider" ? "" : "",
      url: type === "button" ? "#" : type === "image" ? "https://via.placeholder.com/600x200" : undefined,
    };
    onChange([...blocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
    if (selectedBlock === id) setSelectedBlock(null);
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    const idx = blocks.findIndex((b) => b.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    [newBlocks[idx], newBlocks[idx + dir]] = [newBlocks[idx + dir], newBlocks[idx]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-3">
      {/* Add block buttons */}
      <div className="flex flex-wrap gap-1.5">
        {blockTypeConfig.map((bt) => (
          <Button
            key={bt.type}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-body gap-1.5"
            onClick={() => addBlock(bt.type)}
          >
            {bt.icon} {bt.label}
          </Button>
        ))}
      </div>

      <Separator />

      {/* Block list */}
      {blocks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm font-body">
          Click a block type above to start building your email
        </div>
      )}

      <div className="space-y-2">
        {blocks.map((block, idx) => (
          <div
            key={block.id}
            className={cn(
              "border rounded-lg p-3 transition-all cursor-pointer",
              selectedBlock === block.id
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border hover:border-muted-foreground/30"
            )}
            onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
          >
            {/* Block header */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                {blockTypeConfig.find((bt) => bt.type === block.type)?.icon}
                <span className="capitalize">{block.type}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, -1); }} disabled={idx === 0}>
                  <ArrowUp size={12} />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 1); }} disabled={idx === blocks.length - 1}>
                  <ArrowDown size={12} />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>

            {/* Block preview (collapsed) */}
            {selectedBlock !== block.id && block.type !== "divider" && block.type !== "spacer" && (
              <p className="text-xs text-foreground/70 truncate font-body">{block.content}</p>
            )}

            {/* Block editing (expanded) */}
            {selectedBlock === block.id && (
              <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                {(block.type === "heading" || block.type === "text") && (
                  <div>
                    <Label className="text-[11px] font-body text-muted-foreground">Content</Label>
                    {block.type === "text" ? (
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="mt-1 text-sm font-body min-h-[60px]"
                        placeholder="Enter your text..."
                      />
                    ) : (
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="mt-1 h-8 text-sm font-body"
                      />
                    )}
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-body">
                      Use {"{{customer_name}}"}, {"{{order_id}}"} etc. for variables
                    </p>
                  </div>
                )}
                {block.type === "button" && (
                  <>
                    <div>
                      <Label className="text-[11px] font-body text-muted-foreground">Button Text</Label>
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="mt-1 h-8 text-sm font-body"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-body text-muted-foreground">Link URL</Label>
                      <Input
                        value={block.url || ""}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        className="mt-1 h-8 text-sm font-body"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}
                {block.type === "image" && (
                  <>
                    <div>
                      <Label className="text-[11px] font-body text-muted-foreground">Image URL</Label>
                      <Input
                        value={block.url || ""}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        className="mt-1 h-8 text-sm font-body"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-body text-muted-foreground">Alt Text</Label>
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        className="mt-1 h-8 text-sm font-body"
                        placeholder="Image description"
                      />
                    </div>
                  </>
                )}
                {(block.type === "divider" || block.type === "spacer") && (
                  <p className="text-[11px] text-muted-foreground font-body">No settings for this block</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem("admin_email_templates");
    return saved ? JSON.parse(saved) : defaultTemplates;
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<EmailTemplate | null>(null);
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "transactional" | "marketing" | "system">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    description: "",
    category: "transactional" as "transactional" | "marketing" | "system",
  });
  const { toast } = useToast();

  const createTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject) {
      toast({ title: "Please fill in name and subject", variant: "destructive" });
      return;
    }
    const template: EmailTemplate = {
      id: `tpl-${Date.now()}`,
      name: newTemplate.name,
      subject: newTemplate.subject,
      description: newTemplate.description || "Custom template",
      category: newTemplate.category,
      body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a; font-size: 24px;">${newTemplate.name}</h1>
  <p style="color: #555;">Hi {{customer_name}},</p>
  <p style="color: #555;">Your email content goes here.</p>
  <a href="#" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Call to Action</a>
  <p style="color: #999; font-size: 12px; margin-top: 30px;">Fashion Spectrum — Redefining African Fashion</p>
</div>`,
      lastEdited: "Just now",
      active: true,
    };
    const updated = [template, ...templates];
    setTemplates(updated);
    localStorage.setItem("admin_email_templates", JSON.stringify(updated));
    setNewTemplate({ name: "", subject: "", description: "", category: "transactional" });
    setCreateOpen(false);
    toast({ title: "Template created" });
    startEdit(template);
  };

  const filtered = categoryFilter === "all"
    ? templates
    : templates.filter((t) => t.category === categoryFilter);

  const startEdit = (template: EmailTemplate) => {
    setEditing(template.id);
    setEditData({ ...template });
    setBlocks(parseHtmlToBlocks(template.body));
    setEditorMode("visual");
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditData(null);
    setBlocks([]);
  };

  const handleBlocksChange = (newBlocks: EmailBlock[]) => {
    setBlocks(newBlocks);
    if (editData) {
      setEditData({ ...editData, body: blocksToHtml(newBlocks) });
    }
  };

  const saveEdit = () => {
    if (!editData) return;
    const finalBody = editorMode === "visual" ? blocksToHtml(blocks) : editData.body;
    const updated = templates.map((t) =>
      t.id === editData.id ? { ...editData, body: finalBody, lastEdited: "Just now" } : t
    );
    setTemplates(updated);
    localStorage.setItem("admin_email_templates", JSON.stringify(updated));
    setEditing(null);
    setEditData(null);
    setBlocks([]);
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
        setBlocks(parseHtmlToBlocks(original.body));
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

  const isCustomTemplate = (id: string) => !defaultTemplates.some((t) => t.id === id);

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    localStorage.setItem("admin_email_templates", JSON.stringify(updated));
    toast({ title: "Template deleted" });
  };

  // Preview HTML with variable replacement
  const previewHtml = (editorMode === "visual" ? blocksToHtml(blocks) : editData?.body || "")
    .replace(/\{\{customer_name\}\}/g, "Sarah Johnson")
    .replace(/\{\{order_id\}\}/g, "1042")
    .replace(/\{\{order_total\}\}/g, "₦85,000")
    .replace(/\{\{order_date\}\}/g, "Feb 27, 2026")
    .replace(/\{\{tracking_number\}\}/g, "NG12345678")
    .replace(/\{\{carrier\}\}/g, "DHL Express")
    .replace(/\{\{delivery_date\}\}/g, "Mar 3, 2026")
    .replace(/\{\{cart_total\}\}/g, "₦45,000")
    .replace(/\{\{cart_items\}\}/g, "Royal Blue Agbada × 1, Gold Kaftan × 1");

  if (editing && editData) {
    const editorContent = (
      <div className="space-y-3">
        <div>
          <Label className="font-body text-xs">Template Name</Label>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="font-body mt-1 h-9 text-sm"
          />
        </div>
        <div>
          <Label className="font-body text-xs">Subject Line</Label>
          <Input
            value={editData.subject}
            onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
            className="font-body mt-1 h-9 text-sm"
          />
        </div>
        <Separator />
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={editorMode === "visual" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs font-body"
            onClick={() => {
              if (editorMode === "code" && editData) {
                setBlocks(parseHtmlToBlocks(editData.body));
              }
              setEditorMode("visual");
            }}
          >
            <Palette size={12} className="mr-1" /> Visual
          </Button>
          <Button
            variant={editorMode === "code" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs font-body"
            onClick={() => {
              if (editorMode === "visual") {
                setEditData({ ...editData, body: blocksToHtml(blocks) });
              }
              setEditorMode("code");
            }}
          >
            <Code2 size={12} className="mr-1" /> HTML
          </Button>
        </div>
        {editorMode === "visual" ? (
          <BlockEditor blocks={blocks} onChange={handleBlocksChange} />
        ) : (
          <Textarea
            value={editData.body}
            onChange={(e) => setEditData({ ...editData, body: e.target.value })}
            className="font-mono text-[11px] min-h-[300px]"
          />
        )}
      </div>
    );

    const previewContent = (
      <Card className={cn("overflow-hidden", previewMode === "mobile" && "max-w-[375px] mx-auto")}>
        <div className="bg-secondary/30 px-3 py-1.5 border-b border-border">
          <p className="text-[10px] font-body text-muted-foreground truncate">Subject: {editData.subject}</p>
        </div>
        <CardContent className="p-0">
          <div className="p-3 overflow-x-auto" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </CardContent>
      </Card>
    );

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-foreground truncate">
              Edit: {editData.name}
            </h1>
            <p className="text-xs sm:text-sm font-body text-muted-foreground mt-0.5">{editData.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={cancelEdit} className="font-body flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button size="sm" onClick={saveEdit} className="font-body flex-1 sm:flex-none">
              <Check size={14} className="mr-1" /> Save
            </Button>
          </div>
        </div>

        {/* Mobile: tabbed layout */}
        <div className="block lg:hidden">
          <Tabs defaultValue="editor">
            <TabsList className="w-full">
              <TabsTrigger value="editor" className="flex-1 font-body text-xs">
                <Edit3 size={14} className="mr-1" /> Builder
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 font-body text-xs">
                <Eye size={14} className="mr-1" /> Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="mt-3">
              <Card>
                <CardContent className="pt-4">
                  {editorContent}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preview" className="mt-3">
              {previewContent}
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: side-by-side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              {editorContent}
            </CardContent>
          </Card>
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
            {previewContent}
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
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="font-body">
              <Plus size={16} className="mr-2" /> New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Create Template</DialogTitle>
              <DialogDescription className="font-body">
                Set up a new email template. You'll use the visual builder to design it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="font-body text-sm">Template Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g. Refund Confirmation"
                  className="font-body mt-1.5"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Subject Line</Label>
                <Input
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  placeholder="e.g. Your refund has been processed"
                  className="font-body mt-1.5"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Description</Label>
                <Input
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="When is this template used?"
                  className="font-body mt-1.5"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Category</Label>
                <Select value={newTemplate.category} onValueChange={(v: "transactional" | "marketing" | "system") => setNewTemplate({ ...newTemplate, category: v })}>
                  <SelectTrigger className="font-body mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional" className="font-body">Transactional</SelectItem>
                    <SelectItem value="marketing" className="font-body">Marketing</SelectItem>
                    <SelectItem value="system" className="font-body">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)} className="font-body">Cancel</Button>
              <Button onClick={createTemplate} className="font-body">Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(["all", "transactional", "marketing", "system"] as const).map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className={cn(
              "font-body text-xs capitalize shrink-0 h-8",
              categoryFilter === cat && "border-primary bg-primary/5 text-primary"
            )}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat} ({cat === "all" ? templates.length : templates.filter((t) => t.category === cat).length})
          </Button>
        ))}
      </div>

      {/* Template List */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((template) => (
          <Card key={template.id} className={cn("transition-all", !template.active && "opacity-60")}>
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-heading text-sm font-semibold truncate">{template.name}</h3>
                  <Badge variant="outline" className={cn("text-[10px] font-body capitalize shrink-0", categoryColors[template.category])}>
                    {template.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => copyHtml(template.body)} className="h-8 w-8 p-0">
                    <Copy size={14} />
                  </Button>
                  {isCustomTemplate(template.id) ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading">Delete template?</AlertDialogTitle>
                          <AlertDialogDescription className="font-body">
                            This will permanently delete "{template.name}". This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteTemplate(template.id)}
                            className="font-body bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Undo2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading">Reset template?</AlertDialogTitle>
                          <AlertDialogDescription className="font-body">
                            This will reset "{template.name}" to its default content.
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
                  )}
                </div>
              </div>
              <p className="text-xs font-body text-muted-foreground truncate mb-2">{template.subject}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-body text-muted-foreground">
                  Edited {template.lastEdited}
                </span>
                <Button variant="outline" size="sm" onClick={() => startEdit(template)} className="font-body text-xs h-7 px-3">
                  <Edit3 size={12} className="mr-1" /> Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminEmailTemplates;
