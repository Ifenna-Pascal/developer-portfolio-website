export type Category = "work" | "personal" | "web3" | "mobile" | "cli";

export const categories: { id: "all" | Category; label: string; blurb: string }[] = [
  { id: "all", label: "All", blurb: "Everything I've shipped and am shipping." },
  { id: "work", label: "Work", blurb: "Products I built with teams at companies and for clients." },
  { id: "personal", label: "Personal", blurb: "Side projects I build to learn, explore and scratch my own itch." },
  { id: "web3", label: "Web3", blurb: "dApps, DeFi and on-chain tooling." },
  { id: "mobile", label: "Mobile", blurb: "Apps for iOS and Android." },
  { id: "cli", label: "CLI tools", blurb: "Developer tools that live in the terminal." },
];

type Base = {
  slug: string;
  name: string;
  tagline: string;
  categories: Category[];
  tech: string[];
  /** True for sample entries that should be replaced with real ones. */
  placeholder?: boolean;
  repo?: string;
  /** Longer write-up shown on the project's own page, one string per paragraph. */
  description?: string[];
  /** Short feature list shown on the project's own page. */
  highlights?: string[];
};

export type WebProject = Base & {
  kind: "web";
  type: string;
  company?: string;
  role?: string;
  result?: string;
  why?: string;
  status?: "Live" | "In progress" | "Archived";
  live?: string;
  image: string;
  /** Horizontal focal point (0 = left, 1 = right) used when the image is cropped. */
  focus?: number;
};

export type MobileProject = Base & {
  kind: "mobile";
  type: string;
  result?: string;
  appStore?: string;
  playStore?: string;
  /** Link to an installable build (Expo, TestFlight, APK). */
  build?: string;
  screens: string[];
};

/**
 * One line of a scripted terminal demo. A "notify" line is not printed: it pops a desktop
 * notification over the terminal instead, with `title` as the heading and `s` as the body.
 */
export type TermLine = { t: "cmd" | "out" | "ok" | "warn" | "dim" | "notify"; s: string; title?: string };

export type CliProject = Base & {
  kind: "cli";
  language: string;
  version: string;
  stars?: number;
  downloads?: string;
  install: { label: string; cmd: string }[];
  demo: TermLine[];
  commands: { cmd: string; desc: string }[];
  npm?: string;
  docs?: string;
};

export type Project = WebProject | MobileProject | CliProject;

