//
// PUBLIC_INTERFACE
// Demo content for public pages: overview text, pricing plans, trainers, and weekly schedule.
//
export const overviewContent = {
  title: "About Gym Manager",
  intro:
    "Gym Manager is a modern fitness companion designed to help you stay consistent, track your progress, and connect with experienced trainers. Built with an Ocean Professional theme for a focused and clean experience.",
  benefits: [
    "Structured training plans for all levels",
    "Access to certified trainers with specialty programs",
    "Clear progress tracking and membership management",
    "Mobile-friendly design for workouts on-the-go",
  ],
  howItWorks: [
    "Explore memberships to find a plan that fits your goals.",
    "Browse trainers and discover specialties like strength, conditioning, or mobility.",
    "Follow your weekly schedule and track your improvements.",
    "Sign in to enroll, purchase, and unlock full features.",
  ],
};

export const pricingPlans = [
  { id: "plan_1m", name: "1 Month", priceUSD: 29, interval: "monthly", months: 1 },
  { id: "plan_3m", name: "3 Months", priceUSD: 79, interval: "quarterly", months: 3 },
  { id: "plan_6m", name: "6 Months", priceUSD: 149, interval: "semiannual", months: 6 },
  { id: "plan_12m", name: "12 Months", priceUSD: 279, interval: "annual", months: 12 },
];

// Three demo trainers with tasteful placeholders
export const trainers = [
  {
    id: "t1",
    name: "Alex Carter",
    gender: "Male",
    yearsOfExperience: 8,
    specialties: ["Strength Training", "Hypertrophy"],
    photo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=60",
    bio: "Alex focuses on intelligent strength programming and progressive overload to build size and resilience.",
  },
  {
    id: "t2",
    name: "Jordan Lee",
    gender: "Female",
    yearsOfExperience: 6,
    specialties: ["Mobility", "Conditioning"],
    photo: "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?auto=format&fit=crop&w=400&q=60",
    bio: "Jordan designs efficient sessions for busy lifestyles, integrating mobility and cardio for balanced fitness.",
  },
  {
    id: "t3",
    name: "Miguel Santos",
    gender: "Male",
    yearsOfExperience: 10,
    specialties: ["Powerlifting", "Technique"],
    photo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=60",
    bio: "Miguel emphasizes perfect form and periodization to build sustainable strength and reduce injury risk.",
  },
];

export const weeklySchedule = [
  { day: "Monday",     focus: "Full-Body Strength (Beginner)", details: "Compound lifts + light accessories, 45–60 min" },
  { day: "Tuesday",    focus: "Cardio + Core",                 details: "Low-impact cardio 25–35 min, core circuit" },
  { day: "Wednesday",  focus: "Upper Body Technique",          details: "Push/Pull technique practice, mobility" },
  { day: "Thursday",   focus: "Active Recovery",               details: "Walk, mobility flow, breathing, 20–30 min" },
  { day: "Friday",     focus: "Lower Body Strength",           details: "Squat pattern + posterior chain accessories" },
  { day: "Saturday",   focus: "Conditioning & Stretch",        details: "Intervals 15–20 min, full-body stretch" },
  { day: "Sunday",     focus: "Rest",                          details: "Light walk optional. Hydrate. Sleep early." },
];
