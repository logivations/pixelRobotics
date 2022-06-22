$(document).ready(() => {
    let videoSrc;
    $('.video-btn').click(function () {
        videoSrc = $(this).data("src");
    });
    $('#PRModal').on('shown.bs.modal', () => {
        $("#PRModalVideo").attr('src', videoSrc);
        $("#PRModalVideo").get(0).play();
    })
    $('#PRModal').on('hide.bs.modal', () => {
        $("#PRModalVideo").attr('src', videoSrc);
        $("#PRModalVideo").get(0).pause();
    })
});