import { PlanFunnelPage } from "@/components/marketing/PlanFunnelPage";

export default function WorkingProfessionalPlanPage() {
  return (
    <PlanFunnelPage
      planId="normal"
      name="MST Working Professional Fellowship"
      subtitle="Career transition track with paid internship and mentor execution."
      hero="Designed for working professionals who want a high-confidence transition into blockchain with real project outcomes, internship execution, and mentor-led direction."
      originalPrice={24999}
      offerPrice={19999}
      discountLabel="Career Transition Offer"
      seatsLeft={33}
      internshipIncluded
      fractionIncluded
      highlights={[
        "Structured transition roadmap built for busy professionals",
        "Paid internship-aligned project execution pathway",
        "Weekly mentor review for implementation and career strategy",
        "End-to-end curriculum with practical deployment focus",
      ]}
      outcomes={[
        "You reduce career-switch risk with guided implementation",
        "You create real artifacts that improve interview outcomes",
        "You become role-ready through measurable execution",
      ]}
      transformation={[
        "From role stagnation to high-growth blockchain trajectory",
        "From passive upskilling to measurable project output",
        "From uncertainty to transition-ready confidence",
      ]}
      internshipTrack={[
        "Paid internship-style execution with practical weekly milestones",
        "Production-minded project tasks with feedback loops",
        "Portfolio artifacts that support role transition conversations",
      ]}
      mentorSupport={[
        "Personalized career direction and execution feedback",
        "Hands-on support for architecture and implementation quality",
        "Interview positioning based on your actual delivered work",
      ]}
      workflow={[
        "Pick transition goal and baseline your skills",
        "Follow mentor-guided high-impact roadmap",
        "Execute paid internship-style project sprints",
        "Convert outputs into role-switch portfolio proof",
      ]}
      testimonials={[
        {
          name: "Nitesh Verma",
          role: "Software Professional",
          text: "I wanted a serious transition plan, not random videos. This gave me structure, real projects, and mentorship that moved me forward quickly.",
        },
        {
          name: "Shruti Rao",
          role: "Product Analyst",
          text: "The internship-style execution gave me credibility. I can now show real work and discuss implementation with confidence.",
        },
        {
          name: "Rohan Mehta",
          role: "Career Switch Learner",
          text: "This track balanced my job and upskilling without compromise. The outcomes are practical and career-relevant.",
        },
      ]}
      faqs={[
        {
          q: "Is internship included for working professionals?",
          a: "Yes. This plan includes paid internship-aligned practical execution.",
        },
        {
          q: "What is the discounted price?",
          a: "Original price is Rs 24,999 and current offer price is Rs 19,999.",
        },
        {
          q: "Will I get fraction and MSTC rewards?",
          a: "Yes. This plan includes 1 fraction and daily MSTC reward-coin participation.",
        },
        {
          q: "How much time do I need to commit weekly?",
          a: "We recommend dedicating 8-10 hours per week for learning and practical execution to stay on track.",
        },
        {
          q: "Will this help me switch to a Web3 role?",
          a: "Yes, the curriculum and project deliverables are structured precisely to build a portfolio for a career transition into blockchain.",
        },
      ]}
    />
  );
}
