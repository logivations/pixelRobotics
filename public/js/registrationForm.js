window.onload = function() {
    const registrationForm = document.getElementById('registration');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);

        await fetch('api/registration/sendForm', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(data))
        })
            .then(() => {
                $('#feedback').toggle();
            })
    });

};