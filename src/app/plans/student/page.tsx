import { PlanFunnelPage } from "@/components/marketing/PlanFunnelPage";

export default function StudentPlanPage() {
  return (
    <PlanFunnelPage
      planId="student"
      name="MST Student Fellowship"
      subtitle="Student ID based scholarship + paid internship pathway."
      hero="For college students who want real knowledge, paid internship execution, and a portfolio that stands out in placements and interviews."
      originalPrice={24999}
      offerPrice={14999}
      discountLabel="Student Scholarship"
      seatsLeft={42}
      internshipIncluded
      fractionIncluded
      highlights={[
        "Student ID card based scholarship eligibility",
        "Paid internship track with real-world project delivery",
        "Complete curriculum access with guided milestone roadmap",
        "Portfolio, mentor feedback, and hiring-readiness support",
      ]}
      outcomes={[
        "You gain practical execution confidence before graduation",
        "You build a stronger placement profile with real projects",
        "You move from learning-only to earning-ready momentum",
      ]}
      transformation={[
        "From classroom concepts to project implementation",
        "From theory confidence to execution confidence",
        "From uncertain placement prep to structured career growth",
      ]}
      internshipTrack={[
        "Paid internship projects with weekly measurable deliverables",
        "Team-based task execution on practical blockchain use cases",
        "Mentor-reviewed output for performance improvement",
      ]}
      mentorSupport={[
        "Weekly mentor checkpoint for project and career progress",
        "Feedback on code, documentation, and communication",
        "Interview and placement guidance linked to your portfolio",
      ]}
      workflow={[
        "Verify student ID and unlock scholarship",
        "Start guided learning and milestone tracking",
        "Join paid internship project execution",
        "Build portfolio and placement-ready profile",
      ]}
      testimonials={[
        {
          name: "Riya Sharma",
          role: "Student Fellowship Intern",
          text: "I got real project exposure, mentor guidance, and paid internship confidence. My placement interviews changed completely.",
        },
        {
          name: "Kunal Jadhav",
          role: "Final Year Student",
          text: "The student discount helped me enroll, but the internship and execution discipline gave me the biggest value.",
        },
        {
          name: "Sana Khan",
          role: "Web3 Trainee",
          text: "This fellowship gave me portfolio-level proof of work. I was no longer just saying I learned blockchain, I was showing it.",
        },
      ]}
      faqs={[
        {
          q: "How do I get student discount?",
          a: "Upload a valid student ID card during registration. Once verified, the student scholarship pricing applies.",
        },
        {
          q: "Is internship included for students?",
          a: "Yes. Student Fellowship includes paid internship exposure with real project execution.",
        },
        {
          q: "Does this plan include fraction and rewards?",
          a: "Yes. Student Fellowship includes 1 fraction and daily MSTC reward-coin participation.",
        },
        {
          q: "Will I get a certificate after the internship?",
          a: "Yes, upon successful completion of the paid internship track and project deliverables, you will receive an official certificate.",
        },
        {
          q: "Can I do this along with my college studies?",
          a: "Absolutely. The milestones are flexible and designed specifically to accommodate college schedules and exams.",
        },
      ]}
    />
  );
}
