import { useState } from "react";
import {
  Megaphone, Send, Users, BarChart3, Plus, Calendar, Clock,
  Mail, Trash2, Eye, Copy, Pause, Play, Edit3, Target, TrendingUp, Palette,
  Newspaper, Rocket, Sparkles, LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import EmailBuilder from "@/components/admin/EmailBuilder";

type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "paused";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  status: CampaignStatus;
  audience: string;
  audienceCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Spring Collection Launch",
    subject: "🌸 New Spring Collection is Here!",
    previewText: "Discover our latest African-inspired spring designs",
    status: "sent",
    audience: "All Subscribers",
    audienceCount: 2450,
    sentCount: 2380,
    openRate: 42.5,
    clickRate: 8.3,
    createdAt: "Feb 20, 2026",
    sentAt: "Feb 22, 2026",
  },
  {
    id: "2",
    name: "Valentine's Day Sale",
    subject: "❤️ 30% Off — Valentine's Special!",
    previewText: "Share the love with our exclusive collection",
    status: "sent",
    audience: "Active Customers",
    audienceCount: 1820,
    sentCount: 1790,
    openRate: 38.2,
    clickRate: 12.1,
    createdAt: "Feb 10, 2026",
    sentAt: "Feb 12, 2026",
  },
  {
    id: "3",
    name: "Weekend Flash Sale",
    subject: "⚡ 48-Hour Flash Sale — Up to 50% Off",
    previewText: "Don't miss these incredible deals",
    status: "scheduled",
    audience: "All Subscribers",
    audienceCount: 2450,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: "Feb 27, 2026",
    scheduledAt: "Mar 1, 2026 10:00 AM",
  },
  {
    id: "4",
    name: "New Arrivals Newsletter",
    subject: "Fresh Drops: Premium Agbada & Kaftan Collection",
    previewText: "Handcrafted pieces you'll love",
    status: "draft",
    audience: "Newsletter Subscribers",
    audienceCount: 1650,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: "Feb 26, 2026",
  },
  {
    id: "5",
    name: "Customer Re-engagement",
    subject: "We Miss You! Here's 20% Off 🎁",
    previewText: "Come back and see what's new",
    status: "paused",
    audience: "Inactive Customers (90+ days)",
    audienceCount: 340,
    sentCount: 120,
    openRate: 15.8,
    clickRate: 4.2,
    createdAt: "Feb 18, 2026",
  },
];

