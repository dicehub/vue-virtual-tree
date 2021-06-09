import {computed, defineComponent, PropType, Slot} from "vue";
import {TreeNodeOptions} from "./types";
import VirtualCheckbox from '../VirtualCheckbox';
import RenderNode from './render';

export default defineComponent({
  name: 'VirTreeNode',
  props: {
    node: {
      type: Object as PropType<Required<TreeNodeOptions>>,
      required: true
    },
    iconSlot: Function as PropType<Slot>,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    nodeOffsetBase: {
      type: Number,
      required: true
    },
    render: Function
  },
  emits: ['select-change', 'toggle-expand', 'check-change'],
  setup(props, { emit, expose }) {
    const halfChecked = computed(() => {
      let result = false;
      if (!props.checkStrictly && props.node.hasChildren) {
        const { children } = props.node;
        const checkedChildren = children!.filter(item => item.checked);
        result = checkedChildren.length > 0 && checkedChildren.length < children!.length;
      }
      return result;
    });
    const textCls = computed(() => {
      let result = 'node-title';
      if (props.node.selected) {
        result += ' selected';
      }
      if (props.node.disabled) {
        result += ' disabled';
      }
      return result;
    });
    const handleSelect = () => {
      if (!props.node.disabled) {
        emit('select-change', props.node);
      }
    }
    const handleExpand = () => {
      emit('toggle-expand', props.node);
    }
    const handleCheckChange = (checked: boolean) => {
      emit('check-change', [checked, props.node])
    }
    const renderArrow = (): JSX.Element | null => {
      return <div class={ ['node-arrow', props.node.expanded ? 'expanded' : ''] } onClick={ handleExpand }>
        {
          props.node.hasChildren
            ? props.iconSlot ? props.iconSlot(props.node) : props.node.loading
            ? <i class="iconfont iconloading ico-loading" />
            : <i class="iconfont iconExpand" />
            : null
        }
      </div>
    }

    const renderContent = () => {
      if (props.showCheckbox) {
        return <VirtualCheckbox
          class="node-content node-check-box"
          disabled={ props.node.disabled }
          modelValue={ props.node.checked }
          halfChecked={ halfChecked.value }
          // @ts-ignore
          onChange={ handleCheckChange }>
          {
            props.render ? <RenderNode render={ props.render } node={ props.node } /> : <span class="node-title">{ props.node.name }</span>
          }
        </VirtualCheckbox>;
      }
      return <div class="node-content node-text" onClick={ handleSelect }>
        {
          props.render ? <RenderNode render={ props.render } node={ props.node } /> : <span class={ textCls.value }>{ props.node.name }</span>
        }
      </div>;
    }
    expose({
      rawNode: props.node,
      halfChecked: () => halfChecked.value
    });
    // console.log('iconSlot', props.iconSlot);
    return () => {
      return (
        <div class="vir-tree-node" style={{ paddingLeft: props.node.level! * props.nodeOffsetBase + 'px' }}>
          { renderArrow() }
          { renderContent() }
        </div>
    );
    }
  }
});
