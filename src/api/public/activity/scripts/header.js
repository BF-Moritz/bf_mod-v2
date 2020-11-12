const openMenuBtn = document.getElementById('header-settings-btn');
const goHomeBtn = document.getElementById('header-home-btn');
const goChatBtn = document.getElementById('header-chat-btn');
const goActivityBtn = document.getElementById('header-activity-btn');
const goOverlaysBtn = document.getElementById('header-overlays-btn');
const goAlertsBtn = document.getElementById('header-alerts-btn');

openMenuBtn.addEventListener('click', () => {
	openMenu();
});

goHomeBtn.addEventListener('click', () => {
	window.location.href = '/views/';
});

goChatBtn.addEventListener('click', () => {
	window.location.href = '/views/chat/';
});

goActivityBtn.addEventListener('click', () => {
	window.location.href = '/views/activity/';
});

goOverlaysBtn.addEventListener('click', () => {
	window.location.href = '/views/overlays/';
});

goAlertsBtn.addEventListener('click', () => {
	window.location.href = '/views/alerts/';
});
