import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Target,
  Flame,
  FileText,
  Calendar,
  Shield,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Users,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Card, { CardContent } from '../../components/ui/Card.jsx';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: 'Smart Goal Management',
      desc: 'Set goals with category badges, priorities, and timeline milestones. Track progress via status tags.',
      icon: Target,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Habit & Streak Tracker',
      desc: 'Form routines, count daily targets, and view interactive monthly heatmaps. Streaks recalculate automatically.',
      icon: Flame,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Interactive Task Calendar',
      desc: 'View weekly or monthly schedules. Goal deadlines are color-coded automatically by priority status.',
      icon: Calendar,
      color: 'bg-indigo-500/10 text-indigo-500',
    },
    {
      title: 'Quick Pinned Notes',
      desc: 'Capture ideas inside cards, add background color accents, tag notes, and query contents via search index.',
      icon: FileText,
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Product Lead, Linear',
      text: 'GoalFlow has replaced three separate productivity apps for me. The streaks recalculations are bulletproof, and the interface is lightning fast.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100',
    },
    {
      name: 'David Chen',
      role: 'Backend Engineer',
      text: 'The clean architecture and keyboard navigation feel extremely native. It looks exactly like Linear and TickTick combined, but cleaner.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100',
    },
  ];

  const faqs = [
    {
      q: 'How does the streaks tracker prevent timezone errors?',
      a: 'GoalFlow records completions in local-date strings (YYYY-MM-DD) instead of UTC date-times. This keeps your streaks mathematically correct no matter what city you travel to.',
    },
    {
      q: 'Does it support daily/weekly recurring reminders?',
      a: 'Yes. Our background scheduler processes email and in-app alerts at one-minute precision. Recurring reminders automatically reschedule to the next period.',
    },
    {
      q: 'Can I create custom category dashboards?',
      a: 'Absolutely. You can customize icons and color codes, filter dashboards by categories, and track progress individually.',
    },
  ];

  return (
    <div className="min-h-screen bg-slateBg-light text-slate-800 transition-colors font-sans overflow-x-hidden">
      {/* 1. Header Navbar */}
      <nav className="fixed top-0 inset-x-0 bg-white/70 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-xl text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GoalFlow
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Why GoalFlow</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>

          {/* Mobile Hamburguer */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-600">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3 flex flex-col text-sm font-semibold">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600 hover:text-primary">Features</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600 hover:text-primary">Why GoalFlow</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600 hover:text-primary">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600 hover:text-primary">FAQ</a>
            <hr className="border-slate-100" />
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600">
              Sign In
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Get Started Free</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mx-auto">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Meet your new habits engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none max-w-3xl mx-auto">
            Smart Daily Goal Tracker <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Built for High-Performers
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            GoalFlow combines daily tracking schedules, habit streaks, markdown notes, and advanced aggregations into a single, cohesive canvas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Tracking Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Hero Interactive App Mock Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 rounded-2xl border border-slate-200 overflow-hidden shadow-2xl bg-white p-2 max-w-5xl mx-auto"
        >
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=600"
            alt="GoalFlow Dashboard Preview"
            className="rounded-xl w-full object-cover border border-slate-100"
          />
        </motion.div>
      </section>

      {/* 3. Features Grid Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Designed to help you build streaks
            </h2>
            <p className="text-slate-500 font-medium">
              Every detail is engineered to feel responsive, from dynamic heatmaps to full-text notes indexing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <Card key={index} className="text-left flex flex-col justify-between" hoverEffect>
                  <CardContent className="space-y-4">
                    <div className={`p-3 rounded-2xl inline-block ${feat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight">{feat.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500">{feat.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section id="testimonials" className="py-20 max-w-7xl mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
            <Users className="h-3.5 w-3.5" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Trusted by active planners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((test, index) => (
            <Card key={index} className="text-left bg-slate-50/50">
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm italic leading-relaxed">"{test.text}"</p>
                <div className="flex items-center space-x-3 pt-2">
                  <img src={test.avatar} alt={test.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{test.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{test.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 font-medium">Free forever, with a Premium upgrade for advanced power-users.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Tier */}
            <Card className="text-left border-slate-200">
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">GoalFlow Standard</h3>
                  <p className="text-xs text-slate-400">Perfect for daily habit tracking</p>
                </div>
                <div className="text-3xl font-black text-slate-900">
                  $0 <span className="text-xs text-slate-400 font-medium">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-500 font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>Up to 10 Active Goals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>Daily Habit completions log</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>In-App alerts & Reminders</span>
                  </li>
                </ul>
                <Link to="/register" className="block">
                  <Button variant="outline" className="w-full">Sign Up Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="text-left border-primary/30 bg-white relative">
              <div className="absolute top-3 right-3 bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                Popular
              </div>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">GoalFlow Premium</h3>
                  <p className="text-xs text-slate-400">For productivity experts</p>
                </div>
                <div className="text-3xl font-black text-slate-900">
                  $5 <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-500 font-medium">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Unlimited Active & Archived Goals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Instant email reminder schedules</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Productivity analytics, graphs, & reports</span>
                  </li>
                </ul>
                <Link to="/register" className="block">
                  <Button className="w-full">Get Premium Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const active = activeFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-800 hover:bg-slate-50 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${active ? 'transform rotate-180' : ''}`} />
                </button>
                {active && (
                  <div className="p-5 pt-0 text-xs leading-relaxed text-slate-500 border-t border-slate-50 bg-slate-50/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Call To Action Footer */}
      <section className="py-20 text-center bg-gradient-to-r from-primary/95 to-secondary/95 text-white">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
            Ready to track your goals, smart way?
          </h2>
          <p className="text-sm text-white/80 max-w-lg mx-auto font-medium">
            Join thousands of professionals organizing tasks, completing schedules, and building streaks today.
          </p>
          <Link to="/register" className="inline-block pt-2">
            <Button size="lg" variant="success" className="shadow-lg">
              Create Free Account Now
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center border-t border-slate-800 text-xs">
        <p>© 2026 GoalFlow Inc. Created with clean architecture principles. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
