import PubSub from '../lib/pubsub.js'

/**
 * 
 */
export default class Store {
    constructor (params) {
        const self = this

        // 设置默认值
        self.actions = {}
        self.mutations = {}
        self.state = {}
        // 用来确定对象给定时间在干什么
        self.status = 'resting'
        self.events = new PubSub()

        if (params.hasOwnProperty('actions')) {
            self.actions = params.actions
        }
        if (params.hasOwnProperty('mutations')) {
            self.mutations = params.mutations
        }

        self.state = new Proxy((params.state || {}), {
            set: function (state, key, value) {
                state[key] = value

                console.log(`stateChange: ${key}: ${value}`)
                // 发布stateChange事件
                self.events.publish('stateChange', self.state)

                // 如果直接设置了状态，给予提示
                if (self.status !== 'mutation') {
                    console.log(`You should use a mutation to set ${key}`)
                }

                // 将状态重置了
                self.status = 'resting'

                return true
            }
        })
    }

    /**
     * 
     * @param {*} actionKey 
     * @param {*} payload 
     */
    dispatch (actionKey, payload) {
        let self = this

        if (typeof self.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey}" doesn't exit`)
            return false
        }

        console.groupCollapsed(`Action: ${actionKey}`)

        self.status = 'action'
        self.actions[actionKey](self, payload)

        console.groupEnd()

        return true
    }

    /**
     * 
     * @param {*} mutationKey 
     * @param {*} payload 
     */
    commit (mutationKey, payload) {
        let self = this

        if (typeof self.mutations[mutationKey] !== 'function') {
            console.error(`Mutation "${mutationKey}" doesn't exit`)
            return false
        }

        self.status = 'mutation'
        let newState = self.mutations[mutationKey](self.state, payload)

        self.state = Object.assign(self.state, newState)

        return true
    }
}
