import { isFunction } from './common';

let toArray = function (node) {
	var arr = [];
	arr.push(node.item);
	if (node.children != null)
		node.children.forEach(function (f) { return Node.toArray(f).forEach(function (g) { arr.push(g); }); });
	return arr;
}
let fromArray = function (arr, findParentFnc) {
	let nodes = arr.map(function (f) {
		return new Node(f);
	});

	nodes.forEach(function (f) {
		var parent = findParentFnc(f.item, arr);
		if (parent != null)
			nodes.find(g => g.item === parent).AddChild(f);
	});

	return nodes.filter(function (f) { return f.GetParent == null; });
}
let map = function (node) {
	return function (fnc) {
		var ret = new Node(fnc(node.item));
		if (node.children)
			node.children.forEach(function (g) {
				ret.AddChild(Node.map(g)(fnc));
			});
		return ret;
	}
}
let filter = function (node) {
	return function (fnc) {
		if (!fnc(node)) return null;
		var ret = new Node(node.item);
		if (node.children)
			node.children.forEach(function (g) {
				var ch = Node.filter(g)(fnc);
				if (ch) ret.AddChild(ch);
			});
		return ret;
	}
}
let filterAny = function (node) {
	return function (fnc) {
		var ret = new Node(node.item);
		if (node.children)
			node.children.forEach(function (g) {
				var ch = Node.filterAny(g)(fnc);
				if (ch) ret.AddChild(ch);
			});
		if (ret.children.length > 0 || fnc(node)) return ret;
	}
}
let sortBy = function (node) {
	return function (prop, sortFnc) {
		var ret = new Node(node.item);

		var propFnc = isFunction(prop) ? f => prop(f) : f => f[prop];
		if (node.children)
			node.children.sortBy(propFnc, sortFnc).forEach(function (g) {
				var clonedNode = Node.sortBy(g)(prop, sortFnc);
				ret.AddChild(clonedNode);
			});
		return ret;
	}
}
let find = function (node) {
	return function (fnc) {
		if (fnc(node)) return node;
		if (node.children)
			for (var i = 0; i < node.children.length; i++) {
				var find = Node.find(node.children[i])(fnc);
				if (find != null)
					return find;
			}
	}
}
let forEach = function (node) {
	return function (fnc) {
		fnc(node);
		if (node.children)
			node.children.forEach(function (g) { Node.forEach(g)(fnc); });
		return this;
	}
}

var Node = function (item) {
	let self = this;
	this.item = item;
	this.children = [];
	this.AddChild = function (child) {
		child.GetParent = function () { return self; };
		this.children.push(child);
	}
	this.GetNodeLevel = function () {
		return this.GetParent == null ? 0 : this.GetParent().GetNodeLevel() + 1;
	}
	this.GetTopParent = function () {
		if (this.GetParent == null)
			return this;
		return this.GetParent().GetTopParent();
	}
	this.RemoveParent = function () {
		this.GetParent = null;
		return this;
	}
	this.map = map(this);
	this.filter = filter(this);
	this.filterAny = filterAny(this);
	this.sortBy = sortBy(this);
	this.find = find(this);
	this.forEach = forEach(this);
	this.toArray = toArray(this);
}

Node.toArray = toArray;
Node.fromArray = fromArray;
Node.map = map;
Node.filter = filter;
Node.filterAny = filterAny;
Node.sortBy = sortBy;
Node.find = find;
Node.forEach = forEach;

export default Node;