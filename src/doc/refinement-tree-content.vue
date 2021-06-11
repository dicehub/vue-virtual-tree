<template>
  <div class="refinement-tree-content">
    <div class="head">
      <button
        type="button"
        class="text"
        :title="node.name"
      >
          <svg class="icon rotate-0 import-geometry-tree-filename__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#C9E4FF" d="M8 14.36v-4.5l4.5-2.5v4.5L8 14.36z"></path><path fill="#79B6EF" d="M17.5 14.36v-4.5L13 7.36v4.5l4.5 2.5z"></path><path fill="#C9E4FF" d="M19.526 8.095L17 9.455v4.286a1 1 0 0 1-.553.895L12 16.859v3.217a1 1 0 0 0 1.521.854l7-4.278a1 1 0 0 0 .479-.854V8.976a1 1 0 0 0-1.474-.88z"></path><path fill="#202B38" fill-rule="evenodd" d="M18 10.053v3.688a2 2 0 0 1-1.106 1.79L13 17.476v2.6l7-4.279V8.976l-2 1.076zm-6 6.806l4.447-2.223A1 1 0 0 0 17 13.74V9.455l2.526-1.36A1 1 0 0 1 21 8.976v6.822a1 1 0 0 1-.479.854l-7 4.277A1 1 0 0 1 12 20.076V16.86z" clip-rule="evenodd"></path><path fill="#79B6EF" d="M5.393 8.246L8 9.359v4.382a1 1 0 0 0 .553.895L13 16.859v3.217a1 1 0 0 1-1.521.853l-7-4.277A1 1 0 0 1 4 15.798V9.165a1 1 0 0 1 1.393-.92z"></path><path fill="#202B38" fill-rule="evenodd" d="M7 10.02v3.721a2 2 0 0 0 1.106 1.789L12 17.477v2.6l-7-4.279V9.165l2 .855zm6 6.84l-4.447-2.224A1 1 0 0 1 8 13.74V9.36L5.393 8.246A1 1 0 0 0 4 9.166v6.632a1 1 0 0 0 .479.854l7 4.277A1 1 0 0 0 13 20.076V16.86z" clip-rule="evenodd"></path><path fill="#202B38" fill-rule="evenodd" d="M12.526 4L5.28 8.195l2.649 1.06 3.629-2.017a2 2 0 0 1 1.848-.048l4.076 1.99 2.48-1.313L12.525 4zm4.975 6.301L12.97 8.088a1 1 0 0 0-.925.025L8 10.359 4.91 9.123a1 1 0 0 1-.13-1.794l7.245-4.194a1 1 0 0 1 .962-.022l7.437 3.867a1 1 0 0 1 .006 1.771l-2.929 1.55z" clip-rule="evenodd"></path><path fill="#202B38" fill-rule="evenodd" d="M12 11.733V7.859h1v3.847l4.748 2.72-.497.867-4.728-2.708-4.727 2.708-.497-.868 4.7-2.692z" clip-rule="evenodd"></path></svg>

          <span class="text-span">{{ node.name }}</span>
      </button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'RefinementTreeContent',

  props: {
    node: {
      type: Object,
      required: true
    },
    select: {
      type: Function,
      default: () => {}
    }
  },
}
</script>

<style lang="scss" scoped>
.icon {
  width: 16px;
  height: 16px;
}

.head {
  display: flex;
  align-items: center;
  height: 23px;

  &.is-hoverable:hover,
  &.is-active {
    border-radius: 3px;

    > .text {
      font-weight: bold;
    }
  }

  &.is-readonly > .text {
    opacity: 0.7;
  }

  &.is-clickable > .text {
    cursor: pointer;
  }

  &.is-bold > .text {
    font-weight: bold;
  }

  &.is-action-hover {
    > .actions {
      display: none;
    }

    &:hover > .actions {
      display: block;
    }
  }
}

.text {
  height: 100%;
  flex-grow: 1;
  justify-content: flex-start;
  cursor: default;
  text-align: left;
  overflow: hidden;
}

.text-icon {
  --icon-size: 1.5em;

  margin-left: -0.2em;
  margin-right: 0.3em;
  flex-shrink: 0;
}

.text-span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.is-root {
    font-weight: 700;
  }
}
</style>
