-- ==============================================================================
-- NEXORA SMART COLLEGE & CAMPUS PORTAL - SUPABASE SEED DATA
-- Seed: seed.sql
-- ==============================================================================

-- Seed Departments
INSERT INTO public.departments (code, name, description, hod_name, established_year, total_intake, icon)
VALUES
('CSE', 'Computer Science & Engineering', 'Pioneering cloud computing, distributed systems, quantum algorithms, and cybersecurity.', 'Dr. Elena Vance, Ph.D. (MIT)', 2012, 180, 'Cpu'),
('AIDS', 'Artificial Intelligence & Data Science', 'Specializing in deep learning, neural architectures, LLMs, and autonomous robotics.', 'Dr. Marcus Sterling, Ph.D. (Stanford)', 2018, 120, 'BrainCircuit'),
('ECE', 'Electronics & Telecommunication', 'Advanced VLSI design, 6G communication networks, embedded IoT systems, and signal processing.', 'Dr. Rajesh Nair, Ph.D. (IIT Bombay)', 2012, 120, 'Radio'),
('MECH', 'Mechanical & Robotics Engineering', 'Mechatronics, additive manufacturing, aerospace dynamics, and renewable energy powertrains.', 'Dr. Samantha Reed, Ph.D. (ETH Zurich)', 2014, 90, 'Wrench'),
('CIVIL', 'Civil & Smart Infrastructure', 'Sustainable urban planning, seismic resilience, digital twins, and green building technologies.', 'Dr. Aris Thorne, Ph.D. (Cambridge)', 2014, 60, 'Building2')
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Notices
INSERT INTO public.notices (title, category, target_audience, content, published_by, is_pinned)
VALUES
('Autumn 2026 Mid-Semester Examination Schedule Announced', 'examination', 'all', 'The Mid-Semester Examination for all UG & PG branches commences on November 15, 2026. Hall tickets are available for download in the student portal.', 'Office of the Controller of Examinations', true),
('NEXORA Global AI & Robotics Hackathon 2026', 'events', 'all', 'Register for the 48-hour national hackathon with a prize pool of $50,000 sponsored by NVIDIA and Google. Submissions open until November 10.', 'Department of AI & Data Science', true),
('Campus Placement Drive: Google, Microsoft & Tesla', 'academic', 'students', 'Tier-1 tech placement interviews start next Monday at the Smart Auditorium. Students with CGPA >= 8.0 must upload updated resumes.', 'Director of Corporate Relations & Placements', false),
('Annual Technology Symposium & Research Expo', 'events', 'all', 'Keynote addresses by IEEE fellows and industry leaders. Paper presentations and live hardware demonstrations at Innovation Quad.', 'Academic Council', false)
ON CONFLICT DO NOTHING;
