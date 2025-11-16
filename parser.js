/*************************************
 *              HouseMD              *
 *         Created by ixNoah         *
 *           License: MIT            *   
 * ***********************************/

import { marked } from './modules/marked.min.js'

export const timeFormatter = Intl.DateTimeFormat('en-gb', { dateStyle: 'long' })

/**
 * @type {[RegExp, string | method][]}
 */
const detectors = [
    [
        new RegExp('\\[\\[([A-Za-z!@#$%^&*()_\\-+=?.,]+)\\]\\]', 'g'),
        `<a href="?p=$1">$1</a>`
    ],
    [
        new RegExp('\\{Date\\|(.*?)\\}'),
        (md, expr, matches) => {
            return timeFormatter.format(new Date(matches[1]))
        }
    ],
    [
        new RegExp('\\-# (.*)', 'g'),
        '<span class="subtext">$1</span>'
    ],
    [
        new RegExp('\\{TableOfContents}', 'g'),
        (md, expr, matches) => {
            return 'todo'
        }
    ],
]

function recursiveReplace(target, expr, method) {
    const matches = target.match(expr)

    if (!matches) return target

    const modified = method(target, expr, matches)
    const result = target.replace(expr, modified)

    if (result == target) return result

    return recursiveReplace(result, expr, method)
}

/**
 * Parses markdown
 * @param {string} md 
 * @returns 
 */
export function parseMarkdown(md) {
    detectors.forEach(([expression, result]) => {
        if (typeof result == 'string') {
            md = md.replaceAll(expression, result)
        } else {
            md = recursiveReplace(md, expression, result)
        }
    })

    return marked.parse(md)


}