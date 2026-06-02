(function (OS) {
  "use strict";

  let difficultyFilter = "all";

  function render(root, state) {
    const problems = state.dsaProblems || [];
    const filtered = problems.filter((item) => difficultyFilter === "all" || item.difficulty === difficultyFilter);

    root.innerHTML = `
      <section class="toolbar-row">
        <div>
          <h2>DSA Tracker</h2>
          <p>Log solved problems and track difficulty breakdown.</p>
        </div>
        <div>
          <button class="primary" type="button" data-add-problem>Add Problem</button>
        </div>
      </section>

      <section class="dashboard-grid">
        <article class="panel card">
          <div class="section-heading">
            <div>
              <h3>Problem Log</h3>
              <p>Filter and export your solved problems.</p>
            </div>
            <div>
              <select data-dsa-filter>
                <option value="all">All difficulties</option>
                <option value="easy" ${difficultyFilter === "easy" ? "selected" : ""}>Easy</option>
                <option value="medium" ${difficultyFilter === "medium" ? "selected" : ""}>Medium</option>
                <option value="hard" ${difficultyFilter === "hard" ? "selected" : ""}>Hard</option>
              </select>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(renderProblemRow).join("")}
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel card">
          <h3>Difficulty Breakdown</h3>
          <div class="chart-container"><canvas id="dsa-donut-chart"></canvas></div>
        </article>
      </section>
    `;

    renderCharts(problems);
    bindEvents(root);
  }

  function renderProblemRow(item) {
    const status = item.status || 'Solved';
    const diffClass = item.difficulty === 'easy' ? 'difficulty-easy' : item.difficulty === 'medium' ? 'difficulty-medium' : 'difficulty-hard';
    return `
      <tr>
        <td>${OS.Utils.escape(item.title)}</td>
        <td><span class="${diffClass}">${OS.Utils.escape(item.difficulty || '')}</span></td>
        <td>${OS.Utils.escape(item.topic)}</td>
        <td><span class="badge">${OS.Utils.escape(status)}</span></td>
        <td>${OS.Utils.escape(item.notes || "")}</td>
        <td class="actions-cell">
          <button class="ghost" type="button" data-edit-problem="${OS.Utils.escape(item.id)}">Edit</button>
          <button class="danger ghost" type="button" data-delete-problem="${OS.Utils.escape(item.id)}">Delete</button>
        </td>
      </tr>
    `;
  }

  function renderStars(rating) {
    const safe = Number(rating || 0);
    return `<span class="star-display">${[1, 2, 3, 4, 5].map((value) => `<span class="${value <= safe ? "filled" : ""}">★</span>`).join("")}</span>`;
  }

  function bindEvents(root) {
    const filter = root.querySelector("[data-dsa-filter]");
    if (filter) {
      filter.addEventListener("change", () => {
        difficultyFilter = filter.value;
        OS.App.render();
      });
    }

    const add = root.querySelector("[data-add-problem]");
    if (add) add.addEventListener("click", () => openProblemForm());

    root.querySelectorAll("[data-edit-problem]").forEach((button) => {
      button.addEventListener("click", () => {
        const state = OS.Store.readState();
        const item = state.dsaProblems.find((problem) => problem.id === button.dataset.editProblem);
        if (item) openProblemForm(item);
      });
    });

    root.querySelectorAll("[data-delete-problem]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteProblem;
        OS.Store.mutate((state) => {
          state.dsaProblems = state.dsaProblems.filter((problem) => problem.id !== id);
        });
      });
    });
  }

  function openProblemForm(existing) {
    const content = document.createElement("form");
    content.className = "modal-form";
    const rating = { value: existing ? Number(existing.rating || 3) : 3 };
    content.innerHTML = `
      <label class="field"><span>Title</span><input name="title" value="${OS.Utils.escape(existing && existing.title)}" required></label>
      <label class="field"><span>Platform</span><select name="platform">
        ${["LeetCode", "NeetCode", "HackerRank", "CodeStudio", "Other"].map((item) => `<option value="${item}" ${existing && existing.platform === item ? "selected" : ""}>${item}</option>`).join("")}
      </select></label>
      <label class="field"><span>Topic</span><input name="topic" value="${OS.Utils.escape(existing && existing.topic)}" placeholder="Arrays, DP, Graphs..." required></label>
      <label class="field"><span>Platform Difficulty</span><select name="difficulty">
        ${["easy", "medium", "hard"].map((item) => `<option value="${item}" ${existing && existing.difficulty === item ? "selected" : ""}>${item}</option>`).join("")}
      </select></label>
      <label class="field"><span>Status</span><select name="status">
        ${["Solved", "Attempted", "Pending"].map((s) => `<option value="${s.toLowerCase()}" ${existing && (existing.status || 'solved') === s.toLowerCase() ? "selected" : ""}>${s}</option>`).join("")}
      </select></label>
      <label class="field"><span>Solved Date</span><input type="date" name="solvedDate" value="${OS.Utils.escape(existing ? existing.solvedDate : OS.Store.todayISO())}"></label>
      <div class="field">
        <span>Actual Perceived Difficulty</span>
        <div class="star-picker" data-star-picker>
          ${[1, 2, 3, 4, 5].map((value) => `<button type="button" class="star ${value <= rating.value ? "active" : ""}" data-star="${value}" aria-label="${value} star">★</button>`).join("")}
        </div>
      </div>
      <label class="field"><span>Notes</span><textarea name="notes" rows="4">${OS.Utils.escape(existing && existing.notes)}</textarea></label>
      <div class="modal-actions">
        <button class="secondary" type="button" data-modal-close>Cancel</button>
        <button class="primary" type="submit">Save Problem</button>
      </div>
    `;

    content.querySelectorAll("[data-star]").forEach((button) => {
      button.addEventListener("click", () => {
        rating.value = Number(button.dataset.star);
        content.querySelectorAll("[data-star]").forEach((star) => {
          star.classList.toggle("active", Number(star.dataset.star) <= rating.value);
        });
      });
    });

    content.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(content);
      const data = {
        title: String(form.get("title") || "").trim(),
        platform: String(form.get("platform") || "LeetCode"),
        topic: String(form.get("topic") || "").trim(),
        difficulty: String(form.get("difficulty") || "easy"),
        status: String(form.get("status") || "solved"),
        solvedDate: String(form.get("solvedDate") || OS.Store.todayISO()),
        rating: rating.value,
        notes: String(form.get("notes") || "").trim()
      };
      OS.Store.mutate((state) => {
        if (existing) {
          const item = state.dsaProblems.find((problem) => problem.id === existing.id);
          if (item) Object.assign(item, data);
        } else {
          state.dsaProblems.unshift(Object.assign({ id: OS.Utils.uid("dsa") }, data));
        }
      });
      OS.Modal.close();
    });

    OS.Modal.open({ title: existing ? "Edit DSA Problem" : "Add DSA Problem", content });
  }

  function getCounts(problems) {
    const totalRating = problems.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return {
      total: problems.length,
      leetcode: problems.filter((item) => item.platform === "LeetCode").length,
      neetcode: problems.filter((item) => item.platform === "NeetCode").length,
      easy: problems.filter((item) => item.difficulty === "easy").length,
      medium: problems.filter((item) => item.difficulty === "medium").length,
      hard: problems.filter((item) => item.difficulty === "hard").length,
      avgRating: problems.length ? (totalRating / problems.length).toFixed(1) : "0.0"
    };
  }

  function renderCharts(problems) {
    const easy = problems.filter((p) => p.difficulty === 'easy').length;
    const medium = problems.filter((p) => p.difficulty === 'medium').length;
    const hard = problems.filter((p) => p.difficulty === 'hard').length;

    OS.Utils.createChart(document.getElementById('dsa-donut-chart'), {
      type: 'doughnut',
      data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{ data: [easy, medium, hard], backgroundColor: ['rgba(52,211,153,0.9)', 'rgba(251,191,36,0.9)', 'rgba(248,113,113,0.9)'] }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  function countBy(items, field) {
    return items.reduce((acc, item) => {
      const key = item[field] || "Unspecified";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  OS.DSA = { render };
})(window.PlacementOS = window.PlacementOS || {});
