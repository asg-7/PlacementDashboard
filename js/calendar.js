(function (OS) {
  "use strict";

  const categories = ["application", "hackathon", "contest", "interview", "certification", "milestone", "reminder"];
  const colors = {
    application: "#2563eb",
    hackathon: "#7c3aed",
    contest: "#f59e0b",
    interview: "#dc2626",
    certification: "#16a34a",
    milestone: "#0f766e",
    reminder: "#64748b"
  };

  function render(root, state) {
    root.innerHTML = `
      <section class="toolbar-row">
        <div>
          <h2>Master Calendar</h2>
          <p>Applications, hackathons, contests, interviews, certification deadlines, weekly milestones, and reminders.</p>
        </div>
        <button class="primary" type="button" data-add-event>Add Event</button>
      </section>
      <section class="calendar-legend">
        ${categories.map((category) => `<span><i style="background:${colors[category]}"></i>${OS.Utils.escape(category)}</span>`).join("")}
      </section>
      <section class="panel">
        <div id="calendar-root"></div>
      </section>
    `;

    bindEvents(root);
    renderCalendar(state);
  }

  function renderCalendar(state) {
    const el = document.getElementById("calendar-root");
    if (!el) return;
    if (!window.FullCalendar) {
      el.innerHTML = `<p class="chart-fallback">FullCalendar did not load. Check your internet connection for CDN assets.</p>`;
      return;
    }

    const calendar = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      height: "auto",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      events: (state.calendarEvents || []).map(toFullCalendarEvent),
      dateClick(info) {
        openEventForm({ start: info.dateStr, category: "reminder" });
      },
      eventClick(info) {
        const event = info.event;
        openEventForm({
          id: event.id,
          title: event.title,
          start: event.startStr.slice(0, 10),
          end: event.endStr ? event.endStr.slice(0, 10) : "",
          category: event.extendedProps.category,
          reminder: event.extendedProps.reminder,
          notes: event.extendedProps.notes
        });
      }
    });
    calendar.render();
  }

  function toFullCalendarEvent(event) {
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || undefined,
      backgroundColor: colors[event.category] || colors.reminder,
      borderColor: colors[event.category] || colors.reminder,
      extendedProps: {
        category: event.category || "reminder",
        reminder: event.reminder || "",
        notes: event.notes || ""
      }
    };
  }

  function bindEvents(root) {
    const add = root.querySelector("[data-add-event]");
    if (add) add.addEventListener("click", () => openEventForm({ start: OS.Store.todayISO(), category: "reminder" }));
  }

  function openEventForm(existing) {
    const isExisting = Boolean(existing.id);
    const content = document.createElement("form");
    content.className = "modal-form";
    content.innerHTML = `
      <label class="field"><span>Title</span><input name="title" value="${OS.Utils.escape(existing.title || "")}" required></label>
      <label class="field"><span>Category</span><select name="category">
        ${categories.map((category) => `<option value="${category}" ${existing.category === category ? "selected" : ""}>${category}</option>`).join("")}
      </select></label>
      <label class="field"><span>Start</span><input type="date" name="start" value="${OS.Utils.escape(existing.start || OS.Store.todayISO())}" required></label>
      <label class="field"><span>End</span><input type="date" name="end" value="${OS.Utils.escape(existing.end || "")}"></label>
      <label class="field"><span>Reminder Label</span><input name="reminder" value="${OS.Utils.escape(existing.reminder || "")}"></label>
      <label class="field"><span>Notes</span><textarea name="notes" rows="4">${OS.Utils.escape(existing.notes || "")}</textarea></label>
      <div class="modal-actions">
        ${isExisting ? `<button class="danger" type="button" data-delete-event="${OS.Utils.escape(existing.id)}">Delete</button>` : ""}
        <button class="secondary" type="button" data-modal-close>Cancel</button>
        <button class="primary" type="submit">Save Event</button>
      </div>
    `;

    content.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(content);
      const data = {
        title: String(form.get("title") || "").trim(),
        category: String(form.get("category") || "reminder"),
        start: String(form.get("start") || OS.Store.todayISO()),
        end: String(form.get("end") || ""),
        reminder: String(form.get("reminder") || "").trim(),
        notes: String(form.get("notes") || "").trim()
      };
      OS.Store.mutate((state) => {
        if (isExisting) {
          const item = state.calendarEvents.find((calendarEvent) => calendarEvent.id === existing.id);
          if (item) Object.assign(item, data);
        } else {
          state.calendarEvents.push(Object.assign({ id: OS.Utils.uid("event") }, data));
        }
      });
      OS.Modal.close();
    });

    const deleteButton = content.querySelector("[data-delete-event]");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        OS.Store.mutate((state) => {
          state.calendarEvents = state.calendarEvents.filter((event) => event.id !== existing.id);
        });
        OS.Modal.close();
      });
    }

    OS.Modal.open({ title: isExisting ? "Edit Calendar Event" : "Add Calendar Event", content });
  }

  OS.Calendar = { render };
})(window.PlacementOS = window.PlacementOS || {});
