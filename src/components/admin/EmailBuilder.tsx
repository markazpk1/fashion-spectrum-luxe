import { useState, useCallback, useRef } from "react";
import {
  Type, Image, MousePointer2, Minus, Square, Columns2, List,
  GripVertical, Trash2, ChevronUp, ChevronDown, Copy, ArrowLeft,
  Eye, Code2, Smartphone, Monitor, Save, Undo2, Settings2,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Link2,
  LayoutTemplate, Megaphone, Newspaper, Rocket, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Block Types ────────────────────────────────────────────────

type BlockType = "heading" | "text" | "image" | "button" | "divider" | "spacer" | "columns" | "list";

interface BlockBase {
  id: string;
  type: BlockType;
}

interface HeadingBlock extends BlockBase {
  type: "heading";
  content: string;
  level: "h1" | "h2" | "h3";
  align: "left" | "center" | "right";
  color: string;
}

interface TextBlock extends BlockBase {
  type: "text";
  content: string;
  align: "left" | "center" | "right";
  color: string;
  fontSize: number;
}

interface ImageBlock extends BlockBase {
  type: "image";
  src: string;
  alt: string;
  width: number;
  align: "left" | "center" | "right";
  borderRadius: number;
}

interface ButtonBlock extends BlockBase {
  type: "button";
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  align: "left" | "center" | "right";
  borderRadius: number;
  fullWidth: boolean;
}

interface DividerBlock extends BlockBase {
  type: "divider";
  color: string;
  thickness: number;
  style: "solid" | "dashed" | "dotted";
}

interface SpacerBlock extends BlockBase {
  type: "spacer";
  height: number;
}

interface ColumnsBlock extends BlockBase {
  type: "columns";
  columns: 2 | 3;
  content: string[];
}

interface ListBlock extends BlockBase {
  type: "list";
  items: string[];
  style: "bullet" | "numbered";
  color: string;
}

type EmailBlock = HeadingBlock | TextBlock | ImageBlock | ButtonBlock | DividerBlock | SpacerBlock | ColumnsBlock | ListBlock;

// ─── Toolbox config ─────────────────────────────────────────────

const toolboxItems: { type: BlockType; label: string; icon: typeof Type; description: string }[] = [
  { type: "heading", label: "Heading", icon: Type, description: "Title or section header" },
  { type: "text", label: "Text", icon: AlignLeft, description: "Paragraph or body text" },
  { type: "image", label: "Image", icon: Image, description: "Photo or graphic" },
  { type: "button", label: "Button", icon: MousePointer2, description: "Call-to-action button" },
  { type: "divider", label: "Divider", icon: Minus, description: "Horizontal line" },
  { type: "spacer", label: "Spacer", icon: Square, description: "Empty vertical space" },
  { type: "columns", label: "Columns", icon: Columns2, description: "Side-by-side content" },
  { type: "list", label: "List", icon: List, description: "Bullet or numbered list" },
];

// ─── Factory ────────────────────────────────────────────────────

function createBlock(type: BlockType): EmailBlock {
  const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  switch (type) {
    case "heading": return { id, type, content: "Your Heading Here", level: "h1", align: "center", color: "#1a1a1a" };
    case "text": return { id, type, content: "Write your email content here. Keep it short and engaging to capture your reader's attention.", align: "left", color: "#555555", fontSize: 16 };
    case "image": return { id, type, src: "https://placehold.co/600x300/f0f0f0/999?text=Your+Image", alt: "Email image", width: 100, align: "center", borderRadius: 8 };
    case "button": return { id, type, text: "Shop Now", url: "#", bgColor: "#1a1a1a", textColor: "#ffffff", align: "center", borderRadius: 6, fullWidth: false };
    case "divider": return { id, type, color: "#e0e0e0", thickness: 1, style: "solid" };
    case "spacer": return { id, type, height: 24 };
    case "columns": return { id, type, columns: 2, content: ["Left column content", "Right column content"] };
    case "list": return { id, type, items: ["First item", "Second item", "Third item"], style: "bullet", color: "#555555" };
  }
}

// ─── Default starter blocks ────────────────────────────────────

const starterBlocks: EmailBlock[] = [
  createBlock("heading"),
  createBlock("text"),
  createBlock("image"),
  createBlock("button"),
];

// ─── Template Presets ──────────────────────────────────────────

interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  icon: typeof Megaphone;
  color: string;
  blocks: () => EmailBlock[];
}

