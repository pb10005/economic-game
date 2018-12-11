import Vue from 'vue';
import Vuex from 'vuex';
import Vegetable from './vegetable';
import FieldModel from './field';

Vue.use(Vuex);

const agriCulture = {
  // モジュールごとにmutationsなどを分割できる(同じ名前でも)
  namespaced: true,
  state: {
    title : 'agriculture',
    description : 'agriculture',
    log: '---1年目4月---\n',
    money: 1000,
    year: 1,
    month : 4,
    gameOver: false,
    vegetables: {
      cabbage: new Vegetable('キャベツ', [3, 4, 5, 6], 4, 0.2, 200, 3000, '/img/cabbage.png'),
      carrot: new Vegetable('ニンジン', [4, 5, 6, 7], 3, 0.1, 100, 1200, '/img/carrot.png'),
      onion: new Vegetable('タマネギ', [11, 12], 6, 0.1, 300, 4500, '/img/onion.png'),
    },
    fields: [
      new FieldModel(1),
      new FieldModel(2),
      new FieldModel(3),
      new FieldModel(4),
    ]
  },
  mutations: {
    consume(state: any, price: number) {
      if(state.gameOver) return;
      state.money -= price;
      if(state.money < 0) {
        /* 破綻 */
        state.log += '破綻\n';
        state.gameOver = true;
      }
    },
    nextMonth(state: any) {
      if(state.gameOver) return;
      state.fields.forEach(f => {
        if(!f.vegetable.isEmpty()) {
          agriCulture.mutations.consume(state, 100);
        }
        f.vegetable.getAge();
      });
      if (state.month < 12) {
        state.month++;
      } else {
        state.year++;
        state.month = 1;
      }
      state.log += '---' + state.year + '年目' + state.month + '月' + '---\n';
    },
    seed(state: any, vegetable: Vegetable) {
      if(state.gameOver) return;
      for(let i=0;i<state.fields.length;i++) {
        let f = state.fields[i];
        if(f.vegetable.name==='空') {
          f.vegetable = vegetable;
        agriCulture.mutations.consume(state, f.vegetable.initPrice);
        state.log += f.vegetable.name + 'を植えた!\n';
          return;
        }
      }
    },
    harvest(state: any, field: FieldModel) {
      if(state.gameOver) return;
      let r = Math.random();
      if(r < field.vegetable.risk) {
        state.log += field.vegetable.name + 'の収穫に失敗した!\n';
      } else {
        state.log += field.vegetable.name + 'を収穫した!\n';
        state.money += field.vegetable.value;
      }
      field.vegetable = Vegetable.empty();
    },
    addField(state: any) {
      if(state.gameOver) return;
      let id = state.fields.length + 1;
      state.fields.push(new FieldModel(id));
      agriCulture.mutations.consume(state, 50000);
    },
  },
  getters: {
    fields(state: any) {return state.fields;}
  }
};

export default new Vuex.Store({
  modules: {
    agriCulture,
  },
});
