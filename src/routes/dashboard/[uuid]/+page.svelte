<script lang="ts">
  /**
   * Lead CRM Dashboard Page - BordProd
   * ==================================
   * CRM dashboard to view and manage leads.
   * Branded for BordProd and stylized in Dark Mode with a Gen Z password lock screen.
   */
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { api } from '$lib/api/base';
  
  const uuid = $page.params.uuid;

  interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    project_description?: string;
    budget?: string;
    status: string;
    created_at: string;
    updated_at: string;
  }

  let leads: Lead[] = [];
  let loading = false;
  let error = '';
  let expandedLeadId: string | null = null;
  let statusUpdatingId: string | null = null;

  // Password Modal State
  let showPasswordModal = false;
  let passwordInput = '';
  let passwordError = '';

  // Stats
  $: totalLeads = leads.length;
  $: newLeadsCount = leads.filter(l => l.status === 'new').length;
  $: contactedLeadsCount = leads.filter(l => l.status === 'contacted').length;
  $: qualifiedLeadsCount = leads.filter(l => l.status === 'qualified').length;

  onMount(async () => {
    const storedPwd = localStorage.getItem('dashboard_password');
    if (storedPwd) {
      await fetchLeads(storedPwd);
    } else {
      showPasswordModal = true;
    }
  });

  async function handlePasswordSubmit(e?: Event) {
    if (e) e.preventDefault();
    passwordError = '';
    
    if (!passwordInput) {
      passwordError = 'Enter the code, bestie. 💅';
      return;
    }
    
    await fetchLeads(passwordInput);
  }

  async function fetchLeads(pwdToTry: string) {
    loading = true;
    error = '';
    passwordError = '';
    try {
      // First, verify the password against the backend
      await api.post('/leads/verify', { password: pwdToTry });

      // Then fetch the leads with password in the headers
      leads = await api.get<Lead[]>('/leads', {
        params: { token: uuid },
        headers: {
          'X-Dashboard-Password': pwdToTry
        }
      });
      // Succeeded! Save to localStorage and close modal
      localStorage.setItem('dashboard_password', pwdToTry);
      showPasswordModal = false;
    } catch (err: any) {
      console.error('Failed to fetch leads:', err);
      
      // Treat any 401 as a password/auth error
      if (err.status === 401) {
        localStorage.removeItem('dashboard_password');
        passwordError = 'Bruh, wrong key. 💀 Try again!';
        showPasswordModal = true;
      } else {
        error = err.message || 'Failed to load leads. Please check your configuration.';
      }
    } finally {
      loading = false;
    }
  }

  async function updateStatus(leadId: string, newStatus: string) {
    statusUpdatingId = leadId;
    const pwd = localStorage.getItem('dashboard_password') || '';
    try {
      const updatedLead = await api.patch<Lead>(`/leads/${leadId}`, {
        status: newStatus
      }, {
        params: { token: uuid },
        headers: {
          'X-Dashboard-Password': pwd
        }
      });
      leads = leads.map(l => l.id === leadId ? updatedLead : l);
    } catch (err: any) {
      alert('Erreur lors de la mise à jour: ' + err.message);
    } finally {
      statusUpdatingId = null;
    }
  }

  async function deleteLead(leadId: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) return;
    const pwd = localStorage.getItem('dashboard_password') || '';
    try {
      await api.delete(`/leads/${leadId}`, {
        params: { token: uuid },
        headers: {
          'X-Dashboard-Password': pwd
        }
      });
      leads = leads.filter(l => l.id !== leadId);
      if (expandedLeadId === leadId) expandedLeadId = null;
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  }

  function toggleExpand(leadId: string) {
    expandedLeadId = expandedLeadId === leadId ? null : leadId;
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `il y a ${diffDays}j`;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('fr-FR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function translateStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'new':
        return 'Nouveau';
      case 'contacted':
        return 'Contacté';
      case 'qualified':
        return 'Qualifié';
      case 'lost':
        return 'Perdu';
      default:
        return status;
    }
  }

  function getStatusClasses(status: string): string {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/25';
      case 'contacted':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
      case 'qualified':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'lost':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/25';
    }
  }

  function exportToCSV() {
    if (!leads || leads.length === 0) {
      alert('Aucun lead à exporter.');
      return;
    }

    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Entreprise', 'Budget', 'Statut', 'Description Projet', 'Date de création'];
    
    const rows = leads.map(lead => [
      lead.id,
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.email || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.company || '').replace(/"/g, '""')}"`,
      `"${(lead.budget || '').replace(/"/g, '""')}"`,
      `"${(translateStatus(lead.status) || '').replace(/"/g, '""')}"`,
      `"${(lead.project_description || '').replace(/"/g, '""')}"`,
      `"${(lead.created_at || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `bordprod-leads-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleLogout() {
    localStorage.removeItem('dashboard_password');
    passwordInput = '';
    passwordError = '';
    showPasswordModal = true;
  }
</script>

<svelte:head>
  <title>BordProd CRM | Gestion des Leads</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative overflow-hidden">
  
  <!-- Sleek neon backing glows -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/30 via-zinc-950 to-zinc-950 pointer-events-none z-0"></div>
  <div class="absolute -top-[30%] -right-[10%] w-[60%] aspect-square rounded-full bg-gradient-to-br from-[#7928ca]/10 via-[#e6005c]/5 to-transparent blur-[120px] pointer-events-none z-0"></div>
  <div class="absolute -bottom-[20%] -left-[10%] w-[50%] aspect-square rounded-full bg-gradient-to-tr from-[#ff5500]/5 to-transparent blur-[120px] pointer-events-none z-0"></div>

  <!-- Header -->
  <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 relative">
    <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5500] via-[#e6005c] to-[#7928ca] p-[1.5px] flex items-center justify-center">
          <div class="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
            <span class="text-xs font-black bg-gradient-to-r from-[#ff5500] to-[#7928ca] bg-clip-text text-transparent">BP</span>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-base font-black text-white tracking-tight">BordProd CRM</span>
          <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Dashboard Client</span>
        </div>
      </div>
      
      {#if !showPasswordModal && leads.length > 0}
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-450 font-semibold shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sync active
          </span>
          <button 
            on:click={handleLogout} 
            class="px-3.5 py-1.5 text-xs font-black text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
            title="Log out from dashboard"
          >
            🔒 Verrouiller
          </button>
        </div>
      {/if}
    </div>
  </header>

  {#if showPasswordModal}
    <!-- GEN Z Custom Password Lock Modal -->
    <div class="flex-1 flex items-center justify-center p-6 z-10 relative">
      <div class="w-full max-w-md bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fade-in-up">
        <div class="relative w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner group overflow-hidden">
          <span class="text-4xl transform group-hover:scale-125 transition-transform duration-300">🔒</span>
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            Hold up! Who goes there? 🛑
          </h2>
          <p class="text-sm text-zinc-450 font-medium">
            This dashboard is locked, bestie. Drop the secret key to view the lead database. 💅✨
          </p>
        </div>

        <form on:submit={handlePasswordSubmit} class="space-y-4 text-left">
          <div class="space-y-1.5">
            <label for="password" class="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">Secret Password</label>
            <input 
              type="password" 
              id="password" 
              bind:value={passwordInput} 
              placeholder="Type it here, no cap... 🤫"
              class="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm font-semibold focus:outline-none focus:border-[#e6005c] focus:ring-4 focus:ring-[#e6005c]/10 transition-all placeholder-zinc-700"
            />
          </div>

          {#if passwordError}
            <p class="text-xs font-bold text-rose-450 animate-pulse pl-1 flex items-center gap-1.5">
              <span>💀</span> {passwordError}
            </p>
          {/if}

          <button
            type="submit"
            disabled={loading}
            class="w-full py-4 text-sm font-black rounded-2xl bg-gradient-to-r from-[#ff5500] via-[#e6005c] to-[#7928ca] text-white hover:opacity-90 active:scale-98 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {#if loading}
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Checking vlc...</span>
            {:else}
              <span>Unlock Dashboard 🚀</span>
            {/if}
          </button>
        </form>
      </div>
    </div>
  {:else if loading && leads.length === 0}
    <!-- Loading spinner page -->
    <div class="flex-1 flex flex-col items-center justify-center z-10 relative">
      <div class="w-12 h-12 border-[3px] border-zinc-800 border-t-[#e6005c] rounded-full animate-spin"></div>
      <span class="mt-4 text-sm text-zinc-455 font-bold tracking-tight animate-pulse">Retrieving submissions... 🔥</span>
    </div>
  {:else if error}
    <!-- Error Page -->
    <div class="flex-1 max-w-xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center z-10 relative">
      <div class="w-16 h-16 bg-rose-500/10 text-rose-450 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/25">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="text-2xl font-black text-white mb-2">Build Failed / Connection Error</h2>
      <p class="text-sm text-zinc-450 mb-6 max-w-sm">{error}</p>
      <button 
        on:click={() => fetchLeads(localStorage.getItem('dashboard_password') || '')}
        class="px-6 py-3.5 text-xs font-black rounded-full bg-white text-zinc-950 hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
      >
        🔄 Retry Connection
      </button>
    </div>
  {:else}
    <!-- Main Dashboard Content -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-6 py-10 z-10 relative space-y-10">
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <h3 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Total Leads</h3>
          <p class="text-3xl font-black text-white tracking-tight">{totalLeads}</p>
        </div>
        
        <div class="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <h3 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Nouveaux Leads</h3>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-black text-white tracking-tight">{newLeadsCount}</p>
            {#if newLeadsCount > 0}
              <span class="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-pulse">Action</span>
            {/if}
          </div>
        </div>

        <div class="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <h3 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Contactés</h3>
          <p class="text-3xl font-black text-white tracking-tight">{contactedLeadsCount}</p>
        </div>

        <div class="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
          <h3 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Qualifiés</h3>
          <p class="text-3xl font-black text-emerald-450 tracking-tight">{qualifiedLeadsCount}</p>
        </div>
      </div>

      <!-- Leads Table Container -->
      <div class="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl">
        <div class="px-8 py-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/20 flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <h3 class="text-base font-black text-white tracking-tight">Registre des Contacts</h3>
            <span class="text-[10px] font-extrabold px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-350">
              {leads.length} soumissions
            </span>
          </div>
          <button 
            on:click={exportToCSV} 
            disabled={leads.length === 0}
            class="px-5 py-3 text-xs font-black rounded-full bg-zinc-100 text-zinc-950 hover:bg-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-2 shadow-md"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter en CSV
          </button>
        </div>

        {#if leads.length === 0}
          <div class="text-center py-24 px-6 text-zinc-500">
            <span class="text-4xl mb-4 block">📭</span>
            <h4 class="text-sm font-black text-zinc-300 mb-1">Aucun Lead Trouvé</h4>
            <p class="text-xs text-zinc-500 max-w-xs mx-auto">Dès que vos clients rempliront le formulaire de stratégie sur la landing page, ils apparaîtront ici.</p>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[10px] font-black text-zinc-450 uppercase tracking-widest bg-zinc-900/40 border-b border-zinc-850">
                  <th class="px-6 py-4.5 w-5"></th>
                  <th class="px-6 py-4.5">Client</th>
                  <th class="px-6 py-4.5">Entreprise</th>
                  <th class="px-6 py-4.5">Budget</th>
                  <th class="px-6 py-4.5">Statut</th>
                  <th class="px-6 py-4.5">Soumis</th>
                  <th class="px-6 py-4.5 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-900">
                {#each leads as lead (lead.id)}
                  {@const isExpanded = expandedLeadId === lead.id}
                  
                  <tr class="hover:bg-zinc-800/30 transition-colors cursor-pointer group" on:click={() => toggleExpand(lead.id)}>
                    <td class="pl-6 pr-0 py-5">
                      <svg
                        class="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform duration-200 {isExpanded ? 'rotate-90 text-white' : ''}"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                    <td class="px-6 py-5">
                      <div class="flex flex-col">
                        <span class="text-sm font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#e6005c] transition-all duration-200">{lead.name}</span>
                        <span class="text-xs text-zinc-400 font-semibold mt-0.5">{lead.email}</span>
                      </div>
                    </td>
                    <td class="px-6 py-5 text-sm text-zinc-350 font-medium">
                      {lead.company || '--'}
                    </td>
                    <td class="px-6 py-5 text-sm text-zinc-300 font-mono font-bold">
                      {lead.budget || '--'}
                    </td>
                    <td class="px-6 py-5">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold {getStatusClasses(lead.status)}">
                        {translateStatus(lead.status)}
                      </span>
                    </td>
                    <td class="px-6 py-5 text-xs text-zinc-450 font-semibold whitespace-nowrap">
                      {formatTime(lead.created_at)}
                    </td>
                    <td class="px-6 py-5 text-right pr-8" on:click|stopPropagation>
                      <div class="flex items-center justify-end gap-2.5">
                        <button 
                          on:click={() => toggleExpand(lead.id)}
                          class="px-4 py-2 text-xs font-black text-zinc-350 hover:text-white hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-all cursor-pointer"
                        >
                          Détails
                        </button>
                        <button 
                          on:click={() => deleteLead(lead.id)}
                          class="px-4 py-2 text-xs font-black text-rose-450 hover:text-white hover:bg-rose-950/40 rounded-lg border border-rose-900/30 transition-all cursor-pointer"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Detail Panel Expansion -->
                  {#if isExpanded}
                    <tr class="bg-zinc-900/20">
                      <td colspan="7" class="p-0 border-t border-zinc-850">
                        <div class="px-8 py-8 border-b border-zinc-850 space-y-6">
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <!-- Contact Details Card -->
                            <div class="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 shadow-inner space-y-4">
                              <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Coordonnées</h4>
                              <div class="space-y-3 text-sm">
                                <div class="flex items-center gap-2.5 text-zinc-305 font-semibold">
                                  <span class="text-zinc-500 text-base">👤</span>
                                  <span>{lead.name}</span>
                                </div>
                                <div class="flex items-center gap-2.5 text-zinc-305 font-semibold">
                                  <span class="text-zinc-500 text-base">✉️</span>
                                  <a href="mailto:{lead.email}" class="hover:underline hover:text-[#e6005c]">{lead.email}</a>
                                </div>
                                <div class="flex items-center gap-2.5 text-zinc-305 font-semibold">
                                  <span class="text-zinc-500 text-base">📞</span>
                                  {#if lead.phone}
                                    <a href="tel:{lead.phone}" class="font-mono hover:underline hover:text-[#e6005c]">{lead.phone}</a>
                                  {:else}
                                    <span class="italic text-zinc-500 font-medium">Aucun téléphone</span>
                                  {/if}
                                </div>
                              </div>
                            </div>

                            <!-- Meta Details Card -->
                            <div class="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 shadow-inner space-y-4">
                              <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cadrage Projet</h4>
                              <div class="space-y-2.5 text-sm">
                                <div class="flex justify-between border-b border-zinc-850 pb-1.5">
                                  <span class="text-zinc-450 font-medium">Entreprise</span>
                                  <span class="text-white font-bold">{lead.company || '--'}</span>
                                </div>
                                <div class="flex justify-between border-b border-zinc-850 pb-1.5">
                                  <span class="text-zinc-450 font-medium">Budget Target</span>
                                  <span class="text-white font-bold">{lead.budget || '--'}</span>
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-zinc-455 font-medium">Date d'envoi</span>
                                  <span class="text-zinc-450 font-bold text-xs">{formatDate(lead.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            <!-- Status update Selector -->
                            <div class="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 shadow-inner space-y-4">
                              <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Statut du Pipe</h4>
                              <div class="grid grid-cols-2 gap-2">
                                <button
                                  class="px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer {lead.status === 'new' ? 'bg-blue-500/10 text-blue-450 border-blue-500/30 ring-2 ring-blue-500/15' : 'bg-zinc-900/60 text-zinc-450 border-zinc-800 hover:bg-zinc-850'}"
                                  on:click={() => updateStatus(lead.id, 'new')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Nouveau
                                </button>
                                <button
                                  class="px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer {lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-450 border-amber-500/30 ring-2 ring-amber-500/15' : 'bg-zinc-900/60 text-zinc-455 border-zinc-800 hover:bg-zinc-850'}"
                                  on:click={() => updateStatus(lead.id, 'contacted')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Contacté
                                </button>
                                <button
                                  class="px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer {lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/30 ring-2 ring-emerald-500/15' : 'bg-zinc-900/60 text-zinc-450 border-zinc-800 hover:bg-zinc-850'}"
                                  on:click={() => updateStatus(lead.id, 'qualified')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Qualifié
                                </button>
                                <button
                                  class="px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer {lead.status === 'lost' ? 'bg-rose-500/10 text-rose-450 border-rose-500/30 ring-2 ring-rose-500/15' : 'bg-zinc-900/60 text-zinc-455 border-zinc-800 hover:bg-zinc-850'}"
                                  on:click={() => updateStatus(lead.id, 'lost')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Perdu
                                </button>
                              </div>
                            </div>
                          </div>

                          <!-- Project Description -->
                          <div class="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 shadow-inner space-y-2.5">
                            <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Objectifs & Besoins Détaillés</h4>
                            <p class="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                              {lead.project_description || 'Aucun détail fourni.'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </main>
  {/if}
</div>

<style>
  /* Custom smooth slide-down transitions and chevrons */
  tr :global(svg) {
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s;
  }
</style>
