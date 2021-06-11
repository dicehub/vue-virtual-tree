<template>
  <div class="demo">
    <a-button @click="selectedNode">DICEHUB</a-button>

    <dh-virtual-tree
      class="import-geometry-tree"
      :flat-list="objectsTree"
      :render-template="renderContentTree"
      :node-height="31"
      :remain="30"
      @select-change="onSelectChange"
    />
  </div>
</template>

<script lang="tsx">
  import {defineComponent, onMounted, ref, h} from 'vue';
  import {TreeInstance, TreeNodeOptions} from "../components/VirtualTree/types";
  import DhVirtualTree from './dh-virtual-tree.vue';
  import RefinementTreeContent from './refinement-tree-content.vue';
  import {getSelectedNode} from "./uses";

  function recursion(path = '0', level = 3): TreeNodeOptions[] {
    const list = [];
    for (let i = 0; i < 10; i += 1) {
      const nodeKey = `${path}-${i}`;
      const treeNode: TreeNodeOptions  = {
        nodeKey,
        name: nodeKey,
        expanded: true,
        children: [],
        hasChildren: true,
        disabled: i % 2 === 0
      };

      if (level > 0) {
        treeNode.children = recursion(nodeKey, level - 1);
      } else {
        treeNode.hasChildren = false;
      }

      list.push(treeNode);
    }
    return list;
  }

  const getObjectsList = () => [
    {
      "extra":{"type":"filename"},
      "disabled":true,
      "expanded":true,
      "name":"flange",
      "nodeKey":"flange",
      "hasChildren":true,
      "children":
        [
          {"extra":{"type":"regionName"},"name":"patch1","nodeKey":"flange-patch1"},
          {"extra":{"type":"regionName"},"name":"patch2","nodeKey":"flange-patch2"},
          {
            "extra":{"type":"regionName"},
            "name":"patch3",
            "hasChildren":true,
            "children": [
              {"extra":{"type":"regionName"},"name":"sub-patch1","nodeKey":"flange-sub-patch1"},
              {"extra":{"type":"regionName"},"name":"sub-patch2","nodeKey":"flange-sub-patch2"},
              {"extra":{"type":"regionName"},"name":"sub-patch3","nodeKey":"flange-sub-patch3"},
              {"extra":{"type":"regionName"},"name":"sub-patch4","nodeKey":"flange-sub-patch4"}
            ],
            "nodeKey":"flange-patch3"
          },
          {"extra":{"type":"regionName"},"name":"patch4","nodeKey":"flange-patch4"}
        ]
    }
  ]

  export default defineComponent({
    name: 'BaseDemo',

    components: {
      DhVirtualTree,
    },

    setup(prop, {emit}) {
      const list = ref<TreeNodeOptions[]>([]);
      const virTree = ref<TreeInstance | null>(null);
      onMounted(() => {
        list.value = recursion();
      });
      const selectedNode = () => {
        getSelectedNode(virTree.value!);
      }

      const objectsTree = ref(getObjectsList())

      const renderContentTree = (node: any) => {
        return h(RefinementTreeContent, {
          node,
        })
      }

      const onSelectChange = () => console.log('on-select-change');

      return {
        list,
        virTree,
        selectedNode,
        objectsTree,
        renderContentTree,
        onSelectChange,
      }
    }
  });
</script>
