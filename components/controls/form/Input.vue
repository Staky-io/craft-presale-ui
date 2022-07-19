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
      class="relative grid items-center bg-grey-000 rounded-15 border-1 border-primary transition-border duration-100"
      :class="[
        isFocused ? 'border-opacity-100' : 'border-opacity-0',
        {
          'grid-cols-auto-1fr-auto px-24': type === 'number',
        },
      ]"
    >
      <button
        v-if="type === 'number'"
        ref="buttonMinus"
        class="grid place-items-center w-20 h-20 text-white bg-primary rounded-full"
        @click="updateModel(Math.max(0, Number(model) - 1))"
      >
        <UtilsIcon
          name="Math/Minus"
          class="w-16 h-16"
        />
      </button>
      <textarea
        v-if="type === 'textarea'"
        ref="input"
        v-model="model"
        :class="$style.input"
        :placeholder="placeholder"
        :rows="rows"
        :cols="cols"
        @focus="isFocused = true"
        @blur="onBlur"
      />
      <input
        v-else
        ref="input"
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
        @blur="onBlur"
      >
      <button
        v-if="type === 'number'"
        ref="buttonPlus"
        class="grid place-items-center w-20 h-20 text-white bg-primary rounded-full"
        @click="updateModel(Math.min(max, Number(model) + 1))"
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

const input = ref<HTMLElement | null>(null)
const buttonMinus = ref<EventTarget | null>(null)
const buttonPlus = ref<EventTarget | null>(null)
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

const updateModel = (value: number): void => {
  model.value = value
  input.value.focus()
}

const onBlur = (event: FocusEvent) => {
  if (![buttonMinus.value, buttonPlus.value].includes(event.relatedTarget)) isFocused.value = false
}
</script>

<style lang="scss" module>
.hasErrors .input {
  @apply border-primary;
}

.input {
  @apply relative px-24 py-16 text-grey-600 typo-section bg-transparent placeholder:text-grey-400;
}
</style>
