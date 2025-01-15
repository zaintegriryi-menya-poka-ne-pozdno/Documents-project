define(["./app.js?cache=" + Date.now()], function (App) {
	const Widget = function () {
		const self = this;
		self.system = this.system();
		self.langs = this.langs;

		/** @private */
		this.callbacks = {
			render() {
				App.default.render(self);
				return true;
			},
			init() {
				App.default.init(self);
				return true;
			},
			bind_actions() {
				App.default.bind_actions(self);
				return true;
			},
			settings() {
				App.default.settings(self);
			},
			onSave() {
				App.default.onSave(self);
				return true;
			},
			destroy() {
				App.default.destroy(self);
				return true;
			},
		};

		return this;
	};

	return Widget;
});
