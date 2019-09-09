function getOffset(devices, numberOfDevices) {
	const period = process.env.PERIOD;

	const t_sleep = numberOfDevices * period;

	console.log('getOffset period, t_sleep, numberOfDevices', period, t_sleep, numberOfDevices);

	const delta = Math.floor(t_sleep / Object.keys(devices).length);
	const offsets = { ...devices };
	const pivot = Object.keys(devices).sort()[0];

	Object.keys(devices).sort().forEach((device, index) => {
		console.log(index, device);
		if (index === 0) return (offsets[device] = 0);

		if (devices[pivot] - devices[device] >= 0) {
			offsets[device] = devices[pivot] - devices[device] + index * delta;
		} else if (devices[pivot] - devices[device] < 0 && devices[device] - devices[pivot] < t_sleep) {
			offsets[device] = devices[pivot] + t_sleep - devices[device] + index * delta;
		} else if (devices[device] - devices[pivot] > t_sleep) {
			const numPerods = Math.floor((devices[device] - devices[pivot]) / t_sleep);
			offsets[device] = devices[device] - numPerods * t_sleep - devices[pivot] + index * delta;
		}
	});
	return offsets;
}

module.exports = { getOffset };
