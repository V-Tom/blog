/**
 * Created by Nomand on 3/7/16.
 */

/**
 * Insert el after target
 *
 * @param {Element} el
 * @param {Element} target
 */

export const insertAfter = (el, target)=> {
    if (target.nextSibling) {
        insertBefore(el, target.nextSibling)
    } else {
        target.parentNode.appendChild(el)
    }
};

export const contains = (root, node) => {
    while (node) {
        if (node === root) {
            return true
        }
        node = node.parentNode
    }
    return false
};

/*
 * 得到父元素
 * @param {Element} el
 * @param {String} selector
 * */

export const closest = (el, selector)=> {
    if (!el || !selector || el.nodeType !== 1) {
        return null;
    }
    const identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+";
    const filter = ((selsector) => {
        if (new RegExp("^#(" + identifier + ")").test(selsector)) {
            return (parentNode) => parentNode.id === selsector.substr(1);
        } else if (new RegExp("^\\.(" + identifier + ")").test(selsector)) {
            return (parentNode)=> parentNode.classList && Array.from(parentNode.classList).indexOf(selsector.substr(1)) !== -1;
        } else {
            return (parentNode)=> parentNode.tagName === selsector.toUpperCase();
        }
    })(selector);

    let parentNode = el.parentNode;
    while (parentNode && parentNode.nodeType == 1) {
        if (filter(parentNode)) {
            return parentNode;
        }
        parentNode = parentNode.parentNode;
    }
    return null;
};
