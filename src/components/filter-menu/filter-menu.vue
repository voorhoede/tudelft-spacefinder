<template>
  <form>
    <modal-drawer
      :title="$t('filter')"
      @close="$emit('close')"
    >
      (filters)
    </modal-drawer>
  </form>
</template>

<script>
import ModalDrawer from '../modal-drawer'

export default {
  components: { ModalDrawer }
}
</script>
