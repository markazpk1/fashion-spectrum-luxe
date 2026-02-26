const AnnouncementBar = () => {
  const text = "Free Shipping Over $300";
  
  return (
    <div className="bg-primary overflow-hidden whitespace-nowrap">
      <div className="animate-marquee flex items-center py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mx-8 text-xs font-body tracking-[0.2em] uppercase text-primary-foreground">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
