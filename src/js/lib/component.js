import Store from '../store/store.js'

/**
 * 
 */
export default class Component {
    constructor (props = {}) {
        let self = this

        this.render = this.render || function () {}

        if (props.store instanceof Store) {
            // 订阅了stateChange事件，然后执行自身的render方法
            props.store.events.subscribe('stateChange', () => self.render())
        }

        if (props.hasOwnProperty('element')) {
            this.element = props.element
        }
    }
}
