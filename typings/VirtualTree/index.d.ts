import { PropType } from 'vue';
import { TreeNodeOptions } from "./types";
import './index.scss';
declare const _default: import("vue").DefineComponent<{
    source: {
        type: PropType<TreeNodeOptions[]>;
        default: () => never[];
    };
    showCheckbox: {
        type: BooleanConstructor;
        default: boolean;
    };
    checkStrictly: {
        type: BooleanConstructor;
        default: boolean;
    };
    size: {
        type: NumberConstructor;
        default: number;
    };
    remain: {
        type: NumberConstructor;
        default: number;
    };
    nodeOffsetBase: {
        type: NumberConstructor;
        default: number;
    };
    loadData: PropType<(node: TreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => void>;
    render: FunctionConstructor;
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("selectChange" | "checkChange")[], "selectChange" | "checkChange", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    source: TreeNodeOptions[];
    size: number;
    remain: number;
    showCheckbox: boolean;
    checkStrictly: boolean;
    nodeOffsetBase: number;
} & {
    render?: Function | undefined;
    loadData?: ((node: TreeNodeOptions, callback: (children: TreeNodeOptions[]) => void) => void) | undefined;
}>, {
    source: TreeNodeOptions[];
    size: number;
    remain: number;
    showCheckbox: boolean;
    checkStrictly: boolean;
    nodeOffsetBase: number;
}>;
export default _default;
