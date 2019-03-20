import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
let store = new Vuex.Store({
    state: {
        totalMoney: 0,
        // tempArr: [],
        selectArr: [],

    },
    mutations: {
        changeUser (state, newArr) {
            state.selectArr = newArr;

        },
        changeMoney (state, newData) {
            state.totalMoney = newData
        }
    }
})

export default store