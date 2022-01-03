window.addEventListener('DOMContentLoaded', () => {

    const chat = (elementTrigger) => {
        const trigger = document.querySelector(elementTrigger);

        const timeNow = new Date().toLocaleTimeString().slice(0, -3);
        const dateNow = new Date().toLocaleDateString();
        let chatExist = false;
        let story = false;

        let apiKey = 'd9e53816d07345139c58d0ea733e3870';

        const token = ``;
        const chatId = ``;
        const botId = ``;

        const bodyChat = `
            <div class="chat__close"></div>
            <div class="chat__body">
                <div class="chat__body-msg">
                    <p>Здравствуйте! Чем я могу вам помочь?</p>
                    <span>${dateNow} ${timeNow}</span>
                </div>
            </div>
            <div class="chat__message">
                <input type="text" placeholder="Введите сообщение" maxlength="60">
                <button></button>
            </div>    
        `;

        trigger.addEventListener('click', () => {
            if (chatExist) {
                openChat();
            } else {
                createChat();
            }
        });

        function createChat() {
            trigger.classList.add('hidden');
            const chat = document.createElement('div');
            chat.classList.add('chat', 'emergence');
            chat.innerHTML = bodyChat;
            document.body.append(chat);
            const body = chat.querySelector('.chat__body');
            chatExist = true;
            inputMessange(chat, body);
            let updateChat = setInterval(() => {
                if (story) {
                    receivingMessage(body);
                }
            }, 1000);
            chatClose(chat, updateChat);
        }

        function openChat() {
            trigger.classList.add('hidden');
            const chat = document.querySelector('.chat');
            chat.classList.remove('hidden', 'disappearance');
            chat.classList.add('emergence');
            const body = chat.querySelector('.chat__body');
            let updateChat = setInterval(() => receivingMessage(body), 1000);
            chatClose(chat, updateChat);
        }

        function chatClose(el, interval) {
            const btnClose = el.querySelector('.chat__close');
            btnClose.addEventListener('click', (e) => {
                el.classList.remove('emergence');
                el.classList.add('disappearance');
                setTimeout(() => {
                    el.classList.add('hidden');
                }, 300);
                setTimeout(() => {
                    trigger.classList.remove('hidden');
                }, 300);
                clearInterval(interval);
            });
        }

        function inputMessange(parent, body) {
            const inputChat = parent.querySelector('input');
            const buttonSend = parent.querySelector('button');

            inputChat.addEventListener('keypress', (e) => {
                if (e.key === `Enter`) {
                    sendMessange(inputChat.value, body);
                    inputChat.value = '';
                }
            });

            buttonSend.addEventListener('click', () => {
                sendMessange(inputChat.value, body);
                inputChat.value = '';
            });
        }

        function sendMessange(input, body) {
            if (input !== '') {
                addMessange(body, input, 'chat__body-msg-user');

                fetch('https://api.bigdatacloud.net/data/ip-geolocation-with-confidence?key=' + apiKey)
                    .then(r => r.json())
                    .then(out => {
                        let city = out.location.city;
                        let localityName = out.location.localityName;
                        fetch(`https://api.telegram.org/bot${botId}:${token}/sendMessage?chat_id=${chatId}&text=Город:%20${city}%20Район:%20${localityName}%0a Сообщение: ${input}`)
                    });
                localStorage.setItem('msg', input);
                story = true;
            }
        }

        function receivingMessage(body) {
            fetch(`https://api.telegram.org/bot${botId}:${token}/getupdates`)
                .then(r => r.json())
                .then(out => {
                    try {
                       const replyMessange = out.result[out.result.length - 1].channel_post.reply_to_message.text.split(' ');
                        const timeMessage = out.result[out.result.length - 1].channel_post.date;
                        let index = replyMessange.indexOf('Сообщение:');
                        let textReplyMessange = replyMessange.splice(index + 1, replyMessange.length - 1).join(' ');

                        console.log(textReplyMessange);

                        if (localStorage.getItem('timeMessage') != timeMessage &&
                            textReplyMessange == localStorage.getItem('msg')) {
                            const textMessange = out.result.pop().channel_post.text;
                            addMessange(body, textMessange, 'chat__body-msg');
                            localStorage.setItem('timeMessage', timeMessage);
                        }
                    } catch (error) {

                    }

                });
        }

        function addMessange(body, text, classMessange) {
            const textMessange = `
                <p>${text}</p>
                <span>${dateNow} ${timeNow}</span>
            `;
            const messange = document.createElement('div');
            messange.classList.add(classMessange);
            messange.innerHTML = textMessange;
            body.append(messange);
        }

    };

    chat('.trigger');

});
