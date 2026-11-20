window.PORTFOLIO = {
  owner: {
    name: 'Mafaro Musimwa',
    handle: 'mafaro',
    host: 'lab',
    labName: "Mafaro's Lab",
    tagline: 'Cyber security student. Cryptography, networking, secure code.',
  },

  apps: [
    { id: 'terminal', label: 'Terminal', ico: 'terminal', desk: true },
    { id: 'work', label: 'Projects', ico: 'work', desk: true },
    { id: 'certs', label: 'Certs', ico: 'certs', desk: true },
    { id: 'skills', label: 'Skills', ico: 'skills', desk: true },
    { id: 'about', label: 'About', ico: 'about' },
    { id: 'contact', label: 'Contact', ico: 'contact' },
    { id: 'flags', label: 'Flag Hunt', ico: 'flag' },
  ],

  categories: [
    { id: 'security', label: 'Research & Analysis', dir: 'research-and-analysis', color: 'pink' },
    { id: 'networking', label: 'Networking Labs', dir: 'networking-labs', color: 'sky' },
    { id: 'fun', label: 'Technical Projects', dir: 'technical-projects', color: 'butter' },
  ],
  projects: [
    {
      id: 'grc-report',
      category: 'security',
      title: 'Northern Minerals Limited Risk Assessment',
      kind: 'report',
      status: 'Report',
      docType: 'Risk Assessment',
      year: 2026,
      hook: "Have you ever wondered what a mining company's biggest security risks really are, and what it would cost to fix them? I took Northern Minerals, a rare earths developer, and worked it out from public information alone. This is what I found: ransomware and state-sponsored data theft were the two Critical risks, and the board itself was a risk, because three of its four directors are executives. A funded plan costing A$292,000 in Year 1 would remove both Critical ratings.",
      overview:
        "A hypothetical governance, risk and compliance risk assessment of Northern Minerals Limited's Browns Range heavy rare earths project, built from public information. It is independent portfolio work and is not affiliated with the company.",
      goal: 'Identify, analyse and evaluate the governance, information-security and compliance risks most relevant to the company before its final investment decision, and recommend treatments that fit a constrained budget.',
      approach:
        'Followed the ISO 31000:2018 process, with asset-based risk identification from ISO/IEC 27005:2022, NIST SP 800-30 Rev. 1 threat types, and ISO/IEC 27001:2022 Annex A control mapping. Likelihood and impact were rated on a 5 x 5 scale, first with no controls (inherent) and then with assumed existing controls (residual).',
      featuresTitle: 'What is in the report',
      features: [
        'Eight risks across cyber, governance, suppliers, site systems, compliance and reputation',
        'Asset, vulnerability and threat registers, a compliance obligations register and a risk appetite statement',
        'Inherent and residual risk registers with heat maps',
        'Eleven costed treatments and a budget-constrained plan',
        'Residual risk acceptance, key risk indicators and a review cycle',
      ],
      findings: [
        'Five risks rated Critical before controls, falling to two once the assumed existing controls are counted: a ransomware or data-extortion attack, and state-sponsored theft of project data.',
        'A governance gap: three of the four directors are executives, and the Audit & Risk Committee is chaired by the Executive Chair, which departs from ASX Recommendations 2.4 and 4.1.',
        'Eleven treatments were costed at A$519,600 in Year 1. A plan at 60% of that figure (A$311,760) funds six of them for A$292,000, removes both Critical ratings, and leaves five risks above appetite that need formal Board acceptance.',
      ],
      takeaways: [
        'Phishing-resistant MFA and tested, immutable backups gave the biggest risk reduction per dollar, and make a ransomware attack recoverable.',
        'Payment controls such as call-back verification, payment limits and enforced DMARC are cheap protection against business email compromise.',
        'A managed service provider with privileged access is a concentration point, so keep an independent copy of hosted data and give suppliers time-limited admin access.',
        'Weak, management-dominated oversight amplifies every other risk, so independent challenge at board level is itself a security control.',
        'Risks left above appetite should be accepted formally, with conditions and a review date, rather than ignored.',
      ],
      caveat:
        "Statements about the company's internal systems, controls and budget are assumptions, marked [A] in the report, and are not claims of fact. Ratings are qualitative judgements by a single assessor, with no interviews with company staff.",
      tags: [
        'ISO 31000',
        'ISO/IEC 27005',
        'NIST SP 800-30',
        'ISO/IEC 27001 Annex A',
        'Risk assessment',
        'GRC',
      ],
      pdf: { label: 'Read the report', src: 'assets/work/northern-minerals-risk-assessment.pdf' },
      links: [],
    },
    {
      id: 'yunori-world',
      category: 'fun',
      title: 'Yunori World',
      img: 'assets/projects/yunori-logo.png',
      tone: 'logo',
      status: 'Live',
      overview:
        'A web app, made for fun, that turns a cluttered anime watchlist into a personalised, visually organised collection.',
      features: [
        'Pulls show data from the AniList API',
        'Stores your collection in Supabase',
        'A hand-drawn, themeable look',
      ],
      tags: ['React', 'Vite', 'Supabase', 'AniList API', 'Vercel'],
      links: [
        { label: 'Live site', href: 'https://www.yunori.world/login' },
        { label: 'Source', href: 'https://github.com/farie-oe/YunoriWorld' },
      ],
    },
    {
      id: 'study-room',
      category: 'fun',
      title: 'Study Room',
      ico: 'study',
      tone: 'b',
      status: 'Playable',
      overview:
        'A browser study app on a retro desktop, made for fun. Finish focus sessions to earn resources and look after virtual plants.',
      features: [
        'Focus timer, to-dos and notes',
        'Ambience mixer',
        'Draggable windows',
        'Every plant drawn in SVG code',
        'No build step and no dependencies',
      ],
      tags: ['Vanilla JS', 'SVG', 'Web Audio API', 'localStorage'],
      links: [{ label: 'Source', href: 'https://github.com/farie-oe/study-room' }],
    },
  ],

  certs: [
    {
      id: 'isc2-cc',
      title: 'Certified in Cybersecurity (CC)',
      issuer: 'ISC2',
      ico: 'shield',
      tone: 'a',
      img: 'assets/certs/isc2-cc.jpg',
      status: 'Certified',
      blurb: 'Entry-level cyber security certification from ISC2.',
      details: [
        ['Credential', 'Certified in Cybersecurity'],
        ['Certification no.', '3495493'],
        ['Cycle', 'Aug 1, 2026 – Jul 31, 2029'],
        ['Certified since', '2026'],
      ],
      links: [],
    },
    {
      id: 'deloitte-sim',
      title: 'Deloitte Cyber Job Simulation',
      issuer: 'Deloitte, via Forage',
      ico: 'badge',
      tone: 'b',
      img: 'assets/certs/deloitte-sim.jpg',
      status: 'Completed',
      blurb: 'Practical cyber security tasks, July 2026.',
      details: [
        ['Programme', 'Cyber Job Simulation'],
        ['Issued by', 'Forage, for Deloitte'],
        ['Completed', 'July 18, 2026'],
      ],
      links: [],
    },
    {
      id: 'cisco-mentorme',
      title: 'Cisco MentorMe Program 2026',
      issuer: 'Cisco',
      img: 'assets/certs/cisco-mentorme.jpg',
      status: 'Completed',
      blurb: 'Mentoring program for women in ICT, completed October 2026.',
      details: [
        ['Programme', 'Cisco MentorMe 2026'],
        ['Issued by', 'Cisco'],
        ['Completed', 'October 29, 2026'],
        [
          'About',
          'MentorMe inspires female higher education students to pursue careers in ICT through mentoring and exposure to industry opportunities.',
        ],
      ],
      links: [],
    },
  ],

  skills: [
    {
      group: 'Security',
      items: [
        { name: 'Cryptography' },
        { name: 'Secure coding' },
        {
          name: 'GRC',
          projects: ['grc-report'],
          sub: [
            'Governance',
            'Risk assessment',
            'Risk registers',
            'Risk rating and heat maps',
            'Risk treatment and budgeting',
            'Risk appetite and acceptance',
            'Compliance mapping',
            'Incident response',
            'Business impact analysis (BIA)',
            'Business continuity',
            'ISO 31000',
            'ISO/IEC 27001',
            'NIST SP 800-30',
          ],
        },
        { name: 'Cyber security fundamentals', certs: ['isc2-cc'] },
      ],
    },
    {
      group: 'Networking',
      items: [
        { name: 'Wireshark', sub: ['Packet capture', 'Protocol analysis'] },
        {
          name: 'Cisco Packet Tracer',
          projects: [
            'networking-addressing-routing',
            'networking-services',
            'networking-design-iot',
          ],
          sub: ['Network design', 'IPv4 addressing', 'Subnetting', 'Routing'],
        },
        { name: 'TCP/IP and troubleshooting' },
        { name: 'Network security fundamentals' },
      ],
    },
    {
      group: 'Web development, for fun',
      note: 'I build these to learn and play, not as my main focus.',
      items: [
        { name: 'HTML & CSS', projects: ['yunori-world', 'study-room'] },
        { name: 'JavaScript', projects: ['study-room', 'yunori-world'] },
        { name: 'React', projects: ['yunori-world'] },
        { name: 'SVG & animation', projects: ['study-room'] },
        { name: 'Supabase', projects: ['yunori-world'] },
        { name: 'Git & GitHub' },
      ],
    },
  ],

  about: {
    greeting: "Hi, I'm Mafaro!",
    paragraphs: [
      "I'm a cybersecurity student with a curiosity for understanding how technology works, how systems fail, and how they can be made more secure.",
      'I enjoy exploring the technical side of cybersecurity, particularly understanding the relationship between systems, networks, and the security mechanisms that protect them.',
      "Outside of my studies, I enjoy building small web projects and experimenting with creative ideas. I have a soft spot for playful interfaces, cosy aesthetics, and little interactive details. This portfolio is a space where I document what I'm learning, showcase what I'm building, and explore my interests along the way.",
    ],
    facts: [
      ['For fun', 'Web projects, cosy interfaces, anime'],
      [
        'Education',
        [
          'Queensland University of Technology (QUT)',
          'Bachelor of Information Technology (Cybersecurity)',
        ],
      ],
    ],
  },

  contact: {
    intro:
      "Have a project, an interesting security question, or a cosy website recommendation? I'd love to hear from you.",
    links: [
      {
        label: 'Email',
        value: 'mafaro.r.musimwa@gmail.com',
        href: 'mailto:mafaro.r.musimwa@gmail.com',
        ico: 'contact',
      },
      {
        label: 'LinkedIn',
        value: 'in/mafaro-musimwa',
        href: 'https://www.linkedin.com/in/mafaro-musimwa-46b2292a9',
        ico: 'about',
      },
      {
        label: 'GitHub',
        value: 'github.com/farie-oe',
        href: 'https://github.com/farie-oe',
        ico: 'terminal',
      },
    ],
  },

  flags: [
    {
      id: 'star',
      flag: 'flag{wish_upon_a_star}',
      clue: 'Click the big bright star in the top right of the sky.',
      hints: ['It is the biggest, brightest star, near the top right.'],
    },
    {
      id: 'cloud',
      flag: 'flag{head_in_the_clouds}',
      clue: 'Click a cloud in the sky.',
      hints: [
        'It is the cloud about halfway down the sky.',
        'It drifts across, so wait for it to float into view and click it.',
      ],
    },
    {
      id: 'dotfile',
      flag: 'flag{dotfiles_never_sleep}',
      clue: 'In the terminal, type ls -a and then cat .secret',
      hints: ['ls -a shows hidden files.', 'Then type cat .secret'],
    },
    {
      id: 'rot13',
      flag: 'flag{caesar_salad}',
      clue: 'In the terminal, type cat note.txt',
      hints: ['Open the terminal from the desktop, type cat note.txt and press Enter.'],
    },
    {
      id: 'devtools',
      flag: 'flag{devtools_detective}',
      clue: 'Press F12, open the Console tab, and copy the flag you see there.',
      hints: [
        'Or right-click the page, choose Inspect, then Console.',
        'In the terminal, type submit followed by the flag.',
      ],
    },
    {
      id: 'source',
      flag: 'flag{view_source_victor}',
      clue: 'Right-click the page, choose View page source, and look at the top.',
      hints: [
        'The flag is in a comment near the top of the page.',
        'In the terminal, type submit followed by the flag.',
      ],
    },
  ],
};
