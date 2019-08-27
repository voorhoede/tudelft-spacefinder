<script>
export default {
  validate({ app, params, redirect }) {
    const { buildingSlug } = params
    const url = app.localePath({
      name: 'buildings-buildingSlug',
      params: { buildingSlug },
    })
    redirect(url)
  },
}
</script>
