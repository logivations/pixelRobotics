function toggleLanguage() {
  $('.language-list').toggle();
}

function getLangFromCookie() {
  const lang =  document.cookie && document.cookie.split(';')
    .find((cookie) => cookie && cookie.includes('lang'));
  if (lang) {
    return lang.trim().split('=')[1];
  }
}

function changeLanguage(lang, reloadNeeded = true) {
  const isDELang = lang === 'DE_de';
  $('#lang-name').text(isDELang ? 'DE' : 'EN');

  const oldLang = getLangFromCookie();

  if (reloadNeeded && oldLang !== lang) {
    document.cookie = `lang=${lang}`;
    window.location.reload();
  }
}

function getDefaultLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const langUrlParam = urlParams.get('lang');
  if (langUrlParam) {
    if (langUrlParam.toLowerCase() === 'de') return 'DE_de';
    if (langUrlParam.toLowerCase() === 'en') return 'EN_en';
  }
  const isDELang = navigator.languages.some((language) => language.includes('de'));
  return isDELang? 'DE_de' : 'EN_en';
}

$(document).ready(() => {
  const langCookie = document.cookie && document.cookie.split(';')
    .find((cookie) => cookie.includes('lang'));
  if (langCookie) {
    const currentLang = getLangFromCookie();
    changeLanguage(currentLang, false);
  } else {
    changeLanguage(getDefaultLanguage(), false);
  }
});
