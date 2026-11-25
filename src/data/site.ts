export const profile = {
  name: "Monanu Ifenna",
  firstName: "Monanu",
  lastName: "Ifenna",
  title: "Senior Full Stack Engineer",
  focus: ["Payments", "Fintech", "Web3"],
  location: "Lagos, Nigeria",
  email: "ifennamonanu70@gmail.com",
  resume: "/resume.pdf",
  photo: "/pics.jpg",
  availability: ["Freelance", "Full-time", "Contract"],
  intro:
    "I build fast, reliable payment, fintech and e-commerce products end to end, from React and Next.js interfaces to Go, Node.js and NestJS services.",
  bio: "Senior Full Stack Engineer with 5+ years of experience building payment, fintech and e-commerce products end to end. From React and Next.js interfaces to Go, Node.js and NestJS services backed by PostgreSQL, MongoDB and Redis, I've built platforms used by thousands and shipped improvements that directly increased engagement and revenue.",
};

export const socials = [
  { label: "Email", href: `mailto:${profile.email}`, handle: profile.email },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ifennamonanu", handle: "in/ifennamonanu" },
  { label: "GitHub", href: "https://github.com/Ifenna-Pascal", handle: "Ifenna-Pascal" },
];

export const stats = [
  { value: 5, prefix: "", suffix: "+", label: "Years shipping production software" },
  { value: 15, prefix: "₦", suffix: "M+", label: "Held in escrow on Brydge" },
  { value: 200, prefix: "", suffix: "+", label: "Merchants onboarded" },
  { value: 50, prefix: "", suffix: "k+", label: "Users on 9mobile commerce" },
  { value: 2.3, prefix: "", suffix: "×", label: "Transaction volume growth at Tranzakt", decimals: 1 },
  { value: 30, prefix: "", suffix: "+", label: "Engineering interns mentored" },
];

export const certificates = [
  { name: "Meta Frontend Developer Certification", year: "2024" },
  { name: "IBM Frontend Developer Professional Certificate", year: "2025" },
];

export const education = {
  degree: "B.Eng. Computer Engineering",
  school: "Enugu State University of Science & Technology",
  year: "2022",
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Services", href: "#services" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
