export class Trie {

    constructor(from) {
        this.isEnd = false;
        this.children = {};
        if (from) {
            this._construct(from);
        }
    }

    insert(str) {
        let node = this;

        for (const c of str) {
            if (!node.children.hasOwnProperty(c)) {
                node.children[c] = new Trie();
            }
            node = node.children[c];
        }
        node.isEnd = true;
    }

    search(str) {
        let node = this;

        for (const c of str) {
            if (!node.children.hasOwnProperty(c)) {
                return null;
            }
            node = node.children[c];
        }
        return node.isEnd ? node : null;
    }

    delete(str) {
        let node = this;

        function rec(node, str, i) {
            if (i === str.length) {
                node.isEnd = false;
                return Object.keys(node.children).length === 0;
            }
            else {
                const nextDeletion = rec(node.children[str[i]], str, i + 1);
                if (nextDeletion) {
                    node.children.delete(str[i]);
                }
                return nextDeletion && !node.isEnd && Object.keys(node.children).length === 0;
            }
        }

        if (node.search(str) !== null) {
            rec(node, str, 0);
        }
    }

    _construct(from) {
        let node = this;

        function copy(node, from) {
            node.isEnd = from.isEnd;
            node.children = {};

            for (const key of Object.keys(from.children)) {
                node.children[key] = {};
                copy(node.children[key], from.children[key]);
            }
        }

        copy(node, from);
    }
}