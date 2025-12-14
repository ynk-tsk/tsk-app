import React, { useEffect, useRef } from "react";
import CardBase from "../ui/CardBase";

const Roadmap = ({ T }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    let destroyed = false;
    (async () => {
      const { default: Chart } = await import('chart.js/auto');
      if (destroyed || !chartRef.current) return;

      const ctx = chartRef.current.getContext('2d');

      const roadmapData = [
        { task: 'Migration Next.js & SEO Technique', pillar: 'Fondation', start: 0, end: 3 },
        { task: 'Optimisation Vitesse & Core Web Vitals', pillar: 'Fondation', start: 1, end: 4 },
        { task: 'Mise en place Tracking & RGPD', pillar: 'Fondation', start: 2, end: 4 },
        { task: 'Début Scraping & Acquisition Données', pillar: 'Acquisition', start: 3, end: 7 },
        { task: 'Lancement Programmatic SEO', pillar: 'Acquisition', start: 4, end: 9 },
        { task: 'Onboarding v1 & Alertes', pillar: 'Acquisition', start: 5, end: 8 },
        { task: 'Campagnes SEA Ciblées', pillar: 'Acquisition', start: 6, end: 10 },
        { task: 'Début A/B Testing & CRO', pillar: 'Optimisation', start: 9, end: 14 },
        { task: 'Implémentation CRM & Automation', pillar: 'Optimisation', start: 10, end: 16 },
        { task: 'Pilote Écosystème Créateurs', pillar: 'Optimisation', start: 12, end: 18 },
      ];

      const pillarColors = {
        'Fondation': 'rgba(59, 130, 246, 0.8)',
        'Acquisition': 'rgba(234, 88, 12, 0.8)',
        'Optimisation': 'rgba(16, 185, 129, 0.8)'
      };

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: roadmapData.map(d => d.task),
          datasets: [{
            data: roadmapData.map(d => [d.start, d.end]),
            backgroundColor: roadmapData.map(d => pillarColors[d.pillar]),
            borderSkipped: false,
            borderRadius: 4,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { min: 0, max: 18, title: { display: true, text: 'Mois', color: '#475569' }, ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
            y: { ticks: { color: '#334155' }, grid: { display: false } }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const pillar = roadmapData[context.dataIndex].pillar;
                  const start = context.raw[0];
                  const end = context.raw[1];
                  return `${pillar}: Mois ${start} → ${end}`;
                }
              }
            }
          }
        }
      });
    })();

    return () => {
      destroyed = true;
      chartInstance.current?.destroy();
    };
  }, []);

  return (
    <section id="roadmap" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900">{T.roadmap_title}</h2>
        <p className="text-slate-600 text-center mt-4">{T.roadmap_subtitle}</p>
        <CardBase className="mt-12 p-6 h-[500px]">
          <canvas ref={chartRef} aria-label="Feuille de route TSK" role="img"></canvas>
        </CardBase>
      </div>
    </section>
  );
};

export default Roadmap;
