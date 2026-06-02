(function (OS) {
  "use strict";

  const companyStatuses = [
    "not applied",
    "applied",
    "under review",
    "OA received",
    "interview",
    "accepted",
    "rejected"
  ];

  const hackathonStatuses = [
    "not started",
    "registered",
    "submitted",
    "shortlisted",
    "won",
    "rejected"
  ];

  const certificationStatuses = ["not started", "ongoing", "completed"];
  const youtubeStatuses = ["not started", "watching", "completed"];
  const projectStatuses = ["planning", "in progress", "deployed", "completed"];

  const phases = [
    {
      id: "phase-1",
      name: "Foundations + GenAI Intro",
      range: "May 19-Jun 29",
      weeks: "Weeks 1-6",
      focus: "Tata Steel Hackathon, InfyTQ, GitHub, SHAP, feature engineering, statistics, Streamlit deploy, first applications"
    },
    {
      id: "phase-2",
      name: "DSA Core + Deep Learning + Peak Applications",
      range: "Jun 30-Aug 31",
      weeks: "Weeks 7-14",
      focus: "TCS NQT, Wipro NLTH, Unstop blitz, time series, NLP, ensembles, LangChain RAG intro"
    },
    {
      id: "phase-3",
      name: "Specialisation + GRiD + MLOps",
      range: "Sep 1-Oct 31",
      weeks: "Weeks 15-22",
      focus: "AWS cert, Flipkart GRiD, XGBoost/CatBoost, Docker, RAG chatbot, mock interview season"
    },
    {
      id: "phase-4",
      name: "Final Push + Offers + Negotiations",
      range: "Nov 1-Dec 31",
      weeks: "Weeks 23-30",
      focus: "Capstone deploy, convert interviews to offers, negotiate, accept 6+ LPA"
    }
  ];

  const companies = [
    ["Mu Sigma", "Trainee Decision Scientist", "Rs.4.5-6 LPA", "Rolling/Aug-Oct", "mu-sigma.com/career + Unstop"],
    ["LatentView Analytics", "Analyst", "Rs.4.5-5.5 LPA", "Rolling (NOW)", "latentview.com/careers"],
    ["EXL Service", "Data Analyst/Engineer", "Rs.4-7 LPA", "Rolling (NOW)", "exlservice.com/careers"],
    ["Genpact", "Associate Data Analyst", "Rs.4-5.5 LPA", "Rolling (NOW)", "genpact.com/careers"],
    ["Tiger Analytics", "Associate", "Rs.5-8 LPA", "Rolling", "tiger-analytics.com/careers"],
    ["Gramener", "Data Scientist", "Rs.4-6 LPA", "Rolling", "gramener.com/careers"],
    ["Fractal Analytics", "Analyst", "Rs.5-9 LPA", "Rolling", "fractal.ai/careers"],
    ["Absolutdata", "Data Analyst", "Rs.4-6 LPA", "Rolling", "absolutdata.com/careers"],
    ["Sigmoid", "Data Engineer", "Rs.6-10 LPA", "Rolling", "sigmoid.com/careers"],
    ["Quantiphi", "ML Engineer", "Rs.5-8 LPA", "Rolling", "quantiphi.com/careers"],
    ["WNS", "Data Analytics", "Rs.3.5-5.5 LPA", "Rolling (NOW)", "wns.com/careers"],
    ["TCS", "Digital/Prime (NQT)", "Rs.7+ LPA", "Aug-Sep 2026", "nextstep.tcs.com"],
    ["Infosys", "DSE via InfyTQ", "Rs.6.25 LPA", "Aug-Oct 2026", "infytq.com - complete cert now"],
    ["Wipro", "Elite/Elite Pro", "Rs.6.5-10 LPA", "Aug-Sep 2026", "careers.wipro.com; NLTH test"],
    ["HCL Tech", "Fresher Drive", "Rs.4-6 LPA", "Rolling/Sep-Nov", "hcltech.com/careers"],
    ["Accenture", "ASE/PackageD", "Rs.4.5/Rs.6.5 LPA", "Aug-Oct 2026", "accenture.com/careers - PackageD"],
    ["Cognizant", "GenC Next D&A", "Rs.6.5 LPA", "Aug-Sep 2026", "cognizant.com/careers"],
    ["Capgemini", "Fresher Analyst", "Rs.4-5.5 LPA", "Aug-Oct 2026", "capgemini.com/careers"],
    ["Tech Mahindra", "GEP", "Rs.3.5-5 LPA", "Rolling/Aug-Oct", "careers.techmahindra.com"],
    ["LTIMindtree", "Graduate", "Rs.5-7 LPA", "Aug-Oct 2026", "ltimindtree.com/careers"],
    ["Hexaware", "Data Analyst", "Rs.4-6 LPA", "Rolling/Aug-Sep", "hexaware.com/careers"],
    ["Persistent Systems", "Associate", "Rs.5-7 LPA", "Rolling", "persistent.com/careers"],
    ["Mphasis", "Fresher Data", "Rs.3.5-5 LPA", "Rolling", "mphasis.com/careers"],
    ["ThoughtWorks", "Analyst", "Rs.6-9 LPA", "Rolling", "thoughtworks.com/careers"],
    ["Publicis Sapient", "ASE", "Rs.6-8 LPA", "Rolling", "publicissapient.com/careers"],
    ["Swiggy", "DS Engineer", "Rs.6-10 LPA", "Rolling (LinkedIn)", "careers.swiggy.com"],
    ["Meesho", "Data Analyst", "Rs.6-10 LPA", "Rolling", "meesho.io/careers"],
    ["Razorpay", "Data Analytics", "Rs.7-12 LPA", "Rolling", "razorpay.com/jobs"],
    ["PhonePe", "Data Science", "Rs.8-14 LPA", "Rolling", "phonepe.com/careers"],
    ["ZS Associates", "DA Associate", "Rs.8-12 LPA", "Aug-Oct 2026", "jobs.zs.com - case study prep"],
    ["JP Morgan", "Code for Good", "Internship path", "Mid-2026", "careers.jpmorgan.com"],
    ["Citibank", "Fresher Analyst", "Rs.6-9 LPA", "Jul-Sep 2026", "citigroup.com/careers"],
    ["HSBC", "Data Programme", "Rs.6-10 LPA", "Jun-Aug 2026", "hsbc.com/careers"],
    ["LTFS", "Graduate Analyst", "Rs.5-7 LPA", "Aug-Oct 2026", "Track LTFS/LTI-family fresher windows from the apply sheet"]
  ].slice(0, 34).map((item, index) => ({
    id: `company-${index + 1}`,
    companyName: item[0],
    role: item[1],
    ctc: item[2],
    applicationWindow: item[3],
    status: "not applied",
    notes: item[4]
  }));

  const hackathons = [
    ["Tata Steel AI Hackathon", "Unstop", "2026-06-15", "#1 PRIORITY", "PPO opportunity; active intern advantage"],
    ["JP Morgan Code for Good", "careers.jpmorgan.com", "2026-07-15", "STRETCH HIGH", "Internship path; apply early"],
    ["Flipkart GRiD Hackathon", "Unstop/Flipkart", "2026-09-28", "HIGH", "Shortlist + prize; register Aug"],
    ["Mu Sigma Unstop Challenge", "Unstop", "2026-10-15", "HIGH", "Direct interview shortlist"],
    ["Juspay Unstop Challenge", "Unstop", "2026-10-15", "HIGH", "Direct interview shortlist"],
    ["Accenture Hack the Future", "accenture.com", "2026-09-15", "MEDIUM", "Brand visibility + shortlist"],
    ["HCL HackHire", "Unstop/HCL", "2026-10-15", "MEDIUM", "Direct HCL interview"],
    ["Wipro Techathon", "wipro.com/events", "2026-10-15", "MEDIUM", "Wipro Elite track visibility"],
    ["Infosys Ingenious", "infosys.com", "2026-10-15", "MEDIUM", "Infosys shortlist acceleration"],
    ["Smart India Hackathon", "sih.gov.in", "2026-09-15", "MEDIUM", "Govt recognition + LinkedIn content"],
    ["TCS CodeVita", "tcs.com/codevita", "2026-09-15", "MEDIUM", "TCS Prime shortlist boost"],
    ["Amazon ML Challenge", "amazon.jobs", "2026-07-31", "STRETCH", "Visibility at Amazon DS teams"],
    ["Analytics Vidhya Hackathons", "analyticsvidhya.com", "2026-12-31", "MEDIUM", "ML community + profile ranking"],
    ["MachineHack Weekend Contests", "machinehack.com", "2026-12-31", "MEDIUM", "Profile boost and fresh talking points"],
    ["Kaggle Competitions", "kaggle.com", "2026-12-31", "MEDIUM", "Rankings + GitHub notebooks"],
    ["Unstop DS/ML Challenges", "unstop.com", "2026-12-31", "HIGH", "No-CGPA filter; best ROI channel"]
  ].map((item, index) => ({
    id: `hack-${index + 1}`,
    hackathonName: item[0],
    platform: item[1],
    deadline: item[2],
    priority: item[3],
    registrationStatus: "not started",
    submissionStatus: "not started",
    resultStatus: "not started",
    notes: item[4]
  }));

  const certifications = [
    ["InfyTQ Certification", "Infosys", "2 weeks", "2026-06-08", "Fast-tracks Infosys DSE. Do first."],
    ["AWS Cloud Practitioner Prep", "AWS Training", "4-6 weeks", "2026-09-21", "Cloud on resume; ETL + cloud combo stands out."],
    ["Google DA Certificate (audit)", "Google/Coursera", "6 months", "2026-08-31", "Foundations: spreadsheets, SQL, Tableau, R."],
    ["IBM Data Science Professional (audit)", "IBM/Coursera", "3-4 months", "2026-11-07", "Python, SQL, ML, capstone."],
    ["Kaggle Micro-Courses", "Kaggle", "1-2 days each", "2026-12-31", "Python, SQL, Intro ML, Pandas, Feature Engineering."],
    ["HackerRank SQL Advanced Badge", "HackerRank", "1 week", "2026-07-06", "Verifiable badge tested by analytics companies."],
    ["DeepLearning.AI Short Courses", "DeepLearning.AI", "1-3 hours each", "2026-08-10", "Prompt engineering, LangChain, RAG, Agents."],
    ["Fast.ai Practical Deep Learning", "Fast.ai", "7 weeks", "2026-08-31", "Free PyTorch deep learning course."],
    ["MLOps Zoomcamp", "DataTalks.Club", "3 months", "2026-11-21", "MLflow, Docker, deployment; extends Tata Steel project."],
    ["LLM Zoomcamp", "DataTalks.Club", "3 months", "2026-11-14", "RAG, vector DBs, LLM fine-tuning."],
    ["Microsoft Power BI (PL-300 prep)", "Microsoft Learn", "Self-paced", "2026-10-19", "BI analyst track support."],
    ["Statistics with Python (audit)", "U Michigan/Coursera", "3 months", "2026-06-29", "Inference, hypothesis testing, regression."],
    ["Khan Academy Statistics", "Khan Academy", "Self-paced", "2026-06-22", "Probability and distributions basics."],
    ["Machine Learning Specialization", "Andrew Ng/Coursera", "3 months", "2026-06-29", "Gold-standard ML cert."],
    ["Deep Learning Specialization", "Andrew Ng/Coursera", "4 months", "2026-09-07", "CNN, RNN, LSTM, transformers."],
    ["Google Advanced Data Analytics", "Google/Coursera", "6 months", "2026-08-31", "Python, stats, regression, ML."],
    ["IBM ML Professional Certificate", "IBM/Coursera", "6 months", "2026-11-07", "Supervised, unsupervised, DL, time series."],
    ["TensorFlow Developer Cert Prep", "DeepLearning.AI/Coursera", "2 months", "2026-10-31", "Maps to existing TensorFlow experience."],
    ["Generative AI for Everyone", "Andrew Ng/Coursera", "6 hours", "2026-06-22", "Short GenAI literacy credential."],
    ["Structuring ML Projects", "Andrew Ng/Coursera", "6 hours", "2026-07-31", "ML strategy and model improvement talking point."],
    ["SQL for Data Science", "UC Davis/Coursera", "4 weeks", "2026-07-06", "University-branded SQL cert."],
    ["Statistics with Python Specialization", "U Michigan/Coursera", "3 months", "2026-08-31", "Verified stats credential option."]
  ].map((item, index) => ({
    id: `cert-${index + 1}`,
    certificationName: item[0],
    provider: item[1],
    duration: item[2],
    status: "not started",
    progress: 0,
    deadline: item[3],
    notes: item[4]
  }));

  const youtubeResources = [
    { id: 'yt1', sequence: 1, topic: 'Machine Learning Foundations', channel: 'StatQuest', skill: 'ML', playlist: 'Machine Learning Playlist', link: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF', status: 'not started', notes: 'Best channel for mathematical intuition behind Random Forest, SVM, Logistic Regression.' },
    { id: 'yt2', sequence: 2, topic: 'Practical Python ML & Deep Learning', channel: 'Sentdex', skill: 'ML', playlist: 'Deep Learning with PyTorch/TensorFlow', link: 'https://www.youtube.com/playlist?list=PLQVvvaa0QuDfhTox0AjmQ6tvCwUNYSp54', status: 'not started', notes: 'Series on training deep learning models from scratch.' },
    { id: 'yt3', sequence: 3, topic: 'Deep Learning Architectures', channel: 'Aladdin Persson', skill: 'AI', playlist: 'TensorFlow & PyTorch implementations', link: 'https://www.youtube.com/c/AladdinPersson/playlists', status: 'not started', notes: 'Clean PyTorch/TensorFlow code implementations of deep learning papers.' },
    { id: 'yt4', sequence: 4, topic: 'Advanced Pandas & Data Pipelines', channel: 'Boris Pashkaver', skill: 'Python', playlist: 'Mastering Pandas & Data Manipulation', link: 'https://www.youtube.com/c/BorisPashkaver/playlists', status: 'not started', notes: 'Advanced data cleaning and manipulation at enterprise levels.' },
    { id: 'yt5', sequence: 5, topic: 'Algorithm Analysis & Fundamentals', channel: 'Abdul Bari', skill: 'DSA', playlist: 'Algorithms Playlist', link: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZurVyYJXk556G5ycODJTB', status: 'not started', notes: 'Classic whiteboard explanations of time/space complexity and algorithms.' },
    { id: 'yt6', sequence: 6, topic: 'Blind 75 & NeetCode 150', channel: 'NeetCode', skill: 'DSA', playlist: 'LeetCode Problem Solutions', link: 'https://www.youtube.com/c/NeetCode/playlists', status: 'not started', notes: 'Gold standard for placement prep in Python.' },
    { id: 'yt7', sequence: 7, topic: 'SDE Placement Sheet', channel: 'Take U Forward', skill: 'DSA', playlist: 'A-Z DSA Placement Course', link: 'https://www.youtube.com/c/takeUforward/playlists', status: 'not started', notes: 'Striver\'s SDE sheet. Essential for graphs, trees, and dynamic programming.' },
    { id: 'yt8', sequence: 8, topic: 'System Design Fundamentals', channel: 'ByteByteGo', skill: 'System Design', playlist: 'System Design Primer', link: 'https://www.youtube.com/c/ByteByteGo/playlists', status: 'not started', notes: 'Author Alex Xu\'s visual animations explaining rate limiters, databases, notification systems.' },
    { id: 'yt9', sequence: 9, topic: 'Scaling & Database Schema Design', channel: 'Gaurav Sen', skill: 'System Design', playlist: 'System Design Series', link: 'https://www.youtube.com/c/GauravSen/playlists', status: 'not started', notes: 'Database schema scaling, trade-offs of microservices.' },
    { id: 'yt10', sequence: 10, topic: 'MLOps Zoomcamp & Cloud Deployment', channel: 'DataTalksClub', skill: 'ML', playlist: 'MLOps Zoomcamp', link: 'https://www.youtube.com/c/DataTalksClub/playlists', status: 'not started', notes: 'Covers MLOps, model deployment, Docker, cloud basics.' },
    { id: 'yt11', sequence: 11, topic: 'Modern Data Engineering Stack', channel: 'Seattle Data Guy', skill: 'Data Engineering', playlist: 'Data Engineering Playlist', link: 'https://www.youtube.com/c/TheSeattleDataGuy/playlists', status: 'not started', notes: 'SQL optimization, ETL pipelines, analytics architectures.' },
    { id: 'yt12', sequence: 12, topic: 'Advanced Python, Flask & Django', channel: 'Corey Schafer', skill: 'Python', playlist: 'Flask/Django Tutorials', link: 'https://www.youtube.com/c/CoreySchafer/playlists', status: 'not started', notes: 'Definitive resource for advanced Python scripting, Flask, Django APIs.' },
    { id: 'yt13', sequence: 13, topic: 'FastAPI & Python Automation', channel: 'Tech With Tim', skill: 'Python', playlist: 'Python Automation & FastAPI', link: 'https://www.youtube.com/c/TechWithTim/playlists', status: 'not started', notes: 'FastAPI, web scraping, automation scripting.' },
    { id: 'yt14', sequence: 14, topic: 'Frontend & Backend Crash Courses', channel: 'Traversy Media', skill: 'Web Dev', playlist: 'Web Development Crash Courses', link: 'https://www.youtube.com/c/TraversyMedia/playlists', status: 'not started', notes: 'Frontend/backend web dev fundamentals crash courses.' },
    { id: 'yt15', sequence: 15, topic: 'Mock Technical & Behavioral Interviews', channel: 'IGotAnOffer', skill: 'Placement Strategy', playlist: 'Software Engineer Mock Interviews', link: 'https://www.youtube.com/c/IGotAnOffer/playlists', status: 'not started', notes: 'Watch real engineers break down problems under pressure.' },
    { id: 'yt16', sequence: 16, topic: 'Git, GitHub & Open Source Strategy', channel: 'Kunal Kushwaha', skill: 'Placement Strategy', playlist: 'Git/GitHub Tutorials', link: 'https://www.youtube.com/c/KunalKushwaha/playlists', status: 'not started', notes: 'High-quality Git/GitHub basics and open source guidance.' }
  ];

  const projects = [
    ["Tata Steel ML Work", "Existing internship ML pipeline, RF model, SHAP, model card, MLflow later"],
    ["Salary Predictor Streamlit App", "SHAP + PDP, deploy publicly, add app URL to resume"],
    ["EV Anomaly Detector", "DBSCAN and Isolation Forest comparison notebook"],
    ["LangChain RAG Chatbot", "Q&A over project PDFs, FAISS/Chroma awareness, interview talking point"],
    ["Kaggle Notebooks", "Public EDA and modelling notebooks with rankings"],
    ["Recommendation System", "MovieLens collaborative filtering project"],
    ["Power BI Placement Dashboard", "Dashboard v2 with new visualisations and LinkedIn publish"],
    ["Capstone Project", "NLP sentiment/text classification or forecasting, deployed publicly"]
  ].map((item, index) => ({
    id: `project-${index + 1}`,
    projectName: item[0],
    githubLink: "",
    deploymentLink: "",
    status: index === 0 ? "in progress" : "planning",
    progress: index === 0 ? 25 : 0,
    readmeCompleted: false,
    shapAdded: false,
    mlflowAdded: false,
    dockerized: false,
    notes: item[1]
  }));

  const monthlyMilestones = [
    { month: "May-Jun", leetcode: "15 Easy", applications: "5+", hackathons: "Tata Steel AI", certs: "InfyTQ + GenAI for Everyone", aiGoal: "SHAP + Feature Eng + Streamlit deployed", target: "GitHub + LinkedIn polished" },
    { month: "Jul", leetcode: "30 Easy", applications: "10+", hackathons: "Unstop DS x2", certs: "ML Spec ongoing", aiGoal: "Time series + Ensembles + DBSCAN v2", target: "SQL HackerRank Advanced badge" },
    { month: "Aug", leetcode: "50 Easy", applications: "20+", hackathons: "Mu Sigma + Juspay + TCS NQT", certs: "DL Spec start", aiGoal: "LangChain RAG demo", target: "1 interview call" },
    { month: "Sep", leetcode: "10 Medium", applications: "25+", hackathons: "Flipkart GRiD", certs: "AWS cert earned", aiGoal: "MLflow on all projects", target: "Top 40% Kaggle" },
    { month: "Oct", leetcode: "20 Medium", applications: "30+", hackathons: "MachineHack", certs: "TF Dev Cert", aiGoal: "RAG chatbot on GitHub", target: "1 final round interview" },
    { month: "Nov", leetcode: "30 Medium", applications: "35+", hackathons: "Unstop Nov", certs: "MLOps Zoomcamp done", aiGoal: "Capstone deployed", target: "Offer in pipeline" },
    { month: "Dec", leetcode: "40 Medium", applications: "40+", hackathons: "-", certs: "All certs updated on resume", aiGoal: "Capstone + all projects live", target: "OFFER ACCEPTED 6+ LPA" }
  ].map((item, index) => Object.assign({ id: `milestone-${index + 1}`, completed: false, notes: "" }, item));

  const dailyRoutine = [
    ["6:00-7:00 AM", "LeetCode", "1-2 problems first; keep streak alive"],
    ["7:00-9:00 AM", "Core learning block", "ML/SQL/Python/DL current week goal"],
    ["9:00 AM-12:00 PM", "Project / internship work", "Build, code, document"],
    ["2:00-4:00 PM", "Applications + outreach", "Apply, DM recruiters, track status"],
    ["4:00-6:00 PM", "Competition / Kaggle / YT", "Hackathon work or watch one video"],
    ["9:00-10:00 PM", "Review + plan tomorrow", "30-minute debrief"]
  ];

  const realityChecks = [
    "Focus on skill proof: portfolio, GitHub, AI/ML projects, certifications, and measurable outcomes beat CGPA-first positioning.",
    "Compete on Unstop, Kaggle, and MachineHack because these channels avoid CGPA filters and create fresh proof.",
    "Apply directly to analytics-first companies such as Mu Sigma, EXL, Genpact, LatentView, Tiger Analytics, and Fractal.",
    "Use test-based IT tracks such as TCS Digital, Wipro Elite, Cognizant GenC Next, Accenture PackageD, and Infosys DSE.",
    "Add GenAI/LLM talking points through the LangChain RAG demo and MLflow/MLOps work."
  ].map((text, index) => ({ id: `reality-${index + 1}`, text }));

  const nonNegotiableRules = [
    "Never mention CGPA first; lead with project proof and Tata Steel ML impact.",
    "Always add 3 numbers per project: metric, efficiency gain, dataset size, accuracy, latency, or business impact.",
    "Always apply off-campus directly; analytics firms hire rolling and often have no CGPA filter.",
    "Never skip Unstop; ML background plus challenges can produce direct interview shortlist routes.",
    "Always add a GenAI talking point: LangChain RAG demo, vector DB awareness, MLflow tracking, or LLM Zoomcamp work.",
    "Do one Kaggle or MachineHack activity every month to keep your profile active.",
    "Follow up every application after 7 days with a LinkedIn DM to the recruiter.",
    "Ask KIIT alumni for referrals before applying to target companies.",
    "For Wipro and Accenture, target higher tracks: Elite Pro and PackageD.",
    "Apply for Coursera financial aid for paid courses; prioritize ML Specialization, Google Advanced DA, DL Specialization, IBM ML.",
    "Treat the Tata Steel internship as the number one asset and mention it everywhere with metrics.",
    "Keep 10+ processes open simultaneously; do not prepare for only one company at a time."
  ].map((text, index) => ({ id: `rule-${index + 1}`, text, done: false }));

  const applicationCheatSheet = [
    ["Mu Sigma", "Trainee Decision Scientist", "Rolling/Aug-Oct", "Rs.4.5-6 LPA", "mu-sigma.com/career + Unstop"],
    ["LatentView", "Analyst", "Rolling NOW", "Rs.4.5-5.5 LPA", "latentview.com/careers"],
    ["EXL Service", "Data Analyst/Engineer", "Rolling NOW", "Rs.4-7 LPA", "exlservice.com/careers"],
    ["Genpact", "Associate Data Analyst", "Rolling NOW", "Rs.4-5.5 LPA", "genpact.com/careers"],
    ["Wipro", "Elite / Elite Pro", "Aug-Sep 2026", "Rs.6.5-10 LPA", "NLTH test; target higher track"],
    ["HCL Tech", "Fresher Tech Roles", "Rolling/Sep-Nov", "Rs.4-6 LPA", "hcltech.com/careers + Naukri"],
    ["Accenture", "ASE / PackageD Track", "Aug-Oct 2026", "Rs.4.5 / Rs.6.5 LPA", "Target PackageD"],
    ["TCS", "Digital/Prime Track NQT", "Aug-Sep 2026", "Rs.7+ LPA", "nextstep.tcs.com"],
    ["Infosys", "DSE via InfyTQ", "Aug-Oct 2026", "Rs.6.25 LPA", "Complete InfyTQ now"],
    ["Cognizant", "GenC Next D&A", "Aug-Sep 2026", "Rs.6.5 LPA", "cognizant.com/careers"],
    ["Capgemini", "Fresher Analyst", "Aug-Oct 2026", "Rs.4-5.5 LPA", "capgemini.com/careers"],
    ["Tiger Analytics", "Associate/Analyst", "Rolling", "Rs.5-8 LPA", "tiger-analytics.com/careers"],
    ["Gramener", "Data Scientist/Viz", "Rolling", "Rs.4-6 LPA", "gramener.com/careers"],
    ["Fractal Analytics", "Analyst", "Rolling", "Rs.5-9 LPA", "fractal.ai/careers"],
    ["Sigmoid", "Data Engineer", "Rolling", "Rs.6-10 LPA", "sigmoid.com/careers"],
    ["Swiggy", "DS Engineer Fresher", "Rolling LinkedIn", "Rs.6-10 LPA", "careers.swiggy.com"],
    ["Meesho", "Data Analyst", "Rolling", "Rs.6-10 LPA", "meesho.io/careers"],
    ["Publicis Sapient", "ASE", "Rolling", "Rs.6-8 LPA", "publicissapient.com/careers"],
    ["ZS Associates", "DA Associate", "Aug-Oct 2026", "Rs.8-12 LPA", "Case study prep required"],
    ["JP Morgan", "Code for Good", "Mid-2026", "Internship path", "careers.jpmorgan.com"]
  ].map((item, index) => ({
    id: `apply-${index + 1}`,
    company: item[0],
    role: item[1],
    window: item[2],
    ctc: item[3],
    action: item[4],
    applied: false,
    notes: ""
  }));

  const weekSource = [
    [1, "2026-05-19", "2026-05-25", "phase-1", "GitHub portfolio, Unstop alerts, InfyTQ start, SHAP on Tata Steel RF model", ["Polish all 4 project READMEs", "InfyTQ modules 1-3", "Register Tata Steel AI Hackathon", "Cold-connect 5 analytics recruiters", "MachineHack practice contest"], ["StatQuest SHAP", "StatQuest Random Forest", "Start GenAI for Everyone", "Start ML Specialization Week 1"], ["GitHub live with 4 polished repos", "Unstop alerts active", "InfyTQ 30% done", "SHAP plots added"]],
    [2, "2026-05-26", "2026-06-01", "phase-1", "Pandas advanced, SQL window functions, cross-validation, Tata Steel dashboard", ["Daily Pandas/SQL HackerRank", "InfyTQ modules 4-7", "Update LinkedIn intern title", "Apply EXL + Genpact", "MachineHack contest"], ["Alex The Analyst SQL", "techTFQ windows", "Keith Galli Pandas", "ML Specialization Week 2"], ["SQL windows mastered", "InfyTQ 60% done", "2 applications sent"]],
    [3, "2026-06-02", "2026-06-08", "phase-1", "Scikit-learn pipelines, InfyTQ completion, JP Morgan Code for Good, resume v2", ["InfyTQ final modules + exam", "Quantify Tata Steel resume bullets", "JP Morgan application", "Apply LatentView + Mu Sigma", "Join one Kaggle tabular competition"], ["NeuralNine Scikit-learn", "ML Specialization Weeks 3-4", "Start SQL for Data Science"], ["InfyTQ cert earned", "Resume v2 quantified", "JP Morgan applied", "4 portals active"]],
    [4, "2026-06-09", "2026-06-15", "phase-1", "Tata Steel AI Hackathon active week, feature engineering template, pitch script", ["Hackathon submission focus", "Build reusable EDA + feature engineering notebook", "Pitch practice on Loom", "Apply Cognizant GenC Next", "Post hackathon experience"], ["Corey Schafer Matplotlib", "Krish Naik Feature Engineering", "ML Specialization Week 5"], ["Hackathon submitted", "Feature engineering template on GitHub", "LinkedIn post 50+ reactions"]],
    [5, "2026-06-16", "2026-06-22", "phase-1", "Statistics reinforcement, SHAP/PDP on Salary Predictor, Streamlit deploy, recruiter outreach", ["SHAP + PDP on Salary Predictor", "Deploy Streamlit app", "Send 10 recruiter DMs", "20 probability + hypothesis tests", "Update resume with live app"], ["Data Professor Streamlit", "StatQuest statistics", "Start Statistics with Python or Khan Academy", "Complete GenAI for Everyone"], ["SHAP + PDP on GitHub", "Live Streamlit URL", "10 recruiter DMs sent"]],
    [6, "2026-06-23", "2026-06-29", "phase-1", "Phase 1 consolidation, bias-variance, company research, DSA warm-up", ["Mu Sigma case + Python Q&A", "Record 3 project walkthroughs", "Apply Gramener + Tiger Analytics", "Phase 1 retro", "MachineHack + Kaggle notebook commit"], ["StatQuest regularization", "Finish ML Specialization"], ["All GitHub projects polished", "15 LeetCode Easys done", "6 company portals active"]],
    [7, "2026-06-30", "2026-07-06", "phase-2", "Arrays and hashing, advanced SQL, time series intro, Kaggle notebooks", ["2 LeetCode problems per day", "HackerRank SQL Advanced badge", "Research Swiggy/Razorpay openings", "Publish Kaggle EDA notebook", "Commit 3 notebooks"], ["Seattle Data Guy ETL", "Start Google Advanced DA", "Start IBM ML Professional"], ["Arrays/hashing solid", "SQL Advanced badge", "Kaggle public notebook live"]],
    [8, "2026-07-07", "2026-07-13", "phase-2", "Linked lists, stacks, queues, time series mini-project, DBSCAN extension, AWS modules", ["Linked list + stack problems", "ARIMA + Prophet project", "Add DBSCAN to EV project", "Register live Unstop DS challenge", "AWS modules 1-2"], ["Karpathy Zero to Hero start", "Fast.ai Lesson 1", "AWS free modules"], ["15+ LeetCode logged", "Time series project on GitHub", "AWS 20% complete"]],
    [9, "2026-07-14", "2026-07-20", "phase-2", "Binary search, Python OOP, NLP basics, one mock interview", ["Binary search problems", "Build ML experiment tracker class", "Pramp mock interview", "Update Power BI dashboard", "Unstop contest + LinkedIn article"], ["Corey Schafer OOP", "Krish Naik NLP TF-IDF", "DeepLearning.AI LangChain"], ["Binary search fluent", "1 mock interview done", "LinkedIn article 200+ views"]],
    [10, "2026-07-21", "2026-07-27", "phase-2", "Trees, ensemble theory, ANN on Tata Steel data, Mu Sigma prep", ["Tree traversal LeetCode", "Voting Classifier + Random Forest notebook", "ANN model vs RF", "Mu Sigma sample tests", "MachineHack + apply Genpact"], ["StatQuest ensembles", "3Blue1Brown neural nets", "DL Specialization Week 1"], ["Trees/BFS solid", "Ensemble notebook", "ANN comparison on GitHub"]],
    [11, "2026-07-28", "2026-08-03", "phase-2", "CNN and transfer learning, BERT sentiment, TCS NQT + Wipro registration", ["Fast.ai lessons 1-2", "HuggingFace sentiment pipeline", "TCS/Wipro sample papers", "Apply ZS + Fractal", "Kaggle prediction submission"], ["Karpathy Zero to Hero continued", "DL Specialization Weeks 2-3", "ChatGPT Prompt Engineering"], ["Transfer learning mini-project", "BERT project on GitHub", "TCS NQT + Wipro registered"]],
    [12, "2026-08-04", "2026-08-10", "phase-2", "Mu Sigma/Juspay/HCL challenges, DP intro, LangChain RAG, STAR stories", ["Register 3 Unstop challenges", "5 easy DP problems", "Build PDF Q&A RAG demo", "Write 6 STAR stories", "Dry-run analytics case interview"], ["Sam Witteveen LangChain", "Start LLM Zoomcamp"], ["3 challenges registered", "5 DP problems done", "RAG demo on GitHub", "6 STAR stories written"]],
    [13, "2026-08-11", "2026-08-17", "phase-2", "TCS/Wipro verbal reasoning, SQL optimisation, LoRA awareness, Accenture Hack the Future", ["TCS/Wipro mock tests", "SQLite explain plans", "Unstop challenge submissions", "Message 5 KIIT seniors", "Register Accenture if live"], ["techTFQ query optimisation", "DL Specialization Weeks 4-5"], ["Mock score above 75%", "Unstop submitted", "5 alumni contacted"]],
    [14, "2026-08-18", "2026-08-31", "phase-2", "Phase 2 consolidation, TCS NQT attempt, XGBoost/LightGBM, Cognizant + HCL", ["TCS NQT timed mocks", "Attempt TCS NQT if window open", "Register Cognizant + HCL", "Application tracker with 15+ companies", "2 LeetCode daily"], ["IBM ML halfway", "Krish Naik XGBoost/LightGBM"], ["50 LeetCode Easys done", "TCS NQT attempted", "15+ companies tracked", "XGBoost Kaggle submission"]],
    [15, "2026-09-01", "2026-09-07", "phase-3", "Flipkart GRiD registration, XGBoost/LightGBM/CatBoost, Optuna, PackageD prep", ["Register Flipkart GRiD team", "Kaggle notebook with Optuna", "Mu Sigma/EXL case prep", "Apply Tiger Analytics", "Improve Kaggle model to top 40%"], ["Krish Naik XGBoost", "Featuretools demo", "Complete DL Specialization", "Start TensorFlow Developer prep"], ["GRiD registered", "Optuna in toolkit", "Kaggle top 40% target set"]],
    [16, "2026-09-08", "2026-09-14", "phase-3", "AWS exam prep, ML system design, recommendation system, Wipro Techathon + Infosys Ingenious", ["AWS mock exams", "Read ML systems notes", "Timed SQL+Python mock interview", "GRiD Round 1 + Wipro submission", "MovieLens recommendation project"], ["Exponent ML System Design", "AWS prep complete"], ["AWS prep 80% done", "1 recorded mock interview", "GRiD Round 1 submitted", "Recommendation system on GitHub"]],
    [17, "2026-09-15", "2026-09-21", "phase-3", "AWS exam, MLflow on Tata Steel, vector DB/RAG architecture, salary script", ["AWS final review + exam", "Add MLflow tracking", "Salary expectations script", "LinkedIn Tata Steel case study", "MachineHack + Unstop challenge"], ["Krish Naik MLflow", "Start MLOps Zoomcamp"], ["AWS cert earned", "MLflow tracking on GitHub", "Salary script ready"]],
    [18, "2026-09-22", "2026-09-28", "phase-3", "GRiD main submission, anomaly v2, Docker, graph DSA", ["GRiD main round focus", "DBSCAN vs Isolation Forest notebook", "Apply Fractal/Sigmoid/Quantiphi", "Dockerize Streamlit app", "Graph BFS/DFS problems"], ["Nicholas Renotte Docker", "TensorFlow Developer prep midway"], ["GRiD main round submitted", "Anomaly detector v2", "Dockerized app on DockerHub"]],
    [19, "2026-09-29", "2026-10-05", "phase-3", "Mock interview marathon, advanced SQL, A/B testing, MachineHack October", ["Full mock DS interview", "SQL advanced practice", "MachineHack October Round 1", "Research EXL/Genpact/WNS interviews", "Second mock + debrief"], ["Ken Jee DS Interview", "StatQuest A/B testing"], ["2 mock interviews done", "SQL advanced solid", "MachineHack October submitted"]],
    [20, "2026-10-06", "2026-10-12", "phase-3", "MLOps, LLM fine-tuning awareness, vector search RAG chatbot, 30 Medium checkpoint", ["MLflow on Tata Steel + Salary Predictor", "Build RAG chatbot over project PDFs", "ZS case prep", "LeetCode medium sprint", "Kaggle + 10 LinkedIn DMs"], ["Karpathy GPT", "LLM Zoomcamp Module 3"], ["MLflow on major projects", "RAG demo app", "30 Mediums done"]],
    [21, "2026-10-13", "2026-10-19", "phase-3", "Final hackathon push, top 50 ML interview Qs, transformers review, Power BI v2", ["Hackathon/Unstop focus", "Write top 50 ML answers", "Power BI dashboard v2", "Negotiation practice", "Review attention mechanism"], ["Guy in a Cube Power BI", "3Blue1Brown Attention"], ["Top 50 ML Qs answered", "Power BI dashboard live", "Negotiation script ready"]],
    [22, "2026-10-20", "2026-10-31", "phase-3", "Portfolio consolidation, project metrics/SHAP/readmes, application audit, walkthrough video", ["GitHub profile README", "Application tracker audit", "Follow up pending", "Record 10-minute portfolio video", "Phase 4 top 10 companies"], ["Complete TensorFlow Developer", "IBM ML final modules"], ["GitHub README complete", "25+ applications tracked", "Portfolio video recorded"]],
    [23, "2026-11-01", "2026-11-07", "phase-4", "Company-specific interview prep, capstone start, weak DSA topics, referral push", ["Glassdoor pattern prep", "Start NLP/forecasting capstone", "10 KIIT alumni DMs", "Capstone data collection + EDA", "Revisit weak topics"], ["Krish Naik NLP", "Complete IBM ML Professional"], ["Interview-ready", "Capstone 20% done", "10 referrals requested"]],
    [24, "2026-11-08", "2026-11-14", "phase-4", "Capstone modelling, MLflow + SHAP, system design, November challenges", ["Capstone modelling + evaluation", "A/B testing + feature stores", "Register Unstop November challenge", "MachineHack November contest", "Add MLflow + SHAP"], ["Exponent ML System Design", "LLM Zoomcamp final module"], ["Capstone model trained", "A/B testing clear", "November challenges active"]],
    [25, "2026-11-15", "2026-11-21", "phase-4", "Capstone complete + deploy, interview simulation, Dec drives", ["Capstone polish + deployment", "2-hour interview simulation", "Check Dec openings", "LinkedIn capstone post", "Apply new drives"], ["Complete MLOps Zoomcamp"], ["Capstone deployed", "Full simulation done", "LinkedIn post 100+ reactions"]],
    [26, "2026-11-22", "2026-11-30", "phase-4", "Convert interviews to offers, GenAI talking point, CTC components, Kaggle active", ["Attend pending interviews", "Research CTC breakdown", "Submit one Kaggle prediction", "Send thank-you emails", "Apply 5 more from master list"], ["Ken Jee final DS interview review"], ["At least one offer/final round", "GenAI talking point ready", "Kaggle active"]],
    [27, "2026-12-01", "2026-12-07", "phase-4", "December drives, final 10 Mediums, key ML refresh, negotiation if offer", ["Apply Dec cohort", "LeetCode final sprint", "Negotiate if offer in hand", "GitHub final audit", "Refresh bias-variance/regularisation"], ["Any pending Coursera cert final push"], ["Dec applications submitted", "40 Mediums total", "Negotiation initiated if applicable"]],
    [28, "2026-12-08", "2026-12-14", "phase-4", "Final rounds, ML pipeline system design, backup walk-ins, Kaggle wrap", ["Company-specific final prep", "Walk-in drive search", "Follow up every pending application", "Kaggle final submission", "Add ranking to resume"], ["Exponent ML System Design final review"], ["Final rounds attended", "ML system design rehearsed", "Walk-ins identified"]],
    [29, "2026-12-15", "2026-12-21", "phase-4", "Offer acceptance, last applications, resume cert updates, LinkedIn update", ["Review offers vs 6 LPA benchmark", "Accept after negotiation if 6+ LPA", "Update LinkedIn", "Send joining confirmation", "Rest"], ["Archive final READMEs"], ["Offer accepted at 6+ LPA", "LinkedIn updated", "Joining date confirmed"]],
    [30, "2026-12-22", "2026-12-31", "phase-4", "Pre-joining research, complete pending certs, thank network, 90-day plan", ["Read company blog and reviews", "Archive repos with READMEs + model cards", "Thank 10+ people", "Write 90-day plan", "Prepare joining documents"], ["Complete pending certs"], ["Pre-joining research done", "Network thanked", "90-day plan written", "Placed at 6+ LPA"]]
  ];

  function task(text, prefix, index) {
    return {
      id: `${prefix}-${index + 1}`,
      text,
      done: false
    };
  }

  function buildWeek(row) {
    const phase = phases.find((item) => item.id === row[3]);
    const goalText = row[4];
    const tasks = row[5];
    const learning = row[6];
    const outcomes = row[7];
    const n = row[0];
    const categories = {
      goals: goalText.split(", ").map((text, index) => task(text, `w${n}-goal`, index)),
      aiMlTasks: tasks.filter((text) => /SHAP|ML|Kaggle|model|RAG|capstone|Tata|Streamlit|XGBoost|Docker|Power BI|feature|notebook|AWS|LangChain|BERT|ANN|DBSCAN|MLflow|system|forecasting|NLP|project/i.test(text)).map((text, index) => task(text, `w${n}-aiml`, index)),
      dsaTasks: tasks.filter((text) => /LeetCode|DSA|DP|Tree|Graph|Medium|Easy|Binary|Linked list|problems/i.test(text)).map((text, index) => task(text, `w${n}-dsa`, index)),
      applications: tasks.filter((text) => /Apply|application|portal|DM|recruiter|LinkedIn|alumni|referral|follow up|offers|offer|interview/i.test(text)).map((text, index) => task(text, `w${n}-app`, index)),
      certifications: learning.filter((text) => /CERT|Certification|Specialization|Zoomcamp|AWS|InfyTQ|Course|Coursera|Developer|Professional|Advanced|ML|DL/i.test(text)).map((text, index) => task(text, `w${n}-cert`, index)),
      hackathons: tasks.filter((text) => /Hackathon|MachineHack|Unstop|GRiD|Code for Good|challenge|contest/i.test(text)).map((text, index) => task(text, `w${n}-hack`, index)),
      projectTasks: tasks.filter((text) => /GitHub|README|deploy|Docker|notebook|dashboard|project|portfolio|capstone|video|Loom|model card/i.test(text)).map((text, index) => task(text, `w${n}-proj`, index))
    };

    return {
      id: `week-${n}`,
      number: n,
      title: `Week ${n}`,
      phaseId: phase.id,
      phase: phase.name,
      startDate: row[1],
      endDate: row[2],
      summary: goalText,
      categories,
      dailyTasks: tasks.map((text, index) => task(text, `w${n}-daily`, index)),
      learningResources: learning,
      outcomes,
      notes: "",
      complete: false
    };
  }

  const roadmapWeeks = weekSource.map(buildWeek);

  const calendarEvents = [
    ...roadmapWeeks.map((week) => ({
      id: `milestone-${week.number}`,
      title: `${week.title}: ${week.summary.split(",")[0]}`,
      start: week.startDate,
      end: week.endDate,
      category: "milestone",
      reminder: "Weekly milestone",
      notes: week.summary
    })),
    ...hackathons.map((hack) => ({
      id: `event-${hack.id}`,
      title: hack.hackathonName,
      start: hack.deadline,
      category: "hackathon",
      reminder: hack.priority,
      notes: hack.notes
    })),
    ...certifications.slice(0, 12).map((cert) => ({
      id: `event-${cert.id}`,
      title: cert.certificationName,
      start: cert.deadline,
      category: "certification",
      reminder: "Certification deadline",
      notes: cert.notes
    })),
    { id: "event-tcs-nqt", title: "TCS NQT Digital Track Attempt", start: "2026-08-20", category: "contest", reminder: "Attempt window", notes: "Attempt if window is open." },
    { id: "event-grid-register", title: "Flipkart GRiD Registration", start: "2026-09-01", category: "hackathon", reminder: "Register", notes: "Team registration on Unstop." },
    { id: "event-portfolio-audit", title: "Application Tracker Audit", start: "2026-10-22", category: "reminder", reminder: "Follow up pending applications", notes: "Target 25+ companies tracked." }
  ];

  const dsaProblems = [
    { id: 'd1', problem: 'Two Sum', difficulty: 'easy', topic: 'Arrays', platform: 'LeetCode', status: 'solved', date: '2026-06-02', link: 'https://leetcode.com/problems/two-sum/', solution: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []', notes: 'Classic hash map lookup in O(n) time and O(n) space.' },
    { id: 'd2', problem: '3Sum', difficulty: 'medium', topic: 'Arrays', platform: 'LeetCode', status: 'attempted', date: '2026-06-02', link: 'https://leetcode.com/problems/3sum/', solution: 'def threeSum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums)-2):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        l, r = i+1, len(nums)-1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0: l += 1\n            elif s > 0: r -= 1\n            else:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n    return res', notes: 'Two-pointer approach after sorting. Be careful with duplicates.' },
    { id: 'd3', problem: 'Median of Two Sorted Arrays', difficulty: 'hard', topic: 'Binary Search', platform: 'LeetCode', status: 'todo', date: '2026-06-02', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', solution: '', notes: 'Binary search on partition size. Hard to get edge cases right in O(log(min(m, n))).' },
    { id: 'd4', problem: 'Contains Duplicate', difficulty: 'easy', topic: 'Hashing', platform: 'NeetCode', status: 'solved', date: '2026-06-02', link: 'https://neetcode.io/problems/contains-duplicate', solution: 'def containsDuplicate(nums):\n    return len(nums) != len(set(nums))', notes: 'Simple set logic. Space O(N), Time O(N).' },
    { id: 'd5', problem: 'Top K Frequent Elements', difficulty: 'medium', topic: 'Hashing', platform: 'NeetCode', status: 'solved', date: '2026-06-02', link: 'https://neetcode.io/problems/top-k-frequent-elements', solution: 'import collections\ndef topKFrequent(nums, k):\n    count = collections.Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for num, freq in count.items():\n        buckets[freq].append(num)\n    res = []\n    for i in range(len(buckets) - 1, 0, -1):\n        for n in buckets[i]:\n            res.append(n)\n            if len(res) == k:\n                return res', notes: 'Solved using bucket sort algorithm in O(N) time.' },
    { id: 'd6', problem: 'Merge k Sorted Lists', difficulty: 'hard', topic: 'Linked Lists', platform: 'NeetCode', status: 'todo', date: '2026-06-02', link: 'https://neetcode.io/problems/merge-k-sorted-lists', solution: '', notes: 'Use a min-heap or divide-and-conquer merge algorithm.' },
    { id: 'd7', problem: 'Watermelon', difficulty: 'easy', topic: 'Math', platform: 'Codeforces', status: 'solved', date: '2026-06-02', link: 'https://codeforces.com/problemset/problem/4/A', solution: '#include <iostream>\nusing namespace std;\nint main() {\n    int w;\n    cin >> w;\n    if (w > 2 && w % 2 == 0) cout << "YES";\n    else cout << "NO";\n    return 0;\n}', notes: 'Simple check for even numbers greater than 2.' },
    { id: 'd8', problem: 'Product of Three Numbers', difficulty: 'medium', topic: 'Greedy', platform: 'Codeforces', status: 'attempted', date: '2026-06-02', link: 'https://codeforces.com/problemset/problem/1294/C', solution: '', notes: 'Find three distinct factors a, b, c such that a*b*c = N.' },
    { id: 'd9', problem: 'Booking System', difficulty: 'hard', topic: 'Greedy', platform: 'Codeforces', status: 'todo', date: '2026-06-02', link: 'https://codeforces.com/problemset/problem/416/C', solution: '', notes: 'Sort requests by cost, assign to smallest suitable tables.' },
    { id: 'd10', problem: 'Solve Me First', difficulty: 'easy', topic: 'Math', platform: 'HackerRank', status: 'solved', date: '2026-06-02', link: 'https://www.hackerrank.com/challenges/solve-me-first/problem', solution: 'def solveMeFirst(a,b):\n\treturn a+b', notes: 'Simple addition.' },
    { id: 'd11', problem: 'The Report', difficulty: 'medium', topic: 'SQL', platform: 'HackerRank', status: 'solved', date: '2026-06-02', link: 'https://www.hackerrank.com/challenges/the-report/problem', solution: 'SELECT IF(Grade < 8, NULL, Name), Grade, Marks\nFROM Students JOIN Grades\nON Marks BETWEEN Min_Mark AND Max_Mark\nORDER BY Grade DESC, Name ASC, Marks ASC;', notes: 'Joins and conditional projection using IF / CASE.' },
    { id: 'd12', problem: 'Array Manipulation', difficulty: 'hard', topic: 'Arrays', platform: 'HackerRank', status: 'todo', date: '2026-06-02', link: 'https://www.hackerrank.com/challenges/crush/problem', solution: '', notes: 'Solved using difference array / prefix sum array technique in O(N + M) instead of O(N*M).' },
    { id: 'd13', problem: 'Missing number in array', difficulty: 'easy', topic: 'Sorting', platform: 'GeeksforGeeks', status: 'solved', date: '2026-06-02', link: 'https://www.geeksforgeeks.org/problems/missing-number-in-array1416/1', solution: 'int missingNumber(vector<int>& array, int n) {\n    int sum = n * (n + 1) / 2;\n    int actual_sum = 0;\n    for(int x : array) actual_sum += x;\n    return sum - actual_sum;\n}', notes: 'Arithmetic progression sum formula.' },
    { id: 'd14', problem: 'Kadane\'s Algorithm', difficulty: 'medium', topic: 'Dynamic Programming', platform: 'GeeksforGeeks', status: 'solved', date: '2026-06-02', link: 'https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1', solution: 'long long maxSubarraySum(int arr[], int n) {\n    long long max_so_far = arr[0];\n    long long curr_max = arr[0];\n    for (int i = 1; i < n; i++) {\n        curr_max = max((long long)arr[i], curr_max + arr[i]);\n        max_so_far = max(max_so_far, curr_max);\n    }\n    return max_so_far;\n}', notes: 'Find max contiguous subarray in O(n) time.' },
    { id: 'd15', problem: 'Edit Distance', difficulty: 'hard', topic: 'Dynamic Programming', platform: 'GeeksforGeeks', status: 'todo', date: '2026-06-02', link: 'https://www.geeksforgeeks.org/problems/edit-distance3702/1', solution: '', notes: 'String distance dynamic programming with standard insertions, deletions, substitutions.' }
  ];

  const syncAccounts = {
    leetcode: { handle: '', status: 'Disconnected', lastSynced: '' },
    codeforces: { handle: '', status: 'Disconnected', lastSynced: '' },
    neetcode: { handle: '', status: 'Disconnected', lastSynced: '' },
    hackerrank: { handle: '', status: 'Disconnected', lastSynced: '' },
    geeksforgeeks: { handle: '', status: 'Disconnected', lastSynced: '' }
  };

  OS.Seed = {
    version: 1,
    companyStatuses,
    hackathonStatuses,
    certificationStatuses,
    youtubeStatuses,
    projectStatuses,
    phases,
    companies,
    hackathons,
    certifications,
    youtubeResources,
    roadmapWeeks,
    projects,
    monthlyMilestones,
    dailyRoutine,
    realityChecks,
    nonNegotiableRules,
    applicationCheatSheet,
    calendarEvents,
    dsaProblems,
    syncAccounts
  };
})(window.PlacementOS = window.PlacementOS || {});
