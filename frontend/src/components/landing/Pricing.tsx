import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Check } from 'lucide-react';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Free Starter',
      price: '$0',
      description: 'Perfect for freshers and career starters exploring options.',
      features: [
        '1 Active parsed resume limit',
        '3 Basic templates (Clean, Modern, SaaS)',
        'Public shareable portfolio link',
        'Standard contact message box',
      ],
      btnText: 'Get Started Free',
      isPremium: false,
    },
    {
      name: 'Professional Pro',
      price: '$12',
      description: 'Ideal for engineers, PMs, and senior professionals seeking jobs.',
      features: [
        'Unlimited resumes & manual edit sections',
        'All 10 templates (Apple, Glass, Cyberpunk)',
        'AI Recruiter Chat widget enabled',
        'Detailed GeoIP view analytics & metrics',
        'Custom Domain connection support',
        'Priority email support assistance',
      ],
      btnText: 'Upgrade to Pro',
      isPremium: true,
    },
  ];

  return (
    <section className="py-20 bg-[#0C0C0C]/50 border-t border-border/40 w-full">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-display text-white">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Choose the plan that matches your current career search goals. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <Card key={idx} className={`bg-[#111827]/30 border-border/40 p-8 flex flex-col justify-between gap-8 ${plan.isPremium ? 'border-primary ring-2 ring-primary/10' : ''}`}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {plan.isPremium && <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">POPULAR</span>}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-500 text-xs font-semibold">/month</span>
                </div>
                <p className="text-gray-400 text-xs leading-normal">{plan.description}</p>
                <div className="h-px bg-border/40 my-2" />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-xs text-gray-300 font-medium">
                      <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/register" className="w-full">
                <Button variant={plan.isPremium ? 'primary' : 'outline'} fullWidth>
                  {plan.btnText}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
