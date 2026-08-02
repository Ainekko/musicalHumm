<script lang="ts">
  import { t } from '$lib/i18n';

  export let instagramProfile: string;
</script>

<footer class="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center py-8 px-6 border-t border-zinc-200/60 z-10 text-xs text-zinc-500 gap-4 bg-transparent">
  <div class="flex items-center gap-2">
    <img src="/logo/logo-icon.png" alt="BordProd Icon" class="h-6 object-contain" />
    <span>&copy; 2026 BordProd. {$t('footer_copy')}</span>
  </div>
  <div class="flex items-center gap-4">
    <a href={instagramProfile} target="_blank" rel="noopener noreferrer" class="hover:text-zinc-900">Instagram @bord_prodagency</a>
    <span>&middot;</span>
    <a href="#portfolio-showcase" class="hover:text-zinc-900">{$t('footer_legal')}</a>
    <span>&middot;</span>
    <a href="#portfolio-showcase" class="hover:text-zinc-900">{$t('footer_privacy')}</a>
  </div>
</footer>
