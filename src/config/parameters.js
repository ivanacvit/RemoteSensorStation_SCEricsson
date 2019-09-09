const ID_SLEEP_PERIOD = 'ID_SLEEP_PERIOD';
const ID_OFFSET = 'ID_OFFSET';
const ID_ABSOLUTE_TIME = 'ID_ABSOLUTE_TIME';
const ID_BACKOFF_TIMEOUT = 'ID_BACKOFF_TIMEOUT';
const ID_RETRY_LIMIT = 'ID_RETRY_LIMIT';
const ID_CONTENTION_WINDOW_MAX = 'ID_CONTENTION_WINDOW_MAX';
const ID_REQ_ACK = 'ID_REQ_ACK';
const ID_ADR = 'ID_ADR';
const ID_CHANNEL = 'ID_CHANNEL';
const ID_SPREADING_FACTOR = 'ID_SPREADING_FACTOR';
const ID_BANDWIDTH = 'ID_BANDWIDTH';
const ID_CODE_RATE = 'ID_CODE_RATE';
const ID_TX_POWER = 'ID_TX_POWER';
const ID_RX_PERIOD = 'ID_RX_PERIOD';
const ID_RESET = 'ID_RESET';
const ID_RETURN_PARAM_VALUE = 'ID_RETURN_PARAM_VALUE';
const ID_TOGGLE = 'ID_TOGGLE';

const parameters = {
	0: { size: 2, name: ID_SLEEP_PERIOD },
	1: { size: 2, name: ID_OFFSET },
	2: { size: 4, name: ID_ABSOLUTE_TIME },
	3: { size: 2, name: ID_BACKOFF_TIMEOUT },
	4: { size: 1, name: ID_RETRY_LIMIT },
	5: { size: 1, name: ID_CONTENTION_WINDOW_MAX },
	6: { size: 1, name: ID_REQ_ACK },
	7: { size: 1, name: ID_ADR },
	8: { size: 1, name: ID_CHANNEL },
	9: { size: 1, name: ID_SPREADING_FACTOR },
	10: { size: 1, name: ID_BANDWIDTH },
	11: { size: 1, name: ID_CODE_RATE },
	12: { size: 1, name: ID_TX_POWER },
	13: { size: 1, name: ID_RX_PERIOD },
	14: { size: 1, name: ID_RESET },
	15: { size: 1, name: ID_RETURN_PARAM_VALUE },
	100: { size: 1, name: ID_TOGGLE } //ID pinova moze ici od 101 do 120 -> if (id > 100 && id<=120)
};

module.exports = parameters;