const work: WebProject[] = [
  {
    kind: "web",
    slug: "brydge-escrow",
    name: "Brydge Escrow",
    tagline: "Escrow layer making Brydge a trusted third party in cross-border African trade.",
    type: "Fintech platform",
    company: "Brydge",
    role: "Senior Full Stack Engineer",
    tech: ["Go", "PostgreSQL", "Redis", "Docker", "Next.js", "Turborepo", "Tailwind CSS"],
    result: "₦15M+ held in escrow",
    status: "Live",
    live: "https://brydgehq.co/",
    image: "/images/projects/brydge.jpg",
    categories: ["work"],
  },
  {
    kind: "web",
    slug: "mallgrid",
    name: "Mallgrid",
    tagline: "Multi-store e-commerce platform for launching custom online stores.",
    type: "E-commerce platform",
    company: "Mallgrid",
    role: "Senior Full Stack Engineer",
    tech: ["Next.js", "TypeScript", "NestJS", "MongoDB", "Paystack", "Redis/Bull"],
    result: "50+ stores, ₦2M+ processed",
    status: "Live",
    live: "https://mallgrid.com/",
    image: "/images/projects/mallgrid-mock.jpg",
    focus: 0.5,
    categories: ["work"],
  },
  {
    kind: "web",
    slug: "tranzakt",
    name: "Tranzakt Payment Gateway",
    tagline: "Card, bank and bill payments with real-time transaction updates.",
    type: "Payment gateway",
    company: "Tranzakt Finance",
    role: "Senior Frontend Engineer",
    tech: ["Next.js", "TypeScript", "Node.js", "SignalR", "PWA"],
    result: "2.3× transaction volume in Q1",
    status: "Live",
    live: "https://tranzakt.finance/",
    image: "/images/projects/tranzakt.jpg",
    categories: ["work"],
  },
  {
    kind: "web",
    slug: "9mobile-commerce",
    name: "9mobile Commerce",
    tagline: "E-commerce, payouts, publishing and survey analytics platform.",
    type: "E-commerce platform",
    company: "Genesys Tech Hub",
    role: "Software Engineer",
    tech: ["React", "Node.js"],
    result: "50,000+ users",
    status: "Live",
    live: "https://t2mobile.com.ng/",
    image: "/images/projects/t2mobile-cover.jpg",
    focus: 0.5,
    categories: ["work"],
  },
  {
    kind: "web",
    slug: "genesys-foundation",
    name: "Genesys Foundation",
    tagline: "Scheduled recurring donations for Genesys Foundation.",
    type: "Web app",
    company: "Genesys Tech Hub",
    role: "Software Engineer",
    tech: ["React", "Node.js", "Paystack"],
    result: "+25% successful donations MoM",
    status: "Live",
    live: "https://genesysfoundation.org/",
    image: "/images/projects/genesys.jpg",
    focus: 0.15,
    categories: ["work"],
  },
  {
    kind: "web",
    slug: "partzshop",
    name: "Partzshop",
    tagline: "Genuine and tokunbo car parts for Nigeria, checked against your exact make, model and year, then delivered to your door.",
    type: "E-commerce platform",
    company: "Partzshop",
    role: "Full Stack Engineer",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "WhatsApp ordering"],
    result: "Nationwide delivery · 2-year warranty",
    status: "Live",
    live: "https://partzshop.com/",
    image: "/images/projects/partzshop-mock.jpg",
    focus: 0.5,
    categories: ["work"],
    description: [
      "Buying car parts in Nigeria usually means guessing. Partzshop removes the guessing: a driver sets their make, model and year once, and the whole store filters down to parts confirmed to fit that car. When a part doesn't fit, the store says so.",
      "The catalogue covers brand-new genuine parts with a two-year warranty, and foreign-used (tokunbo) parts graded A, B or C before they are listed. Engines and gearboxes are graded by mileage and compression, with photos and figures shared before any money changes hands.",
      "Not every sale suits a cart, so big-ticket items such as full engines go to a real person on WhatsApp. Orders ship nationwide with a seven-day free return on a wrong part.",
    ],
    highlights: ["Shop-by-car fitment filter across the whole store", "Graded tokunbo listings (A, B, C)", "Engines and gearboxes sourced to order via WhatsApp agents", "Nationwide delivery and 7-day returns"],
  },
];

