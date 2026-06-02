(function (OS) {
  "use strict";

  let statusFilter = "all";

  function render(root, state) {
    const metrics = OS.Store.computeMetrics(state);
    const rows = (state.companies || []).filter((item) => statusFilter === "all" || item.status === statusFilter);

    root.innerHTML = `
      <section class="metric-grid compact">
        ${OS.Utils.metricCard("Applications Sent", metrics.applicationsSent, `${metrics.totalApplications} targets`)}
        ${OS.Utils.metricCard("Under Review", state.companies.filter((item) => item.status === "under review").length, "Review queue")}
        ${OS.Utils.metricCard("Accepted", metrics.acceptedApplications, "Offers")}
        ${OS.Utils.metricCard("Rejected", metrics.rejectedApplications, "Closed")}
        ${OS.Utils.metricCard("Response Rate", `${metrics.responseRate}%`, "OA/interview/final status")}
      </section>
      <section class="chart-grid">
        <article class="panel">
          <h2>Application Pipeline</h2>
          <div class="chart-container"><canvas id="application-pie"></canvas></div>
        </article>
        <article class="panel">
          <div class="section-heading">
            <div>
              <h2>Tracker</h2>
              <p>Add, update, filter, and delete company applications.</p>
            </div>
            <button class="primary" type="button" data-add-application>Add Company</button>
          </div>
          <div class="table-controls">
            <select data-application-filter>
              <option value="all">All statuses</option>
              ${OS.Seed.companyStatuses.map((status) => `<option value="${OS.Utils.escape(status)}" ${statusFilter === status ? "selected" : ""}>${OS.Utils.escape(status)}</option>`).join("")}
            </select>
          </div>
          <div class="application-list">
            ${rows.map(renderApplicationRow).join("")}
          </div>
          ${rows.length ? "" : OS.Utils.emptyState("No applications match this status.")}
        </article>
      </section>
    `;

    renderChart(state);
    bindEvents(root);
  }

  function renderApplicationRow(item) {
    return `
      <div class="application-row">
        <div>
          <strong>${OS.Utils.escape(item.companyName)}</strong>
          <span>${OS.Utils.escape(item.role)} | ${OS.Utils.escape(item.ctc)} | ${OS.Utils.escape(item.applicationWindow)}</span>
        </div>
        <select data-application-status="${OS.Utils.escape(item.id)}">
          ${OS.Seed.companyStatuses.map((status) => `<option value="${OS.Utils.escape(status)}" ${item.status === status ? "selected" : ""}>${OS.Utils.escape(status)}</option>`).join("")}
        </select>
        <button class="ghost" type="button" data-edit-application="${OS.Utils.escape(item.id)}">Edit</button>
        <button class="danger ghost" type="button" data-delete-application="${OS.Utils.escape(item.id)}">Delete</button>
      </div>
    `;
  }

  function renderChart(state) {
    const statuses = OS.Seed.companyStatuses;
    OS.Utils.createChart(document.getElementById("application-pie"), {
      type: "pie",
      data: {
        labels: statuses,
        datasets: [{
          data: statuses.map((status) => state.companies.filter((item) => item.status === status).length),
          backgroundColor: ["#e5e7eb", "#38bdf8", "#818cf8", "#f59e0b", "#a78bfa", "#22c55e", "#ef4444"]
        }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
  }

  function bindEvents(root) {
    const filter = root.querySelector("[data-application-filter]");
    if (filter) {
      filter.addEventListener("change", () => {
        statusFilter = filter.value;
        OS.App.render();
      });
    }

    const add = root.querySelector("[data-add-application]");
    if (add) add.addEventListener("click", () => openApplicationForm());

    root.querySelectorAll("[data-application-status]").forEach((select) => {
      select.addEventListener("change", () => {
        const id = select.dataset.applicationStatus;
        OS.Store.mutate((state) => {
          const item = state.companies.find((company) => company.id === id);
          if (item) item.status = select.value;
        });
      });
    });

    root.querySelectorAll("[data-edit-application]").forEach((button) => {
      button.addEventListener("click", () => {
        const state = OS.Store.readState();
        const item = state.companies.find((company) => company.id === button.dataset.editApplication);
        if (item) openApplicationForm(item);
      });
    });

    root.querySelectorAll("[data-delete-application]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteApplication;
        OS.Store.mutate((state) => {
          state.companies = state.companies.filter((item) => item.id !== id);
        });
      });
    });
  }

  function openApplicationForm(existing) {
    OS.Modal.form({
      title: existing ? "Edit Application" : "Add Application",
      submitLabel: "Save Application",
      fields: [
        { name: "companyName", label: "Company Name", value: existing && existing.companyName },
        { name: "role", label: "Role", value: existing && existing.role },
        { name: "ctc", label: "CTC", value: existing && existing.ctc },
        { name: "applicationWindow", label: "Application Window", value: existing && existing.applicationWindow },
        { name: "status", label: "Status", type: "select", value: existing ? existing.status : "not applied", options: OS.Seed.companyStatuses },
        { name: "notes", label: "Notes", type: "textarea", value: existing && existing.notes }
      ],
      onSubmit(data) {
        OS.Store.mutate((state) => {
          if (existing) {
            const item = state.companies.find((company) => company.id === existing.id);
            if (item) Object.assign(item, data);
          } else {
            state.companies.unshift(Object.assign({ id: OS.Utils.uid("company") }, data));
          }
        });
      }
    });
  }

  OS.Applications = { render };
})(window.PlacementOS = window.PlacementOS || {});
