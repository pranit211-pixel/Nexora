import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'B.Tech in Artificial Intelligence',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        program: 'B.Tech in Artificial Intelligence',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#080B14] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-2">
                <span>Admissions &amp; Outreach</span>
                <span aria-hidden="true">·</span>
                <span>Campus Visits</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Connect with the NEXORA Admissions Council
              </h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-[#9BA6BC] leading-relaxed">
                Have questions regarding the Autumn 2026 admissions cycle, research fellowships, or student housing? Our academic counsellors are available Monday through Saturday.
              </p>

              <div className="mt-8 space-y-4 text-xs text-slate-600 dark:text-[#9BA6BC]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 text-[#0284C7] dark:text-[#36D9FF] shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">Campus Location</strong>
                    <span>NEXORA Innovation Campus, 100 University Parkway, Tech Cyber District, CA 94016</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 text-purple-600 dark:text-[#B46AFF] shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">Direct Telephony</strong>
                    <span>Admissions: +1 (800) 555-NEXO · Registrar: +1 (555) 019-2834</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block text-sm mb-0.5">Electronic Inquiries</strong>
                    <span>admissions@nexora.edu · info@nexora.edu</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white dark:bg-[#101629]/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-[#9BA6BC] shadow-sm">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">Campus Tour Schedules</span>
              <span>Daily guided tours of robotics research wings and computing clusters at 10:00 AM &amp; 02:30 PM.</span>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-white dark:bg-[#101629]/80 border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Submit an Admissions Inquiry
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mb-6">
                Receive the Autumn 2026 academic syllabus handbook and fee structure directly in your inbox.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 dark:text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Inquiry Dispatched Successfully</h4>
                  <p className="text-xs">
                    An admissions officer has been assigned to your request and will contact you within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Candidate Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maya Lin"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="maya.lin@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Intended Program</label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                      >
                        <option value="B.Tech in Artificial Intelligence">B.Tech in Artificial Intelligence &amp; Data Science</option>
                        <option value="B.Tech in Computer Science">B.Tech in Computer Science &amp; Engineering</option>
                        <option value="B.Tech in Electronics">B.Tech in Electronics &amp; Telecommunication</option>
                        <option value="M.Tech in Autonomous Robotics">M.Tech in Autonomous Robotics &amp; Embodied AI</option>
                        <option value="Ph.D. Fellowships">Doctor of Philosophy (Ph.D.)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Background &amp; Query</label>
                    <textarea
                      rows={4}
                      placeholder="Briefly state your academic history, examination scores, or specific inquiries..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_20px_-3px_rgba(54,217,255,0.4)] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Admissions Council</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
