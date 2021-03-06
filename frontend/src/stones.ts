import Nim from './nim';
import NimAI from './nim-ai';
const stones = {
    namespaced: true,
    state: {
        game: new Nim(),
        message: '',
        log: '',
        num: 0,
    },
    mutations: {
        select(state: any, id: number): void {
            state.log += (state.game.turnNum % 2 === 0 ? '先手' : '後手') + '人間: ' + id + ',';
            state.game.select(id);
        },
        removeOne(state: any): void {
            state.num++;
            state.game.removeOne();
        },
        next(state: any): void {
            if (state.num > 0) {
                state.log += state.num + '個\n';
            }
            state.num = 0;
            state.game.next();
        },
        checkEnd(state: any): boolean {
            return state.game.checkEnd();
        },
        think(state: any): void {
            const game: Nim = state.game;
            if (game.selectedIndex > 0) { return; }
            if (game.actionExists) { return; }
            const ai = new NimAI(game.piles);
            const g = ai.calcGrundy();
            if (g !== 0) {
                state.message = ai.think((_, index, num) => {
                    state.log  += (game.turnNum % 2 === 0 ? '先手' : '後手')
                        + 'AI: ' + (index + 1) + ',' + num + '個\n';
                    game.remove(index, num);
                    game.next();
                });
            } else {
                state.log += (game.turnNum % 2 === 0 ? '先手' : '後手') + 'AI: 投了\n';
            }
        },
    },
    getters: {
        game(state: any) { return state.game; },
    },
};
export default stones;
