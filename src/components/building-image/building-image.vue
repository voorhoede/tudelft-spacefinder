<template>
  <div class="building-image">
    <h2
      class="building-image__title"
      :style="`background-image: url('${url}?&fm=jpg&w=700&h=260&fit=crop&auto=quality&auto=format&auto=compress');`"
    >
      <span class="building-image__name">
        {{ name }} ({{ abbreviation }})
      </span>
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    abbreviation: String,
    name: String,
    url: String
  }
}
</script>

<style>
@import '../app-core/variables.css';

.building-image__title {
  position: relative;
  height: 150px;
  background-size: cover;
  background-position: center;
}

.building-image__title:after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
}

.building-image__name {
  z-index: var(--layer--raised);
  position: absolute;
  left: var(--spacing-half);
  bottom: var(--spacing-half);
  width: calc(100% - var(--spacing-default));
  font-family: var(--font-heading);
  font-size: var(--font-size-big);
  font-weight: 300;
  line-height: 1.2;
  color: var(--background-color);
  text-shadow: 1px 1px 2px var(--text-color);
}
</style>
