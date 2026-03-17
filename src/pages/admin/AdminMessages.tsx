import { useState } from "react";
import { Search, Mail, MailOpen, Trash2, Clock, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: number;
  from: string;
  email: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
}

const mockMessages: Message[] = [
  { id: 1, from: "Sara Ahmed", email: "sara@email.com", subject: "Order inquiry - FS-20250227", preview: "Hi, I wanted to know the status of my recent order...", date: "10 min ago", read: false, starred: false },
  { id: 2, from: "Fatima Noor", email: "fatima@email.com", subject: "Return request", preview: "I'd like to return the blazer I purchased last week...", date: "1 hr ago", read: false, starred: true },
  { id: 3, from: "Ali Raza", email: "ali@email.com", subject: "Wholesale inquiry", preview: "We're interested in placing a bulk order for our boutique...", date: "3 hrs ago", read: true, starred: false },
  { id: 4, from: "Zainab Khan", email: "zainab@email.com", subject: "Size exchange", preview: "The dress I ordered was a bit tight, can I exchange...", date: "Yesterday", read: true, starred: false },
  { id: 5, from: "Hassan Malik", email: "hassan@email.com", subject: "Collaboration proposal", preview: "I'm a fashion blogger and would love to collaborate...", date: "2 days ago", read: true, starred: true },
];

const AdminMessages = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);

  const filtered = messages.filter(m =>
    m.from.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Messages</h1>
        <p className="font-body text-sm text-muted-foreground">{unread} unread messages</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-card border-border font-body" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Message List */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map(m => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); setMessages(messages.map(x => x.id === m.id ? { ...x, read: true } : x)); }}
                className={`w-full text-left p-4 hover:bg-secondary/30 transition-colors ${selected?.id === m.id ? "bg-secondary/50" : ""} ${!m.read ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {!m.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    <span className={`font-body text-sm ${!m.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{m.from}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {m.starred && <Star size={12} className="text-accent fill-accent" />}
                    <span className="font-body text-[10px] text-muted-foreground">{m.date}</span>
                  </div>
                </div>
                <p className="font-body text-xs font-medium text-foreground truncate">{m.subject}</p>
                <p className="font-body text-xs text-muted-foreground truncate mt-0.5">{m.preview}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">{selected.subject}</h3>
                  <p className="font-body text-sm text-muted-foreground">{selected.from} · {selected.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMessages(messages.map(m => m.id === selected.id ? { ...m, starred: !m.starred } : m))}>
                    <Star size={16} className={selected.starred ? "text-accent fill-accent" : "text-muted-foreground"} />
                  </button>
                  <button onClick={() => { setMessages(messages.filter(m => m.id !== selected.id)); setSelected(null); }}>
                    <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
              <Separator className="mb-4" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-body mb-4">
                <Clock size={12} /> {selected.date}
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed">{selected.preview}</p>
              <p className="font-body text-sm text-foreground leading-relaxed mt-3">
                Thank you for reaching out. I look forward to hearing from you soon.
              </p>
              <p className="font-body text-sm text-foreground mt-3">
                Best regards,<br />{selected.from}
              </p>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button className="font-body text-xs tracking-wider uppercase">Reply</Button>
                <Button variant="outline" className="font-body text-xs tracking-wider uppercase">Forward</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <Mail size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="font-body text-sm text-muted-foreground">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
