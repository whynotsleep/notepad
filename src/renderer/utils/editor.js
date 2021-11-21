class Editor {
    id = null
    constructor(id) {
        if ( !id ) {
            throw new Error('缺少承载编辑器的元素id')
        }
        this.id = document.getElementById(id)
    }
}