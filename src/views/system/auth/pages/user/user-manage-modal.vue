<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import { type PropType, computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ErrorFlag } from '@/api/apis'
import { ApiSysPost, ApiSysRole, ApiSysUser } from '@/api/sysApis'
import IuModal from '@/components/iui/iu-modal.vue'
import { useGet, usePost, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { FormItemType, type IuFormField, type SelectOptionInterface } from '@/types/base/iu-form'
import type { dept } from '@/types/system/dept'
import { dictKey, type dictUse } from '@/types/system/dict'
import type { postList } from '@/types/system/post'
import type { roleList } from '@/types/system/role'
import type { userInfo, userInformation } from '@/types/system/userInformation'

defineOptions({ name: 'UserManageModal' })

const props = defineProps({
  deptTree: {
    type: Array as PropType<dept[]>,
    required: true,
  },
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
  dicts: {
    type: Object as PropType<Record<string, dictUse[]>>,
    required: true,
  },
})

const emits = defineEmits(['getList'])

const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const iuModalRef = ref<InstanceType<typeof IuModal>>()

const modalIcon = ref()
const open = ref(false)
const title = ref('')
const form = ref<userInformation>({})

const roleOptions = ref<SelectOptionData[]>([])
const postOptions = ref<SelectOptionData[]>([])

const modalFormItems = ref<IuFormField[]>([])
const addFormItems = ref<IuFormField[]>([
  {
    field: 'user_name',
    label: '用户名称',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入用户名称',
    },
    rule: [
      { required: true, message: '用户名称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '用户名称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'user_password',
    label: '用户密码',
    type: FormItemType.input,
    input: {
      allowClear: true,
      type: 'password',
      placeholder: '请输入用户密码',
    },
    rule: [
      { required: true, message: '用户密码不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '用户密码2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
])
const editFormItems = ref<IuFormField[]>([
  {
    field: 'user_nickname',
    label: '用户昵称',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入用户昵称',
    },
    rule: [
      { required: true, message: '用户昵称不能为空' },
      { type: 'string', minLength: 2, maxLength: 20, message: '用户昵称2~20个字符' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'sex',
    label: '用户性别',
    type: FormItemType.radioGroup,
    radioGroup: {
      placeholder: '请输入用户性别',
      options: computed(() => props.dicts[dictKey.sysUserSex]),
    },
    rule: [
      { required: true, message: '用户性别不能为空' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'dept_ids',
    label: '用户部门',
    type: FormItemType.treeSelect,
    treeSelect: {
      placeholder: '请选择用户部门',
      data: props.deptTree,
      fieldNames: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: true,
      maxTagCount: 1,
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
      {
        validator: () => {
          iuModalRef.value?.validateModalField('dept_id')
        },
      },
    ],
    validateTrigger: ['blur', 'change'],
  },
  {
    field: 'dept_id',
    label: '激活部门',
    type: FormItemType.treeSelect,
    treeSelect: {
      placeholder: '请选择激活部门',
      data: props.deptTree,
      fieldNames: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: false,
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
      {
        validator: (v, cb) => {
          if (form.value.dept_ids?.includes(v))
            cb()
          else
            cb('激活部门不在用户部门内')
        },
      },
    ],
    validateTrigger: ['blur', 'change'],
  },
  {
    field: 'role_ids',
    label: '用户角色',
    type: FormItemType.select,
    select: {
      placeholder: '请选择用户角色',
      options: roleOptions,
      fieldNames: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: true,
      maxTagCount: 1,
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
      {
        validator: () => {
          iuModalRef.value?.validateModalField('role_id')
        },
      },
    ],
    validateTrigger: ['blur', 'change'],
  },
  {
    field: 'role_id',
    label: '激活角色',
    type: FormItemType.select,
    select: {
      placeholder: '请选择激活角色',
      options: roleOptions,
      fieldNames: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: false,
    },
    rule: [
      { required: true, message: '用户部门不能为空' },
      {
        validator: (v, cb) => {
          if (form.value.role_ids?.includes(v))
            cb()
          else
            cb('激活角色不在用户角色内')
        },
      },
    ],
    validateTrigger: ['blur', 'change'],
  },
  {
    field: 'phone_num',
    label: '手机号码',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入手机号码',
    },
  },
  {
    field: 'email',
    label: '用户邮箱',
    type: FormItemType.input,
    input: {
      allowClear: true,
      placeholder: '请输入用户邮箱',
    },
    rule: [
      { required: false, type: 'email', message: '请输入正确的邮箱地址' },
    ],
  },
  {
    field: 'post_ids',
    label: '用户岗位',
    type: FormItemType.select,
    select: {
      placeholder: '请选择用户岗位',
      options: postOptions,
      fieldNames: {
        title: 'dept_name',
        key: 'dept_id',
        children: 'children',
      },
      allowClear: true,
      allowSearch: true,
      multiple: true,
      maxTagCount: 1,
    },
    rule: [
      { required: true, message: '用户岗位不能为空' },
    ],
    fullScreenCol: 2,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
    validateTrigger: 'blur',
  },
  {
    field: 'is_admin',
    label: '后台用户',
    type: FormItemType.radioGroup,
    radioGroup: {
      options: computed(() => props.dicts[dictKey.isAdmin]),
    },
    rule: [
      { required: true, message: '后台用户必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'user_status',
    label: '用户状态',
    type: FormItemType.radioGroup,
    radioGroup: {
      options: computed(() => props.dicts[dictKey.sysNormalDisable]),
    },
    rule: [
      { required: true, message: '用户状态必须选择' },
    ],
    validateTrigger: 'blur',
  },
  {
    field: 'remark',
    label: '备注',
    type: FormItemType.textarea,
    textArea: {
      autoSize: true,
      placeholder: '请输入字典备注',
    },
    fullScreenCol: 2,
    defaultCol: 2,
    fullScreenIsOnlyOne: true,
    defaultIsOnlyOne: true,
  },
])

function handleAdd() {
  modalIcon.value = h(IconPlus)
  open.value = true
  form.value = {
    is_admin: '1',
    user_status: '1',
    sex: '2',
  }
  modalFormItems.value = [...addFormItems.value, ...editFormItems.value]
  title.value = `${t('sys.add')}用户`
}
async function handleUpdate(row?: userInformation) {
  modalIcon.value = h(IconEdit)
  modalFormItems.value = [...editFormItems.value]
  open.value = true
  const user_id = row?.id || props.ids[0]
  const { data, execute } = useGet<userInfo>(ApiSysUser.getById, { user_id })
  await execute()
  form.value = data.value?.user_info as userInformation
  form.value.post_ids = data.value?.post_ids
  form.value.role_ids = data.value?.role_ids
  form.value.dept_ids = data.value?.dept_ids
  title.value = `${t('sys.update')}用户:${form.value?.user_name}`
}
async function submitForm() {
  if (form.value.id !== undefined) {
    const { execute, data } = usePut(ApiSysUser.edit, form)

    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.TipUpdateSuccess'))
  }
  else {
    const { execute, data } = usePost(ApiSysUser.add, form)
    await execute()
    if (data.value === ErrorFlag)
      return
    Message.success(t('sys.tipAddSuccess'))
  }
  open.value = false
  emits('getList')
}
// 选项初始化
async function optionsInit() {
  const queryParams = {
    page_num: 1,
    page_size: Number.MAX_SAFE_INTEGER,
  }
  const { data: b, execute: be } = useGet<roleList>(
    ApiSysRole.getList,
    queryParams,
  )
  const { data: c, execute: ce } = useGet<postList>(
    ApiSysPost.getList,
    queryParams,
  )
  await Promise.all([be(), ce()])

  const _roleOptions: SelectOptionInterface[] = []
  const _postOptions: SelectOptionInterface[] = []

  b.value?.list!.forEach((it) => {
    const item: SelectOptionInterface = {
      key: it.role_id!,
      label: it.role_name!,
      value: it.role_id!,
      disabled: it.status === '0',
    }
    _roleOptions.push(item)
  })
  c.value?.list!.forEach((it) => {
    const item: SelectOptionInterface = {
      key: it.post_id!,
      label: it.post_name!,
      value: it.post_id!,
      disabled: it.status === '0',
    }
    _postOptions.push(item)
  })

  roleOptions.value = _roleOptions
  postOptions.value = _postOptions
}

optionsInit()
defineExpose({ handleAdd, handleUpdate })
</script>

<template>
  <IuModal
    ref="iuModalRef"
    v-model:visible="open"
    v-model:form-value="form"
    :form-items="modalFormItems"
    :icon="modalIcon"
    :title="title"
    :item-width="250"
    :default-col="2"
    @handle-ok="submitForm"
  />
</template>

<style scoped lang="scss">

</style>
