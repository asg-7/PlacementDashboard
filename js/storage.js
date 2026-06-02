(function (OS) {
  "use strict";

  const STORAGE_KEY = "placementOS.v1";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function todayISO() {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10);
  }

  function makeInitialState() {
    return {
      version: OS.Seed.version,
      createdAt: new Date().toISOString(),
      companies: clone(OS.Seed.companies),
      hackathons: clone(OS.Seed.hackathons),
      certifications: clone(OS.Seed.certifications),
      youtubeResources: clone(OS.Seed.youtubeResources),
      roadmapWeeks: clone(OS.Seed.roadmapWeeks),
      projects: clone(OS.Seed.projects),
      monthlyMilestones: clone(OS.Seed.monthlyMilestones),
      dailyRoutine: clone(OS.Seed.dailyRoutine),
      realityChecks: clone(OS.Seed.realityChecks),
      nonNegotiableRules: clone(OS.Seed.nonNegotiableRules),
      applicationCheatSheet: clone(OS.Seed.applicationCheatSheet),
      calendarEvents: clone(OS.Seed.calendarEvents),
      dsaProblems: clone(OS.Seed.dsaProblems),
      activity: {}
    };
  }

  function readState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = makeInitialState();
      writeState(initial, false);
      return initial;
    }

    try {
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch (error) {
      console.warn("PlacementOS: localStorage was invalid. Starting from seed data.", error);
      const initial = makeInitialState();
      writeState(initial, false);
      return initial;
    }
  }

  function normalizeState(state) {
    const initial = makeInitialState();
    const merged = Object.assign(initial, state || {});

    Object.keys(initial).forEach((key) => {
      if (merged[key] == null) merged[key] = initial[key];
    });

    migrateState(merged, initial);
    return merged;
  }

  function migrateState(state, initial) {
    if (Array.isArray(state.companies)) {
      const fake = state.companies.find((company) => company.companyName === "Kaggle/Portfolio Stretch");
      const ltfs = initial.companies.find((company) => company.companyName === "LTFS");
      if (fake && ltfs) Object.assign(fake, ltfs, { id: fake.id, status: fake.status || ltfs.status });
    }

    ["monthlyMilestones", "nonNegotiableRules", "applicationCheatSheet"].forEach((key) => {
      if (!Array.isArray(state[key]) || !state[key].length) state[key] = clone(initial[key]);
    });
  }

  function writeState(state, record) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (record) {
      recordActivity(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }

  function mutate(mutator, options) {
    const state = readState();
    mutator(state);
    writeState(state, !(options && options.silent));
    document.dispatchEvent(new CustomEvent("placementos:state-change", { detail: state }));
    return state;
  }

  function resetState() {
    const initial = makeInitialState();
    writeState(initial, false);
    document.dispatchEvent(new CustomEvent("placementos:state-change", { detail: initial }));
    return initial;
  }

  function recordActivity(state, amount) {
    const day = todayISO();
    const current = Number(state.activity[day] || 0);
    state.activity[day] = current + (amount || 1);
  }

  function percent(done, total) {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  }

  function dateOnly(value) {
    if (!value) return null;
    return new Date(`${value}T00:00:00`);
  }

  function getAllWeekTasks(week) {
    const groups = week.categories || {};
    return Object.keys(groups).reduce((all, key) => all.concat(groups[key] || []), []);
  }

  function getWeekProgress(week) {
    const tasks = getAllWeekTasks(week);
    return {
      done: tasks.filter((task) => task.done).length,
      total: tasks.length,
      percent: percent(tasks.filter((task) => task.done).length, tasks.length)
    };
  }

  function getActiveWeek(state, dateValue) {
    const today = dateOnly(dateValue || todayISO());
    const weeks = state.roadmapWeeks || [];
    if (!weeks.length) return null;

    const current = weeks.find((week) => {
      const start = dateOnly(week.startDate);
      const end = dateOnly(week.endDate);
      return today >= start && today <= end;
    });
    if (current) return current;

    const upcoming = weeks.find((week) => today < dateOnly(week.startDate));
    return upcoming || weeks[weeks.length - 1];
  }

  function getCurrentMonthTarget() {
    const month = new Date().getMonth();
    if (month <= 5) return { applications: 5, dsaEasy: 15, dsaMedium: 0 };
    if (month === 6) return { applications: 10, dsaEasy: 30, dsaMedium: 0 };
    if (month === 7) return { applications: 20, dsaEasy: 50, dsaMedium: 0 };
    if (month === 8) return { applications: 25, dsaEasy: 50, dsaMedium: 10 };
    if (month === 9) return { applications: 30, dsaEasy: 50, dsaMedium: 20 };
    if (month === 10) return { applications: 35, dsaEasy: 50, dsaMedium: 30 };
    return { applications: 40, dsaEasy: 50, dsaMedium: 40 };
  }

  function getCurrentStreak(activity) {
    let streak = 0;
    const cursor = new Date(`${todayISO()}T00:00:00`);
    while (true) {
      const iso = cursor.toISOString().slice(0, 10);
      if (!activity[iso]) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function getRecentActivityDays(activity, days) {
    let active = 0;
    const cursor = new Date(`${todayISO()}T00:00:00`);
    for (let index = 0; index < days; index += 1) {
      const iso = cursor.toISOString().slice(0, 10);
      if (Number(activity[iso] || 0) > 0) active += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return active;
  }

  function computeMetrics(state) {
    const companies = state.companies || [];
    const certifications = state.certifications || [];
    const hackathons = state.hackathons || [];
    const dsaProblems = state.dsaProblems || [];
    const weeks = state.roadmapWeeks || [];
    const activeWeek = getActiveWeek(state);
    const activeWeekProgress = activeWeek ? getWeekProgress(activeWeek) : { done: 0, total: 0, percent: 0 };
    const allRoadmapTasks = weeks.reduce((all, week) => all.concat(getAllWeekTasks(week)), []);
    const allRoadmapDone = allRoadmapTasks.filter((task) => task.done).length;
    const roadmapCompletion = percent(allRoadmapDone, allRoadmapTasks.length);
    const appliedCompanies = companies.filter((item) => item.status !== "not applied");
    const responses = companies.filter((item) => ["OA received", "interview", "accepted", "rejected"].includes(item.status));
    const accepted = companies.filter((item) => item.status === "accepted").length;
    const rejected = companies.filter((item) => item.status === "rejected").length;
    const pending = companies.filter((item) => ["applied", "under review", "OA received", "interview"].includes(item.status)).length;
    const activeHackathons = hackathons.filter((item) => ["registered", "submitted", "shortlisted"].includes(item.registrationStatus) || ["submitted", "shortlisted"].includes(item.submissionStatus) || item.resultStatus === "shortlisted").length;
    const certCompleted = certifications.filter((item) => item.status === "completed").length;
    const certProgress = percent(certifications.reduce((sum, item) => sum + Number(item.progress || 0), 0), certifications.length * 100);
    const hackathonProgress = percent(hackathons.filter((item) => item.submissionStatus === "submitted" || item.resultStatus === "shortlisted" || item.resultStatus === "won").length, hackathons.length);
    const targets = getCurrentMonthTarget();
    const appTargetProgress = Math.min(100, percent(appliedCompanies.length, targets.applications));
    const easyDone = dsaProblems.filter((item) => item.difficulty === "easy").length;
    const medDone = dsaProblems.filter((item) => item.difficulty === "medium").length;
    const dsaTargetNeed = targets.dsaEasy + targets.dsaMedium;
    const dsaTargetDone = Math.min(easyDone, targets.dsaEasy) + Math.min(medDone, targets.dsaMedium);
    const dsaTargetProgress = dsaTargetNeed ? Math.min(100, percent(dsaTargetDone, dsaTargetNeed)) : 0;
    const consistencyScore = percent(getRecentActivityDays(state.activity || {}, 30), 30);
    const productivityScore = Math.round(
      activeWeekProgress.percent * 0.3 +
      roadmapCompletion * 0.25 +
      dsaTargetProgress * 0.15 +
      appTargetProgress * 0.15 +
      ((certProgress + hackathonProgress) / 2) * 0.15
    );

    return {
      totalApplications: companies.length,
      applicationsSent: appliedCompanies.length,
      acceptedApplications: accepted,
      rejectedApplications: rejected,
      pendingApplications: pending,
      responseRate: percent(responses.length, appliedCompanies.length),
      totalCertifications: certifications.length,
      completedCertifications: certCompleted,
      activeHackathons,
      dsaSolved: dsaProblems.length,
      currentWeekProgress: activeWeekProgress.percent,
      currentWeekDone: activeWeekProgress.done,
      currentWeekTotal: activeWeekProgress.total,
      overallRoadmapCompletion: roadmapCompletion,
      productivityScore,
      consistencyScore,
      currentStreak: getCurrentStreak(state.activity || {}),
      activeWeek
    };
  }

  function exportState() {
    return JSON.stringify(readState(), null, 2);
  }

  function importState(raw) {
    const parsed = JSON.parse(raw);
    const normalized = normalizeState(parsed);
    writeState(normalized, true);
    document.dispatchEvent(new CustomEvent("placementos:state-change", { detail: normalized }));
    return normalized;
  }

  OS.Store = {
    key: STORAGE_KEY,
    clone,
    todayISO,
    readState,
    writeState,
    mutate,
    resetState,
    recordActivity,
    computeMetrics,
    getActiveWeek,
    getWeekProgress,
    getAllWeekTasks,
    exportState,
    importState,
    percent
  };
})(window.PlacementOS = window.PlacementOS || {});
