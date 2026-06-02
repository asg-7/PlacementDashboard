(function (OS) {
  "use strict";

  function close() {
    const modal = document.querySelector(".modal-overlay");
    if (modal) modal.remove();
  }

  function open(options) {
    close();
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h2 id="modal-title">${OS.Utils.escape(options.title || "Details")}</h2>
          <button class="icon-button" type="button" data-modal-close aria-label="Close">x</button>
        </div>
        <div class="modal-body"></div>
      </div>
    `;
    overlay.querySelector(".modal-body").appendChild(options.content);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.matches("[data-modal-close]")) close();
    });
    document.addEventListener("keydown", escapeHandler);
    return overlay;
  }

  function escapeHandler(event) {
    if (event.key === "Escape") {
      close();
      document.removeEventListener("keydown", escapeHandler);
    }
  }

  function form(options) {
    const content = document.createElement("form");
    content.className = "modal-form";

    options.fields.forEach((field) => {
      const label = document.createElement("label");
      label.className = field.type === "checkbox" ? "check-row" : "field";
      label.innerHTML = field.type === "checkbox"
        ? `<input type="checkbox" name="${field.name}" ${field.value ? "checked" : ""}> <span>${OS.Utils.escape(field.label)}</span>`
        : `<span>${OS.Utils.escape(field.label)}</span>${inputFor(field)}`;
      content.appendChild(label);
    });

    const actions = document.createElement("div");
    actions.className = "modal-actions";
    actions.innerHTML = `
      <button class="secondary" type="button" data-modal-close>Cancel</button>
      <button class="primary" type="submit">${OS.Utils.escape(options.submitLabel || "Save")}</button>
    `;
    content.appendChild(actions);

    content.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = {};
      options.fields.forEach((field) => {
        const input = content.elements[field.name];
        if (!input) return;
        if (field.type === "checkbox") data[field.name] = input.checked;
        else if (field.type === "number" || field.type === "range") data[field.name] = Number(input.value || 0);
        else data[field.name] = input.value.trim();
      });
      options.onSubmit(data);
      close();
    });

    return open({ title: options.title, content });
  }

  function inputFor(field) {
    const value = field.value == null ? "" : String(field.value);
    if (field.type === "textarea") {
      return `<textarea name="${field.name}" rows="${field.rows || 4}">${OS.Utils.escape(value)}</textarea>`;
    }
    if (field.type === "select") {
      const choices = field.options || [];
      return `<select name="${field.name}">${choices.map((choice) => `<option value="${OS.Utils.escape(choice)}" ${choice === value ? "selected" : ""}>${OS.Utils.escape(choice)}</option>`).join("")}</select>`;
    }
    if (field.type === "range") {
      return `<input type="range" name="${field.name}" min="${field.min || 0}" max="${field.max || 100}" value="${OS.Utils.escape(value)}">`;
    }
    return `<input type="${field.type || "text"}" name="${field.name}" value="${OS.Utils.escape(value)}" ${field.min != null ? `min="${field.min}"` : ""} ${field.max != null ? `max="${field.max}"` : ""}>`;
  }

  OS.Modal = { open, close, form };
})(window.PlacementOS = window.PlacementOS || {});
