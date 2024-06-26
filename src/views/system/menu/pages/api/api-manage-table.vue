<script lang="ts" setup>
import { type PropType, computed, h, ref } from 'vue'
import { type TableColumnData, type TableRowSelection, Tag } from '@arco-design/web-vue'
import DictTag from '@/components/common/dict-tag.vue'
import { dictKey, type dictUse } from '@/types/system/dict'
import { hasPermission, parseTime } from '@/hooks'
import { ApiSysMenu } from '@/api/sysApis'
import type { menu } from '@/types/system/menu'

defineOptions({ name: 'ApiManageTable' })
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits([
  'handleAdd',
  'handleUpdate',
  'handleAddByCopy',
  'handleDelete',
  'handleSelectionChangeFn',
])
const rowSelection = ref<TableRowSelection>({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
})

const tableData = defineModel<menu[] | null>('tableData', { required: true })

// 表格列属性
const columns = computed<TableColumnData[]>(() => [
  {
    title: '菜单名称',
    dataIndex: 'menu_name',
    ellipsis: true,
    tooltip: true,
    width: 200,
    align: 'left',
  },
  // {
  //   title: '图标',
  //   align: 'center',
  //   width: 100,
  //   render: ({ record }) => h(IuiIcon, {
  //     name: record.icon,
  //   }),
  // },
  {
    title: '排序',
    dataIndex: 'order_sort',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '唯一标识',
    dataIndex: 'api',
    align: 'center',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  // {
  //   title: '组件路径',
  //   dataIndex: 'component',
  //   align: 'center',
  //   width: 120,
  //   ellipsis: true,
  //   tooltip: true,
  // },
  {
    title: '请求方法',
    align: 'center',
    width: 100,
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysApiMethod],
      value: record.method,
    }),
  },
  {
    title: '数据权限',
    align: 'center',
    width: 100,
    render: ({ record }) => record.method === 'GET'
      ? h(DictTag, {
        options: props.dicts[dictKey.sysNormalDisable],
        value: record.data_scope,
      })
      : h(Tag, {
        color: 'red',
      }, () => 'NOT SUPPORT'),
  },
  {
    title: '状态',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysNormalDisable],
      value: record.status,
    }),
  },
  {
    title: '显示',
    width: 100,
    align: 'center',
    render: ({ record }) => h(DictTag, {
      options: props.dicts[dictKey.sysShowHide],
      value: record.visible,
    }),
  },
  {
    title: '创建时间',
    width: 180,
    align: 'center',
    render: ({ record }) => parseTime(record.created_at),
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 200,
    fixed: 'right',
    align: 'center',
  },
])

function handleSelectionChange(keys: (string | number)[]) {
  return emits('handleSelectionChangeFn', keys, tableData.value, 'id', 'menu_name')
}
</script>

<template>
  <a-skeleton v-if="isLoading" :animation="true">
    <a-space direction="vertical" :style="{ width: '100%' }" size="large">
      <a-skeleton-line :rows="10" />
    </a-space>
  </a-skeleton>
  <a-table
    v-else
    :columns="columns"
    :data="tableData || []"
    :row-selection="rowSelection"
    row-key="id"
    :scroll="{ minWidth: 800 }"
    :pagination="false"
    @selection-change="handleSelectionChange"
  >
    <template #operation="{ record }">
      <a-space>
        <a-tooltip
          v-if="hasPermission(ApiSysMenu.edit)"
          content="编辑"
        >
          <a-button
            type="text"
            shape="circle"
            status="success"
            @click="emits('handleUpdate', record)"
          >
            <IconEdit class="cursor-pointer" />
          </a-button>
        </a-tooltip>
        <a-tooltip
          v-if="hasPermission(ApiSysMenu.edit)"
          content="复制新增"
        >
          <a-button
            type="text"
            shape="circle"
            status="danger"
            @click="emits('handleAddByCopy', record, true)"
          >
            <IconCopy class="cursor-pointer" />
          </a-button>
        </a-tooltip>
        <a-tooltip
          v-if="hasPermission(ApiSysMenu.delete)"
          content="删除"
        >
          <a-button
            type="text"
            shape="circle"
            status="danger"
            @click="emits('handleDelete', record)"
          >
            <IconDelete class="cursor-pointer" />
          </a-button>
        </a-tooltip>
      </a-space>
    </template>
  </a-table>
</template>
