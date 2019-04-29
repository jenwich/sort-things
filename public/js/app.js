Vue.component('items-creator', {
    data: function() {
        return {
            // value: '34\n99\n12\n-7\n1',
            value: '',
        }
    },
    template: `
        <div>
            <textarea v-model="value" cols="30" rows="10"></textarea>
            <br/>
            <button v-on:click="create()" v-bind:disabled="value == ''">Create</button>
        </div>`,
    methods: {
        create: function() {
            let items = this.value.trim().split('\n')
            this.$emit('createItems', items)
            this.value = ''
        }
    }
})

Vue.component('items-selector', {
    props: ['items'],
    template: `
        <div>
            <button v-on:click="select(0)">{{ items[0] }}</button>
            <button v-on:click="select(1)">{{ items[1] }}</button>
            <br>
            <button v-on:click="changePage('create')">Create New List</button>
        </div>`,
    methods: {
        select: function(val) {
            this.$emit('selectItem', val)
        },
        changePage: function(page) {
            this.$emit('changePage', page)
        }
    }
})

let app = new Vue({
    el: '#app',
    data: function() {
        return {
            page: 'select',
            status: '',
            compareItems: ['0', '1'],
            items: [],
            originalItems: [],
        }
    },
    template: `
        <div id="main">
            <items-selector
                v-bind:items="compareItems"
                v-if="page == 'select'"
                v-on:changePage="onChangePage"
                v-on:selectItem="onSelectItem"
            ></items-selector>
            <items-creator
                v-if="page == 'create'"
                v-on:createItems="onCreateItems"
            ></items-creator>
            <ol v-if="page == 'create'" style="text-align: left;">
                <li v-for="item in items">{{ item }}</li>
            </ol>
            <textarea rows="6">{{ originalItems | toText }}</textarea>
        </div>`,
    methods: {
        onChangePage: function(page) {
            this.page = page
        },
        onCreateItems: function(val) {
            axios.post('/create', { items: val }).then((result) => {
                let data = result.data
                this.page = 'select'
                this.items = data.items
                this.originalItems = data.originalItems
                this.compareItems = data.compareItems
            })
        },
        onSelectItem: function(val) {
            axios.post('/next', { answer: val }).then((result) => {
                let data = result.data
                this.items = data.items
                this.originalItems = data.originalItems
                this.compareItems = data.compareItems
                if (data.status !== 'Running') {
                    this.page = 'create'
                }
            })
        },
    },
    mounted: function() {
        axios.get('/status').then((result) => {
            let data = result.data
            if (data.status !== 'Running') {
                this.page = 'create'
                this.items = data.items
                this.originalItems = data.originalItems
            } else {
                this.page = 'select'
                this.items = data.items
                this.compareItems = data.compareItems
                this.originalItems = data.originalItems
            }
        })
    },
    filters: {
        toText: function(val) {
            return val.join('\n')
        }
    }
})