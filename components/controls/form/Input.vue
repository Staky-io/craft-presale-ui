<template>
  <!-- TODO: handle errors UI -->
  <label
    class="grid gap-12 w-full xxs:w-320"
    :class="{ [$style.hasErrors]: errors && errors.length }"
  >
    <h2 v-if="label">
      {{ label }}
    </h2>
    <div
      class="relative grid items-center after:content-[''] after:absolute after:left-0 after:top-0 after:w-full after:h-full after:border-primary after:rounded-15 after:pointer-events-none"
      :class="[
        isFocused ? 'after:border-2' : 'after:border-1',
        {
          'grid-cols-auto-1fr-auto px-24': type === 'number',
        },
      ]"
    >
      <button
        v-if="type === 'number'"
        class="grid place-items-center w-20 h-20 text-white bg-primary rounded-full"
        @click="model = Math.max(0, Number(model) - 1)"
      >
        <UtilsIcon
          name="Math/Minus"
          class="w-16 h-16"
        />
      </button>
      <textarea
        v-if="type === 'textarea'"
        v-model="model"
        :class="$style.input"
        :placeholder="placeholder"
        :rows="rows"
        :cols="cols"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <input
        v-else
        v-model="model"
        :class="[
          $style.input,
          {
            'text-center': type === 'number',
          },
        ]"
        :type="type"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
      <button
        v-if="type === 'number'"
        class="grid place-items-center w-20 h-20 text-white bg-primary rounded-full"
        @click="model = Math.min(max, Number(model) + 1)"
      >
        <UtilsIcon
          name="Math/Plus"
          class="w-16 h-16"
        />
      </button>
    </div>
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
  min: -Infinity,
  max: Infinity,
})

const isFocused = ref<boolean>(false)

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
  @apply relative px-24 py-16 text-grey-600 typo-section bg-transparent placeholder:text-grey-400;
}
</style>
