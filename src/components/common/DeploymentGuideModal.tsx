import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Terminal, Shield, Sparkles, BookOpen } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envSample = `# Supabase Free Tier Environment Variables
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-[#101629] border border-[#36D9FF]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B46AFF]/10 text-[#B46AFF] border border-[#B46AFF]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Free-Tier Production Deployment Guide</h3>
              <p className="text-xs text-[#9BA6BC]">Vercel / Netlify Frontend + Supabase PostgreSQL &amp; Auth (100% Free)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9BA6BC] hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#9BA6BC]">
          {/* Overview */}
          <div className="p-4 rounded-xl bg-[#080B14] border border-slate-800">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#36D9FF]" />
              Architecture &amp; Free Tier Overview
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              NEXORA is engineered to run seamlessly on the <strong>Supabase Free Plan</strong> (500MB PostgreSQL database, 50,000 monthly active auth users, 1GB file storage) paired with <strong>Vercel Hobby</strong> or <strong>Netlify Free</strong> (100GB bandwidth, automated continuous deployments from GitHub).
            </p>
          </div>

          {/* 15 Steps Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Step-by-Step Deployment Roadmap
            </h4>

            {/* Step 1 & 2 */}
            <div className="p-4 rounded-xl bg-[#080B14]/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[#36D9FF]">Step 1 &amp; 2: Export Code from AI Studio to Git</span>
              <p className="text-xs text-slate-300">
                1. In AI Studio, click on the download or Git sync option to clone the repository onto your local workstation.<br />
                2. Unpack the files into your project folder. The project root contains standard Vite, Tailwind CSS, TypeScript, and Supabase migrations.
              </p>
            </div>

            {/* Step 3, 4, 5 */}
            <div className="p-4 rounded-xl bg-[#080B14]/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[#36D9FF]">Step 3, 4 &amp; 5: Setup Supabase Database &amp; Run Migrations</span>
              <p className="text-xs text-slate-300">
                1. Visit <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#36D9FF] underline">supabase.com</a> and create a free account.<br />
                2. Click <strong>"New Project"</strong>, assign name <code className="text-[#36D9FF]">nexora-portal</code> and choose your preferred cloud region.<br />
                3. Once provisioned (~2 minutes), open the <strong>SQL Editor</strong> on the left sidebar.<br />
                4. Open the file <code className="text-[#36D9FF]">supabase/migrations/20261031_init_nexora_schema.sql</code> from this repository, copy its contents, paste it into the Supabase SQL Editor, and click <strong>"Run"</strong>.<br />
                5. Optionally paste and run <code className="text-[#36D9FF]">supabase/seed.sql</code> to pre-populate sample departments and academic notices.
              </p>
            </div>

            {/* Step 6, 7, 8 */}
            <div className="p-4 rounded-xl bg-[#080B14]/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[#36D9FF]">Step 6, 7 &amp; 8: Authentication, Storage &amp; Row Level Security (RLS)</span>
              <p className="text-xs text-slate-300">
                1. <strong>Authentication:</strong> In Supabase Dashboard &gt; Authentication &gt; Providers, ensure "Email" is enabled. Disable "Confirm email" if you wish to allow instant student sign-ins without email verification delays.<br />
                2. <strong>Storage Buckets:</strong> In Storage &gt; Create new buckets:
                <code className="text-[#36D9FF] ml-1">profile-photos</code>,
                <code className="text-[#36D9FF] ml-1">study-materials</code>,
                <code className="text-[#36D9FF] ml-1">assignments</code>,
                <code className="text-[#36D9FF] ml-1">college-gallery</code>.<br />
                3. <strong>RLS Policies:</strong> The SQL migration script automatically enables RLS on all 8 core tables with role-enforced access checks.
              </p>
            </div>

            {/* Step 9, 10, 11 */}
            <div className="p-4 rounded-xl bg-[#080B14]/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#36D9FF]">Step 9, 10 &amp; 11: Get Credentials &amp; Environment Variables</span>
                <button
                  onClick={() => copyToClipboard(envSample, 'env')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy .env</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                Go to Supabase <strong>Project Settings &gt; API</strong>:
                Find <strong>Project URL</strong> and <strong>Project API Keys (anon public)</strong>.
              </p>
              <pre className="p-2.5 bg-[#080B14] rounded-lg text-xs font-mono text-[#36D9FF] overflow-x-auto border border-slate-800">
                {envSample}
              </pre>
            </div>

            {/* Step 12, 13, 14, 15 */}
            <div className="p-4 rounded-xl bg-[#080B14]/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[#36D9FF]">Step 12 to 15: Push to GitHub &amp; Deploy on Vercel</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. Push your repository to GitHub:<br />
                <code className="text-[#36D9FF] font-mono text-xs block my-1">
                  git init &amp;&amp; git add . &amp;&amp; git commit -m "feat: initial nexora release" &amp;&amp; git push
                </code>
                2. Log into <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#36D9FF] underline">vercel.com</a>, click <strong>"Add New Project"</strong>, and import your GitHub repository.<br />
                3. Under <strong>Environment Variables</strong>, add <code className="text-[#36D9FF]">VITE_SUPABASE_URL</code> and <code className="text-[#36D9FF]">VITE_SUPABASE_ANON_KEY</code>.<br />
                4. Click <strong>Deploy</strong>. Vercel will run <code className="text-[#36D9FF]">npm run build</code> and provide an SSL-secured live production URL within 45 seconds.<br />
                5. Verify user signups, student dashboard views, faculty attendance marking, and administrator audits on your live domain!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#080B14]/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-[#9BA6BC] flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Zero secret keys exposed on client side</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
