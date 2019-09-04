export default ({ app, store }) => {
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    console.log(oldLocale, newLocale);
    // close menu with emit event?
    // set current locale in store so the space getter can use it
  }
};
