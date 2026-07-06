// Realistic mock data for Akanksha Dua's personal luxury brand CMS

export const initialData = {
  // 1. SERVICES
  services: [
    {
      id: "srv-1",
      title: "Luxury Brand Strategy",
      category: "Creative Consulting",
      description: "High-end brand positioning and creative direction for luxury hospitality and fashion labels globally.",
      benefits: ["Targeted High-Net-Worth positioning", "Immersive visual storytelling asset creation", "Multi-channel launch strategy"],
      pricing: "$12,500 - $25,000",
      cta: "Schedule Consultation",
      isActive: true,
      createdAt: "2026-01-15T08:00:00Z"
    },
    {
      id: "srv-2",
      title: "High-End Influencer Campaign Execution",
      category: "Influencer Marketing",
      description: "Bespoke influencer partnerships, content production, and amplified digital distribution.",
      benefits: ["Vetted luxury influencer roster", "UGC & high-fidelity video production", "Guaranteed luxury media visibility"],
      pricing: "$18,000 - $35,000",
      cta: "Plan Campaign",
      isActive: true,
      createdAt: "2026-02-10T09:30:00Z"
    },
    {
      id: "srv-3",
      title: "Keynote & Public Speaking",
      category: "Public Speaking",
      description: "Inspiring presentations on creator economy, entrepreneurship, and luxury market trends.",
      benefits: ["Highly engaging storytelling", "Interactive Q&A segments", "Post-event brand amplification"],
      pricing: "$8,500+",
      cta: "Book Speaking Event",
      isActive: true,
      createdAt: "2026-03-01T14:20:00Z"
    },
    {
      id: "srv-4",
      title: "UGC & Commercial Content Production",
      category: "Content Creation",
      description: "Premium commercial photoshoots, product reviews, and short-form cinematic reels.",
      benefits: ["4K HDR cinema-grade assets", "Optimized social media pacing", "Full licensing rights included"],
      pricing: "$5,000 - $12,000",
      cta: "Request Creative Pitch",
      isActive: false,
      createdAt: "2026-04-12T11:00:00Z"
    }
  ],

  // 2. BRAND COLLABORATIONS
  collaborations: [
    {
      id: "collab-1",
      brandName: "Gucci India",
      logoUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=150", // clean graphic
      productImages: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600", // Handbag
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600", // Heels
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600"  // Sunglasses
      ],
      collabDate: "2026-05-10",
      metrics: "3.2M Impressions, +24% Brand Affinity",
      showcaseUrl: "https://gucci.com",
      campaignDescription: "Launch of the premium Gucci Neo-Heritage Handbag series with custom 3D web configurators and influencer reel stories.",
      kpis: [
        { label: "Total Impressions", value: "3.2M" },
        { label: "Link Clicks", value: "48K" },
        { label: "Sales Conversion", value: "+24%" }
      ],
      isActive: true,
      createdAt: "2026-05-11T12:00:00Z"
    },
    {
      id: "collab-2",
      brandName: "Vogue India",
      logoUrl: "https://images.unsplash.com/photo-1627163430005-502a0a2df335?auto=format&fit=crop&q=80&w=150",
      productImages: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600", // Editorial model
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600", // Styling shot
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600"  // Editorial clothing
      ],
      collabDate: "2026-03-15",
      metrics: "Featured Cover & 8-page Editorial",
      showcaseUrl: "https://vogue.in",
      campaignDescription: "Exclusive cover story and double-page cinematic spread highlighting Akanksha's journey in shaping creator-driven HNW agencies.",
      kpis: [
        { label: "Print Distribution", value: "120K" },
        { label: "Online Article Reads", value: "1.2M" },
        { label: "Social Shares", value: "15.4K" }
      ],
      isActive: true,
      createdAt: "2026-03-16T10:00:00Z"
    },
    {
      id: "collab-3",
      brandName: "Armani Beauty",
      logoUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=150",
      productImages: [
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600", // Lipstick
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600", // Perfumes
        "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"  // Creams
      ],
      collabDate: "2026-04-01",
      metrics: "1.8M Reels Views, 4.5% Engagement",
      showcaseUrl: "https://armanibeauty.com",
      campaignDescription: "Digital video activation showcasing the new Luminous Silk foundation line using slow-motion macro editing.",
      kpis: [
        { label: "Total Video Views", value: "1.8M" },
        { label: "Save Count", value: "22K" },
        { label: "Click Through Rate", value: "4.5%" }
      ],
      isActive: true,
      createdAt: "2026-04-02T15:30:00Z"
    },
    {
      id: "collab-4",
      brandName: "Porsche Club",
      logoUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=150",
      productImages: [
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600", // Porsche 911
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600", // Racetrack
        "https://images.unsplash.com/photo-1611245801312-520c8922264e?auto=format&fit=crop&q=80&w=600"  // Taycan Electric
      ],
      collabDate: "2026-06-20",
      metrics: "Exclusive Event Hosting & 3D Video Campaign",
      showcaseUrl: "https://porsche.com",
      campaignDescription: "Hosting the annual Porsche Club India VIP summit and launch of the digital 3D model configuration preview.",
      kpis: [
        { label: "VIP Attendance", value: "350" },
        { label: "Model Preorders", value: "18" },
        { label: "Campaign Impressions", value: "980K" }
      ],
      isActive: false,
      createdAt: "2026-06-21T09:00:00Z"
    }
  ],

  // 3. CAMPAIGNS
  campaigns: [
    {
      id: "camp-1",
      title: "Summer Resort Wear '26",
      brandPartner: "Hermès Paris",
      timeline: "May 2026 - June 2026",
      bannerUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
      metrics: "5.4M Overall Reach, 12,000+ Link Clicks",
      outcome: "Sold out resort collection within 48 hours of campaign drop.",
      detailedDescription: "An exclusive digital runway simulation and interactive HNW lookbook showcasing the Hermès Summer Resort collection, targeting premium tier consumers in the Asia-Pacific region.",
      budget: "$150,000",
      targetAudience: "HNW Individuals, Fashion Collectors",
      kpis: [
        { label: "Overall Reach", value: "5.4M" },
        { label: "Link Clicks", value: "12K" },
        { label: "Sales Revenue", value: "+$1.2M" }
      ],
      isActive: true,
      createdAt: "2026-05-01T08:00:00Z"
    },
    {
      id: "camp-2",
      title: "Timeless Luxury Watches",
      brandPartner: "Rolex",
      timeline: "March 2026 - April 2026",
      bannerUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200",
      metrics: "2.1M High-HNW Target Reached",
      outcome: "Boosted boutique visitor inquiries by 35% in major metros.",
      detailedDescription: "A multi-city private event series and digital luxury watch configurator release highlighting the craftsmanship of vintage Rolex timepieces.",
      budget: "$280,000",
      targetAudience: "Elite Watch Enthusiasts, C-Suite Execs",
      kpis: [
        { label: "VIP Attendance", value: "480" },
        { label: "Boutique Inquiries", value: "+35%" },
        { label: "Social Media Share", value: "24.5K" }
      ],
      isActive: true,
      createdAt: "2026-03-01T09:00:00Z"
    },
    {
      id: "camp-3",
      title: "Sustainable Living & Design",
      brandPartner: "IKEA Signature",
      timeline: "July 2026",
      bannerUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200",
      metrics: "Planned launch: 10M Expected Reach",
      outcome: "Pre-planning stage. High anticipation.",
      detailedDescription: "Upcoming sustainable interior design collaboration highlighting minimalist luxury aesthetics and carbon-neutral luxury furniture assets.",
      budget: "$95,000",
      targetAudience: "Eco-conscious Homeowners, Modern Designers",
      kpis: [
        { label: "Target Impressions", value: "10M" },
        { label: "Pre-registrations", value: "15K" },
        { label: "PR Coverage Outlets", value: "45+" }
      ],
      isActive: false,
      createdAt: "2026-06-15T10:00:00Z"
    }
  ],

  // 4. PRODUCT LAUNCHES
  launches: [
    {
      id: "launch-1",
      productName: "Oasis Fragrance Line",
      launchEventTitle: "Under The Canopy",
      videosList: "https://assets.mixkit.co/videos/preview/mixkit-luxury-perfume-bottle-shining-34289-large.mp4",
      brandDetails: "Co-created with Jo Malone London.",
      releaseDate: "2026-05-15",
      isActive: true,
      createdAt: "2026-05-10T11:00:00Z"
    },
    {
      id: "launch-2",
      productName: "Aura 3D Handbag Edition",
      launchEventTitle: "Futurism Luxury Gala",
      videosList: "https://assets.mixkit.co/videos/preview/mixkit-rotating-luxury-watch-under-light-42171-large.mp4",
      brandDetails: "Limited custom luxury 3D printed bag release.",
      releaseDate: "2026-07-20",
      isActive: true,
      createdAt: "2026-06-25T14:00:00Z"
    }
  ],

  // 5. EVENTS
  events: [
    {
      id: "evt-1",
      eventName: "Mumbai Luxury Summit 2026",
      role: "Keynote Speaker",
      dateTime: "2026-08-15T15:00",
      venue: "Grand Hyatt, Mumbai / Live Streamed",
      guestList: "VVIPs, Fashion Editors, Luxury CEOs",
      highlights: "Delivering the opening address on 'The Future of Immersive Brand Marketing'.",
      isActive: true,
      createdAt: "2026-06-10T08:00:00Z"
    },
    {
      id: "evt-2",
      eventName: "Gucci Cruise Collection Preview",
      role: "Guest Appearance",
      dateTime: "2026-05-02T19:00",
      venue: "Heritage Mansion, New Delhi",
      guestList: "Exclusive Invite-only Brand Ambassadors",
      highlights: "Red carpet attendance, press interviews, and social media takeover.",
      isActive: true,
      createdAt: "2026-04-15T09:00:00Z"
    },
    {
      id: "evt-3",
      eventName: "Social Media Masterclass Live",
      role: "Host",
      dateTime: "2026-09-05T11:00",
      venue: "Virtual Meta Studio",
      guestList: "500 Selected Content Creators",
      highlights: "3-hour intensive workshop covering luxury storytelling, editing, and sponsorships.",
      isActive: false,
      createdAt: "2026-06-20T12:00:00Z"
    }
  ],

  // 6. PORTFOLIO
  portfolio: [
    {
      id: "port-1",
      title: "Chasing Shadows - Noir Fashion Film",
      client: "Vogue India & Chanel",
      serviceType: "Commercial Shoots",
      portfolioType: "Videos",
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40439-large.mp4",
      completionDate: "2026-04-20",
      isActive: true,
      createdAt: "2026-04-22T08:00:00Z"
    },
    {
      id: "port-2",
      title: "Metropolitan Nomad Photo Series",
      client: "GQ Gentlemen's Luxury",
      serviceType: "Commercial Shoots",
      portfolioType: "Photos",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
      videoUrl: "",
      completionDate: "2026-02-18",
      isActive: true,
      createdAt: "2026-02-20T10:00:00Z"
    },
    {
      id: "port-3",
      title: "The Golden Ratio - 3D Architecture Campaign",
      client: "DLF Signature Homes",
      serviceType: "Corporate Collaborations",
      portfolioType: "Client Work",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-modern-house-and-pool-42512-large.mp4",
      completionDate: "2026-06-05",
      isActive: true,
      createdAt: "2026-06-06T15:00:00Z"
    },
    {
      id: "port-4",
      title: "Aura Perfume Launch Film",
      client: "Maison Lumière",
      serviceType: "Product Launches",
      portfolioType: "Campaigns",
      imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-shot-makeup-model-34691-large.mp4",
      completionDate: "2026-05-10",
      isActive: true,
      createdAt: "2026-05-12T10:00:00Z"
    },
    {
      id: "port-5",
      title: "Noir Portrait Series",
      client: "Harper's Bazaar India",
      serviceType: "Content Creation",
      portfolioType: "Projects",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
      videoUrl: "",
      completionDate: "2026-03-28",
      isActive: true,
      createdAt: "2026-03-30T14:00:00Z"
    },
    {
      id: "port-6",
      title: "Celestial Streetwear Campaign",
      client: "The Label Collective",
      serviceType: "Brand Campaigns",
      portfolioType: "Campaigns",
      imageUrl: "https://images.unsplash.com/photo-1542060747-6f0f6d9f07ea?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-urban-fashion-brand-launch-38663-large.mp4",
      completionDate: "2026-07-12",
      isActive: true,
      createdAt: "2026-07-15T12:00:00Z"
    },
    {
      id: "port-7",
      title: "Executive Client Editorial",
      client: "Bespoke Interiors",
      serviceType: "Corporate Collaborations",
      portfolioType: "Client Work",
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800",
      videoUrl: "",
      completionDate: "2026-08-02",
      isActive: true,
      createdAt: "2026-08-04T09:00:00Z"
    },
    {
      id: "port-8",
      title: "Luxe Streetwear Social Reel",
      client: "Foxglove Apparel",
      serviceType: "Commercial Shoots",
      portfolioType: "Commercial Shoots",
      imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-street-fashion-model-38653-large.mp4",
      completionDate: "2026-09-01",
      isActive: true,
      createdAt: "2026-09-03T11:00:00Z"
    },
    {
      id: "port-9",
      title: "Renaissance Editorial Project",
      client: "Monarch Media",
      serviceType: "Content Creation",
      portfolioType: "Projects",
      imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
      videoUrl: "",
      completionDate: "2026-05-16",
      isActive: true,
      createdAt: "2026-05-18T14:00:00Z"
    },
    {
      id: "port-10",
      title: "Bespoke Boutique Client Showcase",
      client: "La Maison Couture",
      serviceType: "Corporate Collaborations",
      portfolioType: "Client Work",
      imageUrl: "https://images.unsplash.com/photo-1519418552153-814b01d1e2e4?auto=format&fit=crop&q=80&w=800",
      videoUrl: "",
      completionDate: "2026-09-18",
      isActive: true,
      createdAt: "2026-09-19T09:30:00Z"
    }
  ],

  // 7. GALLERY
  gallery: [
    {
      id: "gal-1",
      title: "Red Carpet - Cannes Film Festival",
      type: "image",
      category: "Celebrity Moments",
      mediaUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
      description: "Exclusive capture of the premium velvet gown presentation during the red carpet arrivals at Cannes Film Festival 2026.",
      dimensions: "3840x2560 (4K)",
      size: "4.8 MB",
      isActive: true,
      createdAt: "2026-05-22T10:00:00Z"
    },
    {
      id: "gal-2",
      title: "Behind The Scenes - Jo Malone Shoot",
      type: "image",
      category: "Behind the Scenes",
      mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
      description: "A candid backstage glance of the set layout, premium lighting, and boutique product arrangements for Jo Malone London.",
      dimensions: "2048x1536 (FHD)",
      size: "2.1 MB",
      isActive: true,
      createdAt: "2026-05-12T11:00:00Z"
    },
    {
      id: "gal-3",
      title: "Amalfi Coast - Travel Diary 2026",
      type: "video",
      category: "Travel",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-crashing-on-amalfi-coast-rocks-42521-large.mp4",
      description: "Cinematic drone loops capturing the Mediterranean shores, cliffs, and luxury yacht excursions along the Amalfi Coast.",
      dimensions: "3840x2160 (4K)",
      size: "45.2 MB",
      isActive: true,
      createdAt: "2026-06-15T09:00:00Z"
    },
    {
      id: "gal-4",
      title: "Evening Gala - Luxury Awards",
      type: "image",
      category: "Awards",
      mediaUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
      description: "A panoramic showcase of the table decorations, golden lighting details, and guests at the 2026 Luxury Brand Awards.",
      dimensions: "3000x2000 (FHD)",
      size: "3.5 MB",
      isActive: false,
      createdAt: "2026-01-20T14:00:00Z"
    }
  ],

  // 8. MEDIA COVERAGE
  coverage: [
    {
      id: "cov-1",
      title: "Akanksha Dua Redefines the Luxury Creator Economy",
      mediaOutlet: "Forbes India",
      format: "Press Releases",
      date: "2026-04-10",
      url: "https://forbes.com",
      thumbnail: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=600",
      detailedExcerpt: "In this exclusive feature, Forbes India explores how Akanksha Dua built a HNW digital creative empire, bridging high-end luxury houses with the modern creator economy through custom 3D web configurations and storytelling.",
      metrics: "850K Readership",
      isActive: true,
      createdAt: "2026-04-11T09:00:00Z"
    },
    {
      id: "cov-2",
      title: "Building A Global Personal Brand: Interview",
      mediaOutlet: "The Creator Podcast",
      format: "Podcasts",
      date: "2026-05-18",
      url: "https://youtube.com",
      thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600",
      detailedExcerpt: "A comprehensive 1-hour interview discussing luxury brand positioning, high-net-worth customer engagement, and why video production is the future of personal branding.",
      metrics: "1.2M Podcast Streams",
      isActive: true,
      createdAt: "2026-05-19T10:00:00Z"
    },
    {
      id: "cov-3",
      title: "Luxury Trends to Watch in 2026",
      mediaOutlet: "Vogue Business",
      format: "Magazine Features",
      date: "2026-06-01",
      url: "https://vogue.in",
      thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600",
      detailedExcerpt: "Akanksha Dua shares her expert predictions on the merge between virtual luxury clothing configurators and physical showroom VIP invitation strategies.",
      metrics: "Featured Editorial Cover",
      isActive: true,
      createdAt: "2026-06-02T11:00:00Z"
    }
  ],

  // 9. TESTIMONIALS
  testimonials: [
    {
      id: "test-1",
      name: "Sabrina D'Souza",
      role: "Brand Director, Armani Beauty",
      quote: "Akanksha brings unparalleled professionalism and a meticulous eye for luxury aesthetic. Our Armani campaign exceeded all engagement forecasts.",
      rating: 5,
      videoUrl: "",
      isVerified: true,
      isActive: true,
      createdAt: "2026-04-05T08:00:00Z"
    },
    {
      id: "test-2",
      name: "Marcus Vance",
      role: "CEO, Prestige Group UK",
      quote: "Her keynote on high-net-worth consumer psychology was the highlight of our annual summit. Brilliant communicator.",
      rating: 5,
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-woman-in-front-of-screen-41712-large.mp4",
      isVerified: true,
      isActive: true,
      createdAt: "2026-05-20T10:00:00Z"
    },
    {
      id: "test-3",
      name: "Pooja Malhotra",
      role: "Marketing VP, DLF Luxury Homes",
      quote: "Incredibly smooth collaboration. She takes active direction and respects the luxury code of our brand.",
      rating: 4,
      videoUrl: "",
      isVerified: false,
      isActive: false,
      createdAt: "2026-06-08T12:00:00Z"
    }
  ],

  // 10. CAREERS
  careers: [
    {
      id: "job-1",
      title: "Creative Video Producer & Editor",
      department: "Production",
      type: "Full-time",
      location: "Mumbai (Hybrid)",
      description: "Looking for an elite video editor and producer to storyboard and edit commercial reels, cinematic YouTube videos, and brand collaborations.",
      requirements: "3+ years editing for luxury brands, advanced knowledge of Premiere/FCP/DaVinci, experience with 3D elements/animations a plus.",
      benefits: "Premium workspace in South Mumbai, competitive luxury scale package, travel budgets, health insurance, access to exclusive industry events.",
      isActive: true,
      createdAt: "2026-06-01T08:00:00Z"
    },
    {
      id: "job-2",
      title: "Luxury Public Relations (PR) Associate",
      department: "Marketing",
      type: "Full-time",
      location: "Mumbai",
      description: "Manage relationships with luxury fashion publications, schedule press releases, coordinate brand invites, and maintain the VIP media database.",
      requirements: "Experience working with fashion or luxury agencies, stellar written English, established contacts at major Indian and global lifestyle publications.",
      benefits: "Performance bonuses, clothing allowance, top-tier health cover, direct mentorship.",
      isActive: true,
      createdAt: "2026-06-10T10:00:00Z"
    },
    {
      id: "job-3",
      title: "3D Motion Graphics Intern",
      department: "Creative Consulting",
      type: "Internship",
      location: "Remote",
      description: "Create premium 3D assets, glassmorphic UI interactions, and floating abstract graphics to be featured on social channels and the official web portal.",
      requirements: "Proficient in Blender, Cinema4D, or After Effects. Strong sense of premium layouts, gradients, and physics-based animations.",
      benefits: "Internship certificate, performance stipend, high potential for transition to full-time.",
      isActive: false,
      createdAt: "2026-06-20T12:00:00Z"
    },
    {
      id: "job-4",
      title: "Freelance Luxury Brand Copywriter",
      department: "Marketing",
      type: "Freelance",
      location: "Remote",
      description: "Craft premium storytelling copy for high-end brand campaigns, product launches, and luxury creator collaborations.",
      requirements: "Experience writing for fashion or luxury lifestyle brands, strong narrative voice, and quick turnaround capacity.",
      benefits: "Flexible schedule, project-based compensation, exposure to elite brand partnerships.",
      isActive: true,
      createdAt: "2026-06-25T10:00:00Z"
    }
  ],

  // 11. RESUME LIST
  resumes: [
    {
      id: "res-1",
      candidateName: "Rohan Varma",
      email: "rohan.varma@gmail.com",
      phone: "+91 98765 43210",
      jobApplied: "Creative Video Producer & Editor",
      experienceYears: 4,
      portfolioLink: "https://vimeo.com/rohandev",
      status: "Reviewed",
      resumeFileName: "Rohan_Varma_Showreel_2026.pdf",
      coverLetter: "Hi Akanksha, I have been editing fashion documentaries for 4 years. I understand the luxury aesthetic, color grading, and timing. I would love to join your team.",
      appliedAt: "2026-06-05T09:30:00Z"
    },
    {
      id: "res-2",
      candidateName: "Neha Kapoor",
      email: "neha.kapoor@outlook.com",
      phone: "+91 99999 88888",
      jobApplied: "Luxury Public Relations (PR) Associate",
      experienceYears: 2,
      portfolioLink: "https://linkedin.com/in/nehakapoor",
      status: "New",
      resumeFileName: "Neha_Kapoor_Resume.pdf",
      coverLetter: "I recently handled PR for the Elle Luxury Awards and have deep contacts inside Vogue and GQ. Let's take the brand to the next tier.",
      appliedAt: "2026-06-12T14:15:00Z"
    },
    {
      id: "res-3",
      candidateName: "Aleksei Ivanov",
      email: "aleksei.3d@artstation.com",
      phone: "+7 900 123 4567",
      jobApplied: "3D Motion Graphics Intern",
      experienceYears: 1,
      portfolioLink: "https://artstation.com/aleksei3d",
      status: "Rejected",
      resumeFileName: "Aleksei_Ivanov_Portfolio.pdf",
      coverLetter: "Interested in the Remote 3D Internship. I specialize in luxury glass materials and liquid simulation.",
      appliedAt: "2026-06-22T16:00:00Z"
    }
  ],

  // 12. BLOG MANAGEMENT
  blogs: [
    {
      id: "blog-1",
      title: "The Art of Golden Ratios in Modern Luxury Branding",
      slug: "art-of-golden-ratios-luxury-branding",
      category: "Branding",
      readTime: "5 min read",
      content: "Luxury branding is not just about a clean logo; it's about strict geometric harmony. In this article, we explore how the historical golden ratio is applied in high-fashion campaigns (like Chanel and Dior) to invoke an unconscious feeling of quality. From layout compositions to physical retail spaces, we break down the rules of visual scale and why minimalism is the ultimate luxury.",
      tags: ["Luxury", "Geometry", "Design Laws"],
      coverImage: "https://images.unsplash.com/photo-1507208773393-40d9fc670acf?auto=format&fit=crop&q=80&w=800",
      publishDate: "2026-05-20",
      author: "Akanksha Dua",
      status: "published",
      createdAt: "2026-05-19T08:00:00Z"
    },
    {
      id: "blog-2",
      title: "From 10k to 1M: Storytelling Pacing That Retains Premium Audiences",
      slug: "storytelling-pacing-premium-audiences",
      category: "Creator Journey",
      readTime: "7 min read",
      content: "Audience retention on social media is traditionally optimized for high-energy hooks and rapid jumps. However, luxury brands require a different pacing—one that is slow, deliberate, and immersive. Learn why cinematic cinematography, ambient audio design, and micro-interactions perform better when targeting high-income demographics.",
      tags: ["Marketing", "Analytics", "Editing"],
      coverImage: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800",
      publishDate: "2026-06-12",
      author: "Akanksha Dua",
      status: "published",
      createdAt: "2026-06-10T10:00:00Z"
    },
    {
      id: "blog-3",
      title: "Behind the Scenes of the Amalfi Coast Production",
      slug: "behind-scenes-amalfi-production",
      category: "Lifestyle",
      readTime: "4 min read",
      content: "Drafting the logistical journey of coordinating a luxury video shoot in southern Italy. We discuss equipment shipping, securing brand permissions, and shooting in unpredictable lighting conditions.",
      tags: ["Travel", "Production", "Amalfi"],
      coverImage: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800",
      publishDate: "2026-06-28",
      author: "Akanksha Dua",
      status: "published",
      createdAt: "2026-06-28T15:00:00Z"
    },
    {
      id: "blog-4",
      title: "10 Aesthetic Rules for HNW Digital Marketing",
      slug: "aesthetic-rules-hnw-digital-marketing",
      category: "Marketing",
      readTime: "6 min read",
      content: "High-net-worth consumers do not react to standard advertising triggers. In this column, we analyze the 10 core aesthetic guidelines for luxury digital marketing: color space constraints, quiet copywriting, typography licensing, and utilizing interactive custom WebGL frameworks to build digital showrooms.",
      tags: ["Marketing", "HNW", "Luxury Rules"],
      coverImage: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800",
      publishDate: "2026-07-01",
      author: "Akanksha Dua",
      status: "published",
      createdAt: "2026-07-01T09:00:00Z"
    },
    {
      id: "blog-5",
      title: "5 Tips for Curating Consistent Social Media Feeds",
      slug: "tips-consistent-social-media-feeds",
      category: "Tips",
      readTime: "3 min read",
      content: "A quick checklist for visual creators trying to build clean grid flows. We detail the physics of lighting matching, contrast limits, selecting secondary accent colors, and scheduling tools to preview layout templates before publishing.",
      tags: ["Tips", "Social Grid", "Content Creation"],
      coverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
      publishDate: "2026-07-03",
      author: "Akanksha Dua",
      status: "published",
      createdAt: "2026-07-02T11:00:00Z"
    },
    {
      id: "blog-6",
      title: "Vogue Press Cover: Visual Media Trends in 2026",
      slug: "vogue-press-cover-media-trends",
      category: "Latest News",
      readTime: "4 min read",
      content: "Akanksha Dua is featured on the latest digital cover of Vogue Business. The editorial interview details why interactive 3D media assets and real-time custom product configurations are overriding traditional video banners.",
      tags: ["Vogue", "Latest News", "Press Coverage"],
      coverImage: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
      publishDate: "2026-07-05",
      author: "Akanksha Dua",
      status: "published",
      createdAt: "2026-07-04T14:00:00Z"
    }
  ],

  // 13. CONTACT ENQUIRIES
  enquiries: [
    {
      id: "enq-1",
      senderName: "Gabriella Rossi",
      email: "g.rossi@dolcegabbana.it",
      subject: "Luxury Campaign Brand Ambassador Booking",
      message: "Dear Akanksha, We are planning our Winter '26 Cruise campaign launch in Lake Como and would love to discuss booking you for our opening event and a series of 3 short-form commercial reels. Let us know your availability for a brief call next week.",
      category: "Booking",
      date: "2026-06-29T10:30:00Z",
      status: "Unread"
    },
    {
      id: "enq-2",
      senderName: "Vikram Sen",
      email: "vikram@timesgroup.com",
      subject: "Invitation to Speak: India Creator Summit",
      message: "Hello Akanksha, We would like to invite you as our key speaker for the 'Elite Creators' track. We expect an audience of 1,200 aspiring digital marketers and creators.",
      category: "Sponsorship",
      date: "2026-06-25T14:00:00Z",
      status: "Read"
    },
    {
      id: "enq-3",
      senderName: "Claire Dupont",
      email: "claire.dupont@loreal.com",
      subject: "Collaborative Product Release Proposal",
      message: "Greetings. Loreal Luxe division is researching co-branded launches for Q4. Your profile matches our target demographic perfectly.",
      category: "Booking",
      date: "2026-06-20T09:00:00Z",
      status: "Replied"
    }
  ],

  // 14. SEO SETTINGS
  seo: [
    {
      id: "seo-home",
      page: "Homepage",
      title: "Akanksha Dua | Premium Creator, Speaker & Luxury Brand Consultant",
      description: "Explore the official portfolio, collaborations, events, and business services of Akanksha Dua, establishing standard authority in the luxury digital landscape.",
      keywords: "Akanksha Dua, Luxury consultant, Personal branding, Vogue influencer, Keynote speaker, Fashion creator",
      ogTitle: "Akanksha Dua - Official Personal Brand Portal",
      ogType: "website",
      ogImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "seo-about",
      page: "About",
      title: "About Akanksha Dua | Personal Story & Professional Core Values",
      description: "Read the story of Akanksha Dua, her creative vision, career history, awards, achievements, and roadmap for future business ventures.",
      keywords: "Akanksha Dua story, Biography, Career achievements, Awards, Vision and core values",
      ogTitle: "About Akanksha Dua - The Founder's Journey",
      ogType: "profile",
      ogImage: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "seo-services",
      page: "Services",
      title: "Premium Services | Creative Direction, Consulting & Speakerships",
      description: "Scale your high-end brand using tailored marketing programs, content creation strategies, and public speaking arrangements by Akanksha Dua.",
      keywords: "Luxury marketing service, Hire luxury creator, Brand consulting, Creator workshop speaker",
      ogTitle: "Luxury Branding Services & Consultation Packages",
      ogType: "product",
      ogImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
    }
  ],

  // 15. USER MANAGEMENT
  users: [
    {
      id: "usr-1",
      name: "Akanksha Dua",
      email: "admin@akankshadua.com",
      role: "Super Admin",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      status: "Active",
      lastActive: "2026-07-02T12:00:00Z"
    },
    {
      id: "usr-2",
      name: "Taran Malhotra",
      email: "taran@zenvoracreative.com",
      role: "Editor",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      status: "Active",
      lastActive: "2026-07-02T10:45:00Z"
    },
    {
      id: "usr-3",
      name: "Sophia Reed",
      email: "sophia.analytics@gmail.com",
      role: "Analyst",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      status: "Suspended",
      lastActive: "2026-06-28T16:30:00Z"
    }
  ],

  // 16. HOMEPAGE MANAGEMENT
  homepage: {
    hero: {
      title: "REDEFINING DIGITAL LUXURY",
      subtitle: "Bespoke Brand Strategy & High-Fidelity Creative Production",
      videoBgUrl: "https://assets.mixkit.co/videos/preview/mixkit-glitter-particles-swirling-in-water-43289-large.mp4",
      ctaText: "Explore Portfolio",
      asset3dLink: "https://sketchfab.com/models/luxury-perfume-bottle"
    },
    brandStatement: {
      quote: "Luxury is not a price tag. It is a meticulous dedication to detail, storytelling, and aesthetic consistency.",
      author: "Akanksha Dua",
      description: "We help traditional heritage brands and modern disruptors design digital narratives that connect with high-net-worth audiences across the globe."
    },
    featuredServices: ["srv-1", "srv-2"],
    journeyHighlights: ["evt-1", "collab-2"],
    collaborations: {
      title: "TRUSTED BY ELITE HOUSES",
      subtitle: "Partnering to deliver high-affinity digital experiences."
    },
    campaigns: {
      headline: "FEATURED CAMPAIGNS",
      showCount: 3
    },
    projects: {
      headline: "PORTFOLIO HIGHLIGHTS"
    },
    testimonials: {
      headline: "CLIENT FEEDBACK"
    },
    statistics: {
      yearsActive: 7,
      totalReach: "15M+",
      luxuryClients: 45,
      engagementRate: "5.8%"
    },
    newsletter: {
      title: "THE LUXURY INSIDER",
      placeholder: "Enter your private email",
      description: "Subtle industry analysis, marketing trends, and private event announcements delivered monthly."
    },
    contactPreview: {
      headline: "DISCUSS A COLLABORATION",
      email: "booking@akankshadua.com",
      whatsapp: "+91 99999 11111"
    }
  },

  // 17. ABOUT MANAGEMENT
  about: {
    intro: "Akanksha Dua is a Mumbai-based creative director, public speaker, and luxury brand consultant specializing in HNW marketing and cinematic video production.",
    story: "Starting her career in boutique marketing agencies, Akanksha recognized a critical gap in the creator economy: the lack of high-fidelity, cinema-grade storytelling for high-end brands. In 2021, she launched her independent consultancy, bridging the gap between social media virality and the strict heritage codes of elite global fashion, hospitality, and luxury automotive industries.",
    passion: "Dedicated to restoring the artistic dignity of digital advertisements. By treating every campaign as a short art film, we elevate standard advertising into luxury storytelling.",
    vision: "To cultivate a new era of creator-led agency campaigns that rival traditional print editorials and cinematic television spots in design quality.",
    coreValues: [
      { id: "cv-1", title: "Aesthetic Rigor", desc: "No placeholders. Every asset must satisfy elite golden ratio guidelines." },
      { id: "cv-2", title: "Strategic Intent", desc: "Virality is vanity. Brand positioning and qualified HNW lead generation are our sole metrics." },
      { id: "cv-3", title: "Exclusive Quality", desc: "Restricted client roster. We execute only 4 major collaborative launches per calendar year." }
    ],
    background: "Master's Degree in Luxury Brand Management, London College of Fashion. Bachelors in Fine Arts.",
    achievements: [
      "Voted Top 10 Luxury Marketing Pioneers by Forbes 2025",
      "Keynote Speaker at Luxury Digital Summit Paris 2025",
      "Collaborator of the Year Award - Lifestyle Creators 2026"
    ],
    experience: [
      { year: "2024-Present", role: "Creative Director", company: "Zenvora Luxury Consulting" },
      { year: "2021-2024", role: "Principal Brand Advisor", company: "Prestige Lifestyle Agency" },
      { year: "2019-2021", role: "Creative lead", company: "Conde Nast Luxury Group" }
    ],
    futureGoals: [
      "Launch specialized luxury academy in Q1 2027",
      "Expand 3D CGI campaign division with interactive web-XR layouts"
    ]
  },

  // 18. FOUNDER JOURNEY MANAGEMENT
  founderJourney: [
    {
      id: "fj-1",
      milestone: "Childhood & Early Influences",
      year: "2000-2010",
      description: "Growing up in a family of art dealers, Akanksha developed a deep appreciation for classical art, symmetry, and craftsmanship at an early age.",
      details: "Spent hours cataloging fine paintings and studying structural balance.",
      category: "Childhood",
      isActive: true
    },
    {
      id: "fj-2",
      milestone: "The London Fashion Era",
      year: "2018",
      description: "Completed graduate studies in London, gaining deep academic and practical grounding in luxury brand heritage and HNW consumer behavior.",
      details: "Worked part-time as a social coordinator for boutique design houses in Mayfair.",
      category: "Career Beginning",
      isActive: true
    },
    {
      id: "fj-3",
      milestone: "First Armani Partnership",
      year: "2021",
      description: "Signed a breakthrough partnership with Armani Beauty, introducing cinematic short-form reels that recorded over 4M organic views.",
      details: "This campaign established the viability of cinema-pacing on social channels.",
      category: "First Brand Collaboration",
      isActive: true
    },
    {
      id: "fj-4",
      milestone: "Founding Zenvora Consulting",
      year: "2024",
      description: "Launched an independent agency focusing exclusively on premium digital brand positioning.",
      details: "Assembled a dedicated team of videographers, 3D artists, and copywriting experts.",
      category: "Major Milestones",
      isActive: true
    },
    {
      id: "fj-5",
      milestone: "The 3D Web Transition",
      year: "2026",
      description: "Migrated the agency's strategy towards immersive 3D, Web-GL, and spatial layouts, pioneering virtual luxury showrooms.",
      details: "Invested heavily in in-house Web-XR capabilities.",
      category: "Future Vision",
      isActive: true
    }
  ],

  // 19. MISSION & VISION
  missionVision: {
    brandPhilosophy: {
      headline: "Artistry as Strategy",
      content: "We believe digital campaigns should be as enduring as the physical products they represent. By treating social assets as cinematic collectibles, we build lasting brand equity rather than fleeting viral spikes."
    },
    communityVision: {
      headline: "Elevating the Creator Economy",
      content: "Fostering an ecosystem where creative developers and digital filmmakers receive standard agency representation and produce high-fidelity assets for luxury brands."
    },
    creatorMission: {
      headline: "Bridging Heritage and Technology",
      content: "Applying age-old guidelines of luxury typography, grids, and premium materials to modern digital canvases like React, 3D WebGL, and Spatial UI."
    },
    roadmap: [
      { id: "rm-1", quarter: "Q3 2026", goal: "Launch 3D Brand Collaborations Gallery with WebXR previews.", status: "In Progress" },
      { id: "rm-2", quarter: "Q4 2026", goal: "Establish remote European production division in Milan.", status: "Planning" },
      { id: "rm-3", quarter: "Q2 2027", goal: "Inaugural physical Zenvora Luxury Art Exhibition.", status: "Proposed" }
    ]
  },

  // 20. WEBSITE ANALYTICS
  analytics: {
    traffic: [
      { date: "06/26", desktop: 4500, mobile: 8000, tablet: 1200 },
      { date: "06/27", desktop: 4800, mobile: 8500, tablet: 1100 },
      { date: "06/28", desktop: 5200, mobile: 9100, tablet: 1300 },
      { date: "06/29", desktop: 6100, mobile: 11200, tablet: 1500 },
      { date: "06/30", desktop: 5900, mobile: 10800, tablet: 1400 },
      { date: "07/01", desktop: 6300, mobile: 12400, tablet: 1600 },
      { date: "07/02", desktop: 7200, mobile: 13800, tablet: 1900 }
    ],
    devices: [
      { name: "Mobile", value: 65, color: "#d4af37" },
      { name: "Desktop", value: 30, color: "#a1a1aa" },
      { name: "Tablet", value: 5, color: "#3f3f46" }
    ],
    referrals: [
      { channel: "Instagram Direct", percentage: 48, visitors: 28400 },
      { channel: "Forbes Editorial Links", percentage: 22, visitors: 13000 },
      { channel: "Google Search (Organic)", percentage: 18, visitors: 10600 },
      { channel: "Direct Traffic", percentage: 12, visitors: 7100 }
    ],
    topPages: [
      { path: "/", views: 42000, avgDuration: "2m 14s" },
      { path: "/portfolio", views: 28600, avgDuration: "3m 45s" },
      { path: "/founder-journey", views: 18400, avgDuration: "4m 20s" },
      { path: "/services", views: 12100, avgDuration: "1m 58s" }
    ]
  },

  // 21. WEBSITE SETTINGS
  settings: {
    brandLogoUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=100",
    brandName: "AKANKSHA DUA",
    officeAddress: "Zenvora Creative Studio, Floor 14, Nariman Point, Mumbai 400021",
    emailGeneral: "hello@akankshadua.com",
    emailBooking: "booking@akankshadua.com",
    whatsappNumber: "+91 99999 11111",
    socialLinks: {
      instagram: "https://instagram.com/akankshadua",
      youtube: "https://youtube.com/c/akankshadua",
      linkedin: "https://linkedin.com/in/akankshadua",
      pinterest: "https://pinterest.com/akankshadua"
    },
    maintenanceMode: false,
    googleAnalyticsId: "G-LUXURY3D2026",
    smtpHost: "smtp.mailgun.org",
    footerText: "© 2026 AKANKSHA DUA. Crafted with Zenvora 3D engine. All Rights Reserved."
  },

  // 22. FAQS (Auxiliary section referenced in Contact page)
  faqs: [
    {
      id: "faq-1",
      question: "What is your booking lead time?",
      answer: "We usually require 6-8 weeks lead time for custom production planning and creative brief approvals.",
      category: "Booking",
      isActive: true
    },
    {
      id: "faq-2",
      question: "Do you offer international consulting?",
      answer: "Yes, Zenvora handles luxury strategies globally. In-person shoots outside India are subject to active travel budgets.",
      category: "Services",
      isActive: true
    }
  ]
};
