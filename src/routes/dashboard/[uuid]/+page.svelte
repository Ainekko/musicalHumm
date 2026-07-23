<script lang="ts">
  /**
   * Lead CRM Dashboard Page - BordProd
   * ==================================
   * CRM dashboard to view and manage leads.
   * Branded for BordProd and localized in French.
   */
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { api } from '$lib/api/base';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';

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
  let loading = true;
  let error = '';
  let expandedLeadId: string | null = null;
  let statusUpdatingId: string | null = null;

  // Stats
  $: totalLeads = leads.length;
  $: newLeadsCount = leads.filter(l => l.status === 'new').length;
  $: contactedLeadsCount = leads.filter(l => l.status === 'contacted').length;
  $: qualifiedLeadsCount = leads.filter(l => l.status === 'qualified').length;

  onMount(async () => {
    await fetchLeads();
  });

  async function fetchLeads() {
    loading = true;
    error = '';
    try {
      leads = await api.get<Lead[]>('/leads', {
        params: { token: uuid }
      });
    } catch (err: any) {
      console.error('Failed to fetch leads:', err);
      error = err.message || 'Impossible de charger les leads. Veuillez vérifier votre clé secrète.';
    } finally {
      loading = false;
    }
  }

  async function updateStatus(leadId: string, newStatus: string) {
    statusUpdatingId = leadId;
    try {
      const updatedLead = await api.patch<Lead>(`/leads/${leadId}`, {
        status: newStatus
      }, {
        params: { token: uuid }
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
    try {
      await api.delete(`/leads/${leadId}`, {
        params: { token: uuid }
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

  function getStatusVariant(status: string): 'success' | 'warning' | 'info' | 'error' | 'neutral' {
    switch (status.toLowerCase()) {
      case 'new':
        return 'info';
      case 'contacted':
        return 'warning';
      case 'qualified':
        return 'success';
      case 'lost':
        return 'error';
      default:
        return 'neutral';
    }
  }
</script>

<svelte:head>
  <title>BordProd CRM | Gestion des Leads</title>
</svelte:head>

<div class="min-h-screen bg-white flex flex-col font-sans">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white border-b border-zinc-150">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="/logo/logo-icon.png" alt="BordProd Icon" class="h-8 object-contain" />
        <div class="flex flex-col">
          <span class="text-sm font-black text-zinc-900 tracking-tight">BordProd CRM</span>
          <span class="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Gestion des Leads</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Badge variant="success" dot={true}>Base connectée</Badge>
      </div>
    </div>
  </header>

  {#if loading}
    <div class="flex-1 flex flex-col items-center justify-center py-24">
      <Spinner size="lg" />
      <span class="mt-4 text-sm text-zinc-500 font-medium animate-pulse">Chargement des leads...</span>
    </div>
  {:else if error}
    <div class="flex-1 max-w-xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-100">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-zinc-900 mb-2">Accès Refusé / Connexion Échouée</h2>
      <p class="text-sm text-zinc-500 mb-6 max-w-sm">{error}</p>
      <Button variant="secondary" on:click={fetchLeads}>
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
        </svg>
        Réessayer la connexion
      </Button>
    </div>
  {:else}
    <!-- Main Content -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card padding="p-5">
          <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Total Leads</h3>
          <p class="text-3xl font-black text-zinc-900">{totalLeads}</p>
        </Card>
        <Card padding="p-5">
          <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nouveaux leads</h3>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-black text-zinc-900">{newLeadsCount}</p>
            {#if newLeadsCount > 0}
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 animate-pulse">Action Requise</span>
            {/if}
          </div>
        </Card>
        <Card padding="p-5">
          <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Contactés</h3>
          <p class="text-3xl font-black text-zinc-900">{contactedLeadsCount}</p>
        </Card>
        <Card padding="p-5">
          <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Qualifiés (Gagnés)</h3>
          <p class="text-3xl font-black text-emerald-600">{qualifiedLeadsCount}</p>
        </Card>
      </div>

      <!-- Leads List Card -->
      <Card padding="p-0">
        <div class="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white">
          <h3 class="text-sm font-bold text-zinc-700">Registre des Contacts</h3>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-150 text-zinc-650">{leads.length} soumissions</span>
        </div>

        {#if leads.length === 0}
          <div class="text-center py-20 px-6 text-zinc-400">
            <div class="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-200/50">
              <svg class="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11h-6m-9.074 2.166l-.1.1A2 2 0 002.583 15.2l.4.4a2 2 0 002.93 0l.1-.1a2 2 0 011.666-.6h1.074a2 2 0 011.666.6l.1.1a2 2 0 002.93 0l.4-.4a2 2 0 000-2.93l-.1-.1a2 2 0 01-.6-1.666V10a2 2 0 01.6-1.666l.1-.1a2 2 0 000-2.93l-.4-.4a2 2 0 00-2.93 0l-.1.1a2 2 0 01-1.666.6H7.583a2 2 0 01-1.666-.6l-.1-.1a2 2 0 00-2.93 0l-.4.4a2 2 0 000 2.93l.1.1a2 2 0 01.6 1.666v1.074a2 2 0 01-.6 1.666z" />
              </svg>
            </div>
            <h4 class="text-sm font-bold text-zinc-700 mb-1">Aucun Lead Trouvé</h4>
            <p class="text-xs text-zinc-500 max-w-xs mx-auto">Dès que vos clients rempliront le formulaire sur la landing page, ils apparaîtront ici instantanément.</p>
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-xs font-bold text-[#008ba3] uppercase tracking-wider bg-[#e0f7f8]/30 border-b border-zinc-100">
                  <th class="px-6 py-4 w-5"></th>
                  <th class="px-6 py-4">Client</th>
                  <th class="px-6 py-4">Entreprise</th>
                  <th class="px-6 py-4">Budget</th>
                  <th class="px-6 py-4">Statut</th>
                  <th class="px-6 py-4">Soumis</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100">
                {#each leads as lead (lead.id)}
                  {@const isExpanded = expandedLeadId === lead.id}
                  
                  <tr class="hover:bg-zinc-50/30 transition-colors cursor-pointer group" on:click={() => toggleExpand(lead.id)}>
                    <td class="pl-6 pr-0 py-4.5">
                      <svg
                        class="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                    <td class="px-6 py-4.5">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-zinc-950">{lead.name}</span>
                        <span class="text-xs text-zinc-500 font-medium">{lead.email}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4.5 text-sm text-zinc-600 font-medium">
                      {lead.company || '--'}
                    </td>
                    <td class="px-6 py-4.5 text-sm text-zinc-600 font-mono">
                      {lead.budget || '--'}
                    </td>
                    <td class="px-6 py-4.5">
                      <Badge variant={getStatusVariant(lead.status)}>
                        {translateStatus(lead.status)}
                      </Badge>
                    </td>
                    <td class="px-6 py-4.5 text-xs text-zinc-400 font-medium whitespace-nowrap">
                      {formatTime(lead.created_at)}
                    </td>
                    <td class="px-6 py-4.5 text-right" on:click|stopPropagation>
                      <div class="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" on:click={() => toggleExpand(lead.id)}>
                          Détails
                        </Button>
                        <Button variant="danger" size="sm" on:click={() => deleteLead(lead.id)}>
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>

                  <!-- Detail Panel Expansion -->
                  {#if isExpanded}
                    <tr class="bg-[#f8fcfe]/80">
                      <td colspan="7" class="p-0 border-t border-zinc-100">
                        <div class="px-8 py-6 border-b border-zinc-100 space-y-6">
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Contact Details Card -->
                            <div class="bg-white rounded-xl border border-zinc-200/50 p-5 shadow-sm space-y-3.5">
                              <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Coordonnées</h4>
                              <div class="space-y-2.5 text-sm">
                                <div class="flex items-center gap-2.5 text-zinc-600">
                                  <svg class="w-4.5 h-4.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span>{lead.name}</span>
                                </div>
                                <div class="flex items-center gap-2.5 text-zinc-600">
                                  <svg class="w-4.5 h-4.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  <a href="mailto:{lead.email}" class="hover:underline hover:text-cyan-600">{lead.email}</a>
                                </div>
                                <div class="flex items-center gap-2.5 text-zinc-600">
                                  <svg class="w-4.5 h-4.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {#if lead.phone}
                                    <a href="tel:{lead.phone}" class="font-mono hover:underline hover:text-cyan-600">{lead.phone}</a>
                                  {:else}
                                    <span class="italic text-zinc-400">Aucun téléphone fourni</span>
                                  {/if}
                                </div>
                              </div>
                            </div>

                            <!-- Meta Details Card -->
                            <div class="bg-white rounded-xl border border-zinc-200/50 p-5 shadow-sm space-y-3.5">
                              <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cadrage Projet</h4>
                              <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                  <span class="text-zinc-400 font-medium">Entreprise</span>
                                  <span class="text-zinc-800 font-bold">{lead.company || '--'}</span>
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-zinc-400 font-medium">Budget Target</span>
                                  <span class="text-zinc-800 font-bold">{lead.budget || '--'}</span>
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-zinc-400 font-medium">Date d'envoi</span>
                                  <span class="text-zinc-600 font-medium text-xs">{formatDate(lead.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            <!-- Status update Selector -->
                            <div class="bg-white rounded-xl border border-zinc-200/50 p-5 shadow-sm space-y-3.5">
                              <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Statut du Pipe</h4>
                              <div class="grid grid-cols-2 gap-2">
                                <button
                                  class="px-3 py-2 text-xs font-bold rounded-lg border transition-all text-center {lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-500/20' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}"
                                  on:click={() => updateStatus(lead.id, 'new')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Nouveau
                                </button>
                                <button
                                  class="px-3 py-2 text-xs font-bold rounded-lg border transition-all text-center {lead.status === 'contacted' ? 'bg-amber-50 text-amber-700 border-amber-200 ring-2 ring-amber-500/20' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}"
                                  on:click={() => updateStatus(lead.id, 'contacted')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Contacté
                                </button>
                                <button
                                  class="px-3 py-2 text-xs font-bold rounded-lg border transition-all text-center {lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-emerald-500/20' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}"
                                  on:click={() => updateStatus(lead.id, 'qualified')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Qualifié
                                </button>
                                <button
                                  class="px-3 py-2 text-xs font-bold rounded-lg border transition-all text-center {lead.status === 'lost' ? 'bg-red-50 text-red-700 border-red-200 ring-2 ring-red-500/20' : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'}"
                                  on:click={() => updateStatus(lead.id, 'lost')}
                                  disabled={statusUpdatingId === lead.id}
                                >
                                  Perdu
                                </button>
                              </div>
                            </div>
                          </div>

                          <!-- Project Description -->
                          <div class="bg-white rounded-xl border border-zinc-200/50 p-5 shadow-sm space-y-2">
                            <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-wider">Objectifs & Besoins Détaillés</h4>
                            <p class="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
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
      </Card>
    </main>
  {/if}
</div>

<style>
  /* Chevron rotation animation */
  tr :global(svg) {
    transition: transform 0.2s ease;
  }
</style>
