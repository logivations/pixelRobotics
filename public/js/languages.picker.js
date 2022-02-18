function toggleLanguage() {
  $('.language-list').toggle();
}

function changeLanguage(lang) {
  const isDELang = lang === 'DE_de';
  $('.language-name').text(isDELang ? 'DE' : 'EN');
  const icon = $('.languages-wrapper li').find('.fa-angle-down.sl-flag');
  icon.removeClass(isDELang ? 'flag-en' : 'flag-de');
  icon.addClass(isDELang ? 'flag-de' : 'flag-en');

  document.cookie = `lang=${lang}`;
}

$(document).ready(() => {
  const langCookie = document.cookie.split(';').find((cookie) => cookie.includes('lang'));
  if (langCookie) {
    const currentLang = langCookie.trim().split('=')[1];
    changeLanguage(currentLang);
  } else {
    changeLanguage('EN_en');
  }
});