<script lang="ts">
  import '../app.css';
  import { inject } from '@vercel/analytics';

  inject({ mode: import.meta.env.DEV ? 'development' : 'production' });
</script>

<div class="min-h-screen">
  <slot />
</div>
