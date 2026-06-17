const monthYearPattern = '(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s+|\\b\\d{1,2}\\/\\s*)?(?:19|20)\\d{2}';
const rangeRegex = new RegExp(`(${monthYearPattern})\\s*[-–—]\\s*(present|current|${monthYearPattern})`, 'i');

console.log("Test 1 (Apr 2025 – Sep 2025):", rangeRegex.test("Apr 2025 – Sep 2025"));
console.log("Test 2 (Sep 2025 – Present):", rangeRegex.test("Sep 2025 – Present"));
console.log("Test 3 (Apr 2025 \\n – Sep 2025):", rangeRegex.test("Apr 2025 \n – Sep 2025"));

const match1 = "Apr 2025 – Sep 2025".match(rangeRegex);
if (match1) {
  console.log("Match 1 details:");
  console.log("Full match:", match1[0]);
  console.log("Start:", match1[1]);
  console.log("End:", match1[2]);
}

const match2 = "Sep 2025 – Present".match(rangeRegex);
if (match2) {
  console.log("Match 2 details:");
  console.log("Full match:", match2[0]);
  console.log("Start:", match2[1]);
  console.log("End:", match2[2]);
}
