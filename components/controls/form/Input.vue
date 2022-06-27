<template>
  <!-- TODO: handle errors UI -->
  <label
    class="grid gap-12 w-full xxs:w-320"
    :class="{ [$style.hasErrors]: errors && errors.length }"
  >
    <h2>
      {{ label }}
    </h2>
    <textarea
      v-if="type === 'textarea'"
      v-model="model"
      :class="$style.input"
      :placeholder="placeholder"
      :rows="rows"
      :cols="cols"
    />
    <input
      v-else
      v-model="model"
      :class="$style.input"
      :type="type"
      :placeholder="placeholder"
      :min="min"
      :max="max"
    >
  </label>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'

type FormType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'textarea'
  | 'time'
  | 'url'
  | 'week'

type ModelValue = string | number

type Emits = {
  (event: 'update:modelValue', value: ModelValue): void
}

type Props = {
  modelValue?: ModelValue
  label?: string
  type?: FormType
  placeholder?: string
  errors: ErrorObject[]
  rows?: number
  cols?: number
  min?: number
  max?: number
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  type: 'text',
  label: null,
  placeholder: null,
  rows: 8,
  cols: null,
  min: null,
  max: null,
})

const model = computed<ModelValue>({
  get() {
    return props.modelValue
  },
  set(value) {
    switch (props.type) {
      case 'number':
        emit('update:modelValue', Number(value))
        break
      default:
        emit('update:modelValue', value)
        break
    }
  },
})
</script>

<style lang="scss" module>
.hasErrors .input {
  @apply border-primary;
}

.input {
  @apply px-12 py-8 bg-transparent border-1;
}
</style>
