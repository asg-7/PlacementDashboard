import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function AnalyticsView({ state }) {
  const s = state;
  const wt = s.weekTasks || {};

  const appSent = s.companies.filter(c => c.status !== 'not applied').length;
  const certDone = s.certifications.filter(c => c.progress >= 100).length;
  const dsaSolved = (s.dsaProblems || []).filter(d => d.status === 'solved').length;
  
  let tasksDone = 0, totalTasks = 0;
  Object.values(wt).forEach(arr => {
    arr.forEach(v => {
      totalTasks++;
      if (v) tasksDone++;
    });
  });

  const execScore = Math.round(
    ((s.companies.length ? (appSent / s.companies.length) : 0) * 25) +
    ((s.certifications.length ? (certDone / s.certifications.length) : 0) * 25) +
    (Math.min(dsaSolved, 100) / 100 * 25) +
    (totalTasks > 0 ? (tasksDone / totalTasks * 25) : 0)
  );

  const appChartRef = useRef(null);
  const roadChartRef = useRef(null);
  const certChartRef = useRef(null);
  const weekChartRef = useRef(null);

  const chartInstances = useRef({});

  useEffect(() => {
    // Helper to safety clean charts
    const destroyAll = () => {
      Object.keys(chartInstances.current).forEach(key => {
        if (chartInstances.current[key]) {
          chartInstances.current[key].destroy();
          chartInstances.current[key] = null;
        }
      });
    };

    destroyAll();

    Chart.defaults.color = '#445570';
    Chart.defaults.borderColor = 'rgba(255,255,255,.05)';

    // Chart 1: Application Pipeline (Bar)
    if (appChartRef.current) {
      const appStatuses = ['not applied', 'applied', 'under review', 'OA received', 'interview', 'accepted', 'rejected'];
      const appCounts = appStatuses.map(st => s.companies.filter(c => c.status === st).length);
      chartInstances.current.app = new Chart(appChartRef.current, {
        type: 'bar',
        data: {
          labels: appStatuses.map(st => st.replace(' ', '\n')),
          datasets: [{
            data: appCounts,
            backgroundColor: ['#2A3650', '#00E5FF', '#FFB800', '#FFB800', '#B04AFF', '#ADFF2F', '#FF4757'],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#445570', font: { size: 9 } }, grid: { display: false } },
            y: { ticks: { color: '#445570', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,.04)' } }
          }
        }
      });
    }

    // Chart 2: Roadmap Progress (Line)
    if (roadChartRef.current) {
      const roadLabels = s.roadmapWeeks.map(w => `W${w.week}`);
      const roadDone = s.roadmapWeeks.map(w => {
        const tasks = w.tasks || [];
        const done = wt[w.id] || new Array(tasks.length).fill(false);
        return tasks.length ? Math.round(done.filter(Boolean).length / tasks.length * 100) : 0;
      });
      chartInstances.current.road = new Chart(roadChartRef.current, {
        type: 'line',
        data: {
          labels: roadLabels,
          datasets: [{
            data: roadDone,
            borderColor: '#00E5FF',
            backgroundColor: 'rgba(0,229,255,.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00E5FF',
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#445570', font: { size: 8 } }, grid: { display: false } },
            y: {
              min: 0,
              max: 100,
              ticks: { color: '#445570', callback: v => v + '%', font: { size: 9 } },
              grid: { color: 'rgba(255,255,255,.04)' }
            }
          }
        }
      });
    }

    // Chart 3: Certification Status (Doughnut)
    if (certChartRef.current) {
      const certDoneCount = s.certifications.filter(c => c.progress >= 100).length;
      const certProgCount = s.certifications.filter(c => c.progress > 0 && c.progress < 100).length;
      const certNoneCount = s.certifications.filter(c => c.progress === 0).length;
      chartInstances.current.cert = new Chart(certChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Not started'],
          datasets: [{
            data: [certDoneCount, certProgCount, certNoneCount],
            backgroundColor: ['#ADFF2F', '#00E5FF', '#2A3650'],
            borderColor: '#0C1220',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#8899BB', font: { size: 10 }, padding: 12 }
            }
          },
          cutout: '60%'
        }
      });
    }

    // Chart 4: Weekly Task Completion (Stacked Bar)
    if (weekChartRef.current) {
      const roadLabels = s.roadmapWeeks.map(w => `W${w.week}`);
      const weekDoneArr = s.roadmapWeeks.map(w => {
        const tasks = w.tasks || [];
        const done = (wt[w.id] || new Array(tasks.length).fill(false));
        return done.filter(Boolean).length;
      });
      const weekTotalArr = s.roadmapWeeks.map(w => (w.tasks || []).length);
      chartInstances.current.week = new Chart(weekChartRef.current, {
        type: 'bar',
        data: {
          labels: roadLabels,
          datasets: [
            { label: 'Done', data: weekDoneArr, backgroundColor: 'rgba(173,255,47,.7)', borderRadius: 4, borderSkipped: false },
            { label: 'Remaining', data: weekTotalArr.map((t, i) => t - weekDoneArr[i]), backgroundColor: 'rgba(255,255,255,.05)', borderRadius: 4, borderSkipped: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#8899BB', font: { size: 11 } } } },
          scales: {
            x: { stacked: true, ticks: { color: '#445570', font: { size: 8 } }, grid: { display: false } },
            y: { stacked: true, ticks: { color: '#445570', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,.04)' } }
          }
        }
      });
    }

    return destroyAll;
  }, [s.companies, s.certifications, s.dsaProblems, s.roadmapWeeks, wt]);

  return (
    <div style={{ animation: 'fade-in 0.4s ease-out' }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Progress Overview</div>
          <div className="ph-title">Analytics</div>
          <div className="ph-sub">Execution metrics and performance tracking</div>
        </div>
        <div className="badge b-blue" style={{ fontSize: '13px', padding: '10px 18px' }}>Exec Score {execScore}%</div>
      </div>

      <div className="g3" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="card-hdr"><div className="card-title">Application Pipeline</div></div>
          <div style={{ height: '220px' }}><canvas ref={appChartRef}></canvas></div>
        </div>
        <div className="card">
          <div className="card-hdr"><div className="card-title">Roadmap Progress</div></div>
          <div style={{ height: '220px' }}><canvas ref={roadChartRef}></canvas></div>
        </div>
        <div className="card">
          <div className="card-hdr"><div className="card-title">Certification Status</div></div>
          <div style={{ height: '220px' }}><canvas ref={certChartRef}></canvas></div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><div className="card-title">Weekly Task Completion</div></div>
        <div style={{ height: '220px' }}><canvas ref={weekChartRef}></canvas></div>
      </div>
    </div>
  );
}
