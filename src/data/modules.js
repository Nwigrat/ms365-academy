const MODULES = [
  {
    id: "teams",
    icon: "💬",
    title: "Microsoft Teams",
    description:
      "Master collaboration, meetings, channels, and Teams administration.",
    resources: [
      {
        icon: "📖",
        title: "Microsoft Teams documentation",
        desc: "Official Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/microsoftteams/",
      },
      {
        icon: "🎓",
        title: "Manage team collaboration with Microsoft Teams",
        desc: "Microsoft Learn Path",
        url: "https://learn.microsoft.com/en-us/training/paths/m365-manage-team-collaboration/",
      },
      {
        icon: "📺",
        title: "Microsoft Teams video training",
        desc: "Microsoft Support",
        url: "https://support.microsoft.com/en-us/office/microsoft-teams-video-training-4f108e54-240b-4351-8084-b1152751f20a",
      },
    ],
    questions: [
      {
        q: "What is the maximum number of members in a standard Microsoft Teams team?",
        o: ["500", "5,000", "10,000", "25,000"],
        a: 3,
      },
      {
        q: "Which feature in Teams allows you to pin important messages at the top of a channel?",
        o: ["Bookmarks", "Pin message", "Announcements", "Channel highlight"],
        a: 1,
      },
      {
        q: "What type of Teams channel is visible only to specific team members?",
        o: ["Standard", "Public", "Private", "Shared"],
        a: 2,
      },
      {
        q: "Which Teams meeting role can manage breakout rooms?",
        o: ["Attendee", "Presenter", "Organizer", "Co-organizer"],
        a: 2,
      },
      {
        q: "What is Microsoft Teams Connect used for?",
        o: [
          "Connecting to Wi-Fi",
          "Shared channels across organizations",
          "VPN access",
          "Bluetooth pairing",
        ],
        a: 1,
      },
      {
        q: "What is the default message retention period in Teams if no policy is applied?",
        o: ["30 days", "90 days", "1 year", "Forever (no auto-deletion)"],
        a: 3,
      },
      {
        q: "Which Teams feature allows you to create automated workflows without code?",
        o: [
          "Teams Toolkit",
          "Power Automate integration",
          "Teams Scripts",
          "Flow Channel",
        ],
        a: 1,
      },
      {
        q: "Where in the Teams Admin Center can you manage calling policies?",
        o: [
          "Voice > Calling policies",
          "Settings > Calls",
          "Users > Phone",
          "Meetings > Dial-in",
        ],
        a: 0,
      },
      {
        q: "What does the 'Together Mode' feature do in Teams meetings?",
        o: [
          "Merges audio tracks",
          "Places participants in a shared virtual background",
          "Enables co-authoring",
          "Starts breakout rooms",
        ],
        a: 1,
      },
      {
        q: "Which file storage service backs the 'Files' tab in a Teams channel?",
        o: [
          "OneDrive for Business",
          "Azure Blob Storage",
          "SharePoint Online",
          "Exchange Online",
        ],
        a: 2,
      },
      {
        q: "How many channels (including private) can a single Team have at maximum?",
        o: ["100", "200", "250", "1,000"],
        a: 1,
      },
      {
        q: "Which Teams policy controls whether users can use GIFs in conversations?",
        o: [
          "App permission policy",
          "Messaging policy",
          "Meeting policy",
          "Compliance policy",
        ],
        a: 1,
      },
      {
        q: "What license is required for Teams Phone System capabilities?",
        o: [
          "Microsoft 365 E1",
          "Teams Exploratory",
          "Microsoft 365 E5 or Phone System add-on",
          "Any Microsoft 365 license",
        ],
        a: 2,
      },
      {
        q: "What happens to a team when its associated Microsoft 365 Group is deleted?",
        o: [
          "Nothing – Teams is independent",
          "The team is archived",
          "The team is also deleted",
          "Only channels are removed",
        ],
        a: 2,
      },
      {
        q: "Which Teams feature provides real-time captions powered by AI?",
        o: [
          "Transcription",
          "Live Captions",
          "Subtitles Add-in",
          "Copilot Captions",
        ],
        a: 1,
      },
    ],
  },
  {
    id: "sharepoint",
    icon: "🌐",
    title: "SharePoint Online",
    description:
      "Learn site management, document libraries, permissions, and content services.",
    resources: [
      {
        icon: "📖",
        title: "SharePoint documentation",
        desc: "Official Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/sharepoint/",
      },
      {
        icon: "🎓",
        title: "SharePoint Online learning path",
        desc: "Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/training/modules/sharepoint-online/",
      },
      {
        icon: "📺",
        title: "SharePoint video training",
        desc: "Microsoft Support",
        url: "https://support.microsoft.com/en-us/office/sharepoint-video-training-cb8ef501-84db-4427-ac77-ec2009fb8e23",
      },
    ],
    questions: [
      {
        q: "What is the default storage quota for a SharePoint Online site collection?",
        o: ["1 GB", "10 GB", "25 TB (pooled tenant storage)", "Unlimited"],
        a: 2,
      },
      {
        q: "Which SharePoint site template is designed for internal communication to a broad audience?",
        o: ["Team site", "Communication site", "Project site", "Blog site"],
        a: 1,
      },
      {
        q: "What is the maximum file upload size in SharePoint Online?",
        o: ["2 GB", "15 GB", "100 GB", "250 GB"],
        a: 3,
      },
      {
        q: "Which SharePoint feature allows you to automate document approval workflows?",
        o: [
          "Flow columns",
          "Power Automate",
          "InfoPath",
          "SharePoint Scheduler",
        ],
        a: 1,
      },
      {
        q: "What permission level allows users to view pages but not edit content?",
        o: ["Edit", "Contribute", "Read", "Full Control"],
        a: 2,
      },
      {
        q: "What is a SharePoint hub site used for?",
        o: [
          "Storing large files",
          "Connecting and organizing related sites",
          "Managing user accounts",
          "Running SQL queries",
        ],
        a: 1,
      },
      {
        q: "Which web part displays news articles from across the organization?",
        o: [
          "Hero web part",
          "News web part",
          "Highlighted Content",
          "Feed web part",
        ],
        a: 1,
      },
      {
        q: "How does versioning work in a SharePoint document library?",
        o: [
          "It only saves the last 2 versions",
          "It saves a new copy each time the file is edited",
          "It tracks major and/or minor versions with configurable limits",
          "It requires third-party software",
        ],
        a: 2,
      },
      {
        q: "What is the SharePoint Recycle Bin retention period (first stage)?",
        o: ["30 days", "60 days", "93 days", "180 days"],
        a: 2,
      },
      {
        q: "Which feature restricts sharing of a site to only people within the organization?",
        o: [
          "DLP policies",
          "External sharing settings",
          "Conditional Access",
          "Information Barriers",
        ],
        a: 1,
      },
      {
        q: "What does the SharePoint Migration Tool (SPMT) do?",
        o: [
          "Migrates content from on-premises or file shares to SharePoint Online",
          "Converts PDFs to Word documents",
          "Backs up Teams messages",
          "Moves email archives",
        ],
        a: 0,
      },
      {
        q: "Which admin role is needed to create new site collections?",
        o: [
          "Teams admin",
          "Exchange admin",
          "SharePoint admin",
          "Compliance admin",
        ],
        a: 2,
      },
      {
        q: "What type of column automatically generates a unique ID for each list item?",
        o: [
          "Calculated column",
          "ID column (built-in)",
          "Lookup column",
          "Managed metadata column",
        ],
        a: 1,
      },
      {
        q: "What is the purpose of a Content Type in SharePoint?",
        o: [
          "Define the site theme",
          "Reusable collection of metadata, templates, and workflow settings",
          "Manage user access",
          "Compress file storage",
        ],
        a: 1,
      },
      {
        q: "Which SharePoint feature uses AI to automatically tag and organize images?",
        o: [
          "SharePoint Syntex / Microsoft Syntex",
          "Power BI integration",
          "Delve",
          "SharePoint Designer",
        ],
        a: 0,
      },
    ],
  },
  {
    id: "outlook",
    icon: "📧",
    title: "Outlook & Exchange Online",
    description:
      "Master email management, calendar, rules, and Exchange Online administration.",
    resources: [
      {
        icon: "📖",
        title: "Exchange Online documentation",
        desc: "Official Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/exchange/exchange-online",
      },
      {
        icon: "🎓",
        title: "Manage messaging with Exchange Online",
        desc: "Microsoft Learn Path",
        url: "https://learn.microsoft.com/en-us/training/paths/m365-manage-messaging/",
      },
      {
        icon: "📺",
        title: "Outlook video training",
        desc: "Microsoft Support",
        url: "https://support.microsoft.com/en-us/office/outlook-video-training-8a5b816d-9052-4190-a5eb-494512343cca",
      },
    ],
    questions: [
      {
        q: "What is the default mailbox size limit for Exchange Online (E3/E5)?",
        o: ["10 GB", "25 GB", "50 GB", "100 GB"],
        a: 3,
      },
      {
        q: "What Outlook feature allows you to delay sending an email by a set time?",
        o: ["Send Later", "Delay Delivery", "Scheduled Send", "Time Shift"],
        a: 1,
      },
      {
        q: "Which Exchange Online feature places a user's mailbox on legal hold?",
        o: [
          "Data Loss Prevention",
          "Litigation Hold",
          "Retention Tag",
          "Compliance Archive",
        ],
        a: 1,
      },
      {
        q: "What protocol does Outlook use by default to connect to Exchange Online?",
        o: ["POP3", "IMAP", "MAPI over HTTP", "SMTP"],
        a: 2,
      },
      {
        q: "What is a Shared Mailbox in Exchange Online?",
        o: [
          "A mailbox that forwards all email",
          "A mailbox multiple users can access without a separate license",
          "A public email list",
          "A mailbox with 1TB storage",
        ],
        a: 1,
      },
      {
        q: "How many rules can you create per mailbox in Exchange Online?",
        o: ["50", "100", "256", "Unlimited"],
        a: 2,
      },
      {
        q: "What does an Exchange Online mail flow rule (transport rule) do?",
        o: [
          "Sorts email into folders",
          "Applies conditions and actions to messages in transit",
          "Compresses attachments",
          "Encrypts the mailbox database",
        ],
        a: 1,
      },
      {
        q: "What is the purpose of AutoDiscover in Exchange?",
        o: [
          "Automatically discovers spam",
          "Configures Outlook client settings automatically",
          "Finds deleted emails",
          "Discovers new Teams channels",
        ],
        a: 1,
      },
      {
        q: "Which Outlook feature uses AI to sort important emails from less important ones?",
        o: ["Smart Folders", "Focused Inbox", "Priority Mode", "AI Sort"],
        a: 1,
      },
      {
        q: "What is the maximum attachment size in Outlook for Exchange Online?",
        o: ["10 MB", "25 MB", "35 MB", "150 MB"],
        a: 3,
      },
      {
        q: "What is an Exchange Online Distribution Group used for?",
        o: [
          "Storing shared files",
          "Sending email to a group of recipients",
          "Scheduling meetings",
          "Managing licenses",
        ],
        a: 1,
      },
      {
        q: "Where do you manage anti-spam policies for Exchange Online?",
        o: [
          "Azure AD Portal",
          "Microsoft 365 Defender portal",
          "Exchange Admin Center > Mail flow",
          "SharePoint Admin Center",
        ],
        a: 1,
      },
      {
        q: "What does the 'Clutter' feature (now retired) get replaced by?",
        o: [
          "Junk Email folder",
          "Focused Inbox",
          "Smart Filters",
          "Archive folder",
        ],
        a: 1,
      },
      {
        q: "Which PowerShell module is used to manage Exchange Online?",
        o: [
          "AzureAD module",
          "MSOnline module",
          "Exchange Online Management (EXO V3)",
          "SharePoint PnP",
        ],
        a: 2,
      },
      {
        q: "What is the maximum number of recipients per message in Exchange Online?",
        o: ["100", "250", "500", "1,000"],
        a: 2,
      },
    ],
  },
  {
    id: "onedrive",
    icon: "☁️",
    title: "OneDrive for Business",
    description:
      "Learn cloud file storage, syncing, sharing, and data protection in OneDrive.",
    resources: [
      {
        icon: "📖",
        title: "OneDrive documentation",
        desc: "Official Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/onedrive/",
      },
      {
        icon: "🎓",
        title: "OneDrive learning module",
        desc: "Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/training/modules/m365-onedrive-collaboration-plan/",
      },
      {
        icon: "📺",
        title: "OneDrive video training",
        desc: "Microsoft Support",
        url: "https://support.microsoft.com/en-us/office/onedrive-video-training-1f608184-b7e6-43ca-8753-2ff679203132",
      },
    ],
    questions: [
      {
        q: "What is the default storage quota per user in OneDrive for Business (E3/E5)?",
        o: ["100 GB", "1 TB", "5 TB", "Unlimited"],
        a: 1,
      },
      {
        q: "What OneDrive feature lets you access files without downloading them to your device?",
        o: [
          "Files Restore",
          "Files On-Demand",
          "Offline Sync",
          "Cloud Attach",
        ],
        a: 1,
      },
      {
        q: "How far back can OneDrive 'Files Restore' recover files?",
        o: ["7 days", "14 days", "30 days", "90 days"],
        a: 2,
      },
      {
        q: "What happens when a user's account is deleted in Microsoft 365?",
        o: [
          "OneDrive files are immediately deleted",
          "OneDrive is retained for 30 days (configurable)",
          "Files move to SharePoint",
          "Nothing happens",
        ],
        a: 1,
      },
      {
        q: "Which sync client does OneDrive for Business use?",
        o: [
          "OneDrive.exe (modern sync client)",
          "Groove.exe",
          "SkyDrive client",
          "SharePoint Workspace",
        ],
        a: 0,
      },
      {
        q: "What is the maximum file size you can upload to OneDrive?",
        o: ["15 GB", "50 GB", "100 GB", "250 GB"],
        a: 3,
      },
      {
        q: "Which OneDrive feature detects ransomware attacks and helps recovery?",
        o: [
          "Threat Protection",
          "Ransomware Detection & Recovery",
          "OneDrive Vault",
          "Safe Links",
        ],
        a: 1,
      },
      {
        q: "What is the Personal Vault in OneDrive?",
        o: [
          "A shared team folder",
          "A protected area requiring additional identity verification",
          "An encrypted ZIP feature",
          "A backup of desktop files",
        ],
        a: 1,
      },
      {
        q: "How can an admin set OneDrive sharing to 'Only people in your organization'?",
        o: [
          "OneDrive Admin Center > Sharing settings",
          "Azure AD > App Registrations",
          "Exchange Admin Center",
          "Intune > Device Configuration",
        ],
        a: 0,
      },
      {
        q: "What feature allows OneDrive to automatically back up Desktop, Documents, and Pictures?",
        o: [
          "Known Folder Move (KFM)",
          "AutoSave",
          "Cloud Backup",
          "Folder Redirect",
        ],
        a: 0,
      },
      {
        q: "Which of these is NOT a valid OneDrive sharing link type?",
        o: [
          "Anyone with the link",
          "People in your organization",
          "Specific people",
          "Verified external domain only",
        ],
        a: 3,
      },
      {
        q: "What technology does OneDrive use to sync files efficiently with minimal bandwidth?",
        o: [
          "Full file copy",
          "Differential sync (block-level)",
          "ZIP compression",
          "FTP protocol",
        ],
        a: 1,
      },
      {
        q: "Where are OneDrive for Business files actually stored?",
        o: [
          "Azure Blob Storage",
          "SharePoint Online (each user gets a personal site)",
          "Exchange Online",
          "Local file server",
        ],
        a: 1,
      },
      {
        q: "What is the character limit for a OneDrive file path (including file name)?",
        o: [
          "128 characters",
          "256 characters",
          "400 characters",
          "The entire URL must be under 400 characters",
        ],
        a: 2,
      },
      {
        q: "Which admin center is used to manage OneDrive settings organization-wide?",
        o: [
          "Microsoft 365 Admin Center",
          "SharePoint Admin Center",
          "Azure AD Admin Center",
          "Intune Admin Center",
        ],
        a: 1,
      },
    ],
  },
  {
    id: "security",
    icon: "🔒",
    title: "M365 Security & Compliance",
    description:
      "Understand Microsoft Defender, Purview, DLP, Conditional Access, and Zero Trust.",
    resources: [
      {
        icon: "📖",
        title: "Microsoft 365 security documentation",
        desc: "Official Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/microsoft-365/security/",
      },
      {
        icon: "🎓",
        title: "Security, Compliance, and Identity Fundamentals",
        desc: "Microsoft Learn Path",
        url: "https://learn.microsoft.com/en-us/training/paths/describe-concepts-of-security-compliance-identity/",
      },
      {
        icon: "📺",
        title: "Microsoft Purview compliance portal overview",
        desc: "Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/purview/purview-compliance-portal",
      },
    ],
    questions: [
      {
        q: "What is the Zero Trust security model's core principle?",
        o: [
          "Trust but verify",
          "Trust internal networks by default",
          "Never trust, always verify",
          "Block all external access",
        ],
        a: 2,
      },
      {
        q: "Which Microsoft service provides Data Loss Prevention (DLP) policies?",
        o: [
          "Microsoft Defender for Endpoint",
          "Microsoft Purview",
          "Azure Firewall",
          "Intune",
        ],
        a: 1,
      },
      {
        q: "What does Conditional Access in Azure AD evaluate before granting access?",
        o: [
          "File size",
          "Signals like user, device, location, and risk level",
          "Email subject lines",
          "Application version numbers",
        ],
        a: 1,
      },
      {
        q: "What Microsoft Secure Score measures?",
        o: [
          "Network bandwidth",
          "Organization's security posture with actionable recommendations",
          "Number of licensed users",
          "Email delivery speed",
        ],
        a: 1,
      },
      {
        q: "Which tool investigates threats across email, endpoints, and identities in one portal?",
        o: [
          "Azure Monitor",
          "Microsoft 365 Defender portal",
          "SharePoint Admin Center",
          "Power BI",
        ],
        a: 1,
      },
      {
        q: "What does sensitivity labeling in Microsoft Purview do?",
        o: [
          "Classifies and protects documents and emails based on sensitivity",
          "Measures CPU sensitivity",
          "Labels network ports",
          "Tags user preferences",
        ],
        a: 0,
      },
      {
        q: "What is Microsoft Defender for Office 365 Plan 1 primarily used for?",
        o: [
          "Endpoint detection",
          "Safe Attachments and Safe Links for email",
          "Database encryption",
          "Desktop antivirus",
        ],
        a: 1,
      },
      {
        q: "What type of authentication does MFA (Multi-Factor Authentication) require?",
        o: [
          "One factor from one category",
          "Two or more factors from different categories",
          "Only biometrics",
          "Only SMS codes",
        ],
        a: 1,
      },
      {
        q: "What is an eDiscovery case used for in Microsoft Purview?",
        o: [
          "Discovering new apps",
          "Searching and exporting content for legal investigations",
          "Finding malware",
          "Auditing license usage",
        ],
        a: 1,
      },
      {
        q: "Which feature prevents users from forwarding, copying, or printing protected emails?",
        o: [
          "Transport rules",
          "Azure Information Protection / Rights Management",
          "Focused Inbox",
          "Email throttling",
        ],
        a: 1,
      },
      {
        q: "What does Microsoft Defender for Identity monitor?",
        o: [
          "Cloud storage usage",
          "On-premises Active Directory signals for identity threats",
          "Website uptime",
          "Printer activity",
        ],
        a: 1,
      },
      {
        q: "Where is the Unified Audit Log accessed?",
        o: [
          "Exchange Admin Center",
          "Microsoft Purview compliance portal",
          "Azure DevOps",
          "OneDrive Admin Center",
        ],
        a: 1,
      },
      {
        q: "What is the purpose of an Alert Policy in Microsoft 365?",
        o: [
          "Alert users about new features",
          "Generate notifications when specific activities or threats are detected",
          "Send birthday reminders",
          "Manage software updates",
        ],
        a: 1,
      },
      {
        q: "Which retention policy feature keeps content for a specified period then deletes it?",
        o: [
          "Retain and then delete",
          "Archive and compress",
          "Move to recycle bin",
          "Export and purge",
        ],
        a: 0,
      },
      {
        q: "What does 'Insider Risk Management' in Purview help detect?",
        o: [
          "External hackers",
          "Risky activities by internal users (data theft, leaks, etc.)",
          "Hardware failures",
          "Software bugs",
        ],
        a: 1,
      },
    ],
  },
  {
    id: "powerplatform",
    icon: "⚡",
    title: "Power Platform Basics",
    description:
      "Get started with Power Automate, Power Apps, Power BI, and Power Virtual Agents.",
    resources: [
      {
        icon: "📖",
        title: "Power Platform documentation",
        desc: "Official Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/power-platform/",
      },
      {
        icon: "🎓",
        title: "Power Platform Fundamentals",
        desc: "Microsoft Learn Path",
        url: "https://learn.microsoft.com/en-us/training/paths/power-plat-fundamentals/",
      },
      {
        icon: "📺",
        title: "Power Automate documentation",
        desc: "Microsoft Learn",
        url: "https://learn.microsoft.com/en-us/power-automate/",
      },
    ],
    questions: [
      {
        q: "Which Power Platform tool allows you to build apps without writing code?",
        o: ["Power BI", "Power Automate", "Power Apps", "Power Virtual Agents"],
        a: 2,
      },
      {
        q: "What does Power Automate primarily do?",
        o: [
          "Create data visualizations",
          "Automate repetitive tasks and workflows",
          "Build mobile apps",
          "Manage user accounts",
        ],
        a: 1,
      },
      {
        q: "What is a 'connector' in Power Platform?",
        o: [
          "A physical cable",
          "A pre-built bridge to external services and data sources",
          "A type of database",
          "A security certificate",
        ],
        a: 1,
      },
      {
        q: "Which Power Platform product creates interactive dashboards and reports?",
        o: ["Power Apps", "Power Automate", "Power BI", "Power Pages"],
        a: 2,
      },
      {
        q: "What is a 'flow' in Power Automate?",
        o: [
          "A type of email",
          "An automated workflow triggered by events or schedules",
          "A data table",
          "A user interface layout",
        ],
        a: 1,
      },
      {
        q: "What is Dataverse in Power Platform?",
        o: [
          "A code editor",
          "A cloud-based data storage service used by Power Platform apps",
          "A type of virtual machine",
          "An email service",
        ],
        a: 1,
      },
      {
        q: "Which type of Power Automate flow runs on a recurring schedule?",
        o: [
          "Instant flow",
          "Automated flow",
          "Scheduled flow",
          "Business process flow",
        ],
        a: 2,
      },
      {
        q: "What has Power Virtual Agents been rebranded/merged into?",
        o: [
          "Power BI",
          "Power Pages",
          "Microsoft Copilot Studio",
          "Power Automate Desktop",
        ],
        a: 2,
      },
      {
        q: "What is a Canvas App in Power Apps?",
        o: [
          "An app with a fixed layout",
          "An app where you design the UI by dragging and dropping on a blank canvas",
          "A web browser plugin",
          "A SharePoint web part",
        ],
        a: 1,
      },
      {
        q: "What is the purpose of Power Automate Desktop (PAD)?",
        o: [
          "Cloud-only automation",
          "Robotic Process Automation (RPA) on the desktop",
          "Building mobile apps",
          "Data analytics",
        ],
        a: 1,
      },
      {
        q: "What is a 'Model-driven app' in Power Apps?",
        o: [
          "An app built with 3D models",
          "An app whose layout is driven by the underlying data model and business logic",
          "An AI-generated app",
          "A template-based website",
        ],
        a: 1,
      },
      {
        q: "Which license type allows users to use Power Automate with premium connectors?",
        o: [
          "Microsoft 365 license (included)",
          "Power Automate Premium (per-user)",
          "Free license",
          "SharePoint license",
        ],
        a: 1,
      },
      {
        q: "What is an Environment in Power Platform?",
        o: [
          "The physical server room",
          "A space to store, manage, and share apps, flows, and data",
          "A code development IDE",
          "An email domain",
        ],
        a: 1,
      },
      {
        q: "What is the purpose of AI Builder in Power Platform?",
        o: [
          "Building physical robots",
          "Adding pre-built or custom AI models to apps and flows",
          "Compiling code",
          "Managing Azure VMs",
        ],
        a: 1,
      },
      {
        q: "What does DLP stand for in the context of Power Platform governance?",
        o: [
          "Data Link Protocol",
          "Data Loss Prevention",
          "Dynamic Load Processing",
          "Digital License Platform",
        ],
        a: 1,
      },
    ],
  },
];

export const QUIZ_QUESTION_COUNT = 5;
export const PASS_THRESHOLD = 3;
export const POINTS_PER_CORRECT = 20;
export const BONUS_PERFECT = 30;

export default MODULES;