const submitted = () => {
    let password = document.getElementById('password').value;
    const error = document.querySelector('.invalid-feedback');
    if (password) {
        fetch('admin/checkPassword', {method: 'POST', body: password})
            .then((res) => res.json())
            .then((response) => {
                if (response.data) {
                    error.style.display = 'none';
                    window.location.replace("/admin/statistics");
                } else {
                    error.style.display = 'block';
                }
            })
            .catch((err) => {
                console.error(err)
            });
    }
};