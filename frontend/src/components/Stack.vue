<template>
    <div>
        <button v-if="selectedIndex < 0 && !data.isZero()" class="button is-primary is-small" @click="select">選択</button>
        <div v-if="selectedIndex === data.id">
            <span @click="removeOne" class="button is-danger is-small">-</span>
        </div>
        <transition-group name="l">
            <span v-for="item in data.stones" :key="item" class="l-item flex">
                <Stone :value="item"/>
            </span>
        </transition-group>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Stone from '@/components/Stone.vue';
import Pile from '../pile';

@Component({
    components: {
        Stone,
    },
    computed: {
        selectedIndex() {
            return this.$store.state.stones.game.selectedIndex;
        },
    },
    methods: {
        removeOne() {
            this.$store.commit('stones/removeOne');
        },
    },
})
export default class Stack extends Vue {
    @Prop() data!: Pile;
    constructor() {
        super();
    }
    select() {
        this.$store.commit('stones/select', this.data.id);
    }
}
</script>
<style lang="scss" scoped>
.l-enter-active, .l-leave-active {
  transition: all .5s;
}
.l-enter, .l-leave-to {
  opacity: 0;
  transform: translateY(60px);
}
.l-move {
  transition: transform .5s;
}
</style>
