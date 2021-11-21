const state = {
    currentCate: null,
    currentArticle: null,
    articleList: []
}

const mutations = {
    updateCurrentCate(state, data) {
        state.currentCate = data
    },
    updateCurrentArticle(state, data) {
        state.currentArticle = data
    },
    updateArticleList(state, data) {
        state.articleList = data
    },
    updateArticleListTitle(state, data) {
        const index = state.articleList.findIndex(item => data.article_id === item.article_id)
        
        if(index !== -1) {
            state.articleList[index].title = data.title
        }  
    },
    updateAtIndexArticleList(state, data) {
        const index = state.articleList.findIndex(item => item.article_id === data.article_id)
        if(index !== -1) {
            state.articleList[index] = data
        }
    },
    delAtIndexArticleList(state, articleId) {
        const index = state.articleList.findIndex(item => articleId === item.article_id)
        if(index !== -1) {
            state.articleList.splice(index, 1)
        }   
    }
}

const actions = {
    someAsyncTask({
        commit
    }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions
}