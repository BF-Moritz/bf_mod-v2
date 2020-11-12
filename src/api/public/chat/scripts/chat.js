const twitchChatInput = document.getElementById('twitch-chat-input');
const twitchChatInputForm =  twitchChatInput.getElementsByTagName('form')[0];
const twitchChatInputSelector = document.getElementById('twitch-chat-input-selector');
const twitchChatInputField = document.getElementById('twitch-chat-input-field');

twitchChatInputForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const account = twitchChatInputSelector.innerText;
	console.log(account);
	send({
		method: 'POST',
		type: 'message',
		params: {
			author: account,
			message: twitchChatInputField.value
		}
	});
	twitchChatInputField.value = '';
});