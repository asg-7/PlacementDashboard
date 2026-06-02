(function (OS) {
  "use strict";

  function render(root, state) {
    root.innerHTML = `
      <section class="panel card">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <h2 style="margin:0;color:var(--text);">Rules & Checklist</h2>
            <p style="margin:4px 0 0;color:var(--muted);">Quick access to rules, cheat sheet and daily routine.</p>
          </div>
          <div>
            <button class="plan-tab-btn active" data-plan-tab="rules" style="margin-right:8px;">Rules</button>
            <button class="plan-tab-btn" data-plan-tab="cheatsheet" style="margin-right:8px;">Cheat Sheet</button>
            <button class="plan-tab-btn" data-plan-tab="daily">Daily Routine</button>
          </div>
        </div>
      </section>

      <section class="panel card plan-tab-content active" data-plan-content="rules">
        <div class="section-heading">
          <div>
            <h3>Non-Negotiable Rules</h3>
            <p>Turn the PDF's advice into a checklist.</p>
          </div>
          <button class="primary" type="button" data-add-rule>Add Rule</button>
        </div>
        <ul class="task-list dense rules-list">
          ${(state.nonNegotiableRules || []).map((rule) => `
            <li>
              <label class="check-row">
                <input type="checkbox" data-rule-check="${OS.Utils.escape(rule.id)}" ${rule.done ? "checked" : ""}>
                <span>${OS.Utils.escape(rule.text)}</span>
              </label>
              <button class="danger ghost tiny" type="button" data-delete-rule="${OS.Utils.escape(rule.id)}">Delete</button>
            </li>
          `).join("")}
        </ul>
      </section>

      <section class="panel card plan-tab-content" data-plan-content="cheatsheet">
        <div class="section-heading">
          <div>
            <h3>Application Cheat Sheet</h3>
            <p>Priority windows and action notes from the PDF.</p>
          </div>
          <button class="primary" type="button" data-add-apply>Add Entry</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Applied?</th>
                <th>Company</th>
                <th>Role Track</th>
                <th>Window</th>
                <th>CTC</th>
                <th>Action</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(state.applicationCheatSheet || []).map(renderApplyRow).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel card plan-tab-content" data-plan-content="daily">
        <div class="section-heading">
          <div>
            <h3>Daily Routine Template</h3>
            <p>Execution blocks from the PDF.</p>
          </div>
        </div>
        <ul class="deadline-list">
          ${(state.dailyRoutine || []).map((row) => `
            <li>
              <time>${OS.Utils.escape(row[0])}</time>
              <span><strong>${OS.Utils.escape(row[1])}</strong><br>${OS.Utils.escape(row[2])}</span>
            </li>
          `).join("")}
        </ul>
      </section>

      <section class="panel card">
        <div class="section-heading">
          <div>
            <h3>Reality Check & Strategy</h3>
            <p>Directly from the roadmap's positioning logic.</p>
          </div>
        </div>
        <ul class="compact-list strategy-list">
          ${(state.realityChecks || []).map((item) => `<li><span>${OS.Utils.escape(item.text)}</span></li>`).join("")}
        </ul>
      </section>

      <section class="panel card">
        <div class="section-heading">
          <div>
            <h3>Monthly Milestone Tracker</h3>
            <p>Use this like the PDF's target sheet, but editable and persistent.</p>
          </div>
          <button class="primary" type="button" data-add-milestone>Add Milestone</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Done</th>
                <th>Month</th>
                <th>LeetCode</th>
                <th>Applications</th>
                <th>Hackathons</th>
                <th>Certs</th>
                <th>AI/ML Goal</th>
                <th>Target</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(state.monthlyMilestones || []).map(renderMilestoneRow).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;

    bindEvents(root);
  }

  function renderMilestoneRow(item) {
    return `
      <tr>
        <td><input type="checkbox" data-milestone-field="completed" data-id="${OS.Utils.escape(item.id)}" ${item.completed ? "checked" : ""}></td>
        <td><input data-milestone-field="month" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.month)}"></td>
        <td><input data-milestone-field="leetcode" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.leetcode)}"></td>
        <td><input data-milestone-field="applications" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.applications)}"></td>
        <td><input data-milestone-field="hackathons" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.hackathons)}"></td>
        <td><input data-milestone-field="certs" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.certs)}"></td>
        <td><textarea rows="2" data-milestone-field="aiGoal" data-id="${OS.Utils.escape(item.id)}">${OS.Utils.escape(item.aiGoal)}</textarea></td>
        <td><textarea rows="2" data-milestone-field="target" data-id="${OS.Utils.escape(item.id)}">${OS.Utils.escape(item.target)}</textarea></td>
        <td><textarea rows="2" data-milestone-field="notes" data-id="${OS.Utils.escape(item.id)}">${OS.Utils.escape(item.notes || "")}</textarea></td>
        <td><button class="danger ghost" type="button" data-delete-milestone="${OS.Utils.escape(item.id)}">Delete</button></td>
      </tr>
    `;
  }

  function renderApplyRow(item) {
    return `
      <tr>
        <td><input type="checkbox" data-apply-field="applied" data-id="${OS.Utils.escape(item.id)}" ${item.applied ? "checked" : ""}></td>
        <td><input data-apply-field="company" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.company)}"></td>
        <td><input data-apply-field="role" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.role)}"></td>
        <td><input data-apply-field="window" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.window)}"></td>
        <td><input data-apply-field="ctc" data-id="${OS.Utils.escape(item.id)}" value="${OS.Utils.escape(item.ctc)}"></td>
        <td><textarea rows="2" data-apply-field="action" data-id="${OS.Utils.escape(item.id)}">${OS.Utils.escape(item.action)}</textarea></td>
        <td><textarea rows="2" data-apply-field="notes" data-id="${OS.Utils.escape(item.id)}">${OS.Utils.escape(item.notes || "")}</textarea></td>
        <td>
          <button class="ghost" type="button" data-copy-apply="${OS.Utils.escape(item.id)}">Copy to Applications</button>
          <button class="danger ghost" type="button" data-delete-apply="${OS.Utils.escape(item.id)}">Delete</button>
        </td>
      </tr>
    `;
  }

  function bindEvents(root) {
    // Tab switching
    root.querySelectorAll("[data-plan-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.planTab;
        root.querySelectorAll("[data-plan-tab]").forEach((b) => b.classList.toggle("active", b === button));
        root.querySelectorAll("[data-plan-content]").forEach((c) => c.classList.toggle("active", c.dataset.planContent === key));
      });
    });

    root.querySelectorAll("[data-milestone-field]").forEach((input) => {
      input.addEventListener("change", () => {
        updateCollectionField("monthlyMilestones", input.dataset.id, input.dataset.milestoneField, input);
      });
    });

    root.querySelectorAll("[data-apply-field]").forEach((input) => {
      input.addEventListener("change", () => {
        updateCollectionField("applicationCheatSheet", input.dataset.id, input.dataset.applyField, input);
      });
    });

    root.querySelectorAll("[data-rule-check]").forEach((input) => {
      input.addEventListener("change", () => {
        updateCollectionField("nonNegotiableRules", input.dataset.ruleCheck, "done", input);
      });
    });

    const addMilestone = root.querySelector("[data-add-milestone]");
    if (addMilestone) addMilestone.addEventListener("click", openMilestoneForm);

    const addRule = root.querySelector("[data-add-rule]");
    if (addRule) addRule.addEventListener("click", openRuleForm);

    const addApply = root.querySelector("[data-add-apply]");
    if (addApply) addApply.addEventListener("click", openApplyForm);

    root.querySelectorAll("[data-delete-milestone]").forEach((button) => {
      button.addEventListener("click", () => deleteFrom("monthlyMilestones", button.dataset.deleteMilestone));
    });

    root.querySelectorAll("[data-delete-rule]").forEach((button) => {
      button.addEventListener("click", () => deleteFrom("nonNegotiableRules", button.dataset.deleteRule));
    });

    root.querySelectorAll("[data-delete-apply]").forEach((button) => {
      button.addEventListener("click", () => deleteFrom("applicationCheatSheet", button.dataset.deleteApply));
    });

    root.querySelectorAll("[data-copy-apply]").forEach((button) => {
      button.addEventListener("click", () => copyApplyToCompanies(button.dataset.copyApply));
    });
  }

  function updateCollectionField(collection, id, field, input) {
    OS.Store.mutate((state) => {
      const item = state[collection].find((entry) => entry.id === id);
      if (!item) return;
      item[field] = input.type === "checkbox" ? input.checked : input.value;
    });
  }

  function deleteFrom(collection, id) {
    OS.Store.mutate((state) => {
      state[collection] = state[collection].filter((item) => item.id !== id);
    });
  }

  function openMilestoneForm() {
    OS.Modal.form({
      title: "Add Monthly Milestone",
      submitLabel: "Add Milestone",
      fields: [
        { name: "month", label: "Month" },
        { name: "leetcode", label: "LeetCode Target" },
        { name: "applications", label: "Applications Target" },
        { name: "hackathons", label: "Hackathons" },
        { name: "certs", label: "Certifications" },
        { name: "aiGoal", label: "AI/ML Goal", type: "textarea" },
        { name: "target", label: "Outcome Target", type: "textarea" },
        { name: "notes", label: "Notes", type: "textarea" }
      ],
      onSubmit(data) {
        OS.Store.mutate((state) => {
          state.monthlyMilestones.push(Object.assign({ id: OS.Utils.uid("milestone"), completed: false }, data));
        });
      }
    });
  }

  function openRuleForm() {
    OS.Modal.form({
      title: "Add Rule",
      submitLabel: "Add Rule",
      fields: [{ name: "text", label: "Rule", type: "textarea" }],
      onSubmit(data) {
        if (!data.text) return;
        OS.Store.mutate((state) => {
          state.nonNegotiableRules.push({ id: OS.Utils.uid("rule"), text: data.text, done: false });
        });
      }
    });
  }

  function openApplyForm() {
    OS.Modal.form({
      title: "Add Apply Sheet Entry",
      submitLabel: "Add Entry",
      fields: [
        { name: "company", label: "Company" },
        { name: "role", label: "Role Track" },
        { name: "window", label: "Window" },
        { name: "ctc", label: "CTC" },
        { name: "action", label: "Action", type: "textarea" },
        { name: "notes", label: "Notes", type: "textarea" }
      ],
      onSubmit(data) {
        OS.Store.mutate((state) => {
          state.applicationCheatSheet.push(Object.assign({ id: OS.Utils.uid("apply"), applied: false }, data));
        });
      }
    });
  }

  function copyApplyToCompanies(id) {
    OS.Store.mutate((state) => {
      const entry = state.applicationCheatSheet.find((item) => item.id === id);
      if (!entry) return;
      const existing = state.companies.find((company) => company.companyName.toLowerCase() === entry.company.toLowerCase());
      if (existing) {
        existing.status = existing.status === "not applied" ? "applied" : existing.status;
        existing.notes = [existing.notes, entry.action, entry.notes].filter(Boolean).join(" | ");
      } else {
        state.companies.unshift({
          id: OS.Utils.uid("company"),
          companyName: entry.company,
          role: entry.role,
          ctc: entry.ctc,
          applicationWindow: entry.window,
          status: "applied",
          notes: [entry.action, entry.notes].filter(Boolean).join(" | ")
        });
      }
      entry.applied = true;
    });
  }

  OS.Rules = { render };
})(window.PlacementOS = window.PlacementOS || {});
