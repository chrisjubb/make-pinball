var Pin = Pin || {};

Pin.Game = Class.extend({

	// special ids - don't want this colliding
	SW_LEFT_FLIPPER: 	100,
	SW_RIGHT_FLIPPER: 	101,
	SW_PLUNGER_BUTTON: 	102,

	numberOfLights: 64,
	lightState: [],
	forceState: [],
	forceFromSwitchState: [],
	forceFromCenterAndSwitchState: [],

	// l = light index
	// s = switch index
	targetBankList0: [
						{l: 0, s: 10},
						{l: 1, s: 11},
						{l: 2, s: 12},
						{l: 3, s: 13}
					 ],
	targetBankList1: [
						{l: 4,  s: 14},
						{l: 5,  s: 15},
						{l: 6,  s: 16},
						{l: 7,  s: 17},
						{l: 8,  s: 18},
						{l: 9,  s: 19},
						{l: 10, s: 20},
					 ],
	targetBank0: undefined,
	targetBank1: undefined,

	init: function() {
		var self = this;
		for(var i = 0; i < this.numberOfLights; ++i) {
			this.lightState.push(new Pin.Light());
		}

		var targetBankData0 = [];
		_.each(this.targetBankList0, function(item) {
			targetBankData0.push({ light: self.lightState[item.l], switchIndex: item.s });
		});
		this.targetBank0 = new Pin.TargetBank(targetBankData0);
		this.targetBank0.setLitColour(1,1,0, 1);
		this.targetBank0.pusle(1,1,0, 1);

		var targetBankData1 = [];
		_.each(this.targetBankList1, function(item) {
			targetBankData1.push({ light: self.lightState[item.l], switchIndex: item.s });
		});
		this.targetBank1 = new Pin.TargetBank(targetBankData1);
		this.targetBank1.setLitColour(1,0.6,0, 1);
		this.targetBank1.pusle(1,0.6,0, 1);
	},

	update: function(switchState, delta) {
		this.forceState[0] = switchState[this.SW_PLUNGER_BUTTON];

		// we want these to fire based on which bodies are active in the switch area.
		// this can be used for slingshots.
		this.forceFromSwitchState[2] = switchState[2];
		this.forceFromSwitchState[3] = switchState[3];

		// we want this to fire based on the bodies active in the switch area
		// AND we want it to do the force away from the center of the force.
		// this can be used for pop bumpers.
		this.forceFromCenterAndSwitchState[4] = switchState[4];

		// update target banks
		this.targetBank0.update(switchState);
		this.targetBank1.update(switchState);

		_.each(this.lightState, function(lightData) {
			lightData.update(delta);
		});
	},

	constructFlipperData: function(flipperBodyIndex, switchIndex, directionMultiplier) {
		return {	flipperBodyIndex: flipperBodyIndex,
					switchIndex: switchIndex,
					directionMultiplier: directionMultiplier };
	},

	getFlipperData: function() {
		return [
			this.constructFlipperData(0, this.SW_LEFT_FLIPPER,   1),
			this.constructFlipperData(1, this.SW_RIGHT_FLIPPER, -1),
			this.constructFlipperData(2, this.SW_RIGHT_FLIPPER, -1)
		];
	},

	getInputMapping: function() {
		return [
			{ keyCode: 65, switchIndex: this.SW_LEFT_FLIPPER },		// 'A'
			{ keyCode: 76, switchIndex: this.SW_RIGHT_FLIPPER },	// 'L'
			{ keyCode: 70, switchIndex: this.SW_PLUNGER_BUTTON },	// 'F'
		];
	},

	getLightState: function() {
		return this.lightState;
	},

	getForceState: function() {
		return this.forceState;
	},

	getForceFromSwitchState: function() {
		return this.forceFromSwitchState;
	},

	getForceFromCenterAndSwitchState: function() {
		return this.forceFromCenterAndSwitchState;
	}

});
