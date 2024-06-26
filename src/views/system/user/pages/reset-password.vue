<script lang="ts" setup>
import md5 from 'blueimp-md5'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type FieldRule, type FormInstance, Message } from '@arco-design/web-vue'
import { ApiSysUser, ErrorFlag } from '@/api/apis'
import { TabAction } from '@/components/layout/tab-bar/useTabBar'
import { useFormUtil, usePut } from '@/hooks'
import type { MessageSchema } from '@/i18n'
import { router } from '@/router'
import { useTabBarStore, useUserStore } from '@/stores'

defineOptions({ name: 'ResetPassword' })

const { formValidate } = useFormUtil()
const userStore = useUserStore()
const tabBarStore = useTabBarStore()
const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })

const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
})

const pwdRef = ref<FormInstance>()

function equalToPassword(value: any, cb: any) {
  if (user.newPassword !== value)
    cb(new Error('两次输入的密码不一致'))
  else
    cb()
}
const rules = ref<{ [key: string]: FieldRule[] }>({
  oldPassword: [{ required: true, message: '旧密码不能为空' }],
  newPassword: [
    { required: true, message: '新密码不能为空' },
    { minLength: 6, maxLength: 20, message: '长度在 6 到 20 个字符' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空' },
    { required: true, validator: equalToPassword },
  ],
})

/** 提交按钮 */
async function submit() {
  if (!(await formValidate(pwdRef.value)))
    return
  const v = {
    old_passwd: md5(user.oldPassword!),
    new_passwd: md5(user.newPassword!),
  }
  const { execute, data } = usePut(ApiSysUser.updatePwd, v)
  await execute()
  if (data.value === ErrorFlag)
    return
  Message.success('修改成功,请重新登录,秒钟后将自动退出并转入登录界面')
  await userStore.logOut()
  setTimeout(
    () => router.push(`/login?redirect=${router.currentRoute.value.fullPath}`),
    1000,
  )
}
/** 关闭按钮 */
function handleClose() {
  // 路由回退
  router.back()
  // 关闭当前标签
  tabBarStore.tabActionSelect(tabBarStore.getCurrentRouteTag(), TabAction.current)
}
</script>

<template>
  <a-form ref="pwdRef" :model="user" :rules="rules" auto-label-width>
    <a-form-item :label="t('sys.user.oldPassword')" field="oldPassword" validate-trigger="blur">
      <a-input
        v-model="user.oldPassword"
        :placeholder="t('sys.user.oldPassword')"
        type="password"
        show-password
      />
    </a-form-item>
    <a-form-item :label="t('sys.user.newPassword')" field="newPassword" validate-trigger="blur">
      <a-input
        v-model="user.newPassword"
        :placeholder="t('sys.user.newPassword')"
        type="password"
        show-password
      />
    </a-form-item>
    <a-form-item :label="t('sys.user.confirmPassword')" field="confirmPassword" validate-trigger="blur">
      <a-input
        v-model="user.confirmPassword"
        :placeholder="t('sys.user.confirmPassword')"
        type="password"
        show-password
      />
    </a-form-item>
    <div class="flex justify-around m-t-30px">
      <a-button type="primary" @click="submit">
        {{ t('sys.com.save') }}
      </a-button>
      <a-button status="danger" @click="handleClose">
        {{ t('sys.com.close') }}
      </a-button>
    </div>
  </a-form>
</template>
