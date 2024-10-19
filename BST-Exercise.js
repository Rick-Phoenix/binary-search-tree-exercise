class Tree {
  constructor(array) {
    this.array = this.preFilter(array.slice());
    this.root = this.buildTree(this.array);
  }

  preFilter(array) {
    const sortedArray = array.sort((a, b) => a - b);
    const filteredArray = sortedArray.reduce((acc, current) => {
      if (!acc.includes(current)) acc.push(current);
      return acc;
    }, []);
    return filteredArray;
  }

  buildTree(array, level = 0) {
    const mid = Math.floor(array.length / 2);
    const root = makeNode(array[mid], level);
    const leftSide = array.slice(0, mid);
    const rightSide = array.slice(mid + 1);
    if (array.length === 1) {
      root.left = null;
      root.right = null;
    } else if (array.length === 2) {
      root.left = this.buildTree(leftSide, level + 1);
      root.right = null;
    } else {
      root.left = this.buildTree(leftSide, level + 1);
      root.right = this.buildTree(rightSide, level + 1);
    }
    return root;
  }

  find(value, node = this.root, level = null) {
    if (node === null) return;
    if (level !== null && node.level === level - 1) {
      if (node.left && node.left.data === value) return node;
      else if (node.right && node.right.data === value) return node;
    }
    if (value === node.data) return node;
    if (value < node.data) return this.find(value, node.left, level)
    if (value > node.data) return this.find(value, node.right, level);
  }

  insert(value, node = this.root, level = 0) {
    if (value === node.data) return;
    if (value < node.data) {
      if (node.left === null) {
        node.left = makeNode(value, level + 1);
        this.array.push(value);
        return;
      } 
      else this.insert(value, node.left, level + 1);
    }
    if (value > node.data) {
      if (node.right === null) {
        node.right = makeNode(value, level + 1);
        this.array.push(value);
        return;
      }
      else this.insert(value, node.right, level + 1);
    }
  }

  findMinimumReplacement(node) {
    if (node.right === null) return node;
    else return this.findMinimumReplacement(node.right);
  }

  deleteItem(value, origin = true) {
    const item = this.find(value);
    if (!item) throw new Error('Item not found');
    if (origin === true) {
      const index = this.array.indexOf(value);
      this.array.splice(index, 1);
    }
    const itemLevel = item.level;
    const parentNode = this.find(value, this.root, itemLevel);

    if (item === this.root) {
      const minReplacement = this.findMinimumReplacement(item.left).data;
        this.deleteItem(minReplacement, false);
        item.data = minReplacement;
        return;
    }

    if (parentNode.left && parentNode.left.data === item.data) {
      if (item.left && item.right) {
        const minReplacement = this.findMinimumReplacement(item.left).data;
        this.deleteItem(minReplacement, false);
        item.data = minReplacement;
        return;
      }
      else if (item.left === null && item.right === null) {
        parentNode.left = null;
        return;
      } 
      else if (item.left) {
        const replacementValue = item.left.data 
        this.deleteItem(item.left.data, false);
        item.data = replacementValue;
        return;
      }
      else if (item.right) {
        const replacementValue = item.right.data 
        this.deleteItem(item.right.data, false);
        item.data = replacementValue;
        return;
      }
    }
    
    if (parentNode.right && parentNode.right.data === item.data) {
      if (item.left && item.right) {
        const minReplacement = this.findMinimumReplacement(item.left).data;
        this.deleteItem(minReplacement, false);
        item.data = minReplacement;
        return;
      }
      else if (item.left === null && item.right === null) {
        parentNode.right = null;
        return;
      }
      else if (item.left) {
        const replacementValue = item.left.data 
        this.deleteItem(item.left.data, false);
        item.data = replacementValue;
        return;
      }
      else if (item.right) {
        const replacementValue = item.right.data 
        this.deleteItem(item.right.data, false);
        item.data = replacementValue;
        return;
      }
    }
  }

  levelOrder(callback, node = this.root) {
    if (!callback) throw new Error('Callback Required');
    let queue = [node];

    while (queue.length > 0) {
      let currentNode = queue.shift();
      callback(currentNode);
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }
  }

  preOrder(callback, node = this.root) {
    if (!callback) throw new Error('Callback Required');
    if (node === null) return;
    callback(node);
    if (node.left) this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  inOrder(callback, node = this.root) {
    if (!callback) throw new Error('Callback Required');
    if (node === null) return;
    if (node.left) this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  postOrder(callback, node = this.root) {
    if (!callback) throw new Error('Callback Required');
    if (node === null) return;
    if (node.left) this.postOrder(callback, node.left);
    if (node.right) this.postOrder(callback, node.right);
    callback(node);
  }

  height(value, node = this.find(value)) {
    return this.findMaxDepth(node) - node.level;
  }

  findMaxDepth(node) {
    let stack = [node];
    let maxDepth = 0;

    while (stack.length > 0) {
      let currentNode = stack.pop();
      if (currentNode.left) stack.push(currentNode.left);
      if (currentNode.right) stack.push(currentNode.right);
      if (currentNode.level < maxDepth) continue;
      if (!currentNode.left && !currentNode.right) {
        if (maxDepth < currentNode.level) maxDepth = currentNode.level;
      }
    }
    return maxDepth;
  }


  depth(value, node = this.find(value)) {
    return node.level;
  }

  isBalanced(node = this.root) {
    const leftHeight = this.height(node.left.value, node.left);
    const rightHeight = this.height(node.right.value, node.right);
    const difference = leftHeight - rightHeight;
    if (difference <= 1 && difference >= -1) return true;
    else return false;
  }

  balance() {
    this.root = this.buildTree(this.preFilter(this.array));
  }
}


function log(arg) {
  console.log(arg.data);
}

function makeNode(value, level = null) {
  return {
    data: value,
    left: null,
    right: null,
    level: level,
  }
}


const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function generateRandomNumbersArray() {
  const randomSize = Math.floor(Math.random() * 20) + 1;
  let array = [];

  for (let i = 0; i < randomSize; i++) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    array.push(randomNumber);
  }

  return array;
}



