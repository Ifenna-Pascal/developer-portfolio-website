export const experience = [
  {
    company: "Brydge",
    role: "Senior Full Stack Engineer",
    period: "Jan 2026 – Present",
    location: "Remote · Lagos",
    current: true,
    points: [
      "Architected a Go + PostgreSQL escrow system that makes Brydge a trusted third party in cross-border African trade, securely holding over ₦15M.",
      "Built invoicing and payments from invoice creation to settlement with Next.js and Go REST APIs, onboarding 200+ merchants.",
      "Used Redis for caching and background processing and containerised services with Docker.",
    ],
  },
  {
    company: "Mallgrid",
    role: "Senior Full Stack Engineer",
    period: "May 2025 – Present",
    location: "Lagos",
    current: true,
    points: [
      "Built a multi-store e-commerce platform with Next.js and NestJS + MongoDB, powering 50+ merchant stores.",
      "Integrated Paystack checkout, bank verification and automated payouts, processing over ₦2M.",
      "Shipped Telegram and WhatsApp automation, push notifications and Redis/Bull jobs for real-time order updates.",
    ],
  },
  {
    company: "Tranzakt Finance",
    role: "Senior Frontend Engineer",
    period: "Jun 2024 – Dec 2025",
    location: "Lagos",
    points: [
      "Designed a card, bank and bill payment gateway with real-time SignalR updates, growing transaction volume 2.3× in one quarter.",
      "Built offline-capable PWA features that improved mobile performance by 50% and active mobile users by 1.5×.",
      "Automated unit, integration and E2E testing to 100% coverage on critical modules, cutting production bugs by 60%.",
    ],
  },
  {
    company: "Smart Gwei Tech",
    role: "Blockchain Engineer",
    period: "Jan 2023 – May 2024",
    location: "Shanghai, China",
    points: [
      "Developed the Nebula Protocol DeFi dashboard (staking, yield farming, liquidity pools) with Next.js and Wagmi, doubling engagement.",
      "Built a tiered referral rewards system that grew new user onboarding by 40% in 3 months.",
      "Cut transaction failures by 35% through better contract interaction logic and gas estimation.",
    ],
  },
  {
    company: "Genesys Tech Hub",
    role: "Software Engineer",
    period: "Sep 2021 – Jul 2022",
    location: "Enugu",
    points: [
      "Delivered 9mobile's e-commerce and payout platform for 50,000+ users.",
      "Built donation scheduling for Genesys Foundation, lifting successful donations 25% month over month.",
      "Mentored 30+ interns through the Learnable Program with live code reviews and pair programming.",
    ],
  },
  {
    company: "Nestcoin",
    url: "https://nestcoin.com/",
    role: "Blockchain Developer Intern",
    period: "Sep 2021 – May 2022",
    location: "Lagos",
    points: [
      "Worked in a team as a Solidity developer on a decentralised app for listing and buying real estate projects with stablecoins.",
      "Integrated a savings vault so buyers could pay for property in instalments.",
    ],
  },
];

export const services = [
  {
    id: "frontend",
    title: "Frontend engineering",
    shape: "globe",
    desc: "Fast, accessible interfaces in React and Next.js, from design systems to offline-ready PWAs and real-time dashboards.",
    tags: ["React", "Next.js", "TypeScript", "PWA"],
  },
  {
    id: "backend",
    title: "Backend and APIs",
    shape: "stack",
    desc: "Reliable services in Go, Node.js and NestJS with PostgreSQL, MongoDB, Redis queues and Docker deployments.",
    tags: ["Go", "NestJS", "PostgreSQL", "Redis"],
  },
  {
    id: "payments",
    title: "Payments and fintech",
    shape: "ring",
    desc: "Escrow, invoicing, payouts and gateways: money flows that are correct, auditable and fast.",
    tags: ["Paystack", "Escrow", "Payouts", "SignalR"],
  },
  {
    id: "web3",
    title: "Web3 and dApps",
    shape: "chain",
    desc: "DeFi dashboards and smart contract integrations on Ethereum and Polygon with Wagmi and Ethers.",
    tags: ["Wagmi", "Ethers.js", "Polygon", "DeFi"],
  },
] as const;

export const process = [
  {
    n: "01",
    title: "Discover",
    shape: "scatter",
    desc: "I dig into the business, the users and the money flow before writing code. The goal is to understand what success looks like.",
  },
  {
    n: "02",
    title: "Design",
    shape: "grid",
    desc: "Architecture, data models and interfaces get mapped out, so the hard decisions happen on paper, not in production.",
  },
  {
    n: "03",
    title: "Build",
    shape: "stack",
    desc: "Small, tested increments with CI from day one. You see working software every week, not a big reveal at the end.",
  },
  {
    n: "04",
    title: "Ship",
    shape: "chain",
    desc: "Launch, monitor and iterate. I stay on to measure what moved and tune what didn't.",
  },
] as const;

export type StackGroup = "Frontend" | "Backend" | "Data" | "DevOps" | "Web3" | "Tools";

export const stack: { name: string; group: StackGroup; note: string }[] = [
  { name: "React", group: "Frontend", note: "5+ yrs · every product I've shipped" },
  { name: "Next.js", group: "Frontend", note: "Brydge, Mallgrid, Tranzakt" },
  { name: "TypeScript", group: "Frontend", note: "Default for everything" },
  { name: "Tailwind", group: "Frontend", note: "Design systems at speed" },
  { name: "Three.js", group: "Frontend", note: "This site" },
  { name: "Go", group: "Backend", note: "Brydge escrow + payments APIs" },
  { name: "Node.js", group: "Backend", note: "APIs, workers, real-time" },
  { name: "NestJS", group: "Backend", note: "Mallgrid backend" },
  { name: "GraphQL", group: "Backend", note: "REST and GraphQL APIs" },
  { name: "gRPC", group: "Backend", note: "Service-to-service" },
  { name: "SignalR", group: "Backend", note: "Live payment status" },
  { name: "Kafka", group: "Backend", note: "Event streaming between services" },
  { name: "RabbitMQ", group: "Backend", note: "Message queues and background jobs" },
  { name: "PostgreSQL", group: "Data", note: "Ledgers and escrow" },
  { name: "MongoDB", group: "Data", note: "Multi-store catalogues" },
  { name: "Redis", group: "Data", note: "Caching + Bull queues" },
  { name: "Prisma", group: "Data", note: "Typed data access" },
  { name: "Docker", group: "DevOps", note: "Containerised services" },
  { name: "AWS", group: "DevOps", note: "Cloud deployment" },
  { name: "CI/CD", group: "DevOps", note: "GitHub Actions" },
  { name: "Kubernetes", group: "DevOps", note: "Container orchestration" },
  { name: "Terraform", group: "DevOps", note: "Infrastructure as code" },
  { name: "Jest", group: "Tools", note: "100% coverage on critical paths" },
  { name: "Cypress", group: "Tools", note: "End-to-end testing" },
  { name: "Figma", group: "Tools", note: "Design hand-off" },
  { name: "Wagmi", group: "Web3", note: "Nebula Protocol dashboard" },
  { name: "Ethers.js", group: "Web3", note: "Contract integrations" },
  { name: "Polygon", group: "Web3", note: "Smart contract integration" },
  { name: "Paystack", group: "Backend", note: "Checkout, payouts, verification" },
];
