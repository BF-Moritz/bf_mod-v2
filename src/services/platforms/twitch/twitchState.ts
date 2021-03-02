export class TwitchState {
	private viewerList: Set<String>;

	constructor() {
		this.viewerList = new Set();
	}

	addViewer(viewer: String): String[] {
		this.viewerList.add(viewer);
		return Array.from(this.viewerList);
	}

	removeViewer(viewer: String): String[] {
		this.viewerList.delete(viewer);
		return Array.from(this.viewerList);
	}

	getViewer(): String[] {
		return Array.from(this.viewerList);
	}
}
