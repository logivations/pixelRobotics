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

window.onload = async function () {
  const contactForm = document.getElementById('contact');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    await fetch('api/mail/sendMail', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data))
    })
  });
  await fetch('api/user-activity/setResolution', {
    method: 'POST',
    body: JSON.stringify({ width: screen.width, height: screen.height })
  });
};
