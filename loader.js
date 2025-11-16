import { parseMarkdown } from "./parser.js"

const PAGE_KEY_REGEX = /[A-Za-z!@#$%^&*()_\-+=?.,]+/

const page = new URL(window.location.href)
const pageKey = page.searchParams.get('p') || 'Main_Page'

// update title
document.title = pageKey.replaceAll('_', ' ')

const pageTitle = document.querySelector('#page-title')
pageTitle.innerText = pageKey.replaceAll('_', ' ')

// handle page load
const pageLoad = new Promise(async (res, rej) => {
    if (!PAGE_KEY_REGEX.test(pageKey)) return rej(['Invalid page!', 'The requested page title is not formatted correctly!'])
    
    // Fetch page markdown
    const file = await fetch('./' + pageKey + '.md')
    const fileContents = await file.text()

    if (!file || !fileContents || fileContents.includes('<title>Error</title>')) return rej(['Page not found!','The requested page couldn\'t be found!']);

    let [meta, markdown] = fileContents.split('---', 2)


    // Format metadata
    meta = meta.split('\n').map(line => line.split('=', 2))

    const metaObj = {}
    meta.forEach(([ key, value ]) => metaObj[key] = value) 

    markdown = parseMarkdown(markdown)

    if (metaObj.JS_FILE) {
        import(metaObj.JS_FILE)
    }

    
    // Insert into document
    document.querySelector('#page-metadata-info').innerText = `Last edited by ${metaObj.UPDATED_BY}`
    document.querySelector('#content').innerHTML = markdown

    if (metaObj.LANDER == 'true') {
        document.querySelector('.page-metadata').remove()
        pageTitle.remove()
    }
    
    res()
})


pageLoad.catch(reason => {
    document.querySelector('#success').setAttribute('hidden', true)

    const errorPage = document.querySelector('#error')
    
    const errorTitle = document.createElement('h1')
    const errorBody = document.createElement('p')
    const returnUrl = document.createElement('a')

    errorTitle.innerText = reason[0]
    errorBody.innerText  = reason[1]

    returnUrl.href = '..'
    returnUrl.innerText = 'Return to Homepage'

    errorPage.appendChild(errorTitle)
    errorPage.appendChild(errorBody)
    errorPage.appendChild(returnUrl)

    errorPage.removeAttribute('hidden')
})

