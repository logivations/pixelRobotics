function toggleLanguage() {
  $('.language-list').toggle();
}

function getLangFromCookie() {
  const lang =  document.cookie && document.cookie.split(';')
    .find((cookie) => cookie.includes('lang'));
  if (lang) {
    return lang.trim().split('=')[1];
  }
}

function changeLanguage(lang, reloadNeeded = true) {
  const isDELang = lang === 'DE_de';
  const icon = $('.languages-wrapper li').find('.fa-angle-down.sl-flag');
  icon.removeClass(isDELang ? 'flag-en' : 'flag-de');
  icon.addClass(isDELang ? 'flag-de' : 'flag-en');
  $('#lang-name').text(isDELang ? 'DE' : 'EN');

  const oldLang = getLangFromCookie();

  document.cookie = `lang=${lang}`;

  if (reloadNeeded && oldLang !== lang) {
    window.location.reload();
  }
}

$(document).ready(() => {
  const langCookie = document.cookie && document.cookie.split(';')
    .find((cookie) => cookie.includes('lang'));
  if (langCookie) {
    const currentLang = getLangFromCookie();
    changeLanguage(currentLang, false);
  } else {
    changeLanguage('EN_en', false);
  }
});