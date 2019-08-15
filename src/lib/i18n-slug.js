// pick the slug for the current locale from a building or a space object
export default (lang, obj = {}) => ((obj.i18n || {})[lang] || {}).slug
