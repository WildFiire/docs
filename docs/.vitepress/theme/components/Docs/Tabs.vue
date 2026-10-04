<script lang="ts">
import { defineComponent, h, ref, useId, Fragment, type VNode } from 'vue';

export default defineComponent({
  name: 'Tabs',
  setup(_, { slots }) {
    const active = ref(0);
    const id = useId();

    const flatten = (nodes: VNode[]): VNode[] =>
      nodes.flatMap((node) =>
        node.type === Fragment
          ? flatten(node.children as VNode[])
          : node.props?.label
            ? [node]
            : [],
      );

    return () => {
      const tabs = flatten(slots.default?.() || []);

      function keys(event: KeyboardEvent, index: number) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        active.value =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        document.getElementById(`${id}-tab-${active.value}`)?.focus();
      }

      return h('div', { class: 'tabs-wrapper' }, [
        h(
          'div',
          { class: 'tabs-list', role: 'tablist' },
          tabs.map((tab, index) =>
            h(
              'button',
              {
                type: 'button',
                class: 'tab-trigger',
                role: 'tab',
                id: `${id}-tab-${index}`,
                'aria-controls': `${id}-panel-${index}`,
                'aria-selected': active.value === index,
                'data-active': active.value === index ? 'true' : 'false',
                tabindex: active.value === index ? 0 : -1,
                onClick: () => (active.value = index),
                onKeydown: (e: KeyboardEvent) => keys(e, index),
              },
              tab.props.label,
            ),
          ),
        ),
        ...tabs.map((tab, index) =>
          h(
            'div',
            {
              class: 'tab-panel',
              role: 'tabpanel',
              id: `${id}-panel-${index}`,
              'aria-labelledby': `${id}-tab-${index}`,
              'data-active': active.value === index ? 'true' : 'false',
              tabindex: 0,
            },
            [h('div', { class: 'tab-content' }, [tab])],
          ),
        ),
      ]);
    };
  },
});
</script>