/** Personal and freelance builds. */
const personal: WebProject[] = [
  {
    kind: "web",
    slug: "trivia",
    name: "Trivia",
    tagline: "A live quiz game for events: build a quiz in a minute, show one QR code, and the whole room races to answer first.",
    type: "Live quiz platform",
    tech: ["Go", "Gin", "PostgreSQL", "sqlc", "SSE", "React 19", "Vite", "Tailwind CSS"],
    why: "I wanted church quiz nights and office parties to feel like a game show, with no app for guests to install.",
    status: "Live",
    live: "https://trivia-pawc.onrender.com/",
    image: "/images/projects/trivia-mock.jpg",
    focus: 0.5,
    categories: ["personal"],
    description: [
      "Trivia turns any gathering into a live game show. A host builds a quiz in about a minute, either by picking categories such as Bible, sports and history and letting the app generate questions, or by writing their own. One QR code goes on the big screen; guests scan it, type a name and they are in. There is no app to install.",
      "Questions go out on a timer and the fastest correct answer wins the point. Answers stay hidden until the host reveals them, and the leaderboard moves in real time on every screen. Players and the host share a chat for the session.",
      "Under the hood it is a Go API (Gin, PostgreSQL, sqlc) with JWT auth and rotating refresh tokens. Every vote is processed under a row lock so exactly one player can win a question even when several answer at the same instant. Live updates stream over Server-Sent Events, fanned out through Postgres LISTEN/NOTIFY so it scales across multiple API instances. The web app is React 19 with Vite and Tailwind.",
    ],
    highlights: ["Join by QR code, no app needed", "Fastest-correct-answer scoring with row-level locking", "Real-time leaderboard over SSE + pg_notify", "Quiz generator by category and difficulty"],
  },
  {
    kind: "web",
    slug: "blockchain-solutions",
    name: "Blockchain Solutions",
    tagline: "Website for a Salt Lake City studio building AI automation, websites, mobile apps, blockchain and custom software.",
    type: "Studio website",
    tech: ["React", "Responsive web", "Local SEO", "Motion design"],
    why: "The studio needed a site that sells five services clearly without feeling like five different companies.",
    status: "Live",
    live: "https://blockchainslc.com/",
    image: "/images/projects/blockchainslc.jpg",
    focus: 0,
    categories: ["personal"],
    description: [
      "Blockchain Solutions is a senior software studio in Salt Lake City that builds AI automation, websites, mobile apps, smart contracts and custom software at a fixed price after a free scoping call.",
      "The site has to explain five quite different services to a local business owner in seconds. It leads with one clear promise, then breaks the offer into service cards, featured work, pricing, a step-by-step process and an insights section, all driving to a single action: book a free consult.",
      "It is built to rank for local searches, load fast and feel premium, with a dark, glowing visual language that suits a studio working across AI and Web3.",
    ],
    highlights: ["Five service lines with their own landing sections", "Pricing, process and work showcase", "Local SEO for Salt Lake City", "Single clear conversion path: book a consult"],
  },
  {
    kind: "web",
    slug: "clintons-developers",
    name: "Clinton's Developers",
    tagline: "Website for an Ibadan property developer showing gated estates, galleries and live offers with units, prices and floor plans.",
    type: "Real estate website",
    tech: ["Responsive web", "Gallery", "Owner portal", "Local SEO"],
    why: "A developer judged on what it has delivered needed a site that lets finished estates do the selling.",
    status: "Live",
    live: "https://www.clintonsdevelopers.com",
    image: "/images/projects/clintons-mock.jpg",
    focus: 0.5,
    categories: ["personal"],
    description: [
      "Clinton's Developers Ltd builds gated terraced homes in Iyaganku and Jericho G.R.A., Ibadan: six developments, 23 homes built and 23 sold.",
      "The site is built around proof. A gallery shows the finished estates, a portfolio lists each development with its unit count and location, and the Offers page separates ongoing projects from completed ones, with units, prices and floor plans for each.",
      "There is also an owner login for existing buyers, and the pages are tuned for local search terms such as property developers in Ibadan.",
    ],
    highlights: ["Developments portfolio with unit counts", "Offers with prices and floor plans", "Photo gallery of delivered estates", "Owner login for buyers"],
  },
  {
    kind: "web",
    slug: "betguard",
    name: "Betguard Predictions",
    tagline: "Insurance for sports predictions: insure a betting slip, track events and odds, and manage it all from one wallet.",
    type: "Sports insurance platform",
    tech: ["Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Radix UI", "Firebase"],
    why: "A new kind of product: protecting a punter's stake rather than placing the bet.",
    status: "Live",
    live: "https://betguardpredictions.com/",
    image: "/images/projects/betguard-mock.jpg",
    focus: 0.5,
    categories: ["personal"],
    description: [
      "Betguard is insurance for sports predictions. People insure the slips they place with bookmakers through their Betguard wallet, so a losing slip does not have to be a total loss.",
      "The app pulls in live fixtures and odds across leagues such as the Premier League and LaLiga, shows a dashboard of total amount insured, wins, losses and reserve, and includes game predictions. A separate admin dashboard handles events, slips, payouts and reporting.",
      "I built the customer web app and the admin panel in Next.js with Redux Toolkit, React Hook Form with Zod validation, and Radix UI components.",
    ],
    highlights: ["Slip insurance flow with wallet payments", "Live fixtures and odds by league", "Dashboard of insured amount, wins and losses", "Separate admin panel for operations"],
  },
  {
    kind: "web",
    slug: "buildadom",
    name: "Buildadom",
    tagline: "A marketplace connecting manufacturers, distributors and dealers of building materials, with escrow-protected payments.",
    type: "B2B marketplace",
    tech: ["React", "Vite", "TypeScript", "Escrow payments", "REST API"],
    why: "Africa's construction supply chain still runs on phone calls; I wanted it to run on storefronts and guaranteed payments.",
    status: "Live",
    live: "https://buildadom.com/",
    image: "/images/projects/buildadom-cover.jpg",
    focus: 0.5,
    categories: ["personal"],
    description: [
      "Buildadom is an ecosystem for the building and construction industry. Manufacturers, distributors and dealers get their own digital store to reach customers and take, process and fulfil orders online.",
      "Every payment goes through an escrow account, so buyers and sellers both know the money is safe until delivery. The platform lists 3,000+ shops and stores, and businesses with an existing website can plug into Buildadom's API to take orders there too.",
      "The goal is to bring trust, quality assurance and digital tools to an industry that still runs mostly offline.",
    ],
    highlights: ["Multi-vendor stores for suppliers", "Escrow-backed transactions", "Order API for suppliers' own websites", "3,000+ shops and stores"],
  },
];

