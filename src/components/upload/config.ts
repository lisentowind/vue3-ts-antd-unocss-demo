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
