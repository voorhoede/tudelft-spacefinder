<template>
</template>

<script setup lang="ts">
  import type { RealtimeChannel } from '@supabase/supabase-js';

  const client = useSupabaseClient();

  const { data: busyness, refresh: refreshBusyness } = await useAsyncData(
    'busyness',
    () => client.from('busy').select('status').then(({ data }) => data),
  );

  let realtimeChannel: RealtimeChannel;

  onMounted(() => {
    realtimeChannel = client.channel('public:busy').on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'busy' },
      () => refreshBusyness()
    );

    realtimeChannel.subscribe();
  });

  onUnmounted(() => {
    client.removeChannel(realtimeChannel);
  });
</script>
