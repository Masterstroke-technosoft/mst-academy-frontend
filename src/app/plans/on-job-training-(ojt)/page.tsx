import { PlanFunnelPage } from "@/components/marketing/PlanFunnelPage";

export default function CourseOnlyPlanPage() {
  return (
    <PlanFunnelPage
      planId="courseOnly"
      name="MST On Job Training (OJT) Program"
      subtitle="LEARN. BUILD. EXPERIENCE."
      hero="Gain practical industry experience by learning through real-world projects under expert mentorship. Complete your training and earn an On Job Training (OJT) Certificate aligned with the National Education Policy (NEP) 2020."
      originalPrice={9999}
      offerPrice={4999}
      discountLabel="Foundation Offer"
      seatsLeft={58}
      internshipIncluded={false}
      fractionIncluded={false}
      highlights={[
        "Complete access to the Blockchain Developer Curriculum",
        "2 Months of On Job Training (OJT)",
        "Work on real industry-oriented projects",
        "Continuous mentor guidance throughout the program",
        "Skill-based assessments and milestone tracking",
        "OJT Certificate upon successful completion",
      ]}
      outcomes={[
        "Strong blockchain development fundamentals",
        "Practical experience through industry-oriented projects",
        "Professional workflow and project execution experience",
        "Industry-ready portfolio and practical skills",
        "NEP 2020 compliant OJT certification",
      ]}
      transformation={[
        "Learn blockchain fundamentals through a structured curriculum",
        "Apply your knowledge by working on real industry-oriented projects",
        "Build practical development experience",
        "Complete your OJT with confidence and industry exposure",
      ]}
      internshipTrack={[
        "2 Months of structured On Job Training",
        "Guided execution of real-world industry projects",
        "Weekly mentor reviews and performance feedback",
        "Practical learning in a professional development environment",
      ]}
      mentorSupport={[
        "Dedicated guidance from experienced industry mentors",
        "Regular project reviews and milestone tracking",
        "Technical doubt-solving sessions",
        "Continuous performance feedback throughout the OJT program",
      ]}
      workflow={[
        "Enroll in the OJT Program",
        "Complete the Blockchain Learning Curriculum",
        "Work on Industry-Oriented Projects with Mentor Guidance",
        "Receive Your NEP 2020 Compliant OJT Certificate",
      ]}
      testimonials={[
        {
          name: "Pratik Sinha",
          role: "Self-paced Learner",
          text: "This gave me structure and consistency. I finally completed a full blockchain roadmap instead of hopping between random resources.",
        },
        {
          name: "Aisha Nair",
          role: "Beginner to Intermediate Learner",
          text: "The pricing made it accessible, and the roadmap made it practical. My understanding improved dramatically.",
        },
        {
          name: "Dev Arora",
          role: "Tech Enthusiast",
          text: "I chose this for strong fundamentals and got exactly that. The assessment flow kept me accountable and focused.",
        },
      ]}
      faqs={[
        {
          q: "Does this plan include internship?",
          a: "No. This plan is purely course access focused for deep learning fundamentals.",
        },
        {
          q: "Does this plan include MSTC rewards?",
          a: "\long-term MSTC reward participation are included in validator, student, and Web3 Enthusiast fellowships.",
        },
        {
          q: "What is the current offer price?",
          a: "Original price is Rs 9,999 and current offer price is Rs 4,999.",
        },
        {
          q: "Can I upgrade to a fellowship later?",
          a: "Yes, you can upgrade to any of the fellowship tracks by paying the differential amount, subject to seat availability.",
        },
        {
          q: "Will I get access to the community?",
          a: "Yes, you will get access to the learner community to resolve doubts and participate in discussions.",
        },
      ]}
    />
  );
}
