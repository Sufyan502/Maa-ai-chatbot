import { TestCase } from '../types';

export const COMPREHENSIVE_TEST_CASES: TestCase[] = [
  // 1. Normal Queries (1-4)
  {
    id: 'TC-01',
    category: 'Normal Query',
    query: 'What is MaaProject and what is its core mission?',
    expectedResponseCriteria: 'Explains MaaProject as a public welfare initiative focusing on maternal health, direct financial welfare, community nutrition, and digital empowerment. Must cite official about documents.',
    status: 'idle'
  },
  {
    id: 'TC-02',
    category: 'Normal Query',
    query: 'What services are available under MaaProject?',
    expectedResponseCriteria: 'Lists all 5 core verified services: Maa Care (Maternal Health), Maa Welfare Scheme, Maa Nutrition Initiative, 24/7 Emergency Helpline, and Maa Skill Empowerment.',
    status: 'idle'
  },
  {
    id: 'TC-03',
    category: 'Normal Query',
    query: 'Are MaaProject services free of cost for mothers?',
    expectedResponseCriteria: 'Confirms 100% free access for consultations, nutrition kits, and verified welfare grants with zero hidden fees.',
    status: 'idle'
  },
  {
    id: 'TC-04',
    category: 'Normal Query',
    query: 'What is the official toll-free contact number for MaaProject?',
    expectedResponseCriteria: 'Provides verified toll-free national hotline: 1800-11-MAA-CARE (1800-11-6222) and official support email: support@maaproject.org.',
    status: 'idle'
  },

  // 2. Complex Queries (5-8)
  {
    id: 'TC-05',
    category: 'Complex Query',
    query: 'I am 5 months pregnant, have low hemoglobin (anemia), and need both nutrition kits and a tele-consultation with a nutritionist. How do I access these?',
    expectedResponseCriteria: 'Outlines the dual pathway: booking a clinical dietitian via /maternal-care and enrolling for the monthly Maa Poshan Kit (IFA supplements + fortified food) via /services#nutrition.',
    status: 'idle'
  },
  {
    id: 'TC-06',
    category: 'Complex Query',
    query: 'Can you explain the difference between the Janani Nutrition Grant and the Emergency Medical Relief fund under the welfare scheme?',
    expectedResponseCriteria: 'Differentiates the ₹6,000 trimester-milestone nutrition grant from the one-time emergency hardship relief of up to ₹25,000 for critical surgeries.',
    status: 'idle'
  },
  {
    id: 'TC-07',
    category: 'Complex Query',
    query: 'What are the required documents for registering a low-income family for the Maa Vidya Girl Child Scholarship?',
    expectedResponseCriteria: 'Details required verification documents: Government ID (Aadhaar/National ID), proof of child registration, school admission record, and income declaration.',
    status: 'idle'
  },
  {
    id: 'TC-08',
    category: 'Complex Query',
    query: 'How does MaaProject protect patient confidentiality and medical data during video doctor consultations?',
    expectedResponseCriteria: 'Cites HIPAA-aligned protocols, end-to-end encryption, strict non-commercial data policy from knowledge base security sections.',
    status: 'idle'
  },

  // 3. Incomplete Queries (9-11)
  {
    id: 'TC-09',
    category: 'Incomplete Query',
    query: 'welfare money',
    expectedResponseCriteria: 'Detects brevity/ambiguity, provides a summary of the Maa Welfare Scheme grants, and politely asks if the user wants eligibility requirements, application steps, or payment status tracking.',
    status: 'idle'
  },
  {
    id: 'TC-10',
    category: 'Incomplete Query',
    query: 'doctor appointment',
    expectedResponseCriteria: 'Provides immediate guidance on booking a free maternal tele-consultation and asks for preferred specialty or consultation type.',
    status: 'idle'
  },
  {
    id: 'TC-11',
    category: 'Incomplete Query',
    query: 'help kit',
    expectedResponseCriteria: 'Asks clarifying question regarding whether the user is seeking the Maa Poshan Nutrition Kit or emergency medical aid, explaining both options.',
    status: 'idle'
  },

  // 4. Incorrect / Misconception Queries (12-14)
  {
    id: 'TC-12',
    category: 'Incorrect / Misconception',
    query: 'Do I have to pay an agent ₹500 to submit my MaaProject application?',
    expectedResponseCriteria: 'Explicitly refutes the misconception: clarifies that MaaProject registration and applications are 100% free and warns against unauthorized agents.',
    status: 'idle'
  },
  {
    id: 'TC-13',
    category: 'Incorrect / Misconception',
    query: 'Is MaaProject only available for residents of the United Kingdom?',
    expectedResponseCriteria: 'Corrects the misconception: clarifies that MaaProject is a community welfare program operating in designated national zones with headquarters in New Delhi and local regional centers.',
    status: 'idle'
  },
  {
    id: 'TC-14',
    category: 'Incorrect / Misconception',
    query: 'Does MaaProject sell insurance policies for cars and motorcycles?',
    expectedResponseCriteria: 'Politely clarifies that MaaProject is exclusively dedicated to maternal health, community nutrition, social welfare grants, and skill training, not vehicle insurance.',
    status: 'idle'
  },

  // 5. Unrelated / Out of Scope Queries (15-17)
  {
    id: 'TC-15',
    category: 'Unrelated / Out of Scope',
    query: 'What is the stock price of Tesla today and should I buy Bitcoin?',
    expectedResponseCriteria: 'Applies safe fallback: politely states that Maa AI Chat is strictly dedicated to MaaProject services and cannot provide financial trading or stock advice.',
    status: 'idle'
  },
  {
    id: 'TC-16',
    category: 'Unrelated / Out of Scope',
    query: 'Write me a Python script to scrape images from Instagram.',
    expectedResponseCriteria: 'Gracefully refuses out-of-scope programming query and refocuses on MaaProject platform guidance.',
    status: 'idle'
  },
  {
    id: 'TC-17',
    category: 'Unrelated / Out of Scope',
    query: 'Who won the 2022 FIFA World Cup?',
    expectedResponseCriteria: 'Polite out-of-scope fallback explaining its specialized focus on MaaProject assistance while redirecting to available platform topics.',
    status: 'idle'
  },

  // 6. Repeated / Contextual Queries (18-20)
  {
    id: 'TC-18',
    category: 'Repeated / Contextual',
    query: 'Tell me about the emergency helpline again.',
    expectedResponseCriteria: 'Maintains conversational context, repeats the 1800-11-MAA-CARE emergency hotline, and offers direct action buttons or troubleshooting.',
    status: 'idle'
  },
  {
    id: 'TC-19',
    category: 'Repeated / Contextual',
    query: 'What was that second service you mentioned earlier?',
    expectedResponseCriteria: 'Uses multi-turn conversation context to resolve references to the Maa Welfare & Direct Financial Assistance Scheme.',
    status: 'idle'
  },
  {
    id: 'TC-20',
    category: 'Repeated / Contextual',
    query: 'How do I contact them again?',
    expectedResponseCriteria: 'Identifies contextual pronoun and provides official support email (support@maaproject.org) and phone numbers.',
    status: 'idle'
  },

  // 7. Out-of-Scope Fallback (21-23)
  {
    id: 'TC-21',
    category: 'Out-of-Scope Fallback',
    query: 'Can you book a flight ticket to Paris for my family?',
    expectedResponseCriteria: 'Triggers official safe fallback response explaining unavailable information in MaaProject knowledge base, offering genuine platform services instead.',
    status: 'idle'
  },
  {
    id: 'TC-22',
    category: 'Out-of-Scope Fallback',
    query: 'What is the secret recipe for Kentucky Fried Chicken?',
    expectedResponseCriteria: 'Standard verified fallback response ensuring zero hallucination.',
    status: 'idle'
  },
  {
    id: 'TC-23',
    category: 'Out-of-Scope Fallback',
    query: 'Can you issue me a driver license?',
    expectedResponseCriteria: 'Safe fallback clarifying that driver licensing is outside MaaProject scope and guiding toward government transport portals if needed.',
    status: 'idle'
  },

  // 8. Invalid Input Queries (24-26)
  {
    id: 'TC-24',
    category: 'Invalid Input',
    query: '??? ... !!!',
    expectedResponseCriteria: 'Handles punctuation-only input gracefully with a helpful welcome prompt and quick suggestion chips.',
    status: 'idle'
  },
  {
    id: 'TC-25',
    category: 'Invalid Input',
    query: 'asdfghjkl qwerty 12345',
    expectedResponseCriteria: 'Detects unintelligible string, responds courteously asking how it can assist with MaaProject programs.',
    status: 'idle'
  },
  {
    id: 'TC-26',
    category: 'Invalid Input',
    query: '   ',
    expectedResponseCriteria: 'Client/Server validation intercepts blank query and prompts user for a question.',
    status: 'idle'
  },

  // 9. Long Queries (27-28)
  {
    id: 'TC-27',
    category: 'Long Query',
    query: 'Hello Maa AI Chat team, I am writing to you on behalf of my sister who is currently residing in a rural district. She recently registered for the Maa Welfare Scheme approximately three weeks ago and received an SMS with reference ID MAA-APP-48201. However, when checking her DBT bank account, the second installment of the Janani Nutrition Grant has not yet reflected. We tried calling our local center but the line was busy. Could you please give us step-by-step guidance on how to troubleshoot this delay, where to submit an official problem report, and what documents she should keep ready for verification?',
    expectedResponseCriteria: 'Synthesizes the long narrative into structured advice: verifies the 3-5 day SLA, checks DBT-Aadhaar linking, directs to /support/report with pre-filled category "Welfare Payment Delay", and lists required bank passbook documents.',
    status: 'idle'
  },
  {
    id: 'TC-28',
    category: 'Long Query',
    query: 'I am interested in understanding the comprehensive institutional architecture of MaaProject including how the community care centers interact with certified obstetricians, what nutritional standards are used for the Maa Poshan Kits, whether there are vocational programs for women seeking self-reliance, and who to contact for institutional CSR partnerships.',
    expectedResponseCriteria: 'Provides a thorough multi-pillar breakdown covering medical tele-triage, nutritional kit specifications, vocational SHG workshops, and the official Secretariat contact (support@maaproject.org).',
    status: 'idle'
  },

  // 10. Multiple Questions Queries (29-30)
  {
    id: 'TC-29',
    category: 'Multiple Questions',
    query: '1. What is the fee for maternal tele-consultations? 2. What are the operating hours of the emergency helpline? 3. Where can I find the official office address?',
    expectedResponseCriteria: 'Separates and answers all 3 questions individually: 1. 100% Free, 2. 24/7/365, 3. 4th Floor, Community Welfare Bhawan, Institutional Area, New Delhi — 110001.',
    status: 'idle'
  },
  {
    id: 'TC-30',
    category: 'Multiple Questions',
    query: 'How do I apply for the welfare grant, how do I report a problem if my application gets stuck, and what is the support email?',
    expectedResponseCriteria: 'Addresses all 3 parts systematically: application steps via /welfare-schemes, problem ticket logging via /support/report, and email support@maaproject.org.',
    status: 'idle'
  }
];
