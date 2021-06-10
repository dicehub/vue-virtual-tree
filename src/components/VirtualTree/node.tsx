import {computed, defineComponent, PropType, Slot, withModifiers} from "vue";
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
    size: {
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
      return <div class={ ['node-arrow', props.node.expanded ? 'expanded' : ''] } onClick={ withModifiers(handleExpand, ['stop']) }>
        {
          props.node.hasChildren
            ? props.iconSlot ? props.iconSlot(props.node) : props.node.loading
            ? <i class="iconfont iconloading ico-loading" />
            : <i class="iconfont iconExpand" />
            : null
        }
      </div>
    }

    const renderLine = (): JSX.Element | null => {
      if (!props.node.level) {
        return null
      }

      const listLines = []

      for(let lineCounter = 0; lineCounter < props.node.level; lineCounter++) {
        listLines.push(<div class={ ['node-line'] } style={{ width: props.nodeOffsetBase + 'px' }} />)
      }

      return <section class={ ['node-lines'] }>
        <div class={ ['node-line-list'] } style={{ height: `${props.size}px` }}>
          { listLines }
        </div>
        <div class={['node-line-connector']} style={{
          top: `${props.size / 2}px`,
          left: `${props.node.level * props.nodeOffsetBase - props.nodeOffsetBase / 2}px`,
          width: props.node.hasChildren ? `${props.nodeOffsetBase / 2}px` : `${props.nodeOffsetBase}px`
        }}
        />
      </section>
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
        <div class="vir-tree-node" style={{ paddingLeft: props.node.level! * props.nodeOffsetBase + 'px' }} onClick={ handleSelect }>
          { renderLine() }
          { renderArrow() }
          { renderContent() }
        </div>
    );
    }
  }
});
