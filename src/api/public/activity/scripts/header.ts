const headerOpenMenuBtn = document.getElementById('header-settings-btn');
const headerGoHomeBtn = document.getElementById('header-home-btn');
const headerGoChatBtn = document.getElementById('header-chat-btn');
const headerGoActivityBtn = document.getElementById('header-activity-btn');
const headerGoOverlaysBtn = document.getElementById('header-overlays-btn');
const headerGoAlertsBtn = document.getElementById('header-alerts-btn');

headerOpenMenuBtn?.addEventListener('click', () => {
	openMenu();
});

goHomeBtn?.addEventListener('click', () => {
	window.location.href = '/views/';
});

headerGoChatBtn?.addEventListener('click', () => {
	window.location.href = '/views/chat/';
});

headerGoActivityBtn?.addEventListener('click', () => {
	window.location.href = '/views/activity/';
});

headerGoOverlaysBtn?.addEventListener('click', () => {
	window.location.href = '/views/overlays/';
});

headerGoAlertsBtn?.addEventListener('click', () => {
	window.location.href = '/views/alerts/';
});
