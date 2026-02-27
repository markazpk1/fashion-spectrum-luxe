import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, GripVertical, Image, Type, FileText, Layout, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Editable content model for the Home page
interface HeroContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  autoSlide: boolean;
  slideInterval: number;
}

interface AnnouncementContent {
  text: string;
  enabled: boolean;
}

interface CollectionBannerContent {
  subtitle: string;
  title: string;
  ctaText: string;
  ctaLink: string;
}

interface AboutContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  ctaText: string;
}

interface FooterContent {
  newsletterTitle: string;
  newsletterSubtitle: string;
  ctaText: string;
  copyright: string;
}

interface SectionMeta {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
}

// Default content matching the current storefront
const defaultHomeContent = {
  hero: {
    titleLine1: "Luxurious",
    titleLine2: "Kaftan Collection",
    subtitle: "Discover our latest collection of handcrafted kaftans, dresses & resort wear designed for the modern woman.",
    ctaText: "Shop Collection",
    ctaLink: "#new-arrivals",
    autoSlide: true,
    slideInterval: 4500,
  } as HeroContent,
  announcement: {
    text: "Free Shipping Over $300",
    enabled: true,
  } as AnnouncementContent,
  collectionBanner: {
    subtitle: "Latest Collection",
    title: "Golden Lady",
    ctaText: "Explore Collection",
    ctaLink: "#",
  } as CollectionBannerContent,
  about: {
    title: "About The Brand",
    paragraph1: "FashionSpectrum is the zenith of luxury resort wear, crafted for the modern woman who embraces elegance in every moment. Our collections blend cultural artistry with contemporary design, creating pieces that transcend seasons and boundaries.",
    paragraph2: "Each garment is meticulously designed with premium fabrics and intricate embellishments, ensuring that every piece tells a story of sophistication, comfort, and timeless beauty. From sun-drenched beaches to glamorous evening events, FashionSpectrum dresses you in confidence.",
    ctaText: "Learn More",
  } as AboutContent,
  footer: {
    newsletterTitle: "Join the FashionSpectrum World",
    newsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    ctaText: "Subscribe",
    copyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  } as FooterContent,
};

const defaultSections: SectionMeta[] = [
  { id: "announcement", label: "Announcement Bar", icon: <Globe size={16} />, enabled: true },
  { id: "hero", label: "Hero Section", icon: <Image size={16} />, enabled: true },
  { id: "newArrivals", label: "New Arrivals", icon: <Layout size={16} />, enabled: true },
  { id: "collectionBanner", label: "Collection Banner", icon: <Image size={16} />, enabled: true },
  { id: "saleBanner", label: "Summer Sale", icon: <Layout size={16} />, enabled: true },
  { id: "bestSellers", label: "Best Sellers", icon: <Layout size={16} />, enabled: true },
  { id: "about", label: "About Brand", icon: <FileText size={16} />, enabled: true },
  { id: "footer", label: "Footer", icon: <Mail size={16} />, enabled: true },
];

// Simple page content for non-home pages
interface SimplePageContent {
  title: string;
  metaDescription: string;
  heading: string;
  bodyText: string;
}

const simplePageDefaults: Record<string, SimplePageContent> = {
  shop: { title: "Shop", metaDescription: "Browse our full collection", heading: "Shop All", bodyText: "Explore our complete range of luxury kaftans and resort wear." },
  collections: { title: "Collections", metaDescription: "Browse curated collections", heading: "Collections", bodyText: "Explore our curated collections." },
  "new-arrivals": { title: "New Arrivals", metaDescription: "See our latest pieces", heading: "New Arrivals", bodyText: "Fresh styles just landed." },
  sale: { title: "Sale", metaDescription: "Shop sale items", heading: "Sale", bodyText: "Limited-time offers on selected pieces." },
  "best-sellers": { title: "Best Sellers", metaDescription: "Shop our most popular", heading: "Best Sellers", bodyText: "Our most loved pieces." },
  about: { title: "About", metaDescription: "Learn about FashionSpectrum", heading: "About Us", bodyText: "FashionSpectrum is the zenith of luxury resort wear." },
  contact: { title: "Contact", metaDescription: "Get in touch", heading: "Contact Us", bodyText: "We'd love to hear from you." },
};

