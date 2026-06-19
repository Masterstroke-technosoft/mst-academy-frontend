import { PlanFunnelPage } from "@/components/marketing/PlanFunnelPage";

export default function ValidatorPlanPage() {
  return (
    <PlanFunnelPage
      planId="validator"
      name="MST Validator Fellowship"
      subtitle="Dedicated validator portal + stakeholder journey in MST Blockchain."
      hero="Built for serious builders who want ownership, on-chain credibility, and long-term reward alignment through MST ecosystem participation."
      originalPrice={14999}
      offerPrice={9999}
      discountLabel="Validator Launch Discount"
      seatsLeft={27}
      internshipIncluded={false}
      fractionIncluded
      validatorPortalAccess
      highlights={[
        "Dedicated validator portal with guided activation path",
        "Stakeholder positioning inside MST Blockchain ecosystem",
        "Full structured curriculum access from fundamentals to capstone",
        "Leadership-level accountability and performance tracking",
      ]}
      outcomes={[
        "You build high-trust credibility through execution and consistency",
        "You transition from learner to protocol-level contributor",
        "You unlock long-term compounding value from ecosystem participation",
      ]}
      transformation={[
        "From passive learner to active ecosystem stakeholder",
        "From concept-level understanding to real deployment confidence",
        "From uncertainty to a long-term blockchain growth path",
      ]}
      internshipTrack={[
        "Validator fellowship does not include internship track",
      ]}
      mentorSupport={[
        "Weekly strategic sessions on validator responsibilities",
        "Architecture-level reviews for long-term system thinking",
        "Ecosystem guidance to maximize your stakeholder impact",
      ]}
      workflow={[
        "Enroll and activate validator onboarding",
        "Complete stakeholder learning milestones",
        "Submit validator portal checkpoints",
        "Unlock long-term reward participation",
      ]}
      testimonials={[
        {
          name: "Aaryan Patil",
          role: "Validator Fellowship Learner",
          text: "I joined for deep technical growth, but the biggest change was clarity. The portal, mentor reviews, and reward structure gave me a long-term roadmap.",
        },
        {
          name: "Mehul Shah",
          role: "Blockchain Engineer",
          text: "This was not generic learning. I got stakeholder-level exposure and real confidence in how production blockchain systems evolve.",
        },
        {
          name: "Tanvi Kulkarni",
          role: "Protocol Contributor",
          text: "The curriculum + validator pathway gave me execution discipline and direction. I now contribute with far more confidence.",
        },
      ]}
      faqs={[
        {
          q: "Does validator plan include internship?",
          a: "No. Validator Fellowship is a dedicated stakeholder and portal track. It is designed for ownership and ecosystem alignment rather than internship execution.",
        },
        {
          q: "Will I receive fraction and MSTC rewards?",
          a: "Yes. Validator plan includes 1 fraction with daily MSTC reward-coin participation.",
        },
        {
          q: "Who should choose this plan?",
          a: "Learners who want long-term protocol involvement, leadership-level growth, and stakeholder positioning in MST Blockchain.",
        },
        {
          q: "What is the validator portal?",
          a: "It is a dedicated dashboard where you can manage your stakeholder journey, track milestones, and view ecosystem participation.",
        },
        {
          q: "Is there any coding required for this plan?",
          a: "Yes, you will need to complete technical milestones and architectural reviews to progress as a stakeholder.",
        },
      ]}
    />
  );
}
