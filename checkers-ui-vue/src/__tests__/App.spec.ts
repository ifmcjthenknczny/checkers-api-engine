import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders main with NuxtPage', () => {
    const wrapper = mount(App, {
      global: {
        stubs: { NuxtPage: true },
      },
    })
    expect(wrapper.find('main').exists()).toBe(true)
  })
})