const pageNameFromPath = (path: string) => {
  if (path === "/") return "home";
  return path.replace(/^\//, "");
};

const AdminPageEditor = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isHome = pageId === "home" || pageId === "1";
  const pageKey = isHome ? "home" : (pageId || "");

  // Home page state
  const [hero, setHero] = useState<HeroContent>(defaultHomeContent.hero);
  const [announcement, setAnnouncement] = useState<AnnouncementContent>(defaultHomeContent.announcement);
  const [collectionBanner, setCollectionBanner] = useState<CollectionBannerContent>(defaultHomeContent.collectionBanner);
  const [about, setAbout] = useState<AboutContent>(defaultHomeContent.about);
  const [footer, setFooter] = useState<FooterContent>(defaultHomeContent.footer);
  const [sections, setSections] = useState<SectionMeta[]>(defaultSections);
  const [hasChanges, setHasChanges] = useState(false);

  // Simple page state
  const [simplePage, setSimplePage] = useState<SimplePageContent>(
    simplePageDefaults[pageKey] || { title: "", metaDescription: "", heading: "", bodyText: "" }
  );

  // Load saved content from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`page_content_${pageKey}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (isHome) {
        if (data.hero) setHero(data.hero);
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.collectionBanner) setCollectionBanner(data.collectionBanner);
        if (data.about) setAbout(data.about);
        if (data.footer) setFooter(data.footer);
        if (data.sections) setSections(data.sections);
      } else {
        setSimplePage(data);
      }
    }
  }, [pageKey, isHome]);

  const markChanged = () => setHasChanges(true);

  const handleSave = () => {
    if (isHome) {
      localStorage.setItem(`page_content_${pageKey}`, JSON.stringify({ hero, announcement, collectionBanner, about, footer, sections }));
    } else {
      localStorage.setItem(`page_content_${pageKey}`, JSON.stringify(simplePage));
    }
    setHasChanges(false);
    toast({ title: "Page saved successfully" });
  };

  const toggleSection = (id: string) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec));
    markChanged();
  };

  const pageName = isHome ? "Home" : (simplePageDefaults[pageKey]?.title || pageKey);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/pages")}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
              Edit: {pageName}
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              Customize the content of your {pageName.toLowerCase()} page
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={isHome ? "/" : `/${pageKey}`} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Eye size={14} /> Preview
            </a>
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="gap-2">
            <Save size={14} /> Save Changes
          </Button>
        </div>
      </div>

      {isHome ? (
        <HomePageEditor
          hero={hero} setHero={(v) => { setHero(v); markChanged(); }}
          announcement={announcement} setAnnouncement={(v) => { setAnnouncement(v); markChanged(); }}
          collectionBanner={collectionBanner} setCollectionBanner={(v) => { setCollectionBanner(v); markChanged(); }}
          about={about} setAbout={(v) => { setAbout(v); markChanged(); }}
          footer={footer} setFooter={(v) => { setFooter(v); markChanged(); }}
          sections={sections} toggleSection={toggleSection}
        />
      ) : (
        <SimplePageEditor page={simplePage} setPage={(v) => { setSimplePage(v); markChanged(); }} />
      )}
    </div>
  );
};

// ---- Home Page Editor ----
interface HomeEditorProps {
  hero: HeroContent; setHero: (v: HeroContent) => void;
  announcement: AnnouncementContent; setAnnouncement: (v: AnnouncementContent) => void;
  collectionBanner: CollectionBannerContent; setCollectionBanner: (v: CollectionBannerContent) => void;
  about: AboutContent; setAbout: (v: AboutContent) => void;
  footer: FooterContent; setFooter: (v: FooterContent) => void;
  sections: SectionMeta[]; toggleSection: (id: string) => void;
}

