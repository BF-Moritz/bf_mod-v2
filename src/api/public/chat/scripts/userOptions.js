const twitchChatUserOptionsInformationLogo = document.getElementById('twitch-chat-user-options-information-logo');
const twitchChatUserOptionsInformationName = document.getElementById('twitch-chat-user-options-information-name');
const twitchChatUserOptionsInformationCreatedAt = document.getElementById(
	'twitch-chat-user-options-information-created-at'
);
const twitchCHatUserOptionsInformationBtnBan = document.getElementById('twitch-chat-user-options-information-btn-ban');
const twitchCHatUserOptionsInformationBtnPurge = document.getElementById(
	'twitch-chat-user-options-information-btn-purge'
);
const twitchChatUserOptionsInformationBtnTimeout = document.getElementById(
	'twitch-chat-user-options-information-btn-timeout'
);
const twitchCHatUserOptionsInformationBtnMod = document.getElementById('twitch-chat-user-options-information-btn-mod');
const twitchCHatUserOptionsInformationBtnVip = document.getElementById('twitch-chat-user-options-information-btn-vip');

const buttons = [
	twitchCHatUserOptionsInformationBtnBan,
	twitchCHatUserOptionsInformationBtnPurge,
	twitchChatUserOptionsInformationBtnTimeout,
	twitchCHatUserOptionsInformationBtnMod,
	twitchCHatUserOptionsInformationBtnVip
];

let thisUser = null;

async function setUserOptions(user) {
	const createdAtDate = new Date(user.twitch.createdAt);
	twitchChatUserOptionsInformationLogo.src = user.twitch.logo;
	twitchChatUserOptionsInformationName.innerText = user.twitch.displayName;
	twitchChatUserOptionsInformationCreatedAt.innerText = formatDate(createdAtDate);
	thisUser = user;
	twitchCHatUserOptionsInformationBtnBan.innerText = thisUser.twitch.banned ? 'UNBAN' : 'BAN';
	const time = thisUser.twitch.timeoutTime - Date.now();
	twitchChatUserOptionsInformationBtnTimeout.innerText = thisUser.twitch.timeouted
		? `REMOVE TIMEOUT ${time}`
		: 'TIMEOUT';
	twitchCHatUserOptionsInformationBtnVip.innerText = thisUser.twitch.vip ? 'UNVIP' : 'VIP';
	twitchCHatUserOptionsInformationBtnMod.innerText = thisUser.twitch.mod ? 'UNMOD' : 'MOD';
	if (thisUser.twitch.timeouted) {
		const interval = setInterval(async () => {
			const time = thisUser.twitch.timeoutTime - Date.now();
			if (thisUser.twitch.timeouted && time > 0) {
				twitchChatUserOptionsInformationBtnTimeout.innerText = `REMOVE TIMEOUT ${time / 1000}s`;
			} else {
				twitchChatUserOptionsInformationBtnTimeout.innerText = `TIMEOUT`;
				thisUser.twitch.timeouted = false;
				clearInterval(interval);
			}
		}, 1000);
	}
	// TODO get status and change button names
}

