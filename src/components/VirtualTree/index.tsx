import {defineComponent, watch, ref, shallowRef, PropType, h} from 'vue';
import cloneDeep from 'lodash.clonedeep';
import {nodeKey, TreeNodeInstance, TreeNodeOptions} from "./types";
import { flattenTree, updateDownwards, updateUpwards } from "./uses";
import VirTreeNode from './node';
import VirtualList from '../VirtualList';
import './index.scss';

export default defineComponent({
  name: 'VirTree',
  props: {
    source: {
      type: Array as PropType<TreeNodeOptions[]>,
      default: () => []
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 27
    },
    remain: {
      type: Number,
      default: 8
    },
    nodeOffsetBase: {
      type: Number,
      default: 18
    },
    showLines: {
      type: Boolean,
      default: true
    },
    loadData: Function as PropType<(node: TreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => void>,
    render: Function
  },
  emits: ['selectChange', 'checkChange'],
  setup(props, { emit, slots, expose }) {
    const loading = shallowRef(false);
    const selectedKey = ref<string | number>('');
    const flatList = ref<Required<TreeNodeOptions>[]>([]);
    watch(() => props.source, newVal => {
      flatList.value = flattenTree(newVal);
    }, { immediate: true });
    const selectChange = (node: Required<TreeNodeOptions>) => {
      if (selectedKey.value) {
        if (selectedKey.value === node.nodeKey) {
          node.selected = false
          selectedKey.value = '';
          emit('selectChange', node);
        } else {
          const prevSelectedNode = flatList.value.find((item) => {
            return item.nodeKey === selectedKey.value
          })
          if (prevSelectedNode) {
            prevSelectedNode.selected = false;
          }
          node.selected = true
          selectedKey.value = node.nodeKey;
          emit('selectChange', node);
        }
      } else {
        node.selected = true
        selectedKey.value = node.nodeKey;
        emit('selectChange', node);
      }
    }


    const checkChange = ([checked, node]: [boolean, Required<TreeNodeOptions>]) => {
      node.checked = checked;
      if (!props.checkStrictly) {
        updateDownwards(checked, node);
        updateUpwards(node, flatList.value);
      }
      emit('checkChange', node);
    }

    const expandNode = (node: Required<TreeNodeOptions>, children: TreeNodeOptions[] = []) => {
      const trueChildren = children.length ? children : cloneDeep(node.children)!;
      node.children = trueChildren.map((item, index) => {
        item.loading = false;
        item.level = item.level || node.level! + 1;
        item.disabled = item.disabled || false;
        item.selected = item.selected || false;
        item.expanded = item.expanded || false;
        item.checked = item.checked ?? node.checked;
        item.children = item.children || [];
        item.hasChildren = item.hasChildren || false;
        item.parentKey = node.nodeKey || null;
        item.last = index === trueChildren.length - 1
        return item;
      });
      const targetIndex = flatList.value.findIndex(item => item.nodeKey === node.nodeKey);
      flatList.value.splice(targetIndex + 1, 0, ...(node.children as Required<TreeNodeOptions>[]));
    }

    const collapseNode = (targetNode: Required<TreeNodeOptions>) => {
      const delKeys: nodeKey[] = [];
      const recursion = (node: Required<TreeNodeOptions>) => {
        if (node.children?.length) {
          node.children.forEach(item => {
            delKeys.push(item.nodeKey);
            if (item.expanded) {
              item.expanded = false;
              recursion(item as Required<TreeNodeOptions>);
            }
          });
        }
      }
      recursion(targetNode);
      if (delKeys.length) {
        flatList.value = flatList.value.filter(item => !delKeys.includes(item.nodeKey));
      }
    }

    const toggleExpand = (node: Required<TreeNodeOptions>) => {
      if (loading.value) return;
      // console.log('expand node');
      node.expanded = !node.expanded;
      if (node.expanded) {
        if (node.children?.length) {
          expandNode(node);
        } else {
          if (props.loadData) {
            node.loading = true;
            loading.value = true;
            // this.$forceUpdate();
            props.loadData(node, children => {
              node.loading = false;
              loading.value = false;
              if (children.length) {
                expandNode(node, children);
              }
            });
          }
        }
      } else {
        collapseNode(node);
      }
    }
    const nodeRefs = ref<TreeNodeInstance[]>([]);
    const setRef = (index: number, node: any) => {
      if (node) {
        nodeRefs.value[index] = node as TreeNodeInstance;
      }
    }
    expose({
      getSelectedNode: (): TreeNodeOptions | undefined => {
        return flatList.value.find(item => item.selected);
      },
      getCheckedNodes: (): TreeNodeOptions[] => {
        return flatList.value.filter(item => item.checked);
      },
      getHalfCheckedNodes: (): TreeNodeOptions[] => {
        return nodeRefs.value.filter(item => item.halfChecked()).map(item => item.rawNode);
      }
    });

    return () => {
      return (
        <div class="vir-tree">
          {
            h(VirtualList, {
              class: ['vir-tree-wrap'],
              size: props.size,
              remain: props.remain,
              list: flatList.value,
              dataKey: 'nodeKey',
            }, {
              default: (data: { item: Required<TreeNodeOptions>, index: number }) => h(VirTreeNode, {
                ref: setRef.bind(null, data.index),
                node: data.item,
                showCheckbox: props.showCheckbox,
                checkStrictly: props.checkStrictly,
                nodeOffsetBase: props.nodeOffsetBase,
                size: props.size,
                showLines: props.showLines,
                iconSlot: slots.icon,
                render: props.render,
                onSelectChange: selectChange,
                onToggleExpand: toggleExpand,
                onCheckChange: checkChange
              })
            })
          }
        </div>
      );
    }
  }
});
