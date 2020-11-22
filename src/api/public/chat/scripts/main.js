const twitchBadges = {
	global_mod: {
		image: 'https://static-cdn.jtvnw.net/chat-badges/globalmod.png'
	},
	admin: {
		image: 'https://static-cdn.jtvnw.net/chat-badges/admin.png'
	},
	broadcaster: {
		image: 'https://static-cdn.jtvnw.net/chat-badges/broadcaster.png'
	},
	moderator: {
		image: 'https://static-cdn.jtvnw.net/chat-badges/mod.png'
	},
	staff: {
		image: 'https://static-cdn.jtvnw.net/chat-badges/staff.png'
	},
	turbo: {
		image: 'https://static-cdn.jtvnw.net/chat-badges/turbo.png'
	},
	premium: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/1'
	},
	founder: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/1'
	},
	subscriber_1: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/af587df0-63b0-47e2-8478-77c88c460fa0/1'
	},
	subscriber_2: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/af587df0-63b0-47e2-8478-77c88c460fa0/1'
	},
	subscriber_3: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/fc57cbbb-a710-4e77-9dcd-c909765040c4/1'
	},
	subscriber_6: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/a157902d-7e5b-4a20-ad6c-382005d813fd/1'
	},
	subscriber_9: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/180b9054-cf7d-4a91-9370-1ba78f8d586b/1'
	},
	subscriber_12: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/42b24553-4eb7-4ad4-8a1c-475b71ff5ab3/1'
	},
	partner: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1'
	},
	vip: {
		image: 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1'
	}
};

const twitchChatWrapper = document.getElementById('twitch-chat-wrapper');
const twitchChatInputSelect = document.getElementById('twitch-chat-input-selector');
const twitchChatInputSelectContent = document.getElementById('twitch-chat-input-selector-content');
const twitchChatUserOptions = document.getElementById('twitch-chat-user-options');
const twitchChatUserOptionsMenu = document.getElementById('twitch-chat-user-options-menu');

const twitchViewerList = [];
let twitchMessagesList = [];
let ws;
let settings;
let apiKey = '';
let canReceiveUserInformation = true;

const options = {
	root: null,
	rootMargins: '0px',
	threshold: 0.0001
};

const observer = new IntersectionObserver(handleIntersect, options);

twitchChatWrapper.addEventListener('scroll', () => {
	if (twitchChatWrapper.scrollTop + $('#twitch-chat-wrapper').height() + 10 >= twitchChatWrapper.scrollHeight) {
		unloadOldMessages();
	}
});

twitchChatUserOptions.addEventListener('click', () => {
	twitchChatUserOptions.style.display = 'none';
	twitchChatUserOptionsMenu.style.display = 'none';
});

twitchChatUserOptionsMenu.addEventListener('click', (event) => {
	event.stopPropagation();
});

const send = function (data) {
	ws.send(JSON.stringify(data));
};

$(document).ready(() => {
	ws = new WebSocket(`ws://${location.host}/ws`);
	ws.onopen = () => {
		send({
			method: 'CONNECT',
			params: {}
		});
	};

	ws.onmessage = async (event) => {
		try {
			if (typeof event.data != 'string') {
				return;
			}
			const data = JSON.parse(event.data);
			switch (data.method) {
				case 'CONNECT':
					switch (data.type) {
						case 'CONNECT':
							settings = data.params.settings;

							if (data.params.settings.twitchAccounts) {
								data.params.settings.twitchAccounts.forEach((account, i) => {
									const option = document.createElement('div');
									option.classList.add('possible-twitch-accounts');
									option.innerText = account;
									option.addEventListener('click', () => {
										const elements = twitchChatInputSelectContent.getElementsByClassName(
											'possible-twitch-accounts'
										);
										for (let element of elements) {
											element.classList.remove('active');
										}
										option.classList.add('active');
										twitchChatInputSelect.innerText = option.innerText;
									});
									if (i === 0) {
										option.classList.add('active');
										twitchChatInputSelect.innerText = account;
									}
									twitchChatInputSelectContent.appendChild(option);
								});
							}

							send({
								method: 'GET',
								type: 'messages',
								params: {}
							});
							send({
								method: 'GET',
								type: 'viewer',
								params: {}
							});
							break;
					}
					break;
				case 'GET':
					switch (data.type) {
					}
					break;
				case 'POST':
					switch (data.type) {
						case 'messages':
							if (twitchChatWrapper.childElementCount > 0) {
								observer.unobserve(twitchChatWrapper.firstElementChild);
							}
							await addMessages(data.params);
							observer.observe(twitchChatWrapper.firstElementChild);
							break;
						case 'user-information':
							await addUserInformation(data.params);
							break;
						case 'action-response':
							await handleActionResponse(data.params);
							break;
					}
					break;
				default:
					console.log(data.method);
					break;
			}
		} catch (err) {
			console.error(err);
		}
	};

	ws.onclose = () => {
		location.reload();
	};
});

