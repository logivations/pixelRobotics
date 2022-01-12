const submitted = () => {
    let password = document.getElementById('password').value;
    if (password) {
        fetch('admin/checkPassword', {method: 'POST', body: password})
            .then((res) => res.json())
            .then((response) => {
                if (response.data) {
                    window.location.replace("/admin/statistics");
                }
            })
            .catch((err) => {
                console.error(err)
            });
    }
};