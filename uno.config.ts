import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [presetWind3(), presetAttributify(), presetTypography(), presetIcons({ /* options */ })],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