/** On-chain products. */
const web3: WebProject[] = [
  {
    kind: "web",
    slug: "nebula-protocol",
    name: "Nebula Protocol",
    tagline: "A lending and borrowing dApp on Nibiru: supply assets as collateral, borrow against them and earn points.",
    type: "DeFi lending dApp",
    company: "Smart Gwei Tech",
    role: "Blockchain Engineer",
    tech: ["Next.js", "TypeScript", "Wagmi", "Nibiru", "Smart contracts"],
    result: "2× user engagement",
    status: "Live",
    live: "https://nebula-dapp.vercel.app/",
    image: "/images/projects/nebula-cover.jpg",
    focus: 0.5,
    categories: ["web3"],
    description: [
      "Nebula is a money market on the Nibiru chain. Users connect a wallet, supply assets such as NIBI or wrapped BTC to build a collateral balance, and borrow against it.",
      "The dashboard puts the numbers that matter up front: collateral balance, borrow balance and an asset pool table with total supplied, total borrowed, liquidation thresholds and live supply and borrow APYs. A single panel switches between supplying and borrowing, with quick 50% and max amounts.",
      "There are also Market and Portfolio views and an Earn Points programme. I built the dashboard with Next.js and Wagmi, added a tiered referral rewards system that grew onboarding by 40% in three months, and cut failed transactions by 35% with better contract interaction logic and gas estimation.",
    ],
    highlights: ["Supply and borrow with collateral tracking", "Live APYs per asset pool", "Wallet connection on Nibiru", "Points programme for early users"],
  },
];

