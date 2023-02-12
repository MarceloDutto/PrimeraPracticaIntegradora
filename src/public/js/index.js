const socket = io();

const swal = async () => {
    const chatBox = document.getElementById('chatBox');

    const result = await Swal.fire({
        title: "Bienvenido al chat",
        input: "text",
        text: "Ingresa tu mail para empezar a usar el chat",
        inputValidator: (value) => {
            return !value && 'Necesitas escribir tu mail para continuar!' 
        },
        allowOutsideClick: false
    })

    const user = result.value;

    socket.emit('retrieveLog');
    socket.emit('userConnected', user);

    
    socket.on('showNotification', data => {
        Swal.fire({
            text: `${data} se ha conectado al chat `,
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            icon: "success"
        })
    })   
    
    socket.on("sendLog", data => {
        let messageLog = document.getElementById("messageLog");
        let messages = "";
        data.forEach(mess => {
            const { user, message } = mess
            messages = messages + `${user} dice: ${message} </br>`
        });
        messageLog.innerHTML = messages;
    })
    
    chatBox.addEventListener('keyup', evt => {
        if(evt.key === "Enter") {
            if(chatBox.value.trim().length > 0) {
                socket.emit("messageSend", {user: user, message: chatBox.value});
                chatBox.value = "";
            }
        }
    })
    
    socket.on("showMessageOnScreen", data => {
        let messageLog = document.getElementById("messageLog");
        let messages = messageLog.innerHTML;
        const { user, message } = data
        messages = messages + `${user} dice: ${message} </br>`;
        messageLog.innerHTML = messages;
    })
}

swal();