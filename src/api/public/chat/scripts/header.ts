const rightWrapper = document.getElementById('right') as HTMLElement;
const mainWrapper = document.getElementById('main-container') as HTMLElement;
const openCloseBtn = document.getElementById('open-close-btn') as HTMLElement;
const rightTitle = document.getElementById('right-title') as HTMLElement;
const openMenuBtn = document.getElementById('header-settings-btn') as HTMLElement;
const goHomeBtn = document.getElementById('header-home-btn') as HTMLElement;
const goChatBtn = document.getElementById('header-chat-btn') as HTMLElement;
const goActivityBtn = document.getElementById('header-activity-btn') as HTMLElement;
const goOverlaysBtn = document.getElementById('header-overlays-btn') as HTMLElement;
const goAlertsBtn = document.getElementById('header-alerts-btn') as HTMLElement;
const rightTitleDropDownViewer = document.getElementById('right-title-dropdown-viewer') as HTMLElement;
const rightTitleDropDownActions = document.getElementById('right-title-dropdown-actions') as HTMLElement;
const rightTitleDropDownTitle = document.getElementById('right-title-dropdown-title') as HTMLElement;
const rightSectionViewer = document.getElementById('right-viewer-section') as HTMLElement;
const rightSectionActions = document.getElementById('right-actions-section') as HTMLElement;
const rightSectionTitle = document.getElementById('right-title-section') as HTMLElement;
const rightTitleDropDownContent = document.getElementById('right-title-dropdown-content') as HTMLElement;
const rightTitleDropdown = document.getElementById('right-title-dropdown') as HTMLElement;

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
