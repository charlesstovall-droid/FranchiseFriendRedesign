export type FollowUpHint = {
  reason: string;
  question: string;
};

const PASSIVE = /\b(passive|absentee|hands[- ]off|set it and forget|mailbox money)\b/i;
const HIGH_SALARY = /\b(replace (my |our )?(salary|income)|keep (my |our )?income|six figures? immediately|same paycheck|current (pay|salary))\b/i;
const UNINVOLVED_SPOUSE = /\b(spouse|husband|wife|partner).{0,40}\b(not (sure|involved|on board)|uninvolved|against|hesitant|doesn'?t (know|care|want))\b/i;
const DISLIKE_SALES = /\b(hate|dislike|don'?t (like|want)|not (a |good at ))\b.{0,20}\bsales?\b|\bno sales\b/i;

export function detectFollowUpHints(text: string, priorHints: string[] = []): FollowUpHint[] {
  const hints: FollowUpHint[] = [];
  const used = new Set(priorHints);

  const add = (reason: string, question: string) => {
    if (used.has(reason)) return;
    hints.push({ reason, question });
  };

  if (PASSIVE.test(text)) {
    add(
      "passive_income",
      "Passive ownership usually requires either substantial capital, experienced management or both. How involved could you realistically be during the first 12 months?",
    );
  }
  if (HIGH_SALARY.test(text)) {
    add(
      "replace_salary",
      "How long could you comfortably operate before the business needed to replace your current income?",
    );
  }
  if (UNINVOLVED_SPOUSE.test(text)) {
    add(
      "uninvolved_spouse",
      "How involved is your spouse or partner in this decision, and what concerns would they want addressed before you moved forward?",
    );
  }
  if (DISLIKE_SALES.test(text)) {
    add(
      "dislike_sales",
      "When you say you dislike sales, do you mean cold prospecting, asking for the business, networking or managing people who sell?",
    );
  }

  return hints;
}

export function detectFinancialChapter(text: string): boolean {
  return /\b(capital|invest|liquidity|liquid|savings|401k|loan|sba|budget|how much)\b/i.test(text);
}
