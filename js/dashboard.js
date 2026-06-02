(function (OS) {
  "use strict";

  function render(root, state) {
    const metrics = OS.Store.computeMetrics(state);
    const upcoming = getUpcomingDeadlines(state);
    const pendingApps = (state.companies || []).filter((item) => ["applied", "under review", "OA received", "interview"].includes(item.status)).slice(0, 6);
    const week = metrics.activeWeek;
    const milestone = getCurrentMilestone(state);
    const rulesDone = (state.nonNegotiableRules || []).filter((rule) => rule.done).length;

    // KPI strip (compact)
    const totalCompanies = (state.companies || []).length;
    const applicationsSent = metrics.applicationsSent;
    const interviewsActive = (state.companies || []).filter((c) => c.status === 'interview').length;
    const hackRegistered = (state.hackathons || []).filter((h) => h.registrationStatus === 'registered').length;
    const certsInProgress = (state.certifications || []).filter((c) => c.status !== 'not started').length;

    root.innerHTML = `
      <section class="kpi-strip">
        <div class="kpi-tile card">
          <span class="kpi-label">Companies Targeted</span>
          <strong class="kpi-value">${totalCompanies}</strong>
        </div>
        <div class="kpi-tile card">
          <span class="kpi-label">Applications Sent</span>
          <strong class="kpi-value">${applicationsSent}</strong>
        </div>
        <div class="kpi-tile card">
          <span class="kpi-label">Interviews Active</span>
          <strong class="kpi-value">${interviewsActive}</strong>
        </div>
        <div class="kpi-tile card">
          <span class="kpi-label">Hackathons Registered</span>
          <strong class="kpi-value">${hackRegistered}</strong>
        </div>
        <div class="kpi-tile card">
          <span class="kpi-label">Certs In Progress</span>
          <strong class="kpi-value">${certsInProgress}</strong>
        </div>
        <div class="kpi-tile card">
          <span class="kpi-label">Productivity Score</span>
          <strong class="kpi-value">${metrics.productivityScore}%</strong>
        </div>
      </section>

      <section class="roadmap-progress card">
        <div style="flex:1">
          <small style="color:var(--muted);font-family:var(--mono);letter-spacing:1px;text-transform:uppercase">Roadmap progress</small>
          ${OS.Utils.progressBar(metrics.overallRoadmapCompletion, `Roadmap: ${OS.Utils.escape(metrics.overallRoadmapCompletion)}%`)}
        </div>
        <div style="min-width:120px;text-align:right;color:var(--muted);font-family:var(--mono);">${state.roadmapWeeks.filter((w) => w.complete).length}/${state.roadmapWeeks.length} weeks</div>
      </section>

      <section class="dashboard-grid">
        <article class="panel">
          <div class="section-heading">
            <div>
              <h2>Today's Tasks</h2>
              <p>${week ? `${week.title} - ${OS.Utils.formatDate(week.startDate)} to ${OS.Utils.formatDate(week.endDate)}` : "No active week"}</p>
            </div>
            <a class="text-link" href="#weekly">Open planner</a>
          </div>
          ${renderTodayTasks(week)}
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <h2>Upcoming Deadlines</h2>
              <p>Next dated roadmap items</p>
            </div>
            <a class="text-link" href="#calendar">Calendar</a>
          </div>
          ${renderDeadlineList(upcoming)}
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <h2>Pending Applications</h2>
              <p>Follow up after 7 days</p>
            </div>
            <a class="text-link" href="#applications">Tracker</a>
          </div>
          ${pendingApps.length ? `<ul class="compact-list">${pendingApps.map((item) => `<li><strong>${OS.Utils.escape(item.companyName)}</strong><span>${OS.Utils.statusBadge(item.status)}</span></li>`).join("")}</ul>` : OS.Utils.emptyState("No pending applications yet.")}
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <h2>Next Milestone</h2>
              <p>${week ? week.phase : "Roadmap"}</p>
            </div>
            <a class="text-link" href="#roadmap">Roadmap</a>
          </div>
          ${week ? `<h3>${OS.Utils.escape(week.title)}</h3><p>${OS.Utils.escape(week.summary)}</p><ul class="check-list readonly">${week.outcomes.slice(0, 5).map((item) => `<li>${OS.Utils.escape(item)}</li>`).join("")}</ul>` : OS.Utils.emptyState("No milestone found.")}
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <h2>Current PDF Milestone</h2>
              <p>${milestone ? OS.Utils.escape(milestone.month) : "Monthly targets"}</p>
            </div>
            <a class="text-link" href="#rules">Milestones</a>
          </div>
          ${milestone ? `
            <ul class="compact-list">
              <li><strong>LeetCode</strong><span>${OS.Utils.escape(milestone.leetcode)}</span></li>
              <li><strong>Applications</strong><span>${OS.Utils.escape(milestone.applications)}</span></li>
              <li><strong>AI/ML</strong><span>${OS.Utils.escape(milestone.aiGoal)}</span></li>
              <li><strong>Target</strong><span>${OS.Utils.escape(milestone.target)}</span></li>
            </ul>
          ` : OS.Utils.emptyState("No monthly milestone found.")}
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <h2>Non-Negotiables</h2>
              <p>${rulesDone}/${(state.nonNegotiableRules || []).length} checked</p>
            </div>
            <a class="text-link" href="#rules">Rules</a>
          </div>
          <ul class="compact-list">
            ${(state.nonNegotiableRules || []).slice(0, 5).map((rule) => `<li><span>${rule.done ? "Done" : "Open"}</span><strong>${OS.Utils.escape(rule.text)}</strong></li>`).join("")}
          </ul>
        </article>
      </section>

      <section class="chart-grid">
          <article class="panel">
            <h2>Application Status</h2>
            <div class="chart-container"><canvas id="dashboard-applications-chart"></canvas></div>
          </article>
          <article class="panel">
            <h2>Execution Scores</h2>
            <div class="chart-container"><canvas id="dashboard-score-chart"></canvas></div>
          </article>
      </section>
    `;

    bindTaskToggles(root);
    renderCharts(state, metrics);
  }

  function renderTodayTasks(week) {
    if (!week || !week.dailyTasks || !week.dailyTasks.length) return OS.Utils.emptyState("No tasks for the active week.");
    return `
      <ul class="task-list">
        ${week.dailyTasks.slice(0, 7).map((task) => `
          <li>
            <label class="check-row">
              <input type="checkbox" data-daily-task="${OS.Utils.escape(task.id)}" data-week-id="${OS.Utils.escape(week.id)}" ${task.done ? "checked" : ""}>
              <span>${OS.Utils.escape(task.text)}</span>
            </label>
          </li>
        `).join("")}
      </ul>
    `;
  }

  function renderDeadlineList(items) {
    if (!items.length) return OS.Utils.emptyState("No upcoming deadlines.");
    return `<ul class="deadline-list">${items.map((item) => `
      <li>
        <time>${OS.Utils.formatDate(item.date)}</time>
        <span>${OS.Utils.escape(item.title)}</span>
        <em>${OS.Utils.escape(item.category)}</em>
      </li>
    `).join("")}</ul>`;
  }

  function getUpcomingDeadlines(state) {
    const today = new Date(`${OS.Store.todayISO()}T00:00:00`);
    return (state.calendarEvents || [])
      .map((event) => ({ title: event.title, date: event.start, category: event.category || "event" }))
      .filter((item) => item.date && new Date(`${item.date}T00:00:00`) >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 7);
  }

  function bindTaskToggles(root) {
    root.querySelectorAll("[data-daily-task]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const taskId = checkbox.dataset.dailyTask;
        const weekId = checkbox.dataset.weekId;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week) return;
          const task = week.dailyTasks.find((item) => item.id === taskId);
          if (task) task.done = checkbox.checked;
        });
      });
    });
  }

  function getCurrentMilestone(state) {
    const month = new Date().getMonth();
    const label = month <= 5 ? "May-Jun" : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month];
    return (state.monthlyMilestones || []).find((item) => item.month.toLowerCase().includes(label.toLowerCase())) || (state.monthlyMilestones || [])[0];
  }

  function renderCharts(state, metrics) {
    const statuses = OS.Seed.companyStatuses;
    const appCounts = statuses.map((status) => state.companies.filter((item) => item.status === status).length);
    OS.Utils.createChart(document.getElementById("dashboard-applications-chart"), {
      type: "doughnut",
      data: {
        labels: statuses,
        datasets: [{ data: appCounts, backgroundColor: ["#e5e7eb", "#38bdf8", "#818cf8", "#f59e0b", "#a78bfa", "#22c55e", "#ef4444"] }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });

    OS.Utils.createChart(document.getElementById("dashboard-score-chart"), {
      type: "bar",
      data: {
        labels: ["Week", "Roadmap", "Productivity", "Consistency"],
        datasets: [{ label: "Score", data: [metrics.currentWeekProgress, metrics.overallRoadmapCompletion, metrics.productivityScore, metrics.consistencyScore], backgroundColor: "#2563eb" }]
      },
      options: {
        responsive: true,
        scales: { y: { min: 0, max: 100 } },
        plugins: { legend: { display: false } }
      }
    });
  }

  OS.Dashboard = { render };
})(window.PlacementOS = window.PlacementOS || {});
