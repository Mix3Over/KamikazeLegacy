document.addEventListener("DOMContentLoaded", function () {
    const ticketButton = document.getElementById("send");

    ticketButton.addEventListener("click", function () {
        const recipientEmail = "kamikazeepicmusic@gmail.com";
        const emailTitle = encodeURIComponent(document.getElementById("email-title").value);
        const emailMessage = encodeURIComponent(document.getElementById("email-message").value);

        const webmailService = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${emailTitle}&body=${emailMessage}`;

        window.open(webmailService, "_blank");
    });
});
