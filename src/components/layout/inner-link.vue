<script lang="ts">
import { defineOptions, h } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'InnerLink' })

export default {
  setup() {
    const route = useRoute()
    const link = route.meta.link
    if (link === '')
      return '404'

    const url = link
    const height = `${document.documentElement.clientHeight - 94.5}px`
    const style = { height }

    // 返回渲染函数
    return () =>
      h(
        'div',
        {
          style,
        },
        h('iframe', {
          src: url,
          frameborder: 'no',
          width: '100%',
          height: '100%',
          scrolling: 'auto',
        }),
      )
  },
}
</script>