const HomePageEditor = ({ hero, setHero, announcement, setAnnouncement, collectionBanner, setCollectionBanner, about, setAbout, footer, setFooter, sections, toggleSection }: HomeEditorProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
    {/* Sidebar - Section Order & Visibility */}
    <div className="bg-card border border-border rounded-xl p-4 h-fit">
      <h3 className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-4">Page Sections</h3>
      <div className="space-y-1">
        {sections.map(sec => (
          <div key={sec.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors group">
            <div className="flex items-center gap-3">
              <GripVertical size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab" />
              <span className="text-muted-foreground">{sec.icon}</span>
              <span className="font-body text-sm text-foreground">{sec.label}</span>
            </div>
            <Switch checked={sec.enabled} onCheckedChange={() => toggleSection(sec.id)} />
          </div>
        ))}
      </div>
    </div>

    {/* Main Content Editor */}
    <div className="space-y-6">
      <Tabs defaultValue="announcement" className="w-full">
        <TabsList className="w-full justify-start bg-card border border-border h-auto p-1 flex-wrap">
          <TabsTrigger value="announcement" className="font-body text-xs">Announcement</TabsTrigger>
          <TabsTrigger value="hero" className="font-body text-xs">Hero</TabsTrigger>
          <TabsTrigger value="collection" className="font-body text-xs">Collection Banner</TabsTrigger>
          <TabsTrigger value="about" className="font-body text-xs">About</TabsTrigger>
          <TabsTrigger value="footer" className="font-body text-xs">Footer</TabsTrigger>
          <TabsTrigger value="seo" className="font-body text-xs">SEO</TabsTrigger>
        </TabsList>

        {/* Announcement Tab */}
        <TabsContent value="announcement">
          <EditorCard title="Announcement Bar" description="The scrolling bar at the top of the page">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-body text-sm">Enabled</Label>
                <Switch checked={announcement.enabled} onCheckedChange={v => setAnnouncement({ ...announcement, enabled: v })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Announcement Text</Label>
                <Input value={announcement.text} onChange={e => setAnnouncement({ ...announcement, text: e.target.value })} placeholder="e.g. Free Shipping Over $300" />
              </div>
              <PreviewBox>
                <div className="bg-primary py-2 px-4 text-center">
                  <span className="text-xs font-body tracking-[0.2em] uppercase text-primary-foreground">{announcement.text}</span>
                </div>
              </PreviewBox>
            </div>
          </EditorCard>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <EditorCard title="Hero Section" description="Main banner area with slideshow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Title Line 1</Label>
                <Input value={hero.titleLine1} onChange={e => setHero({ ...hero, titleLine1: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Title Line 2 (italic)</Label>
                <Input value={hero.titleLine2} onChange={e => setHero({ ...hero, titleLine2: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Subtitle</Label>
              <Textarea value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">CTA Button Text</Label>
                <Input value={hero.ctaText} onChange={e => setHero({ ...hero, ctaText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">CTA Link</Label>
                <Input value={hero.ctaLink} onChange={e => setHero({ ...hero, ctaLink: e.target.value })} />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="font-body text-sm">Auto-slide</Label>
                <Switch checked={hero.autoSlide} onCheckedChange={v => setHero({ ...hero, autoSlide: v })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Slide Interval (ms)</Label>
                <Input type="number" value={hero.slideInterval} onChange={e => setHero({ ...hero, slideInterval: Number(e.target.value) })} />
              </div>
            </div>
            <PreviewBox>
              <div className="bg-charcoal/80 p-6 rounded-lg">
                <p className="font-heading text-2xl font-light text-primary-foreground leading-tight">
                  {hero.titleLine1}<br />
                  <span className="font-semibold italic">{hero.titleLine2}</span>
                </p>
                <p className="font-body text-xs text-primary-foreground/70 mt-2 max-w-xs">{hero.subtitle}</p>
                <span className="inline-block mt-3 bg-primary-foreground text-charcoal px-4 py-2 font-body text-[10px] tracking-[0.15em] uppercase">{hero.ctaText}</span>
              </div>
            </PreviewBox>
          </EditorCard>
        </TabsContent>

        {/* Collection Banner Tab */}
        <TabsContent value="collection">
          <EditorCard title="Collection Banner" description="Full-width parallax banner section">
            <div className="space-y-2">
              <Label className="font-body text-sm">Subtitle</Label>
              <Input value={collectionBanner.subtitle} onChange={e => setCollectionBanner({ ...collectionBanner, subtitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Title</Label>
              <Input value={collectionBanner.title} onChange={e => setCollectionBanner({ ...collectionBanner, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">CTA Text</Label>
                <Input value={collectionBanner.ctaText} onChange={e => setCollectionBanner({ ...collectionBanner, ctaText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">CTA Link</Label>
                <Input value={collectionBanner.ctaLink} onChange={e => setCollectionBanner({ ...collectionBanner, ctaLink: e.target.value })} />
              </div>
            </div>
            <PreviewBox>
              <div className="bg-charcoal/60 p-8 rounded-lg text-center">
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary-foreground/70 mb-2">{collectionBanner.subtitle}</p>
                <p className="font-heading text-2xl font-light text-primary-foreground italic">{collectionBanner.title}</p>
                <span className="inline-block mt-3 border border-primary-foreground/50 text-primary-foreground px-4 py-1.5 font-body text-[10px] tracking-[0.15em] uppercase">{collectionBanner.ctaText}</span>
              </div>
            </PreviewBox>
          </EditorCard>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <EditorCard title="About Brand" description="Brand story section with image and text">
            <div className="space-y-2">
              <Label className="font-body text-sm">Section Title</Label>
              <Input value={about.title} onChange={e => setAbout({ ...about, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Paragraph 1</Label>
              <Textarea value={about.paragraph1} onChange={e => setAbout({ ...about, paragraph1: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Paragraph 2</Label>
              <Textarea value={about.paragraph2} onChange={e => setAbout({ ...about, paragraph2: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">CTA Text</Label>
              <Input value={about.ctaText} onChange={e => setAbout({ ...about, ctaText: e.target.value })} />
            </div>
          </EditorCard>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer">
          <EditorCard title="Footer" description="Newsletter and footer content">
            <div className="space-y-2">
              <Label className="font-body text-sm">Newsletter Title</Label>
              <Input value={footer.newsletterTitle} onChange={e => setFooter({ ...footer, newsletterTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Newsletter Subtitle</Label>
              <Textarea value={footer.newsletterSubtitle} onChange={e => setFooter({ ...footer, newsletterSubtitle: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Button Text</Label>
                <Input value={footer.ctaText} onChange={e => setFooter({ ...footer, ctaText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Copyright</Label>
                <Input value={footer.copyright} onChange={e => setFooter({ ...footer, copyright: e.target.value })} />
              </div>
            </div>
          </EditorCard>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <EditorCard title="SEO Settings" description="Search engine optimization for this page">
            <div className="space-y-2">
              <Label className="font-body text-sm">Page Title</Label>
              <Input defaultValue="FashionSpectrum — Luxury Kaftan & Resort Wear" placeholder="Page title for search engines" />
              <p className="font-body text-xs text-muted-foreground">Recommended: 50-60 characters</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Meta Description</Label>
              <Textarea defaultValue="Discover handcrafted luxury kaftans, dresses & resort wear. Free shipping on orders over $300." rows={3} placeholder="Brief description for search results" />
              <p className="font-body text-xs text-muted-foreground">Recommended: 150-160 characters</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">OG Image URL</Label>
              <Input defaultValue="" placeholder="https://example.com/og-image.jpg" />
            </div>
          </EditorCard>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

// ---- Simple Page Editor ----
const SimplePageEditor = ({ page, setPage }: { page: SimplePageContent; setPage: (v: SimplePageContent) => void }) => (
  <div className="max-w-2xl space-y-6">
    <EditorCard title="Page Content" description="Edit the content for this page">
      <div className="space-y-2">
        <Label className="font-body text-sm">Page Title (Browser Tab)</Label>
        <Input value={page.title} onChange={e => setPage({ ...page, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label className="font-body text-sm">Meta Description</Label>
        <Textarea value={page.metaDescription} onChange={e => setPage({ ...page, metaDescription: e.target.value })} rows={2} />
      </div>
      <Separator />
      <div className="space-y-2">
        <Label className="font-body text-sm">Heading</Label>
        <Input value={page.heading} onChange={e => setPage({ ...page, heading: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label className="font-body text-sm">Body Text</Label>
        <Textarea value={page.bodyText} onChange={e => setPage({ ...page, bodyText: e.target.value })} rows={6} />
      </div>
    </EditorCard>
  </div>
);

// ---- Reusable Components ----
const EditorCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-5">
    <div>
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="font-body text-xs text-muted-foreground">{description}</p>
    </div>
    <Separator />
    {children}
  </div>
);

const PreviewBox = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Live Preview</p>
    <div className="border border-dashed border-border rounded-lg overflow-hidden">
      {children}
    </div>
  </div>
);

export default AdminPageEditor;
