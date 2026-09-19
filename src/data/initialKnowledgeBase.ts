import { KnowledgeDocument } from '../types';

export const INITIAL_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'maa-about-01',
    title: 'About MaaProject — Mission, Vision & Core Objectives',
    category: 'about',
    summary: 'Overview of MaaProject, a dedicated public welfare initiative providing maternal healthcare, community welfare, and digital empowerment.',
    tags: ['about', 'overview', 'mission', 'vision', 'empowerment', 'maternal', 'welfare'],
    lastUpdated: '2026-08-15',
    verifiedBy: 'MaaProject Documentation & Governance Board',
    route: '/about',
    content: `MaaProject (Mother & Community Care Project) is an integrated public empowerment and welfare initiative established to deliver accessible healthcare guidance, financial welfare assistance, nutrition resources, and vocational support to families, mothers, and community members.

Core Pillars:
1. Maternal & Child Health Guidance: Comprehensive prenatal, perinatal, and postnatal healthcare advisory, vaccination reminders, and tele-consultation access.
2. Direct Social Welfare & Assistance: Structured financial grants, scholarships for girl child education, and emergency hardship relief.
3. Community Nutrition & Wellness: Supplementary nutrition kits, balanced dietary programs, and community kitchen distributions.
4. Digital Vocational Empowerment: Self-help group enablement, digital literacy programs, and livelihood training.
5. Transparent Grievance Redressal: Rapid incident resolution desk with real-time tracking.

All services provided under MaaProject are free or heavily subsidized through government partnerships and verified non-profit endowments.`
  },
  {
    id: 'maa-service-01',
    title: 'Maa Care — Maternal & Child Health Support Hub',
    category: 'service',
    summary: 'Verified healthcare support offering prenatal guidance, tele-doctor consultations, nutrition tracking, and immunization reminders.',
    tags: ['service', 'maternal', 'health', 'pregnancy', 'prenatal', 'postnatal', 'doctor', 'teleconsultation', 'vaccination'],
    lastUpdated: '2026-08-10',
    verifiedBy: 'MaaProject Medical & Healthcare Advisory Panel',
    route: '/maternal-care',
    content: `Maa Care is the flagship healthcare service of MaaProject designed to support expectant and new mothers from conception through the first 1,000 days of child development.

Key Features:
- 24/7 Maternal Health Tele-Triage: Connect with certified obstetricians, gynecologists, and pediatric nurses via audio or video call.
- Immunization & Checkup Schedule: Automated reminders for mandatory antenatal checkups (ANCs) and WHO/National immunization milestones.
- Free High-Risk Pregnancy Screening: Early identification and prioritized hospital referrals for gestational complications.
- Postpartum Mental Health & Lactation Counseling: Dedicated counseling sessions for postpartum recovery and breastfeeding guidance.

How to Access:
- Visit the Maa Care Hub at /maternal-care or call the 24/7 Helpline at 1800-11-6222.`
  },
  {
    id: 'maa-service-02',
    title: 'Maa Welfare & Direct Financial Assistance Scheme',
    category: 'service',
    summary: 'Direct beneficiary support program providing maternity benefit allowances, girl child educational grants, and emergency relief funds.',
    tags: ['service', 'welfare', 'financial', 'allowance', 'grant', 'scholarship', 'aid', 'money', 'benefit'],
    lastUpdated: '2026-08-12',
    verifiedBy: 'MaaProject Social Welfare Directorate',
    route: '/welfare-schemes',
    content: `The Maa Welfare Assistance Scheme provides structured, direct-benefit financial aid to eligible low-income families and mothers to ensure dignified healthcare and education.

Available Schemes:
1. Janani Nutrition Grant: A direct financial benefit of ₹6,000 / $100 equivalent disbursed in three tranches upon completion of registered antenatal milestones.
2. Maa Vidya Girl Child Scholarship: Annual educational grant covering school fees, books, and uniforms for daughters of registered beneficiaries.
3. Emergency Medical Welfare Relief: One-time hardship grant up to ₹25,000 for critical maternal or pediatric surgical interventions.

Eligibility Criteria:
- Must hold a valid MaaProject Family ID or government-recognized identity proof.
- Annual household income must be within the designated low-to-middle income tier.
- Complete registration on the MaaProject portal or through local Community Care Centres.`
  },
  {
    id: 'maa-service-03',
    title: 'Maa Nutrition & Community Wellness Initiative',
    category: 'service',
    summary: 'Community nutrition distribution providing fortified food packets, micro-nutrient supplements, and dietary counseling.',
    tags: ['service', 'nutrition', 'food', 'diet', 'iron', 'folic acid', 'wellness', 'supplements'],
    lastUpdated: '2026-08-01',
    verifiedBy: 'MaaProject Clinical Nutrition Team',
    route: '/services#nutrition',
    content: `The Maa Nutrition Initiative combats maternal malnutrition and anemia by distributing nutrient-dense food kits and essential supplements.

What is Provided:
- Monthly Maa Poshan Kit: Fortified grains, pulses, iodized salt, and protein mix for pregnant and lactating women.
- Essential Micronutrients: Free Iron & Folic Acid (IFA) tablets, Calcium, and Vitamin D3 supplements.
- Diet & Cooking Advisory: Culturally tailored meal planning guides prepared by certified clinical dietitians.

Distribution Channels:
- Available for monthly pickup at over 450 MaaProject Community Care Centers or home-delivered for high-risk beneficiaries.`
  },
  {
    id: 'maa-service-04',
    title: 'Maa 24/7 Emergency Care Helpline & Rapid Dispatch',
    category: 'service',
    summary: 'Round-the-clock emergency assistance line for urgent maternal complications, emergency ambulance dispatch, and crisis support.',
    tags: ['service', 'emergency', 'helpline', 'urgent', 'ambulance', 'crisis', '24/7', 'hotline'],
    lastUpdated: '2026-08-14',
    verifiedBy: 'MaaProject Emergency Response Command',
    route: '/support/contact',
    content: `MaaProject operates a dedicated, toll-free 24/7 Emergency Care Line connected directly to local hospital networks and ambulance dispatch units.

Toll-Free National Emergency Line:
- 1800-11-MAA-CARE (1800-11-6222)
- Alternative SMS/WhatsApp SOS: +91-98765-43210

When to Call:
- Sudden onset of severe abdominal pain, heavy bleeding, or fluid leakage during pregnancy.
- Sudden spike in blood pressure, severe headaches, or visual disturbances (signs of pre-eclampsia).
- Active labor onset requiring urgent transit to the nearest affiliated maternity center.
- Immediate pediatric emergencies for infants under 12 months.`
  },
  {
    id: 'maa-service-05',
    title: 'Maa Skill & Community Empowerment Workshops',
    category: 'service',
    summary: 'Vocational training, micro-enterprise incubation, digital literacy classes, and Self-Help Group (SHG) financing.',
    tags: ['service', 'skills', 'training', 'empowerment', 'jobs', 'vocational', 'workshops', 'shg'],
    lastUpdated: '2026-07-28',
    verifiedBy: 'MaaProject Empowerment Division',
    route: '/services#skills',
    content: `Maa Skill Empowerment programs equip community members, mothers, and youth with market-ready vocational skills and financial independence.

Offered Courses:
- Digital & Smartphone Literacy: Operating banking apps, portal navigation, and online safety.
- Handcrafts, Tailoring & Eco-Packaging: Sustainable artisanal production with guaranteed market linkage.
- Community Health Volunteer Certification: Training accredited community healthcare workers (Maa Mitras).
- Self-Help Group (SHG) Micro-Credit: Seed funding guidance and low-interest microloans for women entrepreneurs.`
  },
  {
    id: 'maa-guide-01',
    title: 'Guide: How to Apply for the Maa Welfare Scheme',
    category: 'guide',
    summary: 'Step-by-step instructions to successfully register and apply for MaaProject financial and maternal grants.',
    tags: ['guide', 'how-to', 'apply', 'welfare', 'steps', 'registration', 'documents'],
    lastUpdated: '2026-08-11',
    verifiedBy: 'MaaProject Operations Desk',
    route: '/welfare-schemes',
    content: `Step-by-Step Procedure to Apply for Maa Welfare Grants:

Step 1 — Create or Log into your MaaProject Account:
Visit /welfare-schemes and click 'Enroll Now' or provide your Phone Number for an OTP verification.

Step 2 — Submit Beneficiary Details:
Fill in your legal name, age, address, and current pregnancy or child registration status.

Step 3 — Upload Required Verification Documents:
- Proof of Identity (Aadhaar / National ID / Voter ID).
- Mother-Child Protection Card (MCP Card) or Doctor's Antenatal Certificate.
- Active Bank Account details (Bank Passbook copy or cancelled cheque for Direct Benefit Transfer).
- Income certificate or self-declaration where applicable.

Step 4 — Select Scheme Tranche:
Choose the specific scheme (Janani Nutrition Grant, Maa Vidya Scholarship, or Medical Relief).

Step 5 — Submit and Note Application Tracking ID:
Submit the form. You will immediately receive an SMS and on-screen Application ID (e.g. MAA-APP-92810). Processing takes 3 to 5 business days.`
  },
  {
    id: 'maa-guide-02',
    title: 'Guide: How to Book a Maternal Health Tele-Consultation',
    category: 'guide',
    summary: 'Instructions on scheduling a free tele-doctor appointment with MaaProject healthcare specialists.',
    tags: ['guide', 'how-to', 'doctor', 'appointment', 'teleconsultation', 'booking'],
    lastUpdated: '2026-08-09',
    verifiedBy: 'MaaProject Medical Team',
    route: '/maternal-care',
    content: `How to Schedule and Attend a Maa Care Tele-Consultation:

1. Navigate to the Maternal Care Portal (/maternal-care).
2. Select 'Book Tele-Consultation'.
3. Choose your specialty: General Obstetrician, Pediatrician, Clinical Dietitian, or Lactation Counselor.
4. Select your preferred date and time slot.
5. Enter your key symptoms or questions, and attach any recent lab reports if available.
6. Confirmation: You will receive a secure video/audio consultation link via SMS and in your dashboard 15 minutes before the appointment.`
  },
  {
    id: 'maa-guide-03',
    title: 'Guide: How to Report a Service Problem or Issue',
    category: 'guide',
    summary: 'Official protocol for reporting payment delays, portal errors, or care center grievances with ticket tracking.',
    tags: ['guide', 'problem', 'report', 'issue', 'ticket', 'troubleshooting', 'grievance'],
    lastUpdated: '2026-08-15',
    verifiedBy: 'MaaProject Grievance Redressal Officer',
    route: '/support/report',
    content: `Reporting Problems & Raising Support Tickets on MaaProject:

1. Open Problem Reporting:
Go to /support/report or ask Maa AI Chat to "Report a problem".

2. Provide Required Details:
- Issue Category: (e.g. Welfare Payment Delay, Portal Login Issue, Center Service Quality, Medical Record Missing).
- Detailed description of the event, including date and center name if applicable.
- Contact phone number / email for follow-up.
- Any reference IDs (e.g., Application Number or Booking ID).

3. Immediate Ticket Generation:
The system generates a unique Ticket ID (e.g., MAA-TKT-30492).

4. Service Level Agreement (SLA):
- Critical / Medical Grievances: Responded to within 4 hours.
- Standard Financial / Technical Issues: Resolved within 24–48 business hours.
- Users can check live ticket status at any time in the Support Desk.`
  },
  {
    id: 'maa-faq-01',
    title: 'MaaProject FAQ — Frequently Asked Questions',
    category: 'faq',
    summary: 'Comprehensive answers to standard questions regarding fees, eligibility, documents, centers, and privacy.',
    tags: ['faq', 'questions', 'answers', 'cost', 'free', 'eligibility', 'documents', 'privacy'],
    lastUpdated: '2026-08-14',
    verifiedBy: 'MaaProject Public Relations & Helpdesk',
    route: '/faq',
    content: `Frequently Asked Questions (FAQ):

Q1: What is MaaProject?
A: MaaProject is an integrated social impact and public health initiative providing maternal healthcare guidance, direct welfare allowances, child nutrition packages, and vocational empowerment.

Q2: Are MaaProject services free of cost?
A: Yes. All tele-consultations, health advisory, nutrition kits, and problem resolution services are 100% free for verified beneficiaries. Welfare grants are disbursed directly without any agent fees or hidden charges.

Q3: Who is eligible for MaaProject benefits?
A: Any pregnant woman, nursing mother, guardian of infants under age 5, or low-to-middle income family member residing in supported regions is eligible for services.

Q4: What documents are mandatory for registration?
A: A valid Government ID (Aadhaar / National ID / Voter ID), proof of pregnancy/birth (MCP card or medical certificate), and a bank account in the beneficiary's name.

Q5: How do I locate my nearest Maa Community Care Center?
A: Navigate to the Centre Locator at /services or ask Maa AI Chat for centers in your district.

Q6: Is my personal and health data secure?
A: Yes. MaaProject adheres to strict end-to-end data encryption, HIPAA-aligned privacy protocols, and never sells or shares beneficiary information with commercial third parties.`
  },
  {
    id: 'maa-contact-01',
    title: 'Verified Official Contact Details & Regional Centres',
    category: 'contact',
    summary: 'Official telephone numbers, emails, headquarter address, and regional hub contacts for MaaProject.',
    tags: ['contact', 'phone', 'email', 'address', 'helpline', 'support', 'hours', 'office'],
    lastUpdated: '2026-08-15',
    verifiedBy: 'MaaProject Secretariat',
    route: '/support/contact',
    content: `Verified Official MaaProject Contact Channels:

Toll-Free National Helpline:
- 1800-11-MAA-CARE (1800-11-6222) — 24 Hours / 7 Days a week

General Support & Inquiries Email:
- support@maaproject.org

Grievance & Escalation Desk Email:
- grievance@maaproject.org

Official Website & Portal:
- https://maaproject.org

Headquarters & National Secretariat:
- MaaProject National Directorate, 4th Floor, Community Welfare Bhawan, Institutional Area, New Delhi — 110001

Operating Hours:
- Emergency Helplines & Health Triage: 24/7/365
- General Administrative Helpdesk & Grievance Offices: Monday to Saturday, 8:00 AM – 8:00 PM IST (Closed on National Holidays)`
  },
  {
    id: 'maa-troubleshooting-01',
    title: 'Troubleshooting Common Portal & Service Issues',
    category: 'troubleshooting',
    summary: 'Direct solutions for OTP delays, welfare payment status delays, document re-upload errors, and appointment rescheduling.',
    tags: ['troubleshooting', 'login', 'otp', 'payment delay', 'error', 'reschedule', 'fix', 'problem'],
    lastUpdated: '2026-08-13',
    verifiedBy: 'MaaProject IT & Systems Department',
    route: '/support/report',
    content: `Troubleshooting Common Issues on MaaProject:

1. OTP Not Received during Login/Registration:
- Wait 60 seconds and click 'Resend OTP'.
- Ensure your phone is not in 'Do Not Disturb' (DND) mode blocking transactional SMS.
- Alternatively, select 'Verify via WhatsApp' or biometric login at a local Maa Mitra kiosk.

2. Welfare Payment Status Showing 'Under Verification' for > 7 days:
- Check if your Bank Account is linked with your National ID for Direct Benefit Transfer (DBT).
- Verify that your uploaded bank passbook shows a clear IFSC code and Account Number.
- If verified and still delayed, use the 'Report a Problem' button to raise an escalation ticket.

3. Rescheduling a Tele-Doctor Appointment:
- Go to /maternal-care -> 'My Appointments'.
- Click 'Reschedule' at least 2 hours before the appointment slot to select a new doctor or time.

4. Document Upload Size Limit:
- Supported formats: PDF, JPEG, PNG (Maximum 5MB per file). If your file is larger, compress before uploading.`
  }
];
