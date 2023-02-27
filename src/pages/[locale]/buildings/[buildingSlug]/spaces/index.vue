<script setup lang="ts">
const route = useRoute();
const { buildingRoute } = useLocaleRoute();
const buildingSlug = route.params.buildingSlug as string;
navigateTo(buildingRoute({ buildingSlug }));
</script>
