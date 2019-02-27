/**
 * 发布订阅模式
 */
export default class PubSub {
    constructor () {
        this.events = {}
    }

    /**
     * 订阅者
     * @param {string} event 
     * @param {function} callback 
     */
    subscribe (event, callback) {
        const self = this

        if (!self.events.hasOwnProperty(event)) {
            self.events[event] = []
        }

        self.events[event].push(callback)
    }

    /**
     * 订阅者
     * @param {string} event 
     * @param {*} data 
     */
    publish (event, data = {}) {
        let self = this

        if (!self.events.hasOwnProperty(event)) {
            return []
        }

        return self.events[event].map(callback => callback(data))
    }
}