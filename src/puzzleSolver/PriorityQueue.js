class QElement {
	constructor(element, priority) {
		this.element = element;
		this.priority = priority;
	}
}

class PriorityQueue {
	constructor() {
		this.items = [];
	}

	enqueue(element, priority) {
		const qElement = new QElement(element, priority);
		let contain = false;

		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].priority > qElement.priority) {
				this.items.splice(i, 0, qElement);
				contain = true;
				break;
			}
		}

		if (!contain) {
			this.items.push(qElement);
		}
	}

    front() {
        if (this.isEmpty())
            return null;
        return this.items[0];
    }

    dequeue() {
		if (this.isEmpty())
			return null;
		return this.items.shift();
	}

	isEmpty() {
		return this.items.length === 0;
	}

	size() {
	    return this.items.length;
    }
}

module.exports = PriorityQueue;
