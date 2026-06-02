 (function (OS) {
  "use strict";
  function render(root, state) {
    const metrics = OS.Store.computeMetrics(state);

    root.innerHTML = `
      <section class="metric-grid compact">
        ${OS.Utils.metricCard("Productivity Score", `${metrics.productivityScore}%`, "Weighted execution")}
        ${OS.Utils.metricCard("Consistency Score", `${metrics.consistencyScore}%`, "Active days last 30")}
        ${OS.Utils.metricCard("Completion Rate", `${metrics.overallRoadmapCompletion}%`, "Roadmap checklist")}
        ${OS.Utils.metricCard("Weekly Velocity", `${metrics.currentWeekDone}/${metrics.currentWeekTotal}`, "Current week")}
        ${OS.Utils.metricCard("Applications vs Responses", `${metrics.applicationsSent}/${Math.round(metrics.applicationsSent * metrics.responseRate / 100)}`, `${metrics.responseRate}% response rate`)}
        ${OS.Utils.metricCard("Contest Participation", state.hackathons.filter((item) => item.registrationStatus !== "not started").length, "Registered contests")}
      </section>
      <section class="panel" id="consistency-heatmap"></section>
      <section class="chart-grid two">
        <article class="panel">
          <h2>Productivity Components</h2>
          <div class="chart-container"><canvas id="analytics-productivity"></canvas></div>
        </article>
        <article class="panel">
          <h2>Weekly Velocity</h2>
          <div class="chart-container"><canvas id="analytics-weekly"></canvas></div>
        </article>
        <article class="panel">
          <h2>Applications vs Responses</h2>
          <div class="chart-container"><canvas id="analytics-apps"></canvas></div>
        </article>
        <article class="panel">
          <h2>Contest Participation</h2>
          <div class="chart-container"><canvas id="analytics-contests"></canvas></div>
        </article>
        <article class="panel">
          <h2>Certification Completion Trends</h2>
          <div class="chart-container"><canvas id="analytics-certs"></canvas></div>
        </article>
        <article class="panel">
          <h2>DSA Growth</h2>
          <div class="chart-container"><canvas id="analytics-dsa"></canvas></div>
        </article>
      </section>
    `;

    OS.Heatmap.render(document.getElementById("consistency-heatmap"), state.activity, { days: 182 });
    renderCharts(state, metrics);
  }

  function renderCharts(state, metrics) {
    OS.Utils.createChart(document.getElementById("analytics-productivity"), {
      type: "radar",
      data: {
        labels: ["Current Week", "Roadmap", "Productivity", "Consistency", "Response Rate"],
        datasets: [{
          label: "Score",
          data: [metrics.currentWeekProgress, metrics.overallRoadmapCompletion, metrics.productivityScore, metrics.consistencyScore, metrics.responseRate],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,.15)"
        }]
      },
      options: { responsive: true, scales: { r: { min: 0, max: 100 } } }
    });

    OS.Utils.createChart(document.getElementById("analytics-weekly"), {
      type: "bar",
      data: {
        labels: state.roadmapWeeks.map((week) => `W${week.number}`),
        datasets: [{
          label: "Completed Tasks",
          data: state.roadmapWeeks.map((week) => OS.Store.getWeekProgress(week).done),
          backgroundColor: "#16a34a"
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    const responses = state.companies.filter((item) => ["OA received", "interview", "accepted", "rejected"].includes(item.status)).length;
    OS.Utils.createChart(document.getElementById("analytics-apps"), {
      type: "bar",
      data: {
        labels: ["Applied", "Responses", "Accepted", "Rejected"],
        datasets: [{ data: [metrics.applicationsSent, responses, metrics.acceptedApplications, metrics.rejectedApplications], backgroundColor: ["#2563eb", "#f59e0b", "#22c55e", "#ef4444"] }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    OS.Utils.createChart(document.getElementById("analytics-contests"), {
      type: "doughnut",
      data: {
        labels: OS.Seed.hackathonStatuses,
        datasets: [{ data: OS.Seed.hackathonStatuses.map((status) => countContestStatus(state.hackathons, status)), backgroundColor: ["#e5e7eb", "#38bdf8", "#2563eb", "#a78bfa", "#22c55e", "#ef4444"] }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });

    const certMonths = aggregateByMonth(state.certifications, "deadline", (item) => Number(item.progress || 0) / 100);
    OS.Utils.createChart(document.getElementById("analytics-certs"), {
      type: "line",
      data: {
        labels: Object.keys(certMonths),
        datasets: [{ label: "Completion units", data: Object.values(certMonths), borderColor: "#7c3aed", backgroundColor: "rgba(124,58,237,.12)", fill: true, tension: 0.25 }]
      },
      options: { responsive: true }
    });

    const dsaGrowth = cumulativeByDate(state.dsaProblems || []);
    OS.Utils.createChart(document.getElementById("analytics-dsa"), {
      type: "line",
      data: {
        labels: dsaGrowth.labels,
        datasets: [{ label: "Solved", data: dsaGrowth.values, borderColor: "#0f766e", backgroundColor: "rgba(15,118,110,.12)", fill: true, tension: 0.25 }]
      },
      options: { responsive: true }
    });
  }

  function countContestStatus(hackathons, status) {
    return hackathons.filter((item) => item.registrationStatus === status || item.submissionStatus === status || item.resultStatus === status).length;
  }

  function aggregateByMonth(items, dateField, valueFn) {
    return items.reduce((acc, item) => {
      const key = item[dateField] ? item[dateField].slice(0, 7) : "No date";
      acc[key] = (acc[key] || 0) + valueFn(item);
      return acc;
    }, {});
  }

  function cumulativeByDate(items) {
    const counts = items.reduce((acc, item) => {
      const key = item.solvedDate || OS.Store.todayISO();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(counts).sort();
    let total = 0;
    return {
      labels,
      values: labels.map((label) => {
        total += counts[label];
        return total;
      })
    };
  }

  OS.Analytics = { render };
})(window.PlacementOS = window.PlacementOS || {});