async function addMessages(params) {
	if (params.hasOwnProperty('messages')) {
		if (Array.isArray(params.messages)) {
			if (
				twitchChatWrapper.childElementCount > 0 &&
				params.messages[0].index < +twitchChatWrapper.firstElementChild.id.split('-')[2]
			) {
				params.messages.sort((a, b) => b.index - a.index);
			} else {
				params.messages.sort((a, b) => a.index - b.index);
			}
			let height = 0;
			for (let i = 0; i < params.messages.length; i++) {
				height += await addMessage(params.messages[i]);
			}
		}
	}
}

async function addMessage(message) {
	let emotes = [];

	for (let emote in message.message.emotes) {
		if (message.message.emotes.hasOwnProperty(emote)) {
			message.message.emotes[emote].forEach((emoteVal) => {
				emotes.push({ emoteID: emote, emoteStart: +emoteVal.split('-')[0], emoteEnd: +emoteVal.split('-')[1] });
			});
		}
	}
	let messageParts = [];
	let lastPartEnd = 0;
	emotes.forEach((emote) => {
		if (emote['emoteStart'] === lastPartEnd) {
			messageParts.push({ type: 'emote', message: emote['emoteID'] });
		} else {
			messageParts.push({
				type: 'text',
				message: message.message.message.slice(lastPartEnd, emote['emoteStart'])
			});
			messageParts.push({ type: 'emote', message: emote['emoteID'] });
		}
		lastPartEnd = parseInt(emote['emoteEnd']) + 1;
	});

	if (lastPartEnd !== message.length) {
		messageParts.push({ type: 'text', message: message.message.message.slice(lastPartEnd) });
	}

	let isOnBottom =
		twitchChatWrapper.scrollTop + $('#twitch-chat-wrapper').height() + 10 >= twitchChatWrapper.scrollHeight;
	let newMessageContainer = document.createElement('div');
	newMessageContainer.id = `twitch-message-${message.index}`;
	newMessageContainer.className = 'twitch-message-container';

	let newMessage = document.createElement('div');
	newMessage.className = 'twitch-message';
	if (message.deleted) {
		newMessage.classList.add('twitch-message-deleted');
	}

	let newMessageLeft = document.createElement('div');
	newMessageLeft.className = 'twitch-message-left';

	let newMessageProfilePicture = document.createElement('img');
	newMessageProfilePicture.className = 'twitch-message-profile-picture';
	newMessageProfilePicture.src = message.user.twitch.logo;
	newMessageLeft.appendChild(newMessageProfilePicture);
	newMessage.appendChild(newMessageLeft);

	let newMessageRight = document.createElement('div');
	newMessageRight.className = 'twitch-message-right';

	let newMessageHead = document.createElement('div');
	newMessageHead.className = 'twitch-message-header';

	// Badges
	if (message.message.badges !== null) {
		for (let badge in message.message.badges) {
			let element = document.createElement('img');
			element.className = 'twitch-message-badge';
			element.alt = badge;
			if (badge === 'subscriber') {
				if (twitchBadges[badge + '_' + (+message.message.badges[badge] % 1000)]) {
					element.src = twitchBadges[badge + '_' + (+message.message.badges[badge] % 1000)].image;
				}
			} else {
				element.src = twitchBadges[badge].image;
			}
			newMessageHead.append(element);
		}
	}

	let newMessageHeadName = document.createElement('span');
	newMessageHeadName.className = 'twitch-message-header-name id-' + message.user._id;
	newMessageHeadName.innerText = message.user.twitch.displayName;

	newMessageHeadName.addEventListener('click', async (event) => {
		const id = newMessageHeadName.classList
			.toString()
			.split(' ')
			.filter((value) => value.startsWith('id-'))[0]
			.substring(3);
		// TODO get information and display them
		await showUserOptions();
		await getUserInformation(id);
	});

	newMessageHead.appendChild(newMessageHeadName);

	// TODO Flag

	let newMessageHeadTime = document.createElement('span');
	newMessageHeadTime.className = 'twitch-message-header-time';
	newMessageHeadTime.innerText = convertTimestampToString(message.date);
	newMessageHead.appendChild(newMessageHeadTime);

	let newMessageHeadDelete = document.createElement('span');
	newMessageHeadDelete.className = 'mdi mdi-delete-circle-outline chat-msg-delete-btn';

	if (!message.deleted) {
		newMessageHeadDelete.addEventListener('click', () => {
			send({
				method: 'POST',
				type: 'action',
				params: {
					action: 'deletemessage',
					id: message._id,
					platform: 'twitch'
				}
			});
			newMessage.classList.add('twitch-message-deleted');
			newMessageHeadDelete.classList.add('disabled');
		});
	} else {
		newMessageHeadDelete.classList.add('disabled');
	}

	newMessageHead.appendChild(newMessageHeadDelete);
	newMessageRight.appendChild(newMessageHead);

	let newMessageTextBlock = document.createElement('div');
	newMessageTextBlock.className = 'twitch-message-text-block';

	let newMessageText = document.createElement('span');

	for (let messagePart of messageParts) {
		if (messagePart.type === 'text') {
			let parts = messagePart.message.split(' ');
			let regex = new RegExp(/([a-zA-Z0-9.\-_]+\.[a-zA-Z0-9./\-_]+)/);
			for (let i = 0; i < parts.length; i++) {
				if (regex.test(parts[i])) {
					let link = parts[i];
					if (!parts[i].startsWith('http')) {
						link = 'http://' + link;
					}
					let youtubeData = null;
					if (parts[i].includes('youtube.com/watch')) {
						let videoID = new URLSearchParams(parts[i].substring(parts[i].indexOf('v='))).get('v');
						youtubeData = await getYTData(videoID, settings.apiKey);
					} else if (parts[i].includes('youtu.be/')) {
						youtubeData = await getYTData(parts[i].split('/', 10), settings.apiKey);
					}

					let newImage = document.createElement('img');
					newImage.className = 'chat-icons';
					newImage.src = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + link;

					let newLink = document.createElement('a');
					newLink.href = link;
					newLink.target = '_blank';

					if (youtubeData !== null) {
						newLink.innerText = youtubeData.items[0].snippet.title;
					} else {
						newLink.innerText = parts[i];
					}
					newMessageTextBlock.append(newImage);
					newMessageTextBlock.append(newLink);
				} else {
					let text = document.createElement('span');
					text.innerText = parts[i];
					if (i < parts.length - 1) {
						text.innerText += ' ';
					}
					newMessageTextBlock.append(text);
				}
			}
		} else if (messagePart.type === 'emote') {
			let child = document.createElement('span');
			child.classList.add('twitch-message-emote');
			let img = document.createElement('img');
			img.src = 'https://static-cdn.jtvnw.net/emoticons/v1/' + messagePart['message'] + '/3.0';
			child.append(img);
			newMessageTextBlock.append(child);
		} else {
			console.log('NO MESSAGE PART TYPE!');
		}
	}

	newMessageTextBlock.appendChild(newMessageText);
	newMessageRight.appendChild(newMessageTextBlock);
	newMessage.appendChild(newMessageRight);

	newMessageContainer.appendChild(newMessage);

	if (
		twitchChatWrapper.childElementCount > 0 &&
		message.index < +twitchChatWrapper.firstElementChild.id.split('-')[2]
	) {
		twitchChatWrapper.insertBefore(newMessageContainer, twitchChatWrapper.firstChild);
		return newMessageContainer.clientHeight;
	} else {
		twitchChatWrapper.appendChild(newMessageContainer);
		if (isOnBottom) {
			twitchChatWrapper.lastElementChild.scrollIntoView(true);
			unloadOldMessages();
		}
	}
	return 0;
}