const uid = () => `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const templatePresets: TemplatePreset[] = [
  {
    id: "promotional",
    name: "Promotional Sale",
    description: "Bold sale announcement with hero image and CTA",
    icon: Megaphone,
    color: "text-rose-500 bg-rose-500/10",
    blocks: () => [
      { id: uid(), type: "image", src: "https://placehold.co/600x280/1a1a1a/ffffff?text=SALE+UP+TO+50%25+OFF", alt: "Sale banner", width: 100, align: "center", borderRadius: 0 } as ImageBlock,
      { id: uid(), type: "spacer", height: 16 } as SpacerBlock,
      { id: uid(), type: "heading", content: "Exclusive Sale — Limited Time Only", level: "h1", align: "center", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "text", content: "Don't miss our biggest sale of the season. Get up to 50% off on our premium African-inspired collection. From elegant kaftans to regal agbadas — now is the time to elevate your wardrobe.", align: "center", color: "#555555", fontSize: 16 } as TextBlock,
      { id: uid(), type: "divider", color: "#e0e0e0", thickness: 1, style: "solid" } as DividerBlock,
      { id: uid(), type: "columns", columns: 2, content: ["🔥 <strong>Flash Deals</strong><br/>Selected items at 50% off. First come, first served.", "🎁 <strong>Free Shipping</strong><br/>On all orders over ₦50,000. No code needed."] } as ColumnsBlock,
      { id: uid(), type: "spacer", height: 12 } as SpacerBlock,
      { id: uid(), type: "button", text: "Shop the Sale →", url: "#", bgColor: "#c0392b", textColor: "#ffffff", align: "center", borderRadius: 8, fullWidth: false } as ButtonBlock,
      { id: uid(), type: "spacer", height: 16 } as SpacerBlock,
      { id: uid(), type: "text", content: "Offer valid until March 15, 2026. Cannot be combined with other promotions.", align: "center", color: "#999999", fontSize: 12 } as TextBlock,
    ],
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "Clean weekly newsletter with multiple content sections",
    icon: Newspaper,
    color: "text-blue-500 bg-blue-500/10",
    blocks: () => [
      { id: uid(), type: "heading", content: "Weekly Style Update", level: "h2", align: "center", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "text", content: "Your weekly dose of fashion inspiration, styling tips, and behind-the-scenes updates from our atelier.", align: "center", color: "#777777", fontSize: 14 } as TextBlock,
      { id: uid(), type: "divider", color: "#e0e0e0", thickness: 1, style: "solid" } as DividerBlock,
      { id: uid(), type: "heading", content: "Editor's Pick of the Week", level: "h3", align: "left", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "image", src: "https://placehold.co/600x300/f5f0eb/333?text=Featured+Look", alt: "Featured look", width: 100, align: "center", borderRadius: 8 } as ImageBlock,
      { id: uid(), type: "text", content: "This week we're spotlighting the Royal Blue Senator — a timeless piece that combines traditional elegance with modern tailoring. Perfect for special occasions and evening events.", align: "left", color: "#555555", fontSize: 15 } as TextBlock,
      { id: uid(), type: "button", text: "Read More", url: "#", bgColor: "#2980b9", textColor: "#ffffff", align: "left", borderRadius: 6, fullWidth: false } as ButtonBlock,
      { id: uid(), type: "spacer", height: 20 } as SpacerBlock,
      { id: uid(), type: "heading", content: "Style Tips", level: "h3", align: "left", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "list", items: ["How to accessorize your agbada for weddings", "5 ways to style a kaftan for casual outings", "Fabric care guide: keeping your pieces pristine"], style: "bullet", color: "#555555" } as ListBlock,
      { id: uid(), type: "divider", color: "#e0e0e0", thickness: 1, style: "dashed" } as DividerBlock,
      { id: uid(), type: "text", content: "Thanks for reading! Follow us on Instagram @yourbrand for daily inspiration.", align: "center", color: "#999999", fontSize: 13 } as TextBlock,
    ],
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Announce a new product with features and imagery",
    icon: Rocket,
    color: "text-violet-500 bg-violet-500/10",
    blocks: () => [
      { id: uid(), type: "text", content: "JUST DROPPED", align: "center", color: "#8e44ad", fontSize: 13 } as TextBlock,
      { id: uid(), type: "heading", content: "Introducing the Heritage Collection", level: "h1", align: "center", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "text", content: "A celebration of African craftsmanship meeting contemporary design. Each piece tells a story of heritage, tradition, and modern expression.", align: "center", color: "#555555", fontSize: 16 } as TextBlock,
      { id: uid(), type: "image", src: "https://placehold.co/600x400/2c2c2c/ffffff?text=Heritage+Collection", alt: "Heritage Collection", width: 100, align: "center", borderRadius: 12 } as ImageBlock,
      { id: uid(), type: "spacer", height: 16 } as SpacerBlock,
      { id: uid(), type: "columns", columns: 3, content: ["✂️ <strong>Hand-Tailored</strong><br/>Crafted by master artisans", "🧵 <strong>Premium Fabric</strong><br/>100% premium cotton blend", "📦 <strong>Gift Ready</strong><br/>Luxury packaging included"] } as ColumnsBlock,
      { id: uid(), type: "spacer", height: 16 } as SpacerBlock,
      { id: uid(), type: "heading", content: "Available in 6 Styles", level: "h3", align: "center", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "columns", columns: 2, content: ["<strong>Classic Agbada</strong> — ₦85,000<br/><strong>Royal Kaftan</strong> — ₦65,000<br/><strong>Senator Suit</strong> — ₦55,000", "<strong>Grand Boubou</strong> — ₦95,000<br/><strong>Dashiki Deluxe</strong> — ₦45,000<br/><strong>Aso Oke Set</strong> — ₦120,000"] } as ColumnsBlock,
      { id: uid(), type: "spacer", height: 12 } as SpacerBlock,
      { id: uid(), type: "button", text: "Explore the Collection", url: "#", bgColor: "#8e44ad", textColor: "#ffffff", align: "center", borderRadius: 8, fullWidth: false } as ButtonBlock,
      { id: uid(), type: "spacer", height: 8 } as SpacerBlock,
      { id: uid(), type: "text", content: "Pre-orders ship by March 10. Free returns within 30 days.", align: "center", color: "#999999", fontSize: 12 } as TextBlock,
    ],
  },
  {
    id: "welcome",
    name: "Welcome Email",
    description: "Warm onboarding email for new subscribers",
    icon: Sparkles,
    color: "text-amber-500 bg-amber-500/10",
    blocks: () => [
      { id: uid(), type: "heading", content: "Welcome to the Family! 🎉", level: "h1", align: "center", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "text", content: "Thank you for joining us! We're thrilled to have you as part of our community. Get ready for exclusive access to new collections, special offers, and styling inspiration delivered straight to your inbox.", align: "center", color: "#555555", fontSize: 16 } as TextBlock,
      { id: uid(), type: "divider", color: "#e0e0e0", thickness: 1, style: "solid" } as DividerBlock,
      { id: uid(), type: "heading", content: "Here's What You Get", level: "h2", align: "center", color: "#1a1a1a" } as HeadingBlock,
      { id: uid(), type: "list", items: ["10% off your first order — use code WELCOME10", "Early access to new drops & limited editions", "Exclusive member-only sales and events", "Styling tips and fashion guides"], style: "bullet", color: "#555555" } as ListBlock,
      { id: uid(), type: "spacer", height: 12 } as SpacerBlock,
      { id: uid(), type: "button", text: "Start Shopping — 10% Off", url: "#", bgColor: "#27ae60", textColor: "#ffffff", align: "center", borderRadius: 8, fullWidth: false } as ButtonBlock,
      { id: uid(), type: "spacer", height: 20 } as SpacerBlock,
      { id: uid(), type: "image", src: "https://placehold.co/600x250/f9f5f0/333?text=Best+Sellers", alt: "Best sellers", width: 100, align: "center", borderRadius: 8 } as ImageBlock,
      { id: uid(), type: "text", content: "Check out our most popular pieces — loved by thousands of customers.", align: "center", color: "#555555", fontSize: 14 } as TextBlock,
      { id: uid(), type: "button", text: "View Best Sellers", url: "#", bgColor: "#1a1a1a", textColor: "#ffffff", align: "center", borderRadius: 6, fullWidth: false } as ButtonBlock,
    ],
  },
];

// ─── Main Component ─────────────────────────────────────────────

interface EmailBuilderProps {
  onBack: () => void;
  campaignName?: string;
  initialBlocks?: EmailBlock[];
  onSave?: (blocks: EmailBlock[], html: string) => void;
}

const EmailBuilder = ({ onBack, campaignName = "Campaign", initialBlocks, onSave }: EmailBuilderProps) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks || starterBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragFromToolbox, setDragFromToolbox] = useState<BlockType | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "code">("edit");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  // ─── Load template preset ──────────────────────────────────
  const loadTemplate = useCallback((preset: TemplatePreset) => {
    setBlocks(preset.blocks());
    setSelectedId(null);
  }, []);

  // ─── Block operations ──────────────────────────────────────

  const updateBlock = useCallback((id: string, updates: Partial<EmailBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } as EmailBlock : b)));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const dup = { ...prev[idx], id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` } as EmailBlock;
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next;
    });
  }, []);

  const moveBlock = useCallback((id: string, direction: -1 | 1) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const target = idx + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  // ─── Drag & Drop (canvas reorder) ─────────────────────────

  const handleCanvasDragStart = (id: string) => {
    setDraggedId(id);
    setDragFromToolbox(null);
  };

  const handleCanvasDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleCanvasDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    if (dragFromToolbox) {
      // Insert new block from toolbox
      const newBlock = createBlock(dragFromToolbox);
      setBlocks((prev) => {
        const idx = prev.findIndex((b) => b.id === targetId);
        const next = [...prev];
        next.splice(idx, 0, newBlock);
        return next;
      });
      setSelectedId(newBlock.id);
      setDragFromToolbox(null);
      return;
    }

    if (!draggedId || draggedId === targetId) return;
    setBlocks((prev) => {
      const fromIdx = prev.findIndex((b) => b.id === draggedId);
      const toIdx = prev.findIndex((b) => b.id === targetId);
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDraggedId(null);
  };

  const handleDropOnEmpty = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragFromToolbox) {
      const newBlock = createBlock(dragFromToolbox);
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedId(newBlock.id);
      setDragFromToolbox(null);
    }
    setDragOverId(null);
  };

  // ─── Toolbox drag ─────────────────────────────────────────

  const handleToolboxDragStart = (e: React.DragEvent, type: BlockType) => {
    setDragFromToolbox(type);
    setDraggedId(null);
    e.dataTransfer.effectAllowed = "copy";
  };

  // ─── Add block from toolbox click ─────────────────────────

  const addBlock = (type: BlockType) => {
    const newBlock = createBlock(type);
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedId(newBlock.id);
  };

  // ─── Export HTML ──────────────────────────────────────────

  const generateHtml = useCallback((): string => {
    const renderBlock = (block: EmailBlock): string => {
      switch (block.type) {
        case "heading": {
          const sizes = { h1: "28px", h2: "22px", h3: "18px" };
          return `<${block.level} style="color: ${block.color}; text-align: ${block.align}; font-size: ${sizes[block.level]}; font-family: Arial, sans-serif; margin: 0 0 12px;">${block.content}</${block.level}>`;
        }
        case "text":
          return `<p style="color: ${block.color}; text-align: ${block.align}; font-size: ${block.fontSize}px; line-height: 1.6; font-family: Arial, sans-serif; margin: 0 0 16px;">${block.content}</p>`;
        case "image":
          return `<div style="text-align: ${block.align};"><img src="${block.src}" alt="${block.alt}" style="max-width: ${block.width}%; border-radius: ${block.borderRadius}px; display: inline-block;" /></div>`;
        case "button": {
          const btnStyle = `display: inline-block; background: ${block.bgColor}; color: ${block.textColor}; padding: 14px 28px; border-radius: ${block.borderRadius}px; text-decoration: none; font-family: Arial, sans-serif; font-weight: 600; font-size: 16px;${block.fullWidth ? " display: block; text-align: center;" : ""}`;
          return `<div style="text-align: ${block.align}; margin: 20px 0;"><a href="${block.url}" style="${btnStyle}">${block.text}</a></div>`;
        }
        case "divider":
          return `<hr style="border: none; border-top: ${block.thickness}px ${block.style} ${block.color}; margin: 16px 0;" />`;
        case "spacer":
          return `<div style="height: ${block.height}px;"></div>`;
        case "columns":
          return `<table width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0;"><tr>${block.content.map((c) => `<td style="padding: 8px; vertical-align: top; font-family: Arial, sans-serif; color: #555; font-size: 14px;">${c}</td>`).join("")}</tr></table>`;
        case "list": {
          const tag = block.style === "bullet" ? "ul" : "ol";
          return `<${tag} style="color: ${block.color}; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 12px 0;">${block.items.map((i) => `<li>${i}</li>`).join("")}</${tag}>`;
        }
      }
    };

    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f4f4f4; font-family: Arial, sans-serif;">
<div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px;">
${blocks.map(renderBlock).join("\n")}
</div>
</body></html>`;
  }, [blocks]);

  const handleSave = () => {
    onSave?.(blocks, generateHtml());
  };

  // ─── Block Renderer (canvas) ──────────────────────────────

  const renderBlockPreview = (block: EmailBlock) => {
    const isSelected = selectedId === block.id;
    switch (block.type) {
      case "heading": {
        const Tag = block.level;
        const sizes = { h1: "text-2xl", h2: "text-xl", h3: "text-lg" };
        return <Tag className={cn("font-heading font-bold", sizes[block.level])} style={{ color: block.color, textAlign: block.align }}>{block.content}</Tag>;
      }
      case "text":
        return <p className="font-body leading-relaxed" style={{ color: block.color, textAlign: block.align, fontSize: block.fontSize }}>{block.content}</p>;
      case "image":
        return (
          <div style={{ textAlign: block.align }}>
            <img src={block.src} alt={block.alt} style={{ maxWidth: `${block.width}%`, borderRadius: block.borderRadius }} className="inline-block" />
          </div>
        );
      case "button":
        return (
          <div style={{ textAlign: block.align }}>
            <span
              className={cn("inline-block font-body font-semibold cursor-default", block.fullWidth && "block text-center")}
              style={{ background: block.bgColor, color: block.textColor, padding: "12px 24px", borderRadius: block.borderRadius }}
            >
              {block.text}
            </span>
          </div>
        );
      case "divider":
        return <hr style={{ border: "none", borderTop: `${block.thickness}px ${block.style} ${block.color}` }} />;
      case "spacer":
        return <div style={{ height: block.height }} className="bg-muted/20 rounded border border-dashed border-border" />;
      case "columns":
        return (
          <div className={cn("grid gap-3", block.columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
            {block.content.map((c, i) => (
              <div key={i} className="p-3 bg-secondary/30 rounded-lg font-body text-sm text-muted-foreground">{c}</div>
            ))}
          </div>
        );
      case "list":
        return block.style === "bullet" ? (
          <ul className="list-disc pl-5 space-y-1 font-body text-sm" style={{ color: block.color }}>
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : (
          <ol className="list-decimal pl-5 space-y-1 font-body text-sm" style={{ color: block.color }}>
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
    }
  };

  // ─── Property Panel ───────────────────────────────────────

  const renderProperties = () => {
    if (!selectedBlock) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Settings2 size={32} className="text-muted-foreground/20 mb-3" />
          <p className="font-body text-sm text-muted-foreground">Select a block to edit its properties</p>
        </div>
      );
    }

    const block = selectedBlock;

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-foreground capitalize">{block.type} Properties</h3>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteBlock(block.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
        <Separator />

        {block.type === "heading" && (
          <>
            <div>
              <Label className="font-body text-xs">Content</Label>
              <Input value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} className="font-body mt-1 text-sm" />
            </div>
            <div>
              <Label className="font-body text-xs">Level</Label>
              <Select value={block.level} onValueChange={(v: "h1" | "h2" | "h3") => updateBlock(block.id, { level: v })}>
                <SelectTrigger className="font-body mt-1 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1" className="font-body">H1 — Large</SelectItem>
                  <SelectItem value="h2" className="font-body">H2 — Medium</SelectItem>
                  <SelectItem value="h3" className="font-body">H3 — Small</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlignPicker value={block.align} onChange={(v) => updateBlock(block.id, { align: v })} />
            <ColorPicker label="Color" value={block.color} onChange={(v) => updateBlock(block.id, { color: v })} />
          </>
        )}

        {block.type === "text" && (
          <>
            <div>
              <Label className="font-body text-xs">Content</Label>
              <Textarea value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} className="font-body mt-1 text-sm min-h-[100px]" />
            </div>
            <div>
              <Label className="font-body text-xs">Font Size: {block.fontSize}px</Label>
              <Slider value={[block.fontSize]} min={12} max={24} step={1} onValueChange={([v]) => updateBlock(block.id, { fontSize: v })} className="mt-2" />
            </div>
            <AlignPicker value={block.align} onChange={(v) => updateBlock(block.id, { align: v })} />
            <ColorPicker label="Color" value={block.color} onChange={(v) => updateBlock(block.id, { color: v })} />
          </>
        )}

        {block.type === "image" && (
          <>
            <div>
              <Label className="font-body text-xs">Image URL</Label>
              <Input value={block.src} onChange={(e) => updateBlock(block.id, { src: e.target.value })} className="font-body mt-1 text-sm" placeholder="https://..." />
            </div>
            <div>
              <Label className="font-body text-xs">Alt Text</Label>
              <Input value={block.alt} onChange={(e) => updateBlock(block.id, { alt: e.target.value })} className="font-body mt-1 text-sm" />
            </div>
            <div>
              <Label className="font-body text-xs">Width: {block.width}%</Label>
              <Slider value={[block.width]} min={20} max={100} step={5} onValueChange={([v]) => updateBlock(block.id, { width: v })} className="mt-2" />
            </div>
            <div>
              <Label className="font-body text-xs">Border Radius: {block.borderRadius}px</Label>
              <Slider value={[block.borderRadius]} min={0} max={24} step={2} onValueChange={([v]) => updateBlock(block.id, { borderRadius: v })} className="mt-2" />
            </div>
            <AlignPicker value={block.align} onChange={(v) => updateBlock(block.id, { align: v })} />
          </>
        )}

        {block.type === "button" && (
          <>
            <div>
              <Label className="font-body text-xs">Button Text</Label>
              <Input value={block.text} onChange={(e) => updateBlock(block.id, { text: e.target.value })} className="font-body mt-1 text-sm" />
            </div>
            <div>
              <Label className="font-body text-xs">Link URL</Label>
              <Input value={block.url} onChange={(e) => updateBlock(block.id, { url: e.target.value })} className="font-body mt-1 text-sm" placeholder="https://..." />
            </div>
            <ColorPicker label="Background" value={block.bgColor} onChange={(v) => updateBlock(block.id, { bgColor: v })} />
            <ColorPicker label="Text Color" value={block.textColor} onChange={(v) => updateBlock(block.id, { textColor: v })} />
            <div>
              <Label className="font-body text-xs">Border Radius: {block.borderRadius}px</Label>
              <Slider value={[block.borderRadius]} min={0} max={24} step={2} onValueChange={([v]) => updateBlock(block.id, { borderRadius: v })} className="mt-2" />
            </div>
            <AlignPicker value={block.align} onChange={(v) => updateBlock(block.id, { align: v })} />
            <div className="flex items-center justify-between">
              <Label className="font-body text-xs">Full Width</Label>
              <button
                onClick={() => updateBlock(block.id, { fullWidth: !block.fullWidth })}
                className={cn("w-9 h-5 rounded-full transition-colors", block.fullWidth ? "bg-primary" : "bg-muted")}
              >
                <div className={cn("w-4 h-4 rounded-full bg-card shadow transition-transform mx-0.5", block.fullWidth && "translate-x-4")} />
              </button>
            </div>
          </>
        )}

        {block.type === "divider" && (
          <>
            <div>
              <Label className="font-body text-xs">Style</Label>
              <Select value={block.style} onValueChange={(v: "solid" | "dashed" | "dotted") => updateBlock(block.id, { style: v })}>
                <SelectTrigger className="font-body mt-1 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid" className="font-body">Solid</SelectItem>
                  <SelectItem value="dashed" className="font-body">Dashed</SelectItem>
                  <SelectItem value="dotted" className="font-body">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-xs">Thickness: {block.thickness}px</Label>
              <Slider value={[block.thickness]} min={1} max={5} step={1} onValueChange={([v]) => updateBlock(block.id, { thickness: v })} className="mt-2" />
            </div>
            <ColorPicker label="Color" value={block.color} onChange={(v) => updateBlock(block.id, { color: v })} />
          </>
        )}

        {block.type === "spacer" && (
          <div>
            <Label className="font-body text-xs">Height: {block.height}px</Label>
            <Slider value={[block.height]} min={8} max={80} step={4} onValueChange={([v]) => updateBlock(block.id, { height: v })} className="mt-2" />
          </div>
        )}

        {block.type === "columns" && (
          <>
            <div>
              <Label className="font-body text-xs">Number of Columns</Label>
              <Select value={String(block.columns)} onValueChange={(v) => {
                const cols = Number(v) as 2 | 3;
                const content = [...block.content];
                while (content.length < cols) content.push("Column content");
                updateBlock(block.id, { columns: cols, content: content.slice(0, cols) });
              }}>
                <SelectTrigger className="font-body mt-1 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2" className="font-body">2 Columns</SelectItem>
                  <SelectItem value="3" className="font-body">3 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {block.content.map((c, i) => (
              <div key={i}>
                <Label className="font-body text-xs">Column {i + 1}</Label>
                <Textarea
                  value={c}
                  onChange={(e) => {
                    const content = [...block.content];
                    content[i] = e.target.value;
                    updateBlock(block.id, { content });
                  }}
                  className="font-body mt-1 text-sm min-h-[60px]"
                />
              </div>
            ))}
          </>
        )}

        {block.type === "list" && (
          <>
            <div>
              <Label className="font-body text-xs">Style</Label>
              <Select value={block.style} onValueChange={(v: "bullet" | "numbered") => updateBlock(block.id, { style: v })}>
                <SelectTrigger className="font-body mt-1 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet" className="font-body">Bullet</SelectItem>
                  <SelectItem value="numbered" className="font-body">Numbered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {block.items.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Input
                  value={item}
                  onChange={(e) => {
                    const items = [...block.items];
                    items[i] = e.target.value;
                    updateBlock(block.id, { items });
                  }}
                  className="font-body text-sm flex-1"
                />
                {block.items.length > 1 && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                    const items = block.items.filter((_, j) => j !== i);
                    updateBlock(block.id, { items });
                  }}>
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" className="font-body text-xs w-full" onClick={() => {
              updateBlock(block.id, { items: [...block.items, "New item"] });
            }}>
              + Add Item
            </Button>
            <ColorPicker label="Color" value={block.color} onChange={(v) => updateBlock(block.id, { color: v })} />
          </>
        )}
      </div>
    );
  };

  // ─── Preview Mode ─────────────────────────────────────────

  if (viewMode === "preview") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setViewMode("edit")} className="font-body">
            <ArrowLeft size={16} className="mr-2" /> Back to Editor
          </Button>
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5">
            <button onClick={() => setPreviewDevice("desktop")} className={cn("px-3 py-1.5 rounded-md text-xs font-body transition-colors flex items-center gap-1.5", previewDevice === "desktop" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>
              <Monitor size={13} /> Desktop
            </button>
            <button onClick={() => setPreviewDevice("mobile")} className={cn("px-3 py-1.5 rounded-md text-xs font-body transition-colors flex items-center gap-1.5", previewDevice === "mobile" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>
              <Smartphone size={13} /> Mobile
            </button>
          </div>
        </div>
        <div className={cn("mx-auto bg-card rounded-xl border border-border shadow-lg overflow-hidden", previewDevice === "mobile" ? "max-w-[375px]" : "max-w-[640px]")}>
          <div className="bg-secondary/30 px-4 py-2 border-b border-border text-xs font-body text-muted-foreground">Preview — {previewDevice}</div>
          <div dangerouslySetInnerHTML={{ __html: generateHtml() }} />
        </div>
      </div>
    );
  }

  // ─── Code Mode ────────────────────────────────────────────

  if (viewMode === "code") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setViewMode("edit")} className="font-body">
            <ArrowLeft size={16} className="mr-2" /> Back to Editor
          </Button>
          <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => { navigator.clipboard.writeText(generateHtml()); }}>
            <Copy size={12} className="mr-1.5" /> Copy HTML
          </Button>
        </div>
        <pre className="bg-secondary/30 rounded-xl border border-border p-4 overflow-auto max-h-[70vh] text-xs font-mono text-foreground whitespace-pre-wrap">
          {generateHtml()}
        </pre>
      </div>
    );
  }

  // ─── Editor Mode ──────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="font-body">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h2 className="font-heading text-lg font-semibold text-foreground">{campaignName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => setViewMode("preview")}>
            <Eye size={13} className="mr-1.5" /> Preview
          </Button>
          <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => setViewMode("code")}>
            <Code2 size={13} className="mr-1.5" /> HTML
          </Button>
          <Button size="sm" className="font-body text-xs" onClick={handleSave}>
            <Save size={13} className="mr-1.5" /> Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr_260px] gap-4 min-h-[70vh]">
        {/* Toolbox */}
        <div className="bg-card rounded-xl border border-border p-3 space-y-1 h-fit sticky top-20 max-h-[80vh] overflow-y-auto">
          <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Templates</p>
          {templatePresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <div
                key={preset.id}
                onClick={() => loadTemplate(preset)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors group"
              >
                <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", preset.color)}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-body font-medium text-foreground">{preset.name}</p>
                  <p className="text-[10px] font-body text-muted-foreground leading-tight truncate">{preset.description}</p>
                </div>
              </div>
            );
          })}

          <Separator className="my-2" />
          <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Blocks</p>
          {toolboxItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => handleToolboxDragStart(e, item.type)}
                onClick={() => addBlock(item.type)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-secondary/70 transition-colors group"
              >
                <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-xs font-body font-medium text-foreground">{item.label}</p>
                  <p className="text-[10px] font-body text-muted-foreground leading-tight">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="bg-secondary/20 rounded-xl border border-border p-4 min-h-[500px]"
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={handleDropOnEmpty}
        >
          <div className="max-w-[600px] mx-auto bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            {blocks.length === 0 ? (
              <div className="py-20 text-center">
                <Image size={40} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="font-heading text-sm text-muted-foreground mb-1">Drop blocks here</p>
                <p className="text-xs font-body text-muted-foreground/70">Drag blocks from the left panel or click to add</p>
              </div>
            ) : (
              blocks.map((block, idx) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleCanvasDragStart(block.id)}
                  onDragOver={(e) => handleCanvasDragOver(e, block.id)}
                  onDrop={(e) => handleCanvasDrop(e, block.id)}
                  onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(block.id); }}
                  className={cn(
                    "relative group transition-all px-6 py-3",
                    selectedId === block.id && "ring-2 ring-primary/40 bg-primary/[0.02]",
                    dragOverId === block.id && "border-t-2 border-primary",
                    draggedId === block.id && "opacity-40"
                  )}
                >
                  {/* Hover controls */}
                  <div className={cn(
                    "absolute -left-0 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 transition-opacity",
                    selectedId === block.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <button className="p-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
                      <GripVertical size={14} />
                    </button>
                  </div>
                  <div className={cn(
                    "absolute right-1 top-1 flex items-center gap-0.5 transition-opacity",
                    selectedId === block.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    {idx > 0 && (
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, -1); }} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                        <ChevronUp size={12} />
                      </button>
                    )}
                    {idx < blocks.length - 1 && (
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 1); }} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                        <ChevronDown size={12} />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary">
                      <Copy size={12} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {renderBlockPreview(block)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="bg-card rounded-xl border border-border overflow-hidden h-fit sticky top-20 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 border-b border-border bg-secondary/20">
            <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">Properties</p>
          </div>
          {renderProperties()}
        </div>
      </div>
    </div>
  );
};

// ─── Shared sub-components ──────────────────────────────────

function AlignPicker({ value, onChange }: { value: string; onChange: (v: "left" | "center" | "right") => void }) {
  return (
    <div>
      <Label className="font-body text-xs">Alignment</Label>
      <div className="flex gap-1 mt-1.5">
        {(["left", "center", "right"] as const).map((a) => {
          const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
          return (
            <button
              key={a}
              onClick={() => onChange(a)}
              className={cn(
                "p-2 rounded-md transition-colors",
                value === a ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const presets = ["#1a1a1a", "#555555", "#999999", "#e0e0e0", "#ffffff", "#c0392b", "#2980b9", "#27ae60", "#f39c12", "#8e44ad"];
  return (
    <div>
      <Label className="font-body text-xs">{label}</Label>
      <div className="flex items-center gap-2 mt-1.5">
        <div className="flex gap-1 flex-wrap">
          {presets.map((c) => (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={cn("w-5 h-5 rounded-full border-2 transition-all", value === c ? "border-primary scale-110" : "border-transparent hover:scale-110")}
              style={{ background: c }}
            />
          ))}
        </div>
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs w-20 h-7" />
      </div>
    </div>
  );
}

export default EmailBuilder;
