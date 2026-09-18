import { describe, it, expect } from "vitest";
import { generateWeekPlan } from "@/lib/leads/week-plan";

describe("generateWeekPlan", () => {
  it("inkluderer kun oppgaver det faktisk er grunnlag for", () => {
    const plan = generateWeekPlan({
      newLeadsCount: 0,
      approvedSuggestionsWithoutDraft: 0,
      approvedEmailDraftsReadyToSend: 0,
      assessmentsAwaitingReport: 0,
      bookingsWithoutConfirmedTime: 0,
    });
    // Kun den faste fredagsrutinen skal være med
    expect(plan.length).toBe(1);
    expect(plan[0].day).toBe("Fredag");
  });

  it("legger til oppfølging av nye leads på mandag", () => {
    const plan = generateWeekPlan({
      newLeadsCount: 3,
      approvedSuggestionsWithoutDraft: 0,
      approvedEmailDraftsReadyToSend: 0,
      assessmentsAwaitingReport: 0,
      bookingsWithoutConfirmedTime: 0,
    });
    const mandagsoppgave = plan.find((i) => i.day === "Mandag");
    expect(mandagsoppgave?.task).toContain("3 nye leads");
  });

  it("foreslår utsendelse av godkjente e-poster på onsdag", () => {
    const plan = generateWeekPlan({
      newLeadsCount: 0,
      approvedSuggestionsWithoutDraft: 0,
      approvedEmailDraftsReadyToSend: 2,
      assessmentsAwaitingReport: 0,
      bookingsWithoutConfirmedTime: 0,
    });
    const onsdagsoppgave = plan.find((i) => i.day === "Onsdag");
    expect(onsdagsoppgave?.task).toContain("2 godkjente e-poster");
  });
});
