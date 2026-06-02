(function (OS) {
  "use strict";

  function render(container, activity, options) {
    const days = (options && options.days) || 182;
    const title = (options && options.title) || "Consistency Heatmap";
    const today = new Date(`${OS.Store.todayISO()}T00:00:00`);
    const start = new Date(today);
    start.setDate(today.getDate() - days + 1);

    const cells = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const iso = cursor.toISOString().slice(0, 10);
      const count = Number((activity || {})[iso] || 0);
      cells.push({ iso, count, level: getLevel(count) });
      cursor.setDate(cursor.getDate() + 1);
    }

    const palette = [
      'rgba(248,113,113,0.35)',
      'rgba(167,139,250,0.40)',
      'rgba(56,189,248,0.70)',
      'rgba(52,211,153,0.85)'
    ];

    container.innerHTML = `
      <div class="section-heading">
        <div>
          <h2>${OS.Utils.escape(title)}</h2>
          <p>${days} days of logged execution activity</p>
        </div>
      </div>
      <div class="heatmap" aria-label="${OS.Utils.escape(title)}">
        ${cells.map((cell) => {
          const color = (function(level){
            if (level <= 0) return palette[0];
            if (level === 1) return palette[1];
            if (level === 2) return palette[2];
            return palette[3];
          })(cell.level);
          return `<span class="heat-cell" title="${cell.iso}: ${cell.count} activity entries" style="background:${color}"></span>`;
        }).join("")}
      </div>
      <div class="heatmap-legend">
        <span>Low</span>
        <span class="heat-legend-swatch" style="background:${palette[0]}"></span>
        <span class="heat-legend-swatch" style="background:${palette[1]}"></span>
        <span class="heat-legend-swatch" style="background:${palette[2]}"></span>
        <span class="heat-legend-swatch" style="background:${palette[3]}"></span>
        <span>High</span>
      </div>
    `;
  }

  function getLevel(count) {
    if (!count) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
  }

  OS.Heatmap = { render };
})(window.PlacementOS = window.PlacementOS || {});