/** iOS and Android apps, captured from the running apps. */
const mobile: MobileProject[] = [
  {
    kind: "mobile",
    slug: "asiko",
    name: "Asiko",
    tagline: "A social app for sharing the moment: photo moments, likes and comments, and real-time chat with voice notes.",
    type: "Social app · iOS & Android",
    tech: ["React Native", "Expo", "Expo Router", "NativeWind", "Firebase", "Cloudinary"],
    build: "https://expo.dev/accounts/ifenna-pascals-team/projects/asiko/builds/8fee46d1-7d09-402f-8df5-9194bed4cc95",
    screens: ["/images/apps/as-signin.jpg", "/images/apps/as-welcome.jpg", "/images/apps/as-signup.jpg"],
    categories: ["mobile"],
    description: [
      "Asiko means \"moment\" in Yoruba, and the app is about sharing yours. People post moments of up to ten photos in a swipeable carousel, like with a button or a double-tap, and talk in the comments, where comments can be liked or disliked too.",
      "Chat is real-time and one-to-one: text, photos and voice notes, with typing indicators, online and last-seen status, read receipts and unread badges. There is a Discover tab to find people, full profiles with stats, and light and dark mode.",
      "It is built with Expo and Expo Router, styled with NativeWind, and backed by Firebase Auth and Firestore with Cloudinary for photos and audio. Data always flows screen → hook → service → Firebase, so no component talks to the backend directly.",
    ],
    highlights: ["Multi-photo moments with carousel", "Real-time chat with voice notes and read receipts", "Sign in with username or email", "Light and dark mode"],
  },
  {
    kind: "mobile",
    slug: "real-estate-app",
    name: "Real Estate App",
    tagline: "Browse, save and book property viewings, with featured homes, smart filters, agents and reviews.",
    type: "Property app · iOS & Android",
    tech: ["React Native", "Expo", "Expo Router", "NativeWind", "Firebase"],
    screens: ["/images/apps/re-explore.jpg", "/images/apps/re-home.jpg", "/images/apps/re-detail.jpg"],
    categories: ["mobile"],
    description: [
      "A property app for finding a home. The home screen opens with featured listings and personal recommendations; Explore lets you search and filter houses, condos, duplexes and more, in a grid or list.",
      "Each property page has a photo gallery, beds, baths and floor area, the listing agent with chat and call buttons, reviews, and a Book Now flow to schedule a viewing. Signed-in users can save favourites, manage bookings and get notifications.",
      "Listings, categories, reviews, bookings and notifications all live in Firestore, with Firebase Auth for accounts. Guests can browse everything before signing up.",
    ],
    highlights: ["Featured listings and recommendations", "Search with category filters", "Agent contact and viewing bookings", "Favourites and notifications"],
  },
];

const gh = (name: string) => `https://github.com/Ifenna-Pascal/${name}`;
const goInstall = (name: string) => [
  { label: "brew", cmd: `brew install ifenna-pascal/tap/${name}` },
  { label: "go", cmd: `go install github.com/Ifenna-Pascal/${name}@latest` },
];

