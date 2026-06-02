(function (OS) {
  "use strict";

  let selectedWeekId = null;

  const categoryLabels = {
    goals: "Goals",
    aiMlTasks: "AI/ML Tasks",
    dsaTasks: "DSA Tasks",
    applications: "Applications",
    certifications: "Certifications",
    hackathons: "Hackathons",
    projectTasks: "Project Tasks"
  };

  function render(root, state) {
    const active = OS.Store.getActiveWeek(state);
    if (!selectedWeekId && active) selectedWeekId = active.id;
    const week = state.roadmapWeeks.find((item) => item.id === selectedWeekId) || active || state.roadmapWeeks[0];
    const progress = week ? OS.Store.getWeekProgress(week) : { done: 0, total: 0, percent: 0 };

    root.innerHTML = `
      <section class="toolbar-row">
        <div>
          <h2>Weekly Execution View</h2>
          <p>${week ? `${week.title}: ${progress.done}/${progress.total} checklist items complete` : "No week selected"}</p>
        </div>
        <select data-week-select>
          ${state.roadmapWeeks.map((item) => `<option value="${OS.Utils.escape(item.id)}" ${item.id === week.id ? "selected" : ""}>${OS.Utils.escape(item.title)} - ${OS.Utils.escape(item.phase)}</option>`).join("")}
        </select>
      </section>

      ${week ? `
          <section class="weekly-summary panel card">
          <div>
            <span class="eyebrow">${OS.Utils.escape(week.phase)}</span>
            <h3>${OS.Utils.escape(week.title)} <small>${OS.Utils.formatDate(week.startDate)} - ${OS.Utils.formatDate(week.endDate)}</small></h3>
            <p>${OS.Utils.escape(week.summary)}</p>
          </div>
          <div>
            <strong>${progress.percent}%</strong>
            <span>Weekly completion rate</span>
            ${OS.Utils.progressBar(progress.percent, "Weekly completion")}
          </div>
          <div>
            <strong>${calculateWeeklyProductivity(week)}%</strong>
            <span>Weekly productivity score</span>
            ${OS.Utils.progressBar(calculateWeeklyProductivity(week), "Weekly productivity")}
          </div>
        </section>
          <section class="panel card">
            <h4>Daily Tasks</h4>
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
            ` : OS.Utils.emptyState('No daily tasks.')}
          </section>
        <section class="weekly-grid">
          ${Object.keys(categoryLabels).map((key) => renderCategory(week, key)).join("")}
        </section>
        <section class="panel">
          <label class="field">
            <span>Execution Notes</span>
            <textarea rows="5" data-weekly-notes="${OS.Utils.escape(week.id)}">${OS.Utils.escape(week.notes || "")}</textarea>
          </label>
        </section>
      ` : OS.Utils.emptyState("No roadmap weeks available.")}
    `;

    bindEvents(root);
  }

  function renderCategory(week, key) {
    const tasks = (week.categories && week.categories[key]) || [];
    const done = tasks.filter((task) => task.done).length;
    const pct = OS.Store.percent(done, tasks.length);
    return `
      <article class="panel weekly-category">
        <div class="section-heading">
          <div>
            <h2>${OS.Utils.escape(categoryLabels[key])}</h2>
            <p>${done}/${tasks.length} complete</p>
          </div>
          <div class="category-actions">
            <strong>${pct}%</strong>
            <button class="ghost small" type="button" data-add-week-task="${OS.Utils.escape(week.id)}" data-category="${OS.Utils.escape(key)}">Add</button>
          </div>
        </div>
        ${OS.Utils.progressBar(pct, `${categoryLabels[key]} progress`)}
        ${tasks.length ? `<ul class="task-list dense">${tasks.map((task) => `
          <li>
            <label class="check-row">
              <input type="checkbox" data-week-task="${OS.Utils.escape(task.id)}" data-week-id="${OS.Utils.escape(week.id)}" data-category="${OS.Utils.escape(key)}" ${task.done ? "checked" : ""}>
              <span>${OS.Utils.escape(task.text)}</span>
            </label>
            <button class="danger ghost tiny" type="button" data-delete-week-task="${OS.Utils.escape(task.id)}" data-week-id="${OS.Utils.escape(week.id)}" data-category="${OS.Utils.escape(key)}">Delete</button>
          </li>
        `).join("")}</ul>` : OS.Utils.emptyState("No tasks in this category.")}
      </article>
    `;
  }

  function calculateWeeklyProductivity(week) {
    const checklist = OS.Store.getWeekProgress(week);
    const dailyDone = (week.dailyTasks || []).filter((task) => task.done).length;
    const dailyPct = OS.Store.percent(dailyDone, (week.dailyTasks || []).length);
    return Math.round(checklist.percent * 0.75 + dailyPct * 0.25);
  }

  function bindEvents(root) {
    const select = root.querySelector("[data-week-select]");
    if (select) {
      select.addEventListener("change", () => {
        selectedWeekId = select.value;
        OS.App.render();
      });
    }

    root.querySelectorAll("[data-week-task]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const weekId = checkbox.dataset.weekId;
        const category = checkbox.dataset.category;
        const taskId = checkbox.dataset.weekTask;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          const group = week && week.categories && week.categories[category];
          if (!group) return;
          const task = group.find((item) => item.id === taskId);
          if (task) task.done = checkbox.checked;
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

    root.querySelectorAll("[data-add-week-task]").forEach((button) => {
      button.addEventListener("click", () => {
        openTaskForm(button.dataset.addWeekTask, button.dataset.category);
      });
    });

    root.querySelectorAll("[data-delete-week-task]").forEach((button) => {
      button.addEventListener("click", () => {
        const weekId = button.dataset.weekId;
        const category = button.dataset.category;
        const taskId = button.dataset.deleteWeekTask;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week || !week.categories || !week.categories[category]) return;
          week.categories[category] = week.categories[category].filter((task) => task.id !== taskId);
        });
      });
    });

    root.querySelectorAll("[data-weekly-notes]").forEach((textarea) => {
      textarea.addEventListener("change", () => {
        const weekId = textarea.dataset.weeklyNotes;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (week) week.notes = textarea.value;
        });
      });
    });
  }

  function openTaskForm(weekId, category) {
    OS.Modal.form({
      title: `Add ${categoryLabels[category] || "Task"}`,
      submitLabel: "Add Task",
      fields: [
        { name: "text", label: "Task" }
      ],
      onSubmit(data) {
        if (!data.text) return;
        OS.Store.mutate((state) => {
          const week = state.roadmapWeeks.find((item) => item.id === weekId);
          if (!week) return;
          week.categories = week.categories || {};
          week.categories[category] = week.categories[category] || [];
          week.categories[category].push({
            id: OS.Utils.uid(`custom-${category}`),
            text: data.text,
            done: false,
            custom: true
          });
        });
      }
    });
  }

  OS.Weekly = { render };
})(window.PlacementOS = window.PlacementOS || {});
