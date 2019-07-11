<template>
  <nav>
    <modal-drawer
      :isOpen="isOpen"
      :title="$t('menu')"
      @close="$emit('close')"
    >
      <ul>
        <li>
          <nuxt-link to="/" @click.native="$emit('close')">
            {{ $t('map') }}
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="localePath({ name: 'buildings' })" @click.native="$emit('close')">
            {{ $t('buildings') }}
          </nuxt-link>
        </li>
        <li>
          <nuxt-link hreflang="en" to="/en" @click.native="$emit('close')">en</nuxt-link>
          <nuxt-link hreflang="nl" to="/nl" @click.native="$emit('close')">nl</nuxt-link>
        </li>
      </ul>
    </modal-drawer>
  </nav>
</template>

<script>
import ModalDrawer from '../modal-drawer'

export default {
  components: { ModalDrawer },
  props: {
    isOpen: Boolean,
  }
}
</script>
