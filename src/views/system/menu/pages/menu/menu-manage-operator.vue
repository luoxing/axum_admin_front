<script setup lang="ts">
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiSysMenu } from '@/api/sysApis'
import IuButton from '@/components/iui/iu-button.vue'
import type { iuButtonPropsType } from '@/components/iui/iui-props'
import { hasPermission } from '@/hooks'
import type { MessageSchema } from '@/i18n'

defineOptions({ name: 'MenuManageOperator' })

const emits = defineEmits(['handAdd', 'gotoApi'])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const operateButtons = computed<iuButtonPropsType[]>(() => [
  {
    label: t('sys.add'),
    icon: h(IconPlus),
    auth: computed(() => hasPermission(ApiSysMenu.add)),
    disabled: false,
    fn: () => emits('handAdd'),
    type: 'primary',
    status: 'normal',
  },
  {
    label: '编辑API',
    icon: h(IconEdit),
    auth: computed(() => hasPermission(ApiSysMenu.edit)),
    disabled: false,
    fn: () => emits('gotoApi'),
    type: 'secondary',
    status: 'danger',
  },
])
</script>

<template>
  <a-col v-for="(item, index) in operateButtons" :key="index" :span="1.5">
    <IuButton
      :auth="item.auth"
      :label="item.label"
      :icon="item.icon"
      :disabled="item.disabled"
      :type="item.type"
      :status="item.status"
      :fn="item.fn"
    />
  </a-col>
</template>

<style scoped lang="scss">

</style>
