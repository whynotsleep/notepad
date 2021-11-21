const moreIcon = `<svg viewBox="0 0 1024 1024"><path d="M498.7 655.8l-197.6-268c-8.1-10.9-0.3-26.4 13.3-26.4h395.2c13.6 0 21.4 15.4 13.3 26.4l-197.6 268c-6.6 9-20 9-26.6 0z"></path></svg>`
const arrowIcon = `<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>`

export const toolbarKeys = ['bold', 'underline', 'italic', 'through', 'code', 'sub', 'sup', 'clearStyle', 'headerSelect', 
'header1', 'header2', 'header3', 'header4', 'header5', 'color', 'bgColor', 'insertLink', 'editLink', 'unLink', 'viewLink',
 'insertImage', 'deleteImage', 'editImage', 'viewImageLink', 'imageWidth30', 'imageWidth50', 'imageWidth100', 'blockquote', 
 'emotion', 'fontSize', 'fontFamily', 'indent', 'delIndent', 'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify', 
 'lineHeight', 'redo', 'undo', 'divider', 'codeBlock', 'fullScreen', 'bulletedList', 
 'numberedList', 'insertTable', 'deleteTable', 'insertTableRow', 'deleteTableRow', 'insertTableCol', 
 'deleteTableCol', 'tableHeader', 'tableFullWidth', 'insertVideo', 'deleteVideo', 'uploadImage', 'codeSelectLang']

export const topBarKeys = [
    'headerSelect',
    'fontSize', 'fontFamily','lineHeight',
    {
        key: 'group-more-style', // 必填，要以 group 开头
        title: '样式', // 必填
        // iconSvg: '<svg>....</svg>', // 可选
        menuKeys: ['bold', 'italic', 'underline', 'through', 'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify', "clearStyle"] // 下级菜单 key ，必填
    },
    'color', 'bgColor',
    'insertLink', 'bulletedList', 'numberedList','insertTable', 'codeBlock',
    {
        key: 'group-more-other',
        title: '其它',
        iconSvg: arrowIcon,
        menuKeys: ['divider', 'blockquote', 'code', 'emotion',  'sub', 'sup']
    }
]
