(function (OS) {
  "use strict";

  function render(root, state) {
    const projects = state.projects || [];
    const avgProgress = projects.length ? Math.round(projects.reduce((sum, item) => sum + Number(item.progress || 0), 0) / projects.length) : 0;
    const completed = projects.filter((item) => item.status === "completed").length;

    root.innerHTML = `
      <section class="metric-grid compact">
        ${OS.Utils.metricCard("Projects", projects.length, "Roadmap portfolio")}
        ${OS.Utils.metricCard("Completed", completed, "Done")}
        ${OS.Utils.metricCard("Average Progress", `${avgProgress}%`, "Across all projects")}
        ${OS.Utils.metricCard("Deployed", projects.filter((item) => item.status === "deployed" || item.deploymentLink).length, "Live/demo ready")}
      </section>
      <section class="toolbar-row">
        <div>
          <h2>Project Tracker</h2>
          <p>Add custom portfolio work or remove entries that no longer matter.</p>
        </div>
        <button class="primary" type="button" data-add-project>Add Project</button>
      </section>
      <section class="project-grid">
        ${projects.map(renderProjectCard).join("")}
      </section>
    `;
    bindEvents(root);
  }

  function renderProjectCard(project) {
    return `
      <article class="project-card">
        <div class="section-heading">
          <div>
            <h2>${OS.Utils.escape(project.projectName)}</h2>
            <p>${OS.Utils.escape(project.notes)}</p>
            <div style="margin-top:8px">${(project.techStack || []).map((t) => `<span class="tech-tag">${OS.Utils.escape(t)}</span>`).join('')}</div>
          </div>
          <div class="project-actions">
            ${OS.Utils.statusBadge(project.status)}
            <button class="danger ghost small" type="button" data-delete-project="${OS.Utils.escape(project.id)}">Delete</button>
          </div>
        </div>
        ${OS.Utils.progressBar(project.progress, `${project.projectName} progress`)}
        <div class="project-fields">
          <label class="field"><span>GitHub Link</span><input data-project-field="githubLink" data-id="${OS.Utils.escape(project.id)}" value="${OS.Utils.escape(project.githubLink)}"></label>
          <label class="field"><span>Deployment Link</span><input data-project-field="deploymentLink" data-id="${OS.Utils.escape(project.id)}" value="${OS.Utils.escape(project.deploymentLink)}"></label>
          <label class="field"><span>Status</span><select data-project-field="status" data-id="${OS.Utils.escape(project.id)}">
            ${OS.Seed.projectStatuses.map((status) => `<option value="${OS.Utils.escape(status)}" ${project.status === status ? "selected" : ""}>${OS.Utils.escape(status)}</option>`).join("")}
          </select></label>
          <label class="field"><span>Progress %</span><input type="range" min="0" max="100" data-project-field="progress" data-id="${OS.Utils.escape(project.id)}" value="${Number(project.progress || 0)}"></label>
        </div>
        <div class="project-checks">
          ${[
            ["readmeCompleted", "README completed?"],
            ["shapAdded", "SHAP added?"],
            ["mlflowAdded", "MLflow added?"],
            ["dockerized", "Dockerized?"]
          ].map(([field, label]) => `
            <label class="check-row">
              <input type="checkbox" data-project-field="${field}" data-id="${OS.Utils.escape(project.id)}" ${project[field] ? "checked" : ""}>
              <span>${OS.Utils.escape(label)}</span>
            </label>
          `).join("")}
        </div>
        <label class="field">
          <span>Notes</span>
          <textarea rows="3" data-project-field="notes" data-id="${OS.Utils.escape(project.id)}">${OS.Utils.escape(project.notes || "")}</textarea>
        </label>
      </article>
    `;
  }

  function bindEvents(root) {
    const add = root.querySelector("[data-add-project]");
    if (add) add.addEventListener("click", () => openProjectForm());

    root.querySelectorAll("[data-delete-project]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteProject;
        OS.Store.mutate((state) => {
          state.projects = state.projects.filter((item) => item.id !== id);
        });
      });
    });

    root.querySelectorAll("[data-project-field]").forEach((input) => {
      input.addEventListener("change", () => {
        const id = input.dataset.id;
        const field = input.dataset.projectField;
        OS.Store.mutate((state) => {
          const project = state.projects.find((item) => item.id === id);
          if (!project) return;
          if (input.type === "checkbox") project[field] = input.checked;
          else if (input.type === "range") project[field] = Number(input.value || 0);
          else project[field] = input.value;
          if (field === "status" && input.value === "completed") project.progress = 100;
          if (field === "progress" && Number(input.value) === 100) project.status = "completed";
          if (field === "deploymentLink" && input.value && project.status === "planning") project.status = "deployed";
        });
      });
    });
  }

  function openProjectForm() {
    OS.Modal.form({
      title: "Add Project",
      submitLabel: "Create Project",
      fields: [
        { name: "projectName", label: "Project Name" },
        { name: "githubLink", label: "GitHub Link" },
        { name: "deploymentLink", label: "Deployment Link" },
        { name: "status", label: "Status", type: "select", value: "planning", options: OS.Seed.projectStatuses },
        { name: "progress", label: "Progress %", type: "range", value: 0, min: 0, max: 100 },
        { name: "readmeCompleted", label: "README completed?", type: "checkbox" },
        { name: "shapAdded", label: "SHAP added?", type: "checkbox" },
        { name: "mlflowAdded", label: "MLflow added?", type: "checkbox" },
        { name: "dockerized", label: "Dockerized?", type: "checkbox" },
        { name: "notes", label: "Notes", type: "textarea" }
      ],
      onSubmit(data) {
        OS.Store.mutate((state) => {
          state.projects.unshift(Object.assign({ id: OS.Utils.uid("project") }, data));
        });
      }
    });
  }

  OS.Projects = { render };
})(window.PlacementOS = window.PlacementOS || {});
