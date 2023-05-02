# Not fixing hydration warnings in the console

When opening the website locally, a few warning show up in the console regarding hydration inconsistencies. These errors turn up because the server side rendered version doesn't match the rendered version in the browser regarding the mobile navigation, map and number of selected filters in the filter button.

- Date: 2023-05-01
- Alternatives considerend: replace the `v-if` with `v-show` in relevant places.
- Decision made by [Bas](https://github.com/GoGoGadgetMusic), [Misha](https://github.com/kyrel)

## Decision

We will keep the warnings for now, as the server rendered desktop website is indeed different from the mobile version.