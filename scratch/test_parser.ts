console.log("Starting test script...");
const { parseResumeText } = require('../backend/src/lib/openai');

async function test() {
  const dummyText = `Kunal Gwala
kunalgwala02@gmail.com
+91 9680669095
Enthusiastic and innovative Full-Stack Developer with expertise in React.js, React Native (Expo), Node.js, MongoDB, and WordPress.

Experience
Software Engineer at Google (2021 - Present)
- Worked on React and Node apps.

Education
UC Berkeley
Bachelor of Computer Science (2020)
`;

  const parsed = await parseResumeText(dummyText);
  console.log(JSON.stringify(parsed, null, 2));
}

test().catch(console.error);