async function handleIntersect(entries) {
	if (entries[0].isIntersecting) {
		const id = +twitchChatWrapper.firstElementChild.id.split('-')[2];
		if (id > 0) {
			send({
				method: 'GET',
				type: 'messages',
				params: {
					count: 10,
					index: id - 1
				}
			});
		}
	}
}

function unloadOldMessages() {
	if (twitchChatWrapper.childElementCount > 100) {
		observer.unobserve(twitchChatWrapper.firstElementChild);
		while (twitchChatWrapper.childElementCount > 100) {
			twitchChatWrapper.removeChild(twitchChatWrapper.firstChild);
		}
		observer.observe(twitchChatWrapper.firstElementChild);
	}
}

function convertTimestampToString(timestamp) {
	const ts = new Date(timestamp);
	const date = `${('00' + ts.getDate()).slice(-2)}.${('00' + (+ts.getMonth() + 1)).slice(-2)}.${(
		'0000' + ts.getFullYear()
	).slice(-4)}`;
	const time = `${('00' + ts.getHours()).slice(-2)}:${('00' + ts.getMinutes()).slice(-2)}:${(
		'00' + ts.getSeconds()
	).slice(-2)}`;
	return `${date} - ${time}`;
}

async function getYTData(videoID, apiKey) {
	return new Promise((resolve) => {
		if (videoID === '' || videoID === null) {
			resolve(null);
		}
		fetch(
			'https://www.googleapis.com/youtube/v3/videos?id=' +
				videoID +
				'&key=' +
				apiKey +
				'&fields=items(id,snippet(channelId,title,categoryId),statistics)&part=snippet,statistics',
			{}
		).then((res) => {
			if (res.ok) {
				res.json().then((data) => {
					resolve(data);
				});
			} else {
				resolve(null);
			}
		});
	});
}

async function showUserOptions() {
	await clearUserOptions();
	twitchChatUserOptions.style.display = 'flex';
}

async function clearUserOptions() {}

async function getUserInformation(id) {
	canReceiveUserInformation = true;
	send({
		method: 'GET',
		type: 'user-information',
		params: {
			id: id
		}
	});
}

async function addUserInformation(params) {
	if (canReceiveUserInformation) {
		await setUserOptions(params.user);
		twitchChatUserOptionsMenu.style.display = 'grid';
	} else {
		twitchChatUserOptions.style.display = 'none';
	}
}
