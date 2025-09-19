import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

// 引入echarts的渲染器 以及 echarts常用组件
use([
  CanvasRenderer,
  SVGRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
  TitleComponent,
])

/**
 * @description 描述 手动新增echarts组件或者插件
 * @date 2025-09-19 09:53:51
 * @author tingfeng
 *
 * @export
 * @param plugins
 */
export function addEchartsPlugins(plugins: Parameters<typeof use>[0]) {
  use(plugins)
}
