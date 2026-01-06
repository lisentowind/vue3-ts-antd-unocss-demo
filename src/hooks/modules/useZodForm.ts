import type { UnwrapRef } from 'vue'
import type { z } from 'zod'
import { cloneDeep } from 'lodash'
import { reactive, ref } from 'vue'

/**
 * @description Zod 表单校验 Hooks
 */
export function useZodForm<
  T extends z.ZodObject<any>, // 🔥 强制 schema 必须是 ZodObject
>(schema: T, initialValues: z.infer<T>) {
  type FormData = z.infer<T>
  type ReactiveFormData = UnwrapRef<FormData>

  // 保存初始值
  const _initialValues = cloneDeep(initialValues)

  // 表单数据 (reactive 返回的是 UnwrapRef 类型)
  const formData = reactive(cloneDeep(_initialValues)) as ReactiveFormData

  // 错误信息
  const errors = reactive<Record<string, string>>({})

  const isValidating = ref(false)
  const isValid = ref(false)

  // 动态 schema（支持动态更新）
  let currentSchema = schema

  /** 验证整个表单 */
  function validate() {
    isValidating.value = true

    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })

    try {
      const validatedData = currentSchema.parse(formData)
      isValid.value = true
      isValidating.value = false

      return {
        success: true as const,
        data: validatedData,
      }
    }
    catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as z.ZodError

        zodError.issues.forEach((issue) => {
          const field = issue.path[0] as string
          if (field)
            errors[field] = issue.message
        })

        isValid.value = false
        isValidating.value = false

        return {
          success: false as const,
          errors: zodError,
        }
      }

      throw error
    }
  }

  /** 验证单个字段 */
  function validateField(field: keyof FormData): boolean {
    errors[field as string] = ''

    try {
      currentSchema.parse(formData)
      return true
    }
    catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as z.ZodError
        const fieldError = zodError.issues.find(
          issue => issue.path[0] === field,
        )
        if (fieldError) {
          errors[field as string] = fieldError.message
          return false
        }
      }
      return true
    }
  }

  /** 安全验证 */
  function safeParse() {
    return currentSchema.safeParse(formData)
  }

  /** 重置 */
  function reset() {
    Object.assign(formData, cloneDeep(_initialValues))

    Object.keys(errors).forEach((key) => {
      delete errors[key]
    })

    isValid.value = false
  }

  /** 设置多个字段 */
  function setValues(values: Partial<FormData>, shouldValidate = false) {
    Object.assign(formData, values)
    if (shouldValidate)
      validate()
  }

  /** 设置单个字段 */
  function setFieldValue<K extends keyof ReactiveFormData>(
    field: K,
    value: ReactiveFormData[K],
    shouldValidate = false,
  ) {
    formData[field] = value
    if (shouldValidate)
      validateField(field as keyof FormData)
  }

  /** 获取字段错误 */
  function getFieldError(field: keyof FormData): string {
    return errors[field as string] || ''
  }

  /** 清空所有错误 */
  function clearErrors() {
    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })
  }

  /** 清空单个字段错误 */
  function clearFieldError(field: keyof FormData) {
    errors[field as string] = ''
  }

  /** 字段是否有错误 */
  function hasFieldError(field: keyof FormData): boolean {
    return !!errors[field as string]
  }

  /** 是否为必填字段 */
  function isFieldRequired(field: keyof FormData): boolean {
    try {
      const testData = { ...formData, [field]: undefined }
      currentSchema.parse(testData)
      return false
    }
    catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as z.ZodError
        return zodError.issues.some(
          issue =>
            issue.path[0] === field
            && (issue.code === 'invalid_type'
              || issue.message.includes('Required')),
        )
      }
      return false
    }
  }

  /** AntD 表单规则 */
  function getFieldRules(field: keyof FormData) {
    const required = isFieldRequired(field)
    return required ? [{ required: true }] : []
  }

  /** ✔ 获取全表所有规则（挂载到 <AForm>） */
  const allRules = reactive<Record<string, any[]>>({})
  Object.keys(initialValues).forEach((key) => {
    allRules[key] = getFieldRules(key as keyof FormData)
  })

  /** 更新 schema */
  function updateSchema(newSchema: T) {
    currentSchema = newSchema
    // 清空错误信息
    Object.keys(errors).forEach((key) => {
      delete errors[key]
    })
    // 更新 allRules
    Object.keys(initialValues).forEach((key) => {
      allRules[key] = getFieldRules(key as keyof FormData)
    })
  }

  return {
    formData,
    errors,
    isValidating,
    isValid,
    allRules,

    validate,
    validateField,
    safeParse,

    reset,
    setValues,
    setFieldValue,

    getFieldError,
    clearErrors,
    clearFieldError,
    hasFieldError,

    isFieldRequired,
    getFieldRules,
    updateSchema,
  }
}
