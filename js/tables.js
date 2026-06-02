(function (OS) {
  "use strict";

  const filters = {};

  function renderCompanies(root, state) {
    renderTable(root, state, {
      title: "Target Companies",
      collectionKey: "companies",
      searchPlaceholder: "Search company, role, notes...",
      filterFields: ["status"],
      statuses: OS.Seed.companyStatuses,
      emptyLabel: "New Company",
      defaultRow: () => ({
        id: OS.Utils.uid("company"),
        companyName: "",
        role: "",
        ctc: "",
        applicationWindow: "",
        status: "not applied",
        notes: ""
      }),
      columns: [
        { field: "companyName", label: "Company Name" },
        { field: "role", label: "Role" },
        { field: "ctc", label: "CTC" },
        { field: "applicationWindow", label: "Application Window" },
        { field: "status", label: "Status", type: "select", options: OS.Seed.companyStatuses },
        { field: "notes", label: "Notes", type: "textarea" }
      ]
    });
  }

  function renderHackathons(root, state) {
    renderTable(root, state, {
      title: "Hackathons / Contests",
      collectionKey: "hackathons",
      searchPlaceholder: "Search hackathons, platforms, notes...",
      filterFields: ["registrationStatus", "submissionStatus", "resultStatus"],
      statuses: OS.Seed.hackathonStatuses,
      emptyLabel: "New Hackathon",
      defaultRow: () => ({
        id: OS.Utils.uid("hack"),
        hackathonName: "",
        platform: "",
        deadline: OS.Store.todayISO(),
        priority: "MEDIUM",
        registrationStatus: "not started",
        submissionStatus: "not started",
        resultStatus: "not started",
        notes: ""
      }),
      columns: [
        { field: "hackathonName", label: "Hackathon Name" },
        { field: "platform", label: "Platform" },
        { field: "deadline", label: "Deadline", type: "date" },
        { field: "priority", label: "Priority" },
        { field: "registrationStatus", label: "Registration Status", type: "select", options: OS.Seed.hackathonStatuses },
        { field: "submissionStatus", label: "Submission Status", type: "select", options: OS.Seed.hackathonStatuses },
        { field: "resultStatus", label: "Result Status", type: "select", options: OS.Seed.hackathonStatuses },
        { field: "notes", label: "Notes", type: "textarea" }
      ]
    });
  }

  function renderCertifications(root, state) {
    renderTable(root, state, {
      title: "Certifications",
      collectionKey: "certifications",
      searchPlaceholder: "Search certifications, providers, notes...",
      filterFields: ["status"],
      statuses: OS.Seed.certificationStatuses,
      emptyLabel: "New Certification",
      defaultRow: () => ({
        id: OS.Utils.uid("cert"),
        certificationName: "",
        provider: "",
        duration: "",
        status: "not started",
        progress: 0,
        deadline: OS.Store.todayISO(),
        notes: ""
      }),
      columns: [
        { field: "certificationName", label: "Certification Name" },
        { field: "provider", label: "Provider" },
        { field: "duration", label: "Duration" },
        { field: "status", label: "Status", type: "select", options: OS.Seed.certificationStatuses },
        { field: "progress", label: "Progress %", type: "progress" },
        { field: "deadline", label: "Deadline", type: "date" },
        { field: "notes", label: "Notes", type: "textarea" }
      ]
    });
  }

  function renderYoutube(root, state) {
    renderTable(root, state, {
      title: "YouTube Resource Tracker",
      collectionKey: "youtubeResources",
      searchPlaceholder: "Search topics, channels, playlists...",
      filterFields: ["status"],
      statuses: OS.Seed.youtubeStatuses,
      emptyLabel: "New Resource",
      defaultRow: () => ({
        id: OS.Utils.uid("yt"),
        topic: "",
        channel: "",
        playlist: "",
        phase: "Phase 1",
        status: "not started",
        notes: ""
      }),
      columns: [
        { field: "topic", label: "Topic" },
        { field: "channel", label: "Channel" },
        { field: "playlist", label: "Playlist/Video" },
        { field: "phase", label: "Phase" },
        { field: "status", label: "Watched Status", type: "select", options: OS.Seed.youtubeStatuses },
        { field: "notes", label: "Notes", type: "textarea" }
      ]
    });
  }

  function renderTable(root, state, config) {
    const currentFilter = filters[config.collectionKey] || { search: "", status: "all" };
    const rows = (state[config.collectionKey] || []).filter((row) => matchRow(row, config, currentFilter));

    root.innerHTML = `
      <section class="toolbar-row">
        <div>
          <h2>${OS.Utils.escape(config.title)}</h2>
          <p>${rows.length}/${(state[config.collectionKey] || []).length} rows shown</p>
        </div>
        <button class="primary" type="button" data-table-add="${config.collectionKey}">Add ${OS.Utils.escape(config.emptyLabel)}</button>
      </section>
      <section class="panel">
        <div class="table-controls">
          <input type="search" value="${OS.Utils.escape(currentFilter.search)}" placeholder="${OS.Utils.escape(config.searchPlaceholder)}" data-table-search="${config.collectionKey}">
          <select data-table-filter="${config.collectionKey}">
            <option value="all">All statuses</option>
            ${(config.statuses || []).map((status) => `<option value="${OS.Utils.escape(status)}" ${currentFilter.status === status ? "selected" : ""}>${OS.Utils.escape(status)}</option>`).join("")}
          </select>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                ${config.columns.map((column) => `<th>${OS.Utils.escape(column.label)}</th>`).join("")}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => renderRow(row, config)).join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="${config.columns.length + 1}" style="padding:10px;text-align:right;color:var(--muted);">${rows.length} of ${(state[config.collectionKey] || []).length} rows shown</td>
              </tr>
            </tfoot>
          </table>
        </div>
        ${rows.length ? "" : OS.Utils.emptyState("No rows match the current filters.")}
      </section>
    `;

    bindTableEvents(root, config);
  }

  function renderRow(row, config) {
    return `
        <tr>
          ${config.columns.map((column) => `<td class="${column.field === 'ctc' ? 'ctc-cell' : ''}">${renderCell(row, column, config.collectionKey)}</td>`).join("")}
          <td class="actions-cell">
            <button class="ghost" type="button" data-table-edit="${config.collectionKey}" data-id="${OS.Utils.escape(row.id)}">Edit</button>
            <button class="danger ghost" type="button" data-table-delete="${config.collectionKey}" data-id="${OS.Utils.escape(row.id)}">Delete</button>
          </td>
        </tr>
      `;
  }

  function renderCell(row, column, collectionKey) {
    const value = row[column.field] == null ? "" : row[column.field];
    const base = `data-table-update="${collectionKey}" data-id="${OS.Utils.escape(row.id)}" data-field="${OS.Utils.escape(column.field)}"`;

    if (column.type === "select") {
        // Render status as a pill for display; editing available via Edit button/modal
        if (column.field === 'status') {
          const normalized = String(value || 'none').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return `<span class="badge badge-${normalized}">${OS.Utils.escape(value)}</span>`;
        }
        return `<select ${base}>${column.options.map((option) => `<option value="${OS.Utils.escape(option)}" ${option === value ? "selected" : ""}>${OS.Utils.escape(option)}</option>`).join("")}</select>`;
    }
    if (column.type === "textarea") {
      return `<textarea rows="2" ${base}>${OS.Utils.escape(value)}</textarea>`;
    }
    if (column.type === "date") {
      return `<input type="date" value="${OS.Utils.escape(value)}" ${base}>`;
    }
    if (column.type === "progress") {
      const safe = Math.max(0, Math.min(100, Number(value || 0)));
      return `
        <div class="progress-cell">
          <input type="range" min="0" max="100" value="${safe}" ${base}>
          ${OS.Utils.progressBar(safe, column.label)}
        </div>
      `;
    }
    return `<input type="text" value="${OS.Utils.escape(value)}" ${base}>`;
  }

  function bindTableEvents(root, config) {
    root.querySelectorAll("[data-table-search]").forEach((input) => {
      input.addEventListener("input", () => {
        filters[config.collectionKey] = filters[config.collectionKey] || {};
        filters[config.collectionKey].search = input.value;
        OS.App.render();
      });
    });

    root.querySelectorAll("[data-table-filter]").forEach((select) => {
      select.addEventListener("change", () => {
        filters[config.collectionKey] = filters[config.collectionKey] || {};
        filters[config.collectionKey].status = select.value;
        OS.App.render();
      });
    });

    root.querySelectorAll("[data-table-add]").forEach((button) => {
      button.addEventListener("click", () => {
        openRowForm(config);
      });
    });

    root.querySelectorAll("[data-table-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const state = OS.Store.readState();
        const row = state[config.collectionKey].find((item) => item.id === button.dataset.id);
        if (row) openRowForm(config, row);
      });
    });

    root.querySelectorAll("[data-table-update]").forEach((input) => {
      input.addEventListener("change", () => {
        const collectionKey = input.dataset.tableUpdate;
        const id = input.dataset.id;
        const field = input.dataset.field;
        OS.Store.mutate((state) => {
          const item = state[collectionKey].find((row) => row.id === id);
          if (!item) return;
          item[field] = input.type === "range" ? Number(input.value) : input.value;
          normalizeLinkedFields(collectionKey, item, field);
        });
      });
    });

    root.querySelectorAll("[data-table-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        const collectionKey = button.dataset.tableDelete;
        const id = button.dataset.id;
        OS.Store.mutate((state) => {
          state[collectionKey] = state[collectionKey].filter((row) => row.id !== id);
        });
      });
    });
  }

  function normalizeLinkedFields(collectionKey, item, field) {
    if (collectionKey === "certifications" && field === "status") {
      if (item.status === "completed") item.progress = 100;
      if (item.status === "not started") item.progress = 0;
      if (item.status === "ongoing" && Number(item.progress || 0) === 0) item.progress = 10;
    }
    if (collectionKey === "certifications" && field === "progress") {
      if (Number(item.progress) >= 100) item.status = "completed";
      else if (Number(item.progress) > 0) item.status = "ongoing";
      else item.status = "not started";
    }
  }

  function openRowForm(config, existing) {
    const seed = existing || config.defaultRow();
    OS.Modal.form({
      title: `${existing ? "Edit" : "Add"} ${config.emptyLabel}`,
      submitLabel: "Save",
      fields: config.columns.map((column) => ({
        name: column.field,
        label: column.label,
        type: column.type === "progress" ? "range" : column.type,
        options: column.options,
        min: column.type === "progress" ? 0 : undefined,
        max: column.type === "progress" ? 100 : undefined,
        value: seed[column.field]
      })),
      onSubmit(data) {
        OS.Store.mutate((state) => {
          if (existing) {
            const item = state[config.collectionKey].find((row) => row.id === existing.id);
            if (item) {
              Object.assign(item, data);
              Object.keys(data).forEach((field) => normalizeLinkedFields(config.collectionKey, item, field));
            }
          } else {
            const row = Object.assign(seed, data);
            Object.keys(data).forEach((field) => normalizeLinkedFields(config.collectionKey, row, field));
            state[config.collectionKey].unshift(row);
          }
        });
      }
    });
  }

  function matchRow(row, config, filter) {
    const text = Object.values(row).join(" ").toLowerCase();
    const search = String(filter.search || "").toLowerCase();
    const status = filter.status || "all";
    const searchMatch = !search || text.includes(search);
    const statusMatch = status === "all" || (config.filterFields || []).some((field) => row[field] === status);
    return searchMatch && statusMatch;
  }

  OS.Tables = {
    renderCompanies,
    renderHackathons,
    renderCertifications,
    renderYoutube
  };
})(window.PlacementOS = window.PlacementOS || {});
