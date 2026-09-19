import { ConversationFlowScenario } from '../types';

export const CONVERSATION_FLOW_SCENARIOS: ConversationFlowScenario[] = [
  {
    id: 'flow-01',
    title: 'Flow 1: General MaaProject Information',
    category: 'Project Discovery',
    description: 'New user asks about the background, mission, and objectives of MaaProject.',
    userGoal: 'Understand what MaaProject is and who it supports.',
    steps: [
      {
        sender: 'user',
        message: 'Hello, can you tell me what MaaProject is all about?',
        note: 'Initial inquiry about the platform identity.'
      },
      {
        sender: 'bot',
        message: 'MaaProject (Mother & Community Care Project) is an integrated public empowerment and welfare initiative. It delivers accessible maternal healthcare guidance, direct financial welfare assistance, community nutrition resources, and vocational empowerment to mothers, children, and low-income families.',
        expectedAction: 'Grounds response with citation: Source: About MaaProject (Doc: maa-about-01)'
      },
      {
        sender: 'user',
        message: 'Is it run by a private company or is it a public welfare program?',
        note: 'Clarifying organizational structure.'
      },
      {
        sender: 'bot',
        message: 'MaaProject is an open public welfare program operating in partnership with certified healthcare networks, government social welfare directives, and verified non-profit endowments. All beneficiary services are provided free of cost.',
        expectedAction: 'Provides verified governance details.'
      }
    ]
  },
  {
    id: 'flow-02',
    title: 'Flow 2: Frequently Asked Questions (FAQ)',
    category: 'FAQ',
    description: 'User asks common questions regarding costs, eligibility, and documents.',
    userGoal: 'Quickly verify cost and eligibility requirements.',
    steps: [
      {
        sender: 'user',
        message: 'Are there any registration fees or hidden costs for using MaaProject services?',
        note: 'Cost inquiry.'
      },
      {
        sender: 'bot',
        message: 'No. All MaaProject services—including tele-doctor consultations, nutrition kits, and welfare grant disbursements—are 100% free for verified beneficiaries. There are zero registration fees or agent commissions.',
        expectedAction: 'Cites FAQ document (maa-faq-01).'
      },
      {
        sender: 'user',
        message: 'Who is eligible to apply for these programs?',
        note: 'Eligibility follow-up.'
      },
      {
        sender: 'bot',
        message: 'Pregnant women, nursing mothers, parents/guardians of infants under age 5, and low-to-middle income families in supported regions are eligible. You only need a valid Government ID and proof of pregnancy/birth (e.g. MCP Card).',
        expectedAction: 'Provides structured eligibility checklist.'
      }
    ]
  },
  {
    id: 'flow-03',
    title: 'Flow 3: Service Information & Details',
    category: 'Services',
    description: 'User asks for an overview of all available services and dives deep into one.',
    userGoal: 'Learn about maternal health support and nutritional programs.',
    steps: [
      {
        sender: 'user',
        message: 'What services does MaaProject offer?',
        note: 'Broad service listing request.'
      },
      {
        sender: 'bot',
        message: 'MaaProject offers 5 primary services:\n1. Maa Care — Maternal & Child Health Support Hub\n2. Maa Welfare — Direct Financial Assistance & Scholarships\n3. Maa Nutrition — Poshan Kits & Micronutrient Distribution\n4. Maa 24/7 Emergency Line — Urgent Maternal Triage & Ambulance Dispatch\n5. Maa Skill Empowerment — Vocational & Digital Literacy Workshops',
        expectedAction: 'Displays interactive quick action chips for each service.'
      },
      {
        sender: 'user',
        message: 'Tell me more about Maa Care. What specific medical help is provided?',
        note: 'Contextual drill-down into service 1.'
      },
      {
        sender: 'bot',
        message: 'Maa Care provides 24/7 tele-consultations with certified obstetricians and pediatricians, automated ANC/immunization milestone schedules, high-risk pregnancy screening, and postpartum mental wellness counseling.',
        expectedAction: 'Provides direct link to /maternal-care portal.'
      }
    ]
  },
  {
    id: 'flow-04',
    title: 'Flow 4: Step-by-Step User Guidance',
    category: 'Guidance',
    description: 'User requests clear instructions on how to enroll for the Janani Nutrition Grant.',
    userGoal: 'Understand exact steps to submit an application.',
    steps: [
      {
        sender: 'user',
        message: 'How do I apply for the Maa Welfare Scheme grants step by step?',
        note: 'Process inquiry.'
      },
      {
        sender: 'bot',
        message: 'Here are the 5 verified steps to apply:\n1. Visit /welfare-schemes and verify your mobile number with OTP.\n2. Fill in beneficiary details and pregnancy/child stage.\n3. Upload mandatory documents (Govt ID, MCP Card, and Bank Passbook for DBT).\n4. Select your scheme (Janani Nutrition Grant ₹6,000 or Vidya Scholarship).\n5. Submit and receive your Application Tracking ID (SMS confirmation).',
        expectedAction: 'Renders actionable step list and navigation button.'
      },
      {
        sender: 'user',
        message: 'How long does it take for the application to be approved?',
        note: 'Timeline question.'
      },
      {
        sender: 'bot',
        message: 'Standard application verification takes between 3 to 5 business days. Once approved, the first installment is transferred directly to your linked bank account via Direct Benefit Transfer (DBT).',
        expectedAction: 'Cites Maa Welfare Guide SLA.'
      }
    ]
  },
  {
    id: 'flow-05',
    title: 'Flow 5: Navigation Assistance',
    category: 'Navigation',
    description: 'User needs help finding specific sections of the MaaProject web portal.',
    userGoal: 'Get direct routes to book a doctor and check welfare status.',
    steps: [
      {
        sender: 'user',
        message: 'Where can I book an appointment with a gynecologist on this website?',
        note: 'Navigation inquiry.'
      },
      {
        sender: 'bot',
        message: 'You can book a maternal tele-doctor appointment in the Maa Care Hub at /maternal-care under the "Book Tele-Consultation" section.',
        expectedAction: 'Renders direct route button [Go to Maternal Care Hub].'
      },
      {
        sender: 'user',
        message: 'Where is the page to file a complaint about a delayed benefit?',
        note: 'Second navigation question.'
      },
      {
        sender: 'bot',
        message: 'You can file a formal complaint and track existing tickets in the Grievance & Support Portal at /support/report.',
        expectedAction: 'Renders direct route button [Go to Support & Report Desk].'
      }
    ]
  },
  {
    id: 'flow-06',
    title: 'Flow 6: Conversational Search Assistance',
    category: 'Search',
    description: 'User conducts a natural language search across all MaaProject documents.',
    userGoal: 'Search for Iron and Folic Acid supplement guidelines.',
    steps: [
      {
        sender: 'user',
        message: 'Search for where I can get free Iron and Folic Acid tablets.',
        note: 'Search query.'
      },
      {
        sender: 'bot',
        message: 'Free Iron & Folic Acid (IFA) supplements and Calcium tablets are distributed monthly under the Maa Nutrition Initiative (Doc: maa-service-03). You can collect them at any of the 450+ MaaProject Community Care Centers or request home delivery for high-risk pregnancies.',
        expectedAction: 'Displays source document citation card with snippet preview.'
      }
    ]
  },
  {
    id: 'flow-07',
    title: 'Flow 7: General Inquiries & Operations',
    category: 'General Inquiry',
    description: 'User asks about operating hours and center locations.',
    userGoal: 'Check center timings and regional availability.',
    steps: [
      {
        sender: 'user',
        message: 'What are the working hours of MaaProject offices and care centers?',
        note: 'Timings question.'
      },
      {
        sender: 'bot',
        message: 'Operating Hours:\n• 24/7 Emergency Care & Maternal Triage Helpline (Always Open)\n• Community Centers & Administrative Helpdesks: Monday to Saturday, 8:00 AM – 8:00 PM IST (Closed Sundays and National Holidays).',
        expectedAction: 'Cites verified contact/hours knowledge document.'
      }
    ]
  },
  {
    id: 'flow-08',
    title: 'Flow 8: Verified Contact Information',
    category: 'Contact',
    description: 'User asks for official phone numbers, emails, and address.',
    userGoal: 'Obtain authentic helpline numbers and office location.',
    steps: [
      {
        sender: 'user',
        message: 'Please give me all official contact details for MaaProject.',
        note: 'Contact info request.'
      },
      {
        sender: 'bot',
        message: 'Verified Official Contact Details:\n• National Toll-Free Helpline: 1800-11-MAA-CARE (1800-11-6222)\n• Support Email: support@maaproject.org\n• Grievance Redressal: grievance@maaproject.org\n• Official Portal: https://maaproject.org\n• National Secretariat: 4th Floor, Community Welfare Bhawan, Institutional Area, New Delhi — 110001',
        expectedAction: 'Renders one-click Call and Email buttons.'
      }
    ]
  },
  {
    id: 'flow-09',
    title: 'Flow 9: Problem Reporting & Incident Ticket Creation',
    category: 'Problem Reporting',
    description: 'User reports an issue with an OTP login failure and delayed welfare grant.',
    userGoal: 'Get troubleshooting advice and submit a tracked support ticket.',
    steps: [
      {
        sender: 'user',
        message: 'I am having a problem with my welfare grant. It has been 10 days and my status is still stuck on Under Verification.',
        note: 'Issue statement.'
      },
      {
        sender: 'bot',
        message: 'I understand this is frustrating. Under standard MaaProject SLAs, verification completes within 3–5 business days. Let us troubleshoot:\n1. Ensure your bank account has active Direct Benefit Transfer (DBT) enabled.\n2. Confirm that your uploaded bank passbook shows a clear IFSC code and name.\n\nWould you like me to open a Priority Support Ticket for your case so our welfare officers can inspect your account directly?',
        expectedAction: 'Displays [Open Support Ticket] prompt.'
      },
      {
        sender: 'user',
        message: 'Yes, please open a ticket for me. My phone number is 9876543210 and application ID is MAA-APP-55201.',
        note: 'User consents and provides details.'
      },
      {
        sender: 'bot',
        message: 'Your support ticket has been created successfully!\n\n• Ticket ID: MAA-TKT-84920\n• Category: Welfare Application Delay\n• Priority: High\n• Status: In Progress\n\nOur Grievance Officer will review your submission and contact you at 9876543210 within 24 business hours.',
        expectedAction: 'Creates live record in Support Tickets database with tracking token.'
      }
    ]
  },
  {
    id: 'flow-10',
    title: 'Flow 10: Support Request & Human Escalation',
    category: 'Escalation',
    description: 'User has an urgent maternal medical complication requiring human medical triage.',
    userGoal: 'Escalate to emergency human support immediately.',
    steps: [
      {
        sender: 'user',
        message: 'My wife is 8 months pregnant and suddenly experiencing severe abdominal pain and blurred vision. What should we do?',
        note: 'Urgent medical symptom reported.'
      },
      {
        sender: 'bot',
        message: '⚠️ URGENT MEDICAL ADVISORY: Severe abdominal pain combined with blurred vision may indicate pre-eclampsia or active complications. Please take immediate action:\n\n1. CALL OUR 24/7 TOLL-FREE EMERGENCY LINE NOW: 1800-11-6222 (1800-11-MAA-CARE) or call local emergency services.\n2. I have escalated this conversation to our Emergency Medical Triage Desk.\n3. Do not attempt self-medication.',
        expectedAction: 'Triggers active emergency state, displays red emergency banner and direct click-to-call.'
      }
    ]
  },
  {
    id: 'flow-11',
    title: 'Flow 11: Safe Fallback & Out-of-Scope Handling',
    category: 'Fallback',
    description: 'User asks for cryptocurrency predictions or unrelated programming tasks.',
    userGoal: 'Observe how Maa AI Chat enforces zero hallucination and strict boundary discipline.',
    steps: [
      {
        sender: 'user',
        message: 'What is the best cryptocurrency to invest in for 2027?',
        note: 'Unrelated query.'
      },
      {
        sender: 'bot',
        message: 'I do not have information about cryptocurrency or financial markets, as Maa AI Chat is specifically designed to assist with MaaProject community healthcare, welfare schemes, nutrition programs, and platform navigation. I would be happy to help you with any MaaProject services, finding care centers, or filing a support request.',
        expectedAction: 'Returns safe verified fallback with suggested MaaProject chips.'
      }
    ]
  }
];
