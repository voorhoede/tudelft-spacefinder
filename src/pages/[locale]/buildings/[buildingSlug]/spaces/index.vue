<script setup lang="ts">
const route = useRoute();
const { $localePath } = useNuxtApp();
const buildingSlug = route.params.buildingSlug as string;
navigateTo($localePath("/buildings/:buildingSlug", { buildingSlug }));
</script>