/** CLI tools, all written in Go. Planned builds: the demos show how each one will work. */
const cli: CliProject[] = [
  {
    kind: "cli",
    slug: "shipkit",
    name: "shipkit",
    tagline: "Scaffold a production-ready Next.js + NestJS monorepo in one command.",
    language: "Go",
    version: "v0.1.0",
    tech: ["Go", "Cobra", "Bubble Tea", "Turborepo", "Docker"],
    install: goInstall("shipkit"),
    demo: [
      { t: "cmd", s: "shipkit init storefront" },
      { t: "dim", s: "? Database › PostgreSQL" },
      { t: "dim", s: "? Payments › Paystack" },
      { t: "ok", s: "✔ apps/web (Next.js) created" },
      { t: "ok", s: "✔ apps/api (NestJS) created" },
      { t: "ok", s: "✔ Docker + CI configured" },
      { t: "cmd", s: "cd storefront && pnpm dev" },
      { t: "out", s: "  web → :3000   api → :4000" },
    ],
    commands: [
      { cmd: "shipkit init <name>", desc: "Create a new monorepo with prompts" },
      { cmd: "shipkit add <module>", desc: "Add auth, payments, queues or email" },
      { cmd: "shipkit doctor", desc: "Check your environment and config" },
    ],
    repo: gh("shipkit"),
    categories: ["cli"],
    placeholder: true,
  },
  {
    kind: "cli",
    slug: "flow",
    name: "flow",
    tagline: "Runs your day's schedule and tracks time per repo, folder and branch automatically, with desktop nudges.",
    language: "Go",
    version: "v0.1.0",
    tech: ["Go", "fsnotify", "SQLite", "Bubble Tea", "macOS notifications"],
    install: goInstall("flow"),
    demo: [
      { t: "cmd", s: "flow add \"Brydge refactor\" 10:00-12:30" },
      { t: "ok", s: "✔ Block scheduled · reminder at 10:00" },
      { t: "notify", title: "10:00 · Brydge refactor", s: "Time to start. 2h 30m blocked in brydge-escrow." },
      { t: "cmd", s: "flow today" },
      { t: "dim", s: "  REPO            FOLDER        TIME" },
      { t: "out", s: "  brydge-escrow   payments/     1h 35m" },
      { t: "out", s: "  mallgrid-api    orders/       1h 25m" },
      { t: "warn", s: "  ⚠ Planned 2h on Brydge · 25m left" },
      { t: "ok", s: "  Next: Mallgrid review at 12:30" },
      { t: "notify", title: "25 minutes left", s: "Wrap up Brydge refactor. Next: Mallgrid review at 12:30." },
    ],
    commands: [
      { cmd: "flow start", desc: "Start the background tracker" },
      { cmd: "flow add \"<task>\" <from>-<to>", desc: "Schedule a block with notifications" },
      { cmd: "flow today", desc: "Live dashboard: plan versus where time went" },
      { cmd: "flow focus <duration>", desc: "Start a focus block with a break reminder" },
      { cmd: "flow report --week", desc: "Time per project, folder and branch" },
      { cmd: "flow sync <linear|jira|notion>", desc: "Push logged time to your task manager" },
    ],
    repo: gh("flow"),
    categories: ["cli"],
    placeholder: true,
  },
  {
    kind: "cli",
    slug: "pulse",
    name: "pulse",
    tagline: "Watches your deployed backends from your laptop and alerts you the moment one goes down.",
    language: "Go",
    version: "v0.1.0",
    tech: ["Go", "net/http", "SQLite", "Bubble Tea", "Heroku API"],
    install: goInstall("pulse"),
    demo: [
      { t: "cmd", s: "pulse add brydge api.brydgehq.co/health" },
      { t: "ok", s: "✔ Checking every 30s" },
      { t: "cmd", s: "pulse status" },
      { t: "dim", s: "  SERVICE    STATUS   LATENCY  UPTIME" },
      { t: "ok", s: "  brydge     ● UP     182ms    99.8%" },
      { t: "ok", s: "  mallgrid   ● UP     240ms    100%" },
      { t: "warn", s: "  tranzakt   ● DOWN   502      97.1%" },
      { t: "notify", title: "🔴 tranzakt is DOWN", s: "GET /health → 502 Bad Gateway · 3 checks in a row" },
      { t: "warn", s: "  🔔 Alert sent: tranzakt down 3m" },
    ],
    commands: [
      { cmd: "pulse add <name> <url> [--every 30s]", desc: "Monitor a health endpoint" },
      { cmd: "pulse start", desc: "Run checks in the background with desktop alerts" },
      { cmd: "pulse status", desc: "Live dashboard of every service" },
      { cmd: "pulse history <name>", desc: "Past outages, duration and errors" },
      { cmd: "pulse serve", desc: "Run 24/7 on a server with Slack or Telegram alerts" },
    ],
    repo: gh("pulse"),
    categories: ["cli"],
    placeholder: true,
  },
  {
    kind: "cli",
    slug: "tunnel",
    name: "tunnel",
    tagline: "Share localhost with a public HTTPS link. Both the client and the relay server are written from scratch.",
    language: "Go",
    version: "v0.1.0",
    tech: ["Go", "TCP", "WebSockets", "TLS", "Multiplexing"],
    install: goInstall("tunnel"),
    demo: [
      { t: "cmd", s: "tunnel 3000" },
      { t: "ok", s: "✔ Connected to relay (lagos-1)" },
      { t: "out", s: "  https://quiet-river.tunnel.sh" },
      { t: "dim", s: "    → http://localhost:3000" },
      { t: "dim", s: "  METHOD  PATH               STATUS  TIME" },
      { t: "out", s: "  POST    /webhooks/paystack 200     41ms" },
      { t: "out", s: "  GET     /api/orders        200     18ms" },
      { t: "warn", s: "  ↻ Connection dropped, reconnected" },
    ],
    commands: [
      { cmd: "tunnel <port>", desc: "Expose a local port on a public URL" },
      { cmd: "tunnel <port> --subdomain <name>", desc: "Reserve a memorable subdomain" },
      { cmd: "tunnel inspect", desc: "See and replay requests that came through" },
      { cmd: "tunnel relay", desc: "Run your own relay server" },
    ],
    repo: gh("tunnel"),
    categories: ["cli"],
    placeholder: true,
  },
  {
    kind: "cli",
    slug: "gitpulse",
    name: "gitpulse",
    tagline: "A health report for any git repo: ownership, hotspots, PR speed and bus-factor risks.",
    language: "Go",
    version: "v0.1.0",
    tech: ["Go", "go-git", "Goroutines", "Lip Gloss"],
    install: goInstall("gitpulse"),
    demo: [
      { t: "cmd", s: "gitpulse --since 90d" },
      { t: "ok", s: "✔ 1,284 commits analysed (0.6s)" },
      { t: "dim", s: "  HOTSPOTS            CHANGES  OWNERS" },
      { t: "out", s: "  payments/escrow/    142      3" },
      { t: "out", s: "  orders/checkout/    97       2" },
      { t: "warn", s: "  ⚠ Bus factor 1: settlement/ (ifenna)" },
      { t: "out", s: "  Median PR time to merge: 9h 20m" },
    ],
    commands: [
      { cmd: "gitpulse [--since 90d]", desc: "Full repo health report" },
      { cmd: "gitpulse hotspots", desc: "Files that change most and break most" },
      { cmd: "gitpulse owners <path>", desc: "Who really knows this part of the code" },
      { cmd: "gitpulse --json", desc: "Machine-readable output for CI" },
    ],
    repo: gh("gitpulse"),
    categories: ["cli"],
    placeholder: true,
  },
  {
    kind: "cli",
    slug: "depscan",
    name: "depscan",
    tagline: "Finds risky dependencies in Go and Node projects: vulnerabilities, abandoned packages and licence issues.",
    language: "Go",
    version: "v0.1.0",
    tech: ["Go", "OSV API", "Concurrency", "Caching"],
    install: goInstall("depscan"),
    demo: [
      { t: "cmd", s: "depscan ." },
      { t: "ok", s: "✔ 214 dependencies scanned (1.2s)" },
      { t: "warn", s: "  HIGH   jsonwebtoken@8.5.1  CVE-2022-23529" },
      { t: "warn", s: "  STALE  request@2.88.2  no release in 5y" },
      { t: "out", s: "  LICENCE  1 GPL-3.0 package found" },
      { t: "dim", s: "  Fix: npm i jsonwebtoken@9.0.2" },
      { t: "cmd", s: "depscan . --ci --fail-on high" },
      { t: "warn", s: "✖ 1 high issue · exit 1" },
    ],
    commands: [
      { cmd: "depscan <path>", desc: "Scan go.mod or package.json" },
      { cmd: "depscan <path> --ci --fail-on <level>", desc: "Fail the build on risky deps" },
      { cmd: "depscan tree <package>", desc: "Show why a package is installed" },
      { cmd: "depscan licences", desc: "List every licence in use" },
    ],
    repo: gh("depscan"),
    categories: ["cli"],
    placeholder: true,
  },
];

/** Deal projects out round-robin so the "All" view mixes kinds instead of grouping them. */
function interleave<T>(...groups: T[][]): T[] {
  const out: T[] = [];
  const longest = Math.max(...groups.map((g) => g.length));
  for (let i = 0; i < longest; i++) for (const g of groups) if (g[i]) out.push(g[i]);
  return out;
}

export const projects: Project[] = interleave<Project>(work, cli, personal, interleave<Project>(mobile, web3));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
