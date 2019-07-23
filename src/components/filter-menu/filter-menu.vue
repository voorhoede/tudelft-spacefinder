<template>
  <form>
    <modal-drawer
      :isOpen="isOpen"
      :title="$t('filter')"
      @close="$emit('close')"
    >
      <fieldset>
        <legend>{{ $t('quietness') }}</legend>
        <label v-for="option in optionsPerFilter.quietness" :key="option">
          <input type="checkbox" :value="option" v-model="quietness">
          {{ $t(`quietness.${option}`) }}
        </label>
      </fieldset>
      <label>
        <b>Active filters</b>
        <output>
          noise level: {{ quietness }}
        </output>
      </label>
    </modal-drawer>
  </form>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import ModalDrawer from '../modal-drawer'

const optionsPerFilter = Object.freeze({
  quietness: ['silent', 'quiet', 'noisy']
})

export default {
  components: { ModalDrawer },
  props: {
    isOpen: Boolean,
  },
  computed: {
    ...mapFields([
      'filters.locationType',
      'filters.quietness'
    ]),
    optionsPerFilter() { return optionsPerFilter }
  }
}
</script>
