const rightWrapper = document.getElementById('right');
const mainWrapper = document.getElementById('main-container');
const openCloseBtn = document.getElementById('open-close-btn');
const rightTitle = document.getElementById('right-title');
const openMenuBtn = document.getElementById('header-settings-btn');
const goHomeBtn = document.getElementById('header-home-btn');
const goChatBtn = document.getElementById('header-chat-btn');
const goActivityBtn = document.getElementById('header-activity-btn');
const goOverlaysBtn = document.getElementById('header-overlays-btn');
const goAlertsBtn = document.getElementById('header-alerts-btn');
const rightTitleDropDownViewer = document.getElementById('right-title-dropdown-viewer');
const rightTitleDropDownActions = document.getElementById('right-title-dropdown-actions');
const rightTitleDropDownTitle = document.getElementById('right-title-dropdown-title');
const rightSectionViewer = document.getElementById('right-viewer-section');
const rightSectionActions = document.getElementById('right-actions-section');
const rightSectionTitle = document.getElementById('right-title-section');
const rightTitleDropDownContent = document.getElementById('right-title-dropdown-content');
const rightTitleDropdown = document.getElementById('right-title-dropdown');

function toggleRight() {
	if (rightWrapper.classList.contains('show-right')) {
		rightWrapper.classList.remove('show-right');
		mainWrapper.classList.remove('show-right');
		openCloseBtn.classList.remove('show-right');
		rightTitle.classList.remove('show-right');
	} else {
		rightWrapper.classList.add('show-right');
		mainWrapper.classList.add('show-right');
		openCloseBtn.classList.add('show-right');
		rightTitle.classList.add('show-right');
	}
}

function openMenu() {
	console.log('test');
}

function closeAllRight() {
	rightTitleDropDownContent.style.display = 'none';
	rightTitleDropDownViewer.classList.remove('active');
	rightTitleDropDownActions.classList.remove('active');
	rightTitleDropDownTitle.classList.remove('active');
	rightSectionViewer.classList.remove('active');
	rightSectionActions.classList.remove('active');
	rightSectionTitle.classList.remove('active');
	setTimeout(async () => {
		rightTitleDropDownContent.style.display = '';
	}, 10);
}

openCloseBtn.addEventListener('click', () => {
	toggleRight();
	//rightTitle.innerText = 'Twitch Viewer'
});

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

rightTitleDropDownViewer.addEventListener('click', () => {
	closeAllRight();
	rightSectionViewer.classList.add('active');
	rightTitleDropDownViewer.classList.add('active');
	rightTitleDropdown.innerText = 'Viewer';
});

rightTitleDropDownActions.addEventListener('click', () => {
	closeAllRight();
	rightSectionActions.classList.add('active');
	rightTitleDropDownActions.classList.add('active');
	rightTitleDropdown.innerText = 'Actions';
});

rightTitleDropDownTitle.addEventListener('click', () => {
	closeAllRight();
	rightSectionTitle.classList.add('active');
	rightTitleDropDownTitle.classList.add('active');
	rightTitleDropdown.innerText = 'Title';
});
