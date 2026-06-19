import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: 'How does the AI resume parser work?',
      a: 'We extract the raw text content from your PDF or DOCX file, and process it with OpenAI GPT-4o under structured JSON guidelines. It automatically classifies and formats your experiences, skills, education history, and projects with high accuracy.',
    },
    {
      q: 'Can I edit the parsed details manually?',
      a: 'Yes, absolutely. Once parsed, you can navigate to the Resume Editor in your dashboard, where you can modify descriptions, add or remove skills, re-arrange projects list, and update milestones manually.',
    },
    {
      q: 'How does the Recruiter AI chatbot work?',
      a: 'When recruiters view your public portfolio, they can type questions in the chat bubble. The chatbot automatically intercepts your details (experiences, skills, projects, and summary) and injects it as context to answer their questions professionally.',
    },
    {
      q: 'Can I connect a custom domain?',
      a: 'Yes. Pro subscribers can map their custom domains (e.g. www.johndoe.com) by pointing their DNS CNAME records to our server.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 max-w-3xl mx-auto px-6 w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-display text-white">Frequently Asked Questions</h2>
        <p className="text-gray-400 mt-2 text-xs">Have questions about the generator? We have answers.</p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card key={idx} className="bg-surface/30 border-border/40 p-5 cursor-pointer flex flex-col gap-3" onClick={() => toggle(idx)}>
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} />}
              </div>
              {isOpen && (
                <p className="text-gray-400 text-xs leading-relaxed border-t border-border/40 pt-3 mt-1 whitespace-pre-wrap">
                  {faq.a}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