function formatDate(date) {
	return `${('00' + date.getDay()).slice(-2)}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

let waitingCommand = null;

const months = [
	'Januar',
	'Februar',
	'März',
	'April',
	'Mai',
	'Juni',
	'Juli',
	'August',
	'September',
	'Oktober',
	'November',
	'Dezember'
];

function setWaitingCommand(input) {
	if (input === null) {
	} else {
	}
}

twitchCHatUserOptionsInformationBtnBan.addEventListener('click', async (btn) => {
	if (twitchCHatUserOptionsInformationBtnBan.classList.contains('disabled')) return;
	if (thisUser === null) return;
	await disableButtons();
	waitingCommand = thisUser.twitch.banned ? 'unban' : 'ban';
	thisUser.twitch.banned = !thisUser.twitch.banned;
	send({
		method: 'POST',
		type: 'action',
		params: {
			action: waitingCommand,
			id: thisUser.twitch.id,
			platform: 'twitch'
		}
	});
});

twitchCHatUserOptionsInformationBtnPurge.addEventListener('click', async () => {
	if (twitchCHatUserOptionsInformationBtnPurge.classList.contains('disabled')) return;
	if (thisUser === null) return;
	await disableButtons();
	waitingCommand = 'timeout';
	send({
		method: 'POST',
		type: 'action',
		params: {
			action: waitingCommand,
			id: thisUser.twitch.id,
			platform: 'twitch',
			time: 1
		}
	});
});

twitchChatUserOptionsInformationBtnTimeout.addEventListener('click', async (btn) => {
	if (twitchChatUserOptionsInformationBtnTimeout.classList.contains('disabled')) return;
	if (thisUser === null) return;
	await disableButtons();
	waitingCommand = thisUser.twitch.timeouted ? 'unban' : 'timeout';
	thisUser.twitch.timeouted = !thisUser.twitch.timeouted;
	send({
		method: 'POST',
		type: 'action',
		params: {
			action: waitingCommand,
			id: thisUser.twitch.id,
			platform: 'twitch',
			time: 10
		}
	});
});

twitchCHatUserOptionsInformationBtnMod.addEventListener('click', async (btn) => {
	if (twitchCHatUserOptionsInformationBtnMod.classList.contains('disabled')) return;
	if (thisUser === null) return;
	await disableButtons();
	waitingCommand = thisUser.twitch.mod ? 'unmod' : 'mod';
	thisUser.twitch.mod = !thisUser.twitch.mod;
	thisUser.twitch.vip = false;
	send({
		method: 'POST',
		type: 'action',
		params: {
			action: waitingCommand,
			id: thisUser.twitch.id,
			platform: 'twitch'
		}
	});
});

twitchCHatUserOptionsInformationBtnVip.addEventListener('click', async (btn) => {
	if (twitchCHatUserOptionsInformationBtnVip.classList.contains('disabled')) return;
	if (thisUser === null) return;
	await disableButtons();
	waitingCommand = thisUser.twitch.vip ? 'unvip' : 'vip';
	thisUser.twitch.vip = !thisUser.twitch.vip;
	thisUser.twitch.mod = false;
	send({
		method: 'POST',
		type: 'action',
		params: { action: waitingCommand, id: thisUser.twitch.id, platform: 'twitch' }
	});
});

function disableButtons() {
	buttons.forEach((button) => {
		button.classList.add('disabled');
	});
}

function enableButtons() {
	buttons.forEach((button) => {
		button.classList.remove('disabled');
	});
}

function handleActionResponse(params) {
	if (!params.error) {
		// switch button function
		twitchCHatUserOptionsInformationBtnBan.innerText = thisUser.twitch.banned ? 'UNBAN' : 'BAN';
		twitchChatUserOptionsInformationBtnTimeout.innerText = thisUser.twitch.timeouted ? 'REMOVE TIMEOUT' : 'TIMEOUT';
		if (thisUser.twitch.timeouted) {
			const interval = setInterval(async () => {
				const time = thisUser.twitch.timeoutTime - Date.now();
				if (thisUser.twitch.timeouted && time > 0) {
					twitchChatUserOptionsInformationBtnTimeout.innerText = `REMOVE TIMEOUT ${time / 1000}s`;
				} else {
					twitchChatUserOptionsInformationBtnTimeout.innerText = `TIMEOUT`;
					thisUser.twitch.timeouted = false;
					clearInterval(interval);
				}
			}, 1000);
		}
		twitchCHatUserOptionsInformationBtnVip.innerText = thisUser.twitch.vip ? 'UNVIP' : 'VIP';
		twitchCHatUserOptionsInformationBtnMod.innerText = thisUser.twitch.mod ? 'UNMOD' : 'MOD';
	}
	enableButtons();
	getUserInformation(thisUser._id);
}
