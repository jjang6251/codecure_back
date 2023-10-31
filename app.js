const message = document.querySelector("#message");
const input_message = message.querySelector("input");

fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ msg: input_message.value })
});