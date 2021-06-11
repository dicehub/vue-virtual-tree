
<template>
  <div class="dh-virtual-tree">
    <vir-tree
      :source="list"
      :render="renderContent"
      :size="nodeHeight"
      :remain="remain"
      :node-offset-base="35"
      @select-change="onSelectChange"
    >
      <template #icon="node">
        <button
          type="button"
          class="switch"
        >
          {{ node.expanded ? '-' : '+' }}
        </button>
      </template>
    </vir-tree>
  </div>
</template>

<script>
import { ref, watch, toRaw } from 'vue'

const treeData = [
  {
    name: '0-0',
    nodeKey: '0-0',
    expanded: true,
    hasChildren: true,
    children: [
      {
        name: '0-0-0',
        nodeKey: '0-0-0',
        hasChildren: true,
        children: [
          { name: '0-0-0-0', nodeKey: '0-0-0-0' },
          { name: '0-0-0-1', nodeKey: '0-0-0-1' },
          { name: '0-0-0-2', nodeKey: '0-0-0-2' }
        ]
      },
      {
        name: '0-0-1',
        nodeKey: '0-0-1',
        hasChildren: true,
        children: [
          { name: '0-0-1-0', nodeKey: '0-0-1-0' },
          { name: '0-0-1-1', nodeKey: '0-0-1-1' },
          { name: '0-0-1-2', nodeKey: '0-0-1-2' }
        ]
      },
      {
        name: '0-0-2',
        nodeKey: '0-0-2'
      }
    ]
  },
  {
    name: '0-1',
    nodeKey: '0-1',
    hasChildren: true,
    children: [
      { name: '0-1-0-0', nodeKey: '0-1-0-0', isLeaf: true },
      { name: '0-1-0-1', nodeKey: '0-1-0-1', isLeaf: true },
      { name: '0-1-0-2', nodeKey: '0-1-0-2', isLeaf: true }
    ]
  },
  {
    name: '0-2',
    nodeKey: '0-2',
    isLeaf: true
  }
]

const renderContent = (node) => {
  return (<b>EE { node.name }</b>)
}

export default {
  name: 'DhVirtualTree',

  props: {
    flatList: {
      type: Array,
      default: treeData
    },

    renderTemplate: {
      type: Function,
      default: renderContent
    },

    nodeHeight: {
      type: Number,
      default: undefined
    },

    remain: {
      type: Number,
      default: 8
    }
  },
  emits: ['select-change'],

  setup (props, { emit }) {
    const list = ref(props.flatList)

    const renderContent = ref(props.renderTemplate)

    watch(
      () => toRaw(props.flatList),
      newList => {
        list.value = newList
      }
    )

    const onSelectChange = (...args) => {
      emit('select-change', ...args)
    }

    return {
      list,
      renderContent,
      onSelectChange
    }
  }
}

</script>

<style lang="scss" scoped>
.dh-virtual-tree {
  height: auto;
  padding: 10px 0;
  position: relative;

  .tree-controls {
    position: absolute;
    top: 10px;
    right: 5px;
  }

  :deep(.vir-tree-wrap .vir-tree-node .node-arrow) {
    .switch {
      display: flex
    }
  }

  .switch {
    width: 16px;
    height: 14px;
    background-color: #c4c4c4;
    border-radius: 2px;
    color: #999;
    align-items: center;
    justify-content: center;
    margin-right: 19px;
  }
}
</style>
