(function (OS) {
  "use strict";

  const chartInstances = [];
  const CHART_DEFAULTS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { size: 11, family: "'Montserrat',monospace" }, boxWidth: 12 } },
      tooltip: { callbacks: { label: (context) => {
        const v = context.raw;
        if (typeof v === 'number') return v.toLocaleString();
        return String(v);
      } } }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(30,45,74,0.8)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(30,45,74,0.8)' } }
    }
  };

  window.PlacementOS = window.PlacementOS || {};
  window.PlacementOS.ChartDefaults = CHART_DEFAULTS;
  window.CHART_DEFAULTS = CHART_DEFAULTS;

  const views = [
    ["dashboard", "Dashboard"],
    ["companies", "Target Companies"],
    ["applications", "Applications"],
    ["hackathons", "Hackathons"],
    ["certifications", "Certifications"],
    ["youtube", "YouTube Resources"],
    ["roadmap", "Roadmap"],
    ["weekly", "Weekly Planner"],
    ["dsa", "DSA Tracker"],
    ["projects", "Projects"],
    ["analytics", "Analytics"],
    ["calendar", "Calendar"],
    ["rules", "Rules & Milestones"]
  ];

  function escape(value) {
    return String(value == null || value === false ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function uid(prefix) {
    return `${prefix || "id"}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function progressBar(value, label) {
    const safe = Math.max(0, Math.min(100, Number(value || 0)));
    return `
      <div class="progress" aria-label="${escape(label || "Progress")}">
        <span style="width:${safe}%"></span>
      </div>
      <small>${safe}%</small>
    `;
  }

  function statusBadge(value) {
    const normalized = String(value || "none").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `<span class="status-badge status-${normalized}">${escape(value || "")}</span>`;
  }

  function metricCard(label, value, hint) {
    return `
      <article class="metric-card">
        <span>${escape(label)}</span>
        <strong>${escape(value)}</strong>
        ${hint ? `<small>${escape(hint)}</small>` : ""}
      </article>
    `;
  }

  function emptyState(message) {
    return `<div class="empty-state">${escape(message)}</div>`;
  }

  function destroyCharts() {
    while (chartInstances.length) {
      const chart = chartInstances.pop();
      if (chart && typeof chart.destroy === "function") chart.destroy();
    }
  }

  function mergeDeep(target, source) {
    if (!source) return target;
    Object.keys(source).forEach((key) => {
      const s = source[key];
      const t = target[key];
      if (s && typeof s === "object" && !Array.isArray(s)) {
        target[key] = mergeDeep(t && typeof t === "object" ? t : {}, s);
      } else {
        target[key] = s;
      }
    });
    return target;
  }

  function createChart(canvas, config) {
    if (!window.Chart || !canvas) {
      const fallback = document.createElement("p");
      fallback.className = "chart-fallback";
      fallback.textContent = "Chart.js did not load. Check your internet connection for CDN assets.";
      if (canvas) canvas.replaceWith(fallback);
      return null;
    }

    try {
      const defaults = (OS && OS.Utils && OS.Utils.ChartDefaults) || (window.PlacementOS && window.PlacementOS.ChartDefaults) || window.CHART_DEFAULTS || {};
      const base = JSON.parse(JSON.stringify(defaults || {}));
      const merged = mergeDeep(base, config || {});
      const chart = new Chart(canvas, merged);
      chartInstances.push(chart);
      return chart;
    } catch (err) {
      console.error('Chart creation failed', err);
      return null;
    }
  }

  function init() {
    renderNavigation();
    bindShellActions();
    window.addEventListener("hashchange", render);
    document.addEventListener("placementos:state-change", render);
    render();
  }

  function currentViewId() {
    const raw = (window.location.hash || "#dashboard").replace("#", "");
    return views.some((view) => view[0] === raw) ? raw : "dashboard";
  }

  function renderNavigation() {
    const nav = document.querySelector("#sidebar-nav");
    if (!nav) return;
    nav.innerHTML = views.map(([id, label]) => `
      <a href="#${id}" data-nav="${id}" class="trend-tab">
        ${escape(label)}
      </a>
    `).join("");
  }

  function render() {
    const state = OS.Store.readState();
    const viewId = currentViewId();
    const title = views.find((view) => view[0] === viewId)[1];
    const root = document.querySelector("#view-root");
    const titleEl = document.querySelector("#page-title");
    const subtitleEl = document.querySelector("#page-subtitle");
    const metrics = OS.Store.computeMetrics(state);
    const prodEl = document.querySelector('#productivity-badge');
    if (prodEl) prodEl.textContent = `${metrics.productivityScore}%`;

    destroyCharts();
    document.querySelectorAll("[data-nav]").forEach((item) => {
      item.classList.toggle("active", item.dataset.nav === viewId);
    });

    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitleFor(viewId, state);
    if (!root) return;
    const renderer = getRenderer(viewId);
    if (!renderer) {
      root.innerHTML = emptyState("This view is not available yet.");
      return;
    }

    function showLoadingOverlay() {
      let overlay = document.getElementById('loadingOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `<div class="spinner" aria-hidden="true"></div>`;
        document.body.appendChild(overlay);
      }
      overlay.classList.add('show');
    }

    function hideLoadingOverlay() {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.classList.remove('show');
    }

    // show a brief loading overlay, then render with a short delay so the page-in animation can run
    showLoadingOverlay();
    setTimeout(() => {
      root.innerHTML = "";
      try {
        renderer(root, state);
      } finally {
        const rootEl = document.querySelector('#view-root');
        if (rootEl) {
          rootEl.style.animation = 'dashFadeIn 260ms ease both';
          rootEl.addEventListener('animationend', () => { rootEl.style.animation = ''; }, { once: true });
        }
        hideLoadingOverlay();
      }
    }, 150);
  }

  function getRenderer(viewId) {
    const routes = {
      dashboard: OS.Dashboard && OS.Dashboard.render,
      companies: OS.Tables && OS.Tables.renderCompanies,
      hackathons: OS.Tables && OS.Tables.renderHackathons,
      certifications: OS.Tables && OS.Tables.renderCertifications,
      youtube: OS.Tables && OS.Tables.renderYoutube,
      roadmap: OS.Roadmap && OS.Roadmap.render,
      weekly: OS.Weekly && OS.Weekly.render,
      applications: OS.Applications && OS.Applications.render,
      dsa: OS.DSA && OS.DSA.render,
      projects: OS.Projects && OS.Projects.render,
      analytics: OS.Analytics && OS.Analytics.render,
      calendar: OS.Calendar && OS.Calendar.render,
      rules: OS.Rules && OS.Rules.render
    };
    return routes[viewId];
  }

  function subtitleFor(viewId, state) {
    const metrics = OS.Store.computeMetrics(state);
    const map = {
      dashboard: "Execution cockpit for the placement roadmap.",
      companies: `${metrics.applicationsSent}/${metrics.totalApplications} companies applied.`,
      applications: `${metrics.pendingApplications} active application processes, ${metrics.responseRate}% response rate.`,
      hackathons: `${metrics.activeHackathons} active competitions.`,
      certifications: `${metrics.completedCertifications}/${metrics.totalCertifications} certifications completed.`,
      youtube: "Phase-wise watch list from the roadmap.",
      roadmap: `${metrics.overallRoadmapCompletion}% roadmap completion.`,
      weekly: metrics.activeWeek ? `${metrics.activeWeek.title}: ${metrics.activeWeek.summary}` : "Weekly execution planner.",
      dsa: `${metrics.dsaSolved} DSA problems solved.`,
      projects: "Portfolio project execution tracker.",
      analytics: `${metrics.productivityScore}% productivity score, ${metrics.consistencyScore}% consistency score.`,
      calendar: "Unified deadlines, milestones, reminders, and interviews.",
      rules: "PDF strategy, non-negotiables, monthly milestones, daily routine, and apply cheat sheet."
    };
    return map[viewId] || "";
  }

  function bindShellActions() {
    const reset = document.querySelector("#reset-data");
    const exportBtn = document.querySelector("#export-data");
    const importBtn = document.querySelector("#import-data");
    const importInput = document.querySelector("#import-file");

    if (reset) {
      reset.addEventListener("click", () => {
        if (confirm("Reset all saved local data back to the PDF seed?")) {
          OS.Store.resetState();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const blob = new Blob([OS.Store.exportState()], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `placement-os-${OS.Store.todayISO()}.json`;
        link.click();
        URL.revokeObjectURL(url);
      });
    }

    if (importBtn && importInput) {
      importBtn.addEventListener("click", () => importInput.click());
      importInput.addEventListener("change", () => {
        const file = importInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            OS.Store.importState(reader.result);
          } catch (error) {
            alert("Could not import that JSON file.");
            console.error(error);
          }
        };
        reader.readAsText(file);
        importInput.value = "";
      });
    }
  }

  OS.Utils = {
    escape,
    uid,
    formatDate,
    progressBar,
    statusBadge,
    metricCard,
    emptyState,
    createChart,
    destroyCharts
  };

  OS.App = { init, render, views };

  document.addEventListener("DOMContentLoaded", init);
})(window.PlacementOS = window.PlacementOS || {});
