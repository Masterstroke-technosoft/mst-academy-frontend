import { PlanFunnelPage } from "@/components/marketing/PlanFunnelPage";

export default function CourseOnlyPlanPage() {
  return (
    <PlanFunnelPage
      planId="courseOnly"
      name="MST Course Access Plan"
      subtitle="Focused learning track for deep fundamentals and implementation clarity."
      hero="If your goal is strong blockchain foundations with full syllabus access, this plan gives a complete structured learning experience at a highly accessible offer price."
      originalPrice={9999}
      offerPrice={4999}
      discountLabel="Foundation Offer"
      seatsLeft={58}
      internshipIncluded={false}
      fractionIncluded={false}
      highlights={[
        "Complete course access across all modules and phases",
        "Assessment-driven learning for real understanding",
        "Structured roadmap from basics to advanced concepts",
        "Progress tracking to maintain learning consistency",
      ]}
      outcomes={[
        "You build strong conceptual clarity and confidence",
        "You complete a guided roadmap with measurable progress",
        "You prepare yourself for advanced execution opportunities",
      ]}
      transformation={[
        "From scattered tutorials to a guided curriculum path",
        "From confusion to strong foundational confidence",
        "From passive watching to active milestone learning",
      ]}
      internshipTrack={[
        "Internship is not included in this plan",
      ]}
      mentorSupport={[
        "Milestone-based guidance to maintain direction",
        "Performance insights from your assessment trends",
        "Preparation support for next-level execution tracks",
      ]}
      workflow={[
        "Enroll at foundation offer pricing",
        "Complete phase-based learning milestones",
        "Track assessments and concept confidence",
        "Advance toward higher fellowship tracks",
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
          q: "Does this plan include fraction and MSTC rewards?",
          a: "No. Fraction and long-term MSTC reward participation are included in validator, student, and working professional fellowships.",
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
