window.onload = function() {
  const contactForm = document.getElementById('contact');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    await fetch('api/mail/sendMail', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data))
    })
        .then(() => {
          $('#contactModal').toggle();
        })
  });

};
