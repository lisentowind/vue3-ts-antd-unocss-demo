import type { ListControlBtn } from './components/upload-list.vue'
import { computed, h } from 'vue'
import CustomIcon from '../CustomIcon/CustomIcon.vue'

export const fileTypeMap = new Map([
  ['png', 'image'],
  ['jpg', 'image'],
  ['jpeg', 'image'],
  ['gif', 'image'],
  ['mp4', 'video'],
  ['mp3', 'audio'],
  ['pdf', 'pdf2'],
  ['doc', 'word'],
  ['docx', 'word'],
  ['xls', 'excel'],
  ['xlsx', 'excel'],
  ['ppt', 'powerpoint'],
  ['pptx', 'powerpoint'],
  ['txt', 'txt'],
  ['zip', 'zip'],
  ['rar', 'zip'],
  ['7z', 'zip'],
  ['tar', 'zip'],
  ['gz', 'zip'],
  ['tgz', 'zip'],
  ['bz2', 'zip'],
  ['xz', 'zip'],
])
export type FileActionEvent
  = | 'view'
    | 'download'
    | 'cancel'
    | 'reTry'
    | 'delete'

export const defaultBtn = computed<ListControlBtn[]>(() => [
  {
    id: 'view',
    icon: () =>
      h(CustomIcon, {
        icon: 'material-symbols:eye-tracking-outline-rounded',
        color: 'currentColor',
      }),
    sort: 1,
    name: '预览',
    emit: 'view',
  },
  {
    id: 'download',
    icon: () =>
      h(CustomIcon, {
        icon: 'material-symbols:download',
        color: 'currentColor',
      }),
    sort: 2,
    name: '下载',
    emit: 'download',
  },
  {
    id: 'cancel',
    icon: () =>
      h(CustomIcon, {
        icon: 'material-symbols:cancel-outline-rounded',
        color: 'currentColor',
      }),
    sort: 3,
    name: '取消',
    emit: 'cancel',
  },
  {
    id: 'reTry',
    icon: () =>
      h(CustomIcon, {
        icon: 'material-symbols:redo-rounded',
        color: 'currentColor',
      }),
    sort: 4,
    name: '重试',
    emit: 'reTry',
  },
  {
    id: 'delete',
    icon: () =>
      h(CustomIcon, {
        icon: 'material-symbols:delete-outline-rounded',
        color: 'currentColor',
      }),
    sort: 5,
    name: '删除',
    emit: 'delete',
  },
])
