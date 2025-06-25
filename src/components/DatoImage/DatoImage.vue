<template>
  <Image
    v-bind="props"
    :loader="imgixLoader"
  />
</template>

<script setup lang="ts">
import { Image, type ImageLoader, type ImageProps } from "@voorhoede/image-vue";
import type { ImgixUrl } from "typescript-imgix-url-params";
import { withQuery, type QueryObject } from "ufo";

const props = defineProps<Omit<ImageProps, 'loader'> & {
  modifiers?: ImgixUrl.Params;
}>();

const imgixLoader: ImageLoader = ({ src, width, quality }) =>
  withQuery(src, {
    w: width,
    q: quality,
    auto: "format,compress",
    cs: 'origin',
    ...(props.modifiers as QueryObject),
  });
</script>
