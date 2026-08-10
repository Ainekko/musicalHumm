<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  export let newLeads: number = 0;
  export let contacted: number = 0;
  export let qualified: number = 0;
  export let lost: number = 0;
  export let closed: number = 0;

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  $: total = newLeads + contacted + qualified + lost + closed;

  function buildChart() {
    if (!canvas) return;
    if (chart) chart.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['New', 'Contacted', 'Qualified', 'Lost', 'Closed'],
        datasets: [{
          data: [newLeads, contacted, qualified, lost, closed],
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',   // Blue for new
            'rgba(168, 85, 247, 0.85)',   // Purple for contacted
            'rgba(16, 185, 129, 0.85)',   // Emerald for qualified
            'rgba(239, 68, 68, 0.85)',    // Red for lost
            'rgba(245, 158, 11, 0.85)'    // Amber for closed
          ],
          borderColor: [
            'rgba(59, 130, 246, 0.3)',
            'rgba(168, 85, 247, 0.3)',
            'rgba(16, 185, 129, 0.3)',
            'rgba(239, 68, 68, 0.3)',
            'rgba(245, 158, 11, 0.3)'
          ],
          borderWidth: 2,
          hoverOffset: 8,
          spacing: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(24, 24, 27, 0.9)', // zinc-900
            titleColor: '#fff',
            bodyColor: '#a1a1aa',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleFont: { family: 'sans-serif', size: 11, weight: 'bold' },
            bodyFont: { family: 'sans-serif', size: 11 },
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              label: function(ctx: any) {
                const val = ctx.parsed;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${ctx.label}: ${val} (${pct}%)`;
              }
            }
          }
        },
      }
    });
  }

  $: if (canvas && (newLeads || contacted || qualified || lost || closed || total === 0)) {
    buildChart();
  }

  onMount(() => {
    buildChart();
  });

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class="flex flex-col items-center gap-6 w-full h-full">
  <div class="relative w-full flex-1 min-h-[220px]">
    <canvas bind:this={canvas}></canvas>
    <!-- Center label -->
    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span class="text-4xl font-black text-white tracking-tight">{total}</span>
      <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Total Leads</span>
    </div>
  </div>

  <!-- Custom Legend -->
  <div class="flex flex-wrap gap-x-5 gap-y-3 justify-center">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-blue-500"></span>
      <span class="text-[11px] font-bold text-zinc-400">New <span class="text-white ml-1">{newLeads}</span></span>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-purple-500"></span>
      <span class="text-[11px] font-bold text-zinc-400">Contacted <span class="text-white ml-1">{contacted}</span></span>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
      <span class="text-[11px] font-bold text-zinc-400">Qualified <span class="text-white ml-1">{qualified}</span></span>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-red-500"></span>
      <span class="text-[11px] font-bold text-zinc-400">Lost <span class="text-white ml-1">{lost}</span></span>
    </div>
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-amber-500"></span>
      <span class="text-[11px] font-bold text-zinc-400">Closed <span class="text-white ml-1">{closed}</span></span>
    </div>
  </div>
</div>
