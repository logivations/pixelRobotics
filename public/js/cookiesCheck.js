function cookieCheck(cookieName = 'defaultName', daysUntilExpire = 365) {
  const cookieElement = document.querySelector('.cookieElement');
  const acceptBtn = document.querySelector('.setCookieBtn');

  let showCookieMessage = true;

  document.cookie.split(';').map(function (cookie) {
    if (cookie.replace(/ /g, '') === cookieName + '=true') {
      showCookieMessage = false;
    }
  });
  if (showCookieMessage) {
    cookieElement.classList.add('is-visible');
    acceptBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setCookie();
      cookieElement.classList.remove('is-visible');
    });
  }
  function setCookie() {
    const expireInDays = new Date();
    expireInDays.setDate(expireInDays.getDate() + daysUntilExpire);
    document.cookie = cookieName + '=true; expires=' + expireInDays + ' path=/';
  }
}


// Set cookie with name and days until expire
cookieCheck('pixel_robotics_cookies', 100);

$(document).ready(() => {
  $(".loader_inner").fadeOut();
  $(".loader").fadeOut("slow");

    fetch('api/user-activity/setResolution', {
      method: 'POST',
      body: JSON.stringify({ width: screen.width, height: screen.height })
    });
  }
})