<template>
  <form>
    <modal-drawer
      :isOpen="isOpen"
      :title="$t('filter')"
      @close="$emit('close')"
    >
      <fieldset>
        <legend>{{ $t('noiseLevel') }}</legend>
        <label v-for="option in optionsPerFilter.noiseLevel" :key="option">
          <input type="checkbox" :value="option" v-model="noiseLevel">
          {{ $t(`noiseLevel.${option}`) }}
        </label>
      </fieldset>
      <label>
        <b>Active filters</b>
        <output>
          noise level: {{ noiseLevel }}
        </output>
      </label>
    </modal-drawer>
  </form>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import ModalDrawer from '../modal-drawer'

const optionsPerFilter = Object.freeze({
  noiseLevel: ['silent', 'quiet', 'noisy']
})

export default {
  components: { ModalDrawer },
  props: {
    isOpen: Boolean,
  },
  computed: {
    ...mapFields([
      'filters.locationType',
      'filters.noiseLevel'
    ]),
    optionsPerFilter() { return optionsPerFilter }
  }
}
</script>
