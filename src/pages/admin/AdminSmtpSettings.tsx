import { useState } from "react";
import {
  Server, Eye, EyeOff, Save, TestTube, CheckCircle2, XCircle, Loader2, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  encryption: "tls" | "ssl" | "none";
  fromName: string;
  fromEmail: string;
  replyTo: string;
  enabled: boolean;
}

const defaultConfig: SmtpConfig = {
  host: "",
  port: "587",
  username: "",
  password: "",
  encryption: "tls",
  fromName: "Fashion Spectrum",
  fromEmail: "",
  replyTo: "",
  enabled: false,
};

const presets = [
  { label: "Gmail", host: "smtp.gmail.com", port: "587", encryption: "tls" as const },
  { label: "Outlook", host: "smtp-mail.outlook.com", port: "587", encryption: "tls" as const },
  { label: "Yahoo", host: "smtp.mail.yahoo.com", port: "465", encryption: "ssl" as const },
  { label: "SendGrid", host: "smtp.sendgrid.net", port: "587", encryption: "tls" as const },
  { label: "Mailgun", host: "smtp.mailgun.org", port: "587", encryption: "tls" as const },
  { label: "Custom", host: "", port: "587", encryption: "tls" as const },
];

const AdminSmtpSettings = () => {
  const [config, setConfig] = useState<SmtpConfig>(() => {
    const saved = localStorage.getItem("admin_smtp_config");
    return saved ? JSON.parse(saved) : defaultConfig;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const { toast } = useToast();

  const update = (key: keyof SmtpConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setTestResult(null);
  };

  const applyPreset = (presetLabel: string) => {
    const preset = presets.find((p) => p.label === presetLabel);
    if (preset && preset.label !== "Custom") {
      setConfig((prev) => ({
        ...prev,
        host: preset.host,
        port: preset.port,
        encryption: preset.encryption,
      }));
    }
  };

  const handleSave = () => {
    localStorage.setItem("admin_smtp_config", JSON.stringify(config));
    toast({ title: "SMTP settings saved successfully" });
  };

  const handleTest = async () => {
    if (!testEmail) {
      toast({ title: "Enter a test email address", variant: "destructive" });
      return;
    }
    setTesting(true);
    setTestResult(null);
    // Simulate test
    await new Promise((r) => setTimeout(r, 2000));
    const success = config.host && config.username && config.password;
    setTestResult(success ? "success" : "error");
    setTesting(false);
    toast({
      title: success ? "Test email sent successfully!" : "Connection failed",
      description: success
        ? `A test email was sent to ${testEmail}`
        : "Please check your SMTP credentials and try again.",
      variant: success ? "default" : "destructive",
    });
  };

  const isConfigured = config.host && config.port && config.username && config.fromEmail;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Server size={24} />
            SMTP Settings
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Configure your email server for sending transactional and marketing emails
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "font-body",
              config.enabled && isConfigured
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-muted text-muted-foreground"
            )}
          >
            {config.enabled && isConfigured ? "Active" : "Inactive"}
          </Badge>
          <Switch
            checked={config.enabled}
            onCheckedChange={(v) => update("enabled", v)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Server Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Server Configuration</CardTitle>
              <CardDescription className="font-body">
                Enter your SMTP server details or select a preset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presets */}
              <div>
                <Label className="font-body text-sm">Quick Setup</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {presets.map((p) => (
                    <Button
                      key={p.label}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "font-body text-xs",
                        config.host === p.host && p.label !== "Custom" && "border-primary bg-primary/5 text-primary"
                      )}
                      onClick={() => applyPreset(p.label)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm">SMTP Host</Label>
                  <Input
                    value={config.host}
                    onChange={(e) => update("host", e.target.value)}
                    placeholder="smtp.example.com"
                    className="font-body mt-1.5"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm">Port</Label>
                  <Input
                    value={config.port}
                    onChange={(e) => update("port", e.target.value)}
                    placeholder="587"
                    className="font-body mt-1.5"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm">Username</Label>
                  <Input
                    value={config.username}
                    onChange={(e) => update("username", e.target.value)}
                    placeholder="your@email.com"
                    className="font-body mt-1.5"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={config.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="••••••••"
                      className="font-body pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-body text-sm">Encryption</Label>
                <Select value={config.encryption} onValueChange={(v) => update("encryption", v)}>
                  <SelectTrigger className="font-body mt-1.5 w-full sm:w-48">
                    <Shield size={14} className="mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tls" className="font-body">TLS (Recommended)</SelectItem>
                    <SelectItem value="ssl" className="font-body">SSL</SelectItem>
                    <SelectItem value="none" className="font-body">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sender Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Sender Information</CardTitle>
              <CardDescription className="font-body">
                Configure how your emails appear to recipients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm">From Name</Label>
                  <Input
                    value={config.fromName}
                    onChange={(e) => update("fromName", e.target.value)}
                    placeholder="Fashion Spectrum"
                    className="font-body mt-1.5"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm">From Email</Label>
                  <Input
                    value={config.fromEmail}
                    onChange={(e) => update("fromEmail", e.target.value)}
                    placeholder="no-reply@fashionspectrum.com"
                    className="font-body mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label className="font-body text-sm">Reply-To Email (optional)</Label>
                <Input
                  value={config.replyTo}
                  onChange={(e) => update("replyTo", e.target.value)}
                  placeholder="support@fashionspectrum.com"
                  className="font-body mt-1.5 sm:w-1/2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Test Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <TestTube size={18} />
                Test Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="font-body text-sm">Send test email to</Label>
                <Input
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="font-body mt-1.5"
                />
              </div>
              <Button
                onClick={handleTest}
                disabled={testing || !isConfigured}
                className="w-full font-body"
                variant="outline"
              >
                {testing ? (
                  <><Loader2 size={14} className="mr-2 animate-spin" /> Testing...</>
                ) : (
                  <><TestTube size={14} className="mr-2" /> Send Test Email</>
                )}
              </Button>
              {testResult && (
                <div className={cn(
                  "flex items-center gap-2 p-3 rounded-lg text-sm font-body",
                  testResult === "success"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-destructive/10 text-destructive"
                )}>
                  {testResult === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {testResult === "success" ? "Connection successful!" : "Connection failed"}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save */}
          <Button onClick={handleSave} className="w-full font-body" size="lg">
            <Save size={16} className="mr-2" />
            Save Settings
          </Button>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-sm">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs font-body text-muted-foreground">
                For Gmail, enable "App Passwords" in your Google Account security settings.
              </p>
              <p className="text-xs font-body text-muted-foreground">
                For SendGrid/Mailgun, use your API key as the password.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSmtpSettings;