const statusConfig: Record<CampaignStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  scheduled: { label: "Scheduled", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  sending: { label: "Sending", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  sent: { label: "Sent", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  paused: { label: "Paused", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const audiences = [
  "All Subscribers",
  "Active Customers",
  "Newsletter Subscribers",
  "New Customers (30 days)",
  "Inactive Customers (90+ days)",
  "VIP Customers",
];

const AdminEmailMarketing = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [builderCampaignId, setBuilderCampaignId] = useState<string | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    previewText: "",
    audience: "All Subscribers",
    template: "blank",
  });
  const [builderTemplate, setBuilderTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = statusFilter === "all"
    ? campaigns
    : campaigns.filter((c) => c.status === statusFilter);

  // Stats
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const avgOpenRate = campaigns.filter((c) => c.openRate > 0).reduce((acc, c, _, arr) => acc + c.openRate / arr.length, 0);
  const avgClickRate = campaigns.filter((c) => c.clickRate > 0).reduce((acc, c, _, arr) => acc + c.clickRate / arr.length, 0);
  const totalSubscribers = 2450;

  const createNewCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject) {
      toast({ title: "Please fill in campaign name and subject", variant: "destructive" });
      return;
    }
    const campaign: Campaign = {
      id: `new-${Date.now()}`,
      name: newCampaign.name,
      subject: newCampaign.subject,
      previewText: newCampaign.previewText,
      status: "draft",
      audience: newCampaign.audience,
      audienceCount: audiences.indexOf(newCampaign.audience) >= 0 ? [2450, 1820, 1650, 430, 340, 210][audiences.indexOf(newCampaign.audience)] : 0,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: "Just now",
    };
    setCampaigns((prev) => [campaign, ...prev]);
    const selectedTemplate = newCampaign.template;
    setNewCampaign({ name: "", subject: "", previewText: "", audience: "All Subscribers", template: "blank" });
    setCreateOpen(false);
    toast({ title: "Campaign created as draft" });
    // Auto-open builder with template if one was selected
    if (selectedTemplate !== "blank") {
      setBuilderCampaignId(campaign.id);
      setBuilderTemplate(selectedTemplate);
    }
  };

  const updateStatus = (id: string, status: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    const labels: Record<string, string> = {
      sending: "Campaign is now sending",
      paused: "Campaign paused",
      scheduled: "Campaign scheduled",
    };
    toast({ title: labels[status] || `Status updated to ${status}` });
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Campaign deleted" });
  };

  const duplicateCampaign = (campaign: Campaign) => {
    const dup: Campaign = {
      ...campaign,
      id: `dup-${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: "draft",
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: "Just now",
      sentAt: undefined,
      scheduledAt: undefined,
    };
    setCampaigns((prev) => [dup, ...prev]);
    toast({ title: "Campaign duplicated" });
  };

  // Show builder if a campaign is selected
  const builderCampaign = campaigns.find((c) => c.id === builderCampaignId);
  if (builderCampaign) {
    return (
      <EmailBuilder
        campaignName={builderCampaign.name}
        presetTemplate={builderTemplate || undefined}
        onBack={() => { setBuilderCampaignId(null); setBuilderTemplate(null); }}
        onSave={(_blocks, _html) => {
          toast({ title: `Content saved for "${builderCampaign.name}"` });
          setBuilderCampaignId(null);
          setBuilderTemplate(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone size={24} />
            Email Marketing
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Create and manage email campaigns to engage your customers
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="font-body">
              <Plus size={16} className="mr-2" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">Create Campaign</DialogTitle>
              <DialogDescription className="font-body">
                Set up a new email campaign. You can edit content and schedule later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="font-body text-sm">Campaign Name</Label>
                <Input
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g. March Newsletter"
                  className="font-body mt-1.5"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Subject Line</Label>
                <Input
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  placeholder="e.g. 🔥 New arrivals just dropped!"
                  className="font-body mt-1.5"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Preview Text</Label>
                <Input
                  value={newCampaign.previewText}
                  onChange={(e) => setNewCampaign({ ...newCampaign, previewText: e.target.value })}
                  placeholder="Text shown in email preview..."
                  className="font-body mt-1.5"
                />
              </div>
              <div>
                <Label className="font-body text-sm">Audience</Label>
                <Select value={newCampaign.audience} onValueChange={(v) => setNewCampaign({ ...newCampaign, audience: v })}>
                  <SelectTrigger className="font-body mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a} value={a} className="font-body">{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body text-sm">Email Template</Label>
                <Select value={newCampaign.template} onValueChange={(v) => setNewCampaign({ ...newCampaign, template: v })}>
                  <SelectTrigger className="font-body mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank" className="font-body">
                      <span className="flex items-center gap-2"><LayoutTemplate size={14} /> Blank Canvas</span>
                    </SelectItem>
                    <SelectItem value="promotional" className="font-body">
                      <span className="flex items-center gap-2"><Megaphone size={14} /> Promotional Sale</span>
                    </SelectItem>
                    <SelectItem value="newsletter" className="font-body">
                      <span className="flex items-center gap-2"><Newspaper size={14} /> Newsletter</span>
                    </SelectItem>
                    <SelectItem value="product-launch" className="font-body">
                      <span className="flex items-center gap-2"><Rocket size={14} /> Product Launch</span>
                    </SelectItem>
                    <SelectItem value="welcome" className="font-body">
                      <span className="flex items-center gap-2"><Sparkles size={14} /> Welcome Email</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)} className="font-body">Cancel</Button>
              <Button onClick={createNewCampaign} className="font-body">Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{totalSubscribers.toLocaleString()}</p>
                <p className="text-xs font-body text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Send size={20} />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{totalSent.toLocaleString()}</p>
                <p className="text-xs font-body text-muted-foreground">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{avgOpenRate.toFixed(1)}%</p>
                <p className="text-xs font-body text-muted-foreground">Avg Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-foreground">{avgClickRate.toFixed(1)}%</p>
                <p className="text-xs font-body text-muted-foreground">Avg Click Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "draft", "scheduled", "sending", "sent", "paused"] as const).map((s) => (
          <Button
            key={s}
            variant="outline"
            size="sm"
            className={cn(
              "font-body text-xs capitalize",
              statusFilter === s && "border-primary bg-primary/5 text-primary"
            )}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "All" : statusConfig[s].label} (
            {s === "all" ? campaigns.length : campaigns.filter((c) => c.status === s).length})
          </Button>
        ))}
      </div>

      {/* Campaign list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Megaphone size={40} className="mx-auto text-muted-foreground/20 mb-3" />
              <p className="font-heading text-lg text-muted-foreground">No campaigns found</p>
              <p className="text-sm font-body text-muted-foreground/70 mt-1">
                Create your first email campaign to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((campaign) => (
            <Card key={campaign.id} className="transition-all hover:shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading text-base font-semibold text-foreground truncate">
                        {campaign.name}
                      </h3>
                      <Badge variant="outline" className={cn("text-[10px] font-body flex-shrink-0", statusConfig[campaign.status].color)}>
                        {statusConfig[campaign.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm font-body text-foreground mb-1">{campaign.subject}</p>
                    {campaign.previewText && (
                      <p className="text-xs font-body text-muted-foreground mb-2">{campaign.previewText}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target size={12} /> {campaign.audience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {campaign.audienceCount.toLocaleString()}
                      </span>
                      {campaign.scheduledAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {campaign.scheduledAt}
                        </span>
                      )}
                      {campaign.sentAt && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> Sent {campaign.sentAt}
                        </span>
                      )}
                    </div>

                    {/* Stats row for sent campaigns */}
                    {campaign.status === "sent" && (
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-body text-muted-foreground">
                            {campaign.sentCount.toLocaleString()} sent
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-body text-muted-foreground">
                            {campaign.openRate}% opened
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-body text-muted-foreground">
                            {campaign.clickRate}% clicked
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {(campaign.status === "draft" || campaign.status === "scheduled") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-body text-xs"
                        onClick={() => setBuilderCampaignId(campaign.id)}
                      >
                        <Palette size={12} className="mr-1" /> Design
                      </Button>
                    )}
                    {campaign.status === "draft" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-body text-xs"
                        onClick={() => updateStatus(campaign.id, "scheduled")}
                      >
                        <Calendar size={12} className="mr-1" /> Schedule
                      </Button>
                    )}
                    {campaign.status === "scheduled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-body text-xs"
                        onClick={() => updateStatus(campaign.id, "sending")}
                      >
                        <Send size={12} className="mr-1" /> Send Now
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-body text-xs"
                        onClick={() => updateStatus(campaign.id, "sending")}
                      >
                        <Play size={12} className="mr-1" /> Resume
                      </Button>
                    )}
                    {campaign.status === "sending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-body text-xs"
                        onClick={() => updateStatus(campaign.id, "paused")}
                      >
                        <Pause size={12} className="mr-1" /> Pause
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => duplicateCampaign(campaign)}
                    >
                      <Copy size={14} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-heading">Delete campaign?</AlertDialogTitle>
                          <AlertDialogDescription className="font-body">
                            This will permanently delete "{campaign.name}". This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCampaign(campaign.id)}
                            className="font-body bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminEmailMarketing;
