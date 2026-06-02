(function (OS) {
  "use strict";

  function render(root, state) {
    const metrics = OS.Store.computeMetrics(state);
    const activeWeek = OS.Store.getActiveWeek(state);
    root.innerHTML = `
      <section class="toolbar-row">
        <div>
          <h2>Roadmap System</h2>
          <p>${metrics.overallRoadmapCompletion}% complete across ${state.roadmapWeeks.length} weeks</p>
        </div>
      </section>
      <section class="phase-strip">
        ${OS.Seed.phases.map((phase) => `
          <article>
            <strong>${OS.Utils.escape(phase.name)}</strong>
            <span>${OS.Utils.escape(phase.weeks)} | ${OS.Utils.escape(phase.range)}</span>
            <p>${OS.Utils.escape(phase.focus)}</p>
          </article>
        `).join("")}
      </section>
      ${activeWeek ? `<section class="this-week-card card">
          <div class="section-heading">
            <div>
              <h2>This Week: ${OS.Utils.escape(activeWeek.title)}</h2>
              <p>${OS.Utils.escape(activeWeek.phase)} — ${OS.Utils.formatDate(activeWeek.startDate)} to ${OS.Utils.formatDate(activeWeek.endDate)}</p>
            </div>
            <div style="min-width:180px;text-align:right;">
              ${OS.Utils.progressBar(OS.Store.getWeekProgress(activeWeek).percent, 'This week progress')}
            </div>
          </div>
          <div style="margin-top:8px;">${OS.Utils.escape(activeWeek.summary)}</div>
        </section>` : ""}
      <section class="week-list">
        ${state.roadmapWeeks.map((week) => renderWeekCard(week)).join("")}
      </section>
    `;
    bindEvents(root);
  }

  function renderWeekCard(week) {
    const progress = OS.Store.getWeekProgress(week);
    const tasks = OS.Store.getAllWeekTasks(week);
    return `
      <article class="week-card card" id="${OS.Utils.escape(week.id)}">
        <div class="week-card-main">
          <div>
            <span class="eyebrow" style="font-family:var(--mono);color:var(--accent);">Week ${OS.Utils.escape(week.number)} · ${OS.Utils.escape(week.phase)}</span>
            <h3>${OS.Utils.escape(week.title)} <small>${OS.Utils.formatDate(week.startDate)} - ${OS.Utils.formatDate(week.endDate)}</small></h3>
            <p>${OS.Utils.escape(week.summary)}</p>
          </div>
          <div class="week-score">
            ${OS.Utils.progressBar(progress.percent, `${week.title} progress`)}
            <button class="primary small" type="button" data-week-complete="${OS.Utils.escape(week.id)}">Mark Complete</button>
          </div>
        </div>
        <details>
          <summary>Details, checklist, notes, outcomes</summary>
          <div class="week-detail-grid">
            <div>
              <div class="inline-heading">
                <h4>Daily Tasks</h4>
                <button class="ghost small" type="button" data-add-roadmap-task="${OS.Utils.escape(week.id)}">Add Item</button>
              </div>
              ${week.dailyTasks && week.dailyTasks.length ? `
                <div class="table-wrap">
                  <table class="data-table small">
                    <thead><tr><th>Task</th><th>Category</th><th>Done</th></tr></thead>
                    <tbody>
                      ${week.dailyTasks.map((task) => `
                        <tr>
                          <td>${OS.Utils.escape(task.text)}</td>
                          <td><span class="badge badge-daily">Daily</span></td>
                          <td><input type="checkbox" data-daily-task="${OS.Utils.escape(task.id)}" data-week-id="${OS.Utils.escape(week.id)}" ${task.done ? "checked" : ""}></td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              ` : OS.Utils.emptyState("No daily tasks listed.")}

              <div style="margin-top:12px;">
                <h4>Completion Checklist</h4>
                ${tasks.length ? `<ul class="task-list dense">${tasks.map((task) => `
                  <li>
                    <label class="check-row">
                      <input type="checkbox" data-roadmap-task="${OS.Utils.escape(task.id)}" data-week-id="${OS.Utils.escape(week.id)}" ${task.done ? "checked" : ""}>
                      <span>${OS.Utils.escape(task.text)}</span>
                    </label>
                    <button class="danger ghost tiny" type="button" data-delete-roadmap-task="${OS.Utils.escape(task.id)}" data-week-id="${OS.Utils.escape(week.id)}">Delete</button>
                  </li>
                `).join("")}</ul>` : OS.Utils.emptyState("No checklist items.")}
              </div>
            </div>
            <div>
              <h4>Certs / YouTube / Outcomes</h4>
              <ul class="compact-list">
                ${week.learningResources.map((item) => `<li>${OS.Utils.escape(item)}</li>`).join("")}
                ${week.outcomes.map((item) => `<li>${OS.Utils.escape(item)}</li>`).join("")}
              </ul>
              <label class="field">
                <span>Notes</span>
                <textarea rows="5" data-week-notes="${OS.Utils.escape(week.id)}">${OS.Utils.escape(week.notes || "")}</textarea>
              </label>
            </div>
          </div>
        </details>
      </article>
    `;
  }

  function bindEvents(root) {
    root.querySelectorAll("[data-roadmap-task]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const weekId = checkbox.dataset.weekId;
        const taskId = checkbox.dataset.roadmapTask;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week) return;
          Object.values(week.categories || {}).forEach((group) => {
            const task = group.find((item) => item.id === taskId);
            if (task) task.done = checkbox.checked;
          });
          week.complete = OS.Store.getWeekProgress(week).percent === 100;
        });
      });
    });

    root.querySelectorAll("[data-daily-task]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const weekId = checkbox.dataset.weekId;
        const taskId = checkbox.dataset.dailyTask;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week) return;
          const task = (week.dailyTasks || []).find((t) => t.id === taskId);
          if (task) task.done = checkbox.checked;
        });
      });
    });

    root.querySelectorAll("[data-week-notes]").forEach((textarea) => {
      textarea.addEventListener("change", () => {
        const weekId = textarea.dataset.weekNotes;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (week) week.notes = textarea.value;
        });
      });
    });

    root.querySelectorAll("[data-week-complete]").forEach((button) => {
      button.addEventListener("click", () => {
        const weekId = button.dataset.weekComplete;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week) return;
          Object.values(week.categories || {}).forEach((group) => group.forEach((task) => { task.done = true; }));
          (week.dailyTasks || []).forEach((task) => { task.done = true; });
          week.complete = true;
        });
      });
    });

    root.querySelectorAll("[data-add-roadmap-task]").forEach((button) => {
      button.addEventListener("click", () => {
        openRoadmapTaskForm(button.dataset.addRoadmapTask);
      });
    });

    root.querySelectorAll("[data-delete-roadmap-task]").forEach((button) => {
      button.addEventListener("click", () => {
        const weekId = button.dataset.weekId;
        const taskId = button.dataset.deleteRoadmapTask;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week || !week.categories) return;
          Object.keys(week.categories).forEach((key) => {
            week.categories[key] = week.categories[key].filter((task) => task.id !== taskId);
          });
        });
      });
    });
  }

  function openRoadmapTaskForm(weekId) {
    OS.Modal.form({
      title: "Add Roadmap Checklist Item",
      submitLabel: "Add Item",
      fields: [
        { name: "category", label: "Category", type: "select", value: "goals", options: ["goals", "aiMlTasks", "dsaTasks", "applications", "certifications", "hackathons", "projectTasks"] },
        { name: "text", label: "Task" }
      ],
      onSubmit(data) {
        if (!data.text) return;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week) return;
          week.categories = week.categories || {};
          week.categories[data.category] = week.categories[data.category] || [];
          week.categories[data.category].push({
            id: OS.Utils.uid(`roadmap-${data.category}`),
            text: data.text,
            done: false,
            custom: true
          });
        });
      }
    });
  }

  OS.Roadmap = { render };
})(window.PlacementOS = window.PlacementOS || {});
